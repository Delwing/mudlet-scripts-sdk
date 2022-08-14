import * as vscode from "vscode";

export class ScriptDocumentProvider implements vscode.TextDocumentContentProvider {

    private jsonDoc: any;

    constructor(jsonDoc: any) {
        this.jsonDoc = jsonDoc;
    }

    provideTextDocumentContent(uri: vscode.Uri): string {
        let newElement = this.jsonDoc.MudletPackage;
        let name = "";
        uri.path.split(",").forEach(part => {
            newElement = newElement[part];
            if (newElement.name) {
                name += "/" + newElement.name;
            }
        });
        return `${"-".repeat(name.length + 4)}\n--- ${name}\n${"-".repeat(name.length + 4)}\n${newElement.script || ""}`;
    }

};