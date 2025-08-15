// ================= CONFIGURAÇÃO =================
const board = document.getElementById("board");
const scoreLabel = document.getElementById("scoreLabel");
const levelLabel = document.getElementById("levelLabel");
const message = document.getElementById("message");
const btnReset = document.getElementById("btnReset");
const btnHint = document.getElementById("btnHint");
const slowMode = document.getElementById("slowMode");

let score = 0;
let currentLevel = 0;
let flowers = [];
let targets = [];

// Definição das fases
const levels = [
  { colors: ["blue", "red", "green"], perColor: 1 },
  { colors: ["blue", "red", "green", "yellow"], perColor: 2 },
  { colors: ["blue", "red", "green", "yellow", "purple"], perColor: 2 }
];

// ================= FUNÇÕES PRINCIPAIS =================
function initLevel() {
  board.innerHTML = "";
  flowers = [];
  targets = [];
  score = 0;

  const level = levels[currentLevel];
  levelLabel.textContent = `Fase ${currentLevel + 1}`;
  updateScore();

  // Criar vasos (targets)
  const spacing = board.clientWidth / (level.colors.length + 1);
  level.colors.forEach((color, index) => {
    const target = document.createElement("div");
    target.classList.add("target");
    target.dataset.color = color;
    target.style.left = `${spacing * (index + 1) - 60}px`;
    target.style.top = "50px";
    target.style.background = getGradient(color);

    const label = document.createElement("div");
    label.classList.add("target-label");
    label.textContent = color.charAt(0).toUpperCase() + color.slice(1);

    target.appendChild(label);
    board.appendChild(target);
    targets.push(target);
  });

  // Criar flores (draggables)
  level.colors.forEach((color, index) => {
    for (let i = 0; i < level.perColor; i++) {
      const flower = document.createElement("div");
      flower.classList.add("flower");
      flower.style.background = color;
      flower.dataset.color = color;
      flower.style.left = `${50 + index * 60}px`;
      flower.style.top = `${300 + i * 60}px`;

      makeDraggable(flower);
      board.appendChild(flower);
      flowers.push(flower);
    }
  });
}

// Atualiza pontuação
function updateScore() {
  scoreLabel.textContent = `Acertos: ${score}`;
}

// Gradiente do vaso
function getGradient(color) {
  const light = {
    blue: "#cce9ff",
    red: "#ffdcdc",
    green: "#cfeedd",
    yellow: "#fffacd",
    purple: "#e8d5f7"
  };
  return `linear-gradient(180deg, #fff, ${light[color] || "#eee"})`;
}

// ================= ARRASTE =================
function makeDraggable(element) {
  let offsetX, offsetY, isDragging = false;

  element.addEventListener("mousedown", startDrag);
  document.addEventListener("mousemove", drag);
  document.addEventListener("mouseup", endDrag);

  element.addEventListener("touchstart", startDrag, { passive: false });
  document.addEventListener("touchmove", drag, { passive: false });
  document.addEventListener("touchend", endDrag);

  function startDrag(e) {
    e.preventDefault();
    isDragging = true;
    const rect = element.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    offsetX = clientX - rect.left;
    offsetY = clientY - rect.top;
  }

  function drag(e) {
    if (!isDragging) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const boardRect = board.getBoundingClientRect();
    element.style.left = `${clientX - boardRect.left - offsetX}px`;
    element.style.top = `${clientY - boardRect.top - offsetY}px`;
  }

  function endDrag() {
    if (!isDragging) return;
    isDragging = false;

    // Checar se está em cima de um vaso
    targets.forEach(target => {
      const targetRect = target.getBoundingClientRect();
      const flowerRect = element.getBoundingClientRect();
      const overlap = !(
        flowerRect.right < targetRect.left ||
        flowerRect.left > targetRect.right ||
        flowerRect.bottom < targetRect.top ||
        flowerRect.top > targetRect.bottom
      );

      if (overlap && element.dataset.color === target.dataset.color) {
        element.style.left = `${target.offsetLeft + 35}px`;
        element.style.top = `${target.offsetTop + 50}px`;
        element.style.pointerEvents = "none";
        score++;
        updateScore();
        checkLevelComplete();
      }
    });
  }
}

// ================= CHECAGEM DE FASE =================
function checkLevelComplete() {
  if (score === flowers.length) {
    setTimeout(() => {
      if (currentLevel < levels.length - 1) {
        alert(`Fase ${currentLevel + 1} concluída!`);
        currentLevel++;
        initLevel();
      } else {
        alert("Parabéns! Você completou todas as fases!");
        currentLevel = 0;
        initLevel();
      }
    }, 300);
  }
}

// ================= BOTÕES =================
btnReset.addEventListener("click", () => initLevel());
btnHint.addEventListener("click", () => {
  message.textContent = "Dica: cada flor vai no vaso da mesma cor!";
});

// ================= INICIAR JOGO =================
initLevel();