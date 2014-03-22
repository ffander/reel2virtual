// Export this variable so it is accesible
var anim;

// Reel rotation speed
var angularSpeed = - 360 * 1.5;


window.onload = function() {
  // Kinetic.js Stage is the <canvas> element
  var stage = new Kinetic.Stage({
    container: 'container',
    width: 1040,
    height: 720
  });

  // Graphics are layered on top of each other
  var layer = new Kinetic.Layer();

  // First, we draw the background
  var bg = new Image();
  bg.onload = function() {
    var studer = new Kinetic.Image({
      x: 0,
      y: 0,
      image: bg,
      width: 1040,
      height: 720
    });
  // add the shape to the layer
  layer.add(studer);
  };

  // Then we draw the Tape Reels on top of the background
  var tape = new Image();
  tape.onload = function() {
    var reelL = new Kinetic.Image({
      x: 190,
      y: 210,
      image: tape,
      width: 300,
      height: 300,
      offset: {x:150, y:150},
      rotation: Math.floor(Math.random()*120)
    });
    var reelR = new Kinetic.Image({
      x: 850,
      y: 210,
      image: tape,
      width: 300,
      height: 300,
      offset: {x:150, y:150},
      rotation: Math.floor(Math.random()*120)
    });
    layer.add(reelL);
    layer.add(reelR);
    anim = new Kinetic.Animation(function(frame) {
      var angleDiff = frame.timeDiff * angularSpeed / 1000;
      reelR.rotate(angleDiff);
      reelL.rotate(angleDiff);
    }, layer);
  };

  // Finally, we draw the pin (which shouldn't rotate)
  // with the rest of the reels
  var pin = new Image();
  pin.onload = function() {
    var pinL = new Kinetic.Image({
      x: 183,
      y: 203,
      image: pin,
      width: 15,
      height: 15
    });
    var pinR = new Kinetic.Image({
      x: 843,
      y: 203,
      image: pin,
      width: 15,
      height: 15
    });
  layer.add(pinL);
  layer.add(pinR);
  // add the layer to the stage
  stage.add(layer);
  };

  // Source files
  bg.src = 'canvasbg.jpg';
  tape.src = 'tapemetal.png';
  pin.src = 'pin.png';
};