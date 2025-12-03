// Sistema de Autenticação - Portal Escolar
// Armazenamento: localStorage
// Estrutura de usuários:
// {
//   id: number,
//   nome: string,
//   email: string,
//   tipo: 'admin' | 'professor' | 'aluno',
//   dataCadastro: string,
//   ultimoAcesso: string
// }

const AUTH_KEY = 'portal-escolar-auth';
const USERS_KEY = 'portal-escolar-users';
const SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 horas

// Inicializar dados padrão
function initDefaultData() {
    // Verificar se já existem usuários
    if (!localStorage.getItem(USERS_KEY)) {
        const defaultUsers = [
            {
                id: 1,
                nome: 'Administrador',
                email: 'admin@escola.com',
                senha: 'admin123',
                tipo: 'admin',
                dataCadastro: new Date().toISOString(),
                ultimoAcesso: null
            },
            {
                id: 2,
                nome: 'Professor Teste',
                email: 'professor@escola.com',
                senha: 'professor123',
                tipo: 'professor',
                dataCadastro: new Date().toISOString(),
                ultimoAcesso: null
            },
            {
                id: 3,
                nome: 'Aluno Teste',
                email: 'aluno@escola.com',
                senha: 'aluno123',
                tipo: 'aluno',
                dataCadastro: new Date().toISOString(),
                ultimoAcesso: null
            }
        ];
        
        localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
    }
}

// Obter todos os usuários
function getUsers() {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
}

// Obter usuário por ID
function getUserById(id) {
    const users = getUsers();
    return users.find(user => user.id === id);
}

// Obter usuário por email
function getUserByEmail(email) {
    const users = getUsers();
    return users.find(user => user.email === email);
}

// Adicionar usuário
function addUser(userData) {
    const users = getUsers();
    const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    
    const newUser = {
        id: newId,
        ...userData,
        dataCadastro: new Date().toISOString(),
        ultimoAcesso: null
    };
    
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return newId;
}

// Atualizar usuário
function updateUser(id, userData) {
    const users = getUsers();
    const index = users.findIndex(user => user.id === id);
    
    if (index !== -1) {
        users[index] = { ...users[index], ...userData };
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
        return true;
    }
    
    return false;
}

// Login
function login(email, password) {
    const users = getUsers();
    const user = users.find(u => u.email === email && u.senha === password);
    
    if (user) {
        // Atualizar último acesso
        user.ultimoAcesso = new Date().toISOString();
        updateUser(user.id, { ultimoAcesso: user.ultimoAcesso });
        
        // Criar sessão
        const session = {
            userId: user.id,
            loginTime: new Date().getTime(),
            expiresAt: new Date().getTime() + SESSION_TIMEOUT
        };
        
        localStorage.setItem(AUTH_KEY, JSON.stringify(session));
        return true;
    }
    
    return false;
}

// Logout
function logout() {
    localStorage.removeItem(AUTH_KEY);
}

// Verificar autenticação
function isAuthenticated() {
    const auth = localStorage.getItem(AUTH_KEY);
    
    if (!auth) {
        return false;
    }
    
    try {
        const session = JSON.parse(auth);
        const now = new Date().getTime();
        
        // Verificar se a sessão expirou
        if (now > session.expiresAt) {
            logout();
            return false;
        }
        
        // Renovar sessão (mantém por mais 24 horas)
        if (now - session.loginTime > SESSION_TIMEOUT / 2) {
            session.loginTime = now;
            session.expiresAt = now + SESSION_TIMEOUT;
            localStorage.setItem(AUTH_KEY, JSON.stringify(session));
        }
        
        return true;
    } catch {
        logout();
        return false;
    }
}

// Obter usuário atual
function getCurrentUser() {
    if (!isAuthenticated()) {
        return null;
    }
    
    try {
        const session = JSON.parse(localStorage.getItem(AUTH_KEY));
        return getUserById(session.userId);
    } catch {
        return null;
    }
}

// Verificar permissões
function hasPermission(requiredType) {
    const user = getCurrentUser();
    
    if (!user) {
        return false;
    }
    
    // Admin tem acesso a tudo
    if (user.tipo === 'admin') {
        return true;
    }
    
    // Verificar tipo específico
    const typeHierarchy = {
        'admin': 3,
        'professor': 2,
        'aluno': 1
    };
    
    const userLevel = typeHierarchy[user.tipo] || 0;
    const requiredLevel = typeHierarchy[requiredType] || 0;
    
    return userLevel >= requiredLevel;
}

// Inicializar sistema
initDefaultData();