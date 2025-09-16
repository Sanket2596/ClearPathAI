"""
MCP Tools Integration for LangChain Agents

This module provides LangChain-compatible tools that use the MCP server
for standardized tool execution.
"""

import asyncio
import json
import logging
from typing import Dict, Any, Optional, List
from langchain.tools import BaseTool
from langchain.schema import BaseMessage

from app.mcp.server import get_mcp_server
from app.mcp.tools import ToolResult

logger = logging.getLogger(__name__)


class MCPTool(BaseTool):
    """Base class for MCP-based LangChain tools"""
    
    def __init__(self, tool_name: str, description: str):
        super().__init__()
        self.tool_name = tool_name
        self.description = description
        self.mcp_server = get_mcp_server()
    
    def _run(self, **kwargs) -> str:
        """Synchronous execution - calls async version"""
        return asyncio.run(self._arun(**kwargs))
    
    async def _arun(self, **kwargs) -> str:
        """Asynchronous execution using MCP server"""
        try:
            result = await self.mcp_server.tool_registry.execute_tool_async(
                self.tool_name, 
                **kwargs
            )
            
            if result.success:
                return json.dumps(result.data, indent=2)
            else:
                return f"Error: {result.error}"
                
        except Exception as e:
            logger.error(f"Error executing MCP tool {self.tool_name}: {e}")
            return f"Error executing tool: {str(e)}"


class MCPPackageDataTool(MCPTool):
    """MCP-based package data tool for LangChain"""
    
    name = "get_package_data"
    description = "Retrieve detailed package information including status, location, and tracking history"
    
    def __init__(self):
        super().__init__("get_package_data", self.description)
    
    def _run(self, package_id: str, include_events: bool = True) -> str:
        """Retrieve package data"""
        return super()._run(package_id=package_id, include_events=include_events)


class MCPWeatherDataTool(MCPTool):
    """MCP-based weather data tool for LangChain"""
    
    name = "get_weather_data"
    description = "Get current weather conditions for a specific location"
    
    def __init__(self):
        super().__init__("get_weather_data", self.description)
    
    def _run(self, location: str, units: str = "metric") -> str:
        """Get weather data for location"""
        return super()._run(location=location, units=units)


class MCPTrafficDataTool(MCPTool):
    """MCP-based traffic data tool for LangChain"""
    
    name = "get_traffic_data"
    description = "Get current traffic conditions for a route"
    
    def __init__(self):
        super().__init__("get_traffic_data", self.description)
    
    def _run(self, origin: str, destination: str, departure_time: str = "now") -> str:
        """Get traffic data for route"""
        return super()._run(origin=origin, destination=destination, departure_time=departure_time)


class MCPFedExTrackingTool(MCPTool):
    """MCP-based FedEx tracking tool for LangChain"""
    
    name = "fedex_tracking"
    description = "Get real-time tracking information from FedEx"
    
    def __init__(self):
        super().__init__("fedex_tracking", self.description)
    
    def _run(self, tracking_number: str, include_events: bool = True) -> str:
        """Get FedEx tracking information"""
        return super()._run(tracking_number=tracking_number, include_events=include_events)


class MCPUPSTrackingTool(MCPTool):
    """MCP-based UPS tracking tool for LangChain"""
    
    name = "ups_tracking"
    description = "Get real-time tracking information from UPS"
    
    def __init__(self):
        super().__init__("ups_tracking", self.description)
    
    def _run(self, tracking_number: str, include_events: bool = True) -> str:
        """Get UPS tracking information"""
        return super()._run(tracking_number=tracking_number, include_events=include_events)


class MCPDHLTrackingTool(MCPTool):
    """MCP-based DHL tracking tool for LangChain"""
    
    name = "dhl_tracking"
    description = "Get real-time tracking information from DHL"
    
    def __init__(self):
        super().__init__("dhl_tracking", self.description)
    
    def _run(self, tracking_number: str, include_events: bool = True) -> str:
        """Get DHL tracking information"""
        return super()._run(tracking_number=tracking_number, include_events=include_events)


def get_mcp_tools() -> List[BaseTool]:
    """Get all available MCP tools for LangChain agents"""
    return [
        MCPPackageDataTool(),
        MCPWeatherDataTool(),
        MCPTrafficDataTool(),
        MCPFedExTrackingTool(),
        MCPUPSTrackingTool(),
        MCPDHLTrackingTool(),
    ]


def get_mcp_tool_by_name(tool_name: str) -> Optional[BaseTool]:
    """Get a specific MCP tool by name"""
    tool_map = {
        "get_package_data": MCPPackageDataTool,
        "get_weather_data": MCPWeatherDataTool,
        "get_traffic_data": MCPTrafficDataTool,
        "fedex_tracking": MCPFedExTrackingTool,
        "ups_tracking": MCPUPSTrackingTool,
        "dhl_tracking": MCPDHLTrackingTool,
    }
    
    tool_class = tool_map.get(tool_name)
    if tool_class:
        return tool_class()
    
    return None
