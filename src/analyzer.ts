import * as vscode from 'vscode';
import { OllamaService } from './ollamaService';

export class CodeAnalyzer {
    private diagnosticCollection: vscode.DiagnosticCollection;
    private timeout: NodeJS.Timeout | undefined;
    private statusBarItem: vscode.StatusBarItem;

    constructor(statusBarItem: vscode.StatusBarItem) {
        this.diagnosticCollection = vscode.languages.createDiagnosticCollection('code-mentor');
        this.statusBarItem = statusBarItem;
    }

    public activate(context: vscode.ExtensionContext) {
        if (vscode.window.activeTextEditor) {
            this.triggerAnalysis(vscode.window.activeTextEditor.document);
        }

        context.subscriptions.push(
            vscode.window.onDidChangeActiveTextEditor(editor => {
                if (editor) {
                    this.triggerAnalysis(editor.document);
                }
            }),
            vscode.workspace.onDidChangeTextDocument(event => {
                this.triggerAnalysis(event.document);
            }),
            vscode.workspace.onDidCloseTextDocument(document => {
                this.diagnosticCollection.delete(document.uri);
            }),
            this.diagnosticCollection
        );
    }

    private triggerAnalysis(document: vscode.TextDocument) {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        this.timeout = setTimeout(() => this.analyze(document), 3000);
    }

    public async analyze(document: vscode.TextDocument) {
        if (document.uri.scheme !== 'file') {
            return;
        }

        const text = document.getText();
        if (!text.trim()) {
            return;
        }

        this.statusBarItem.text = "$(sync~spin) Code Mentor: Analyzing...";
        this.statusBarItem.tooltip = "Ollama is auditing your code for leaks, security, and performance...";

        try {
            const ollama = OllamaService.getInstance();
            const analysisResult = await ollama.analyzeCode(text);

            const diagnostics: vscode.Diagnostic[] = [];
            const issues = this.parseIssues(analysisResult);

            issues.forEach(issue => {
                const range = new vscode.Range(0, 0, 0, 80);
                const diagnostic = new vscode.Diagnostic(
                    range,
                    issue.message,
                    issue.severity
                );
                diagnostic.source = 'Code Mentor (Ollama)';
                diagnostic.code = issue.code;
                diagnostics.push(diagnostic);
            });

            this.diagnosticCollection.set(document.uri, diagnostics);

            if (issues.length > 0) {
                this.statusBarItem.text = `$(warning) Code Mentor: ${issues.length} audit finding(s)`;
            } else {
                this.statusBarItem.text = "$(check) Code Mentor: No issues";
            }
        } catch (error) {
            this.statusBarItem.text = "$(error) Code Mentor: Offline";
            console.error('Analysis error:', error);
        }
    }

    private parseIssues(text: string): { message: string, severity: vscode.DiagnosticSeverity, code: string }[] {
        const issues: { message: string, severity: vscode.DiagnosticSeverity, code: string }[] = [];
        const lowerText = text.toLowerCase();

        const checkIssue = (keywords: string[], messagePrefix: string, severity: vscode.DiagnosticSeverity, code: string) => {
            if (keywords.some(k => lowerText.includes(k))) {
                const line = text.split('\n').find(l => keywords.some(k => l.toLowerCase().includes(k)));
                issues.push({
                    message: line ? line.trim() : `${messagePrefix} issue detected.`,
                    severity,
                    code
                });
            }
        };

        checkIssue(['memory leak', 'leak', 'closure'], 'Memory Leak', vscode.DiagnosticSeverity.Warning, 'mem-leak');
        checkIssue(['database', 'db call', 'query', 'sql', 'n+1'], 'Database', vscode.DiagnosticSeverity.Information, 'db-issue');
        checkIssue(['blocking', 'synchronous', 'sync fs'], 'I/O Blocking', vscode.DiagnosticSeverity.Error, 'io-blocking');
        checkIssue(['insecure', 'pii', 'credential', 'header security', 'metadata'], 'Security', vscode.DiagnosticSeverity.Error, 'security-risk');

        return issues;
    }
}
