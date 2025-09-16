# MCP Integration for ClearPath AI Agent Service

## Overview

This document explains the **Model Context Protocol (MCP)** integration that has been added to the ClearPath AI Agent Service. MCP provides a standardized way for AI agents to interact with external tools and services.

## What is MCP?

**Model Context Protocol (MCP)** is a standardized protocol that allows AI models to:
- Discover and use external tools
- Execute functions with standardized interfaces
- Access external data sources and services
- Maintain consistent error handling and authentication

## Architecture Changes

### Before MCP Integration
```
AI Agent → Custom Tools → External Services
```

### After MCP Integration
```
AI Agent → MCP Tools → MCP Server → Tool Registry → External Services
```

## New Components Added

### 1. MCP Server (`app/mcp/server.py`)
- **Purpose**: Centralized tool management and execution
- **Features**: 
  - Tool discovery and registration
  - Standardized tool execution
  - Error handling and retry logic
  - Tool analytics and monitoring

### 2. Tool Registry (`app/mcp/tools.py`)
- **Purpose**: Manages all available tools and their configurations
- **Features**:
  - Tool instantiation and lifecycle management
  - Configuration management
  - Tool health monitoring

### 3. MCP Configuration (`app/mcp/config.py`)
- **Purpose**: Centralized configuration for all MCP tools
- **Features**:
  - Environment variable management
  - Tool-specific configurations
  - API key management

### 4. LangChain Integration (`app/agents/mcp_tools.py`)
- **Purpose**: Bridge between MCP tools and LangChain agents
- **Features**:
  - LangChain-compatible tool interfaces
  - Async/sync execution support
  - Error handling and logging

## Available Tools

### Core Tools
1. **Package Data Tool** (`get_package_data`)
   - Retrieves package information from Package Service
   - Includes tracking events and status updates

2. **Weather Data Tool** (`get_weather_data`)
   - Gets current weather conditions for locations
   - Assesses weather impact on delivery

3. **Traffic Data Tool** (`get_traffic_data`)
   - Retrieves traffic conditions for routes
   - Provides alternative route suggestions

### Carrier Tools
4. **FedEx Tracking** (`fedex_tracking`)
   - Real-time tracking from FedEx API
   - Detailed tracking events and status

5. **UPS Tracking** (`ups_tracking`)
   - Real-time tracking from UPS API
   - Package status and location updates

6. **DHL Tracking** (`dhl_tracking`)
   - Real-time tracking from DHL API
   - International shipping support

## API Endpoints

### MCP Management
- `GET /api/v1/mcp/status` - Get MCP server status
- `GET /api/v1/mcp/tools` - List all available tools
- `GET /api/v1/mcp/tools/{tool_name}` - Get tool information
- `POST /api/v1/mcp/tools/{tool_name}/execute` - Execute a tool
- `POST /api/v1/mcp/tools/batch-execute` - Execute multiple tools
- `GET /api/v1/mcp/health` - Health check
- `GET /api/v1/mcp/analytics` - Tool usage analytics

## Configuration

### Environment Variables
```bash
# MCP Server Configuration
MCP_SERVER_HOST=0.0.0.0
MCP_SERVER_PORT=8003
MCP_MAX_CONCURRENT_TOOLS=10
MCP_TOOL_TIMEOUT=30

# External Service URLs
PACKAGE_SERVICE_URL=http://package-service:8001
BACKEND_SERVICE_URL=http://backend:8000

# API Keys for External Services
OPENWEATHER_API_KEY=your_openweather_api_key_here
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
FEDEX_API_KEY=your_fedex_api_key_here
UPS_API_KEY=your_ups_api_key_here
DHL_API_KEY=your_dhl_api_key_here
```

## Usage Examples

### 1. Using MCP Tools in AI Agents

```python
from app.agents.mcp_tools import get_mcp_tools

# Get all available MCP tools
tools = get_mcp_tools()

# Use in LangChain agent
agent = create_react_agent(llm, tools, prompt)
```

### 2. Direct Tool Execution

```python
from app.mcp.server import get_mcp_server

# Get MCP server instance
mcp_server = get_mcp_server()

# Execute a tool
result = await mcp_server.tool_registry.execute_tool_async(
    "get_package_data",
    package_id="PKG123",
    include_events=True
)
```

### 3. API Usage

```bash
# List available tools
curl http://localhost:8002/api/v1/mcp/tools

# Execute a tool
curl -X POST http://localhost:8002/api/v1/mcp/tools/get_package_data/execute \
  -H "Content-Type: application/json" \
  -d '{"tool_name": "get_package_data", "parameters": {"package_id": "PKG123"}}'
```

## Benefits of MCP Integration

### 1. Standardization
- **Consistent Interface**: All tools follow the same pattern
- **Error Handling**: Standardized error responses and retry logic
- **Authentication**: Centralized API key management

### 2. Extensibility
- **Easy Tool Addition**: Add new tools without changing agent code
- **Dynamic Discovery**: Tools can be discovered at runtime
- **Configuration Management**: Centralized tool configuration

### 3. Monitoring and Analytics
- **Tool Usage Tracking**: Monitor which tools are used most
- **Performance Metrics**: Track execution times and success rates
- **Error Analysis**: Identify common failure patterns

### 4. Scalability
- **Concurrent Execution**: Multiple tools can run simultaneously
- **Rate Limiting**: Built-in rate limiting and throttling
- **Resource Management**: Control tool execution resources

## Migration from Old Tools

### Before (Custom Tools)
```python
class PackageDataTool(BaseTool):
    def _run(self, package_id: str) -> str:
        # Custom implementation
        pass
```

### After (MCP Tools)
```python
class MCPPackageDataTool(MCPTool):
    def __init__(self):
        super().__init__("get_package_data", "Retrieve package data")
    
    def _run(self, package_id: str, include_events: bool = True) -> str:
        return super()._run(package_id=package_id, include_events=include_events)
```

## Error Handling

### Tool Execution Errors
- **Timeout Errors**: Tools respect configured timeouts
- **API Errors**: External service errors are caught and logged
- **Validation Errors**: Input validation before tool execution

### Fallback Behavior
- **Mock Data**: Tools return mock data when APIs are unavailable
- **Graceful Degradation**: System continues working with reduced functionality
- **Error Reporting**: Detailed error messages for debugging

## Monitoring and Debugging

### Logging
- **Tool Execution**: All tool executions are logged
- **Performance Metrics**: Execution times and success rates
- **Error Tracking**: Detailed error logs for troubleshooting

### Health Checks
- **Tool Health**: Individual tool health monitoring
- **Service Health**: Overall MCP server health
- **Dependency Health**: External service availability

## Future Enhancements

### Planned Features
1. **Tool Caching**: Cache tool results for better performance
2. **Tool Chaining**: Chain multiple tools together
3. **Custom Tools**: Allow dynamic tool registration
4. **Tool Versioning**: Support for tool versioning
5. **Advanced Analytics**: More detailed usage analytics

### Integration Opportunities
1. **More Carriers**: Add support for additional shipping carriers
2. **Payment Services**: Integrate payment and billing tools
3. **Document Processing**: Add OCR and document analysis tools
4. **Communication Tools**: SMS, email, and voice tools
5. **Analytics Tools**: Advanced reporting and analytics

## Troubleshooting

### Common Issues

1. **Tool Not Found**
   - Check if tool is registered in MCP server
   - Verify tool name spelling
   - Check tool configuration

2. **API Key Errors**
   - Verify API keys in environment variables
   - Check API key permissions
   - Ensure external services are accessible

3. **Timeout Errors**
   - Increase tool timeout configuration
   - Check external service response times
   - Verify network connectivity

4. **Tool Execution Failures**
   - Check tool logs for detailed error messages
   - Verify input parameters
   - Test tool independently

### Debug Commands

```bash
# Check MCP server status
curl http://localhost:8002/api/v1/mcp/status

# List all tools
curl http://localhost:8002/api/v1/mcp/tools

# Test tool execution
curl -X POST http://localhost:8002/api/v1/mcp/tools/get_package_data/execute \
  -H "Content-Type: application/json" \
  -d '{"tool_name": "get_package_data", "parameters": {"package_id": "test"}}'
```

## Conclusion

The MCP integration provides a robust, scalable foundation for tool management in the ClearPath AI Agent Service. It standardizes tool interactions, improves maintainability, and enables easy extension with new capabilities. The system is designed to be backward-compatible while providing significant improvements in functionality and monitoring.
