let display = document.getElementById('display');
let currentInput = '';
let operator = null;
let previousValue = null;
let shouldResetDisplay = false;

function appendNumber(num) {
    if (shouldResetDisplay) {
        currentInput = '';
        shouldResetDisplay = false;
    }
    
    // Prevent leading zeros
    if (currentInput === '0' && num !== '.') {
        currentInput = num;
    } else {
        currentInput += num;
    }
    
    updateDisplay();
}

function appendOperator(op) {
    if (currentInput === '' && op === '.') return;
    
    // Prevent multiple decimal points
    if (op === '.' && currentInput.includes('.')) return;
    
    if (currentInput === '') {
        if (previousValue === null) return;
        currentInput = previousValue;
    }
    
    if (operator !== null && !shouldResetDisplay) {
        calculate();
    }
    
    operator = op;
    previousValue = currentInput;
    currentInput = '';
    shouldResetDisplay = true;
}

function calculate() {
    if (operator === null || previousValue === null || currentInput === '') {
        return;
    }
    
    let result;
    const prev = parseFloat(previousValue);
    const current = parseFloat(currentInput);
    
    switch (operator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            if (current === 0) {
                display.value = 'Error';
                currentInput = '';
                operator = null;
                previousValue = null;
                shouldResetDisplay = true;
                return;
            }
            result = prev / current;
            break;
        default:
            return;
    }
    
    // Round to avoid floating point errors
    result = Math.round(result * 100000000) / 100000000;
    
    currentInput = result.toString();
    operator = null;
    previousValue = null;
    shouldResetDisplay = true;
    updateDisplay();
}

function clearDisplay() {
    currentInput = '';
    operator = null;
    previousValue = null;
    shouldResetDisplay = false;
    updateDisplay();
}

function deleteLast() {
    if (shouldResetDisplay) return;
    currentInput = currentInput.slice(0, -1);
    updateDisplay();
}

function updateDisplay() {
    display.value = currentInput || '0';
}

// Keyboard support
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    if (key >= '0' && key <= '9') {
        appendNumber(key);
    } else if (key === '.') {
        appendOperator('.');
    } else if (key === '+' || key === '-') {
        appendOperator(key);
    } else if (key === '*') {
        appendOperator('*');
        event.preventDefault();
    } else if (key === '/') {
        appendOperator('/');
        event.preventDefault();
    } else if (key === 'Enter' || key === '=') {
        calculate();
        event.preventDefault();
    } else if (key === 'Backspace') {
        deleteLast();
        event.preventDefault();
    } else if (key === 'Escape') {
        clearDisplay();
        event.preventDefault();
    }
});

// Initialize display
updateDisplay();
