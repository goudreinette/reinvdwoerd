const canvasSketch = require('canvas-sketch');
const {noise1D, noise2D, gaussian, insideCircle, pick} = require('canvas-sketch-util/random');
const colors = require('nice-color-palettes');
const p5 = require('p5');


// Attach p5.js it to global scope
new p5()

const settings = {
  dimensions: [ 2048, 2048 ],
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
};


canvasSketch(() => {
  // Inside this is a bit like p5.js 'setup' function
  // ...
  let palette = pick(colors)
  let circles = []
  let backgroundColor = pick(palette)
  
  console.log(circles)
  noCursor()

	for (var i = 0; i < 200; i++) {
		let [x, y] = insideCircle(700) // all dots placed randomly in a circle
		circles.push({
			x, y, 
			color: pick(palette), // every dot gets a random color
			strokeColor: pick(palette)
		})
	}	


  // Return a renderer to 'draw' the p5.js content
  return ({ context, width, height }) => {
  	background(backgroundColor)

    for (var i = 0; i < circles.length; i++) {
        let {x, y, color} = circles[i]

        // The further away, the smaller
        let size = 100 - ((abs(x) + abs(y)) / 10)

        // The smaller, the thinner stroke
        stroke('white')
        strokeWeight(size / 50)
        fill(color)


         // Buzzing slightly around a predefined place
         let nX = noise1D((i * 100) + (millis() / 1000), 1, 10)
         let nY = noise1D((i * 100) + (millis() / 1000) + 10000, 1, 10)
         console.log(nX, nY)

         // Draw the circle at mouse position + placement in circle + wiggle
         ellipse(mouseX + x + nX, mouseY + y + nY, size, size)

        // Gaussian randomness
        // ellipse(x + gaussian() * 10, y + gaussian() * 10, size, size)
    }
  };
}, settings);



