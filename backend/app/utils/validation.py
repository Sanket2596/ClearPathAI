"""
Input validation and sanitization utilities
"""
import re
import html
import bleach
import validators
from typing import Any, Dict, List, Optional, Union
from pydantic import BaseModel, validator
import logging

logger = logging.getLogger(__name__)

class InputSanitizer:
    """Sanitize user inputs to prevent XSS and injection attacks"""
    
    # Allowed HTML tags for rich text content
    ALLOWED_TAGS = [
        'p', 'br', 'strong', 'em', 'u', 'b', 'i', 'ul', 'ol', 'li',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'code', 'pre'
    ]
    
    # Allowed HTML attributes
    ALLOWED_ATTRIBUTES = {
        'a': ['href', 'title'],
        'img': ['src', 'alt', 'title', 'width', 'height'],
        'blockquote': ['cite'],
        'code': ['class'],
        'pre': ['class']
    }
    
    @staticmethod
    def sanitize_html(text: str) -> str:
        """Sanitize HTML content"""
        if not text:
            return ""
        
        return bleach.clean(
            text,
            tags=InputSanitizer.ALLOWED_TAGS,
            attributes=InputSanitizer.ALLOWED_ATTRIBUTES,
            strip=True
        )
    
    @staticmethod
    def sanitize_text(text: str) -> str:
        """Sanitize plain text content"""
        if not text:
            return ""
        
        # HTML escape
        text = html.escape(text)
        
        # Remove potential SQL injection patterns
        text = re.sub(r'[\'";]', '', text)
        
        # Remove potential script injection
        text = re.sub(r'<script.*?</script>', '', text, flags=re.IGNORECASE | re.DOTALL)
        
        return text.strip()
    
    @staticmethod
    def sanitize_email(email: str) -> Optional[str]:
        """Sanitize and validate email"""
        if not email:
            return None
        
        email = email.strip().lower()
        
        if not validators.email(email):
            return None
        
        return email
    
    @staticmethod
    def sanitize_phone(phone: str) -> Optional[str]:
        """Sanitize and validate phone number"""
        if not phone:
            return None
        
        # Remove all non-digit characters except +
        phone = re.sub(r'[^\d+]', '', phone)
        
        # Basic validation
        if len(phone) < 10 or len(phone) > 15:
            return None
        
        return phone
    
    @staticmethod
    def sanitize_url(url: str) -> Optional[str]:
        """Sanitize and validate URL"""
        if not url:
            return None
        
        url = url.strip()
        
        if not validators.url(url):
            return None
        
        return url
    
    @staticmethod
    def sanitize_tracking_number(tracking: str) -> str:
        """Sanitize tracking number"""
        if not tracking:
            return ""
        
        # Remove special characters except alphanumeric, hyphens, and underscores
        tracking = re.sub(r'[^a-zA-Z0-9\-_]', '', tracking)
        
        return tracking.upper().strip()
    
    @staticmethod
    def sanitize_address(address: Dict[str, Any]) -> Dict[str, Any]:
        """Sanitize address object"""
        if not address:
            return {}
        
        sanitized = {}
        
        # Required fields
        for field in ['street', 'city', 'state', 'zip_code', 'country']:
            if field in address and address[field]:
                sanitized[field] = InputSanitizer.sanitize_text(str(address[field]))
        
        # Optional coordinates
        if 'coordinates' in address and address['coordinates']:
            coords = address['coordinates']
            if isinstance(coords, dict) and 'lat' in coords and 'lng' in coords:
                try:
                    lat = float(coords['lat'])
                    lng = float(coords['lng'])
                    # Validate coordinate ranges
                    if -90 <= lat <= 90 and -180 <= lng <= 180:
                        sanitized['coordinates'] = {'lat': lat, 'lng': lng}
                except (ValueError, TypeError):
                    pass
        
        return sanitized

class SQLInjectionValidator:
    """Validate inputs against SQL injection patterns"""
    
    # Common SQL injection patterns
    SQL_INJECTION_PATTERNS = [
        r"(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)",
        r"(\b(OR|AND)\s+\d+\s*=\s*\d+)",
        r"(\b(OR|AND)\s+['\"]?\w+['\"]?\s*=\s*['\"]?\w+['\"]?)",
        r"(\b(OR|AND)\s+['\"]?\w+['\"]?\s*LIKE\s*['\"]?\w+['\"]?)",
        r"(\bUNION\s+SELECT\b)",
        r"(\bDROP\s+TABLE\b)",
        r"(\bDELETE\s+FROM\b)",
        r"(\bINSERT\s+INTO\b)",
        r"(\bUPDATE\s+SET\b)",
        r"(\bALTER\s+TABLE\b)",
        r"(\bEXEC\s*\()",
        r"(\bSCRIPT\b)",
        r"(--|\#|\/\*|\*\/)",
        r"(\bWAITFOR\s+DELAY\b)",
        r"(\bBENCHMARK\b)",
        r"(\bSLEEP\b)",
        r"(\bPG_SLEEP\b)",
        r"(\bWAITFOR\b)",
    ]
    
    @classmethod
    def validate_input(cls, input_value: str) -> bool:
        """Check if input contains SQL injection patterns"""
        if not input_value:
            return True
        
        input_upper = input_value.upper()
        
        for pattern in cls.SQL_INJECTION_PATTERNS:
            if re.search(pattern, input_upper, re.IGNORECASE):
                logger.warning(f"Potential SQL injection detected: {input_value}")
                return False
        
        return True
    
    @classmethod
    def validate_dict(cls, data: Dict[str, Any]) -> Dict[str, Any]:
        """Validate all string values in a dictionary"""
        validated = {}
        
        for key, value in data.items():
            if isinstance(value, str):
                if cls.validate_input(value):
                    validated[key] = value
                else:
                    validated[key] = ""
            elif isinstance(value, dict):
                validated[key] = cls.validate_dict(value)
            elif isinstance(value, list):
                validated[key] = [
                    cls.validate_dict(item) if isinstance(item, dict) else item
                    for item in value
                ]
            else:
                validated[key] = value
        
        return validated

class XSSValidator:
    """Validate inputs against XSS patterns"""
    
    # Common XSS patterns
    XSS_PATTERNS = [
        r"<script[^>]*>.*?</script>",
        r"javascript:",
        r"vbscript:",
        r"onload\s*=",
        r"onerror\s*=",
        r"onclick\s*=",
        r"onmouseover\s*=",
        r"onfocus\s*=",
        r"onblur\s*=",
        r"onchange\s*=",
        r"onsubmit\s*=",
        r"onreset\s*=",
        r"onselect\s*=",
        r"onkeydown\s*=",
        r"onkeyup\s*=",
        r"onkeypress\s*=",
        r"onmousedown\s*=",
        r"onmouseup\s*=",
        r"onmousemove\s*=",
        r"onmouseout\s*=",
        r"onmouseover\s*=",
        r"oncontextmenu\s*=",
        r"onabort\s*=",
        r"onbeforeunload\s*=",
        r"onerror\s*=",
        r"onhashchange\s*=",
        r"onload\s*=",
        r"onpageshow\s*=",
        r"onpagehide\s*=",
        r"onresize\s*=",
        r"onscroll\s*=",
        r"onunload\s*=",
        r"expression\s*\(",
        r"url\s*\(",
        r"@import",
        r"eval\s*\(",
        r"setTimeout\s*\(",
        r"setInterval\s*\(",
        r"Function\s*\(",
        r"alert\s*\(",
        r"confirm\s*\(",
        r"prompt\s*\(",
    ]
    
    @classmethod
    def validate_input(cls, input_value: str) -> bool:
        """Check if input contains XSS patterns"""
        if not input_value:
            return True
        
        for pattern in cls.XSS_PATTERNS:
            if re.search(pattern, input_value, re.IGNORECASE | re.DOTALL):
                logger.warning(f"Potential XSS detected: {input_value}")
                return False
        
        return True

class InputValidator:
    """Comprehensive input validation"""
    
    @staticmethod
    def validate_and_sanitize_package_data(data: Dict[str, Any]) -> Dict[str, Any]:
        """Validate and sanitize package data"""
        sanitized = {}
        
        # Required string fields
        string_fields = [
            'tracking_number', 'sender_name', 'receiver_name', 
            'origin', 'destination'
        ]
        
        for field in string_fields:
            if field in data and data[field]:
                value = InputSanitizer.sanitize_text(str(data[field]))
                if field == 'tracking_number':
                    value = InputSanitizer.sanitize_tracking_number(value)
                sanitized[field] = value
        
        # Optional string fields
        optional_string_fields = [
            'sender_company', 'receiver_company', 'sender_phone', 
            'receiver_phone', 'special_instructions'
        ]
        
        for field in optional_string_fields:
            if field in data and data[field]:
                sanitized[field] = InputSanitizer.sanitize_text(str(data[field]))
        
        # Email fields
        email_fields = ['sender_email', 'receiver_email']
        for field in email_fields:
            if field in data and data[field]:
                sanitized[field] = InputSanitizer.sanitize_email(data[field])
        
        # Address fields
        if 'sender_address' in data and data['sender_address']:
            sanitized['sender_address'] = InputSanitizer.sanitize_address(data['sender_address'])
        
        if 'receiver_address' in data and data['receiver_address']:
            sanitized['receiver_address'] = InputSanitizer.sanitize_address(data['receiver_address'])
        
        # Numeric fields
        numeric_fields = ['weight', 'value']
        for field in numeric_fields:
            if field in data and data[field] is not None:
                try:
                    sanitized[field] = float(data[field])
                    if sanitized[field] < 0:
                        sanitized[field] = 0
                except (ValueError, TypeError):
                    sanitized[field] = 0
        
        # Boolean fields
        boolean_fields = [
            'insurance_required', 'signature_required', 'fragile', 'hazardous'
        ]
        for field in boolean_fields:
            if field in data:
                sanitized[field] = bool(data[field])
        
        # Dimensions
        if 'dimensions' in data and data['dimensions']:
            dims = data['dimensions']
            if isinstance(dims, dict):
                sanitized['dimensions'] = {}
                for key in ['length', 'width', 'height']:
                    if key in dims:
                        try:
                            sanitized['dimensions'][key] = float(dims[key])
                        except (ValueError, TypeError):
                            pass
                if 'unit' in dims:
                    sanitized['dimensions']['unit'] = InputSanitizer.sanitize_text(str(dims['unit']))
        
        return sanitized
    
    @staticmethod
    def validate_search_params(params: Dict[str, Any]) -> Dict[str, Any]:
        """Validate search parameters"""
        sanitized = {}
        
        # String search fields
        string_fields = ['search', 'status', 'priority', 'origin', 'destination']
        for field in string_fields:
            if field in params and params[field]:
                sanitized[field] = InputSanitizer.sanitize_text(str(params[field]))
        
        # Pagination fields
        if 'page' in params:
            try:
                page = int(params['page'])
                sanitized['page'] = max(1, page)
            except (ValueError, TypeError):
                sanitized['page'] = 1
        
        if 'size' in params:
            try:
                size = int(params['size'])
                sanitized['size'] = max(1, min(100, size))  # Limit to 100
            except (ValueError, TypeError):
                sanitized['size'] = 20
        
        # Sort fields
        if 'sort_by' in params and params['sort_by']:
            sort_by = InputSanitizer.sanitize_text(str(params['sort_by']))
            # Whitelist allowed sort fields
            allowed_sort_fields = [
                'created_at', 'updated_at', 'tracking_number', 'status', 
                'priority', 'origin', 'destination', 'sender_name', 'receiver_name'
            ]
            if sort_by in allowed_sort_fields:
                sanitized['sort_by'] = sort_by
            else:
                sanitized['sort_by'] = 'created_at'
        
        if 'sort_order' in params and params['sort_order']:
            sort_order = str(params['sort_order']).lower()
            if sort_order in ['asc', 'desc']:
                sanitized['sort_order'] = sort_order
            else:
                sanitized['sort_order'] = 'desc'
        
        return sanitized
