"""
API Routes
"""
from flask import Blueprint, request, jsonify, send_file
import sys
import os
from datetime import datetime

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from parsers.parser import DataParser
from parsers.formats import FormatDetector
from analytics.analyzer import Analyzer
from utils.validators import Validator
from utils.storage import DataStore
from utils.logger import logger

api_bp = Blueprint('api', __name__)

# Global data storage
app_data = {
    'financeiro': [],
    'organizacional': []
}

data_store = DataStore()

@api_bp.route('/parse', methods=['POST'])
def parse_data():
    """Parse incoming data"""
    try:
        payload = request.get_json()
        data_input = payload.get('data', '')

        if not data_input:
            return jsonify({'success': False, 'message': 'Nenhum dado fornecido'}), 400

        # Detect format
        detected_format = FormatDetector.detect_format(data_input)
        logger.info(f"Formato detectado: {detected_format}")

        parser = DataParser()
        parsed_data = parser.parse(data_input)

        # Validate
        is_valid_fin, msg_fin = Validator.validate_data_array(parsed_data.get('financeiro', []))
        is_valid_org, msg_org = Validator.validate_data_array(parsed_data.get('organizacional', []))

        # Store parsed data
        app_data['financeiro'] = parsed_data.get('financeiro', [])
        app_data['organizacional'] = parsed_data.get('organizacional', [])

        logger.info(f"Dados parseados: {len(app_data['financeiro'])} financeiro, {len(app_data['organizacional'])} organizacional")

        # Save session
        session_file = data_store.save_session('analise', {
            'timestamp': datetime.now().isoformat(),
            'format': detected_format,
            'data': parsed_data
        })

        return jsonify({
            'success': True,
            'message': 'Dados processados com sucesso',
            'data': parsed_data,
            'count': {
                'financeiro': len(parsed_data.get('financeiro', [])),
                'organizacional': len(parsed_data.get('organizacional', []))
            },
            'format': detected_format,
            'session_id': os.path.basename(session_file)
        })

    except Exception as e:
        logger.error(f"Erro ao processar dados: {str(e)}", exc_info=True)
        return jsonify({'success': False, 'message': str(e)}), 500

@api_bp.route('/analytics/<analysis_type>', methods=['GET'])
def get_analytics(analysis_type):
    """Get analytics for a specific type"""
    try:
        if analysis_type not in app_data:
            return jsonify({'success': False, 'message': 'Tipo inválido'}), 400

        analyzer = Analyzer()
        analysis = analyzer.analyze(app_data[analysis_type], analysis_type)

        logger.info(f"Análise gerada para: {analysis_type}")

        return jsonify({
            'success': True,
            'type': analysis_type,
            'analysis': analysis
        })

    except Exception as e:
        logger.error(f"Erro na análise: {str(e)}", exc_info=True)
        return jsonify({'success': False, 'message': str(e)}), 500

@api_bp.route('/export', methods=['POST'])
def export_data():
    """Export data"""
    try:
        payload = request.get_json()
        data_type = payload.get('type', 'financeiro')
        file_format = payload.get('format', 'json')

        data = app_data.get(data_type, [])

        if not data:
            return jsonify({'success': False, 'message': 'Nenhum dado para exportar'}), 400

        filename = f"export_{data_type}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.{file_format}"

        if file_format == 'csv':
            data_store.export_csv(data, filename)
        else:
            data_store.export_json(data, filename)

        logger.info(f"Dados exportados: {filename}")

        return jsonify({
            'success': True,
            'message': 'Dados exportados com sucesso',
            'filename': filename
        })

    except Exception as e:
        logger.error(f"Erro na exportação: {str(e)}", exc_info=True)
        return jsonify({'success': False, 'message': str(e)}), 500

@api_bp.route('/clear', methods=['POST'])
def clear_data():
    """Clear all data"""
    try:
        app_data['financeiro'] = []
        app_data['organizacional'] = []

        logger.info("Dados limpos")

        return jsonify({
            'success': True,
            'message': 'Dados limpos com sucesso'
        })

    except Exception as e:
        logger.error(f"Erro ao limpar dados: {str(e)}", exc_info=True)
        return jsonify({'success': False, 'message': str(e)}), 500

@api_bp.route('/sessions', methods=['GET'])
def list_sessions():
    """List all saved sessions"""
    try:
        sessions = data_store.list_sessions()

        return jsonify({
            'success': True,
            'sessions': sessions
        })

    except Exception as e:
        logger.error(f"Erro ao listar sessões: {str(e)}", exc_info=True)
        return jsonify({'success': False, 'message': str(e)}), 500

@api_bp.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'data_loaded': {
            'financeiro': len(app_data['financeiro']),
            'organizacional': len(app_data['organizacional'])
        }
    })
