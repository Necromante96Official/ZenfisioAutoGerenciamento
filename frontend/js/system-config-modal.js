/**
 * SYSTEM-CONFIG-MODAL.JS
 * Modal para configurar as informações do sistema
 */

class SystemConfigModal {
    constructor() {
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.attachConfigButton();
            });
        } else {
            setTimeout(() => this.attachConfigButton(), 100);
        }
    }

    /**
     * Adiciona botão de configuração ao header
     */
    attachConfigButton() {
        const header = document.querySelector('.header-content');
        if (!header) return;

        // Verifica se já existe
        if (document.getElementById('systemConfigBtn')) return;

        // Cria botão
        const btn = document.createElement('button');
        btn.id = 'systemConfigBtn';
        btn.className = 'system-config-btn';
        btn.title = 'Configurar informações do sistema';
        btn.innerHTML = '⚙️';
        btn.style.cssText = `
            background: var(--bg-secondary);
            border: 2px solid var(--accent-secondary);
            color: var(--text-primary);
            border-radius: 6px;
            padding: 8px 12px;
            cursor: pointer;
            font-size: 16px;
            transition: all 0.2s;
            margin-left: 10px;
        `;

        btn.addEventListener('mouseover', () => {
            btn.style.transform = 'scale(1.1)';
            btn.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)';
        });

        btn.addEventListener('mouseout', () => {
            btn.style.transform = 'scale(1)';
            btn.style.boxShadow = 'none';
        });

        btn.addEventListener('click', () => this.showModal());

        const headerActions = document.querySelector('.header-actions');
        if (headerActions) {
            headerActions.insertBefore(btn, headerActions.firstChild);
        }
    }

    /**
     * Mostra modal de configuração
     */
    showModal() {
        // Remove modal anterior se existir
        const existing = document.getElementById('system-config-modal-overlay');
        if (existing) existing.remove();

        const modal = document.createElement('div');
        modal.id = 'system-config-modal-overlay';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10002;
        `;

        const content = document.createElement('div');
        content.style.cssText = `
            background: var(--bg-primary);
            border-radius: 12px;
            padding: 30px;
            width: 90%;
            max-width: 600px;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        `;

        const systemInfo = window.SYSTEM_INFO || {};

        content.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="margin: 0; color: var(--text-primary);">⚙️ Configurações do Sistema</h2>
                <button id="close-system-config" style="
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: var(--text-secondary);
                ">✕</button>
            </div>

            <div style="
                background: var(--bg-secondary);
                border-left: 4px solid var(--accent-primary);
                padding: 12px;
                border-radius: 6px;
                margin-bottom: 20px;
                font-size: 12px;
                color: var(--text-secondary);
            ">
                ℹ️ Essas informações aparecerão em todos os backups (JSON, TXT, Markdown)
            </div>

            <form id="system-config-form">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                    <div>
                        <label style="display: block; margin-bottom: 5px; font-weight: bold; color: var(--text-primary);">
                            📌 Versão do Sistema
                        </label>
                        <input 
                            type="text" 
                            id="configVersion" 
                            placeholder="Ex: 1.1.1"
                            value="${systemInfo.version || '1.1.1'}"
                            style="
                                width: 100%;
                                padding: 8px;
                                border: 2px solid var(--accent-primary);
                                border-radius: 6px;
                                background: var(--bg-tertiary);
                                color: var(--text-primary);
                                font-size: 14px;
                                box-sizing: border-box;
                            "
                        />
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: 5px; font-weight: bold; color: var(--text-primary);">
                            🎯 Nome do Sistema
                        </label>
                        <input 
                            type="text" 
                            id="configSystemName" 
                            placeholder="Ex: Auto Gerenciamento Zenfisio"
                            value="${systemInfo.name || ''}"
                            style="
                                width: 100%;
                                padding: 8px;
                                border: 2px solid var(--accent-primary);
                                border-radius: 6px;
                                background: var(--bg-tertiary);
                                color: var(--text-primary);
                                font-size: 14px;
                                box-sizing: border-box;
                            "
                        />
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                    <div>
                        <label style="display: block; margin-bottom: 5px; font-weight: bold; color: var(--text-primary);">
                            👨‍💻 Desenvolvedor
                        </label>
                        <input 
                            type="text" 
                            id="configDeveloper" 
                            placeholder="Ex: GameDev Necromante96Official (Lucas Tavares)"
                            value="${systemInfo.developer?.name || ''}"
                            style="
                                width: 100%;
                                padding: 8px;
                                border: 2px solid var(--accent-secondary);
                                border-radius: 6px;
                                background: var(--bg-tertiary);
                                color: var(--text-primary);
                                font-size: 14px;
                                box-sizing: border-box;
                            "
                        />
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: 5px; font-weight: bold; color: var(--text-primary);">
                            👩‍💼 Diretora Autorizante
                        </label>
                        <input 
                            type="text" 
                            id="configDirector" 
                            placeholder="Ex: Fernanda Tambosi Varella"
                            value="${systemInfo.director?.name || ''}"
                            style="
                                width: 100%;
                                padding: 8px;
                                border: 2px solid var(--accent-secondary);
                                border-radius: 6px;
                                background: var(--bg-tertiary);
                                color: var(--text-primary);
                                font-size: 14px;
                                box-sizing: border-box;
                            "
                        />
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                    <div>
                        <label style="display: block; margin-bottom: 5px; font-weight: bold; color: var(--text-primary);">
                            🏥 Instituição Parceira
                        </label>
                        <input 
                            type="text" 
                            id="configInstitution" 
                            placeholder="Ex: ESEFID/UFRGS - Clínica de Fisioterapia"
                            value="${systemInfo.institution?.name || ''}"
                            style="
                                width: 100%;
                                padding: 8px;
                                border: 2px solid var(--accent-tertiary);
                                border-radius: 6px;
                                background: var(--bg-tertiary);
                                color: var(--text-primary);
                                font-size: 14px;
                                box-sizing: border-box;
                            "
                        />
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: 5px; font-weight: bold; color: var(--text-primary);">
                            🎓 Universidade
                        </label>
                        <input 
                            type="text" 
                            id="configUniversity" 
                            placeholder="Ex: UFRGS - Universidade Federal do Rio Grande do Sul"
                            value="${systemInfo.university?.name || ''}"
                            style="
                                width: 100%;
                                padding: 8px;
                                border: 2px solid var(--accent-tertiary);
                                border-radius: 6px;
                                background: var(--bg-tertiary);
                                color: var(--text-primary);
                                font-size: 14px;
                                box-sizing: border-box;
                            "
                        />
                    </div>
                </div>

                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: bold; color: var(--text-primary);">
                        © Copyright/Propriedade Intelectual
                    </label>
                    <input 
                        type="text" 
                        id="configCopyright" 
                        placeholder="Ex: © 2025 Lucas Tavares. Todos os direitos reservados."
                        value="${systemInfo.copyright || ''}"
                        style="
                            width: 100%;
                            padding: 8px;
                            border: 2px solid var(--accent-primary);
                            border-radius: 6px;
                            background: var(--bg-tertiary);
                            color: var(--text-primary);
                            font-size: 14px;
                            box-sizing: border-box;
                        "
                    />
                </div>

                <div style="
                    background: var(--bg-secondary);
                    padding: 12px;
                    border-radius: 6px;
                    margin-bottom: 20px;
                    border: 1px solid var(--accent-primary);
                ">
                    <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 8px;">
                        ✅ Prévia das informações que aparecerão nos backups:
                    </div>
                    <div id="configPreview" style="
                        font-size: 11px;
                        color: var(--text-secondary);
                        font-family: monospace;
                        line-height: 1.6;
                    "></div>
                </div>

                <div style="display: flex; gap: 10px; justify-content: flex-end;">
                    <button 
                        type="button" 
                        id="resetConfigBtn" 
                        style="
                            padding: 10px 20px;
                            border: 2px solid var(--accent-secondary);
                            background: var(--bg-secondary);
                            color: var(--text-primary);
                            border-radius: 6px;
                            cursor: pointer;
                            font-weight: bold;
                            transition: all 0.2s;
                        "
                    >
                        🔄 Resetar
                    </button>
                    <button 
                        type="submit" 
                        style="
                            padding: 10px 20px;
                            border: 2px solid var(--accent-primary);
                            background: var(--accent-primary);
                            color: white;
                            border-radius: 6px;
                            cursor: pointer;
                            font-weight: bold;
                            transition: all 0.2s;
                        "
                    >
                        ✅ Salvar Configurações
                    </button>
                </div>
            </form>
        `;

        modal.appendChild(content);
        document.body.appendChild(modal);

        // Listeners
        document.getElementById('close-system-config').addEventListener('click', () => {
            modal.remove();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });

        // Preview
        const previewFn = () => this.updatePreview();
        ['configVersion', 'configSystemName', 'configDeveloper', 'configDirector', 'configInstitution', 'configUniversity'].forEach(id => {
            document.getElementById(id)?.addEventListener('input', previewFn);
        });

        // Form submit
        document.getElementById('system-config-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveConfiguration();
            modal.remove();
        });

        // Reset button
        document.getElementById('resetConfigBtn')?.addEventListener('click', () => {
            this.resetToDefaults();
        });

        // Atualiza preview inicial
        this.updatePreview();
    }

    /**
     * Atualiza preview
     */
    updatePreview() {
        const preview = document.getElementById('configPreview');
        if (!preview) return;

        const version = document.getElementById('configVersion')?.value || 'N/A';
        const system = document.getElementById('configSystemName')?.value || 'N/A';
        const developer = document.getElementById('configDeveloper')?.value || 'N/A';
        const director = document.getElementById('configDirector')?.value || 'N/A';
        const institution = document.getElementById('configInstitution')?.value || 'N/A';
        const university = document.getElementById('configUniversity')?.value || 'N/A';

        preview.innerHTML = `
Sistema: ${system} (v${version})<br>
Desenvolvedor: ${developer}<br>
Diretora: ${director}<br>
Instituição: ${institution}<br>
Universidade: ${university}
        `;
    }

    /**
     * Salva configuração
     */
    saveConfiguration() {
        const config = {
            version: document.getElementById('configVersion')?.value || '1.1.1',
            name: document.getElementById('configSystemName')?.value || 'Zenfisio Auto Gerenciamento',
            developer: {
                name: document.getElementById('configDeveloper')?.value || 'Desconhecido'
            },
            director: {
                name: document.getElementById('configDirector')?.value || 'Não informada'
            },
            institution: {
                name: document.getElementById('configInstitution')?.value || 'Zenfisio'
            },
            university: {
                name: document.getElementById('configUniversity')?.value || 'Não informada'
            },
            copyright: document.getElementById('configCopyright')?.value || '© 2025 Zenfisio. Todos os direitos reservados.'
        };

        // Atualiza global
        window.SYSTEM_INFO = { ...window.SYSTEM_INFO, ...config };

        // Salva no localStorage
        localStorage.setItem('systemConfig', JSON.stringify(config));

        console.log('✅ Configurações salvas:', config);

        // Notificação
        if (window.notify) {
            window.notify.show('✅ Configurações salvas com sucesso!', 'success', 3000);
        } else if (window.notificationSystem) {
            window.notificationSystem.show('✅ Configurações salvas com sucesso!', 'success', 3000);
        } else {
            alert('✅ Configurações salvas com sucesso!');
        }
    }

    /**
     * Reseta para valores padrão
     */
    resetToDefaults() {
        document.getElementById('configVersion').value = '1.1.1';
        document.getElementById('configSystemName').value = 'Auto Gerenciamento Zenfisio';
        document.getElementById('configDeveloper').value = 'GameDev Necromante96Official (Lucas Tavares Mattos)';
        document.getElementById('configDirector').value = 'Fernanda Tambosi Varella';
        document.getElementById('configInstitution').value = 'ESEFID/UFRGS - Clínica de Fisioterapia';
        document.getElementById('configUniversity').value = 'UFRGS - Universidade Federal do Rio Grande do Sul';
        document.getElementById('configCopyright').value = '© 2025 Lucas Tavares. Todos os direitos reservados.';
        
        this.updatePreview();
    }
}

// Inicializa ao carregar
document.addEventListener('DOMContentLoaded', () => {
    // Carrega config do localStorage se existir
    const savedConfig = localStorage.getItem('systemConfig');
    if (savedConfig) {
        try {
            const config = JSON.parse(savedConfig);
            window.SYSTEM_INFO = { ...window.SYSTEM_INFO, ...config };
            console.log('✅ Configurações carregadas do localStorage');
        } catch (e) {
            console.warn('⚠️ Erro ao carregar configurações:', e);
        }
    }

    // Inicializa modal - DESATIVADO
    // new SystemConfigModal();
});
