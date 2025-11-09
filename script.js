
let currentInput = ""; 
const displayEl = document.getElementById("display");

function updateDisplay() {
  displayEl.textContent = currentInput === "" ? "0" : currentInput;
}

const opSymbols = { add: "+", subtract: "-", multiply: "*", divide: "/" };

function appendToInput(str) {
  
  if (currentInput === "" && /^[+\*\/]/.test(str)) return;
  
  if (/^[+\-*/]$/.test(str) && /[+\-*/]$/.test(currentInput)) {
    
    currentInput = currentInput.replace(/[+\-*/]+$/g, "") + str;
  } else {
    currentInput += str;
  }
  updateDisplay();
}


function onNumberClick(digit) {
 
  if (digit === ".") {
    
    const tokens = currentInput.split(/[\+\-\*\/\(\)]/);
    const last = tokens[tokens.length - 1];
    if (last && last.includes(".")) return;
    if (last === "" && (currentInput === "" || /[+\-*/(]$/.test(currentInput))) {
      
      appendToInput("0.");
      return;
    }
  }
  appendToInput(digit);
}

function onOperatorClick(op) {
  const symbol = opSymbols[op];
  if (!symbol) return;
  appendToInput(symbol);
}

function onParenClick(paren) {

  if (paren === ")") {
    const open = (currentInput.match(/\(/g) || []).length;
    const close = (currentInput.match(/\)/g) || []).length;
    if (open <= close) return; 

    if (/[+\-*/(]$/.test(currentInput)) return;
    appendToInput(paren);
  } else {

    if (/\d$/.test(currentInput)) {
    
      appendToInput("*(");
    } else {
      appendToInput(paren);
    }
  }
}

function onEquals() {
  if (currentInput.trim() === "") return;

  const open = (currentInput.match(/\(/g) || []).length;
  const close = (currentInput.match(/\)/g) || []).length;
  if (open !== close) {
    displayError();
    return;
  }

  
  if (!/^[0-9+\-*/().\s]+$/.test(currentInput)) {
    displayError();
    return;
  }

  try {
    
    const result = Function(`'use strict'; return (${currentInput})`)();

    if (result === Infinity || result === -Infinity || Number.isNaN(result)) {
      displayError();
      return;
    }

    
    const rounded = typeof result === "number" ? parseFloat(result.toFixed(6)) : result;
    currentInput = String(rounded);
    updateDisplay();
  } catch (err) {
    displayError();
  }
}

function displayError() {
  currentInput = "Error";
  updateDisplay();
  
  setTimeout(() => {
    currentInput = "";
    updateDisplay();
  }, 900);
}

function onClear() {
  currentInput = "";
  updateDisplay();
}

function onBackspace() {
  if (currentInput.length === 0) return;
  currentInput = currentInput.slice(0, -1);
  updateDisplay();
}


document.querySelectorAll(".num").forEach(b =>
  b.addEventListener("click", () => onNumberClick(b.dataset.num))
);

document.querySelectorAll(".operator").forEach(b =>
  b.addEventListener("click", () => onOperatorClick(b.dataset.op))
);

document.querySelectorAll(".paren").forEach(b =>
  b.addEventListener("click", () => onParenClick(b.dataset.paren))
);

const eq = document.getElementById("equals");
if (eq) eq.addEventListener("click", onEquals);

const clr = document.getElementById("clear");
if (clr) clr.addEventListener("click", onClear);

const back = document.getElementById("back");
if (back) back.addEventListener("click", onBackspace);

window.addEventListener("keydown", (e) => {

  if (/^\d$/.test(e.key)) {
    onNumberClick(e.key);
    e.preventDefault();
    return;
  }

  if (e.key === ".") { onNumberClick("."); e.preventDefault(); return; }
  if (e.key === "Enter" || e.key === "=") { onEquals(); e.preventDefault(); return; }
  if (e.key === "Backspace") { onBackspace(); e.preventDefault(); return; }
  if (e.key === "Escape") { onClear(); e.preventDefault(); return; }
  if (e.key === "+") { onOperatorClick("add"); e.preventDefault(); return; }
  if (e.key === "-") { onOperatorClick("subtract"); e.preventDefault(); return; }
  if (e.key === "*") { onOperatorClick("multiply"); e.preventDefault(); return; }
  if (e.key === "/") { onOperatorClick("divide"); e.preventDefault(); return; }
  if (e.key === "(") { onParenClick("("); e.preventDefault(); return; }
  if (e.key === ")") { onParenClick(")"); e.preventDefault(); return; }
});


updateDisplay();
