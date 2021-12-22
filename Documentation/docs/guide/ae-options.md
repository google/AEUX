# Ae options

The primary role of the After Effects panel is to control how layers get built. Once these preferences are set, it is not required to keep the Ae panel open; AEUX will work even with this panel closed.
## New comp

<Screenshot 
    url="/AE_Options.png" 
    alt="Ae options" 
    width="210px"
    left />

Creates a new Ae comp for each transfer. While most design apps are able to work at a lower resolution for different pixel densities Ae needs real pixel values. 

### Comp size multiplier
When creating a new comp, a comp size multiplier dropdown will be visible. The size of the new comp is defined by the Comp size multiplier. 

### Frame rate and duration
Adjust the new comps to best fit your target output.

## Current comp
Adds transferred layers to the existing comp. The current comp’s width is measured and used to set the size of the new layers.

## Image save path
When transferring images to Ae, it needs to know where you want to save them. With this field empty, AEUX will ask each time for a folder path. If you plan to work in the same project for a while, set a path and AEUX will build images without asking where to save each time. 
## Detect parametric shapes
When enabled, AEUX will create rectangles and ellipses whenever possible. When disabled it will create paths. Limit conversions by transfering shapes the way you want.

## Precomp groups
By default, groups are created as (invisible) guides layers as parents to the visible layers in the main comp. When enabled AEUX will automatically precomp these grouped layers. Precomps may also be ungrouped with the [grouping buttons](/grouping).