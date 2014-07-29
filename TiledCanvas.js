function TiledCanvas (canvas, settings) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    this.leftTopX = 0;
    this.leftTopY = 0;
    this.affecting = [[0, 0], [0, 0]];
    this.chunks = {};
    this.settings = this.normalizeDefaults(settings, this.defaultSettings);
    this.contextQueue = [];
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
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    var startChunkX = Math.floor(this.leftTopX / this.settings.chunkSize),
        endChunkX =  Math.ceil((this.leftTopX + this.canvas.width) / this.settings.chunkSize),
        startChunkY = Math.floor(this.leftTopY / this.settings.chunkSize),
        endChunkY = Math.ceil((this.leftTopY + this.canvas.height) / this.settings.chunkSize);
    for (var chunkX = startChunkX; chunkX < endChunkX; chunkX++) {
        for (var chunkY = startChunkY; chunkY < endChunkY; chunkY++) {
            this.drawChunk(chunkX, chunkY);
        }
    }
};

TiledCanvas.prototype.drawChunk = function drawChunk (chunkX, chunkY) {
    if (this.chunks[chunkX] && this.chunks[chunkX][chunkY]) {
        this.ctx.putImageData(this.chunks[chunkX][chunkY], chunkX * this.settings.chunkSize - this.leftTopX, chunkY * this.settings.chunkSize - this.leftTopY);
    }
};

TiledCanvas.prototype.goto = function goto (x, y) {
    this.leftTopX = x;
    this.leftTopY = y;
    this.redraw();
};

TiledCanvas.prototype.execute = function execute () {
    for (var chunkX = this.affecting[0][0]; chunkX < this.affecting[1][0]; chunkX++) {
        for (var chunkY = this.affecting[0][1]; chunkY < this.affecting[1][1]; chunkY++) {
            this.executeChunk(chunkX, chunkY);
        }
    }
    this.contextQueue = [];
    this.redraw();
};

TiledCanvas.prototype.executeChunk = function executeChunk (chunkX, chunkY) {
    var ctx = this.newCtx(this.settings.chunkSize, this.settings.chunkSize);

    this.chunks[chunkX] = this.chunks[chunkX] || [];
    if (this.chunks[chunkX][chunkY]) {
        ctx.putImageData(this.chunks[chunkX][chunkY], 0, 0);
    }

    ctx.translate(-chunkX * this.settings.chunkSize, -chunkY * this.settings.chunkSize);

    for (var queuekey = 0; queuekey < this.contextQueue.length; queuekey++) {
        if (typeof ctx[this.contextQueue[queuekey][0]] === 'function') {
            ctx[this.contextQueue[queuekey][0]].apply(ctx, Array.prototype.slice.call(this.contextQueue[queuekey], 1));
        } else {
            ctx[this.contextQueue[queuekey][0]] = this.contextQueue[queuekey][1];
        }
    }

    this.chunks[chunkX][chunkY] = ctx.getImageData(0, 0, this.settings.chunkSize, this.settings.chunkSize);
};

TiledCanvas.prototype.cleanup = function cleanup (chunkX, chunkY, arguments) {
    if (typeof this.cleanupFunctions[arguments[0]] === 'function') {
        return this.cleanupFunctions[arguments[0]](arguments.slice(), chunkX * this.settings.chunkSize, chunkY * this.settings.chunkSize);
    }
    return arguments;
};

TiledCanvas.prototype.isChunkEmpty = function isChunkEmpty (imageData) {
    for (var k = 3; k < imageData.data.length; k += 4) {
        if (imageData.data[k] !== 0) {
            return false;
        }
    }
    return true;
};

TiledCanvas.prototype.drawingRegion = function (startX, startY, endX, endY) {
    this.affecting[0][0] = Math.floor(Math.min(startX, endX) / this.settings.chunkSize);
    this.affecting[0][1] = Math.floor(Math.min(startY, endY) / this.settings.chunkSize);
    this.affecting[1][0] = Math.ceil(Math.max(endX, startX) / this.settings.chunkSize);
    this.affecting[1][1] = Math.ceil(Math.max(endY, startY / this.settings.chunkSize));
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
            context.__defineGetter__(key, function (key) {
                var ctx = this.newCtx();
                for (var queuekey = 0; queuekey < this.contextQueue.length; queuekey++) {
                    if (typeof ctx[args[0]] === 'function') {
                        ctx[args[0]].apply(ctx, args.slice(1));
                    } else {
                        ctx[args[0]] = args[1];
                    }
                }
                return ctx[key];
            }.bind(this, key));

            context.__defineSetter__(key, function (key, value) {
                this.contextQueue.push(arguments);
            }.bind(this, key));
        }
    }
    return context;
};
