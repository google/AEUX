# Layer prep

Simplifying layers in Sketch and Figma prior to transferring to After Effects can often provide more accurate layer creation in AEUX. 

## Detach symbols
<img :src="'/action_detach.png'" alt="Detach symbols" class="action-img">

*Sketch* - Symbols may be nested, overridden, transformed or constrained and this may lead to a lot of confusion in Ae (usually with image overrides). If layers build incorrectly inside of Ae, try detaching the symbol from its master. This removes the symbols dependence on nested data in order to draw its layers more accurately.

## Flatten shapes
<img :src="'/action_flatten.png'" alt="Flattens layers" class="action-img">

*Sketch/Figma* - Building icons from simple shapes is a flexible way to design and can make animation possible inside of Ae. AEUX supports Boolean operations, but mixing different operators within a single group or nesting boolean operations can be a little hard for Ae to draw. Click to flatten and combine shapes into a single element.

## Rasterize groups
<img :src="'/action_rasterize.png'" alt="Rasterize groups" class="action-img">

*Figma* - Icons may be composed of many complex shapes and this might bog down your Ae comp with shapes that will never need to be animated. Click to convert selected groups to images. This process is an improvement over the native **Object>Rasterize Selection** and will create a higher resolution image and will not remove the original selected layer.