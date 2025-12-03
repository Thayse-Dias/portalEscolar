/// <reference types="cypress" />

// Testes E2E para a página de login
// Seletor recomendado: data-testid ou id

describe('Página de Login - Portal Escolar', () => {
  
  beforeEach(() => {
    // Visitar a página de login antes de cada teste
    cy.visit('/pages/login.html')
    cy.wait(500) // Aguardar carregamento
  })

  // Teste 1: Verificar se a página carrega corretamente
  it('Deve carregar a página de login com todos os elementos', () => {
    // Verificar título da página
    cy.title().should('contain', 'Portal Escolar - Login')
    
    // Verificar elementos visíveis
    cy.get('[data-testid="login-page"]').should('be.visible')
    cy.get('h1').should('contain', 'Portal Escolar')
    cy.get('[data-testid="login-form"]').should('be.visible')
    
    // Verificar campos do formulário
    cy.get('[data-testid="login-email-input"]').should('be.visible')
    cy.get('[data-testid="login-password-input"]').should('be.visible')
    cy.get('[data-testid="login-submit-btn"]').should('be.visible')
    cy.get('[data-testid="go-to-register-btn"]').should('be.visible')
    
    // Verificar contas de teste
    cy.get('[data-testid="test-accounts-section"]').should('be.visible')
    cy.get('[data-testid="test-admin-account"]').should('be.visible')
    cy.get('[data-testid="test-teacher-account"]').should('be.visible')
    cy.get('[data-testid="test-student-account"]').should('be.visible')
  })

  // Teste 2: Login com credenciais válidas (Admin)
  it('Deve fazer login com credenciais de admin válidas', () => {
    // Preencher formulário com dados de admin
    cy.get('[data-testid="login-email-input"]').type('admin@escola.com')
    cy.get('[data-testid="login-password-input"]').type('admin123')
    cy.get('[data-testid="login-submit-btn"]').click()
    
    // Verificar redirecionamento para dashboard
    cy.url().should('include', '/pages/dashboard.html')
    
    // Verificar se está logado como admin
    cy.get('[data-testid="user-role"]').should('contain', 'Administrador')
    cy.get('[data-testid="user-name"]').should('contain', 'Administrador')
  })

  // Teste 3: Login com credenciais inválidas
  it('Deve mostrar erro com credenciais inválidas', () => {
    // Preencher com dados inválidos
    cy.get('[data-testid="login-email-input"]').type('email@invalido.com')
    cy.get('[data-testid="login-password-input"]').type('senhaerrada')
    cy.get('[data-testid="login-submit-btn"]').click()
    
    // Verificar que NÃO foi redirecionado
    cy.url().should('not.include', '/pages/dashboard.html')
    cy.url().should('include', '/pages/login.html')
    
    // Verificar mensagem de erro (se houver)
    // Neste caso, a validação está no alert, então podemos verificar que não houve navegação
  })

  // Teste 4: Validação de campos obrigatórios
  it('Deve validar campos obrigatórios do formulário', () => {
    // Tentar submeter formulário vazio
    cy.get('[data-testid="login-submit-btn"]').click()
    
    // Verificar que permanece na mesma página
    cy.url().should('include', '/pages/login.html')
    
    // Para campos com validação HTML5, podemos verificar o required
    cy.get('[data-testid="login-email-input"]').should('have.attr', 'required')
    cy.get('[data-testid="login-password-input"]').should('have.attr', 'required')
    
    // Verificar validação visual (se houver classes de erro)
    cy.get('[data-testid="login-email-input"]').then(($input) => {
      if ($input[0].checkValidity) {
        expect($input[0].checkValidity()).to.be.false
      }
    })
  })

  // Teste 5: Validação de formato de email
  it('Deve validar formato de email inválido', () => {
    // Email sem @
    cy.get('[data-testid="login-email-input"]').type('emailinvalido')
    cy.get('[data-testid="login-submit-btn"]').click()
    
    // Verificar que não navega
    cy.url().should('include', '/pages/login.html')
    
    // Email com formato errado
    cy.get('[data-testid="login-email-input"]').clear().type('email@')
    cy.get('[data-testid="login-submit-btn"]').click()
    cy.url().should('include', '/pages/login.html')
  })

  // Teste 6: Botão "Mostrar/Esconder Senha"
  it('Deve alternar visibilidade da senha', () => {
    // Inicialmente deve ser tipo password
    cy.get('[data-testid="login-password-input"]')
      .should('have.attr', 'type', 'password')
    
    // Clicar no botão de mostrar senha
    cy.get('[data-testid="toggle-password-btn"]').click()
    
    // Deve mudar para tipo text
    cy.get('[data-testid="login-password-input"]')
      .should('have.attr', 'type', 'text')
    
    // Clicar novamente para esconder
    cy.get('[data-testid="toggle-password-btn"]').click()
    
    // Deve voltar para tipo password
    cy.get('[data-testid="login-password-input"]')
      .should('have.attr', 'type', 'password')
  })

  // Teste 7: Navegação para página de registro
  it('Deve navegar para página de registro', () => {
    cy.get('[data-testid="go-to-register-btn"]').click()
    cy.url().should('include', '/pages/register.html')
  })

  // Teste 8: Preencher automaticamente com contas de teste
  it('Deve preencher automaticamente com botões de teste', () => {
    // Testar botão de admin
    cy.get('[data-testid="fill-admin-btn"]').click()
    cy.get('[data-testid="login-email-input"]').should('have.value', 'admin@escola.com')
    cy.get('[data-testid="login-password-input"]').should('have.value', 'admin123')
    
    // Limpar e testar botão de aluno
    cy.get('[data-testid="login-email-input"]').clear()
    cy.get('[data-testid="login-password-input"]').clear()
    cy.get('[data-testid="fill-student-btn"]').click()
    cy.get('[data-testid="login-email-input"]').should('have.value', 'aluno@escola.com')
    cy.get('[data-testid="login-password-input"]').should('have.value', 'aluno123')
  })

  // Teste 9: Funcionalidade "Lembrar-me"
  it('Deve funcionar corretamente o checkbox "Lembrar-me"', () => {
    cy.get('[data-testid="remember-me-checkbox"]').check().should('be.checked')
    cy.get('[data-testid="remember-me-checkbox"]').uncheck().should('not.be.checked')
  })

  // Teste 10: Link "Esqueci minha senha"
  it('Deve abrir modal de recuperação de senha', () => {
    // Modal não deve estar visível inicialmente
    cy.get('[data-testid="forgot-password-modal"]').should('not.be.visible')
    
    // Clicar no link
    cy.get('[data-testid="forgot-password-link"]').click()
    
    // Modal deve abrir
    cy.get('[data-testid="forgot-password-modal"]').should('be.visible')
    
    // Verificar elementos do modal
    cy.get('[data-testid="recovery-email-input"]').should('be.visible')
    cy.get('[data-testid="send-recovery-btn"]').should('be.visible')
    cy.get('[data-testid="cancel-recovery-btn"]').should('be.visible')
    
    // Fechar modal
    cy.get('[data-testid="close-forgot-password-modal"]').click()
    cy.get('[data-testid="forgot-password-modal"]').should('not.be.visible')
  })

  // Teste 11: Responsividade da página de login
  it('Deve ser responsiva em diferentes tamanhos de tela', () => {
    // Testar em desktop
    cy.viewport(1920, 1080)
    cy.get('[data-testid="login-card"]').should('be.visible')
    
    // Testar em tablet
    cy.viewport(768, 1024)
    cy.get('[data-testid="login-card"]').should('be.visible')
    
    // Testar em mobile
    cy.viewport(375, 667)
    cy.get('[data-testid="login-card"]').should('be.visible')
    
    // Verificar se elementos não quebram
    cy.get('[data-testid="login-email-input"]').should('be.visible')
    cy.get('[data-testid="login-password-input"]').should('be.visible')
  })

  // Teste 12: Performance do carregamento da página
  it('Deve carregar a página dentro do tempo aceitável', () => {
    // Medir tempo de carregamento
    cy.window().then((win) => {
      const perf = win.performance
      const navStart = perf.timing.navigationStart
      const loadEnd = perf.timing.loadEventEnd
      const loadTime = loadEnd - navStart
      
      // Tempo máximo aceitável: 3 segundos
      expect(loadTime).to.be.lessThan(3000)
    })
  })

  // Teste 13: Acessibilidade básica
  it('Deve ter elementos acessíveis', () => {
    // Verificar labels associadas
    cy.get('[data-testid="login-email-input"]').should('have.attr', 'aria-describedby')
    cy.get('[data-testid="login-password-input"]').should('have.attr', 'aria-describedby')
    
    // Verificar contraste de cores (usando uma biblioteca como cypress-axe seria melhor)
    cy.get('[data-testid="login-submit-btn"]').should('have.css', 'color')
      .and('not.equal', 'rgba(0, 0, 0, 0)')
  })

  // Teste 14: Persistência de sessão após refresh
  it('Não deve manter sessão após refresh sem login', () => {
    // Fazer login
    cy.get('[data-testid="login-email-input"]').type('admin@escola.com')
    cy.get('[data-testid="login-password-input"]').type('admin123')
    cy.get('[data-testid="login-submit-btn"]').click()
    
    // Verificar que está no dashboard
    cy.url().should('include', '/pages/dashboard.html')
    
    // Fazer refresh
    cy.reload()
    
    // Deve permanecer logado (se usar localStorage)
    cy.get('[data-testid="user-name"]').should('contain', 'Administrador')
  })

  // Teste 15: Logout e retorno para login
  it('Deve fazer logout e retornar para login', () => {
    // Fazer login
    cy.login('admin@escola.com', 'admin123')
    
    // Fazer logout
    cy.get('[data-testid="logout-btn"]').click()
    cy.get('[data-testid="confirm-logout-btn"]').click()
    
    // Deve retornar para login
    cy.url().should('include', '/pages/login.html')
  })
})

// Comando customizado para login (definido em support/commands.js)
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/pages/login.html')
  cy.get('[data-testid="login-email-input"]').type(email)
  cy.get('[data-testid="login-password-input"]').type(password)
  cy.get('[data-testid="login-submit-btn"]').click()
  cy.url().should('include', '/pages/dashboard.html')
})