#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Script de teste do servidor Flask
"""
import sys
import os

print("[INFO] Python versão:", sys.version)
print("[INFO] Diretório atual:", os.getcwd())

try:
    print("\n[TESTE 1] Importando Flask...")
    from flask import Flask
    print("  [OK] Flask importado")
except Exception as e:
    print(f"  [ERRO] {e}")
    sys.exit(1)

try:
    print("\n[TESTE 2] Importando Flask-CORS...")
    from flask_cors import CORS
    print("  [OK] Flask-CORS importado")
except Exception as e:
    print(f"  [ERRO] {e}")
    sys.exit(1)

sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

try:
    print("\n[TESTE 3] Importando módulos backend...")
    from api.routes import api_bp
    print("  [OK] api.routes importado")
    
    from utils.storage import DataStore
    print("  [OK] utils.storage importado")
    
    print("\n[TESTE 4] Criando aplicação Flask...")
    app = Flask(__name__)
    CORS(app)
    app.register_blueprint(api_bp, url_prefix='/api')
    print("  [OK] Aplicação criada")
    
    print("\n[TESTE 5] Testando endpoints...")
    with app.test_client() as client:
        # Teste GET /api/health
        resp = client.get('/api/health')
        print(f"  GET /api/health: {resp.status_code}")
        print(f"  Resposta: {resp.get_json()}")
        
        # Teste GET /api/state (deve retornar None inicialmente)
        resp = client.get('/api/state')
        print(f"  GET /api/state: {resp.status_code}")
        data = resp.get_json()
        print(f"  Resposta: {data}")
        
        # Teste POST /api/state
        test_state = {
            'state': {
                'evolucoes': [],
                'financeiro': {},
                'financeiro_records': [],
                'timestamp': '2025-11-12T00:00:00'
            }
        }
        resp = client.post('/api/state', 
                          json=test_state,
                          content_type='application/json')
        print(f"  POST /api/state: {resp.status_code}")
        print(f"  Resposta: {resp.get_json()}")
        
    print("\n[SUCESSO] Todos os testes passaram!")
    
except Exception as e:
    print(f"  [ERRO] {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
