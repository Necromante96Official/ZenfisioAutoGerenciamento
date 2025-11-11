"""
Data Parser - handles different data formats
"""
import json
import re
from typing import Dict, List, Any
from .formats import FormatDetector

class DataParser:
    """Parse structured text data into JSON"""

    def parse(self, data_input: str) -> Dict[str, List[Dict]]:
        """
        Parse input data and categorize as financeiro or organizacional
        """
        # Detect format and parse accordingly
        detected_format = FormatDetector.detect_format(data_input)
        parser = FormatDetector.get_parser(detected_format)

        try:
            parsed_items = parser.parse(data_input)
        except Exception as e:
            # Fallback to line-by-line parsing
            parsed_items = self._parse_line_by_line(data_input)

        financeiro = []
        organizacional = []

        for item in parsed_items:
            if self._is_financial(item):
                financeiro.append(item)
            else:
                organizacional.append(item)

        return {
            'financeiro': financeiro,
            'organizacional': organizacional
        }

    def _parse_line_by_line(self, data_input: str) -> List[Dict]:
        """Fallback: parse line by line"""
        lines = data_input.strip().split('\n')
        items = []

        for line in lines:
            if not line.strip():
                continue

            parsed_item = self._parse_line(line)
            if parsed_item:
                items.append(parsed_item)

        return items

    def _parse_line(self, line: str) -> Dict[str, Any]:
        """Parse a single line into key-value pairs"""
        line = line.strip()
        if not line:
            return None

        result = {}

        # Try to parse JSON
        if line.startswith('{'):
            try:
                return json.loads(line)
            except json.JSONDecodeError:
                pass

        # Try comma-separated with labels (mais seguro)
        if ':' in line:
            # Split by comma, mas trata casos onde pode haver string com vírgula
            parts = [p.strip() for p in line.split(',')]

            for part in parts:
                if ':' in part:
                    key, value = part.split(':', 1)
                    key = key.strip()
                    value = value.strip().strip('"').strip("'")

                    # Evita sobrescrever valores já existentes
                    if key not in result:
                        result[key] = self._convert_value(value)

        return result if result else None

    def _convert_value(self, value: str) -> Any:
        """Convert string value to appropriate type"""
        value = value.strip().strip('"').strip("'")

        # Try int
        if value.isdigit():
            return int(value)

        # Try float
        try:
            return float(value)
        except ValueError:
            pass

        # Boolean
        if value.lower() in ('true', 'verdadeiro', 'sim'):
            return True
        if value.lower() in ('false', 'falso', 'não'):
            return False

        return value

    def _is_financial(self, item: Dict) -> bool:
        """Determine if item is financial data"""
        financial_keys = ['valor', 'preco', 'custo', 'receita', 'despesa', 'amount', 'price']
        keys_lower = [k.lower() for k in item.keys()]

        return any(fkey in keys_lower for fkey in financial_keys)


class CSVParser(DataParser):
    """Parse CSV data"""

    def parse(self, data_input: str) -> Dict[str, List[Dict]]:
        """Parse CSV format"""
        lines = data_input.strip().split('\n')

        if not lines:
            return {'financeiro': [], 'organizacional': []}

        # First line is header
        headers = [h.strip() for h in lines[0].split(',')]
        financeiro = []
        organizacional = []

        for line in lines[1:]:
            if not line.strip():
                continue

            values = [v.strip() for v in line.split(',')]

            if len(values) != len(headers):
                continue

            item = dict(zip(headers, values))

            # Convert values
            for key in item:
                item[key] = self._convert_value(item[key])

            if self._is_financial(item):
                financeiro.append(item)
            else:
                organizacional.append(item)

        return {
            'financeiro': financeiro,
            'organizacional': organizacional
        }
