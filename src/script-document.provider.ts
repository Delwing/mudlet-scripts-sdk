import * as vscode from "vscode";

export class ScriptDocumentProvider implements vscode.TextDocumentContentProvider {

    private jsonDoc: any;

    constructor(jsonDoc: any) {
        this.jsonDoc = jsonDoc;
    }

    provideTextDocumentContent(uri: vscode.Uri): string {
        let newElement = this.jsonDoc.MudletPackage;
        uri.path.split(",").forEach(part => {
            newElement = newElement[part];
        });
        return newElement.script;
    }

};