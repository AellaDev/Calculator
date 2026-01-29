from flask import Flask, render_template, jsonify, request
import math
import re

app = Flask(__name__)

# Configure Flask
app.config['SECRET_KEY'] = 'calculator-secret-key-change-in-production'
app.config['TEMPLATES_AUTO_RELOAD'] = True

@app.route('/')
def index():
    """Serve the main calculator page"""
    return render_template('main.html')

@app.route('/api/calculate', methods=['POST'])
def calculate():
    """
    API endpoint for server-side calculations (optional for complex operations)
    Accepts JSON with 'expression' field
    Returns JSON with 'result' or 'error'
    """
    try:
        data = request.get_json()
        expression = data.get('expression', '')
        
        if not expression:
            return jsonify({'error': 'No expression provided'}), 400
        
        # Sanitize and prepare expression
        # Replace special characters with Python equivalents
        expression = expression.replace('×', '*').replace('÷', '/').replace('−', '-')
        
        # For scientific calculations
        # Add support for common functions
        safe_dict = {
            'sin': math.sin,
            'cos': math.cos,
            'tan': math.tan,
            'sqrt': math.sqrt,
            'log': math.log10,
            'ln': math.log,
            'pi': math.pi,
            'e': math.e,
            'pow': pow,
            'abs': abs,
        }
        
        # Evaluate the expression safely
        result = eval(expression, {"__builtins__": {}}, safe_dict)
        
        return jsonify({'result': result})
    
    except ZeroDivisionError:
        return jsonify({'error': 'Division by zero'}), 400
    except Exception as e:
        return jsonify({'error': f'Invalid expression: {str(e)}'}), 400

@app.route('/api/themes', methods=['GET'])
def get_themes():
    """Return available themes configuration"""
    themes = {
        "themes": [
            {
                "id": "pink",
                "name": "Default Pink",
                "file": "pink.css",
                "enabled": True,
                "description": "Beautiful pink theme with dark mode support"
            },
            {
                "id": "sonic",
                "name": "Sonic Theme",
                "file": "sonic.css",
                "enabled": False,
                "description": "Coming soon - Placeholder theme"
            }
        ]
    }
    return jsonify(themes)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
