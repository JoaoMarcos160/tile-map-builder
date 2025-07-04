// Estado global da aplicação
class TileMapBuilder {
    constructor() {
        this.mapWidth = 16;
        this.mapHeight = 16;
        this.currentTexture = null;
        this.textures = [];
        this.neighborhoodRules = {};
        this.mapData = [];
        this.tileElements = [];
        
        this.initializeDefaultTextures();
        this.initializeEventListeners();
        this.generateMap();
        this.updateDisplay();
    }

    // Inicializar texturas padrão
    initializeDefaultTextures() {
        const defaultTextures = [
            { id: 'grass', name: 'Grama', color: '#4CAF50' },
            { id: 'sand', name: 'Areia', color: '#F4A460' },
            { id: 'water', name: 'Água', color: '#2196F3' }
        ];

        defaultTextures.forEach(texture => {
            this.textures.push(texture);
        });

        // Regras padrão de vizinhança
        this.neighborhoodRules = {
            'grass': ['grass', 'sand'],
            'sand': ['grass', 'sand', 'water'],
            'water': ['sand', 'water']
        };
    }

    // Inicializar event listeners
    initializeEventListeners() {
        // Configurações do mapa
        document.getElementById('mapWidth').addEventListener('change', (e) => {
            this.mapWidth = parseInt(e.target.value);
            this.updateMapSizeDisplay();
        });

        document.getElementById('mapHeight').addEventListener('change', (e) => {
            this.mapHeight = parseInt(e.target.value);
            this.updateMapSizeDisplay();
        });

        document.getElementById('generateMap').addEventListener('click', () => {
            this.generateMap();
        });

        // Ferramentas
        document.getElementById('clearMap').addEventListener('click', () => {
            this.clearMap();
        });

        document.getElementById('randomFill').addEventListener('click', () => {
            this.randomFillMap();
        });

        document.getElementById('exportMap').addEventListener('click', () => {
            this.exportMap();
        });

        // Modal de textura
        document.getElementById('addTexture').addEventListener('click', () => {
            this.openTextureModal();
        });

        document.getElementById('saveTexture').addEventListener('click', () => {
            this.saveTexture();
        });

        document.getElementById('cancelTexture').addEventListener('click', () => {
            this.closeTextureModal();
        });

        // Modal de regras
        document.getElementById('saveRules').addEventListener('click', () => {
            this.saveRules();
        });

        document.getElementById('cancelRules').addEventListener('click', () => {
            this.closeRulesModal();
        });

        // Fechar modais
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => {
                e.target.closest('.modal').style.display = 'none';
            });
        });

        // Fechar modal clicando fora
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
            }
        });
    }

    // Gerar o grid do mapa
    generateMap() {
        const mapGrid = document.getElementById('mapGrid');
        mapGrid.innerHTML = '';
        mapGrid.style.gridTemplateColumns = `repeat(${this.mapWidth}, 1fr)`;
        
        // Inicializar dados do mapa
        this.mapData = Array(this.mapHeight).fill().map(() => Array(this.mapWidth).fill(null));
        this.tileElements = [];

        // Criar tiles
        for (let y = 0; y < this.mapHeight; y++) {
            const row = [];
            for (let x = 0; x < this.mapWidth; x++) {
                const tile = document.createElement('div');
                tile.className = 'tile';
                tile.dataset.x = x;
                tile.dataset.y = y;
                
                tile.addEventListener('click', () => {
                    this.placeTile(x, y);
                });

                tile.addEventListener('mouseenter', () => {
                    this.previewTilePlacement(x, y);
                });

                tile.addEventListener('mouseleave', () => {
                    this.clearPreview();
                });

                mapGrid.appendChild(tile);
                row.push(tile);
            }
            this.tileElements.push(row);
        }

        this.updateMapSizeDisplay();
        this.updateTileCount();
    }

    // Colocar tile no mapa
    placeTile(x, y) {
        if (!this.currentTexture) {
            this.showMessage('Selecione uma textura primeiro!', 'warning');
            return;
        }

        // Verificar regras de vizinhança
        if (!this.isValidPlacement(x, y, this.currentTexture.id)) {
            this.showMessage('Posicionamento inválido! Verifique as regras de vizinhança.', 'error');
            this.animateInvalidPlacement(x, y);
            return;
        }

        // Colocar a textura
        this.mapData[y][x] = this.currentTexture.id;
        this.tileElements[y][x].style.backgroundColor = this.currentTexture.color;
        this.tileElements[y][x].classList.remove('invalid', 'valid-placement');
        
        this.updateTileCount();
        this.showMessage(`${this.currentTexture.name} colocada em (${x}, ${y})`, 'success');
    }

    // Verificar se o posicionamento é válido
    isValidPlacement(x, y, textureId) {
        const allowedNeighbors = this.neighborhoodRules[textureId] || [];
        
        // Verificar todos os vizinhos (4 direções)
        const directions = [
            { dx: 0, dy: -1 }, // cima
            { dx: 1, dy: 0 },  // direita
            { dx: 0, dy: 1 },  // baixo
            { dx: -1, dy: 0 }  // esquerda
        ];

        for (const dir of directions) {
            const nx = x + dir.dx;
            const ny = y + dir.dy;

            // Verificar se está dentro dos limites
            if (nx >= 0 && nx < this.mapWidth && ny >= 0 && ny < this.mapHeight) {
                const neighborTexture = this.mapData[ny][nx];
                
                // Se há um vizinho e não está na lista de permitidos
                if (neighborTexture && !allowedNeighbors.includes(neighborTexture)) {
                    return false;
                }

                // Verificar se o vizinho permite esta textura
                if (neighborTexture) {
                    const neighborAllowed = this.neighborhoodRules[neighborTexture] || [];
                    if (!neighborAllowed.includes(textureId)) {
                        return false;
                    }
                }
            }
        }

        return true;
    }

    // Preview do posicionamento
    previewTilePlacement(x, y) {
        if (!this.currentTexture) return;

        this.clearPreview();
        
        if (this.isValidPlacement(x, y, this.currentTexture.id)) {
            this.tileElements[y][x].classList.add('valid-placement');
        } else {
            this.tileElements[y][x].classList.add('invalid');
        }
    }

    // Limpar preview
    clearPreview() {
        this.tileElements.forEach(row => {
            row.forEach(tile => {
                tile.classList.remove('valid-placement', 'invalid');
            });
        });
    }

    // Animar posicionamento inválido
    animateInvalidPlacement(x, y) {
        const tile = this.tileElements[y][x];
        tile.classList.add('invalid');
        setTimeout(() => {
            tile.classList.remove('invalid');
        }, 500);
    }

    // Limpar mapa
    clearMap() {
        this.mapData = Array(this.mapHeight).fill().map(() => Array(this.mapWidth).fill(null));
        this.tileElements.forEach(row => {
            row.forEach(tile => {
                tile.style.backgroundColor = '';
                tile.classList.remove('invalid', 'valid-placement');
            });
        });
        this.updateTileCount();
        this.showMessage('Mapa limpo!', 'info');
    }

    // Preenchimento aleatório respeitando regras
    randomFillMap() {
        this.clearMap();
        
        const maxAttempts = this.mapWidth * this.mapHeight * 10;
        let attempts = 0;
        let placedTiles = 0;
        const targetTiles = Math.floor(this.mapWidth * this.mapHeight * 0.7); // 70% do mapa

        while (placedTiles < targetTiles && attempts < maxAttempts) {
            const x = Math.floor(Math.random() * this.mapWidth);
            const y = Math.floor(Math.random() * this.mapHeight);
            
            if (this.mapData[y][x] === null) {
                const randomTexture = this.textures[Math.floor(Math.random() * this.textures.length)];
                
                if (this.isValidPlacement(x, y, randomTexture.id)) {
                    this.mapData[y][x] = randomTexture.id;
                    this.tileElements[y][x].style.backgroundColor = randomTexture.color;
                    placedTiles++;
                }
            }
            attempts++;
        }

        this.updateTileCount();
        this.showMessage(`Preenchimento aleatório concluído! ${placedTiles} tiles colocados.`, 'success');
    }

    // Exportar mapa
    exportMap() {
        const mapExport = {
            width: this.mapWidth,
            height: this.mapHeight,
            textures: this.textures,
            rules: this.neighborhoodRules,
            data: this.mapData
        };

        const dataStr = JSON.stringify(mapExport, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `mapa_tiles_${this.mapWidth}x${this.mapHeight}.json`;
        link.click();

        this.showMessage('Mapa exportado com sucesso!', 'success');
    }

    // Abrir modal de textura
    openTextureModal() {
        document.getElementById('textureName').value = '';
        document.getElementById('textureColor').value = '#4CAF50';
        this.updateNeighborOptions();
        document.getElementById('textureModal').style.display = 'block';
    }

    // Fechar modal de textura
    closeTextureModal() {
        document.getElementById('textureModal').style.display = 'none';
    }

    // Salvar nova textura
    saveTexture() {
        const name = document.getElementById('textureName').value.trim();
        const color = document.getElementById('textureColor').value;

        if (!name) {
            this.showMessage('Nome da textura é obrigatório!', 'error');
            return;
        }

        // Verificar se já existe
        if (this.textures.find(t => t.name.toLowerCase() === name.toLowerCase())) {
            this.showMessage('Já existe uma textura com este nome!', 'error');
            return;
        }

        const id = name.toLowerCase().replace(/\s+/g, '_');
        const newTexture = { id, name, color };

        // Obter vizinhos selecionados
        const selectedNeighbors = [];
        document.querySelectorAll('#neighborOptions input[type="checkbox"]:checked').forEach(checkbox => {
            selectedNeighbors.push(checkbox.value);
        });

        this.textures.push(newTexture);
        this.neighborhoodRules[id] = selectedNeighbors;

        // Atualizar regras existentes para incluir a nova textura se selecionada
        this.textures.forEach(texture => {
            if (texture.id !== id && selectedNeighbors.includes(texture.id)) {
                if (!this.neighborhoodRules[texture.id].includes(id)) {
                    this.neighborhoodRules[texture.id].push(id);
                }
            }
        });

        this.updateDisplay();
        this.closeTextureModal();
        this.showMessage(`Textura "${name}" adicionada com sucesso!`, 'success');
    }

    // Atualizar opções de vizinhos
    updateNeighborOptions(excludeId = null) {
        const container = document.getElementById('neighborOptions');
        container.innerHTML = '';

        this.textures.forEach(texture => {
            if (texture.id !== excludeId) {
                const option = document.createElement('div');
                option.className = 'neighbor-option';
                option.innerHTML = `
                    <input type="checkbox" id="neighbor_${texture.id}" value="${texture.id}">
                    <div class="texture-preview" style="background-color: ${texture.color}; width: 20px; height: 20px;"></div>
                    <label for="neighbor_${texture.id}">${texture.name}</label>
                `;
                container.appendChild(option);
            }
        });
    }

    // Abrir modal de edição de regras
    openRulesModal(textureId) {
        const texture = this.textures.find(t => t.id === textureId);
        if (!texture) return;

        document.getElementById('editingTexture').textContent = texture.name;
        document.getElementById('editingTexture').dataset.textureId = textureId;

        const container = document.getElementById('editNeighborOptions');
        container.innerHTML = '';

        this.textures.forEach(t => {
            if (t.id !== textureId) {
                const isChecked = this.neighborhoodRules[textureId]?.includes(t.id) ? 'checked' : '';
                const option = document.createElement('div');
                option.className = 'neighbor-option';
                option.innerHTML = `
                    <input type="checkbox" id="edit_neighbor_${t.id}" value="${t.id}" ${isChecked}>
                    <div class="texture-preview" style="background-color: ${t.color}; width: 20px; height: 20px;"></div>
                    <label for="edit_neighbor_${t.id}">${t.name}</label>
                `;
                container.appendChild(option);
            }
        });

        document.getElementById('rulesModal').style.display = 'block';
    }

    // Fechar modal de regras
    closeRulesModal() {
        document.getElementById('rulesModal').style.display = 'none';
    }

    // Salvar regras editadas
    saveRules() {
        const textureId = document.getElementById('editingTexture').dataset.textureId;
        const selectedNeighbors = [];

        document.querySelectorAll('#editNeighborOptions input[type="checkbox"]:checked').forEach(checkbox => {
            selectedNeighbors.push(checkbox.value);
        });

        this.neighborhoodRules[textureId] = selectedNeighbors;
        this.updateDisplay();
        this.closeRulesModal();
        this.showMessage('Regras atualizadas com sucesso!', 'success');
    }

    // Deletar textura
    deleteTexture(textureId) {
        if (confirm('Tem certeza que deseja deletar esta textura? Todos os tiles desta textura serão removidos do mapa.')) {
            // Remover textura da lista
            this.textures = this.textures.filter(t => t.id !== textureId);
            
            // Remover das regras
            delete this.neighborhoodRules[textureId];
            
            // Remover das regras de outras texturas
            Object.keys(this.neighborhoodRules).forEach(key => {
                this.neighborhoodRules[key] = this.neighborhoodRules[key].filter(id => id !== textureId);
            });

            // Remover do mapa
            for (let y = 0; y < this.mapHeight; y++) {
                for (let x = 0; x < this.mapWidth; x++) {
                    if (this.mapData[y][x] === textureId) {
                        this.mapData[y][x] = null;
                        this.tileElements[y][x].style.backgroundColor = '';
                    }
                }
            }

            // Desselecionar se era a textura atual
            if (this.currentTexture && this.currentTexture.id === textureId) {
                this.currentTexture = null;
            }

            this.updateDisplay();
            this.updateTileCount();
            this.showMessage('Textura deletada com sucesso!', 'success');
        }
    }

    // Atualizar display
    updateDisplay() {
        this.updateTextureList();
        this.updateRulesDisplay();
        this.updateCurrentTextureDisplay();
    }

    // Atualizar lista de texturas
    updateTextureList() {
        const container = document.getElementById('textureList');
        container.innerHTML = '';

        this.textures.forEach(texture => {
            const item = document.createElement('div');
            item.className = `texture-item ${this.currentTexture?.id === texture.id ? 'selected' : ''}`;
            item.innerHTML = `
                <div class="texture-preview" style="background-color: ${texture.color}"></div>
                <div class="texture-info">
                    <div class="texture-name">${texture.name}</div>
                </div>
                <div class="texture-actions">
                    <button class="edit-btn" onclick="tileMapBuilder.openRulesModal('${texture.id}')">Editar</button>
                    <button class="delete-btn" onclick="tileMapBuilder.deleteTexture('${texture.id}')">Deletar</button>
                </div>
            `;

            item.addEventListener('click', (e) => {
                if (!e.target.classList.contains('edit-btn') && !e.target.classList.contains('delete-btn')) {
                    this.selectTexture(texture);
                }
            });

            container.appendChild(item);
        });
    }

    // Selecionar textura
    selectTexture(texture) {
        this.currentTexture = texture;
        this.updateTextureList();
        this.updateCurrentTextureDisplay();
    }

    // Atualizar display da textura atual
    updateCurrentTextureDisplay() {
        const display = document.getElementById('currentTexture');
        display.textContent = this.currentTexture ? this.currentTexture.name : 'Nenhuma';
    }

    // Atualizar display das regras
    updateRulesDisplay() {
        const container = document.getElementById('rulesDisplay');
        container.innerHTML = '';

        this.textures.forEach(texture => {
            const neighbors = this.neighborhoodRules[texture.id] || [];
            const neighborNames = neighbors.map(id => {
                const neighborTexture = this.textures.find(t => t.id === id);
                return neighborTexture ? neighborTexture.name : id;
            }).join(', ');

            const rule = document.createElement('div');
            rule.className = 'rule-item';
            rule.innerHTML = `
                <div class="rule-texture">${texture.name}</div>
                <div class="rule-neighbors">Vizinhos: ${neighborNames || 'Nenhum'}</div>
            `;
            container.appendChild(rule);
        });
    }

    // Atualizar display do tamanho do mapa
    updateMapSizeDisplay() {
        document.getElementById('mapSize').textContent = `Tamanho: ${this.mapWidth}x${this.mapHeight}`;
    }

    // Atualizar contagem de tiles
    updateTileCount() {
        let filledTiles = 0;
        this.mapData.forEach(row => {
            row.forEach(cell => {
                if (cell !== null) filledTiles++;
            });
        });

        const totalTiles = this.mapWidth * this.mapHeight;
        document.getElementById('tileCount').textContent = `Tiles: ${filledTiles}/${totalTiles}`;
    }

    // Mostrar mensagem
    showMessage(message, type = 'info') {
        // Criar elemento de notificação
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
            max-width: 300px;
        `;

        // Cores por tipo
        const colors = {
            success: '#4CAF50',
            error: '#f44336',
            warning: '#ff9800',
            info: '#2196F3'
        };

        notification.style.backgroundColor = colors[type] || colors.info;

        document.body.appendChild(notification);

        // Remover após 3 segundos
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Adicionar estilos para notificações
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(notificationStyles);

// Inicializar aplicação quando o DOM estiver carregado
let tileMapBuilder;
document.addEventListener('DOMContentLoaded', () => {
    tileMapBuilder = new TileMapBuilder();
});
