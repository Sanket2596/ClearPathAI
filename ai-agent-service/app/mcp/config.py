"""
MCP Configuration for AI Agent Service

This module handles configuration for MCP server and tool integrations.
"""

import os
from typing import Dict, Any, Optional
from dataclasses import dataclass
from pydantic import BaseModel


@dataclass
class MCPConfig:
    """Configuration for MCP server and tools"""
    
    # MCP Server Configuration
    server_host: str = "0.0.0.0"
    server_port: int = 8003
    server_name: str = "ClearPath AI MCP Server"
    server_version: str = "1.0.0"
    
    # Tool Configuration
    max_concurrent_tools: int = 10
    tool_timeout: int = 30
    enable_tool_caching: bool = True
    cache_ttl: int = 300  # 5 minutes
    
    # External Service Configuration
    package_service_url: str = "http://package-service:8001"
    backend_service_url: str = "http://backend:8000"
    
    # API Keys and Authentication
    openweather_api_key: Optional[str] = None
    google_maps_api_key: Optional[str] = None
    fedex_api_key: Optional[str] = None
    ups_api_key: Optional[str] = None
    dhl_api_key: Optional[str] = None
    
    # Rate Limiting
    rate_limit_per_minute: int = 100
    rate_limit_per_hour: int = 1000
    
    def __post_init__(self):
        """Load configuration from environment variables"""
        self.openweather_api_key = os.getenv("OPENWEATHER_API_KEY")
        self.google_maps_api_key = os.getenv("GOOGLE_MAPS_API_KEY")
        self.fedex_api_key = os.getenv("FEDEX_API_KEY")
        self.ups_api_key = os.getenv("UPS_API_KEY")
        self.dhl_api_key = os.getenv("DHL_API_KEY")
        
        # Override with environment variables if present
        self.server_host = os.getenv("MCP_SERVER_HOST", self.server_host)
        self.server_port = int(os.getenv("MCP_SERVER_PORT", self.server_port))
        self.max_concurrent_tools = int(os.getenv("MCP_MAX_CONCURRENT_TOOLS", self.max_concurrent_tools))
        self.tool_timeout = int(os.getenv("MCP_TOOL_TIMEOUT", self.tool_timeout))


class ToolConfig(BaseModel):
    """Configuration for individual tools"""
    
    name: str
    description: str
    enabled: bool = True
    timeout: int = 30
    retry_attempts: int = 3
    rate_limit: Optional[int] = None
    api_key: Optional[str] = None
    base_url: Optional[str] = None
    headers: Dict[str, str] = {}
    
    class Config:
        extra = "allow"


class MCPToolRegistry:
    """Registry for MCP tools configuration"""
    
    def __init__(self, config: MCPConfig):
        self.config = config
        self.tools: Dict[str, ToolConfig] = {}
        self._initialize_default_tools()
    
    def _initialize_default_tools(self):
        """Initialize default tool configurations"""
        
        # Package Data Tool
        self.register_tool(ToolConfig(
            name="get_package_data",
            description="Retrieve detailed package information including status, location, and tracking history",
            base_url=self.config.package_service_url,
            timeout=15,
            retry_attempts=3
        ))
        
        # Weather Data Tool
        self.register_tool(ToolConfig(
            name="get_weather_data",
            description="Get current weather conditions for a specific location",
            api_key=self.config.openweather_api_key,
            base_url="https://api.openweathermap.org/data/2.5",
            timeout=10,
            retry_attempts=2
        ))
        
        # Traffic Data Tool
        self.register_tool(ToolConfig(
            name="get_traffic_data",
            description="Get current traffic conditions for a route",
            api_key=self.config.google_maps_api_key,
            base_url="https://maps.googleapis.com/maps/api",
            timeout=15,
            retry_attempts=2
        ))
        
        # Carrier Tools
        self.register_tool(ToolConfig(
            name="fedex_tracking",
            description="Get real-time tracking information from FedEx",
            api_key=self.config.fedex_api_key,
            base_url="https://apis.fedex.com",
            timeout=20,
            retry_attempts=3
        ))
        
        self.register_tool(ToolConfig(
            name="ups_tracking",
            description="Get real-time tracking information from UPS",
            api_key=self.config.ups_api_key,
            base_url="https://onlinetools.ups.com",
            timeout=20,
            retry_attempts=3
        ))
        
        self.register_tool(ToolConfig(
            name="dhl_tracking",
            description="Get real-time tracking information from DHL",
            api_key=self.config.dhl_api_key,
            base_url="https://api-eu.dhl.com",
            timeout=20,
            retry_attempts=3
        ))
    
    def register_tool(self, tool_config: ToolConfig):
        """Register a new tool configuration"""
        self.tools[tool_config.name] = tool_config
    
    def get_tool_config(self, tool_name: str) -> Optional[ToolConfig]:
        """Get configuration for a specific tool"""
        return self.tools.get(tool_name)
    
    def list_tools(self) -> Dict[str, ToolConfig]:
        """List all registered tools"""
        return self.tools.copy()
    
    def is_tool_enabled(self, tool_name: str) -> bool:
        """Check if a tool is enabled"""
        tool_config = self.get_tool_config(tool_name)
        return tool_config is not None and tool_config.enabled
