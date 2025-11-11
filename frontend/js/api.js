// API Communication Layer
class API {
    static async parseData(data) {
        return await this.post('/api/parse', { data });
    }

    static async getAnalytics(type, data) {
        return await this.post(`/api/analytics/${type}`, { data });
    }

    static async exportData(data, format) {
        return await this.post('/api/export', { data, format });
    }

    static async post(endpoint, body) {
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error(`API Error [${endpoint}]:`, error);
            throw error;
        }
    }

    static async get(endpoint) {
        try {
            const response = await fetch(endpoint);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`API Error [${endpoint}]:`, error);
            throw error;
        }
    }
}
