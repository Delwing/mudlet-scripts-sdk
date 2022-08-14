import * as vscode from "vscode";
import { MudletDocsController } from "./controller";
import { MudletItem, XmlTreeDataProvider } from "./xml-tree-data";

let treeview : vscode.TreeView<MudletItem>;
let provider : XmlTreeDataProvider;

export function activate(context: vscode.ExtensionContext) {
  let docsController = new MudletDocsController(context);

  let enableDocs = vscode.commands.registerCommand("mudlet-scripts-sdk.enableMudletDocs", () => {
    docsController.downloadDocs(true);
    docsController.setWorkspaceLibraryPath(true);
  });

  let updateDocs = vscode.commands.registerCommand("mudlet-scripts-sdk.updateMudletDocs", () => {
    docsController.downloadDocs(true);
  });

  let disableDocs = vscode.commands.registerCommand("mudlet-scripts-sdk.disableMudletDocs", () => {
    docsController.setWorkspaceLibraryPath(false);
  });

  context.subscriptions.push(enableDocs);
  context.subscriptions.push(updateDocs);
  context.subscriptions.push(disableDocs);

  context.subscriptions.push(vscode.commands.registerCommand("mudlet-script-sdk.openScript", (item: MudletItem) => {
   item.open();
  }));

  context.subscriptions.push(vscode.commands.registerCommand("mudlet-script-sdk.search", (item: vscode.TreeView<MudletItem>) => {
    vscode.window.showInputBox().then(text => {
      if (text === undefined) {
        return;
      }
      let keys : Array<string> = [];
      let results = new Map<string, MudletItem>();
      provider.find(text).forEach(item => {
        let path = item.mudletPath();
        results.set(path, item);
        keys.push(path);
      });
      vscode.window.showQuickPick(keys, { canPickMany: false}).then(pick => {
        if (pick) {
          results.get(pick)?.open();
        }
      });
    });
  }));

  vscode.window.onDidChangeActiveTextEditor(editor => {
    activateXmlTree(editor, context);
  });

  activateXmlTree(vscode.window.activeTextEditor, context);


  docsController.downloadDocs();
}

export function deactivate() { }

function activateXmlTree(editor : vscode.TextEditor | undefined, context : vscode.ExtensionContext) : void {
  
  if (treeview || editor === undefined) {
    return;
  }

  provider = new XmlTreeDataProvider(editor.document, context);
  if (provider.isMudletDoc) {
    treeview = vscode.window.createTreeView('mudletXml', {
      treeDataProvider: provider
    });
  }

  vscode.commands.executeCommand('setContext', 'mudlet.showXmlTree', true);
}