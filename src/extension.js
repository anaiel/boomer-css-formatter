"use strict";
exports.__esModule = true;
exports.activate = void 0;
var vscode = require("vscode");
var formatter_1 = require("./formatter");
function activate(context) {
    var disposable = vscode.commands.registerCommand("boomer-formatter.format", function () {
        var activeTextEditor = vscode.window.activeTextEditor;
        if (!activeTextEditor || !activeTextEditor.document.languageId)
            return;
        var document = activeTextEditor.document;
        var start = new vscode.Position(0, 0);
        var end = new vscode.Position(document.lineCount - 1, document.lineAt(document.lineCount - 1).text.length);
        var range = new vscode.Range(start, end);
        var content = document.getText(range);
        var formatter = new formatter_1["default"](content);
        activeTextEditor.edit(function (edit) {
            edit.replace(range, formatter.process());
        });
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
