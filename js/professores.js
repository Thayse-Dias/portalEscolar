// Gerenciamento de Professores - Portal Escolar
// Armazenamento: localStorage
// Estrutura de professor:
// {
//   id: number,
//   nome: string,
//   email: string,
//   especialidade: string,
//   formacao: 'graduacao' | 'especializacao' | 'mestrado' | 'doutorado',
//   registro: string,
//   telefone: string,
//   status: 'ativo' | 'inativo' | 'afastado',
//   dataAdmissao: string,
//   dataCadastro: string
// }

const PROFESSORES_KEY = 'portal-escolar-professores';

// Inicializar dados padrão
function initProfessoresData() {
    if (!localStorage.getItem(PROFESSORES_KEY)) {
        const defaultProfessores = [
            {
                id: 1,
                nome: 'Carlos Mendes',
                email: 'carlos.mendes@escola.com',
                especialidade: 'Programação e Algoritmos',
                formacao: 'doutorado',
                registro: 'PROF001',
                telefone: '(11) 95555-5555',
                status: 'ativo',
                dataAdmissao: '2020-01-15',
                dataCadastro: new Date().toISOString()
            },
            {
                id: 2,
                nome: 'Fernanda Lima',
                email: 'fernanda.lima@escola.com',
                especialidade: 'Banco de Dados',
                formacao: 'mestrado',
                registro: 'PROF002',
                telefone: '(11) 94444-4444',
                status: 'ativo',
                dataAdmissao: '2021-03-10',
                dataCadastro: new Date().toISOString()
            },
            {
                id: 3,
                nome: 'Roberto Alves',
                email: 'roberto.alves@escola.com',
                especialidade: 'Engenharia de Software',
                formacao: 'doutorado',
                registro: 'PROF003',
                telefone: '(11) 93333-3333',
                status: 'ativo',
                dataAdmissao: '2019-08-22',
                dataCadastro: new Date().toISOString()
            },
            {
                id: 4,
                nome: 'Patricia Santos',
                email: 'patricia.santos@escola.com',
                especialidade: 'Redes de Computadores',
                formacao: 'especializacao',
                registro: 'PROF004',
                telefone: '(11) 92222-2222',
                status: 'afastado',
                dataAdmissao: '2022-02-28',
                dataCadastro: new Date().toISOString()
            },
            {
                id: 5,
                nome: 'Thayse Fonseca',
                email: 'thayse.fonseca@escola.com',
                especialidade: 'Quality Assurance',
                formacao: 'especializacao',
                registro: 'PROF005',
                telefone: '(11) 92222-0001',
                status: 'afastado',
                dataAdmissao: '2025-02-28',
                dataCadastro: new Date().toISOString()
            }



        ];
        
        localStorage.setItem(PROFESSORES_KEY, JSON.stringify(defaultProfessores));
    }
}

// Obter todos os professores
function getProfessores() {
    const professores = localStorage.getItem(PROFESSORES_KEY);
    return professores ? JSON.parse(professores) : [];
}

// Obter professor por ID
function getProfessorById(id) {
    const professores = getProfessores();
    return professores.find(professor => professor.id === id);
}

// Adicionar professor
function adicionarProfessor(professorData) {
    const professores = getProfessores();
    const newId = professores.length > 0 ? Math.max(...professores.map(p => p.id)) + 1 : 1;
    
    const novoProfessor = {
        id: newId,
        ...professorData,
        dataCadastro: new Date().toISOString()
    };
    
    professores.push(novoProfessor);
    localStorage.setItem(PROFESSORES_KEY, JSON.stringify(professores));
    
    // Adicionar também como usuário
    addUser({
        nome: professorData.nome,
        email: professorData.email,
        senha: professorData.senha || 'professor123', // Senha padrão
        tipo: 'professor'
    });
    
    return newId;
}

// Atualizar professor
function updateProfessor(id, professorData) {
    const professores = getProfessores();
    const index = professores.findIndex(professor => professor.id === id);
    
    if (index !== -1) {
        professores[index] = { ...professores[index], ...professorData };
        localStorage.setItem(PROFESSORES_KEY, JSON.stringify(professores));
        return true;
    }
    
    return false;
}

// Excluir professor
function deletarProfessor(id) {
    const professores = getProfessores();
    const professor = professores.find(p => p.id === id);
    
    if (!professor) {
        return false;
    }
    
    // Remover professor
    const filteredProfessores = professores.filter(professor => professor.id !== id);
    localStorage.setItem(PROFESSORES_KEY, JSON.stringify(filteredProfessores));
    
    // Tentar remover usuário associado
    try {
        const users = getUsers();
        const userIndex = users.findIndex(u => u.email === professor.email);
        if (userIndex !== -1) {
            users.splice(userIndex, 1);
            localStorage.setItem(USERS_KEY, JSON.stringify(users));
        }
    } catch (error) {
        console.warn('Não foi possível remover usuário associado:', error);
    }
    
    return true;
}

// Buscar professores
function searchProfessores(query) {
    const professores = getProfessores();
    const searchTerm = query.toLowerCase().trim();
    
    if (!searchTerm) {
        return professores;
    }
    
    return professores.filter(professor => {
        return (
            professor.nome.toLowerCase().includes(searchTerm) ||
            professor.email.toLowerCase().includes(searchTerm) ||
            professor.especialidade.toLowerCase().includes(searchTerm) ||
            professor.registro?.toLowerCase().includes(searchTerm)
        );
    });
}

// Filtrar professores por formação
function filterProfessoresByFormacao(formacao) {
    const professores = getProfessores();
    
    if (!formacao) {
        return professores;
    }
    
    return professores.filter(professor => professor.formacao === formacao);
}

// Filtrar professores por status
function filterProfessoresByStatus(status) {
    const professores = getProfessores();
    
    if (!status) {
        return professores;
    }
    
    return professores.filter(professor => professor.status === status);
}

// Obter estatísticas de professores
function getProfessorStats() {
    const professores = getProfessores();
    
    return {
        total: professores.length,
        ativos: professores.filter(p => p.status === 'ativo').length,
        inativos: professores.filter(p => p.status === 'inativo').length,
        afastados: professores.filter(p => p.status === 'afastado').length,
        porFormacao: professores.reduce((acc, professor) => {
            acc[professor.formacao] = (acc[professor.formacao] || 0) + 1;
            return acc;
        }, {})
    };
}

// Funções auxiliares
function getFormacaoText(formacao) {
    const formacoes = {
        'graduacao': 'Graduação',
        'especializacao': 'Especialização',
        'mestrado': 'Mestrado',
        'doutorado': 'Doutorado'
    };
    
    return formacoes[formacao] || formacao;
}

function getProfessorStatusText(status) {
    const statusMap = {
        'ativo': 'Ativo',
        'inativo': 'Inativo',
        'afastado': 'Afastado'
    };
    
    return statusMap[status] || status;
}

// Inicializar dados
initProfessoresData();