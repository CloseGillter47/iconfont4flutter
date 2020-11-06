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
    this._config = null;
    this._iconfont = null;

    this._workspace = VSC_WS.getWorkspaceFolder();
    this._yamlFile = FS.combinePath(this._workspace, this._flutterYamlFile);
  }

  private _config: IconfontConfig | null;
  private _iconfont: IconFont | null;
  private _yamlFile: string;
  private _workspace: string;
  private _flutterYamlFile: string = 'pubspec.yaml';
  private _pluginConfigFile: string = '.iproject.yaml';

  /** 初始化插件配置 读取或者新增配置文件 */
  private async _initConfig () {

    this._config = await this._readConfig();

    if (!this._config) {
      this._config = projectConfig;
      const confPath = FS.combinePath(this._workspace, this._pluginConfigFile);
      await FS.writeFileAsync(confPath, YAML.stringify({ iconfont: orderObjectProps(this._config) }));
    }
  }

  private async _readConfig (): Promise<IconfontConfig | null> {
    const confPath = FS.combinePath(this._workspace, this._pluginConfigFile);
    if (! await FS.existsFileAsync(confPath)) return null;

    const data = await FS.readFileAsync(confPath);

    if (data) {
      const config: VscodePlugins = YAML.parse(data) || {};
      return config?.iconfont || null;
    }

    return null;
  }

  private async _readFlutter (): Promise<FlutterProject | undefined> {
    if (!await FS.existsFileAsync(this._yamlFile)) return;
    const data = await FS.readFileAsync(this._yamlFile);
    if (!data) return;

    const _config: FlutterProject = YAML.parse(data);

    return _config;
  }

  private async _readIconfont (): Promise<IconFont | null> {
    const path = FS.combinePath(this._workspace, `${this._config?.assets}/${this._config?.json_name}`);
    if (! await FS.existsFileAsync(path)) return null;

    const data = await FS.readFileAsync(path);
    let config: IconFont;
    try {
      config = JSON.parse(data);
    } catch (error) {
      VSC_TOAST.error(error);
      return null;
    }

    return config;
  }

  private async _addFontAssets (config: FlutterProject) {
    if (!this._iconfont) return;

    // 初始化配置
    config.flutter = config.flutter || {};
    // 初始化字体配置
    config.flutter.fonts = config.flutter.fonts || [];

    const font = config.flutter.fonts.find((f) => f.family === this._iconfont?.font_family);
    const asset = `${projectConfig.assets}/${projectConfig.font_name}`;
    /// 如果已存在
    if (font) {
      font.fonts = font.fonts || [];
      const _asset = font.fonts.find((i) => i.asset === asset);

      if (!_asset) font.fonts.push({ asset });

    } else {
      config.flutter.fonts.push({
        family: this._iconfont.font_family,
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
    await FS.writeFileAsync(this._yamlFile, data);
  }

  private async _buildDart () {
    const config = await this._readIconfont();
    if (!config || !config.font_family || !config.glyphs) return;

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


    const folder = FS.combinePath(this._workspace, this._config?.output || '');

    FS.createFoldersAsync(folder, this._workspace);

    let fileName = `${this._config?.class_name || ''}.dart`;

    fileName = fileName.toLowerCase();

    const output = FS.combinePath(folder, fileName);

    await FS.writeFileAsync(output, dart);
  }


  /**
   * 初始化一个 demo 
   * 提供一个 demo 示例
   */
  public async demo () {

    // 读取工程依赖文件
    const flutter = await this._readFlutter();
    if (!flutter) return;

    // 初始化插件配置
    if (!this._config) await this._initConfig();

    // 初始化字体配置
    this._iconfont = this._iconfont || await this._readIconfont();

    /// 添加字体资源
    this._addFontAssets(flutter);

    /// 更新项目配置文件
    this._updateYamlFile(flutter, this._yamlFile);

    await this._copyDemoFiles();

    await this._buildDart();

    VSC_TOAST.message('Iconfont 转 Flutter IconData类的 demo 创建成功');
  }


  /**
   * 更新 dart 类
   */
  public async update () {
    this._config = await this._readConfig();
    if (!this._config) return VSC_TOAST.message('找不到配置文件，你可能要先运行一下 demo 命令来初始化一个配置');

    await this._buildDart();
    VSC_TOAST.message('Iconfont 已更新');
  }

  /**
   * 更新项目yaml文件
   */
  public async updateYaml () {
    const flutter = await this._readFlutter();
    if (!flutter) return;

    this._config = await this._readConfig();
    if (!this._config) return VSC_TOAST.message('找不到配置文件，你可能要先运行一下 demo 命令来初始化一个配置');

    await this._updateYamlFile(flutter, this._yamlFile);
  }

  /**
   * 移除插件生成的相关文件
   */
  public async remove () {
    this._config = await this._readConfig();
    if (!this._config) return;

    let fileName = `${this._config?.class_name || ''}.dart`;
    fileName = fileName.toLowerCase();

    const folder = FS.combinePath(this._workspace, this._config?.output || '');
    const output = FS.combinePath(folder, fileName);

    FS.deleteFileAsync(output);
  }

  /**
   * test
   */
  public test () {

    orderObjectProps(projectConfig);
  }
}