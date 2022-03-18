import * as vscode from 'vscode';
import { parse } from 'fast-xml-parser';
import { ScriptDocumentProvider } from './script-document.provider';
import * as os from "os";
import * as Path from 'path';
import * as fs from 'fs';

const nodes = ['Trigger', 'TriggerGroup', 'Alias', 'AliasGroup', 'Script', 'ScriptGroup'];

export class XmlTreeDataProvider implements vscode.TreeDataProvider<MudletItem> {

    private jsonDoc;
    private currentHandler : vscode.TextDocumentContentProvider;

    constructor(private document: vscode.TextDocument, private context : vscode.ExtensionContext) {
        this.jsonDoc = parse(document.getText(), {
            ignoreAttributes: false
        });
        this.currentHandler = new ScriptDocumentProvider(this.jsonDoc);
        vscode.workspace.registerTextDocumentContentProvider('mudletScript', this.currentHandler);

        context.subscriptions.push(vscode.commands.registerCommand("mudlet-script-sdk.openScript", (item: MudletItem) => {
            vscode.workspace.openTextDocument(vscode.Uri.parse("mudletScript:" + item.path))
              .then(doc => {
                  vscode.window.showTextDocument(doc);
                  vscode.languages.setTextDocumentLanguage(doc, "lua");
                })
              .then(() => vscode.commands.executeCommand('setContext', 'mudlet.showXmlTree', true));
          }));
    }

    getTreeItem(element: MudletItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: MudletItem): Thenable<MudletItem[]> {
        if (this.document.languageId !== "xml") {
            vscode.window.showInformationMessage('No dependency in empty workspace');
            return Promise.resolve([]);
        }

        if (!this.jsonDoc.MudletPackage) {
            vscode.window.showInformationMessage('Not Mudlet XML');
            return Promise.resolve([]);
        }

        if (!element) {
            return Promise.resolve(Object.keys(this.jsonDoc.MudletPackage).filter(item => !item.startsWith("@")).map(item => new MudletItem(item.replace("Package", ""), [item], this.jsonDoc.MudletPackage[item], 'type')));
        } else {
            let newElement = this.jsonDoc.MudletPackage;
            element.path.forEach(part => {
                newElement = newElement[part];
            });
            let items: MudletItem[] = [];

            Object.keys(newElement).forEach(item => {
                if (nodes.indexOf(item) > -1) {
                    if (Array.isArray(newElement[item])) {
                        items = items.concat(newElement[item].map((groupElement: any, index: string) => new MudletItem(groupElement.name, [...element.path, item, index], groupElement), 'group'));
                    } else {
                        items = items.concat(new MudletItem(newElement[item].name, [...element.path, item], newElement[item]));
                    }
                }
            });

            return Promise.resolve(items);
        }
    }


}

export class MudletItem extends vscode.TreeItem {

    public uri : vscode.Uri;

    constructor(
        public readonly label: string,
        public readonly path: Array<string>,
        public readonly element: any,
        public readonly type?: string
    ) {
        super(label);
        this.tooltip = this.label;
        this.path = path;
        this.type = type;

        this.collapsibleState = nodes.some(item => element[item]) ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None;
        this.description = element["@_isActive"] === "no" ? 'inactive' : '';
        this.uri = vscode.Uri.parse("mudletScript:" + path);
        this.contextValue = type;
        
    }
}
