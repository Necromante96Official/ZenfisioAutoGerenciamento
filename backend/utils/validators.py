"""
Data validators
"""
from typing import Any, List, Dict

class Validator:
    """Validation utilities"""

    @staticmethod
    def validate_financial_data(data: Dict) -> bool:
        """Validate financial data structure"""
        required_fields = ['valor', 'valor']
        return any(field in data for field in required_fields)

    @staticmethod
    def validate_organizational_data(data: Dict) -> bool:
        """Validate organizational data structure"""
        return bool(data)

    @staticmethod
    def is_numeric(value: Any) -> bool:
        """Check if value is numeric"""
        try:
            float(value)
            return True
        except (ValueError, TypeError):
            return False

    @staticmethod
    def is_valid_email(email: str) -> bool:
        """Validate email format"""
        import re
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return bool(re.match(pattern, email))

    @staticmethod
    def is_valid_phone(phone: str) -> bool:
        """Validate phone format"""
        import re
        pattern = r'^[\d\s\-\+\(\)]+$'
        return bool(re.match(pattern, phone))

    @staticmethod
    def is_valid_date(date_str: str) -> bool:
        """Validate date format"""
        import re
        patterns = [
            r'^\d{4}-\d{2}-\d{2}$',  # YYYY-MM-DD
            r'^\d{2}/\d{2}/\d{4}$',  # DD/MM/YYYY
        ]
        return any(re.match(p, date_str) for p in patterns)

    @staticmethod
    def sanitize_string(text: str) -> str:
        """Remove potentially harmful characters"""
        import re
        return re.sub(r'[<>\"\'%;()&+]', '', text)

    @staticmethod
    def validate_data_array(data: List[Dict]) -> tuple[bool, str]:
        """Validate array of data"""
        if not isinstance(data, list):
            return False, "Dados devem ser uma lista"

        if len(data) == 0:
            return False, "Dados vazios"

        if not all(isinstance(item, dict) for item in data):
            return False, "Todos os itens devem ser dicionários"

        return True, "Válido"
