/* 
  Declaração de uso de IA (Regra da UC):
  Ferramenta: Gemini Assistente
  Finalidade: Arquitetura modular de scripts em Vanilla JS, tratamento preventivo de erros de imagem e validações de formulário sênior.
*/

document.addEventListener("DOMContentLoaded", () => {
    inicializarMenu();
    inicializarSaudacao();
    inicializarTema();
    inicializarProjetos();
    inicializarFormulario();
    inicializarRodapeEAvaliacaoScroll();
});

/**
 * Função global para tratar falha ao carregar a foto de perfil.
 * Caso o arquivo de foto não exista, esconde a tag img e mostra o avatar com iniciais.
 * @param {HTMLImageElement} imgElement 
 */
window.tratarErroFoto = function(imgElement) {
    imgElement.classList.add("hidden");
    const fallback = document.getElementById("avatar-fallback");
    if (fallback) {
        fallback.classList.remove("hidden");
    }
};

/**
 * Controla o menu hambúrguer interativo com aria-expanded.
 */
function inicializarMenu() {
    const btnMenu = document.getElementById("btn-menu");
    const menu = document.getElementById("menu");
    const linksMenu = menu.querySelectorAll("a");

    btnMenu.addEventListener("click", () => {
        const aberto = menu.classList.toggle("ativo");
        btnMenu.setAttribute("aria-expanded", aberto);
    });

    linksMenu.forEach(link => {
        link.addEventListener("click", () => {
            menu.classList.remove("ativo");
            btnMenu.setAttribute("aria-expanded", "false");
        });
    });
}

/**
 * Retorna a saudação dinâmica baseada estritamente no horário.
 * @param {number} hora 
 * @returns {string}
 */
function obterSaudacao(hora) {
    if (hora >= 5 && hora < 12) {
        return "Bom dia! Seja bem-vindo(a)";
    } else if (hora >= 12 && hora < 18) {
        return "Boa tarde! Seja bem-vindo(a)";
    } else {
        return "Boa noite! Seja bem-vindo(a)";
    }
}

/**
 * Aplica a saudação dinâmica no elemento correspondente.
 */
function inicializarSaudacao() {
    const spanTexto = document.getElementById("saudacao-texto");
    const horaAtual = new Date().getHours();
    spanTexto.textContent = obterSaudacao(horaAtual);
}

/**
 * Gerencia tema claro/escuro com persistência em localStorage.
 */
function inicializarTema() {
    const btnTema = document.getElementById("btn-tema");
    const body = document.body;

    const temaSalvo = localStorage.getItem("vitrine_tema");
    if (temaSalvo === "dark") {
        body.classList.add("dark-mode");
        btnTema.textContent = "☀️";
    }

    btnTema.addEventListener("click", () => {
        body.classList.toggle("dark-mode");
        const isDark = body.classList.contains("dark-mode");
        
        btnTema.textContent = isDark ? "☀️" : "🌙";
        localStorage.setItem("vitrine_tema", isDark ? "dark" : "light");
    });
}

// Array de dados dos projetos (Desafio Bônus)
const projetosDados = [
    {
        titulo: "Landing Page Responsiva",
        descricao: "Página de captura moderna desenvolvida com foco em Flexbox e Media Queries estruturadas.",
        tecnologias: "HTML5 • CSS3",
        categoria: "HTML/CSS",
        icone: "📱"
    },
    {
        titulo: "Calculadora Avançada JS",
        descricao: "Aplicação interativa com tratamento de operadores e manipulação dinâmica de árvore DOM.",
        tecnologias: "JavaScript • ES6+",
        categoria: "JavaScript",
        icone: "🧮"
    },
    {
        titulo: "Gerenciador de Tarefas",
        descricao: "Sistema de organização de tarefas diárias com persistência local e validações de input.",
        tecnologias: "JavaScript • DOM",
        categoria: "JavaScript",
        icone: "📋"
    }
];

/**
 * Renderiza os cards de projetos dinamicamente e gerencia o sistema de filtros.
 */
function inicializarProjetos() {
    const grid = document.getElementById("grid-projetos");
    const botoesFiltro = document.querySelectorAll(".btn-filtro");

    function render(dados) {
        grid.innerHTML = "";
        dados.forEach(proj => {
            const article = document.createElement("article");
            article.className = "projeto-card";
            article.innerHTML = `
                <div class="projeto-header-card">${proj.icone}</div>
                <div class="projeto-body">
                    <h3>${proj.titulo}</h3>
                    <p>${proj.descricao}</p>
                    <span class="projeto-techs">${proj.tecnologias}</span>
                    <a href="#contato" class="btn-secundario btn-full" style="text-align: center; margin-top: auto;">Solicitar Detalhes</a>
                </div>
            `;
            grid.appendChild(article);
        });
    }

    render(projetosDados);

    botoesFiltro.forEach(btn => {
        btn.addEventListener("click", (e) => {
            botoesFiltro.forEach(b => b.classList.remove("ativo"));
            e.target.classList.add("ativo");

            const filtro = e.target.getAttribute("data-filtro");
            if (filtro === "todos") {
                render(projetosDados);
            } else {
                const filtrados = projetosDados.filter(p => p.categoria === filtro);
                render(filtrados);
            }
        });
    });
}

/**
 * Validação rigorosa de formulário exigida pelo projeto (com mensagens inline).
 * @returns {boolean}
 */
function validarFormulario() {
    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const mensagem = document.getElementById("mensagem").value.trim();
    const consentimento = document.getElementById("consentimento").checked;

    // Limpar erros prévios
    document.querySelectorAll(".erro-msg").forEach(el => el.textContent = "");

    let valido = true;

    if (nome === "") {
        document.querySelector('[id-erro="nome"]').textContent = "Por favor, preencha o seu nome.";
        valido = false;
    }

    if (!email.includes("@") || !email.includes(".")) {
        document.querySelector('[id-erro="email"]').textContent = "Digite um e-mail válido contendo '@' e '.'.";
        valido = false;
    }

    if (mensagem.length < 20) {
        document.querySelector('[id-erro="mensagem"]').textContent = `A mensagem precisa ter no mínimo 20 caracteres (atual: ${mensagem.length}).`;
        valido = false;
    }

    if (!consentimento) {
        document.querySelector('[id-erro="consentimento"]').textContent = "É obrigatório aceitar o termo de consentimento da LGPD.";
        valido = false;
    }

    return valido;
}

/**
 * Gerencia o evento de envio do formulário.
 */
function inicializarFormulario() {
    const form = document.getElementById("form-contato");
    const sucessoMsg = document.getElementById("sucesso-msg");

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        sucessoMsg.classList.add("hidden");

        if (validarFormulario()) {
            sucessoMsg.classList.remove("hidden");
            form.reset();
            
            setTimeout(() => {
                sucessoMsg.classList.add("hidden");
            }, 6000);
        }
    });
}

/**
 * Automatiza o ano no rodapé e controla o botão flutuante de voltar ao topo.
 */
function inicializarRodapeEAvaliacaoScroll() {
    const spanAno = document.getElementById("ano-atual");
    spanAno.textContent = new Date().getFullYear();

    const btnTopo = document.getElementById("btn-topo");

    window.addEventListener("scroll", () => {
        if (window.scrollY > 400) {
            btnTopo.classList.remove("hidden");
        } else {
            btnTopo.classList.add("hidden");
        }
    });

    btnTopo.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}