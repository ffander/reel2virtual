// Export this variable so it is accesible
var anim;

// Reel rotation speed (initial value set to zero)
var angularSpeed = 0;


window.addEventListener('load', function(e) {
  // Kinetic.js Stage object is associated to the <canvas> element
  var stage = new Kinetic.Stage({
    container: 'container',
    width: 1040,
    height: 720
  });

  // Graphics are grouped in a layer
  var layer = new Kinetic.Layer();

  // First, we load the background
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
  // This is the largest image, so it may load after the others
  // we need to move it to the bottom of the layer
  studer.moveToBottom();
  layer.draw();
  };

  // Then we load the Tape Reels that will appear on top of the background
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

    // Reel animation function
    anim = new Kinetic.Animation(function(frame) {
      var angleDiff = frame.timeDiff * angularSpeed / 1000;
      reelR.rotate(angleDiff);
      reelL.rotate(angleDiff);
    }, layer);
  };

  // Finally, we load the pins (which shouldn't rotate
  // with the rest of the reels)
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
  pinL.moveToTop();
  pinR.moveToTop();
  layer.draw();
  // add the layer to the stage
  stage.add(layer);
  };

  // Source files
  bg.src = 'canvasbg.jpg';
  tape.src = 'tapemetal.png';
  pin.src = 'pin.png';
  
}, false);