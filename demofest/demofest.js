
fillCanvas()

function fillCanvas() {

	var gyro = false;
	window.addEventListener("devicemotion", function (event) {
		if (event.rotationRate.alpha || event.rotationRate.beta || event.rotationRate.gamma) gyro = true;
	});

	var canvasContainer = document.getElementById('canvas-container');

	var margin = 75;
	var watch = 100;
	// let levels = 9;
	// let perc_min = [5, 10, 17, 25, 34, 45, 57, 70, 84];
	// let perc_max = [16, 30, 43, 55, 66, 75, 83, 90, 96];

	var spacing = 15;
	var firstrun = true;

	var levels = 4;

	var perc_min = [10, 25, 45, 70];
	var perc_max = [30, 55, 75, 90];

	var accx = 0,
	    accy = 0;
	var objectSizes = 0;
	var globalX = 0,
	    globalY = 0,
	    default_perc = 0;
    var easing = 0.15;
    
    // The pictures
	var source_d = 0,
	    source_e = 0,
	    source_m = 0,
	    source_o = 0;

	var letter_d = 0,
	    letter_e = 0,
	    letter_m = 0,
	    letter_o = 0;

	var sketch = function sketch(p) {
		p.preload = function () {
			source_d = p.loadImage("h.png");
			source_e = p.loadImage("a.png");
			source_m = p.loadImage("n.png");
			source_o = p.loadImage("s.png");
		};

		p.setup = function () {
			console.log("SETUP");
			objectSizes = getObjectSizes(canvasContainer);
			p.createCanvas(objectSizes.width, objectSizes.height);
			p.rectMode(p.CORNER);
			p.noStroke();
			default_perc = 100 / (levels + 1);
			globalX = objectSizes.width / 2;
			globalY = objectSizes.height / 2;
			p.frameRate(60);

			if (objectSizes.width < 440) {
				spacing = 5;
			}

			letter_d = new Mesh(0, 0, objectSizes.width / 2 - spacing, objectSizes.height / 2 - spacing, source_d);
			letter_e = new Mesh(objectSizes.width / 2, 0, objectSizes.width / 2, objectSizes.height / 2 - spacing, source_e);
			letter_m = new Mesh(0, objectSizes.height / 2, objectSizes.width / 2 - spacing, objectSizes.height / 2, source_m);
			letter_o = new Mesh(objectSizes.width / 2, objectSizes.height / 2, objectSizes.width / 2 - spacing, objectSizes.height / 2, source_o);
		};

		p.draw = function () {
			p.clear();

			if (gyro) {
				if (accx != undefined) {
					globalX = globalX + accx * 2;
				}

				if (accy != undefined) {
					globalY = globalY - accy * 2;
				}
			} else {
				var targetX = p.mouseX;
				var dx = targetX - globalX;
				globalX += dx * easing;

				var targetY = p.mouseY;
				var dy = targetY - globalY;
				globalY += dy * easing;
			}

			if (globalY < margin) globalY = margin;
			if (globalX < margin) globalX = margin;
			if (globalY > objectSizes.height - margin) globalY = objectSizes.height - margin;
			if (globalX > objectSizes.width - margin) globalX = objectSizes.width - margin;

			letter_d.display(globalX, globalY);
			letter_e.display(globalX, globalY);
			letter_m.display(globalX, globalY);
			letter_o.display(globalX, globalY);

			if (firstrun) {
				firstrun = false;
			}
        };
        
        class Mesh {
            constructor(_x, _y, _w, _h, _source) {
				this.x = _x;
				this.y = _y;
				this.w = _w;
				this.h = _h;
				this.source = _source;

				this.tiles = [];

				this.lines_left = [];
				this.lines_right = [];
				this.lines_up = [];
				this.lines_down = [];
				this.lines_x = [];
				this.lines_y = [];

				this.ssx = this.source.width / (levels * 2 + 2);
				this.ssy = this.source.height / (levels * 2 + 2);

				for (var i = 0; i < levels; i++) {
					this.lines_left[i] = 0;
					this.lines_right[i] = 0;
					this.lines_up[i] = 0;
					this.lines_down[i] = 0;
				}

				for (var _i = 0; _i < levels * 2 + 2; _i++) {
					this.lines_x[_i] = 0;
					this.lines_y[_i] = 0;
				}

				for (var _i2 = 0; _i2 < levels * 2 + 2; _i2++) {
					this.tiles[_i2] = [];
					for (var j = 0; j < levels * 2 + 2; j++) {
						var tilex = Math.ceil(j * this.ssx);
						var tiley = Math.ceil(_i2 * this.ssy);
						this.tiles[_i2][j] = this.source.get(tilex, tiley, this.ssx, this.ssy);
					}
				}
            }
            
            updatePositions(_x, _y, _w, _h) {
                this.x = _x;
                this.y = _y;
                this.w = _w;
                this.h = _h;
            }

            display(tx, ty) {

                if (tx < this.x - watch) {
                    this.xvalue = -1;
                    this.curX = margin;
                } else if (tx > this.x + this.w + watch) {
                    this.xvalue = 1;
                    this.curX = this.w - margin;
                } else {
                    this.xvalue = p.map(tx, this.x - watch, this.x + this.w + watch, -1, 1);
                    this.curX = p.map(tx, this.x - watch, this.x + this.w + watch, margin, this.w - margin);
                }

                if (this.xvalue <= 0) {
                    for (var i = 0; i < this.lines_left.length; i++) {
                        var perc = p.map(this.xvalue, -1, 0, perc_min[i], default_perc * (i + 1));
                        this.lines_left[i] = this.curX / 100 * perc;
                        this.lines_right[i] = this.curX + (this.w - this.curX) / 100 * perc;
                    }
                } else {
                    for (var _i3 = 0; _i3 < this.lines_left.length; _i3++) {
                        var _perc = p.map(this.xvalue, 0, 1, default_perc * (_i3 + 1), perc_max[_i3]);
                        this.lines_left[_i3] = this.curX / 100 * _perc;
                        this.lines_right[_i3] = this.curX + (this.w - this.curX) / 100 * _perc;
                    }
                }

                if (ty < this.y - watch) {
                    this.yvalue = -1;
                    this.curY = margin;
                } else if (ty > this.y + this.h + watch) {
                    this.yvalue = 1;
                    this.curY = this.h - margin;
                } else {
                    this.yvalue = p.map(ty, this.y - watch, this.y + this.h + watch, -1, 1);
                    this.curY = p.map(ty, this.y - watch, this.y + this.h + watch, margin, this.h - margin);
                }

                if (this.yvalue <= 0) {
                    for (var _i4 = 0; _i4 < levels; _i4++) {
                        var _perc2 = p.map(this.yvalue, -1, 0, perc_min[_i4], default_perc * (_i4 + 1));
                        this.lines_up[_i4] = this.curY / 100 * _perc2;
                        this.lines_down[_i4] = this.curY + (this.h - this.curY) / 100 * _perc2;
                    }
                } else {
                    for (var _i5 = 0; _i5 < levels; _i5++) {
                        var _perc3 = p.map(this.yvalue, 0, 1, default_perc * (_i5 + 1), perc_max[_i5]);
                        this.lines_up[_i5] = this.curY / 100 * _perc3;
                        this.lines_down[_i5] = this.curY + (this.h - this.curY) / 100 * _perc3;
                    }
                }

                this.lines_x[0] = 0;
                this.lines_y[0] = 0;

                for (var _i6 = 0; _i6 < levels; _i6++) {
                    this.lines_x[_i6 + 1] = this.lines_left[_i6];
                    this.lines_y[_i6 + 1] = this.lines_up[_i6];
                }

                this.lines_x[levels + 1] = this.curX;
                this.lines_y[levels + 1] = this.curY;

                for (var _i7 = levels + 2; _i7 < this.lines_x.length; _i7++) {
                    this.lines_x[_i7] = this.lines_right[_i7 - levels - 2];
                    this.lines_y[_i7] = this.lines_down[_i7 - levels - 2];
                }

                for (var _i8 = 0; _i8 <= this.lines_y.length - 1; _i8++) {
                    for (var j = 0; j <= this.lines_x.length - 1; j++) {
                        if (j == this.lines_x.length - 1 || _i8 == this.lines_y.length - 1) {
                            if (j == this.lines_x.length - 1 && _i8 != this.lines_y.length - 1) {
                                p.image(this.tiles[_i8][j], this.lines_x[j] + this.x, this.lines_y[_i8] + this.y, this.w + this.x - (this.lines_x[j] + this.x), this.lines_y[_i8 + 1] + this.y - (this.lines_y[_i8] + this.y));
                            } else if (j != this.lines_x.length - 1 && _i8 == this.lines_y.length - 1) {
                                p.image(this.tiles[_i8][j], this.lines_x[j] + this.x, this.lines_y[_i8] + this.y, this.lines_x[j + 1] + this.x - (this.lines_x[j] + this.x), this.h + this.y - (this.lines_y[_i8] + this.y));
                            } else {
                                p.image(this.tiles[_i8][j], this.lines_x[j] + this.x, this.lines_y[_i8] + this.y, this.w + this.x - (this.lines_x[j] + this.x), this.h + this.y - (this.lines_y[_i8] + this.y));
                            }
                        } else {
                            p.image(this.tiles[_i8][j], this.lines_x[j] + this.x, this.lines_y[_i8] + this.y, this.lines_x[j + 1] + this.x - (this.lines_x[j] + this.x), this.lines_y[_i8 + 1] + this.y - (this.lines_y[_i8] + this.y));
                        }
                    }
                }
	        }
        }



		window.addEventListener('devicemotion', function (e) {
			// get accelerometer values
			accx = parseInt(e.accelerationIncludingGravity.x);
			accy = parseInt(e.accelerationIncludingGravity.y);
			accy += 4;
		});
	};

	new p5(sketch, canvasContainer);
}

function getObjectSizes(element) {
	var _element$getBoundingC = element.getBoundingClientRect(),
	    width = _element$getBoundingC.width,
	    height = _element$getBoundingC.height;

	return { width: width, height: height };
}


function fillCanvasBG() {

	var gyro = false;
	window.addEventListener("devicemotion", function (event) {
		if (event.rotationRate.alpha || event.rotationRate.beta || event.rotationRate.gamma) gyro = true;
	});

	var canvasContainer = document.getElementById('canvas-container');

	var margin = 75;
	var levels = 4;
	var perc_min = [10, 25, 45, 70];
	var perc_max = [30, 55, 75, 90];

	var accx = 0,
	    accy = 0;

	var objectSizes = 0;

	var globalX = 0,
	    globalY = 0,
	    default_perc = 0,
	    ssx = 0,
	    ssy = 0;
	var source = 0;
	var tiles = [];

	var lines_left = [];
	var lines_right = [];

	var lines_up = [];
	var lines_down = [];

	var lines_x = [];
	var lines_y = [];

	var easing = 0.075;

	var filename = document.querySelector('[js-hook-script]').getAttribute('data-file');

	var sketch = function sketch(p) {

		p.preload = function () {
			source = p.loadImage("assets/images/" + filename);
			objectSizes = getObjectSizes(canvasContainer);
			canvasObserver.observe(canvasContainer);
		};

		p.setup = function () {

			p.createCanvas(objectSizes.width, objectSizes.height);
			p.rectMode(p.CORNER);

			ssx = source.width / (levels * 2 + 2);
			ssy = source.height / (levels * 2 + 2);

			for (var i = 0; i < levels * 2 + 2; i++) {
				tiles[i] = [];
				for (var j = 0; j < levels * 2 + 2; j++) {
					var x = Math.ceil(j * ssx);
					var y = Math.ceil(i * ssy);
					tiles[i][j] = source.get(x, y, ssx, ssy);
				}
			}

			for (var _i = 0; _i < levels; _i++) {
				lines_left[_i] = 0;
				lines_right[_i] = 0;
				lines_up[_i] = 0;
				lines_down[_i] = 0;
			}

			for (var _i2 = 0; _i2 < levels * 2 + 2; _i2++) {
				lines_x[_i2] = 0;
				lines_y[_i2] = 0;
			}

			p.noStroke();

			default_perc = 100 / (levels + 1);

			globalX = objectSizes.width / 2;
			globalY = objectSizes.height / 2;

			p.frameRate(60);
		};

		p.draw = function () {
			p.clear();

			if (gyro) {
				if (accx != undefined) {
					globalX = globalX + accx * 2;
				}

				if (accy != undefined) {
					globalY = globalY - accy * 2;
				}
			} else {
				var targetX = p.mouseX;
				var dx = targetX - globalX;
				globalX += dx * easing;

				var targetY = p.mouseY;
				var dy = targetY - globalY;
				globalY += dy * easing;
			}

			if (globalY < margin) globalY = margin;
			if (globalX < margin) globalX = margin;
			if (globalY > objectSizes.height - margin) globalY = objectSizes.height - margin;
			if (globalX > objectSizes.width - margin) globalX = objectSizes.width - margin;

			var xvalue = p.map(globalX, margin, objectSizes.width - margin, -1, 1);

			if (xvalue <= 0) {
				for (var i = 0; i < lines_left.length; i++) {
					var perc = p.map(xvalue, -1, 0, perc_min[i], default_perc * (i + 1));
					lines_left[i] = globalX / 100 * perc;
					lines_right[i] = globalX + (objectSizes.width - globalX) / 100 * perc;
				}
			} else {
				for (var _i3 = 0; _i3 < lines_left.length; _i3++) {
					var _perc = p.map(xvalue, 0, 1, default_perc * (_i3 + 1), perc_max[_i3]);
					lines_left[_i3] = globalX / 100 * _perc;
					lines_right[_i3] = globalX + (objectSizes.width - globalX) / 100 * _perc;
				}
			}

			var yvalue = p.map(globalY, margin, objectSizes.height - margin, -1, 1);

			if (yvalue <= 0) {
				for (var _i4 = 0; _i4 < levels; _i4++) {
					var _perc2 = p.map(yvalue, -1, 0, perc_min[_i4], default_perc * (_i4 + 1));
					lines_up[_i4] = globalY / 100 * _perc2;
					lines_down[_i4] = globalY + (objectSizes.height - globalY) / 100 * _perc2;
				}
			} else {
				for (var _i5 = 0; _i5 < levels; _i5++) {
					var _perc3 = p.map(yvalue, 0, 1, default_perc * (_i5 + 1), perc_max[_i5]);
					lines_up[_i5] = globalY / 100 * _perc3;
					lines_down[_i5] = globalY + (objectSizes.height - globalY) / 100 * _perc3;
				}
			}

			lines_x[0] = 0;
			lines_y[0] = 0;

			for (var _i6 = 0; _i6 < levels; _i6++) {
				lines_x[_i6 + 1] = lines_left[_i6];
				lines_y[_i6 + 1] = lines_up[_i6];
			}

			lines_x[levels + 1] = globalX;
			lines_y[levels + 1] = globalY;

			for (var _i7 = levels + 2; _i7 < lines_x.length; _i7++) {
				lines_x[_i7] = lines_right[_i7 - levels - 2];
				lines_y[_i7] = lines_down[_i7 - levels - 2];
			}

			for (var _i8 = 0; _i8 <= lines_y.length - 1; _i8++) {
				for (var j = 0; j <= lines_x.length - 1; j++) {
					if (j == lines_x.length - 1 || _i8 == lines_y.length - 1) {
						if (j == lines_x.length - 1 && _i8 != lines_y.length - 1) {
							p.image(tiles[_i8][j], lines_x[j], lines_y[_i8], objectSizes.width - lines_x[j] + 1, lines_y[_i8 + 1] - lines_y[_i8] + 1);
						} else if (j != lines_x.length - 1 && _i8 == lines_y.length - 1) {
							p.image(tiles[_i8][j], lines_x[j], lines_y[_i8], lines_x[j + 1] - lines_x[j] + 1, objectSizes.height - lines_y[_i8] + 1);
						} else {
							p.image(tiles[_i8][j], lines_x[j], lines_y[_i8], objectSizes.width - lines_x[j] + 1, objectSizes.height - lines_y[_i8] + 1);
						}
					} else {
						p.image(tiles[_i8][j], lines_x[j], lines_y[_i8], lines_x[j + 1] - lines_x[j] + 1, lines_y[_i8 + 1] - lines_y[_i8] + 1);
					}
				}
			}
		};

		var canvasObserver = new __WEBPACK_IMPORTED_MODULE_0_resize_observer_polyfill__["a" /* default */](function (entries) {
			objectSizes.width = entries[0].contentRect.width;
			objectSizes.height = entries[0].contentRect.height;
			p.resizeCanvas(objectSizes.width, objectSizes.height);
		});

		window.addEventListener('devicemotion', function (e) {
			// get accelerometer values
			accx = parseInt(e.accelerationIncludingGravity.x);
			accy = parseInt(e.accelerationIncludingGravity.y);
			accy += 3;
		});
	};

	new p5(sketch, canvasContainer);
}

function getObjectSizes(element) {
	var _element$getBoundingC = element.getBoundingClientRect(),
	    width = _element$getBoundingC.width,
	    height = _element$getBoundingC.height;

	return { width: width, height: height };
}
