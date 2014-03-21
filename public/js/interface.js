// Get the Canvas Element ID
//var targetCanvas = document.getElementById("myCanvas");

var reel = new Image();
var surface;
var angle = 0;
var goo = 0;

window.addEventListener('load', function(e) {
	drawCanvas();
});

function drawCanvas() {
	surface = document.getElementById("myCanvas");
	if (surface.getContext) {
        reel.onload = setInterval(loop, 10);
        reel.src = 'reel.jpg';
    }
}

function stopAnimation() {
	goo = 0;
}

function resumeAnimation() {
	goo = 1;
}

function resetAnimation() {
    angle = 0;
}

function loop() {
    var ctx = surface.getContext('2d');
    ctx.clearRect(0, 0, 300, 300);
    ctx.save();
    ctx.translate(75, 75);
	ctx.rotate(DegToRad(angle));
    ctx.drawImage(reel, -(reel.width/2), -(reel.width/2));
    if (goo === 1)
    angle++;
    if(angle >= 360)
		angle = 0;
    ctx.restore();
}

function DegToRad(d) {
    // Converts degrees to radians 
    return (d * 0.0174532925199432957);
}