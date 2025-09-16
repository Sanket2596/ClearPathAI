"""
MCP Server Implementation

This module implements the MCP server that provides standardized tool access
for AI agents and external clients.
"""

import asyncio
import json
import logging
from typing import Dict, Any, List, Optional, Union
from datetime import datetime
from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
import uvicorn

from .config import MCPConfig
from .tools import ToolRegistry, ToolResult, MCPTool

logger = logging.getLogger(__name__)


class MCPRequest(BaseModel):
    """MCP request model"""
    method: str = Field(..., description="MCP method to call")
    params: Dict[str, Any] = Field(default_factory=dict, description="Method parameters")
    id: Optional[str] = Field(None, description="Request ID for correlation")


class MCPResponse(BaseModel):
    """MCP response model"""
    result: Optional[Any] = Field(None, description="Response result")
    error: Optional[Dict[str, Any]] = Field(None, description="Error information")
    id: Optional[str] = Field(None, description="Request ID for correlation")


class ToolExecutionRequest(BaseModel):
    """Tool execution request model"""
    tool_name: str = Field(..., description="Name of the tool to execute")
    parameters: Dict[str, Any] = Field(default_factory=dict, description="Tool parameters")


class ToolExecutionResponse(BaseModel):
    """Tool execution response model"""
    success: bool = Field(..., description="Whether the tool execution was successful")
    data: Any = Field(None, description="Tool execution result data")
    error: Optional[str] = Field(None, description="Error message if execution failed")
    execution_time: float = Field(..., description="Tool execution time in seconds")
    metadata: Dict[str, Any] = Field(default_factory=dict, description="Additional metadata")


class MCPServer:
    """MCP Server for tool management and execution"""
    
    def __init__(self, config: MCPConfig):
        self.config = config
        self.tool_registry = ToolRegistry(config)
        self.app = FastAPI(
            title=config.server_name,
            version=config.server_version,
            description="MCP Server for ClearPath AI Agent Service"
        )
        self._setup_routes()
        self._setup_middleware()
    
    def _setup_middleware(self):
        """Setup middleware for the MCP server"""
        
        @self.app.middleware("http")
        async def logging_middleware(request: Request, call_next):
            start_time = datetime.now()
            response = await call_next(request)
            process_time = (datetime.now() - start_time).total_seconds()
            
            logger.info(
                f"MCP Request: {request.method} {request.url.path} - "
                f"Status: {response.status_code} - Time: {process_time:.3f}s"
            )
            
            return response
    
    def _setup_routes(self):
        """Setup API routes for the MCP server"""
        
        @self.app.get("/")
        async def root():
            return {
                "name": self.config.server_name,
                "version": self.config.server_version,
                "status": "operational",
                "tools_count": len(self.tool_registry.tools)
            }
        
        @self.app.get("/health")
        async def health_check():
            """Health check endpoint"""
            try:
                # Check tool registry health
                tools_status = {}
                for tool_name, tool in self.tool_registry.tools.items():
                    tools_status[tool_name] = {
                        "enabled": tool.config.enabled,
                        "timeout": tool.config.timeout
                    }
                
                return {
                    "status": "healthy",
                    "server": self.config.server_name,
                    "version": self.config.server_version,
                    "tools": tools_status,
                    "timestamp": datetime.now().isoformat()
                }
            except Exception as e:
                logger.error(f"Health check failed: {e}")
                return {
                    "status": "unhealthy",
                    "error": str(e),
                    "timestamp": datetime.now().isoformat()
                }
        
        @self.app.get("/tools")
        async def list_tools():
            """List all available tools"""
            try:
                tools_info = self.tool_registry.list_tools()
                return {
                    "tools": tools_info,
                    "count": len(tools_info),
                    "timestamp": datetime.now().isoformat()
                }
            except Exception as e:
                logger.error(f"Failed to list tools: {e}")
                raise HTTPException(status_code=500, detail=str(e))
        
        @self.app.get("/tools/{tool_name}")
        async def get_tool_info(tool_name: str):
            """Get information about a specific tool"""
            try:
                tool = self.tool_registry.get_tool(tool_name)
                if not tool:
                    raise HTTPException(status_code=404, detail=f"Tool '{tool_name}' not found")
                
                return tool.get_info()
            except HTTPException:
                raise
            except Exception as e:
                logger.error(f"Failed to get tool info for {tool_name}: {e}")
                raise HTTPException(status_code=500, detail=str(e))
        
        @self.app.post("/tools/{tool_name}/execute")
        async def execute_tool(tool_name: str, request: ToolExecutionRequest):
            """Execute a specific tool"""
            try:
                if tool_name != request.tool_name:
                    raise HTTPException(
                        status_code=400, 
                        detail="Tool name in URL must match tool_name in request body"
                    )
                
                # Execute the tool
                result = await self.tool_registry.execute_tool_async(
                    tool_name, 
                    **request.parameters
                )
                
                response = ToolExecutionResponse(
                    success=result.success,
                    data=result.data,
                    error=result.error,
                    execution_time=result.execution_time,
                    metadata=result.metadata or {}
                )
                
                return response
                
            except HTTPException:
                raise
            except Exception as e:
                logger.error(f"Failed to execute tool {tool_name}: {e}")
                raise HTTPException(status_code=500, detail=str(e))
        
        @self.app.post("/mcp")
        async def mcp_endpoint(request: MCPRequest):
            """Main MCP endpoint for standardized protocol communication"""
            try:
                result = await self._handle_mcp_request(request)
                return MCPResponse(result=result, id=request.id)
                
            except Exception as e:
                logger.error(f"MCP request failed: {e}")
                return MCPResponse(
                    error={
                        "code": -32603,
                        "message": "Internal error",
                        "data": str(e)
                    },
                    id=request.id
                )
    
    async def _handle_mcp_request(self, request: MCPRequest) -> Any:
        """Handle MCP protocol requests"""
        method = request.method
        params = request.params or {}
        
        if method == "tools/list":
            return {
                "tools": self.tool_registry.list_tools()
            }
        
        elif method == "tools/call":
            tool_name = params.get("name")
            tool_params = params.get("arguments", {})
            
            if not tool_name:
                raise ValueError("Tool name is required")
            
            result = await self.tool_registry.execute_tool_async(tool_name, **tool_params)
            
            return {
                "content": [
                    {
                        "type": "text",
                        "text": json.dumps(result.data) if result.success else result.error
                    }
                ],
                "isError": not result.success
            }
        
        elif method == "tools/get_schema":
            tool_name = params.get("name")
            
            if not tool_name:
                raise ValueError("Tool name is required")
            
            tool = self.tool_registry.get_tool(tool_name)
            if not tool:
                raise ValueError(f"Tool '{tool_name}' not found")
            
            return {
                "name": tool_name,
                "schema": tool.get_schema()
            }
        
        else:
            raise ValueError(f"Unknown MCP method: {method}")
    
    async def start(self):
        """Start the MCP server"""
        logger.info(f"Starting MCP Server on {self.config.server_host}:{self.config.server_port}")
        
        config = uvicorn.Config(
            self.app,
            host=self.config.server_host,
            port=self.config.server_port,
            log_level="info"
        )
        
        server = uvicorn.Server(config)
        await server.serve()
    
    def get_app(self) -> FastAPI:
        """Get the FastAPI app instance"""
        return self.app


# Global MCP server instance
_mcp_server: Optional[MCPServer] = None


def get_mcp_server() -> MCPServer:
    """Get the global MCP server instance"""
    global _mcp_server
    if _mcp_server is None:
        config = MCPConfig()
        _mcp_server = MCPServer(config)
    return _mcp_server


def initialize_mcp_server(config: Optional[MCPConfig] = None) -> MCPServer:
    """Initialize the MCP server with given configuration"""
    global _mcp_server
    if config is None:
        config = MCPConfig()
    
    _mcp_server = MCPServer(config)
    return _mcp_server


async def start_mcp_server(config: Optional[MCPConfig] = None):
    """Start the MCP server"""
    server = initialize_mcp_server(config)
    await server.start()


if __name__ == "__main__":
    # Run the MCP server directly
    config = MCPConfig()
    server = MCPServer(config)
    asyncio.run(server.start())
