
export const DART_TEMPLATE_CLASS = `//////////////////////////////////////////////////////////////////
///
/// vscode插件自动生成的代码，请勿手动修改，以免丢失编辑内容
///
//////////////////////////////////////////////////////////////////

import 'package:flutter/widgets.dart';

class %CLASS_NAME {
  %CLASS_NAME._();

%CONTEXT
}
`;

export const DART_TEMPLATE_PROPS = `  /// %MASK\r\n\t// ignore: constant_identifier_names\r\n  static const IconData %PROP = IconData(0x%CODE, fontFamily: '%FONT');`;

export const keyMaps = {
  clasz: '%CLASS_NAME',
  context: '%CONTEXT',
  mask: '%MASK',
  prop: '%PROP',
  code: '%CODE',
  font: '%FONT',
};
