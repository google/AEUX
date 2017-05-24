# BattleStyle
This is the internal styling toolkit for Battle Axe tools to get around the standard ScriptUI grossness. It's kinda hacky and utilizes a weird ScriptUI `moveTo()` method to draw single-color, resolution independent icons buttons without the need for local files. If that's your scene then go crazy with it.

## Installation
Download and drop it into AE's `Scripts/ScriptUI Panels` folder to test out the system with your own coordinates.

## Usage
Copy and tweak `buttonColorVector()`in your own project. Arguments:
- _parent object_ - ScriptUI panel or group
- _vector string_ - SVG coordinates as string(s) in an array
- _hex color string_ - #039BE5
- _size - size array_ with the art dimensions


## Credits
Originally based on an old post for drawing colored text buttons.
[[JS CS3/4] ScriptUI How to color a button ?][799ff023]

  [799ff023]: https://forums.adobe.com/thread/509131 "[JS CS3/4] ScriptUI How to color a button ?"

## License
Apache 2.0
