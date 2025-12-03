// Gerenciamento de Alunos - Portal Escolar
// Armazenamento: localStorage
// Estrutura de aluno:
// {
//   id: number,
//   nome: string,
//   email: string,
//   dataNascimento: string,
//   curso: string,
//   matricula: string,
//   telefone: string,
//   status: 'ativo' | 'inativo' | 'trancado',
//   endereco: string,
//   dataCadastro: string
// }

const ALUNOS_KEY = 'portal-escolar-alunos';

// Inicializar dados padrão
function initAlunosData() {
    if (!localStorage.getItem(ALUNOS_KEY)) {
        const defaultAlunos = [
            {
                id: 1,
                nome: 'João Silva',
                email: 'joao.silva@escola.com',
                dataNascimento: '2000-05-15',
                curso: 'engenharia-software',
                matricula: 'AL2024001',
                telefone: '(11) 99999-9999',
                status: 'ativo',
                endereco: 'Rua das Flores, 123 - São Paulo, SP',
                dataCadastro: new Date().toISOString()
            },
            {
                id: 2,
                nome: 'Maria Santos',
                email: 'maria.santos@escola.com',
                dataNascimento: '2001-08-22',
                curso: 'ciencia-computacao',
                matricula: 'AL2024002',
                telefone: '(11) 98888-8888',
                status: 'ativo',
                endereco: 'Av. Paulista, 1000 - São Paulo, SP',
                dataCadastro: new Date().toISOString()
            },
            {
                id: 3,
                nome: 'Pedro Costa',
                email: 'pedro.costa@escola.com',
                dataNascimento: '1999-12-05',
                curso: 'ads',
                matricula: 'AL2024003',
                telefone: '(11) 97777-7777',
                status: 'inativo',
                endereco: 'Rua Augusta, 500 - São Paulo, SP',
                dataCadastro: new Date().toISOString()
            },
            {
                id: 4,
                nome: 'Ana Oliveira',
                email: 'ana.oliveira@escola.com',
                dataNascimento: '2002-03-30',
                curso: 'sistemas-informacao',
                matricula: 'AL2024004',
                telefone: '(11) 96666-6666',
                status: 'ativo',
                endereco: 'Rua Consolação, 2000 - São Paulo, SP',
                dataCadastro: new Date().toISOString()
            }
        ];
        
        localStorage.setItem(ALUNOS_KEY, JSON.stringify(defaultAlunos));
    }
}

// Obter todos os alunos
function getAlunos() {
    const alunos = localStorage.getItem(ALUNOS_KEY);
    return alunos ? JSON.parse(alunos) : [];
}

// Obter aluno por ID
function getAlunoById(id) {
    const alunos = getAlunos();
    return alunos.find(aluno => aluno.id === id);
}

// Adicionar aluno
function adicionarAluno(alunoData) {
    const alunos = getAlunos();
    const newId = alunos.length > 0 ? Math.max(...alunos.map(a => a.id)) + 1 : 1;
    
    const novoAluno = {
        id: newId,
        ...alunoData,
        dataCadastro: new Date().toISOString()
    };
    
    alunos.push(novoAluno);
    localStorage.setItem(ALUNOS_KEY, JSON.stringify(alunos));
    
    // Adicionar também como usuário
    addUser({
        nome: alunoData.nome,
        email: alunoData.email,
        senha: alunoData.senha || 'aluno123', // Senha padrão
        tipo: 'aluno'
    });
    
    return newId;
}

// Atualizar aluno
function updateAluno(id, alunoData) {
    const alunos = getAlunos();
    const index = alunos.findIndex(aluno => aluno.id === id);
    
    if (index !== -1) {
        alunos[index] = { ...alunos[index], ...alunoData };
        localStorage.setItem(ALUNOS_KEY, JSON.stringify(alunos));
        return true;
    }
    
    return false;
}

// Excluir aluno
function deletarAluno(id) {
    const alunos = getAlunos();
    const aluno = alunos.find(a => a.id === id);
    
    if (!aluno) {
        return false;
    }
    
    // Remover aluno
    const filteredAlunos = alunos.filter(aluno => aluno.id !== id);
    localStorage.setItem(ALUNOS_KEY, JSON.stringify(filteredAlunos));
    
    // Tentar remover usuário associado
    try {
        const users = getUsers();
        const userIndex = users.findIndex(u => u.email === aluno.email);
        if (userIndex !== -1) {
            users.splice(userIndex, 1);
            localStorage.setItem(USERS_KEY, JSON.stringify(users));
        }
    } catch (error) {
        console.warn('Não foi possível remover usuário associado:', error);
    }
    
    return true;
}

// Buscar alunos
function searchAlunos(query) {
    const alunos = getAlunos();
    const searchTerm = query.toLowerCase().trim();
    
    if (!searchTerm) {
        return alunos;
    }
    
    return alunos.filter(aluno => {
        return (
            aluno.nome.toLowerCase().includes(searchTerm) ||
            aluno.email.toLowerCase().includes(searchTerm) ||
            aluno.matricula?.toLowerCase().includes(searchTerm) ||
            aluno.cpf?.toLowerCase().includes(searchTerm)
        );
    });
}

// Filtrar alunos por curso
function filterAlunosByCurso(curso) {
    const alunos = getAlunos();
    
    if (!curso) {
        return alunos;
    }
    
    return alunos.filter(aluno => aluno.curso === curso);
}

// Filtrar alunos por status
function filterAlunosByStatus(status) {
    const alunos = getAlunos();
    
    if (!status) {
        return alunos;
    }
    
    return alunos.filter(aluno => aluno.status === status);
}

// Obter estatísticas de alunos
function getAlunoStats() {
    const alunos = getAlunos();
    
    return {
        total: alunos.length,
        ativos: alunos.filter(a => a.status === 'ativo').length,
        inativos: alunos.filter(a => a.status === 'inativo').length,
        trancados: alunos.filter(a => a.status === 'trancado').length,
        porCurso: alunos.reduce((acc, aluno) => {
            acc[aluno.curso] = (acc[aluno.curso] || 0) + 1;
            return acc;
        }, {})
    };
}

// Gerar relatório de alunos
function generateAlunoReport(format = 'csv') {
    const alunos = getAlunos();
    
    if (format === 'csv') {
        let csv = 'Nome,Matrícula,Email,Curso,Status,Data de Nascimento,Data de Cadastro\n';
        
        alunos.forEach(aluno => {
            csv += `"${aluno.nome}","${aluno.matricula || ''}","${aluno.email}","${getCursoNome(aluno.curso)}","${getStatusText(aluno.status)}","${formatDate(aluno.dataNascimento)}","${formatDate(aluno.dataCadastro)}"\n`;
        });
        
        return csv;
    }
    
    return JSON.stringify(alunos, null, 2);
}

// Funções auxiliares
function getCursoNome(cursoKey) {
    const cursos = {
        'engenharia-software': 'Engenharia de Software',
        'ciencia-computacao': 'Ciência da Computação',
        'ads': 'Análise e Desenvolvimento de Sistemas',
        'sistemas-informacao': 'Sistemas de Informação'
    };
    
    return cursos[cursoKey] || cursoKey;
}

function getStatusText(status) {
    const statusMap = {
        'ativo': 'Ativo',
        'inativo': 'Inativo',
        'trancado': 'Trancado'
    };
    
    return statusMap[status] || status;
}

function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    } catch {
        return dateString;
    }
}


// Inicializar dados
initAlunosData();