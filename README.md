s[<img src="https://github.com/google/sketch2ae/blob/gh-pages/gif/ae_gif.gif">](http://google.github.io/sketch2ae)

# [Sketch2AE][5ae3a8a1]
[Sketch][66b609ab] layers may now be imported into [After Effects][56a59ddd] without redrawing everything in Illustrator. Avoid the startling realization that you have to repeat the whole import process because forgot to split one element out onto its own layer or that type has to be converted into live text as an additional process per layer.

  [5ae3a8a1]: http://google.github.io/sketch2ae "Sketch2AE"

Quickly export selected layers or a whole artboard from Sketch with with type metrics, transform data, images, symbol hierarchy and grouping intact. It's kind of better than the native Illustrator => AE import. Hooray.

> This is not an official Google product. Motion designers at Google just kinda like it a lot. Built by [Adam Plouff][8638464d].

  [8638464d]: http://www.battleaxe.co/ "Battle Axe"
  [66b609ab]: https://www.sketchapp.com/ "Sketch App"
  [56a59ddd]: http://www.adobe.com/products/aftereffects.html "After Effects"
  [bodymovin]: https://github.com/bodymovin/bodymovin "BodyMovin"
  [lottie]: https://airbnb.design/lottie/ "Lottie"

Installation and usage at: http://google.github.io/sketch2ae

---

# Change log
## [0.53] - 2017-11-09
### Changes
- Removed the top-left anchor point for new shapes
- Removed the top-left expression for Rectangles and Ellipse to add support for [BodyMovin][bodymovin] and [Lottie][lottie] export
- Disabled transfer of Sketch masks with Ae's Set Matte effect. At this time the masking system is to complex to get right and leads to a lot of unnecessary effects that make things look awful.

### Fixes
- Text string error from apostrophes
- Empty vector object error
- Empty group error

## [0.52] - 2017-05-24
- Initial release


---
## License
Apache 2.0
