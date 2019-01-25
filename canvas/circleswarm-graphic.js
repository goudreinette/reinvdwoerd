const canvasSketch = require('./run-canvas-sketch')
const {range} = require('canvas-sketch-util/random');
const p5 = require('p5');

new p5()


let circles = []


function setup() {
	noCursor()
    stroke('black')

    circles = Array.from({length: 50}, c => ({
        x: range(0, width),
        y: range(0, height)
    }))
}

function draw() {
	background('white')
    for (var i = 0; i < circles.length; i++) {
        let {x, y} = circles[i]
        let size = range(100)

        // Smaller means thinner stroke
        strokeWeight(size / 20)
        ellipse(x, y, size, size)
    }
}



canvasSketch(setup, draw, {
    dimensions: [2048, 2048],
    p5: true,
    animate: true
})