import * as vscode from "vscode";
import { MudletDocsController } from "./controller";
import { MudletXmlEditorProvider } from "./mudlet-editor-provider";

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

  context.subscriptions.push(MudletXmlEditorProvider.register(context));

  docsController.downloadDocs();
}

export function deactivate() { }
