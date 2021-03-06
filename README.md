# iconfont2flutter README

阿里的字体图标库自动转flutter的IconData集合工具。
[阿里字体库在这 https://www.iconfont.cn/](https://www.iconfont.cn/)
默认配置下将下载好的字体文件压缩包中的 iconfont.json 以及iconfont.ttf移动到您的flutter项目下assets/icons中,然后运行iconfont update即可。
之后会在flutter 项目的lib/plugins中生成对应的字体集合类;

macOS下按cmd+shift+P打开vscode的命令面板，然后输入 iconfont demo enter键确认即可；

使用方式为

```dart
Icon(Zcons.love),
```

### 配置文件

`.iproject.yaml` 默认配置如下

```yaml
iconfont:
  assets: assets/icons              # 字体图标资源存放路径
  class_name: Zcons                 # 生成的Dart类的类名
  font_name: iconfont.ttf           # 字体文件名称 (配套)
  json_name: iconfont.json          # 字体配置文件 (配套)
  output: lib/plugins               # 插件输出位置
```

## Features 

Describe specific features of your extension including screenshots of your extension in action. Image paths are relative to this README file.

For example if there is an image subfolder under your extension project workspace:

\!\[feature X\]\(images/feature-x.png\)

> Tip: Many popular extensions utilize animations. This is an excellent way to show off your extension! We recommend short, focused animations that are easy to follow.

## Requirements

If you have any requirements or dependencies, add a section describing those and how to install and configure them.


## Extension Commads


* `iconfont2IconData.demo`: 初始化一个demo示例，首次使用改插件的小伙伴，强烈推荐使用这个来熟悉用法；
* `iconfont2IconData.update`: 更新生成的dart类
* `iconfont2IconData.network`: 支持自动下载网络资源
* `iconfont2IconData.updateYaml`: 更新flutter项目配置文件 pubspec.yaml 注意：这会清空您的备注！！
* `iconfont2IconData.remove`: 移除生成的 dart 文件



## Known Issues

如有BUG，请联系我 kuroko.link@outlook.com


## Release Notes

### 0.0.7
1. 优化vscode提示语，增加loading
### 0.0.6

1. 生成的代码加强代码检测

### 0.0.5

1. 新增network命令，支持自动下载网络资源

### 0.0.4

1. 更新 reame.md

### 0.0.3

1. 修复demo命令没有在`pubspec.yaml`下生成对应的字体资源引用

### 0.0.2

1. 更新插件配置文件，删除重复字段；


### 0.0.1

1. 初始化一个demo示例；
2. 更新生成的dart类；
3. 更新flutter项目配置文件；
4. 移除生成的 dart 文件；