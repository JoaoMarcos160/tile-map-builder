# Construtor de Mapas de Tiles

Uma aplicação web interativa para criar mapas de tiles com sistema de regras de vizinhança configuráveis.

## Funcionalidades

### 🗺️ Criação de Mapas
- **Tamanho Configurável**: Defina mapas de 4x4 até 32x32 tiles
- **Grid Interativo**: Clique nos tiles para aplicar texturas
- **Preview em Tempo Real**: Visualize se o posicionamento é válido antes de confirmar

### 🎨 Sistema de Texturas
- **Texturas Padrão**: Grama (verde), Areia (laranja) e Água (azul)
- **Adicionar Texturas**: Crie novas texturas com nome e cor personalizados
- **Editar/Deletar**: Gerencie suas texturas facilmente

### 📋 Regras de Vizinhança
- **Configuração Flexível**: Defina quais texturas podem ser vizinhas
- **Validação Automática**: O sistema impede posicionamentos inválidos
- **Regras Padrão**:
  - **Grama**: Pode estar ao lado de Grama e Areia
  - **Areia**: Pode estar ao lado de Grama, Areia e Água
  - **Água**: Pode estar ao lado de Areia e Água

### 🛠️ Ferramentas
- **Limpar Mapa**: Remove todos os tiles do mapa
- **Preenchimento Aleatório**: Preenche o mapa automaticamente respeitando as regras
- **Exportar Mapa**: Salva o mapa em formato JSON

## Como Usar

### 1. Configuração Inicial
1. Abra o arquivo `index.html` em seu navegador
2. Defina o tamanho do mapa (largura e altura)
3. Clique em "Gerar Mapa" para criar o grid

### 2. Selecionando Texturas
1. No painel "Texturas Disponíveis", clique na textura desejada
2. A textura selecionada aparecerá no cabeçalho do mapa
3. Tiles válidos aparecerão com borda verde, inválidos com borda vermelha

### 3. Colocando Tiles
1. Com uma textura selecionada, clique em qualquer tile do mapa
2. Se o posicionamento for válido, o tile será colorido
3. Se inválido, uma mensagem de erro aparecerá

### 4. Adicionando Novas Texturas
1. Clique em "+ Adicionar Textura"
2. Preencha o nome e escolha uma cor
3. Selecione quais texturas podem ser vizinhas
4. Clique em "Salvar"

### 5. Editando Regras
1. Clique no botão "Editar" ao lado de qualquer textura
2. Marque/desmarque as texturas vizinhas permitidas
3. Clique em "Salvar" para aplicar as mudanças

### 6. Ferramentas Úteis
- **Preenchimento Aleatório**: Gera um mapa automaticamente respeitando todas as regras
- **Limpar Mapa**: Remove todos os tiles para começar do zero
- **Exportar Mapa**: Salva o mapa atual em formato JSON

## Exemplos de Uso

### Cenário 1: Mapa de Ilha
1. Use Água ao redor das bordas
2. Coloque Areia como transição
3. Preencha o centro com Grama

### Cenário 2: Mapa de Deserto
1. Adicione textura "Rocha" que só pode estar ao lado de Areia
2. Use principalmente Areia
3. Adicione Rochas esparsas

### Cenário 3: Mapa de Floresta
1. Use principalmente Grama
2. Adicione textura "Árvore" que só pode estar ao lado de Grama
3. Crie clareiras e caminhos

## Estrutura de Arquivos

```
construtor-mapas-tiles/
├── index.html          # Página principal
├── style.css           # Estilos e animações
├── script.js           # Lógica da aplicação
└── README.md           # Este arquivo
```

## Tecnologias Utilizadas

- **HTML5**: Estrutura da página
- **CSS3**: Estilos, animações e responsividade
- **JavaScript ES6+**: Lógica da aplicação e interatividade

## Compatibilidade

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+
- 📱 Responsivo para dispositivos móveis

## Recursos Avançados

### Sistema de Notificações
- Feedback visual para todas as ações
- Mensagens de sucesso, erro e informação
- Animações suaves de entrada e saída

### Interface Responsiva
- Adaptável a diferentes tamanhos de tela
- Layout otimizado para desktop e mobile
- Controles touch-friendly

### Validação Inteligente
- Verificação em tempo real das regras
- Preview visual antes do posicionamento
- Prevenção de estados inválidos

## Dicas de Uso

1. **Comece Simples**: Use as texturas padrão para entender o sistema
2. **Teste as Regras**: Experimente diferentes combinações de vizinhança
3. **Use o Preenchimento Aleatório**: Ótimo para gerar ideias e testar regras
4. **Exporte Regularmente**: Salve seus mapas favoritos
5. **Experimente Tamanhos**: Mapas menores são ótimos para testes, maiores para projetos complexos

## Solução de Problemas

### Tile Não Coloca
- Verifique se uma textura está selecionada
- Confirme se o posicionamento respeita as regras de vizinhança

### Preenchimento Aleatório Não Funciona
- Verifique se as regras não são muito restritivas
- Tente com um mapa menor primeiro

### Modal Não Abre
- Recarregue a página
- Verifique se o JavaScript está habilitado

---

**Desenvolvido com ❤️ para criadores de mapas e entusiastas de game design!**
