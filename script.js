let perguntas = [];
let current = 0;
let score = 0;
let timer;

// Carregar perguntas
function carregarPerguntas() {
  fetch("perguntas.json")
    .then((res) => res.json())
    .then((data) => {
      perguntas = data;
      mostrarPergunta();
    });
}

// Mostrar pergunta com timer
function mostrarPergunta() {
  if (current >= perguntas.length) {
    mostrarPremio();
    return;
  }

  const pergunta = perguntas[current];
  document.getElementById("question").textContent = pergunta.pergunta;
  const opcoesDiv = document.getElementById("options");
  opcoesDiv.innerHTML = "";

  startTimer();

  pergunta.opcoes.forEach((opcao) => {
    const btn = document.createElement("button");
    btn.textContent = opcao;
    btn.className = "blue-button";
    btn.onclick = () => verificarResposta(opcao, btn);
    opcoesDiv.appendChild(btn);
  });
}

// Timer por pergunta
function startTimer() {
  clearInterval(timer);
  let timeLeft = 10;
  const fill = document.getElementById("timerFill");
  fill.style.width = "100%";
  timer = setInterval(() => {
    timeLeft--;
    fill.style.width = `${(timeLeft / 10) * 100}%`;
    if (timeLeft <= 0) {
      clearInterval(timer);
      nextQuestionAuto();
    }
  }, 1000);
}

// Avançar automaticamente se tempo zerar
function nextQuestionAuto() {
  current++;
  saveProgress();
  mostrarPergunta();
}

// Verificar resposta
function verificarResposta(resposta, btn) {
  clearInterval(timer);
  const perguntaAtual = perguntas[current];

  const correctSound = document.getElementById("correctSound");
  const wrongSound = document.getElementById("wrongSound");

  if (resposta === perguntaAtual.resposta) {
    score += 100;
    btn.classList.add("correct");
    correctSound.play();
  } else {
    btn.classList.add("wrong");
    wrongSound.play();
  }

  document.getElementById("score").textContent = score;

  setTimeout(() => {
    current++;
    saveProgress();
    mostrarPergunta();
  }, 500);
}

// Salvar progresso
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

// Funções de usuário
function saveUser(user, senha, sexo) {
  localStorage.setItem("narcisoUser", JSON.stringify({ user, senha, sexo }));
}

function getUser() {
  return JSON.parse(localStorage.getItem("narcisoUser"));
}

function register() {
  const user = document.getElementById("username").value.trim(); // ✅ trim()
  const senha = document.getElementById("password").value.trim(); // ✅ trim()
  const sexo = document.getElementById("gender").value;

  if (!user || !senha || !sexo) {
    alert("Preencha todos os campos.");
    return;
  }

  saveUser(user, senha, sexo);
  alert("Registrado com sucesso!");
}

function login() {
  const user = document.getElementById("username").value.trim(); // ✅ trim()
  const senha = document.getElementById("password").value.trim(); // ✅ trim()
  const dados = getUser();

  if (!dados) {
    alert("Nenhum usuário registrado.");
    return;
  }

  if (user === dados.user && senha === dados.senha) {
    localStorage.setItem("quizSession", user); // ✅ Sessão ativa

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
  localStorage.removeItem("quizSession"); // ✅ Remove apenas a sessão
  location.reload();
}

// Mostrar prêmio
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

  saveToRanking(getUser()?.user || "Anônimo", score);

  document.getElementById("quizContainer").classList.add("hidden");
  document.getElementById("finalScreen").classList.remove("hidden");
  document.getElementById("finalScore").textContent = score;
  document.getElementById("finalLevel").textContent = texto;
}

// Ranking local
function saveToRanking(nome, pontos) {
  let ranking = JSON.parse(localStorage.getItem("ranking")) || [];
  ranking.push({ nome, pontos });
  ranking.sort((a, b) => b.pontos - a.pontos);
  ranking = ranking.slice(0, 5);
  localStorage.setItem("ranking", JSON.stringify(ranking));
}

function showRanking() {
  const rankingList = document.getElementById("rankingList");
  rankingList.innerHTML = "";
  const ranking = JSON.parse(localStorage.getItem("ranking")) || [];

  ranking.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = `${index + 1}. ${item.nome} - ${item.pontos}`;
    rankingList.appendChild(li);
  });

  document.getElementById("finalScreen").classList.add("hidden");
  document.getElementById("rankingScreen").classList.remove("hidden");
}

function backToQuiz() {
  document.getElementById("rankingScreen").classList.add("hidden");
  document.getElementById("finalScreen").classList.remove("hidden");
}

function restartQuiz() {
  current = 0;
  score = 0;
  document.getElementById("score").textContent = score;
  clearProgress();
  document.getElementById("finalScreen").classList.add("hidden");
  document.getElementById("quizContainer").classList.remove("hidden");
  carregarPerguntas();
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
  const session = localStorage.getItem("quizSession");
  const dados = getUser();

  if (session && dados && dados.user === session) {
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
