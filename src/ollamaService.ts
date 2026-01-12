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
                prompt: `Perform a CRITICAL production-readiness audit on the following code. 
Identify any HARMFUL patterns that would cause a PRODUCTION BREAK or CRASH.

Focus on:
1. Production Breakers: Unhandled promises, potential null pointer exceptions in critical paths, infinite loops, or unhandled exceptions that could crash the process.
2. Memory Leaks: Closures, uncleared intervals, or large object accumulation.
3. Database & I/O: Synchronous I/O in async environments, N+1 queries, or missing database transaction safety.
4. Security & Metadata: PII leakage in metadata, hardcoded secrets, or insecure API configurations.

Return its findings as a bulleted list. Start each bullet with a category label like [CRITICAL], [MEMORY], [IO], or [SECURITY].
If no issues are found, strictly return "No issues found".

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
