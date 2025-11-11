"""
Database/Storage utilities for persistence
"""
import json
import os
from datetime import datetime
from typing import Any, Dict, List

class DataStore:
    """Simple file-based data storage"""

    def __init__(self, storage_dir: str = 'data/output'):
        self.storage_dir = storage_dir
        self._ensure_dir()

    def _ensure_dir(self):
        """Ensure storage directory exists"""
        if not os.path.exists(self.storage_dir):
            os.makedirs(self.storage_dir)

    def save_session(self, session_name: str, data: Dict[str, Any]) -> str:
        """Save analysis session"""
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"{session_name}_{timestamp}.json"
        filepath = os.path.join(self.storage_dir, filename)

        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

        return filepath

    def load_session(self, filename: str) -> Dict[str, Any]:
        """Load analysis session"""
        filepath = os.path.join(self.storage_dir, filename)

        if not os.path.exists(filepath):
            return None

        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)

    def list_sessions(self) -> List[str]:
        """List all saved sessions"""
        if not os.path.exists(self.storage_dir):
            return []

        return sorted([f for f in os.listdir(self.storage_dir) if f.endswith('.json')])

    def delete_session(self, filename: str) -> bool:
        """Delete a session"""
        filepath = os.path.join(self.storage_dir, filename)

        if os.path.exists(filepath):
            os.remove(filepath)
            return True

        return False

    def export_csv(self, data: List[Dict], filename: str) -> str:
        """Export data to CSV"""
        if not data:
            return None

        import csv

        filepath = os.path.join(self.storage_dir, filename)

        with open(filepath, 'w', newline='', encoding='utf-8') as f:
            headers = data[0].keys()
            writer = csv.DictWriter(f, fieldnames=headers)
            writer.writeheader()
            writer.writerows(data)

        return filepath

    def export_json(self, data: Any, filename: str) -> str:
        """Export data to JSON"""
        filepath = os.path.join(self.storage_dir, filename)

        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

        return filepath
