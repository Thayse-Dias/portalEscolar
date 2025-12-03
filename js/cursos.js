// Gerenciamento de Cursos - Portal Escolar
// Armazenamento: localStorage
// Estrutura de curso:
// {
//   id: string,
//   nome: string,
//   descricao: string,
//   duracao: number, // em semestres
//   periodo: 'matutino' | 'vespertino' | 'noturno' | 'integral',
//   coordenador: string,
//   status: 'ativo' | 'inativo',
//   vagas: number,
//   vagasDisponiveis: number,
//   dataCriacao: string
// }

const CURSOS_KEY = 'portal-escolar-cursos';

// Cursos disponíveis
const CURSOS_DISPONIVEIS = [
    {
        id: 'engenharia-software',
        nome: 'Engenharia de Software',
        descricao: 'Formação em desenvolvimento de software com foco em qualidade, processos e gestão de projetos.',
        duracao: 8,
        periodo: 'integral',
        coordenador: 'Prof. Dr. Carlos Mendes',
        status: 'ativo',
        vagas: 50,
        vagasDisponiveis: 25,
        dataCriacao: '2020-01-01'
    },
    {
        id: 'ciencia-computacao',
        nome: 'Ciência da Computação',
        descricao: 'Formação teórica e prática em computação com ênfase em algoritmos, inteligência artificial e teoria da computação.',
        duracao: 8,
        periodo: 'matutino',
        coordenador: 'Prof. Dra. Ana Silva',
        status: 'ativo',
        vagas: 40,
        vagasDisponiveis: 15,
        dataCriacao: '2019-01-01'
    },
    {
        id: 'ads',
        nome: 'Análise e Desenvolvimento de Sistemas',
        descricao: 'Curso tecnológico focado em desenvolvimento prático de sistemas e aplicações.',
        duracao: 5,
        periodo: 'noturno',
        coordenador: 'Prof. Me. Roberto Alves',
        status: 'ativo',
        vagas: 60,
        vagasDisponiveis: 30,
        dataCriacao: '2021-01-01'
    },
    {
        id: 'sistemas-informacao',
        nome: 'Sistemas de Informação',
        descricao: 'Integração entre tecnologia da informação e negócios, com foco em gestão e tomada de decisão.',
        duracao: 8,
        periodo: 'vespertino',
        coordenador: 'Prof. Dra. Fernanda Lima',
        status: 'ativo',
        vagas: 45,
        vagasDisponiveis: 20,
        dataCriacao: '2020-01-01'
    }
];

// Inicializar cursos
function initCursosData() {
    if (!localStorage.getItem(CURSOS_KEY)) {
        localStorage.setItem(CURSOS_KEY, JSON.stringify(CURSOS_DISPONIVEIS));
    }
}

// Obter todos os cursos
function getCursos() {
    const cursos = localStorage.getItem(CURSOS_KEY);
    return cursos ? JSON.parse(cursos) : [];
}

// Obter curso por ID
function getCursoById(id) {
    const cursos = getCursos();
    return cursos.find(curso => curso.id === id);
}

// Obter curso por nome
function getCursoByNome(nome) {
    const cursos = getCursos();
    return cursos.find(curso => curso.nome === nome);
}

// Atualizar vagas disponíveis
function updateVagasDisponiveis(cursoId, quantidade) {
    const cursos = getCursos();
    const index = cursos.findIndex(curso => curso.id === cursoId);
    
    if (index !== -1) {
        cursos[index].vagasDisponiveis += quantidade;
        
        // Garantir que não fique negativo
        if (cursos[index].vagasDisponiveis < 0) {
            cursos[index].vagasDisponiveis = 0;
        }
        
        // Garantir que não ultrapasse o total de vagas
        if (cursos[index].vagasDisponiveis > cursos[index].vagas) {
            cursos[index].vagasDisponiveis = cursos[index].vagas;
        }
        
        localStorage.setItem(CURSOS_KEY, JSON.stringify(cursos));
        return true;
    }
    
    return false;
}

// Obter estatísticas dos cursos
function getCursoStats() {
    const cursos = getCursos();
    const alunos = getAlunos();
    
    const stats = {
        totalCursos: cursos.length,
        totalVagas: cursos.reduce((sum, curso) => sum + curso.vagas, 0),
        vagasOcupadas: cursos.reduce((sum, curso) => sum + (curso.vagas - curso.vagasDisponiveis), 0),
        vagasDisponiveis: cursos.reduce((sum, curso) => sum + curso.vagasDisponiveis, 0),
        alunosPorCurso: {},
        taxaOcupacao: {}
    };
    
    // Contar alunos por curso
    alunos.forEach(aluno => {
        if (aluno.curso) {
            stats.alunosPorCurso[aluno.curso] = (stats.alunosPorCurso[aluno.curso] || 0) + 1;
        }
    });
    
    // Calcular taxa de ocupação por curso
    cursos.forEach(curso => {
        const alunosNoCurso = stats.alunosPorCurso[curso.id] || 0;
        stats.taxaOcupacao[curso.id] = curso.vagas > 0 ? (alunosNoCurso / curso.vagas) * 100 : 0;
    });
    
    return stats;
}

// Gerar relatório de cursos
function generateCursoReport() {
    const cursos = getCursos();
    const stats = getCursoStats();
    
    const report = {
        timestamp: new Date().toISOString(),
        cursos: cursos,
        estatisticas: stats,
        resumo: {
            totalCursos: stats.totalCursos,
            totalVagas: stats.totalVagas,
            vagasOcupadas: stats.vagasOcupadas,
            taxaOcupacaoGeral: (stats.vagasOcupadas / stats.totalVagas) * 100
        }
    };
    
    return report;
}

// Funções auxiliares
function getPeriodoText(periodo) {
    const periodos = {
        'matutino': 'Matutino',
        'vespertino': 'Vespertino',
        'noturno': 'Noturno',
        'integral': 'Integral'
    };
    
    return periodos[periodo] || periodo;
}

// Inicializar dados
initCursosData();