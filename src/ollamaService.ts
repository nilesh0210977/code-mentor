import { Ollama } from 'ollama';
import * as vscode from 'vscode';

export class OllamaService {
    private static instance: OllamaService;
    private ollama: Ollama;

    private constructor() {
        const config = vscode.workspace.getConfiguration('codeMentor');
        const host = config.get<string>('ollamaUrl') || 'http://localhost:11434';
        this.ollama = new Ollama({ host });
    }

    public static getInstance(): OllamaService {
        if (!OllamaService.instance) {
            OllamaService.instance = new OllamaService();
        }
        return OllamaService.instance;
    }

    private getModel(): string {
        const config = vscode.workspace.getConfiguration('codeMentor');
        return config.get<string>('ollamaModel') || 'deepseek-coder';
    }

    public async explainCode(code: string): Promise<string> {
        try {
            const response = await this.ollama.generate({
                model: this.getModel(),
                prompt: `Explain the following code concisely and clearly:\n\n${code}`,
            });
            return response.response;
        } catch (error) {
            console.error('Ollama Error:', error);
            return 'Failed to get explanation from Ollama. Make sure Ollama is running and the model is downloaded.';
        }
    }

    public async analyzeCode(code: string): Promise<string> {
        try {
            const response = await this.ollama.generate({
                model: this.getModel(),
                prompt: `Perform a production-level security and performance audit on this code.
Check for:
1. Memory leaks (e.g., closures, uncleared intervals, event listeners).
2. Database calls (e.g., raw queries, N+1 problems, missing indexes).
3. I/O blocking (e.g., synchronous FS calls, long-running loops).
4. Data insecurity in API metadata (e.g., PII in headers, sensitive data in logs).

Return a list of issues found. BE SPECIFIC. If no issues, reply "No issues found".
Code:
${code}`,
            });
            return response.response;
        } catch (error) {
            console.error('Ollama Error:', error);
            return 'Analysis failed. Could not connect to Ollama.';
        }
    }
}
