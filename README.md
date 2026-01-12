# Code Mentor 🤖

Code Mentor is a production-ready VS Code extension that provides real-time AI-powered code audits and explanations using a locally hosted Ollama instance.

## 🚀 Features

- **Hover Explanations**: Hover over any code block or function to get a clear, concise explanation of what it does.
- **Real-time Audit**: Automatically analyzes your code as you type for:
    - 💧 **Memory Leaks**: Detection of closures, intervals, and potential reference leaks.
    - 🗄️ **Database Optimization**: Identifies N+1 queries and missing indexes.
    - ⚡ **I/O Blocking**: Detects synchronous calls and blocking loops that hurt performance.
    - 🛡️ **Data Security**: Audits API metadata for PII leakage and insecure configurations.
- **Local LLM**: Powered by Ollama. No data ever leaves your machine.
- **Status Bar Integration**: Visual indications of code health and analysis progress.

## 🛠️ Requirements

1. **Ollama**: You must have [Ollama](https://ollama.ai/) installed and running locally.
2. **Model**: By default, it uses `deepseek-coder`. You can pull it using:
   ```bash
   ollama pull deepseek-coder
   ```

## ⚙️ Extension Settings

This extension contributes the following settings:

* `codeMentor.ollamaModel`: Specify the Ollama model to use (default: `deepseek-coder`).
* `codeMentor.ollamaUrl`: The URL for your local Ollama instance (default: `http://localhost:11434`).

## 📖 Usage

- **Hover**: Simply move your mouse over a piece of code to see an explanation.
- **Audit**: Open any file, and the audit will run automatically. Check the **Problems** tab or the status bar for results.
- **Manual Analyze**: Use the command `Code Mentor: Analyze Current File` from Command Palette.

## 🔒 Security

All processing is done locally via Ollama. No source code is sent to external servers.

Calling out known issues can help limit users opening duplicate issues against your extension.

## Release Notes

Users appreciate release notes as you update your extension.

### 1.0.0

Initial release of ...

### 1.0.1

Fixed issue #.

### 1.1.0

Added features X, Y, and Z.

---

## Following extension guidelines

Ensure that you've read through the extensions guidelines and follow the best practices for creating your extension.

* [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

## Working with Markdown

You can author your README using Visual Studio Code. Here are some useful editor keyboard shortcuts:

* Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux).
* Toggle preview (`Shift+Cmd+V` on macOS or `Shift+Ctrl+V` on Windows and Linux).
* Press `Ctrl+Space` (Windows, Linux, macOS) to see a list of Markdown snippets.

## For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**
