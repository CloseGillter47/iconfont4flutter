/* eslint-disable @typescript-eslint/naming-convention */

interface FlutterProject {

  name?: string;
  version?: string;
  environment?: string;


  /** 关键属性 */
  flutter: {

    /** 资源 */
    assets?: any[];

    /** 字体 */
    fonts?: {
      family: string;
      fonts: {
        asset: string;
        [key: string]: any;
      }[];
    }[];

    /** 其他属性 */
    [key: string]: any;

  };

  /** 其他属性 */
  [key: string]: any;
}

interface IconfontConfig {

  /** 字体文件名 */
  font_name: string;

  /** 字体配置文件名 */
  json_name: string;

  /** 字体 font-family */
  font_family: string;

  /** 字体资源存放位置 */
  assets: string;

  /** 生成的字体类名 */
  class_name: string;

  /** dart 类存放位置 */
  output: string;
}

interface VscodePlugins {
  iconfont: IconfontConfig | undefined;

  [key: string]: any;
}

interface IconFont {
  id?: string,
  name?: string,
  font_family: string,
  css_prefix_text?: string,
  description?: string,
  glyphs: IconGlyph[];
}

interface IconGlyph {
  icon_id: string;
  name: string;
  font_class: string;
  unicode: string;
  unicode_decimal: number;
}

interface String {
  replaceAll (searchValue: string, replaceValue: string): string;
}