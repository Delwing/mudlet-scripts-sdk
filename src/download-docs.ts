import { get } from "https";
import { ExtensionContext, ProgressLocation, Uri, window } from "vscode";
import { getApi } from "@microsoft/vscode-file-downloader-api";
import { Extract } from "unzipper";
import { createReadStream } from "fs";

export class DropboxDownloader {
  context: ExtensionContext;

  constructor(context: ExtensionContext) {
    this.context = context;
  }

  async downloadDropboxFile(name: string, downloadUrl: string, destination: string): Promise<string> {
    let extPath = this.context.globalStorageUri.fsPath;
    return new Promise((resolve, reject) => {
      get(downloadUrl, (response) => {
        if (response.statusCode === 302 || response.statusCode === 301) {
          let location = response.headers.location;
          if (response.statusCode === 301) {
            location = `https://dropbox.com${location}`;
          }
          this.downloadFile(name, Uri.parse(location as string), destination, false).then((path) => {
            createReadStream(path).pipe(Extract({ path: `${this.context.globalStorageUri.fsPath}/docs` }));
            resolve(destination);
          });
        }
      });
    });
  }

  private async downloadFile(name: string, uri: Uri, outPath: string, extract?: boolean) {
    return await window.withProgress<string>(
      {
        location: ProgressLocation.Notification,
        title: `Downloading ${name}`,
        cancellable: false,
      },
      (progress, token) => {
        return new Promise(async (resolve, reject) => {
          let fileDownloader = await getApi();
          let lastProgress = 0;

          try {
            let file = await fileDownloader.downloadFile(
              uri,
              outPath,
              this.context,
              token,
              (downloaded, total) => {
                if (!total) {
                  progress.report({ message: "Please wait..." });
                  return;
                }

                progress.report({ message: `Please wait...`, increment: downloaded - lastProgress });
                lastProgress = downloaded;
              },
              { shouldUnzip: extract }
            );
            resolve(file.fsPath);
          } catch (error) {
            reject(error);
          }
        });
      }
    );
  }
}
