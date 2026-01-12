import * as vscode from 'vscode';
import { CodeExplanationHoverProvider } from './hoverProvider';
import { CodeAnalyzer } from './analyzer';

let statusBarItem: vscode.StatusBarItem;

export function activate(context: vscode.ExtensionContext) {
	console.log('Code Mentor extension is now active!');

	// Status Bar Item
	statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
	statusBarItem.text = "$(hubot) Code Mentor: Ready";
	statusBarItem.tooltip = "Ollama-powered code assistant";
	statusBarItem.show();
	context.subscriptions.push(statusBarItem);

	// Register Hover Provider
	const hoverProvider = vscode.languages.registerHoverProvider(
		{ scheme: 'file' },
		new CodeExplanationHoverProvider()
	);

	// Register Code Analyzer
	const analyzer = new CodeAnalyzer(statusBarItem);
	analyzer.activate(context);

	// Manual Analysis Command
	const manualAnalysis = vscode.commands.registerCommand('code-mentor.analyze', () => {
		if (vscode.window.activeTextEditor) {
			analyzer.analyze(vscode.window.activeTextEditor.document);
		}
	});

	context.subscriptions.push(hoverProvider, manualAnalysis);
}

export function deactivate() {
	if (statusBarItem) {
		statusBarItem.dispose();
	}
}
