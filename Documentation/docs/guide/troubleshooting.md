# Troubleshooting

## Layers misaligned (Figma)

Great care has been taken to align layers as pixel-perfect as possible, but because of the differences in each app's coordinate system, it doesn’t always work quite right. 

### Rotated images misaligned

If a rotated image appears offset in Ae, simply Group it in Figma and [add a *](./options.html#rasterize-layer-on-export) to the start of the group's layer name. 

The layer will be exported rasterized without any rotation and will be aligned properly.

### Text vertically offset

Text can be problematic because of the different methods of text alignment Adobe and Figma use. The easiest solution is to export a [reference image](./options.html#export-reference-image) of your artboard. This reference will import on top of your layers with a reduced opacity. Use this reference to manually align layers.

## Kerning or multiple fonts/styles
Unfortunately, it is not possible in After Effects to set per-character variation type. A workaround for this is to hightlight text in Figma/Sketch, copy, then in Ae select the misaligned layer, highlight the text and paste. This will create a text layer in the correct position then apply styling.

## Blending modes aren't blending
Ae shape layers have multiple blending modes. Internal blending modes (on fills and strokes) will mix internally but not with other layers. This behavior is different than in Sketch where a layer’s fill color will mix with other layer’s below it. So if colors are looking a little off between layers, this is why. You'll need to manually set the layer's blending mode to affect other layers.

## Grouped layers aligned to top left
Sketch layers positioning is relative. Meaning, if a selected layer is inside a group the layer’s comp position will be zeroed out by the parent group layer. Manually align these layers or select the whole group hierarchy.

## Drop shadows on groups
Inside of Sketch, a drop shadow may be applied to a group and that shadow will apply the layers within. Since Ae does not natively support grouping, this drop shadow will be applied to the parent layer of the group, which is not really visible. In order to preserve the appearance, be sure to enable the [Precomp Groups](ae-options.html#precomp-groups) option.

::: tip More questions
Need more help? Email motiondesign@google.com
:::