function TiledCanvas (canvas, settings) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    this.leftTopX = 0;
    this.leftTopY = 0;
    this.zoom = 1;
    this.chunks = {};
    this.settings = this.normalizeDefaults(settings, this.defaulSettings);
    this.actionQueue = [];
}

TiledCanvas.prototype.defaultSettings = {
    chunkSize: 400
};

TiledCanvas.prototype.normalizeDefaults = function normalizeDefaults (target, defaults) {
	target = target || {};
	var normalized = utils.cloneObject(target);
	for (var k in defaults) {
		if (typeof defaults[k] === "object" && !(defaults[k] instanceof Array)) {
			normalized[k] = this.normalizeDefaults(target[k] || {}, defaults[k]);
		} else {
			normalized[k] = target[k] || defaults[k];
		}
	}
	return normalized;
};


TiledCanvas.prototype.redraw = function redraw () {
    if (this.zoom <= 0) this.zoom = 1;


};

TiledCanvas.prototype.goto = function goto (x, y) {
    this.leftTopX = 0;
    this.leftTopY = 0;
    this.zoom = 1;
};

TiledCanvas.prototype.zoom = function zoom (zoom) {
    this.zoom = zoom;
    this.redraw();
};

TiledCanvas.prototype.addToQueue = function addToQueue () {

};

TiledCanvas.prototype.execute = function execute () {

};

TiledCanvas.prototype.drawingRegion = function (startX, startY, endX, endY) {
    this.affecting = [
        [startX, startY],
        [endX, endY]
    ];
};

TiledCanvas.prototype.newCtx = function newCtx (width, height) {
    var ctx = document.createElement('canvas').getContext('2d');
    ctx.canvas.width = width;
    ctx.canvas.height = height;
    return ctx;
};

TiledCanvas.prototype.context = (function () {
    var context = {};
    var ctx = document.createElement('canvas').getContext('2d');
    for (var key in ctx) {
        if (typeof ctx[key] === 'function') {
            
        }
    }
    return context;
})();
