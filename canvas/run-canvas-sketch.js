const canvasSketch = require('canvas-sketch');

module.exports = function (setup, update, settings) {
	canvasSketch(c => {
		setup(c)
		return c => {
			update(c)
		}
	}, settings)
}