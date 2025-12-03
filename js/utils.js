// Funções Utilitárias - Portal Escolar

// Formatar data
function formatDate(date, format = 'pt-BR') {
    if (!date) return '';
    
    try {
        const d = new Date(date);
        
        if (isNaN(d.getTime())) {
            return date;
        }
        
        if (format === 'pt-BR') {
            return d.toLocaleDateString('pt-BR');
        } else if (format === 'iso') {
            return d.toISOString().split('T')[0];
        } else if (format === 'datetime') {
            return d.toLocaleString('pt-BR');
        }
        
        return d.toLocaleDateString();
    } catch {
        return date;
    }
}

// Formatar CPF
function formatCPF(cpf) {
    if (!cpf) return '';
    
    cpf = cpf.replace(/\D/g, '');
    
    if (cpf.length !== 11) {
        return cpf;
    }
    
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

// Formatar telefone
function formatPhone(phone) {
    if (!phone) return '';
    
    phone = phone.replace(/\D/g, '');
    
    if (phone.length === 11) {
        return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (phone.length === 10) {
        return phone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    
    return phone;
}

// Validar email
function validateEmail(email) {
    if (!email) return false;
    
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Validar senha
function validatePassword(password) {
    if (!password) return false;
    
    // Mínimo 6 caracteres
    return password.length >= 6;
}

// Gerar ID único
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// LocalStorage com expiração
const StorageWithExpiry = {
    set: (key, value, ttl = 24 * 60 * 60 * 1000) => {
        const item = {
            value: value,
            expiry: new Date().getTime() + ttl
        };
        localStorage.setItem(key, JSON.stringify(item));
    },
    
    get: (key) => {
        const itemStr = localStorage.getItem(key);
        
        if (!itemStr) {
            return null;
        }
        
        const item = JSON.parse(itemStr);
        const now = new Date().getTime();
        
        if (now > item.expiry) {
            localStorage.removeItem(key);
            return null;
        }
        
        return item.value;
    },
    
    remove: (key) => {
        localStorage.removeItem(key);
    }
};

// Gerar cores aleatórias para avatares
function getRandomColor() {
    const colors = [
        '#3498db', '#2ecc71', '#e74c3c', '#f39c12',
        '#9b59b6', '#1abc9c', '#d35400', '#c0392b',
        '#34495e', '#16a085', '#8e44ad', '#2c3e50',
        '#27ae60', '#2980b9', '#e67e22', '#7f8c8d'
    ];
    
    return colors[Math.floor(Math.random() * colors.length)];
}

// Inicializar
function initUtils() {
    // Adicionar polyfill para navegadores antigos
    if (!String.prototype.includes) {
        String.prototype.includes = function(search, start) {
            if (typeof start !== 'number') {
                start = 0;
            }
            
            if (start + search.length > this.length) {
                return false;
            } else {
                return this.indexOf(search, start) !== -1;
            }
        };
    }
    
    // Adicionar polyfill para Array.includes
    if (!Array.prototype.includes) {
        Array.prototype.includes = function(searchElement) {
            return this.indexOf(searchElement) !== -1;
        };
    }
}

// Exportar funções para uso global
window.PortalEscolarUtils = {
    formatDate,
    formatCPF,
    formatPhone,
    validateEmail,
    validatePassword,
    generateId,
    debounce,
    throttle,
    StorageWithExpiry,
    getRandomColor
};

// Inicializar utilitários
initUtils();