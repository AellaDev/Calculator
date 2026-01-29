/**
 * Calculator Logic - Handles Basic and Scientific Calculator Operations
 */

class Calculator {
    constructor() {
        this.currentExpression = '';
        this.currentResult = '0';
        this.mode = 'basic'; // 'basic' or 'scientific'
        this.lastAnswer = 0;
        this.isScientific = false;
        
        this.init();
    }
    
    init() {
        this.displayExpression = document.getElementById('display-expression');
        this.displayResult = document.getElementById('display-result');
        this.bindButtons();
        this.updateDisplay();
    }
    
    bindButtons() {
        // Number buttons
        document.querySelectorAll('[data-number]').forEach(button => {
            button.addEventListener('click', () => {
                this.appendNumber(button.dataset.number);
            });
        });
        
        // Operator buttons
        document.querySelectorAll('[data-operator]').forEach(button => {
            button.addEventListener('click', () => {
                this.appendOperator(button.dataset.operator);
            });
        });
        
        // Function buttons (scientific)
        document.querySelectorAll('[data-function]').forEach(button => {
            button.addEventListener('click', () => {
                this.appendFunction(button.dataset.function);
            });
        });
        
        // Clear button
        const clearBtn = document.getElementById('btn-clear');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clear());
        }
        
        // Backspace button
        const backspaceBtn = document.getElementById('btn-backspace');
        if (backspaceBtn) {
            backspaceBtn.addEventListener('click', () => this.backspace());
        }
        
        // Equals button
        const equalsBtn = document.getElementById('btn-equals');
        if (equalsBtn) {
            equalsBtn.addEventListener('click', () => this.calculate());
        }
        
        // Keyboard support
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }
    
    appendNumber(number) {
        // Prevent multiple decimal points
        if (number === '.' && this.currentExpression.split(/[\+\-\×\÷]/).pop().includes('.')) {
            return;
        }
        
        // Start fresh if showing result
        if (this.currentExpression === '' && this.currentResult !== '0') {
            this.currentExpression = '';
        }
        
        this.currentExpression += number;
        this.updateDisplay();
    }
    
    appendOperator(operator) {
        if (this.currentExpression === '' && operator !== '-') {
            return; // Can't start with operator except minus
        }
        
        // Replace last operator if double operators
        const lastChar = this.currentExpression.slice(-1);
        if (['+', '-', '×', '÷'].includes(lastChar)) {
            this.currentExpression = this.currentExpression.slice(0, -1);
        }
        
        this.currentExpression += operator;
        this.updateDisplay();
    }
    
    appendFunction(func) {
        switch(func) {
            case 'sin':
            case 'cos':
            case 'tan':
            case 'log':
            case 'ln':
            case 'sqrt':
                this.currentExpression += func + '(';
                break;
            case 'pi':
                this.currentExpression += 'π';
                break;
            case 'e':
                this.currentExpression += 'e';
                break;
            case 'pow':
                this.currentExpression += '^(';
                break;
            case '(':
            case ')':
                this.currentExpression += func;
                break;
            case 'percent':
                this.calculatePercentage();
                return;
            case 'square':
                this.currentExpression += '^2';
                break;
        }
        this.updateDisplay();
    }
    
    clear() {
        this.currentExpression = '';
        this.currentResult = '0';
        this.updateDisplay();
    }
    
    backspace() {
        this.currentExpression = this.currentExpression.slice(0, -1);
        this.updateDisplay();
    }
    
    calculatePercentage() {
        if (this.currentExpression === '') return;
        
        try {
            const result = this.evaluateExpression(this.currentExpression);
            this.currentResult = (result / 100).toString();
            this.currentExpression = this.currentResult;
            this.updateDisplay();
        } catch (error) {
            this.showError('Error');
        }
    }
    
    calculate() {
        if (this.currentExpression === '') return;
        
        try {
            const result = this.evaluateExpression(this.currentExpression);
            
            // Format the result
            this.currentResult = this.formatNumber(result);
            this.lastAnswer = result;
            
            // Save to history
            if (window.historyManager) {
                window.historyManager.addCalculation(
                    this.currentExpression,
                    this.currentResult
                );
            }
            
            // Update expression to show completed calculation
            const displayExpr = this.currentExpression;
            this.currentExpression = '';
            
            this.updateDisplay(displayExpr, this.currentResult);
            
        } catch (error) {
            console.error('Calculation error:', error);
            this.showError('Error');
        }
    }
    
    evaluateExpression(expr) {
        // Replace display symbols with JavaScript equivalents
        let evalExpr = expr
            .replace(/×/g, '*')
            .replace(/÷/g, '/')
            .replace(/−/g, '-')
            .replace(/π/g, Math.PI.toString())
            .replace(/e/g, Math.E.toString())
            .replace(/\^/g, '**');
        
        // Replace scientific functions
        evalExpr = evalExpr
            .replace(/sin\(/g, 'Math.sin(')
            .replace(/cos\(/g, 'Math.cos(')
            .replace(/tan\(/g, 'Math.tan(')
            .replace(/sqrt\(/g, 'Math.sqrt(')
            .replace(/log\(/g, 'Math.log10(')
            .replace(/ln\(/g, 'Math.log(');
        
        // Evaluate safely
        try {
            // Using Function constructor for safer eval
            const result = Function('"use strict"; return (' + evalExpr + ')')();
            return result;
        } catch (error) {
            throw new Error('Invalid expression');
        }
    }
    
    formatNumber(num) {
        if (isNaN(num) || !isFinite(num)) {
            return 'Error';
        }
        
        // Round to reasonable precision
        const rounded = Math.round(num * 100000000) / 100000000;
        
        // Format with commas for large numbers
        if (Math.abs(rounded) >= 1000) {
            return rounded.toLocaleString('en-US', {
                maximumFractionDigits: 8
            });
        }
        
        return rounded.toString();
    }
    
    updateDisplay(expr = null, result = null) {
        if (this.displayExpression) {
            this.displayExpression.textContent = expr || this.currentExpression || '0';
        }
        
        if (this.displayResult) {
            this.displayResult.textContent = result || this.currentResult;
        }
    }
    
    showError(message) {
        this.currentResult = message;
        this.updateDisplay();
        
        // Clear after 2 seconds
        setTimeout(() => {
            this.clear();
        }, 2000);
    }
    
    handleKeyboard(e) {
        // Number keys
        if (e.key >= '0' && e.key <= '9') {
            this.appendNumber(e.key);
        }
        
        // Operators
        if (e.key === '+') this.appendOperator('+');
        if (e.key === '-') this.appendOperator('−');
        if (e.key === '*') this.appendOperator('×');
        if (e.key === '/') {
            e.preventDefault();
            this.appendOperator('÷');
        }
        
        // Decimal point
        if (e.key === '.') this.appendNumber('.');
        
        // Enter/Equals
        if (e.key === 'Enter' || e.key === '=') {
            e.preventDefault();
            this.calculate();
        }
        
        // Backspace
        if (e.key === 'Backspace') {
            e.preventDefault();
            this.backspace();
        }
        
        // Escape/Clear
        if (e.key === 'Escape') {
            this.clear();
        }
        
        // Parentheses (scientific mode)
        if (e.key === '(' || e.key === ')') {
            this.appendFunction(e.key);
        }
    }
    
    setMode(mode) {
        this.mode = mode;
        this.isScientific = (mode === 'scientific');
        
        // Toggle scientific UI
        document.body.classList.toggle('scientific', this.isScientific);
    }
    
    loadCalculation(expression, result) {
        this.currentExpression = expression;
        this.currentResult = result;
        this.updateDisplay();
    }
}

// Initialize calculator when DOM is ready
let calculator;
document.addEventListener('DOMContentLoaded', () => {
    calculator = new Calculator();
    
    // Expose globally for other scripts
    window.calculator = calculator;
});
