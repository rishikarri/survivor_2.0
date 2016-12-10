// creating a canvas element
var canvas = document.createElement("canvas"); 
var context = canvas.getContext("2d");

// set the canvas height and width 
canvas.width = 512;
canvas.height = 480; 

document.getElementById("middle-section").appendChild(canvas);
var backgroundImage = new Image(); 
backgroundImage.src = "Images/background.png";


// CREATE EVENT LISTENERS

var keysPressed = []; //array that holds whats in the array

addEventListener("keyup", function(event){
	delete keysPressed[event.keyCode];
})
//anonymous functions to pass moveRobinhood commands 
addEventListener("keydown", function(event){
	keysPressed[event.keyCode] = true; //this position of the array has a position of true
})

//CREATE CONSTRUCTORS

//create a Hero constructor - takes in a name and an image to create a new one, for now we will only create one
function Hero(name, image, speed){
	this.name = name; 
	this.image = new Image();
	this.image.src = image;
	this.speed = speed; 
	this.x = 200;
	this.y = 200;
	//create a function native to 
	this.move = function(keysPressed){
		if(37 in keysPressed){
			if (this.x >= 32){
				this.x -= 7 * this.speed;

		// 	if(!shooting){
		// 	arrowLocation.x -= 7 * robinHoodStats.speed;
			}
		// }
		}
		if (38 in keysPressed){
			if (this.y >= 30){
				this.y -= 7 * this.speed;

				// if(!shooting){
				// arrowLocation.y -= 7 * robinHoodStats.speed;
				// }
			}
		}
		if (39 in keysPressed){
			if (this.x <= 440){
				this.x += 7 * this.speed;

			// 	if(!shooting){
			// 	arrowLocation.x += 7 * robinHoodStats.speed;
			// 	}
			}
		}
		if (40 in keysPressed){
			if (this.y <= 405){
				this.y += 7 * this.speed;
				// if(!shooting){
				// this.y += 7 * this.speed;
				// }
			}
		}	
	}
}	

function Goblin(name){
	this.name = name; 
	this.image = new Image();
	this.image.src = "Images/goblin.png"
	this.speed = 1; 
	this.x = 300;
	this.y = 200;
	this.destinationX = Math.random() * 440 + 40; 
	this.destinationY = Math.random() * 400 + 20; 
	this.move = function(){
		if (Math.abs(this.x - this.destinationX) < 32) {
			this.destinationX = Math.random() * 440 + 40; 
		}else if(this.x < this.destinationX){
			this.x += 3 * this.speed;
			// console.log(monsterNewDestinationX, monsterLocation.x);
		}else{
			this.x -= 3 * this.speed;
		}
		
		if (Math.abs(this.y - this.destinationY) < 32) {
			this.destinationY = Math.random() * 400 + 20; 
		}else if(this.y > this.destinationY){
			this.y -= 3 * this.speed;
			// console.log(monsterNewDestinationY, monsterLocation.y);

		}else{
			this.y += 3 * this.speed;
		}
	}
}

//figure out what you need to update constantly and then place it in the draw function
function update(){
	robinHood.move(keysPressed);
	goblin1.move();
	goblin2.move();
}


//create robinhood - create an image object and send it through to the constructore

var robinHood = new Hero("Robin Hood", "Images/robin-hood.png", 1);


//create a goblin
var goblin1 = new Goblin("goblin1");
var goblin2 = new Goblin("goblin2");
//can access his name with robinHood.name


// need to draw the image constantly

function draw(){
	update();
	context.drawImage(backgroundImage, 0, 0);
	context.drawImage(robinHood.image, robinHood.x, robinHood.y);
	context.drawImage(goblin1.image, goblin1.x, goblin1.y);
	context.drawImage(goblin2.image, goblin2.x, goblin2.y);
	requestAnimationFrame(draw);

}

draw();