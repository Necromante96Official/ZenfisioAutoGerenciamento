"""
Advanced Analytics Module - Para análises mais complexas
"""
from typing import List, Dict, Any

class AdvancedAnalytics:
    """Análises avançadas e relatórios"""

    @staticmethod
    def get_trend_analysis(data: List[Dict], value_key: str, date_key: str = 'data') -> Dict:
        """Analisar tendências ao longo do tempo"""
        if not data:
            return {}

        # Agrupar por data
        by_date = {}
        for item in data:
            date = item.get(date_key, 'unknown')
            value = item.get(value_key, 0)

            try:
                value = float(value)
            except (ValueError, TypeError):
                continue

            if date not in by_date:
                by_date[date] = []

            by_date[date].append(value)

        # Calcular totais por data
        trends = {}
        for date in sorted(by_date.keys()):
            trends[date] = sum(by_date[date])

        return trends

    @staticmethod
    def get_distribution_histogram(data: List[Dict], value_key: str, bins: int = 10) -> Dict:
        """Gerar histograma de distribuição"""
        values = []

        for item in data:
            try:
                value = float(item.get(value_key, 0))
                values.append(value)
            except (ValueError, TypeError):
                continue

        if not values:
            return {}

        min_val = min(values)
        max_val = max(values)
        range_val = max_val - min_val

        if range_val == 0:
            return {str(min_val): len(values)}

        # Criar bins
        histogram = {}
        bin_size = range_val / bins

        for value in values:
            bin_index = int((value - min_val) / bin_size)
            if bin_index >= bins:
                bin_index = bins - 1

            bin_key = f"{min_val + bin_index * bin_size:.2f}-{min_val + (bin_index + 1) * bin_size:.2f}"

            histogram[bin_key] = histogram.get(bin_key, 0) + 1

        return histogram

    @staticmethod
    def get_top_items(data: List[Dict], value_key: str, category_key: str, limit: int = 10) -> List[Dict]:
        """Obter top N itens por valor em uma categoria"""
        # Agrupar por categoria
        by_category = {}

        for item in data:
            category = item.get(category_key, 'Sem categoria')
            try:
                value = float(item.get(value_key, 0))
            except (ValueError, TypeError):
                value = 0

            if category not in by_category:
                by_category[category] = 0

            by_category[category] += value

        # Ordenar e limitar
        sorted_items = sorted(
            [{'categoria': cat, 'total': val} for cat, val in by_category.items()],
            key=lambda x: x['total'],
            reverse=True
        )

        return sorted_items[:limit]

    @staticmethod
    def get_comparison_metrics(data1: List[Dict], data2: List[Dict], value_key: str) -> Dict:
        """Comparar dois conjuntos de dados"""
        def get_sum(data):
            total = 0
            for item in data:
                try:
                    total += float(item.get(value_key, 0))
                except (ValueError, TypeError):
                    continue
            return total

        sum1 = get_sum(data1)
        sum2 = get_sum(data2)

        difference = sum2 - sum1
        percentage_change = (difference / sum1 * 100) if sum1 > 0 else 0

        return {
            'dataset1_sum': sum1,
            'dataset2_sum': sum2,
            'difference': difference,
            'percentage_change': percentage_change,
            'trend': 'up' if difference > 0 else 'down' if difference < 0 else 'stable'
        }

    @staticmethod
    def generate_summary_report(data: List[Dict], title: str) -> str:
        """Gerar relatório resumido em texto"""
        if not data:
            return f"{title}: Sem dados"

        report = f"\n{'=' * 50}\n{title}\n{'=' * 50}\n\n"
        report += f"Total de registros: {len(data)}\n"

        # Tentar encontrar valores numéricos
        numeric_values = []
        for item in data:
            for key, value in item.items():
                try:
                    numeric_values.append(float(value))
                except (ValueError, TypeError):
                    continue

        if numeric_values:
            import statistics
            report += f"Soma: {sum(numeric_values):.2f}\n"
            report += f"Média: {statistics.mean(numeric_values):.2f}\n"
            report += f"Máximo: {max(numeric_values):.2f}\n"
            report += f"Mínimo: {min(numeric_values):.2f}\n"

        report += f"\n{'=' * 50}\n"
        return report
