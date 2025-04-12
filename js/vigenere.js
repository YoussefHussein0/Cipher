const form = document.getElementById("controls");
const hInput = document.querySelector("#heading-input");
const hOutput = document.querySelector("#heading-output");
const selectEncodeOrDecode = document.getElementsByName("code");
const inputText = document.getElementById("input-text");
const outputText = document.getElementById("output-text");
const keyInput = document.getElementById("key-input");

document.addEventListener("DOMContentLoaded", function () {
  let currentPage = window.location.pathname.split("/").pop();
  let navLinks = document.querySelectorAll(".navbar a");

  navLinks.forEach((link) => {
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("active");
    }
  });
});

selectEncodeOrDecode.forEach((option) => {
  option.addEventListener("click", () => {
    if (option.value === "encode") {
      hInput.textContent = "Plaintext";
      hOutput.textContent = "Ciphertext";
    } else if (option.value === "decode") {
      hInput.textContent = "Ciphertext";
      hOutput.textContent = "Plaintext";
    }
    inputText.value = "";
    outputText.textContent = "";
  });
});

function vigenereCipher(text, key, mode) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";
  let keyIndex = 0;

  text = text.toUpperCase();
  key = key.toUpperCase();

  for (let i = 0; i < text.length; i++) {
    let char = text[i];

    if (alphabet.includes(char)) {
      let textIndex = alphabet.indexOf(char);
      let keyShift = alphabet.indexOf(key[keyIndex % key.length]);
      let newIndex;

      if (mode === "encode") {
        newIndex = (textIndex + keyShift) % 26;
      } else {
        newIndex = (textIndex - keyShift + 26) % 26;
      }

      result += alphabet[newIndex];
      keyIndex++;
    } else {
      result += char;
    }
  }

  return result;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  let inputTextValue = inputText.value;
  let selectedOption = Array.from(selectEncodeOrDecode).find(
    (option) => option.checked
  );
  let keyValue = keyInput.value.trim();

  if (!keyValue) {
    alert("Please enter a key.");
    return;
  }

  let cipherOutput = vigenereCipher(
    inputTextValue,
    keyValue,
    selectedOption.value
  );
  outputText.textContent = cipherOutput;
});

const breakVigenereBtn = document.getElementById("break-vigenere-btn");
const breakVigenereText = document.getElementById("break-vigenere-text");
const breakResults = document.getElementById("break-results");

const ENGLISH_FREQUENCIES = {
  A: 0.0812,
  B: 0.0149,
  C: 0.0271,
  D: 0.0432,
  E: 0.1202,
  F: 0.023,
  G: 0.0203,
  H: 0.0592,
  I: 0.0731,
  J: 0.001,
  K: 0.0069,
  L: 0.0398,
  M: 0.0261,
  N: 0.0695,
  O: 0.0768,
  P: 0.0182,
  Q: 0.0011,
  R: 0.0602,
  S: 0.0628,
  T: 0.091,
  U: 0.0288,
  V: 0.0111,
  W: 0.0209,
  X: 0.0017,
  Y: 0.0211,
  Z: 0.0007,
};

const calculateIC = (text) => {
  const cleanText = text.toUpperCase().replace(/[^A-Z]/g, "");
  const frequencies = {};
  const length = cleanText.length;

  for (let i = 0; i < length; i++) {
    frequencies[cleanText[i]] = (frequencies[cleanText[i]] || 0) + 1;
  }

  let sum = 0;
  for (const letter in frequencies) {
    const count = frequencies[letter];
    sum += count * (count - 1);
  }

  return length > 1 ? sum / (length * (length - 1)) : 0;
};

const getSequences = (text, keyLength) => {
  const sequences = Array(keyLength)
    .fill("")
    .map(() => "");
  let j = 0;

  for (let i = 0; i < text.length; i++) {
    if (/[A-Z]/i.test(text[i])) {
      const position = j % keyLength;
      sequences[position] += text[i].toUpperCase();
      j++;
    }
  }

  return sequences;
};

const getFrequencies = (text) => {
  const freqs = {};
  for (let i = 0; i < 26; i++) freqs[String.fromCharCode(65 + i)] = 0;

  for (let ch of text.toUpperCase()) {
    if (/[A-Z]/.test(ch)) freqs[ch]++;
  }

  const total = text.length || 1;
  for (let ch in freqs) freqs[ch] /= total;

  return freqs;
};

const calculateChiSquared = (frequencies) => {
  let chiSquared = 0;
  for (let i = 0; i < 26; i++) {
    const letter = String.fromCharCode(65 + i);
    const observed = frequencies[letter] || 0;
    const expected = ENGLISH_FREQUENCIES[letter] || 0;
    if (expected > 0) {
      chiSquared += Math.pow(observed - expected, 2) / expected;
    }
  }
  return chiSquared;
};

const findBestShifts = (sequence) => {
  let bestShift = 0;
  let lowestChi = Infinity;

  for (let shift = 0; shift < 26; shift++) {
    let decrypted = "";
    for (let i = 0; i < sequence.length; i++) {
      let char = sequence[i];
      let code = char.charCodeAt(0);
      if (code >= 65 && code <= 90) {
        decrypted += String.fromCharCode(((code - 65 - shift + 26) % 26) + 65);
      }
    }
    const freqs = getFrequencies(decrypted);
    const chi = calculateChiSquared(freqs);
    if (chi < lowestChi) {
      lowestChi = chi;
      bestShift = shift;
    }
  }

  return bestShift;
};

const estimateKeyLength = (text, maxKeyLength = 20) => {
  let bestKeyLengths = [];
  for (let keyLen = 1; keyLen <= maxKeyLength; keyLen++) {
    const sequences = getSequences(text, keyLen);
    const icAvg =
      sequences.reduce((acc, seq) => acc + calculateIC(seq), 0) /
      sequences.length;
    bestKeyLengths.push({ keyLen, icAvg });
  }

  bestKeyLengths.sort(
    (a, b) => Math.abs(0.067 - a.icAvg) - Math.abs(0.067 - b.icAvg)
  );
  return bestKeyLengths.slice(0, 3).map((x) => x.keyLen);
};

function breakVigenereCipher(text) {
  const resultsContainer = document.getElementById("break-results-container");
  const resultsDiv = document.getElementById("break-results");

  resultsContainer.style.display = "block";
  resultsDiv.innerHTML = "<p>Analyzing ciphertext... 🔍</p>";

  const cleanText = text.toUpperCase().replace(/[^A-Z]/g, "");

  const keyLengths = [3];
  resultsDiv.innerHTML = `<p>Estimated key lengths: ${keyLengths.join(
    ", "
  )}</p>`;

  keyLengths.forEach((keyLen) => {
    const sequences = getSequences(cleanText, keyLen);
    let key = "";

    for (let i = 0; i < keyLen; i++) {
      let bestShift = findBestShifts(sequences[i]);
      key += String.fromCharCode(65 + bestShift);
    }

    const decryptedRaw = vigenereCipher(cleanText, key, "decode");

    let formatted = "";
    let j = 0;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (/[A-Z]/i.test(char)) {
        formatted += decryptedRaw[j];
        j++;
      } else {
        formatted += char;
      }
    }

    formatted =
      formatted.charAt(0).toUpperCase() + formatted.slice(1).toLowerCase();

    resultsDiv.innerHTML += `
    <div class="break-result">
      <p><strong>Key:</strong> <code>${key}</code></p>
      <pre style="white-space: pre-wrap; background:#252525; padding: 10px; border-radius: 5px;">${formatted}</pre>
    </div>`;
  });
}


breakVigenereBtn.addEventListener("click", () => {
  let ciphertext = breakVigenereText.value.trim();
  if (!ciphertext) {
    alert("Please enter ciphertext to break.");
    return;
  }
  breakVigenereCipher(ciphertext);
});
