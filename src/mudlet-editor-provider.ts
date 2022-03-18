import * as vscode from 'vscode';
import { getNonce } from './util';
import { XmlTreeDataProvider, MudletItem } from './xml-tree-data';

export class MudletXmlEditorProvider implements vscode.CustomTextEditorProvider {

	private static readonly viewType = 'mudlet.xmlEditor';

	public static register(context: vscode.ExtensionContext): vscode.Disposable {
		const provider = new MudletXmlEditorProvider(context);
		const providerRegistration = vscode.window.registerCustomEditorProvider(MudletXmlEditorProvider.viewType, provider);
		return providerRegistration;
	}

	resolveCustomTextEditor(document: vscode.TextDocument, webviewPanel: vscode.WebviewPanel, token: vscode.CancellationToken): void | Thenable<void> {
		let fileName = document.fileName.split("/").pop();

		let treeview = vscode.window.createTreeView('mudletXml', {
			treeDataProvider: new XmlTreeDataProvider(document, this.context)
		});

		webviewPanel.webview.options = {
			enableScripts: true,
		};
		webviewPanel.webview.html = this.getHtmlForWebview(webviewPanel.webview);

		function onShow() {
			treeview.description = fileName;
			vscode.commands.executeCommand('setContext', 'mudlet.showXmlTree', true);
		}

		function onHide() {
			vscode.commands.executeCommand('setContext', 'mudlet.showXmlTree', false);
		}


		onShow();
		webviewPanel.onDidChangeViewState(state => {
			if (state.webviewPanel.visible) {
				onShow();
			} else {
				onHide();
			}
		});

		function updateWebview() {
			webviewPanel.webview.postMessage({
				type: 'update',
				text: document.getText(),
			});
		}

		updateWebview();
	}



	constructor(
		private readonly context: vscode.ExtensionContext
	) { }

	private getHtmlForWebview(webview: vscode.Webview): string {

		const styleVSCodeUri = webview.asWebviewUri(vscode.Uri.joinPath(
			this.context.extensionUri, 'media', 'vscode.css'));

		const parser = webview.asWebviewUri(vscode.Uri.joinPath(
			this.context.extensionUri, 'media', 'parser.js'));

		const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(
			this.context.extensionUri, 'media', 'mudlet.js'));

		const nonce = getNonce();

		return `
			<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource}; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
				<title>Mudlet XML</title>

                <link href="${styleVSCodeUri}" rel="stylesheet" />
			</head>
			<body>
				<div class="editor">
					
				</div>

				<script nonce="${nonce}" src="${parser}"></script>
				<script nonce="${nonce}" src="${scriptUri}"></script>
			</body>
			</html>`;
	}

}