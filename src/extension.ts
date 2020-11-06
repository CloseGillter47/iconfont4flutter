import * as vscode from 'vscode';
import Iconfont2Dart from './iconfont.main';

export function activate (context: vscode.ExtensionContext) {

  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  // console.log('Congratulations, your extension "iconfont2IconData" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  // let disposable = vscode.commands.registerCommand('iconfont2IconData.demo', () => {
  //   // The code you place here will be executed every time your command is executed

  //   // Display a message box to the user
  //   vscode.window.showInformationMessage('Hello World from iconfont2IconData!');
  // });

  // context.subscriptions.push(disposable);

  /** 注册 demo 命令 */
  context.subscriptions.push(vscode.commands.registerCommand('iconfont2IconData.demo', () => {
    const iconfont = new Iconfont2Dart();
    iconfont.demo();
  }));

  /** 注册 update 命令 */
  context.subscriptions.push(vscode.commands.registerCommand('iconfont2IconData.update', () => {
    vscode.window.showInformationMessage('Hello World from iconfont2IconData!');
    const iconfont = new Iconfont2Dart();
    iconfont.test();
  }));

  /** 注册 updateYaml 命令 */
  context.subscriptions.push(vscode.commands.registerCommand('iconfont2IconData.updateYaml', () => {
    vscode.window.showInformationMessage('Hello World from iconfont2IconData!');
  }));

  /** 注册 remove 命令 */
  context.subscriptions.push(vscode.commands.registerCommand('iconfont2IconData.remove', () => {
    vscode.window.showInformationMessage('Hello World from iconfont2IconData!');
  }));

}

// this method is called when your extension is deactivated
export function deactivate () { }
