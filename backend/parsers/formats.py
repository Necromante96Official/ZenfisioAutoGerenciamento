"""
Different format parsers
"""
import json
import re
from typing import List, Dict, Any

class FormatDetector:
    """Detect and route to appropriate parser"""

    @staticmethod
    def detect_format(data: str) -> str:
        """Detect input format"""
        data = data.strip()

        if data.startswith('[') or data.startswith('{'):
            return 'json'
        elif '\t' in data:
            return 'tsv'
        elif ',' in data:
            return 'csv'
        else:
            return 'text'

    @staticmethod
    def get_parser(format_type: str):
        """Get appropriate parser for format"""
        parsers = {
            'json': JSONParser(),
            'csv': CSVParser(),
            'tsv': TSVParser(),
            'text': TextParser()
        }
        return parsers.get(format_type, TextParser())

class JSONParser:
    """Parse JSON format"""

    def parse(self, data: str) -> List[Dict]:
        """Parse JSON data"""
        try:
            parsed = json.loads(data)
            if isinstance(parsed, list):
                return parsed
            elif isinstance(parsed, dict):
                return [parsed]
            else:
                return []
        except json.JSONDecodeError as e:
            raise ValueError(f"JSON inválido: {str(e)}")

class CSVParser:
    """Parse CSV format"""

    def parse(self, data: str) -> List[Dict]:
        """Parse CSV data"""
        lines = data.strip().split('\n')
        if not lines:
            return []

        headers = [h.strip() for h in lines[0].split(',')]
        results = []

        for line in lines[1:]:
            if not line.strip():
                continue

            values = [v.strip() for v in line.split(',')]

            if len(values) != len(headers):
                continue

            item = dict(zip(headers, values))
            results.append(self._convert_types(item))

        return results

    def _convert_types(self, item: Dict) -> Dict:
        """Convert string values to appropriate types"""
        converted = {}

        for key, value in item.items():
            if value.isdigit():
                converted[key] = int(value)
            else:
                try:
                    converted[key] = float(value)
                except ValueError:
                    converted[key] = value

        return converted

class TSVParser:
    """Parse TSV (Tab-Separated Values) format"""

    def parse(self, data: str) -> List[Dict]:
        """Parse TSV data"""
        lines = data.strip().split('\n')
        if not lines:
            return []

        headers = [h.strip() for h in lines[0].split('\t')]
        results = []

        for line in lines[1:]:
            if not line.strip():
                continue

            values = [v.strip() for v in line.split('\t')]

            if len(values) != len(headers):
                continue

            item = dict(zip(headers, values))
            results.append(self._convert_types(item))

        return results

    def _convert_types(self, item: Dict) -> Dict:
        """Convert string values to appropriate types"""
        converted = {}

        for key, value in item.items():
            if value.isdigit():
                converted[key] = int(value)
            else:
                try:
                    converted[key] = float(value)
                except ValueError:
                    converted[key] = value

        return converted

class TextParser:
    """Parse free-form text format"""

    def parse(self, data: str) -> List[Dict]:
        """Parse free-form text data"""
        lines = data.strip().split('\n')
        results = []

        for line in lines:
            if not line.strip():
                continue

            item = self._parse_line(line)
            if item:
                results.append(item)

        return results

    def _parse_line(self, line: str) -> Dict:
        """Parse a single line"""
        line = line.strip()
        item = {}

        # Pattern: key1: value1, key2: value2, ...
        pairs = re.split(r',(?![^()]*\))', line)

        for pair in pairs:
            if ':' in pair:
                key, value = pair.split(':', 1)
                key = key.strip()
                value = value.strip().strip('"').strip("'")

                item[key] = self._convert_value(value)

        return item if item else None

    def _convert_value(self, value: str) -> Any:
        """Convert value to appropriate type"""
        if value.isdigit():
            return int(value)

        try:
            return float(value)
        except ValueError:
            pass

        if value.lower() in ('true', 'verdadeiro', 'sim', 'yes'):
            return True

        if value.lower() in ('false', 'falso', 'não', 'no'):
            return False

        return value
