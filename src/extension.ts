import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "boomer-formatter.format",
    () => {
      const { activeTextEditor } = vscode.window;
      if (!activeTextEditor || !activeTextEditor.document.languageId) return;

      const { document } = activeTextEditor;
      const firstLine = document.lineAt(0);

      if (firstLine.text !== "42") {
        const edit = new vscode.WorkspaceEdit();
        edit.insert(document.uri, firstLine.range.start, "42\n");

        return vscode.workspace.applyEdit(edit);
      }
    }
  );

  context.subscriptions.push(disposable);
}
