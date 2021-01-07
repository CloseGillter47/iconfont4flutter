/* eslint-disable @typescript-eslint/naming-convention */
import * as vscode from 'vscode';

const { workspace, window, ProgressLocation } = vscode;


export function getWorkspaceFolder (): string {

  const { workspaceFolders: folders } = workspace;
  if (!folders) return '';

  const [folder,] = folders;

  return folder?.uri?.fsPath ?? '';
}

export const VSC_WS = {
  getWorkspaceFolder,
};

export function message (message: string) {
  window.showInformationMessage(message ?? '');
}

export function error (message: string) {
  window.showErrorMessage(message ?? '');
}

export function loading (options: loadingOption): Thenable<void> {
  return window.withProgress<void>(
    { location: ProgressLocation.Notification, cancellable: false, title: options.title },
    (task, token): Thenable<void> => {
      return new Promise<void>(async (resolve, reject) => {
        if (!options.method) return resolve();
        options.method().then((success: boolean) => {
          task.report({ message: success ? (options.successTip ?? '成功') : (options.failTip ?? '失败') });
        }).finally(() => resolve());
      });
    }
  );
}



export const VSC_TOAST = {
  error,
  message,
  loading,
  window,
};

