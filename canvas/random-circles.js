const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const p5 = require('p5');

// Attach p5.js it to global scope
new p5()


const settings = {
    dimensions: 'a4',
    p5: true,
    pixelsPerInch: 300,	
};


canvasSketch(({ context, width, height }) => {
	background('white')
   for (var i = 0; i < 100; i++) {

   		strokeWeight(5)
   		ellipse(random.range(0, width), random.range(0, height), 50, 50)
   }
}, settings);