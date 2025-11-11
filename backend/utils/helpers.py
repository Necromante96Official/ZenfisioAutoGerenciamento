"""
Utility functions
"""
import os
import json
from datetime import datetime

def ensure_dir_exists(path: str) -> None:
    """Create directory if it doesn't exist"""
    if not os.path.exists(path):
        os.makedirs(path)

def save_json(data: dict, filepath: str) -> None:
    """Save data to JSON file"""
    ensure_dir_exists(os.path.dirname(filepath))
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def load_json(filepath: str) -> dict:
    """Load JSON file"""
    if not os.path.exists(filepath):
        return {}

    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)

def get_timestamp() -> str:
    """Get current timestamp"""
    return datetime.now().strftime('%Y-%m-%d %H:%M:%S')

def format_currency(value: float, currency: str = 'R$') -> str:
    """Format value as currency"""
    return f"{currency} {value:,.2f}".replace(',', '.')

def sanitize_filename(filename: str) -> str:
    """Remove invalid filename characters"""
    invalid_chars = '<>:"/\\|?*'
    for char in invalid_chars:
        filename = filename.replace(char, '')
    return filename
