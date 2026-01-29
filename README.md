# Calculator Web Application

A responsive calculator web application built with Flask (Python) and HTML/CSS/JavaScript, featuring Basic and Scientific calculation modes with a modular theme system.

## Features

- ✅ **Basic Calculator Mode**: Standard calculator with number pad and basic operations (+, -, ×, ÷)
- ✅ **Scientific Calculator Mode**: Advanced functions including trigonometry, logarithms, and more
- ✅ **Device-Specific History**: Calculation history stored locally using browser LocalStorage
- ✅ **Modular Theme System**: Easy-to-extend theme architecture
  - Default Pink Theme (fully implemented with dark mode)
  - Sonic Theme (placeholder for future development)
- ✅ **Dark Mode Support**: Toggle between light and dark modes
- ✅ **Keyboard Support**: Full keyboard navigation and shortcuts
- ✅ **Responsive Design**: Works on desktop, tablet, and mobile devices

## Project Structure

```
Calculator/
├── app.py                      # Flask backend application
├── requirements.txt            # Python dependencies
├── templates/
│   └── main.html              # Main application template
├── static/
│   ├── css/
│   │   ├── main.css           # Main application styles
│   │   └── themes/
│   │       ├── pink.css       # Default Pink theme
│   │       └── sonic.css      # Sonic theme (placeholder)
│   └── js/
│       ├── calculator.js      # Calculator logic
│       ├── history.js         # History management
│       └── themes.js          # Theme management
└── README.md
```

## Installation

1. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Run the Flask application**:
   ```bash
   python app.py
   ```

3. **Open your browser**:
   Navigate to `http://localhost:5000`

## Usage

### Basic Calculator
- Click numbers and operators to build expressions
- Press `=` or `Enter` to calculate
- Press `AC` or `Escape` to clear
- Press backspace icon or `Backspace` key to delete last character

### Scientific Calculator
1. Click the "Scientific" toggle at the top
2. Additional function buttons will appear (sin, cos, tan, log, ln, √, π, etc.)
3. All basic calculator functions remain available

### History Management
- All calculations are automatically saved to history
- Click any history item to recall it to the calculator
- Hover over history items to see delete button
- Click "Clear all" to remove all history
- History is stored per device/browser (uses LocalStorage)

### Theme Switching
1. Click "Themes" in the navigation bar
2. A modal will open showing available themes
3. Click on a theme to select it
4. Theme preference is saved automatically
5. **Pink Theme**: Fully functional with light/dark mode
6. **Sonic Theme**: Placeholder - marked as "Coming Soon"

### Dark Mode
- Click the moon icon in the header to toggle dark mode
- Dark mode preference is saved automatically

### Keyboard Shortcuts
- **Numbers**: `0-9`
- **Operators**: `+`, `-`, `*`, `/`
- **Decimal**: `.`
- **Calculate**: `Enter` or `=`
- **Clear**: `Escape`
- **Backspace**: `Backspace`
- **Parentheses**: `(` and `)` (in Scientific mode)

## Adding New Themes

The theme system is designed to be modular and easy to extend. To add a new theme:

1. **Create a new CSS file** in `static/css/themes/`:
   ```css
   /* mytheme.css */
   :root {
       --color-primary: #your-color;
       --bg-light: #your-bg-color;
       /* ... define all CSS variables */
   }
   ```

2. **Update the Flask API** in `app.py`:
   Add your theme to the `/api/themes` endpoint:
   ```python
   {
       "id": "mytheme",
       "name": "My Theme",
       "file": "mytheme.css",
       "enabled": True,
       "description": "My awesome theme"
   }
   ```

3. **Restart the Flask server**
   The new theme will automatically appear in the theme selector!

## API Endpoints

### `GET /`
Returns the main calculator application page.

### `POST /api/calculate`
Server-side calculation endpoint (optional for validation).

**Request Body**:
```json
{
    "expression": "2 + 2 * 3"
}
```

**Response**:
```json
{
    "result": 8
}
```

### `GET /api/themes`
Returns list of available themes.

**Response**:
```json
{
    "themes": [
        {
            "id": "pink",
            "name": "Default Pink",
            "file": "pink.css",
            "enabled": true,
            "description": "Beautiful pink theme with dark mode support"
        }
    ]
}
```

## Browser Compatibility

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Technical Details

### Frontend Technologies
- **HTML5**: Semantic markup
- **CSS3**: Custom properties (variables), Flexbox, Grid
- **JavaScript (ES6+)**: Classes, async/await, LocalStorage API
- **Tailwind CSS**: Utility-first CSS framework (via CDN)
- **Google Fonts**: Plus Jakarta Sans typography
- **Material Symbols**: Icon library

### Backend Technologies
- **Flask 3.1.2**: Lightweight Python web framework
- **Python 3.x**: Server-side logic

### Storage
- **LocalStorage**: Client-side storage for history and preferences
- **No Database**: Keeps the application simple and portable

## Features NOT Included (As Per Requirements)

- ❌ User authentication or login system
- ❌ User profiles or accounts
- ❌ Converter tools (unit conversion, currency, etc.)
- ❌ Cloud sync or server-side history storage
- ❌ Profile management

## Development Notes

- **History is device-specific**: Each browser on each device maintains its own history
- **Theme system is extensible**: New themes can be added without modifying core files
- **Calculation is client-side**: For speed and offline capability
- **Server-side API available**: For complex calculations or validation if needed

## Future Enhancements

- Implement Sonic Theme design
- Add more scientific functions (factorial, combinations, etc.)
- Graph plotting capability
- Export/import history
- Additional themes (Ocean, Forest, Midnight, etc.)
- PWA (Progressive Web App) support for offline use

## License

This project is created for educational purposes.

## Support

For issues or questions, please contact the development team.

---

**Version**: 1.0.0
**Last Updated**: January 2026