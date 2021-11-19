import * as vscode from 'vscode';
import boomerFormatter from './boomerFormatter';
import { resolveEOL } from './utils';

export function activate(context: vscode.ExtensionContext) {
	
	let disposable = vscode.languages.registerDocumentFormattingEditProvider('scss', {
		provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.TextEdit[] {
				const firstLine = document.lineAt(0);
				const lastLine = document.lineAt(document.lineCount - 1);
				const wholeDocumentRange = new vscode.Range(firstLine.range.start, lastLine.range.end);

				const originalText = document.getText(wholeDocumentRange);
				const formattedText = boomerFormatter(originalText, resolveEOL(document.eol));

        return [vscode.TextEdit.replace(wholeDocumentRange, formattedText)];
		}
	});

	context.subscriptions.push(disposable);
}
