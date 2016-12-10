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
var shooting = false;
function Hero(name, image, speed){
	this.name = name; 
	this.health = 20;
	this.image = new Image();
	this.image.src = image;
	this.speed = speed; 
	this.x = 200;
	this.y = 200;
	this.arrowImage = new Image();
	this.arrowImage.src = "Images/arrow-right.png";
	// this function will follow the hero if he is not shooting
	this.arrowFollow = function(){
		if (!shooting){
			this.arrowLocation.x = this.x + 20;
			this.arrowLocation.y = this.y +4;
		}
	}
	this.arrowLocation = {
		x: 220, 
		y: 204,
		destinationX: 0,
		destinationY: 0
	}
	// create a function native to the main character that allows him to move
	this.move = function(keysPressed){
		if(37 in keysPressed){
			if (this.x >= 32){
				this.x -= 7 * this.speed;
			}
		}
		if (38 in keysPressed){
			if (this.y >= 30){
				this.y -= 7 * this.speed;
			}
		}
		if (39 in keysPressed){
			if (this.x <= 440){
				this.x += 7 * this.speed;
			}
		}
		if (40 in keysPressed){
			if (this.y <= 405){
				this.y += 7 * this.speed;
			}
		}	
	}

	this.shoot = function(keysPressed){
		if(32 in keysPressed){
			//shooting prevents arrow from moving with character
			shooting = true;
			// if the spacebar is hit, shoot the arrow 50 pixels right, user can hold it to make it go farther
			this.arrowLocation.destinationX = this.arrowLocation.x + 50; 
		}
		// if the arrow is within 10 pixels of its destination stop it
		if(Math.abs(this.arrowLocation.x - this.arrowLocation.destinationX) < 10){
			this.stopShooting();
		}else{
			if(this.arrowLocation.x < this.arrowLocation.destinationX && shooting == true){
				this.arrowLocation.x += 6;
			}
		}
	}
	//when this is called, stop shooting and return the arrow to robinhood
	this.stopShooting = function(){
		shooting = false;
		this.arrowLocation.x = this.x + 20;
		this.arrowLocation.y = this.y + 4; 
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

	this.catchRobinHood = function() {
		// if this goblin is within 32 of robinhood, robinhood gets hurt
		if(
			Math.abs((this.x - robinHood.x)) < 32
			&& Math.abs(this.y - robinHood.y) < 32
		){
		//robin hoood got hit
			this.x = Math.random() * 440 + 40; 
			this.y = Math.random() * 400 + 20; 
			robinHood.health--;
			document.getElementById("health").innerHTML = robinHood.health; 	
		}
	}

}

// Update function

//figure out what you need to update constantly and then place it in the draw function
function update(){
	robinHood.move(keysPressed);
	robinHood.shoot(keysPressed);
	robinHood.arrowFollow();
	goblin1.move();
	goblin2.move();
	goblin1.catchRobinHood();
	goblin2.catchRobinHood();
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
	context.drawImage(robinHood.arrowImage, robinHood.arrowLocation.x, robinHood.arrowLocation.y);
	context.drawImage(goblin1.image, goblin1.x, goblin1.y);
	context.drawImage(goblin2.image, goblin2.x, goblin2.y);
	requestAnimationFrame(draw);

}

draw();