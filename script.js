let perguntas = [];
let current = 0;
let score = 0;

function saveUser(user, senha, sexo) {
  localStorage.setItem("narcisoUser", JSON.stringify({ user, senha, sexo }));
}

function getUser() {
  return JSON.parse(localStorage.getItem("narcisoUser"));
}

function register() {
  const user = document.getElementById("username").value;
  const senha = document.getElementById("password").value;
  const sexo = document.getElementById("gender").value;
  if (!user || !senha || !sexo) {
    alert("Preencha todos os campos para registrar.");
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
  location.reload();
}

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
    alert("Fim do quiz!");
    mostrarPremio();
    return;
  }
  const pergunta = perguntas[current];
  document.getElementById("question").textContent = pergunta.pergunta;
  const opcoesDiv = document.getElementById("options");
  opcoesDiv.innerHTML = "";
  pergunta.opcoes.forEach(opcao => {
    const btn = document.createElement("button");
    btn.textContent = opcao;
    btn.onclick = () => verificarResposta(opcao);
    opcoesDiv.appendChild(btn);
  });
}

function verificarResposta(resposta) {
  if (resposta === perguntas[current].resposta) {
    score += 100;
    document.getElementById("score").textContent = score;
  }
  current++;
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
