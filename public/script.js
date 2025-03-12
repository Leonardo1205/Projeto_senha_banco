function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Elementos
const buttonsContainer = document.getElementById("buttons-container");
const passwordInput = document.getElementById("password-input");
const deleteBtn = document.getElementById("deleteBtn");
const accessBtn = document.getElementById("accessBtn");
const errorMessage = document.getElementById("error-message");

let options = "";
let buttonNumbers = [];

// Inicializar botões com números embaralhados
function updateButtonNumbers() {
  const numbers = Array.from({ length: 10 }, (_, i) => i);
  const shuffledNumbers = shuffleArray(numbers);

  buttonNumbers = shuffledNumbers.map((num, index) => {
      if (shuffledNumbers[index + 5] != null) {
          return `${num} ou ${shuffledNumbers[index + 5]}`;
      } else {
          return null;
      }
  }).filter(item => item !== null);

  renderButtons();
}

// Renderizar botões
function renderButtons() {
  buttonsContainer.innerHTML = "";
  buttonNumbers.forEach((buttonText) => {
      const button = document.createElement("button");
      button.textContent = buttonText;
      button.addEventListener("click", () => handleButtonClick(buttonText));
      buttonsContainer.appendChild(button);
  });
}

// Capturar clique nos botões de senha
function handleButtonClick(buttonText) {
  if (options.length < 6) {
      options += buttonText.split(" ou ")[0];
      updatePasswordInput();
  }
}

// Atualizar campo de senha mascarado
function updatePasswordInput() {
  passwordInput.textContent = options.replace(/./g, '*');
}

// Deletar último número digitado
deleteBtn.addEventListener("click", () => {
  options = options.slice(0, -1);
  updatePasswordInput();
});

// Validar senha no backend
accessBtn.addEventListener("click", async () => {
  try {
      const response = await fetch(`http://localhost:8080/api/usuario/validar?senha=${options}`);
      const usuario = await response.json();

      if (usuario.nome) {
          window.location.href = `usuario.html?nome=${usuario.nome}&senha=${usuario.senha}`;
      } else {
          errorMessage.style.display = "block";
      }
  } catch (error) {
      console.error("Erro ao validar senha:", error);
      errorMessage.style.display = "block";
  }
});

// Inicializar os botões ao carregar a página
updateButtonNumbers();