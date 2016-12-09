// creating a canvas element
var canvas = document.createElement("canvas"); 
var context = canvas.getContext("2d");

// set the canvas height and width 
canvas.width = 512;
canvas.height = 480; 

document.getElementById("middle-section").appendChild(canvas);


// need to draw the image constantly