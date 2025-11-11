"""
Main Flask application
"""
import os
import sys
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS

# Add backend to path
sys.path.insert(0, os.path.dirname(__file__))

from api.routes import api_bp
from parsers.parser import DataParser
from analytics.analyzer import Analyzer

# Suppress all Flask logs completely
logging.getLogger('werkzeug').setLevel(logging.CRITICAL)
logging.getLogger('flask').setLevel(logging.CRITICAL)

app = Flask(__name__, static_folder='../frontend', static_url_path='')
app.config['ENV'] = 'production'
app.config['DEBUG'] = False
app.logger.disabled = True

CORS(app)

# Register blueprints
app.register_blueprint(api_bp, url_prefix='/api')

@app.route('/')
def index():
    return jsonify({'message': 'Zenfisio Manager API', 'status': 'running'})

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint não encontrado'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Erro interno do servidor'}), 500

if __name__ == '__main__':
    app.run(debug=True, host='localhost', port=5000)
