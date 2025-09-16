"""
AI Investigator Agent for Package Anomaly Analysis

This agent uses LangChain to analyze package anomalies, investigate issues,
and provide intelligent recommendations for package recovery and logistics optimization.
"""

import os
import json
import asyncio
from typing import Dict, List, Optional, Any, Tuple
from datetime import datetime, timedelta
from dataclasses import dataclass
from enum import Enum

from langchain_openai import ChatOpenAI
from langchain.schema import HumanMessage, SystemMessage, AIMessage
from langchain.tools import BaseTool
from langchain.agents import AgentExecutor, create_react_agent
from langchain.prompts import PromptTemplate
from langchain.memory import ConversationBufferWindowMemory
from langchain.callbacks.base import BaseCallbackHandler
from langchain.schema import AgentAction, AgentFinish
import tiktoken

from app.database import get_db
from app.services.agent_service import AgentService
from app.agents.mcp_tools import get_mcp_tools

# Token optimization configuration
MAX_TOKENS_PER_REQUEST = 2000
MAX_CONTEXT_TOKENS = 4000
TOKEN_BUFFER = 200

class InvestigationType(str, Enum):
    """Types of investigations the agent can perform"""
    ANOMALY_ANALYSIS = "anomaly_analysis"
    DELAY_INVESTIGATION = "delay_investigation"
    ROUTE_OPTIMIZATION = "route_optimization"
    RECOVERY_STRATEGY = "recovery_strategy"
    PREDICTIVE_ANALYSIS = "predictive_analysis"

@dataclass
class InvestigationResult:
    """Result of an investigation"""
    investigation_id: str
    package_id: str
    investigation_type: InvestigationType
    findings: List[str]
    recommendations: List[str]
    confidence_score: float
    priority: str
    estimated_resolution_time: Optional[str]
    next_actions: List[str]
    created_at: datetime

@dataclass
class AgentContext:
    """Context for the agent's current investigation"""
    package_id: str
    investigation_type: InvestigationType
    current_status: str
    anomaly_details: Dict[str, Any]
    historical_data: List[Dict[str, Any]]
    environmental_factors: Dict[str, Any]

class TokenOptimizer:
    """Optimizes token usage for OpenAI API calls"""
    
    def __init__(self):
        self.encoding = tiktoken.get_encoding("cl100k_base")
    
    def count_tokens(self, text: str) -> int:
        """Count tokens in text"""
        return len(self.encoding.encode(text))
    
    def truncate_text(self, text: str, max_tokens: int) -> str:
        """Truncate text to fit within token limit"""
        tokens = self.encoding.encode(text)
        if len(tokens) <= max_tokens:
            return text
        
        truncated_tokens = tokens[:max_tokens - 10]  # Leave buffer
        return self.encoding.decode(truncated_tokens) + "..."
    
    def optimize_context(self, context: Dict[str, Any], max_tokens: int) -> Dict[str, Any]:
        """Optimize context to fit within token limits"""
        # Prioritize most important information
        priority_fields = [
            'package_id', 'status', 'anomaly_type', 'severity',
            'current_location', 'destination', 'estimated_delivery'
        ]
        
        optimized = {}
        remaining_tokens = max_tokens
        
        # Add priority fields first
        for field in priority_fields:
            if field in context and remaining_tokens > 50:
                value = str(context[field])
                if self.count_tokens(value) <= remaining_tokens:
                    optimized[field] = value
                    remaining_tokens -= self.count_tokens(value)
        
        # Add other fields if space allows
        for key, value in context.items():
            if key not in optimized and remaining_tokens > 50:
                value_str = str(value)
                if self.count_tokens(value_str) <= remaining_tokens:
                    optimized[key] = value_str
                    remaining_tokens -= self.count_tokens(value_str)
        
        return optimized

# Old tool implementations removed - now using MCP tools

class InvestigationCallbackHandler(BaseCallbackHandler):
    """Callback handler for agent execution"""
    
    def __init__(self, investigation_id: str):
        self.investigation_id = investigation_id
        self.actions_taken = []
    
    def on_agent_action(self, action: AgentAction, **kwargs) -> None:
        """Called when agent takes an action"""
        self.actions_taken.append({
            "tool": action.tool,
            "input": action.tool_input,
            "log": action.log
        })
    
    def on_agent_finish(self, finish: AgentFinish, **kwargs) -> None:
        """Called when agent finishes"""
        pass

class InvestigatorAgent:
    """AI Investigator Agent for package anomaly analysis"""
    
    def __init__(self, db_session):
        self.db_session = db_session
        self.token_optimizer = TokenOptimizer()
        
        # Initialize LLM with optimized settings
        self.llm = ChatOpenAI(
            model="gpt-3.5-turbo",  # Using cheaper model
            temperature=0.1,  # Lower temperature for more consistent results
            max_tokens=500,  # Limit response length
            openai_api_key=os.getenv("OPENAI_API_KEY")
        )
        
        # Initialize MCP tools
        self.tools = get_mcp_tools()
        
        # Create agent with ReAct pattern
        self.agent = self._create_agent()
        
        # Memory for conversation context
        self.memory = ConversationBufferWindowMemory(
            k=3,  # Keep only last 3 exchanges
            memory_key="chat_history",
            return_messages=True
        )
    
    def _create_agent(self) -> AgentExecutor:
        """Create the ReAct agent"""
        
        # Optimized prompt template
        prompt_template = """
You are an AI Logistics Investigator Agent specializing in package anomaly analysis and recovery strategies.

Your role:
- Analyze package anomalies and delays
- Investigate root causes using available tools
- Provide actionable recommendations
- Minimize token usage while maintaining accuracy

Available tools:
{tools}

Use this format:
Question: the input question you must answer
Thought: you should always think about what to do
Action: the action to take, should be one of [{tool_names}]
Action Input: the input to the action
Observation: the result of the action
... (this Thought/Action/Action Input/Observation can repeat N times)
Thought: I now know the final answer
Final Answer: the final answer to the original input question

Current context:
- Package ID: {package_id}
- Investigation Type: {investigation_type}
- Current Status: {current_status}

Previous conversation:
{chat_history}

Question: {input}
Thought: {agent_scratchpad}
"""
        
        prompt = PromptTemplate(
            template=prompt_template,
            input_variables=["input", "agent_scratchpad", "chat_history", "package_id", "investigation_type", "current_status"],
            partial_variables={"tools": self._format_tools(), "tool_names": self._format_tool_names()}
        )
        
        # Create ReAct agent
        agent = create_react_agent(self.llm, self.tools, prompt)
        
        return AgentExecutor(
            agent=agent,
            tools=self.tools,
            memory=self.memory,
            verbose=True,
            max_iterations=3,  # Limit iterations to save tokens
            early_stopping_method="generate"
        )
    
    def _format_tools(self) -> str:
        """Format tools for prompt"""
        return "\n".join([f"{tool.name}: {tool.description}" for tool in self.tools])
    
    def _format_tool_names(self) -> str:
        """Format tool names for prompt"""
        return ", ".join([tool.name for tool in self.tools])
    
    async def investigate_anomaly(
        self, 
        package_id: str, 
        anomaly_data: Dict[str, Any]
    ) -> InvestigationResult:
        """Investigate a package anomaly"""
        
        investigation_id = f"inv_{package_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        # Optimize context to save tokens
        optimized_context = self.token_optimizer.optimize_context(anomaly_data, MAX_CONTEXT_TOKENS)
        
        # Create investigation prompt
        investigation_prompt = f"""
Investigate this package anomaly:

Package ID: {package_id}
Anomaly Type: {anomaly_data.get('anomaly_type', 'Unknown')}
Severity: {anomaly_data.get('severity', 'Unknown')}
Description: {anomaly_data.get('description', 'No description')}

Please:
1. Retrieve package data using get_package_data
2. Analyze the anomaly and identify root causes
3. Check weather and traffic conditions if relevant
4. Provide specific recommendations for resolution
5. Estimate resolution time and priority level

Be concise and focus on actionable insights.
"""
        
        try:
            # Execute investigation
            callback_handler = InvestigationCallbackHandler(investigation_id)
            
            result = await self.agent.ainvoke(
                {
                    "input": investigation_prompt,
                    "package_id": package_id,
                    "investigation_type": InvestigationType.ANOMALY_ANALYSIS.value,
                    "current_status": anomaly_data.get('current_status', 'Unknown')
                },
                callbacks=[callback_handler]
            )
            
            # Parse results
            findings, recommendations, confidence_score = self._parse_investigation_result(result)
            
            # Create investigation result
            investigation_result = InvestigationResult(
                investigation_id=investigation_id,
                package_id=package_id,
                investigation_type=InvestigationType.ANOMALY_ANALYSIS,
                findings=findings,
                recommendations=recommendations,
                confidence_score=confidence_score,
                priority=self._determine_priority(anomaly_data, confidence_score),
                estimated_resolution_time=self._estimate_resolution_time(findings),
                next_actions=self._generate_next_actions(recommendations),
                created_at=datetime.utcnow()
            )
            
            return investigation_result
            
        except Exception as e:
            print(f"Investigation failed: {str(e)}")
            return self._create_error_result(investigation_id, package_id, str(e))
    
    def _parse_investigation_result(self, result: Dict[str, Any]) -> Tuple[List[str], List[str], float]:
        """Parse agent result into structured format"""
        
        response = result.get("output", "")
        
        # Extract findings and recommendations using simple parsing
        findings = []
        recommendations = []
        confidence_score = 0.7  # Default confidence
        
        # Simple parsing logic (in production, use more sophisticated parsing)
        lines = response.split('\n')
        current_section = None
        
        for line in lines:
            line = line.strip()
            if 'finding' in line.lower() or 'issue' in line.lower():
                current_section = 'findings'
            elif 'recommendation' in line.lower() or 'suggestion' in line.lower():
                current_section = 'recommendations'
            elif line.startswith('-') or line.startswith('•'):
                if current_section == 'findings':
                    findings.append(line[1:].strip())
                elif current_section == 'recommendations':
                    recommendations.append(line[1:].strip())
        
        # If no structured findings, extract from general response
        if not findings and not recommendations:
            # Split response into sentences and categorize
            sentences = response.split('.')
            for sentence in sentences:
                sentence = sentence.strip()
                if sentence and len(sentence) > 10:
                    if any(word in sentence.lower() for word in ['problem', 'issue', 'cause', 'reason']):
                        findings.append(sentence)
                    elif any(word in sentence.lower() for word in ['should', 'recommend', 'suggest', 'action']):
                        recommendations.append(sentence)
        
        return findings[:5], recommendations[:5], confidence_score
    
    def _determine_priority(self, anomaly_data: Dict[str, Any], confidence_score: float) -> str:
        """Determine investigation priority"""
        severity = anomaly_data.get('severity', 'medium').lower()
        
        if severity == 'high' or confidence_score > 0.8:
            return 'critical'
        elif severity == 'medium' or confidence_score > 0.6:
            return 'high'
        else:
            return 'medium'
    
    def _estimate_resolution_time(self, findings: List[str]) -> str:
        """Estimate resolution time based on findings"""
        if not findings:
            return "Unknown"
        
        # Simple heuristic based on finding keywords
        finding_text = ' '.join(findings).lower()
        
        if any(word in finding_text for word in ['weather', 'traffic', 'delay']):
            return "2-4 hours"
        elif any(word in finding_text for word in ['routing', 'location', 'address']):
            return "1-2 hours"
        elif any(word in finding_text for word in ['system', 'technical', 'error']):
            return "4-8 hours"
        else:
            return "1-3 hours"
    
    def _generate_next_actions(self, recommendations: List[str]) -> List[str]:
        """Generate next actions from recommendations"""
        actions = []
        
        for rec in recommendations:
            if 'contact' in rec.lower():
                actions.append("Contact carrier for immediate assistance")
            elif 'reroute' in rec.lower():
                actions.append("Initiate package rerouting")
            elif 'update' in rec.lower():
                actions.append("Update customer with new timeline")
            elif 'monitor' in rec.lower():
                actions.append("Increase monitoring frequency")
        
        return actions[:3]  # Limit to 3 actions
    
    def _create_error_result(self, investigation_id: str, package_id: str, error: str) -> InvestigationResult:
        """Create error result when investigation fails"""
        return InvestigationResult(
            investigation_id=investigation_id,
            package_id=package_id,
            investigation_type=InvestigationType.ANOMALY_ANALYSIS,
            findings=[f"Investigation failed: {error}"],
            recommendations=["Manual investigation required", "Contact support team"],
            confidence_score=0.0,
            priority="high",
            estimated_resolution_time="Unknown",
            next_actions=["Escalate to human investigator"],
            created_at=datetime.utcnow()
        )

# Global agent instance
_investigator_agent = None

def get_investigator_agent(db_session) -> InvestigatorAgent:
    """Get or create investigator agent instance"""
    global _investigator_agent
    if _investigator_agent is None:
        _investigator_agent = InvestigatorAgent(db_session)
    return _investigator_agent
