# JavaScript Playground

A modern, web-based playground for writing, running, and sharing JavaScript code snippets with live preview capabilities.

## Features

✨ **Core Features**
- **JavaScript Code Editor** with syntax highlighting powered by Monaco Editor
- **Live Preview/Output Panel** with real-time code execution
- **Code Snippet Saving and Sharing** with local storage and URL sharing
- **Responsive Design** that works on desktop and mobile devices
- **Error Handling and Display** with detailed error messages
- **Theme Selector** with light/dark mode support

🎨 **Design**
- Modern, minimalistic interface
- Split-screen layout with editor on the left, output on the right
- Header with navigation and theme switcher
- Custom color palette with accent color #F7B731

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

### Building for Production

```bash
npm run build
```

### Linting

```bash
npm run lint
```

## Usage

### Writing Code
- Write JavaScript code in the left panel editor
- Code is automatically executed with a 1-second debounce
- Use `console.log()`, `console.error()`, `console.warn()`, and `console.info()` for output

### Keyboard Shortcuts
- **Ctrl+Enter** (or Cmd+Enter on Mac): Run code immediately
- **Ctrl+S** (or Cmd+S on Mac): Open snippet manager

### Saving Snippets
- Click the "Save" button or use Ctrl+S to open the snippet manager
- Give your snippet a name and save it locally
- Load saved snippets anytime from the snippet manager

### Sharing Code
- Click the "Share" button to generate a shareable URL
- The URL contains your code encoded in the query parameters
- Anyone with the URL can view and run your code

### Theme Switching
- Click the sun/moon icon in the header to toggle between light and dark themes
- Theme preference is saved locally

### Import/Export
- **Import**: Click the upload icon to import JavaScript files
- **Export**: Click the download icon to export your current code as a .js file

## Technical Details

### Built With
- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Monaco Editor** - Code editor (same as VS Code)
- **Lucide React** - Icons
- **UUID** - Unique identifiers for snippets

### Architecture
- **Client-side only** - No backend required
- **Local storage** - Snippets and preferences saved locally
- **URL sharing** - Code shared via base64 encoded URLs
- **Responsive design** - Works on all screen sizes

### Security
- Code execution is sandboxed within the browser
- No server-side execution
- No external API calls for code execution

## Development

The project structure follows Next.js 13+ app directory conventions:

```
src/
├── app/
│   ├── globals.css          # Global styles and theme variables
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main playground component
├── components/
│   ├── CodeEditor.tsx       # Monaco editor wrapper
│   ├── Header.tsx           # Header with controls
│   ├── OutputPanel.tsx      # Output display
│   ├── SharedCodeHandler.tsx # URL parameter handler
│   └── SnippetManager.tsx   # Snippet save/load modal
└── hooks/
    ├── useTheme.ts          # Theme management
    └── useLocalStorage.ts   # Local storage utilities
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm run lint`
5. Build: `npm run build`
6. Submit a pull request

## License

This project is open source and available under the MIT License.
