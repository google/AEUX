# Change log

## v0.7.5
Released: 10 July, 2020
### Fixed
- Figma/Sketch: Gradient strokes
- Figma: Skewed parametric shapes (line 502)
- Figma: Rounded parametric shapes
- Figma: skip empty vector layers
- Reworked build system for smarter loading of Ae scripting system and better support for Windows machines
- Misc transfer bugs

### Changed
- Sketch: removed image fill exporting. This has never transferred correctly so it's more effective to do it manually. 


## v0.7.4
Released: 29 June, 2020
### Added
- Ae panel now checks the version of Sketch/Figma’s AEUX and points to download an update

### Fixed
- Rewritten color conversion
- Sketch image exporting
- Messaging when Sketch fails to export images
- Ae footage reloading

### Removed
- Sketch image fills - conflict with image layer exporting
- Sketch pattern fill exporting


## v0.7.3
Released: 18 June, 2020
### Added
- Figma checkbox to export an image reference for manual alignment 
- Figma button to rasterize groups to images. Different from the native Rasterize action in that it creates a 4x image (not actual pixels) and adds image on top (does not remove the original art).
- Sketch/Figma image export path is now persistent during the same session and will not ask where to save every time. To reset this path, close and reopen the Sketch or Figma panel.
- Ae panel no longer needs to be open to listen for messages from Figma/Sketch

### Fixed 
- Figma boolean shape on multi-path compound layers (icons)
- Figma nested boolean shape alignment –more than 2 levels of nesting will become misaligned and should be flattened
- Figma stroked text without fills
- Flatten is smarter – will outline text layers and find rounded rectanges
- Sketch image export spinner didn’t clear


## v0.7.2
Released: 19 Febuary, 2020
### Added
- Figma plugin is now available to Googlers under Plugins>Google
- Image transfer limit upgraded to 200mb
- Sketch panel flash. If you misplace the AEUX panel, using the keyboard shortcut (CMD+Shift+Z) a second time will flash the panel.
- More intuitive messaging for failures

### Fixed 
- Windows image exporting (error on line 691)
- Ae app switching opened old versions if using the prerelease beta
- Sketch dark mode
- Figma error: no background color 


## v0.7.1
Released: 06 Febuary, 2020
### Added
- Ae new comp duration entry
- Ae new comp frame-rate entry 
- Loading spinner to Figma and Sketch

### Fixed
- Figma boolean shape alignment
- Figma nested frame alignment
- Figma gradient point opacity


## v0.7.0
Released: 28 January, 2020
### Changes
- Rewrite of the Sketch UI system to support Catalina
- Figma in-app plugin
- New data transfer system

### Removed
- Support for figma.aeux.io web converter
- Ae panel file drop

## v0.6.9
Released: 03 June, 2019
### Added
- New logo

#### Ae
- More open precomp/unprecomp behavior to support non-AEUX grouping

#### Figma
- Non-filled shape support
- Image downloading in browser as a zip file
- figma.aeux.io

### Fixed
#### Sketch
- Prevented endless spinning when no layers selected

#### Ae
- No longer breaks with empty boolean shapes
- Empty path objects wont crash the import
- Un-precomp preserves parenting hierarchy when moving layers between comps
- Smarter check before removing a precomp from the project if it exists multiple times in the current comp

## v0.6.8
Released: 15 April, 2019
### Fixed
- Sketch 54 support
- Catch for missing symbols in Sketch
- Catch for bug on line 1193

## v0.6.7
Released: 25 February, 2019
### Added
- Ae backward compatibility to CC2014. Note: the Figma converter requires CC2018+ to download images through Ae.

## v0.6.6
Released: 15 February, 2019
### Added
- Ae panel image downloading for Figma. The online <a href="https://aeux-55e58.firebaseapp.com" target="_blank">Figma converter</a> generates images (if needed) and these image URLs are downloaded in the JSON file. Once imported into Ae, the panel downloads these images directly to a directory you specify. This process allows direct access to your images without granting the converter app or Google any access to your data.
- While still lacking support for vertical text alignment and open paths (like horizontal rules, simple stroked lines and other open shapes without fills), the Figma converter is available for testing.

## v0.6.5
Released: 15 January, 2019
### Added
- Group dropshadows - only visible if you Precomp Groups
- Sketch menu items which allow shortcuts to be added if that's how you like to work
- Support for relative image paths
- Adding support for upcoming Figma integration
- In-panel help menu
- Support for Nested Boolean shapes in Sketch

### Changed
- Revised Sketch and AE panel UI (design by <a href="https://www.instagram.com/alt.danil/" target="_blank">Danil Altynov</a>)
- New Symbol instance will named with its layer name instead of symbol name
- Blurs are stored as an array. Sketch supports only one but Figma can handle multiple.  
- Images added to comp are renamed with the layer name instead of the ugly id string
- Right-click > Help goes to temporary help doc

### Removed
- The AE Window>Extension menu for Figma

### Fixed
 - Error when creating a comp less that 4px high or wide
 - Bug with overrides that stalled the process

## v0.6.4
Released: 19 November, 2018
### Fixed
- Rounding error on new comps not on a pixel
- Introduced bug where the Sketch panel didn't open


## v0.6.3
Released: 15 November, 2018

### Fixed
- Error on text with multiple line breaks


## v0.6.2
Released: 08 October, 2018

### Added
- Support for Sketch 52

### Changed
- Removed support for Sketch < 52 - it’s way too hard to support older versions since Sketch changes their plugin API with every update


## v0.6.1
Released: 01 October, 2018

### Added
- Un-precompose button. Now groups in AE may be converted to precomps, and also converted back to regular layers in the main comp with a single click.
- Support for images in Cloud libraries

### Changed
- Detach Symbols button originally recursively detached symbols which lead to unintended effects on nested symbols that were used in multiple symbols
- Lots of code cleanup and commenting
- Simplified shape layer creation functions that all start the same
- Moved blending mode conversion into the Sketch side of the system to make AE’s layer building simpler. This will help with support for future design apps.
- Simplified folder creation in Ae from 3 separate funcs down to one.

### Fixed
- Error when 3rd party tool docked on the canvas and trying to build to a selected comp
- Error if unable to write gradient preset file to disk. Instead, it now opens the AE preferences that must be enabled.
- Bug that failed to save the user’s state in the Ae panel


## v0.6.0
Released: 04 September, 2018
### Added
- In-panel messaging to explain errors and inaccurate layer representation (Sketch and AE)
- Ability to rename the exported .json file for multiple outputs without overwriting
- Support for AE Text tracking greater than +/- 1000 with text animators
- Support for blurs on shapes (not images because those are exported)

### Changed
- Refined Sketch var scope
- Clearer copy for exported files
- Improved stability for AE CC2018 CEP changes
- Fixed a json unicode encoding error that replaced all punctuation with â
- Better text leading
- Set underlying mask layer to not visible to prevent extra pixels
- Collapse transform for auto-precomped groups
- Removed panel vertical scrollbar to feel more native


## v0.5.8
Released: 18 June, 2018
### Added
- Auto-precomp of groups
- Text transform to upper/lower case
- Layer prep functions to better reproduce artboards
- Text masking
- Text flipping
- Text rotation

### Changed
- Set background color of symbols
- Depreciated addClipping() func
- Corner radius improvements
- Refined text alignment


## v0.5.7
Released: 04 June, 2018
### Added
- In-panel messaging system
- New layer masking system
- Push to AE system instead of copy/paste
- AE panel preference auto saving system for sessions persistance

### Changed
- Precomp size integer rounding
- Better text alignment
- OS X system commands used to simplify plugin initialization (folders and files)

## v0.5.6
Released: 30 April, 2018
### Added
- Sketch panel UI
- AE layer build speed increase by hiding build comp
- Sketch panel layer count
- Ae progress bar while building
- Inner shadow layer style
- Support for Sketch cloud library symbols
- Button to convert images to symbols to prevent Sketch export cutoff
- Button to detach selected symbols
- Flip and rotation for shapes, symbols, groups
- Shape layer gradients
- Symbol overrides for text and nested symbols


### Changed
- Full Sketch2AE rewrite based on the Sketch javascript API
- Image exporting based on layer IDs to reduce redundancies
