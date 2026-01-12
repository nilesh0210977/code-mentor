import * as vscode from 'vscode';
import { OllamaService } from './ollamaService';

export class CodeExplanationHoverProvider implements vscode.HoverProvider {
    public async provideHover(
        document: vscode.TextDocument,
        position: vscode.Position,
        _token: vscode.CancellationToken
    ): Promise<vscode.Hover | null> {
        const editor = vscode.window.activeTextEditor;
        let textToExplain = '';
        let range: vscode.Range | undefined;

        // If there's a selection, use it
        if (editor && !editor.selection.isEmpty) {
            textToExplain = document.getText(editor.selection);
            range = editor.selection;
        } else {
            // Otherwise, get the current line or function
            range = document.getWordRangeAtPosition(position);
            textToExplain = document.lineAt(position.line).text;
        }

        if (!textToExplain.trim()) {
            return null;
        }

        const ollama = OllamaService.getInstance();

        // Show a "Loading..." message first or just wait
        // In a real production app, we might use a progress bar or a temporary hover

        const explanation = await ollama.explainCode(textToExplain);

        const markdown = new vscode.MarkdownString();
        markdown.appendMarkdown(`### 💡 Code Mentor Explanation\n\n`);
        markdown.appendMarkdown(explanation);
        markdown.appendMarkdown(`\n\n---\n*Powered by local Ollama*`);
        markdown.isTrusted = true;

        return new vscode.Hover(markdown, range);
    }
}
