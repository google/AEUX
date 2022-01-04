# Figma/Sketch Options

Simplifying layers in Sketch and Figma prior to transferring to After Effects can often provide more accurate layer creation in AEUX. 

## Figma layer options

<Screenshot 
    url="/Figma_0.8.0.png" 
    alt="Figma options" 
    width="150px"
    left />

### Export reference image

There are a few known alignment issues with layers from Figma. Enable this checkbox to generate an image overlay of the Figma frame to allow for manual alignment. Known alignment issues:
- Text layers
- Rotated images


### Rasterize layer on export
<!-- <img :src="'/action_detach.png'" alt="Detach symbols" class="action-img"> -->

Internally nicknamed **Magic Asterisk**, starting in AEUX v0.8.0, it is possible to automatically send anything in Figma to Ae as a PNG file (without editing the art) by adding a `*` to the start of the layer name. This becomes very useful for icons, complex group hierarchies, or anything that doesn't need to be animated and could be optimized by flattening it down to a single image.

Renaming in Figma may be done by:
- Manually renaming a layer
- Batch renaming selected layers with `CMD+R`/`Ctrl+R` then adding `* $&`
- Selecting Figma layers and groups, then clicking the **Rasterize layer on export**
<br />

## Sketch  layer options

<Screenshot 
    url="/Sketch_0.8.0.png" 
    alt="Sketch options" 
    width="180px"
    left />

### Flatten shapes
<!-- <img :src="'/action_flatten.png'" alt="Flattens layers" class="action-img"> -->

Building icons from simple shapes is a flexible way to design and can make animation possible inside of Ae. AEUX supports Boolean operations, but mixing different operators within a single group or nesting boolean operations can be a little hard for Ae to draw. Click to flatten and combine shapes into a single element.

### Detach symbols

<!-- <img :src="'/action_detach.png'" alt="Detach symbols" class="action-img"> -->

Symbols may be nested, overridden, transformed or constrained and this may lead to a lot of confusion in Ae (usually with image overrides). If layers build incorrectly inside of Ae, try detaching the symbol from its master. This removes the symbols dependence on nested data in order to draw its layers more accurately.
