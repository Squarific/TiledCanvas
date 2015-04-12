# TiledCanvas

TiledCanvas is a javascript module that allows you to draw on a canvas and then
easily move around without having to redraw yourself. It saves the canvas in
chunks using imageData so it doesn't have to constantly redraw making it more
efficient.

# Example

This module is used in Squarific Drawtogheter.
Demo: http://www.squarific.com/drawtogheter
Source: https://github.com/Squarific/DrawTogheter

# How to use

You start by creating a TiledCanvas object using the constructor.
The constructor takes two arguments: a canvas object and a settings object.

The canvas object is the dom canvas element you want everything to be drawn on.
The settings object is a javascript object.

You can then use all the normal methods and set all properties using
`tiledCanvas.context` as your drawingcontext. You have to however set the
drawingregion and manually execute the drawings.

## Default settings

The default settings are:

    {
        chunkSize: 256 //The amount of pixels each chunk is wide and high
    }

## Example

### A simple line

Now you can use all supported context drawing functions by doing:

    tiledCanvas.context.normalMethod();

For example

    tiledCanvas.context.begintPath();
    tiledCanvas.context.moveTo(5, 5);
    tiledCanvas.context.lineTo(15, 15);
    tiledCanvas.context.stroke();

Then you have to inform the tiledCanvas where you drew.
This has to take into account the width of things, for example if you draw a
horizontal 5 pixel line then the region you drew in is also 5 pixel high.
You do this using the `tiledCanvas.drawRegion(startX, startY, endX, endY [, border])` method.

Then you need to tell tiledCanvas to do the actual drawing. This can be done
using the tiledCanvas.execute() method.

Our example:

    tiledCanvas.context.begintPath();
    tiledCanvas.context.moveTo(5, 5);
    tiledCanvas.context.lineTo(15, 15);
    tiledCanvas.context.lineWidth = 5;
    tiledCanvas.context.stroke();
    tiledCanvas.drawRegion(0, 0, 20, 20);
    tiledCanvas.execute();

We could have also written

    tiledCanvas.drawRegion(5, 5, 15, 15, 5);

If you want to add a lot of stuff and don't want to redraw every time between
executes you can use the `tiledCanvas.executeNoRedraw()` method and then
manually call the `tiledCanvas.redraw()` method.


### Note on properties

After an execute the set properties should be expected to be random as none
generated chunks have the default values but the other chunks have the ones you set!
Just set all properties you need before calling execute.

### Getting properties

If you get a property from the canvas it needs to run trough the whole queue on
an empty offscreen canvas, depending on how many operations you have already
done and thus are in the queue this can become an expensive operation and should
be avoided.

### Clearing everything

If you want to clear everything there are two ways. If you want to remove all
the chunkdata you can make the `tiledCanvas.chunks` property an empty object.
This means however that the next time you draw it has to reallocate the chunks,
that can be an expensive operation. If you just want to clear the drawings but
not release the allocated memory you can just call the `tiledCanvas.clearAll()`
method. This method does not redraw the canvas!

This also clears the current drawings that are in the queue.

## Moving around

The reason you'd want to use this module is probably because it allows you to
easily move around in your drawing in a fast way. You do this by using the
`tiledCanvas.goto(x, y)` method. This will move the left upper corner to your
desired locatiom and redraw everything on the canvas.

If you resize the canvas dom node you can manually call the tiledCanvas.redraw()
method.

## Custom background

If you want chunks to have a custom background instead of starting out transparent
all you have to do is define the tiledCanvas.requestUserChunk to be a function
that accepts three parameters.

The function should look like:

    tiledCanvas.requestUserChunk = function requestUserChunk (chunkX, chunkY, callback) {
        callback(image); // Image should be an object that can be painted using canvas2dContext.drawImage(image, 0, 0)
    }

## Methods

tiledCanvas.redraw(noclear);

Redraws the canvas, if noclear is true does not clear the canvas, should only
be done when stuff gets added and not removed or no transparency is used.