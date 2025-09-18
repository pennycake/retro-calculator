// DOM Elements
const display = document.getElementById('output');
const buttons = document.querySelectorAll('.btn');
const flipButton = document.getElementById('flip-button');
const calculator = document.querySelector('.calculator');
const waveContainer = document.querySelector('.wave-container');

// Easter egg patterns
const EASTER_EGGS = {
    '07734': 'hello' // Upside down "HELLO"
};

// Flip state
let isFlipped = false;

// Check for easter eggs
function checkEasterEggs() {
    const currentNumber = display.textContent;
    
    // Check if current number matches any easter egg pattern
    if (EASTER_EGGS.hasOwnProperty(currentNumber) && isFlipped) {
        // Delay text change and animation
        setTimeout(() => {
            /* display.textContent = 'HELLO';
            display.classList.add('text-counter-rotate'); */
            waveContainer.classList.add('active');
        }, 500);
    } else {
        // Hide waving animation and restore number
        waveContainer.classList.remove('active');
        /* if (display.textContent === 'HELLO') {
            display.classList.remove('text-counter-rotate');
            display.textContent = '07734';
        } */
    }
}

// Add flip button event listener
flipButton.addEventListener('click', () => {
    isFlipped = !isFlipped;
    calculator.className = 'calculator ' + (isFlipped ? 'flipped' : 'unflipped');
    
    // Check for easter eggs when flipping
    checkEasterEggs();
});

// Calculator state
let currentExpression = '';
let lastResult = '';

// Keyboard mapping
const keyboardMap = {
    '0': '0', '1': '1', '2': '2', '3': '3', '4': '4',
    '5': '5', '6': '6', '7': '7', '8': '8', '9': '9',
    '+': '+', '-': '-', '*': '×', '/': '÷',
    '(': '(', ')': ')', '.': '.',
    'Enter': '=', '=': '=',
    'Escape': 'C', 'c': 'C',
    'Backspace': 'backspace'
};

// Add keyboard event listener
document.addEventListener('keydown', handleKeyPress);

// Add event listeners to all buttons
buttons.forEach(button => {
    button.addEventListener('click', () => handleButtonClick(button));
});

// Handle button clicks
function handleButtonClick(button) {
    const value = button.textContent;

    if (button.classList.contains('number') || button.classList.contains('decimal')) {
        handleNumber(value);
    } else if (button.classList.contains('operator')) {
        handleOperator(value);
    } else if (button.classList.contains('bracket')) {
        handleBracket(value);
    } else if (button.classList.contains('equals')) {
        calculateResult();
    } else if (button.classList.contains('clear')) {
        clearCalculator();
    }

    updateDisplay();
}

// Handle number input
function handleNumber(value) {
    if (lastResult !== '' && currentExpression === '') {
        // If starting new calculation after previous result
        currentExpression = value;
        lastResult = '';
    } else {
        currentExpression += value;
    }
}

// Handle operator input
function handleOperator(value) {
    // Replace × and ÷ with * and / for evaluation
    const operatorMap = { '×': '*', '÷': '/' };
    const operator = operatorMap[value] || value;

    if (currentExpression !== '' && !isLastCharOperator()) {
        currentExpression += operator;
    } else if (lastResult !== '') {
        // Use previous result for new calculation
        currentExpression = lastResult + operator;
        lastResult = '';
    }
}

// Handle bracket input
function handleBracket(value) {
    if (value === '(' && (currentExpression === '' || isLastCharOperator())) {
        currentExpression += value;
    } else if (value === ')' && !isLastCharOperator() && countChar('(') > countChar(')')) {
        currentExpression += value;
    }
}

// Calculate result
function calculateResult() {
    if (currentExpression === '') return;

    try {
        // Replace × and ÷ with * and / for evaluation
        let expression = currentExpression.replace(/×/g, '*').replace(/÷/g, '/');
        lastResult = eval(expression).toString();
        currentExpression = '';
        display.textContent = lastResult;
    } catch (error) {
        display.textContent = 'Error';
        currentExpression = '';
        lastResult = '';
    }
}

// Clear calculator
function clearCalculator() {
    currentExpression = '';
    lastResult = '';
}

// Handle keyboard input
function handleKeyPress(event) {
    const key = event.key;
    
    // Check if key is in our mapping
    if (key in keyboardMap) {
        event.preventDefault(); // Prevent default browser actions
        
        if (keyboardMap[key] === 'backspace') {
            // Handle backspace - remove last character
            currentExpression = currentExpression.slice(0, -1);
            updateDisplay();
            return;
        }
        
        // Find and simulate click on corresponding button
        const buttonText = keyboardMap[key];
        const button = Array.from(buttons).find(btn => btn.textContent === buttonText);
        
        if (button) {
            button.click();
            // Add visual feedback for key press
            button.classList.add('active');
            setTimeout(() => button.classList.remove('active'), 100);
        }
    }
}

// Update display
function updateDisplay() {
    display.textContent = currentExpression || lastResult || '0';
    
    // Check for easter eggs after display update
    checkEasterEggs();
}

// Helper functions
function isLastCharOperator() {
    return /[+\-×÷]$/.test(currentExpression);
}

function countChar(char) {
    return (currentExpression.match(new RegExp('\\' + char, 'g')) || []).length;
}