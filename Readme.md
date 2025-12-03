# Portal Escolar - Sistema para Testes QA

Sistema web completo para gestão escolar, desenvolvido especificamente para treinamento de testes automatizados de QA.

## 🎯 Objetivo

Fornecer uma aplicação realista com todos os elementos necessários para praticar diferentes tipos de testes automatizados:
- Testes de Login/Logout
- Testes de CRUD (Alunos, Professores)
- Testes de Formulários
- Testes de Validação
- Testes de Tabelas (busca, paginação, ordenação)
- Testes de UI/UX
- Testes de Performance
- Testes de Responsividade

## 🏗️ Estrutura do Projeto

---
```text

## 🚀 Funcionalidades

### 1. **Autenticação**
- Login com validação de email/senha
- Cadastro de alunos e professores
- Controle de sessão com localStorage
- Logout seguro

### 2. **Dashboard**
- Menu lateral responsivo
- Cards com estatísticas
- Gráficos (simulados)
- Tabelas com últimos registros
- Calendário interativo

### 3. **Gerenciamento de Alunos**
- CRUD completo (Create, Read, Update, Delete)
- Tabela com busca, filtro e ordenação
- Paginação dinâmica
- Seleção múltipla
- Exportação de dados
- Modal de confirmação

### 4. **Gerenciamento de Professores**
- CRUD completo
- Filtros por formação e status
- Validação de formulários
- Upload de foto (simulado)

### 5. **Cursos Disponíveis**
- Engenharia de Software
- Ciência da Computação
- Análise e Desenvolvimento de Sistemas (ADS)
- Sistemas de Informação

### 6. **Validações**
- Email válido
- CPF formatado
- Data de nascimento
- Campos obrigatórios
- Força da senha
- Confirmação de senha

## 🧪 Elementos para Testes Automatizados

### IDs e Data Attributes
- Todos os elementos importantes possuem `data-testid`
- IDs consistentes para seletores CSS
- Classes semânticas para seleção

### Exemplos de Seletores:
```javascript
// Cypress
cy.get('[data-testid="login-email-input"]')
cy.get('#login-submit-btn')
cy.get('.btn-primary')
```
---
# Cenários de Teste Prontos:
1.Login
```bash
// Teste de login bem-sucedido
cy.get('[data-testid="login-email-input"]').type('admin@escola.com')
cy.get('[data-testid="login-password-input"]').type('admin123')
cy.get('[data-testid="login-submit-btn"]').click()
cy.url().should('include', '/dashboard.html')
```
---

2. Cadastro de Aluno
```bash
// Teste de cadastro com validação
cy.get('[data-testid="tab-aluno"]').click()
cy.get('[data-testid="aluno-nome-input"]').type('Novo Aluno')
cy.get('[data-testid="aluno-email-input"]').type('novo@aluno.com')
cy.get('[data-testid="cadastrar-aluno-btn"]').click()
cy.get('[data-testid="success-modal"]').should('be.visible')
```
---
3. CRUD de Alunos
```bash
// Adicionar aluno
cy.get('[data-testid="add-aluno-btn"]').click()
cy.get('[data-testid="modal-nome-input"]').type('Aluno Teste')
// ... preencher outros campos
cy.get('[data-testid="save-aluno-btn"]').click()

// Editar aluno
cy.get('[data-testid="edit-aluno-1"]').click()
cy.get('[data-testid="modal-nome-input"]').clear().type('Aluno Editado')
cy.get('[data-testid="save-aluno-btn"]').click()

// Excluir aluno
cy.get('[data-testid="delete-aluno-1"]').click()
cy.get('[data-testid="confirm-delete-btn"]').click()
```
---
4. Validações
```bash
// Teste de validação de email
cy.get('[data-testid="aluno-email-input"]').type('email-invalido')
cy.get('[data-testid="aluno-email-error"]').should('be.visible')

// Teste de campo obrigatório
cy.get('[data-testid="aluno-nome-input"]').clear().blur()
cy.get('[data-testid="aluno-nome-error"]').should('be.visible')
```
---

🛠️ Tecnologias Utilizadas

- HTML5: Estrutura semântica

- CSS3: Flexbox, Grid, Variáveis CSS

- JavaScript Vanilla: ES6+

- Font Awesome: Ícones

- LocalStorage: Persistência de dados

- Responsive Design: Mobile-first


🧪 Tipos de Testes Suportados

Testes Funcionais

- Login/Logout

- Cadastro de usuários

- CRUD completo

- Validação de formulários

- Navegação entre páginas

- Busca e filtros

- Paginação

Testes de UI

- Responsividade

- Acessibilidade (atributos aria)

- Estados hover/focus

- Modal e popups

- Mensagens de erro/sucesso

Testes de Performance

- Carregamento de páginas

- Renderização de tabelas

- Operações em massa

Testes de Integração

- Fluxo completo: Login → Dashboard → CRUD

- Persistência de dados

- Sessão do usuário

---

🐛 Issues Conhecidos (Para Prática de Debug)

- Validação de CPF: Implementação simplificada para testes

- Upload de Arquivos: Simulado para testes de UI

- Performance: Algumas operações podem ser lentas em grande volume (para testes de performance)

- Cross-browser: Otimizado para Chrome, mas testável em outros

---

🤝 Contribuindo

- Este projeto é para fins educacionais. Sinta-se à vontade para:

- Adicionar novas funcionalidades

- Melhorar os testes existentes

- Corrigir bugs

- Adicionar mais cenários de teste

---

Este portal escolar está completamente funcional e otimizado para testes QA, com:

✅ IDs e classes claros para automação

✅ Validação visual completa

✅ Tabelas dinâmicas com busca e paginação

✅ Modal de confirmação

✅ Persistência com localStorage

✅ Design responsivo

✅ Cursos especificados (Engenharia de Software, Ciência da Computação, ADS, Sistemas de Informação)

✅ Separação em pastas organizadas

✅ Comentários explicativos no código

---

1. Instruções de Configuração:
```bash
# Na raiz do projeto portal-escolar-qa/
npm init -y
```

2. Instalar dependências:
```bash
npm install --save-dev cypress jest @testing-library/dom @testing-library/jest-dom eslint prettier husky lint-staged live-server
```


📄 Licença
MIT License - Use para fins educacionais e de treinamento.

---
Autora: Thayse Dias
** EM CONSTRUÇÃO **
