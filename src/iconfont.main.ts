import * as YAML from 'yaml';

import { VSC_WS, VSC_TOAST } from './vscode.plugins';
import { projectConfig } from './template/config';

import FS, { copyDemoFiles } from './fs';
import { orderObjectProps } from './utils';
import { DART_TEMPLATE_CLASS, DART_TEMPLATE_PROPS, keyMaps } from './template/template';

String.prototype.replaceAll = String.prototype.replaceAll || function (this: string, r: string, s: string) {
  return this.replace(new RegExp(r, 'g'), s);
};

export default class Iconfont2Dart {

  constructor () {
    this._config = undefined;
    this._workspace = VSC_WS.getWorkspaceFolder();
    this._yamlFile = FS.combinePath(this._workspace, this._flutterYamlFile);
  }

  private _config: IconfontConfig | undefined;
  private _yamlFile: string;
  private _workspace: string;
  private _flutterYamlFile: string = 'pubspec.yaml';
  private _pluginConfigFile: string = '.iproject.yaml';

  /** 初始化插件配置 读取或者新增配置文件 */
  private async _initConfig () {
    const confPath = FS.combinePath(this._workspace, this._pluginConfigFile);
    const data = await FS.readFileAsync(confPath);
    if (data) {
      const config: VscodePlugins = YAML.parse(data) || {};
      this._config = config.iconfont;
    }

    if (!this._config) {
      this._config = projectConfig;
      await FS.writeFileAsync(confPath, YAML.stringify({ iconfont: orderObjectProps(this._config) }));
    }
  }

  private async _addFontAssets (config: FlutterProject) {
    // 初始化配置
    config.flutter = config.flutter || {};
    // 初始化字体配置
    config.flutter.fonts = config.flutter.fonts || [];

    const font = config.flutter.fonts.find((f) => f.family === projectConfig.font_family);
    const asset = `${projectConfig.assets}/${projectConfig.font_name}`;
    /// 如果已存在
    if (font) {
      font.fonts = font.fonts || [];
      const _asset = font.fonts.find((i) => i.asset === asset);

      if (!_asset) font.fonts.push({ asset });

    } else {
      config.flutter.fonts.push({
        family: projectConfig.font_family,
        fonts: [{ asset }],
      });
    }
  }

  /** 复制配置文件到目标工程下 */
  private async _copyDemoFiles () {
    let output: string = FS.combinePath(this._workspace, this._config?.assets || '');

    /// 创建资源文件夹
    FS.createFoldersAsync(output, this._workspace);

    await copyDemoFiles(output);
  }

  private async _updateYamlFile (config: FlutterProject, path: string) {
    const data = YAML.stringify(config);

  }

  private async _buildDart () {
    const path = FS.combinePath(this._workspace, `${this._config?.assets}/${this._config?.json_name}`);
    const data = await FS.readFileAsync(path);
    if (!data) return VSC_TOAST.error(`找不到配置文件或者无法读取 👇 ${path}`);

    let config: IconFont;
    try {
      config = JSON.parse(data);
    } catch (error) {
      return VSC_TOAST.error(error);
    }

    if (!config.font_family || !config.glyphs) return VSC_TOAST.error(`无效的配置文件 👇 ${path}`);
    const props: string[] = [];
    if (config.glyphs.length) {
      config.glyphs.forEach((glyph) => {
        const prop = DART_TEMPLATE_PROPS
          .replaceAll(keyMaps.mask, glyph.name)
          .replaceAll(keyMaps.code, glyph.unicode)
          .replaceAll(keyMaps.font, config.font_family)
          .replaceAll(keyMaps.prop, glyph.font_class.replace(/\-|\s/g, '_'));

        props.push(prop);
      });
    }
    const context = props.join(`\n\n`);

    const dart = DART_TEMPLATE_CLASS
      .replaceAll(keyMaps.clasz, this._config?.class_name || '')
      .replaceAll(keyMaps.context, context);


    const output = FS.combinePath(this._workspace, this._config?.output || '');

    FS.createFoldersAsync(output, this._workspace);

    let fileName = `${this._config?.class_name || ''}.dart`;

    fileName.toLowerCase();

    await FS.writeFileAsync(FS.combinePath(output, fileName), dart);
  }


  /**
   * 初始化一个 demo 
   * 提供一个 demo 示例
   */
  public async demo () {
    const data = await FS.readFileAsync(this._yamlFile);

    if (!data) return VSC_TOAST.error(`找不到flutter项目的配置文件！👉 ${this._flutterYamlFile}`);

    // 读取工程依赖文件
    const _config: FlutterProject = YAML.parse(data) || {};

    // 初始化配置文件
    if (!this._config) await this._initConfig();

    /// 添加字体资源
    this._addFontAssets(_config);

    /// 更新项目配置文件
    this._updateYamlFile(_config, this._yamlFile);

    await this._copyDemoFiles();

    this._buildDart();
    VSC_TOAST.message('Iconfont 转 Flutter IconData类的 demo 创建成功');
  }


  /**
   * 更新 dart 类
   */
  public async update () {

  }

  /**
   * test
   */
  public test () {

    orderObjectProps(projectConfig);
  }
}