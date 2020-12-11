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

export function loading<R> (title: string): Thenable<R> {
  return window.withProgress<R>({ location: ProgressLocation.Notification, cancellable: false, title }, (task, token): Promise<R> => {
    task.report({ message: '' });
  });
}

export const VSC_TOAST = {
  error,
  message,
  window,
};