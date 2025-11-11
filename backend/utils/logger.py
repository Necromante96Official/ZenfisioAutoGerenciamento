"""
Logging utility
"""
import logging
import os
from datetime import datetime

class Logger:
    """Simple logging system"""

    _instance = None
    _logger = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self):
        if self._logger is None:
            self._setup_logger()

    def _setup_logger(self):
        """Setup logging"""
        log_dir = 'data/logs'
        if not os.path.exists(log_dir):
            os.makedirs(log_dir)

        log_file = os.path.join(log_dir, f'app_{datetime.now().strftime("%Y%m%d")}.log')

        self._logger = logging.getLogger('zenfisio')
        self._logger.setLevel(logging.DEBUG)

        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )

        file_handler = logging.FileHandler(log_file)
        file_handler.setLevel(logging.DEBUG)
        file_handler.setFormatter(formatter)

        console_handler = logging.StreamHandler()
        console_handler.setLevel(logging.INFO)
        console_handler.setFormatter(formatter)

        self._logger.addHandler(file_handler)
        self._logger.addHandler(console_handler)

    def info(self, message: str):
        """Log info"""
        self._logger.info(message)

    def error(self, message: str, exc_info=False):
        """Log error"""
        self._logger.error(message, exc_info=exc_info)

    def warning(self, message: str):
        """Log warning"""
        self._logger.warning(message)

    def debug(self, message: str):
        """Log debug"""
        self._logger.debug(message)

# Singleton instance
logger = Logger()
