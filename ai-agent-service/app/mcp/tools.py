"""
MCP Tools Implementation

This module implements MCP-compatible tools for the AI Agent Service.
Tools are standardized interfaces that can be discovered and used by AI agents.
"""

import asyncio
import json
import logging
from typing import Dict, Any, List, Optional, Union
from abc import ABC, abstractmethod
from dataclasses import dataclass
from datetime import datetime, timedelta
import httpx
import aiohttp

from .config import MCPConfig, ToolConfig

logger = logging.getLogger(__name__)


@dataclass
class ToolResult:
    """Result of a tool execution"""
    success: bool
    data: Any
    error: Optional[str] = None
    execution_time: float = 0.0
    metadata: Dict[str, Any] = None
    
    def __post_init__(self):
        if self.metadata is None:
            self.metadata = {}


class MCPTool(ABC):
    """Base class for MCP tools"""
    
    def __init__(self, config: ToolConfig, mcp_config: MCPConfig):
        self.config = config
        self.mcp_config = mcp_config
        self.logger = logging.getLogger(f"mcp.tool.{config.name}")
    
    @abstractmethod
    async def execute(self, **kwargs) -> ToolResult:
        """Execute the tool with given parameters"""
        pass
    
    @abstractmethod
    def get_schema(self) -> Dict[str, Any]:
        """Get the tool's input schema"""
        pass
    
    def get_info(self) -> Dict[str, Any]:
        """Get tool information"""
        return {
            "name": self.config.name,
            "description": self.config.description,
            "enabled": self.config.enabled,
            "timeout": self.config.timeout,
            "schema": self.get_schema()
        }


class PackageDataTool(MCPTool):
    """MCP tool for retrieving package data"""
    
    def get_schema(self) -> Dict[str, Any]:
        return {
            "type": "object",
            "properties": {
                "package_id": {
                    "type": "string",
                    "description": "The package ID to retrieve data for"
                },
                "include_events": {
                    "type": "boolean",
                    "description": "Whether to include tracking events",
                    "default": True
                }
            },
            "required": ["package_id"]
        }
    
    async def execute(self, package_id: str, include_events: bool = True) -> ToolResult:
        """Execute package data retrieval"""
        start_time = datetime.now()
        
        try:
            async with httpx.AsyncClient(timeout=self.config.timeout) as client:
                # Call package service API
                response = await client.get(
                    f"{self.config.base_url}/api/v1/packages/{package_id}",
                    headers={"Content-Type": "application/json"}
                )
                response.raise_for_status()
                package_data = response.json()
                
                # If include_events is False, remove tracking events
                if not include_events and "tracking_events" in package_data:
                    del package_data["tracking_events"]
                
                execution_time = (datetime.now() - start_time).total_seconds()
                
                return ToolResult(
                    success=True,
                    data=package_data,
                    execution_time=execution_time,
                    metadata={
                        "tool": self.config.name,
                        "package_id": package_id,
                        "include_events": include_events
                    }
                )
                
        except httpx.HTTPError as e:
            execution_time = (datetime.now() - start_time).total_seconds()
            error_msg = f"HTTP error retrieving package data: {str(e)}"
            self.logger.error(error_msg)
            
            return ToolResult(
                success=False,
                data=None,
                error=error_msg,
                execution_time=execution_time,
                metadata={"tool": self.config.name, "package_id": package_id}
            )
        except Exception as e:
            execution_time = (datetime.now() - start_time).total_seconds()
            error_msg = f"Error retrieving package data: {str(e)}"
            self.logger.error(error_msg)
            
            return ToolResult(
                success=False,
                data=None,
                error=error_msg,
                execution_time=execution_time,
                metadata={"tool": self.config.name, "package_id": package_id}
            )


class WeatherDataTool(MCPTool):
    """MCP tool for retrieving weather data"""
    
    def get_schema(self) -> Dict[str, Any]:
        return {
            "type": "object",
            "properties": {
                "location": {
                    "type": "string",
                    "description": "Location to get weather for (city, state or coordinates)"
                },
                "units": {
                    "type": "string",
                    "description": "Temperature units (metric, imperial, kelvin)",
                    "default": "metric"
                }
            },
            "required": ["location"]
        }
    
    async def execute(self, location: str, units: str = "metric") -> ToolResult:
        """Execute weather data retrieval"""
        start_time = datetime.now()
        
        try:
            if not self.config.api_key:
                # Return mock data if no API key
                weather_data = {
                    "location": location,
                    "temperature": "22°C",
                    "conditions": "Clear",
                    "wind_speed": "15 km/h",
                    "visibility": "10 km",
                    "weather_impact": "No significant impact on delivery",
                    "source": "mock"
                }
                
                execution_time = (datetime.now() - start_time).total_seconds()
                return ToolResult(
                    success=True,
                    data=weather_data,
                    execution_time=execution_time,
                    metadata={"tool": self.config.name, "location": location, "source": "mock"}
                )
            
            # Call OpenWeatherMap API
            async with httpx.AsyncClient(timeout=self.config.timeout) as client:
                response = await client.get(
                    f"{self.config.base_url}/weather",
                    params={
                        "q": location,
                        "appid": self.config.api_key,
                        "units": units
                    }
                )
                response.raise_for_status()
                weather_data = response.json()
                
                # Transform to our format
                transformed_data = {
                    "location": weather_data["name"],
                    "temperature": f"{weather_data['main']['temp']}°{'C' if units == 'metric' else 'F'}",
                    "conditions": weather_data["weather"][0]["description"].title(),
                    "wind_speed": f"{weather_data['wind']['speed']} m/s",
                    "visibility": f"{weather_data.get('visibility', 0) / 1000:.1f} km",
                    "humidity": f"{weather_data['main']['humidity']}%",
                    "weather_impact": self._assess_weather_impact(weather_data),
                    "source": "openweathermap"
                }
                
                execution_time = (datetime.now() - start_time).total_seconds()
                return ToolResult(
                    success=True,
                    data=transformed_data,
                    execution_time=execution_time,
                    metadata={"tool": self.config.name, "location": location, "source": "api"}
                )
                
        except Exception as e:
            execution_time = (datetime.now() - start_time).total_seconds()
            error_msg = f"Error retrieving weather data: {str(e)}"
            self.logger.error(error_msg)
            
            return ToolResult(
                success=False,
                data=None,
                error=error_msg,
                execution_time=execution_time,
                metadata={"tool": self.config.name, "location": location}
            )
    
    def _assess_weather_impact(self, weather_data: Dict[str, Any]) -> str:
        """Assess the impact of weather on delivery"""
        conditions = weather_data["weather"][0]["main"].lower()
        wind_speed = weather_data["wind"]["speed"]
        visibility = weather_data.get("visibility", 10000) / 1000
        
        if conditions in ["thunderstorm", "snow", "rain"] and wind_speed > 10:
            return "High impact - delivery may be delayed"
        elif conditions in ["rain", "snow"] or visibility < 1:
            return "Moderate impact - delivery may be slower"
        else:
            return "No significant impact on delivery"


class TrafficDataTool(MCPTool):
    """MCP tool for retrieving traffic data"""
    
    def get_schema(self) -> Dict[str, Any]:
        return {
            "type": "object",
            "properties": {
                "origin": {
                    "type": "string",
                    "description": "Origin location (address or coordinates)"
                },
                "destination": {
                    "type": "string",
                    "description": "Destination location (address or coordinates)"
                },
                "departure_time": {
                    "type": "string",
                    "description": "Departure time (ISO format)",
                    "default": "now"
                }
            },
            "required": ["origin", "destination"]
        }
    
    async def execute(self, origin: str, destination: str, departure_time: str = "now") -> ToolResult:
        """Execute traffic data retrieval"""
        start_time = datetime.now()
        
        try:
            if not self.config.api_key:
                # Return mock data if no API key
                traffic_data = {
                    "route": f"{origin} → {destination}",
                    "current_delay": "15 minutes",
                    "traffic_level": "Moderate",
                    "estimated_duration": "2h 30m",
                    "incidents": [],
                    "recommended_alternatives": ["Route A", "Route B"],
                    "source": "mock"
                }
                
                execution_time = (datetime.now() - start_time).total_seconds()
                return ToolResult(
                    success=True,
                    data=traffic_data,
                    execution_time=execution_time,
                    metadata={"tool": self.config.name, "origin": origin, "destination": destination, "source": "mock"}
                )
            
            # Call Google Maps API
            async with httpx.AsyncClient(timeout=self.config.timeout) as client:
                response = await client.get(
                    f"{self.config.base_url}/directions/json",
                    params={
                        "origin": origin,
                        "destination": destination,
                        "departure_time": departure_time,
                        "key": self.config.api_key,
                        "traffic_model": "best_guess"
                    }
                )
                response.raise_for_status()
                traffic_data = response.json()
                
                # Transform to our format
                if traffic_data["routes"]:
                    route = traffic_data["routes"][0]
                    leg = route["legs"][0]
                    
                    transformed_data = {
                        "route": f"{origin} → {destination}",
                        "current_delay": f"{leg['duration_in_traffic']['text']}",
                        "traffic_level": self._assess_traffic_level(leg),
                        "estimated_duration": leg["duration"]["text"],
                        "distance": leg["distance"]["text"],
                        "incidents": self._extract_incidents(route),
                        "recommended_alternatives": self._get_alternatives(traffic_data["routes"]),
                        "source": "google_maps"
                    }
                else:
                    transformed_data = {
                        "route": f"{origin} → {destination}",
                        "error": "No route found",
                        "source": "google_maps"
                    }
                
                execution_time = (datetime.now() - start_time).total_seconds()
                return ToolResult(
                    success=True,
                    data=transformed_data,
                    execution_time=execution_time,
                    metadata={"tool": self.config.name, "origin": origin, "destination": destination, "source": "api"}
                )
                
        except Exception as e:
            execution_time = (datetime.now() - start_time).total_seconds()
            error_msg = f"Error retrieving traffic data: {str(e)}"
            self.logger.error(error_msg)
            
            return ToolResult(
                success=False,
                data=None,
                error=error_msg,
                execution_time=execution_time,
                metadata={"tool": self.config.name, "origin": origin, "destination": destination}
            )
    
    def _assess_traffic_level(self, leg: Dict[str, Any]) -> str:
        """Assess traffic level based on duration vs duration in traffic"""
        duration = leg["duration"]["value"]
        duration_in_traffic = leg["duration_in_traffic"]["value"]
        
        delay_ratio = (duration_in_traffic - duration) / duration
        
        if delay_ratio > 0.5:
            return "Heavy"
        elif delay_ratio > 0.2:
            return "Moderate"
        else:
            return "Light"
    
    def _extract_incidents(self, route: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Extract traffic incidents from route data"""
        incidents = []
        for step in route.get("legs", []):
            for step_detail in step.get("steps", []):
                if "warnings" in step_detail:
                    for warning in step_detail["warnings"]:
                        incidents.append({
                            "type": warning.get("type", "unknown"),
                            "description": warning.get("description", ""),
                            "location": step_detail.get("start_location", {})
                        })
        return incidents
    
    def _get_alternatives(self, routes: List[Dict[str, Any]]) -> List[str]:
        """Get alternative route names"""
        alternatives = []
        for i, route in enumerate(routes[1:], 1):  # Skip first route (primary)
            alternatives.append(f"Route {chr(65 + i)}")
        return alternatives


class CarrierTrackingTool(MCPTool):
    """Base class for carrier tracking tools"""
    
    def get_schema(self) -> Dict[str, Any]:
        return {
            "type": "object",
            "properties": {
                "tracking_number": {
                    "type": "string",
                    "description": "The tracking number to look up"
                },
                "include_events": {
                    "type": "boolean",
                    "description": "Whether to include detailed tracking events",
                    "default": True
                }
            },
            "required": ["tracking_number"]
        }
    
    async def execute(self, tracking_number: str, include_events: bool = True) -> ToolResult:
        """Execute carrier tracking"""
        start_time = datetime.now()
        
        try:
            if not self.config.api_key:
                # Return mock data if no API key
                tracking_data = self._get_mock_tracking_data(tracking_number)
                execution_time = (datetime.now() - start_time).total_seconds()
                
                return ToolResult(
                    success=True,
                    data=tracking_data,
                    execution_time=execution_time,
                    metadata={"tool": self.config.name, "tracking_number": tracking_number, "source": "mock"}
                )
            
            # Call carrier API
            tracking_data = await self._call_carrier_api(tracking_number, include_events)
            execution_time = (datetime.now() - start_time).total_seconds()
            
            return ToolResult(
                success=True,
                data=tracking_data,
                execution_time=execution_time,
                metadata={"tool": self.config.name, "tracking_number": tracking_number, "source": "api"}
            )
                
        except Exception as e:
            execution_time = (datetime.now() - start_time).total_seconds()
            error_msg = f"Error retrieving tracking data: {str(e)}"
            self.logger.error(error_msg)
            
            return ToolResult(
                success=False,
                data=None,
                error=error_msg,
                execution_time=execution_time,
                metadata={"tool": self.config.name, "tracking_number": tracking_number}
            )
    
    def _get_mock_tracking_data(self, tracking_number: str) -> Dict[str, Any]:
        """Get mock tracking data"""
        return {
            "tracking_number": tracking_number,
            "status": "in_transit",
            "carrier": self.config.name.replace("_tracking", "").upper(),
            "current_location": "Chicago, IL",
            "estimated_delivery": "2024-01-20T10:00:00Z",
            "events": [
                {
                    "timestamp": "2024-01-15T08:00:00Z",
                    "location": "New York, NY",
                    "status": "picked_up",
                    "description": "Package picked up from sender"
                },
                {
                    "timestamp": "2024-01-15T14:30:00Z",
                    "location": "Chicago, IL",
                    "status": "in_transit",
                    "description": "Package in transit to destination"
                }
            ] if True else [],
            "source": "mock"
        }
    
    async def _call_carrier_api(self, tracking_number: str, include_events: bool) -> Dict[str, Any]:
        """Call the actual carrier API - to be implemented by subclasses"""
        raise NotImplementedError("Subclasses must implement _call_carrier_api")


class FedExTrackingTool(CarrierTrackingTool):
    """FedEx tracking tool"""
    
    async def _call_carrier_api(self, tracking_number: str, include_events: bool) -> Dict[str, Any]:
        """Call FedEx API"""
        # Implementation would go here
        # For now, return mock data
        return self._get_mock_tracking_data(tracking_number)


class UPSTrackingTool(CarrierTrackingTool):
    """UPS tracking tool"""
    
    async def _call_carrier_api(self, tracking_number: str, include_events: bool) -> Dict[str, Any]:
        """Call UPS API"""
        # Implementation would go here
        # For now, return mock data
        return self._get_mock_tracking_data(tracking_number)


class DHLTrackingTool(CarrierTrackingTool):
    """DHL tracking tool"""
    
    async def _call_carrier_api(self, tracking_number: str, include_events: bool) -> Dict[str, Any]:
        """Call DHL API"""
        # Implementation would go here
        # For now, return mock data
        return self._get_mock_tracking_data(tracking_number)


class ToolRegistry:
    """Registry for managing MCP tools"""
    
    def __init__(self, mcp_config: MCPConfig):
        self.config = mcp_config
        self.tools: Dict[str, MCPTool] = {}
        self.tool_configs = {}
        self._initialize_tools()
    
    def _initialize_tools(self):
        """Initialize all available tools"""
        from .config import MCPToolRegistry
        
        tool_registry = MCPToolRegistry(self.config)
        self.tool_configs = tool_registry.list_tools()
        
        # Initialize tool instances
        for tool_name, tool_config in self.tool_configs.items():
            if tool_config.enabled:
                self._create_tool_instance(tool_name, tool_config)
    
    def _create_tool_instance(self, tool_name: str, tool_config: ToolConfig):
        """Create a tool instance based on configuration"""
        tool_class_map = {
            "get_package_data": PackageDataTool,
            "get_weather_data": WeatherDataTool,
            "get_traffic_data": TrafficDataTool,
            "fedex_tracking": FedExTrackingTool,
            "ups_tracking": UPSTrackingTool,
            "dhl_tracking": DHLTrackingTool,
        }
        
        tool_class = tool_class_map.get(tool_name)
        if tool_class:
            self.tools[tool_name] = tool_class(tool_config, self.config)
        else:
            logger.warning(f"No tool class found for {tool_name}")
    
    def get_tool(self, tool_name: str) -> Optional[MCPTool]:
        """Get a tool by name"""
        return self.tools.get(tool_name)
    
    def list_tools(self) -> Dict[str, Dict[str, Any]]:
        """List all available tools with their information"""
        return {name: tool.get_info() for name, tool in self.tools.items()}
    
    def execute_tool(self, tool_name: str, **kwargs) -> ToolResult:
        """Execute a tool with given parameters"""
        tool = self.get_tool(tool_name)
        if not tool:
            return ToolResult(
                success=False,
                data=None,
                error=f"Tool '{tool_name}' not found"
            )
        
        return asyncio.run(tool.execute(**kwargs))
    
    async def execute_tool_async(self, tool_name: str, **kwargs) -> ToolResult:
        """Execute a tool asynchronously"""
        tool = self.get_tool(tool_name)
        if not tool:
            return ToolResult(
                success=False,
                data=None,
                error=f"Tool '{tool_name}' not found"
            )
        
        return await tool.execute(**kwargs)
