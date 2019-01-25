const canvasSketch = require('./run-canvas-sketch');
const {noise1D, noise2D, gaussian, insideCircle, pick, range} = require('canvas-sketch-util/random');
const colors = require('nice-color-palettes');
const p5 = require('p5');


// Attach p5.js it to global scope
new p5()

let circles = []


function setup({width}) {
  noCursor()

  for (var i = 0; i < 200; i++) {
    circles.push({
      x: range(0, width),
      y: range(0, height)
    })
  } 
}

function draw({context, width, height }) {
    background('white')

    for (var i = 0; i < circles.length; i++) {
        let {x, y} = circles[i]

        // The further away, the smaller
        let size = range(100)//100 - ((abs(x) + abs(y)) / 10)

        // The smaller, the thinner stroke
        stroke('black')
        strokeWeight(size / 20)


         // Buzzing slightly around a predefined place
         let nX = noise1D((i * 100) + (millis() / 1000), 1, 10)
         let nY = noise1D((i * 100) + (millis() / 1000) + 10000, 1, 10)
         console.log(nX, nY)

         // Draw the circle at mouse position + placement in circle + wiggle
         ellipse(x + nX, y + nY, size, size)

        // Gaussian randomness
        // ellipse(x + gaussian() * 10, y + gaussian() * 10, size, size)
    } 
}




canvasSketch(setup, draw, {
    dimensions: [2048, 2048],
    // Tell canvas-sketch we're using p5.js
    p5: true,
    // Turn on a render loop (it's off by default in canvas-sketch)
    animate: true,
      // We can specify WebGL context if we want
    // Optional loop duration
      // Enable MSAA
    attributes: {
      antialias: true
    }
})


