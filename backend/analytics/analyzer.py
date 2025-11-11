"""
Data Analyzer - generates analytics and reports
"""
from typing import List, Dict, Any
import statistics

class Analyzer:
    """Analyze parsed data"""

    def analyze(self, data: List[Dict], analysis_type: str) -> Dict[str, Any]:
        """Main analysis method"""
        if analysis_type == 'financeiro':
            return self._analyze_financial(data)
        elif analysis_type == 'organizacional':
            return self._analyze_organizational(data)
        else:
            return {}

    def _analyze_financial(self, data: List[Dict]) -> Dict[str, Any]:
        """Analyze financial data"""
        if not data:
            return {
                'total': 0,
                'average': 0,
                'count': 0,
                'summary': 'Nenhum dado financeiro'
            }

        values = self._extract_values(data)

        if not values:
            return {
                'total': 0,
                'average': 0,
                'count': len(data),
                'summary': 'Nenhum valor numérico encontrado'
            }

        return {
            'total': sum(values),
            'average': statistics.mean(values),
            'median': statistics.median(values),
            'min': min(values),
            'max': max(values),
            'count': len(data),
            'stdev': statistics.stdev(values) if len(values) > 1 else 0,
            'items': data
        }

    def _analyze_organizational(self, data: List[Dict]) -> Dict[str, Any]:
        """Analyze organizational data"""
        if not data:
            return {
                'total': 0,
                'categories': [],
                'summary': 'Nenhum dado organizacional'
            }

        categories = self._group_by_category(data)

        return {
            'total': len(data),
            'categories': list(categories.keys()),
            'distribution': {cat: len(items) for cat, items in categories.items()},
            'grouped_data': categories,
            'items': data
        }

    def _extract_values(self, data: List[Dict]) -> List[float]:
        """Extract numeric values from data"""
        values = []
        numeric_keys = ['valor', 'preco', 'custo', 'receita', 'despesa', 'amount', 'price']

        for item in data:
            for key in numeric_keys:
                if key in item:
                    try:
                        values.append(float(item[key]))
                        break
                    except (ValueError, TypeError):
                        continue

        return values

    def _group_by_category(self, data: List[Dict]) -> Dict[str, List[Dict]]:
        """Group data by category"""
        grouped = {}

        category_keys = ['categoria', 'tipo', 'category', 'type']

        for item in data:
            category = None

            for key in category_keys:
                if key in item:
                    category = str(item[key])
                    break

            if not category:
                category = 'Sem categoria'

            if category not in grouped:
                grouped[category] = []

            grouped[category].append(item)

        return grouped

    def generate_report(self, data: List[Dict], analysis_type: str) -> str:
        """Generate a text report"""
        analysis = self.analyze(data, analysis_type)

        if analysis_type == 'financeiro':
            return f"""
RELATÓRIO FINANCEIRO
====================
Total: R$ {analysis.get('total', 0):.2f}
Média: R$ {analysis.get('average', 0):.2f}
Mínimo: R$ {analysis.get('min', 0):.2f}
Máximo: R$ {analysis.get('max', 0):.2f}
Quantidade de itens: {analysis.get('count', 0)}
"""
        else:
            return f"""
RELATÓRIO ORGANIZACIONAL
=======================
Total de itens: {analysis.get('total', 0)}
Categorias: {', '.join(analysis.get('categories', []))}
Distribuição: {analysis.get('distribution', {})}
"""
