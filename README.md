# Mudlet Scripts SDK

This VS Code extensions provides capability of downloading [Mudlet Docs Extract](https://github.com/Delwing/mudlet-docs) and configure current workspace to use it.
It also utlizes [Sumneko's](https://github.com/sumneko/vscode-lua) Lua language extension, so if you don't have this installed, it will be downloaded and enabled as well.

Extension available at VS Code Marketplace:
https://marketplace.visualstudio.com/items?itemName=Delwing.mudlet-scripts-sdk

## Usage

From command pallete (F1) use one of three actions provided:
 
### Mudlet Docs: Enable
---
Downloads and enables documentation

### Mudlet Docs: Update APIs files
---
Forces Mudlet Docs extract update

### Mudlet Docs: Disable
---
Disables docs for current workspace

## Automatic updates
Automatic updates will happen not more frequent that every 24 hours at VS Code startup.

You can disable them using Settings (`mudlet-scripts-sdk.autoUpdateApis`)

## Screenshots

![](https://raw.githubusercontent.com/Delwing/mudlet-docs/media/screenshot1.png)

![](https://raw.githubusercontent.com/Delwing/mudlet-docs/media/screenshot2.png)