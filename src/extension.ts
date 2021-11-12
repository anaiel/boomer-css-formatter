import * as vscode from "vscode";
import Formatter from "./formatter";

export function activate() {
  vscode.commands.registerCommand("boomer-formatter.format", () => {
    const { activeTextEditor } = vscode.window;
    if (!activeTextEditor || !activeTextEditor.document.languageId) return;
    const { document } = activeTextEditor;

    if (document.languageId !== "scss") return;

    var start = new vscode.Position(0, 0);
    var end = new vscode.Position(
      document.lineCount - 1,
      document.lineAt(document.lineCount - 1).text.length
    );
    var range = new vscode.Range(start, end);
    var content = document.getText(range);

    const formatter = new Formatter(content);

    activeTextEditor.edit((edit) => {
      edit.replace(range, formatter.process());
    });
  });
}
