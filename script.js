let perguntas = [];
let current = 0;
let score = 0;

// Funções de usuário
function saveUser(user, senha, sexo) {
  localStorage.setItem("narcisoUser", JSON.stringify({ user, senha, sexo }));
}

function getUser() {
  return JSON.parse(localStorage.getItem("narcisoUser"));
}

function saveProgress() {
  localStorage.setItem("quizProgress", JSON.stringify({ current, score }));
}

function loadProgress() {
  const data = JSON.parse(localStorage.getItem("quizProgress"));
  if (data) {
    current = data.current;
    score = data.score;
    document.getElementById("score").textContent = score;
  }
}

function clearProgress() {
  localStorage.removeItem("quizProgress");
}

// Interface
function register() {
  const user = document.getElementById("username").value.trim();
  const senha = document.getElementById("password").value;
  const sexo = document.getElementById("gender").value;
  if (!user || !senha || !sexo) {
    alert("Preencha todos os campos.");
    return;
  }
  saveUser(user, senha, sexo);
  alert("Registrado com sucesso!");
}

function login() {
  const user = document.getElementById("username").value;
  const senha = document.getElementById("password").value;
  const dados = getUser();
  if (dados && user === dados.user && senha === dados.senha) {
    document.getElementById("loginContainer").classList.add("hidden");
    document.getElementById("quizContainer").classList.remove("hidden");
    document.getElementById("welcomeUser").textContent = `Bem-vindo, ${user}!`;
    loadProgress();
    carregarPerguntas();
  } else {
    alert("Credenciais inválidas.");
  }
}

function recover() {
  const user = prompt("Digite seu nome de usuário:");
  const sexo = prompt("Digite seu sexo:");
  const dados = getUser();
  if (dados && dados.user === user && dados.sexo === sexo) {
    alert(`Sua senha é: ${dados.senha}`);
  } else {
    alert("Dados não encontrados.");
  }
}

function logout() {
  localStorage.removeItem("narcisoUser");
  localStorage.removeItem("quizProgress");
  location.reload();
}

// Quiz
function carregarPerguntas() {
  fetch("perguntas.json")
    .then(res => res.json())
    .then(data => {
      perguntas = data;
      mostrarPergunta();
    });
}

function mostrarPergunta() {
  if (current >= perguntas.length) {
    mostrarPremio();
    clearProgress();
    return;
  }
  const pergunta = perguntas[current];
  document.getElementById("question").textContent = pergunta.pergunta;
  const opcoesDiv = document.getElementById("options");
  opcoesDiv.innerHTML = "";
  pergunta.opcoes.forEach(opcao => {
    const btn = document.createElement("button");
    btn.textContent = opcao;
    btn.className = "blue-button";
    btn.onclick = () => verificarResposta(opcao, btn);
    opcoesDiv.appendChild(btn);
  });
}

function verificarResposta(resposta, btn) {
  const perguntaAtual = perguntas[current];
  if (resposta === perguntaAtual.resposta) {
    score += 100;
    btn.classList.add("correct");
  } else {
    btn.classList.add("wrong");
  }
  document.getElementById("score").textContent = score;
  setTimeout(() => {
    current++;
    saveProgress();
    mostrarPergunta();
  }, 500);
}

function nextQuestion() {
  mostrarPergunta();
}

function mostrarPremio() {
  let texto = "";
  if (score >= 300) {
    texto = "Nível Diamante!";
  } else if (score >= 200) {
    texto = "Nível Ouro!";
  } else if (score >= 100) {
    texto = "Nível Prata!";
  } else {
    texto = "Nível Bronze!";
  }
  document.getElementById("levelBadge").textContent = `Você alcançou: ${texto}`;
}

// Modo escuro
function setTheme(isDark) {
  if (isDark) {
    document.body.classList.add("dark-blue");
  } else {
    document.body.classList.remove("dark-blue");
  }
}

document.getElementById("themeToggle").addEventListener("change", function () {
  setTheme(this.checked);
  localStorage.setItem("darkMode", this.checked);
});

function checkTheme() {
  const isDark = localStorage.getItem("darkMode") === "true";
  document.getElementById("themeToggle").checked = isDark;
  setTheme(isDark);
}

// Verificação automática de login
function checkLogin() {
  const dados = getUser();
  if (dados) {
    document.getElementById("loginContainer").classList.add("hidden");
    document.getElementById("quizContainer").classList.remove("hidden");
    document.getElementById("welcomeUser").textContent = `Bem-vindo, ${dados.user}!`;
    carregarPerguntas();
    loadProgress();
  }
}

// Loader
window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("loader").style.opacity = "0";
    setTimeout(() => {
      document.getElementById("loader").style.display = "none";
    }, 500);
  }, 1500);
});

window.onload = () => {
  checkTheme();
  checkLogin();
};
