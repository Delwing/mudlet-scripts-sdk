import * as vscode from "vscode";
import { DropboxDownloader } from "./download-docs";

const LIBRARY_WORKSPACE_KEY = "Lua.workspace.library";
const URL = "https://www.dropbox.com/sh/sfqpjl5zune46ut/AAC_vHm0B2hCGt04NXU7A8_Va?dl=1";

export class MudletDocsController {
  context: vscode.ExtensionContext;

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
  }

  async downloadDocs(force = false): Promise<void> {
    let lastDownload = this.context.globalState.get("mudlet-scripts-sdk.lastDownload");
    if (vscode.workspace.getConfiguration("mudlet-scripts-sdk.autoUpdateApis") && lastDownload !== undefined && parseInt(lastDownload as string) + 86400000 > Date.now()) {
      if (!force) {
        return;
      }
    }

    await new DropboxDownloader(this.context).downloadDropboxFile("Docs", URL, "mudlet-docs.zip");
    this.context.globalState.update("mudlet-scripts-sdk.lastDownload", Date.now());
  }

  getDocsPath() {
    return `${this.context.globalStorageUri.fsPath}/docs` as any;
  }

  getCurrentWorkspaceLibrary() : Array<string> {
    let current = vscode.workspace.getConfiguration().get(LIBRARY_WORKSPACE_KEY);
    if (!Array.isArray(current)) {
      let oldConfig = current as Record<string, boolean>;
      current = Object.keys(oldConfig).filter(key =>  oldConfig[key])
    }
    return current as Array<string>;
  }

  setWorkspaceLibraryPath(value: boolean) {
    let current = this.getCurrentWorkspaceLibrary();
    let key = this.getDocsPath();
    current.push(key);
    vscode.workspace.getConfiguration().update(LIBRARY_WORKSPACE_KEY, Array.from(new Set(current)));
  }
}
