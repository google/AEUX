---
currentVersion: 0.8.0
figmaLink: http://aeux.io
figmaLinkGoogler: https://www.figma.com/community/plugin/864522107465619637/AEUX
fiftyTwoDownload: /legacy-download/AEUX_0.6.9.zip
fiftyDownload: /legacy-download/Sketch2AE_0.54.zip
---

# Install

::: tip Restart your computer
If transfers don't seem to work after installation, try restarting your machine. This can reset the connection system that handles layer transfer.
:::

## Sketch
- Double click **AEUX.sketchplugin**
- Sketch will open and tell you the plugin is installed
- Navigate to the **Plugins** menu up top
- Click to open the panel

## After Effects
- Download [ZXP Installer](https://aescripts.com/learn/zxp-installer/) from [aescripts + aeplugins](https://aescripts.com/)
- Drag **AEUX.zxp** into ZXP Installer
- Close and re-open After Effects
- Navigate to the top Window menu, Extension>AEUX
- Click to open the panel

::: warning Manual install
If you follow all the Ae instructions and AEUX still isn't showing up in the AE Window>Extensions menu, do a manual install. You didn't do anything wrong, it just happens sometimes wth extensions.
- Change the extension of the AEUX.zxp file to .zip. It might give you a dialog warning about changing the file type but ignore it.
- Unzip this file to get a folder called AEUX
- Navigate to the Adobe extensions folder:
  - **Mac**: /Users/**username**/Library/Application Support/Adobe/CEP/extensions/
  - **Win**: C:/Users/**username**/AppData/Roaming/Adobe/CEP/extensions/
- Copy this AEUX folder to the /extensions/ folder
- Restart Ae and look for AEUX in the Window>Extensions folder
:::

## Figma
### For Googlers
- Install in <a :href="$frontmatter.figmaLinkGoogler">Figma</a>
- Right-click within a Figma file and navigate to Plugins > AEUX
- Click to open the panel

### For non-Googlers

The plugin is not yet published on [figma.com/plugins](http://figma.com/plugins) so the installation process is a little more involved than it will be.

- Right-click the canvas or the top left hamburger menu and navigate to Plugins>Development>New Plugin…
- Under Link existing plugin, click to open the manifest file
- This panel will close and AEUX will now be available by right-clicking Plugins>Development>AEUX 

<img src="/figma-install-01.png" />
<img src="/figma-install-02.png" />
<img src="/figma-install-03.png" />