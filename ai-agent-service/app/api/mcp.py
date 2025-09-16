"""
MCP API Endpoints

This module provides API endpoints for MCP server integration
and tool management.
"""

import asyncio
import logging
from typing import Dict, Any, List, Optional
from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.database import get_db
from app.mcp.server import get_mcp_server
from app.mcp.tools import ToolResult

logger = logging.getLogger(__name__)

router = APIRouter()


class ToolExecutionRequest(BaseModel):
    """Request model for tool execution"""
    tool_name: str = Field(..., description="Name of the tool to execute")
    parameters: Dict[str, Any] = Field(default_factory=dict, description="Tool parameters")


class ToolExecutionResponse(BaseModel):
    """Response model for tool execution"""
    success: bool = Field(..., description="Whether the tool execution was successful")
    data: Any = Field(None, description="Tool execution result data")
    error: Optional[str] = Field(None, description="Error message if execution failed")
    execution_time: float = Field(..., description="Tool execution time in seconds")
    metadata: Dict[str, Any] = Field(default_factory=dict, description="Additional metadata")


class MCPStatusResponse(BaseModel):
    """Response model for MCP server status"""
    status: str = Field(..., description="MCP server status")
    tools_count: int = Field(..., description="Number of available tools")
    tools: List[str] = Field(..., description="List of available tool names")
    server_info: Dict[str, Any] = Field(..., description="Server information")


@router.get("/status")
async def get_mcp_status(db: Session = Depends(get_db)) -> MCPStatusResponse:
    """Get MCP server status and available tools"""
    try:
        mcp_server = get_mcp_server()
        tools_info = mcp_server.tool_registry.list_tools()
        
        return MCPStatusResponse(
            status="operational",
            tools_count=len(tools_info),
            tools=list(tools_info.keys()),
            server_info={
                "name": mcp_server.config.server_name,
                "version": mcp_server.config.server_version,
                "host": mcp_server.config.server_host,
                "port": mcp_server.config.server_port
            }
        )
    except Exception as e:
        logger.error(f"Failed to get MCP status: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/tools")
async def list_mcp_tools(db: Session = Depends(get_db)) -> Dict[str, Any]:
    """List all available MCP tools"""
    try:
        mcp_server = get_mcp_server()
        tools_info = mcp_server.tool_registry.list_tools()
        
        return {
            "tools": tools_info,
            "count": len(tools_info),
            "status": "success"
        }
    except Exception as e:
        logger.error(f"Failed to list MCP tools: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/tools/{tool_name}")
async def get_tool_info(tool_name: str, db: Session = Depends(get_db)) -> Dict[str, Any]:
    """Get information about a specific tool"""
    try:
        mcp_server = get_mcp_server()
        tool = mcp_server.tool_registry.get_tool(tool_name)
        
        if not tool:
            raise HTTPException(status_code=404, detail=f"Tool '{tool_name}' not found")
        
        return tool.get_info()
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get tool info for {tool_name}: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/tools/{tool_name}/execute")
async def execute_tool(
    tool_name: str, 
    request: ToolExecutionRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
) -> ToolExecutionResponse:
    """Execute a specific MCP tool"""
    try:
        if tool_name != request.tool_name:
            raise HTTPException(
                status_code=400, 
                detail="Tool name in URL must match tool_name in request body"
            )
        
        mcp_server = get_mcp_server()
        
        # Execute the tool
        result = await mcp_server.tool_registry.execute_tool_async(
            tool_name, 
            **request.parameters
        )
        
        # Log tool execution for analytics
        background_tasks.add_task(
            log_tool_execution,
            tool_name=tool_name,
            success=result.success,
            execution_time=result.execution_time,
            db=db
        )
        
        return ToolExecutionResponse(
            success=result.success,
            data=result.data,
            error=result.error,
            execution_time=result.execution_time,
            metadata=result.metadata or {}
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to execute tool {tool_name}: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/tools/batch-execute")
async def batch_execute_tools(
    requests: List[ToolExecutionRequest],
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
) -> List[ToolExecutionResponse]:
    """Execute multiple tools in batch"""
    try:
        mcp_server = get_mcp_server()
        results = []
        
        # Execute tools concurrently
        tasks = []
        for request in requests:
            task = mcp_server.tool_registry.execute_tool_async(
                request.tool_name,
                **request.parameters
            )
            tasks.append(task)
        
        # Wait for all tasks to complete
        tool_results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Process results
        for i, result in enumerate(tool_results):
            if isinstance(result, Exception):
                results.append(ToolExecutionResponse(
                    success=False,
                    data=None,
                    error=str(result),
                    execution_time=0.0,
                    metadata={"tool_name": requests[i].tool_name}
                ))
            else:
                # Log tool execution for analytics
                background_tasks.add_task(
                    log_tool_execution,
                    tool_name=requests[i].tool_name,
                    success=result.success,
                    execution_time=result.execution_time,
                    db=db
                )
                
                results.append(ToolExecutionResponse(
                    success=result.success,
                    data=result.data,
                    error=result.error,
                    execution_time=result.execution_time,
                    metadata=result.metadata or {}
                ))
        
        return results
        
    except Exception as e:
        logger.error(f"Failed to execute batch tools: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/health")
async def mcp_health_check(db: Session = Depends(get_db)) -> Dict[str, Any]:
    """Health check for MCP server and tools"""
    try:
        mcp_server = get_mcp_server()
        
        # Check tool registry health
        tools_status = {}
        for tool_name, tool in mcp_server.tool_registry.tools.items():
            tools_status[tool_name] = {
                "enabled": tool.config.enabled,
                "timeout": tool.config.timeout,
                "status": "healthy"
            }
        
        return {
            "status": "healthy",
            "mcp_server": "operational",
            "tools": tools_status,
            "timestamp": "2024-01-15T10:30:00Z"
        }
    except Exception as e:
        logger.error(f"MCP health check failed: {e}")
        return {
            "status": "unhealthy",
            "mcp_server": "error",
            "error": str(e),
            "timestamp": "2024-01-15T10:30:00Z"
        }


async def log_tool_execution(
    tool_name: str,
    success: bool,
    execution_time: float,
    db: Session
):
    """Log tool execution for analytics (background task)"""
    try:
        # In a real implementation, you would log this to a database
        # For now, we'll just log it
        logger.info(
            f"Tool execution logged: {tool_name}, success: {success}, "
            f"execution_time: {execution_time:.3f}s"
        )
    except Exception as e:
        logger.error(f"Failed to log tool execution: {e}")


@router.get("/analytics")
async def get_tool_analytics(db: Session = Depends(get_db)) -> Dict[str, Any]:
    """Get analytics about tool usage"""
    try:
        # In a real implementation, you would query analytics from a database
        # For now, return mock data
        return {
            "total_executions": 0,
            "success_rate": 0.0,
            "average_execution_time": 0.0,
            "most_used_tools": [],
            "error_rate": 0.0,
            "timestamp": "2024-01-15T10:30:00Z"
        }
    except Exception as e:
        logger.error(f"Failed to get tool analytics: {e}")
        raise HTTPException(status_code=500, detail=str(e))
