/// <reference types="cypress" />

describe('Página de Login - Portal Escolar', () => {
  beforeEach(() => {
    cy.visit('/pages/login.html')
    // Garante que o DOM carregou e o JS executou
    cy.get('[data-testid="login-form"]').should('exist')
  })

  it('01 - Deve carregar todos os elementos da página', () => {
    cy.get('[data-testid="login-page"]').should('be.visible')
    cy.get('.login-brand h1').should('have.text', 'Portal Escolar')
    cy.get('[data-testid="login-email-input"]').should('be.visible')
    cy.get('[data-testid="login-password-input"]').should('be.visible')
    cy.get('[data-testid="login-submit-btn"]').should('be.visible')
    cy.get('[data-testid="test-accounts-section"]').should('be.visible')

    // Força visibilidade ignorando overflow (funciona 100%)
    cy.get('[data-testid="fill-admin-btn"]', { timeout: 10000 })
      .scrollIntoView()
      .should('be.visible')
      .and('contain', 'Login Rápido')
  })

  it('02 - Login rápido com botão Admin', () => {
    cy.get('[data-testid="fill-admin-btn"]').scrollIntoView().click()
    cy.get('[data-testid="login-submit-btn"]').click()

    cy.get('#login-message', { timeout: 10000 })
      .should('be.visible')
      .and('have.class', 'alert-success')
      .and('contain.text', 'Login bem-sucedcido')

    cy.url({ timeout: 10000 }).should('include', 'dashboard.html')
  })

  it('03 - Login rápido com botão Professor', () => {
    cy.get('[data-testid="fill-teacher-btn"]').scrollIntoView().click()
    cy.get('[data-testid="login-submit-btn"]').click()
    cy.url({ timeout: 10000 }).should('include', 'dashboard.html')
  })

  it('04 - Login rápido com botão Aluno', () => {
    cy.get('[data-testid="fill-student-btn"]').scrollIntoView().click()
    cy.get('[data-testid="login-submit-btn"]').click()
    cy.url({ timeout: 10000 }).should('include', 'dashboard.html')
  })

  it('05 - Login manual com credenciais válidas', () => {
    cy.get('[data-testid="login-email-input"]').type('admin@escola.com')
    cy.get('[data-testid="login-password-input"]').type('admin123')
    cy.get('[data-testid="login-submit-btn"]').click()

    cy.get('#login-message', { timeout: 10000 })
      .should('be.visible')
      .and('contain.text', 'Login bem-sucedido')

    cy.url({ timeout: 10000 }).should('include', 'dashboard.html')
  })

  it('06 - Deve mostrar erro com credenciais inválidas', () => {
    cy.get('[data-testid="login-email-input"]').type('invalido@x.com')
    cy.get('[data-testid="login-password-input"]').type('errado')
    cy.get('[data-testid="login-submit-btn"]').click()

    cy.get('#login-message', { timeout: 10000 })
      .should('be.visible')
      .and('have.class', 'alert-error')
      .and('contain.text', 'Email ou senha incorretos')
  })

  it('07 - Deve validar campos obrigatórios', () => {
    cy.get('[data-testid="login-submit-btn"]').click()
    cy.get('#login-message', { timeout: 10000 })
      .should('be.visible')
      .and('contain.text', 'Por favor, preencha todos os campos')
  })

  it('08 - Botão mostrar/esconder senha funciona', () => {
    cy.get('[data-testid="login-password-input"]').type('123456')
    cy.get('#toggle-password-btn').click()
    cy.get('[data-testid="login-password-input"]').should('have.attr', 'type', 'text')
    cy.get('#toggle-password-btn').click()
    cy.get('[data-testid="login-password-input"]').should('have.attr', 'type', 'password')
  })

  it('09 - Checkbox "Lembrar-me" salva o email', () => {
    cy.get('[data-testid="login-email-input"]').type('admin@escola.com')
    cy.get('#remember-me').check()
    cy.reload()

    cy.get('[data-testid="login-email-input"]').should('have.value', 'admin@escola.com')
    cy.get('#remember-me').should('be.checked')
  })

  it('10 - Usuário já logado é redirecionado automaticamente', () => {
    cy.setCookie('authenticated', 'true') // ou use localStorage
    cy.window().then(win => {
      win.localStorage.setItem('currentUser', JSON.stringify({ email: 'admin@escola.com' }))
    })
    cy.visit('/pages/login.html')

    cy.get('#login-message', { timeout: 10000 })
      .should('contain.text', 'Você já está logado')

    cy.url({ timeout: 10000 }).should('include', 'dashboard.html')
  })

  it('11 - Navegação para cadastro funciona', () => {
    cy.get('[data-testid="go-to-register-btn"]').click()
    cy.url().should('include', 'register.html')
  })

  it('12 - Link "Esqueci a senha" mostra mensagem', () => {
    cy.get('[data-testid="forgot-password-link"]').click()
    cy.get('#login-message', { timeout: 10000 })
      .should('contain.text', 'Funcionalidade em desenvolvimento')
  })

  it('13 - Responsividade mobile', () => {
    cy.viewport('iphone-x')
    cy.get('[data-testid="login-form"]').should('be.visible')
    cy.get('[data-testid="test-accounts-section"]').scrollIntoView().should('be.visible')
  })
})

// Comando customizado
Cypress.Commands.add('login', (email, password) => {
  cy.get('[data-testid="login-email-input"]').type(email)
  cy.get('[data-testid="login-password-input"]').type(password)
  cy.get('[data-testid="login-submit-btn"]').click()
  cy.url({ timeout: 10000 }).should('include', 'dashboard.html')
})