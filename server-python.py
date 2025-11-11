#!/usr/bin/env python3
"""
Zenfisio Manager - Servidor Python Puro
Sem dependencias externas, rode em qualquer lugar!
"""

import http.server
import socketserver
import json
import os
import sys
import csv
import re
from pathlib import Path
from urllib.parse import urlparse, parse_qs
from io import StringIO

PORT = 5000
HOST = "127.0.0.1"

# ============================================================================
# DATA PARSER
# ============================================================================

class DataParser:
    @staticmethod
    def detect_format(data):
        """Detecta o formato dos dados"""
        data = data.strip()
        
        if data.startswith('[') or data.startswith('{'):
            return 'json'
        elif '\n' in data and (',' in data or '\t' in data):
            if '\t' in data:
                return 'tsv'
            return 'csv'
        return 'text'
    
    @staticmethod
    def parse(data):
        """Faz parsing dos dados"""
        fmt = DataParser.detect_format(data)
        
        if fmt == 'json':
            return DataParser._parse_json(data)
        elif fmt == 'csv':
            return DataParser._parse_csv(data)
        elif fmt == 'tsv':
            return DataParser._parse_tsv(data)
        else:
            return DataParser._parse_text(data)
    
    @staticmethod
    def _parse_json(data):
        try:
            parsed = json.loads(data)
            if isinstance(parsed, list):
                return parsed
            elif isinstance(parsed, dict):
                return [parsed]
            return []
        except:
            return []
    
    @staticmethod
    def _parse_csv(data):
        try:
            reader = csv.DictReader(StringIO(data))
            return list(reader)
        except:
            return []
    
    @staticmethod
    def _parse_tsv(data):
        try:
            reader = csv.DictReader(StringIO(data), delimiter='\t')
            return list(reader)
        except:
            return []
    
    @staticmethod
    def _parse_text(data):
        """Parse texto livre em linhas"""
        lines = data.strip().split('\n')
        result = []
        for i, line in enumerate(lines):
            result.append({'id': i + 1, 'texto': line.strip()})
        return result


# ============================================================================
# ANALYZER
# ============================================================================

class Analyzer:
    @staticmethod
    def analyze_financial(data):
        """Analise financeira"""
        values = []
        
        for item in data:
            for key, val in item.items():
                try:
                    # Tenta converter para numero
                    num = float(str(val).replace(',', '.').replace('R$', '').strip())
                    values.append(num)
                except:
                    pass
        
        if not values:
            return {
                'total': 0,
                'media': 0,
                'minimo': 0,
                'maximo': 0,
                'mediana': 0,
                'quantidade': 0
            }
        
        values.sort()
        total = sum(values)
        media = total / len(values)
        minimo = values[0]
        maximo = values[-1]
        n = len(values)
        mediana = values[n // 2] if n % 2 else (values[n // 2 - 1] + values[n // 2]) / 2
        
        return {
            'total': round(total, 2),
            'media': round(media, 2),
            'minimo': round(minimo, 2),
            'maximo': round(maximo, 2),
            'mediana': round(mediana, 2),
            'quantidade': n
        }
    
    @staticmethod
    def analyze_organizational(data):
        """Analise organizacional"""
        categories = {}
        
        for item in data:
            for key, val in item.items():
                key_lower = key.lower()
                if any(x in key_lower for x in ['categoria', 'tipo', 'tipo', 'classe', 'grupo']):
                    val_str = str(val).strip()
                    categories[val_str] = categories.get(val_str, 0) + 1
        
        return {
            'categorias': categories,
            'total_categorias': len(categories),
            'distribuicao': sorted(categories.items(), key=lambda x: x[1], reverse=True)
        }


# ============================================================================
# REQUEST HANDLER
# ============================================================================

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        """Handle GET requests"""
        if self.path == '/':
            self.serve_file('index.html', 'text/html')
        elif self.path.endswith('.html'):
            self.serve_file(self.path[1:], 'text/html')
        elif self.path.endswith('.css'):
            self.serve_file(self.path[1:], 'text/css')
        elif self.path.endswith('.js'):
            self.serve_file(self.path[1:], 'application/javascript')
        elif self.path == '/api/health':
            self.send_json({'status': 'ok', 'server': 'python'})
        else:
            self.send_error(404)
    
    def do_POST(self):
        """Handle POST requests"""
        length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(length).decode('utf-8')
        
        if self.path == '/api/parse':
            self.handle_parse(body)
        elif self.path.startswith('/api/analytics/'):
            analysis_type = self.path.split('/')[-1]
            self.handle_analytics(body, analysis_type)
        else:
            self.send_error(404)
    
    def handle_parse(self, body):
        """Parse data"""
        try:
            payload = json.loads(body)
            data_str = payload.get('data', '')
            
            parsed = DataParser.parse(data_str)
            
            self.send_json({
                'success': True,
                'data': parsed,
                'count': len(parsed)
            })
        except Exception as e:
            self.send_json({'success': False, 'error': str(e)}, 400)
    
    def handle_analytics(self, body, analysis_type):
        """Analyze data"""
        try:
            payload = json.loads(body)
            data = payload.get('data', [])
            
            if analysis_type == 'financeiro':
                result = Analyzer.analyze_financial(data)
            elif analysis_type == 'organizacional':
                result = Analyzer.analyze_organizational(data)
            else:
                result = {}
            
            self.send_json({'success': True, 'analysis': result})
        except Exception as e:
            self.send_json({'success': False, 'error': str(e)}, 400)
    
    def serve_file(self, filepath, mimetype):
        """Serve static file"""
        try:
            if os.path.exists(filepath):
                with open(filepath, 'rb') as f:
                    content = f.read()
                self.send_response(200)
                self.send_header('Content-Type', mimetype)
                self.send_header('Content-Length', len(content))
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(content)
            else:
                self.send_error(404)
        except Exception as e:
            self.send_error(500)
    
    def send_json(self, data, status=200):
        """Send JSON response"""
        response = json.dumps(data).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', len(response))
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(response)
    
    def log_message(self, format, *args):
        """Suppress default logging"""
        pass


# ============================================================================
# MAIN
# ============================================================================

if __name__ == '__main__':
    print("\n" + "="*50)
    print("  Zenfisio Manager - Servidor Python")
    print("="*50)
    print(f"\nAcesse: http://{HOST}:{PORT}")
    print("Pressione CTRL+C para parar\n")
    
    try:
        with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n\nServidor parado!")
    except Exception as e:
        print(f"Erro: {e}")
