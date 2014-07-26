function TiledCanvas (canvas, settings) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    this.leftTopX = 0;
    this.leftTopY = 0;
    this.affecting = [[0, 0], [0, 0]];
    this.chunks = {};
    this.settings = this.normalizeDefaults(settings, this.defaulSettings);
    this.contextQueue = [];
    this.contextPropertys = {};
    this.context = this.createContext();
}

TiledCanvas.prototype.defaultSettings = {
    chunkSize: 256
};

TiledCanvas.prototype.cloneObject = function (obj) {
	var clone = {};
	for (var k in obj) {
		if (typeof obj[k] === "object" && !(obj[k] instanceof Array)) {
			clone[k] = this.cloneObject(obj[k]);
		} else {
			clone[k] = obj[k]
		}
	}
	return clone;
};

TiledCanvas.prototype.normalizeDefaults = function normalizeDefaults (target, defaults) {
	target = target || {};
	var normalized = this.cloneObject(target);
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

TiledCanvas.prototype.execute = function execute () {

};

TiledCanvas.prototype.drawingRegion = function (startX, startY, endX, endY) {
    this.affecting[0][0] = startX;
    this.affecting[0][1] = startY;
    this.affecting[1][0] = endX;
    this.affecting[1][1] = endY;
};

TiledCanvas.prototype.newCtx = function newCtx (width, height) {
    var ctx = document.createElement('canvas').getContext('2d');
    ctx.canvas.width = width;
    ctx.canvas.height = height;
    return ctx;
};

TiledCanvas.prototype.createContext = function createContext () {
    var context = {};
    var ctx = document.createElement('canvas').getContext('2d');
    for (var key in ctx) {
        if (typeof ctx[key] === 'function') {
            context[key] = function (func) {
                this.contextQueue.push(arguments);
            }.bind(this, key);
        } else if (typeof ctx[key] !== 'object') {
            context.__defineGetter__(key, function () {
                var ctx = document.createElement('canvas').getContext('2d');
                return this.contextPropertys[key] || ctx[key];
            }.bind(this));

            context.__defineSetter__(key, function (value) {
                return this.contextPropertys[key] = value;
            }.bind(this));
        }
    }
    return context;
};
