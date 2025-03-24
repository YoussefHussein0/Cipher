const form = document.getElementById("controls");
const hInput = document.querySelector("#heading-input");
const hOutput = document.querySelector("#heading-output");
const selectEncodeOrDecode = document.getElementsByName("code");
const inputText = document.getElementById("input-text");
const outputText = document.getElementById("output-text");
const railsInput = document.getElementById("rails");

// Function to encrypt using Rail Fence Cipher
function railFenceEncrypt(text, rails) {
  if (rails < 2) return text;

  let fence = Array.from({ length: rails }, () => []);
  let rail = 0,
    direction = 1;

  for (let char of text) {
    fence[rail].push(char);
    rail += direction;

    if (rail === rails - 1 || rail === 0) {
      direction *= -1;
    }
  }

  return fence.flat().join("");
}

// Function to decrypt using Rail Fence Cipher
function railFenceDecrypt(cipherText, rails) {
  if (rails < 2) return cipherText;

  let fence = Array.from({ length: rails }, () => []);
  let rail = 0,
    direction = 1,
    index = 0;

  // Create fence pattern
  for (let i = 0; i < cipherText.length; i++) {
    fence[rail].push("*");
    rail += direction;

    if (rail === rails - 1 || rail === 0) {
      direction *= -1;
    }
  }

  // Fill fence with cipher text
  for (let row of fence) {
    for (let j = 0; j < row.length; j++) {
      row[j] = cipherText[index++];
    }
  }

  let result = "";
  rail = 0;
  direction = 1;

  for (let i = 0; i < cipherText.length; i++) {
    result += fence[rail].shift();
    rail += direction;

    if (rail === rails - 1 || rail === 0) {
      direction *= -1;
    }
  }

  return result;
}

// Change heading based on encryption/decryption selection
selectEncodeOrDecode.forEach((option) => {
  option.addEventListener("click", () => {
    if (option.value === "encrypt") {
      hInput.textContent = "Plaintext";
      hOutput.textContent = "Ciphertext";
      inputText.value = "";
      outputText.textContent = "";
    } else if (option.value === "decrypt") {
      hInput.textContent = "Ciphertext";
      hOutput.textContent = "Plaintext";
      inputText.value = "";
      outputText.textContent = "";
    }
  });
});

// Handle form submission for encryption/decryption
form.addEventListener("submit", (event) => {
  event.preventDefault();

  let text = inputText.value.trim();
  let rails = parseInt(railsInput.value);
  let selectedOption = Array.from(selectEncodeOrDecode).find(
    (option) => option.checked
  );

  if (!text) {
    outputText.textContent = "Please enter text.";
    return;
  }

  let result =
    selectedOption.value === "encrypt"
      ? railFenceEncrypt(text, rails)
      : railFenceDecrypt(text, rails);

  outputText.textContent = result;
});
