import * as vscode from 'vscode';
import Iconfont2Dart from './iconfont.main';

export function activate (context: vscode.ExtensionContext) {

  /** 注册 demo 命令 */
  context.subscriptions.push(vscode.commands.registerCommand('iconfont2IconData.demo', () => {
    const iconfont = new Iconfont2Dart();
    iconfont.demo();
  }));

  /** 注册 update 命令 */
  context.subscriptions.push(vscode.commands.registerCommand('iconfont2IconData.update', () => {
    const iconfont = new Iconfont2Dart();
    iconfont.update();
  }));

  /** 注册 updateYaml 命令 */
  context.subscriptions.push(vscode.commands.registerCommand('iconfont2IconData.updateYaml', () => {
    const iconfont = new Iconfont2Dart();
    iconfont.updateYaml();
  }));

  /** 注册 remove 命令 */
  context.subscriptions.push(vscode.commands.registerCommand('iconfont2IconData.remove', () => {
    const iconfont = new Iconfont2Dart();
    iconfont.remove();
  }));

}

// this method is called when your extension is deactivated
export function deactivate () { }
