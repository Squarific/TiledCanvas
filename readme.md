# TiledCanvas

TiledCanvas is a javascript module that allows you to draw on a canvas and then
easily move around without having to redraw yourself. It saves the canvas in
chunks using imageData so it doesn't have to constantly redraw making it more
efficient.

# How to use

You start by creating a TiledCanvas object using the constructor.
The constructor takes two arguments: a canvas object and a settings object.

The canvas object is the dom canvas element you want everything to be drawn on.
The settings object is a javascript object.

You can then use all the normal methods and set all properties using
tiledCanvas.context as your drawingcontext. You have to however set the
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
You do this using the tiledCanvas.drawRegion(startX, startY, endX, endY) method.

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

### Getting properties

Getting properties is something that still has to be implemented. I'm probably
not going to do this unless someone needs it. If you need it you can contact me
on this email: [tiledCanvas@squarific.com](mailto:tiledCanvas@squarific.com)
