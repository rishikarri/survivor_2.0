// creating a canvas element
var canvas = document.createElement("canvas"); 
var context = canvas.getContext("2d");

// set the canvas height and width 
canvas.width = 675;
canvas.height = 480; 

document.getElementById("middle-section").appendChild(canvas);
var backgroundImage = new Image(); 
backgroundImage.src = "Images/background2.jpeg";


// ----------------------------------------------------------
// ----------------------GLOBALS-----------------------------
// ----------------------------------------------------------




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
//

//create a Hero constructor - takes in a name and an image to create a new one, for now we will only create one
var shooting = false;
function Hero(name, image, speed){
	this.name = name; 
	this.health = 20;
	this.gold = 0;
	this.image = new Image();
	this.image.src = image;
	this.speed = speed; 
	this.x = 200;
	this.y = 200;
	this.faceLeft = false;
	this.arrowImage = new Image();
	this.arrowImage.src = "Images/arrow-right.png";
	// this function will follow the hero if he is not shooting
	this.arrowFollow = function(){
		if (!shooting){
			if(this.faceLeft){
				this.arrowLocation.x = this.x - 4;
				this.arrowLocation.y = this.y + 18;
				
			}else if(!this.faceLeft){
				this.arrowLocation.x = this.x + 22;
				this.arrowLocation.y = this.y + 18;
				
			}
		}
	}

	this.arrowLocation = {
		x: 222, 
		y: 218,
		destinationX: 0,
		destinationY: 0
	}
	// create a function native to the main character that allows him to move
	this.move = function(keysPressed){
		if(37 in keysPressed){
			if (this.x >= 80){
				this.x -= 7 * this.speed;
				// Make archer look left if he is moving left - do the same with arrow
				this.image.src = "possible-enemies-allies/archer3-left.png";
				this.arrowImage.src = "Images/arrow-left.png";
				// this.arrowLocation.x = this.x - 4; 
				// this.arrowLocation.y = this.y + 18;
				this.faceLeft = true;

			}
		}
		if (38 in keysPressed){
			if (this.y >= 30){
				this.y -= 7 * this.speed;
			}
		}
		if (39 in keysPressed){
			if (this.x <= 520){
				this.x += 7 * this.speed;
				this.image.src = "possible-enemies-allies/archer3.png";
				this.arrowImage.src = "Images/arrow-right.png";
				// this.arrowLocation.x = this.x + 22;
				// this.arrowLocation.y = this.y + 18;
				this.faceLeft = false;
				
			}
		}
		if (40 in keysPressed){
			if (this.y <= 390){
				this.y += 7 * this.speed;
			}
		}	
	}

	this.shoot = function(keysPressed){

		
		if(68 in keysPressed){
			//shooting prevents arrow from moving with character
			shooting = true;
			// if the spacebar is hit, shoot the arrow 50 pixels right, user can hold it to make it go farther
			this.arrowLocation.destinationX = this.arrowLocation.x + 50; 
			
			// change image source and make sure the character is facing right
			this.image.src = "possible-enemies-allies/archer3.png";
			this.faceLeft = false;
			this.arrowImage.src = "Images/arrow-right.png";

		}else if(65 in keysPressed){
			shooting = true;
			this.arrowLocation.destinationX = this.arrowLocation.x - 100; 
			

			// change the image source and make sure the character is shooting left
			this.image.src = "possible-enemies-allies/archer3-left.png";
			this.faceLeft = true;
			this.arrowImage.src = "Images/arrow-left.png";

		}else {
			shooting = false;
			this.stopShooting();
		}

		
		// if the arrow is within 10 pixels of its destination stop it
		if(Math.abs(this.arrowLocation.x - this.arrowLocation.destinationX) < 10){
			this.stopShooting();
		}else{
			//if the arrow is not within 10 pixels of its destination, keep it going
			if(this.arrowLocation.x < this.arrowLocation.destinationX && shooting == true){
				this.arrowLocation.x += 6;				
			}else if(this.arrowLocation.x > this.arrowLocation.destinationX && shooting == true){
				this.arrowLocation.x -= 6;
			}								
		}
	}
	//when this is called, stop shooting and return the arrow to robinhood
	this.stopShooting = function(){
		shooting = false;
		this.arrowLocation.x = this.x + 20;
		this.arrowLocation.y = this.y + 20; 
	}
	
}	

function Goblin(name){
	this.name = name; 
	this.health = 3;
	this.image = new Image();
	this.image.src = "possible-enemies-allies/royalty goblin.png"
	this.speed = 1; 
	this.x = 300;
	this.y = 200;
	this.destinationX = Math.random() * 440 + 40; 
	this.destinationY = Math.random() * 400 + 20; 
	this.move = function(){
		if (Math.abs(this.x - this.destinationX) < 32) {
			this.destinationX = Math.random() * 440 + 40; 
		}else if(this.x < this.destinationX){
			this.x += 2.8 * this.speed;
			this.image.src = "possible-enemies-allies/royalty-goblin-right.png";
		}else{
			this.x -= 2.8 * this.speed;
			this.image.src = "possible-enemies-allies/royalty goblin-left.png";
		}
		
		if (Math.abs(this.y - this.destinationY) < 32) {
			this.destinationY = Math.random() * 400 + 20; 
		}else if(this.y > this.destinationY){
			this.y -= 2.8 * this.speed;
		}else{
			this.y += 2.8 * this.speed;
		}
	}

	this.catchRobinHood = function() {
		// if this goblin is within 32 of robinhood, robinhood gets hurt unless goblin is a coin
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
	this.getHitByArrow = function() {
		if (
			Math.abs(robinHood.arrowLocation.x - this.x) < 15
		&& Math.abs(robinHood.arrowLocation.y - this.y) < 28 
		&& shooting === true
		){
			// if the goblin gets hit by the arrow, it loses health, robinhood stops shooting and teh goblin slows
			this.health -= 1;
			shooting = false;
			robinHood.stopShooting();
			this.changeSpeed();
		}
	}
	//changes the speed of the goblin and changes them to a coin if dead
	this.changeSpeed = function() {
		if (this.health == 2){
			this.speed = .7; 
		}else if(this.health == 1){
			this.speed = .2;
		}else if (this.health <= 0){
			this.image.src = "Images/gold-coin.png";
			var goblinNumber = this.name.slice(6);		

			//change property in thug array to do nothing
			goblinArray[goblinNumber] = "do nothing";

			// change image source to nothing and increase gold
			this.image.src = "";
			robinHood.gold += 5;
			document.getElementById("gold-collected").innerHTML = "Gold: " + robinHood.gold;	

			// CHANGE TEXT DISPLAY TO GOLD BEFOE DISPLAYING
			document.getElementById("textDisplay").style.color = "goldenRod"; 
			document.getElementById("textDisplay").innerHTML = "You collected " + 5 + " gold!";

			// clear the text display after 2 seconds
			displayGold = setInterval(clearDisplay, 3000); //update the counter every second
		}
	}

}

function Thug(name){

	this.name = name; 
	this.health = 6;
	this.image = new Image();
	this.image.src = "possible-enemies-allies/thug.png";
	this.speed = 1; 
	this.x = 300;
	this.y = 200;
	this.move = function(){
		if (Math.abs(this.x - robinHood.x) < 32) {
			this.catchRobinHood();
		}else if(this.x < robinHood.x){
			this.x += 2 * this.speed;
			this.image.src = "possible-enemies-allies/thug.png";
			// console.log(monsterNewDestinationX, monsterLocation.x);
		}else{
			this.x -= 2 * this.speed;
			this.image.src = "possible-enemies-allies/thug-left.png";
		}
		
		if (Math.abs(this.y - robinHood.y) < 32) {
			this.catchRobinHood();
		}else if(this.y > robinHood.y){
			this.y -= 2 * this.speed;
			// console.log(monsterNewDestinationY, monsterLocation.y);

		}else{
			this.y += 2 * this.speed;
		}
	}

	this.catchRobinHood = function() {
		// if this goblin is within 32 of robinhood, robinhood gets hurt unless goblin is a coin
		if(
			Math.abs((this.x - robinHood.x)) < 32
			&& Math.abs(this.y - robinHood.y) < 32
		){

			// don't need the above code bedaduse you catch robinhood if you get close to him
			//generate new location if you hit him
		//robin hoood got hit
			this.x = Math.random() * 440 + 40; 
			this.y = Math.random() * 400 + 20; 
			robinHood.health--;
			document.getElementById("health").innerHTML = robinHood.health; 	
		}
		
	}
	this.getHitByArrow = function() {
		if (
			Math.abs(robinHood.arrowLocation.x - this.x) < 15
		&& Math.abs(robinHood.arrowLocation.y - this.y) < 28
		&& shooting === true
		){
			// if the goblin gets hit by the arrow, it loses health, robinhood stops shooting and teh goblin slows
			this.health -= 1;
			shooting = false;
			robinHood.stopShooting();
			this.changeSpeed();
		}
	}
	//changes the speed of the goblin and changes them to a coin if dead
	this.changeSpeed = function() {
		if (this.health == 5){
			this.speed = .7; 
		}else if(this.health == 3){
			this.speed = .3;
		}else if(this.health == 1){
			this.speed = .05;
		}
		else if (this.health <= 0){
			var thugNumber = this.name.slice(4);			

			//change property in thug array to do nothing
			thugArray[thugNumber] = "do nothing";

			// change image source to nothing and increase gold
			this.image.src = "";
			robinHood.gold += 7;
			document.getElementById("gold-collected").innerHTML = "Gold: " + robinHood.gold;

			//display the amount of gold Collected for 2 seconds
			document.getElementById("textDisplay").style.color = "goldenRod"; 
			document.getElementById("textDisplay").innerHTML = "You collected " + 7 + " gold!";

			// clear the text display after 2 seconds
			displayGold = setInterval(clearDisplay, 2000); //update the counter every second

		}	
	}

}
//let's create a golem
function Golem(name){

	this.name = name; 
	this.health = 500;
	this.image = new Image();
	this.image.src = "possible-enemies-allies/golem1.png";
	this.speed = .8; 
	this.x = 300;
	this.y = 200;
	this.move = function(){
		if (Math.abs(this.x - robinHood.x) < 32) {
			this.catchRobinHood();
		}else if(this.x < robinHood.x){
			this.x += 2 * this.speed;
			console.log("hi");
			// this.image.src = "possible-enemies-allies/golem.png";
			// console.log(monsterNewDestinationX, monsterLocation.x);
		}else{
			this.x -= 2 * this.speed;
			// this.image.src = "possible-enemies-allies/thug-left.png";
		}
		
		if (Math.abs(this.y - robinHood.y) < 32) {
			this.catchRobinHood();
		}else if(this.y > robinHood.y){
			this.y -= 2 * this.speed;
			// console.log(monsterNewDestinationY, monsterLocation.y);

		}else{
			this.y += 2 * this.speed;
		}
	}

	this.catchRobinHood = function() {
		// if this goblin is within 32 of robinhood, robinhood gets hurt unless goblin is a coin
		if(
			Math.abs((this.x - robinHood.x)) < 32
			&& Math.abs(this.y - robinHood.y) < 32
		){

			// don't need the above code bedaduse you catch robinhood if you get close to him
			//generate new location if you hit him
		//robin hoood got hit
			this.x = Math.random() * 440 + 40; 
			this.y = Math.random() * 400 + 20; 
			robinHood.health--;
			document.getElementById("health").innerHTML = robinHood.health; 	
		}
		
	}
	this.getHitByArrow = function() {
		if (
			Math.abs(robinHood.arrowLocation.x - this.x) < 30
		&& Math.abs(robinHood.arrowLocation.y - this.y) < 50
		&& shooting === true
		){
			// if the goblin gets hit by the arrow, it loses health, robinhood stops shooting and teh goblin slows
			this.health -= 1;
			shooting = false;
			robinHood.stopShooting();
			this.changeSpeed();
		}
	}
	//changes the speed of the goblin and changes them to a coin if dead
	this.changeSpeed = function() {
		if (this.health == 300){
			this.speed = .4; 
		}else if(this.health == 100){
			this.speed = .2;
		}else if(this.health == 20){
			this.speed = .05;
		}
		else if (this.health <= 0){
			var golemNumber = this.name.slice(4);
			console.log(golemNumber);

			//change property in thug array to do nothing
			// golemArray[golemNumber] = "do nothing";

			// change image source to nothing and increase gold
			this.image.src = "";
			robinHood.gold += 40;
			document.getElementById("gold-collected").innerHTML = "Gold: " + robinHood.gold;

			//display the amount of gold Collected for 2 seconds
			document.getElementById("textDisplay").style.color = "goldenRod"; 
			document.getElementById("textDisplay").innerHTML = "You collected " + 7 + " gold!";

			// clear the text display after 2 seconds
			displayGold = setInterval(clearDisplay, 2000); //update the counter every second

		}	
	}

}
var displayGold;//need to define out here for global scope 
function clearDisplay(){
	document.getElementById("textDisplay").innerHTML = "&nbsp";
	// var counterInterval = setInterval(updateCounter, 1000); //update the counter every second
	clearInterval(displayGold);
	//change it back to red for game over after display
	document.getElementById("textDisplay").style.color = "red"; 




}




// Update function

//check

//figure out what you need to update constantly and then place it in the draw function
function update(){
	robinHood.move(keysPressed);
	robinHood.shoot(keysPressed);
	robinHood.arrowFollow();
	checkGameStatus(robinHood.health);

	//create golem
	golem0.move();
	golem0.catchRobinHood();
	golem0.getHitByArrow();

	// a for loop that goes through all necessary updates for all goblins
	for (var i = 0; i < goblinArray.length; i++) {
		if(goblinArray[i] === "do nothing"){
		
		}else{
			goblinArray[i].move();
			goblinArray[i].getHitByArrow();
		}
		
	}
	//a for loop that goes through all necessary updates for all thugs
	for (var i = 0; i < thugArray.length; i++) {

		if (thugArray[i] === "do nothing"){
			
		}else{
			thugArray[i].move();
			thugArray[i].getHitByArrow();
		}
	}

}

var gameOn = true;
//end game if player has 0 or less health
function checkGameStatus(health){
	if(health <= 0){
		gameOn = false;
		document.getElementById("textDisplay").innerHTML = "GAME OVER";
	}
}

//program counterintervals
var counterInterval = setInterval(updateCounter, 1000); //update the counter every second
var goblinInterval = setInterval(generateGoblinNumber, 5000);
var thugInterval = setInterval(generateThugNumber, 7000);

var gameStartTime = Date.now(); //find out when the user started the game
var score = 0;

function updateCounter(){
	//will need to add this player functionality
	score++; 
	document.getElementById("scoreKeeper").innerHTML = "Score: " + score;
	
}

//create robinhood - create an image object and send it through to the constructore

var robinHood = new Hero("Robin Hood","possible-enemies-allies/archer3.png", 1);


//create goblins
var goblin0 = new Goblin("goblin0");
var goblin1 = new Goblin("goblin1");

//create a golem
var golem0 = new Golem("golem0");

var firstGoblinGeneratedNumber = 2;
function generateGoblinNumber(){

	var newGoblin = "goblin"+firstGoblinGeneratedNumber;
	firstGoblinGeneratedNumber++;
	generateGoblin(newGoblin);
	// var "goblin"+firstGoblinGeneratedNumber = new Goblin("newGoblin");
	// firstGoblinGeneratedNumber++;
}

function generateGoblin(newGoblin){
	var newGoblin = new Goblin(newGoblin);
	goblinArray.push(newGoblin);
}

// create a goblin array
var goblinArray = [];
goblinArray.push(goblin0,goblin1);

//create some thugs
var thugArray = []; 
var thug0 = new Thug("thug0");
thugArray.push(thug0);
var firstThugGeneratedNumber = 1;

function generateThugNumber(){
	var newThug = "thug"+firstThugGeneratedNumber;
	firstThugGeneratedNumber++;
	generateThug(newThug);
}

function generateThug(newThug){
	var newThug = new Thug(newThug);
	thugArray.push(newThug);
	
}








//can access his name with robinHood.name


// need to draw the image constantly

function draw(){
	if(gameOn){
		update();
	}else{
		clearInterval(counterInterval);
	}

	context.drawImage(golem0.image, golem0.x, golem0.y);
	context.drawImage(backgroundImage, 0, 0);
	context.drawImage(robinHood.image, robinHood.x, robinHood.y);
	context.drawImage(robinHood.arrowImage, robinHood.arrowLocation.x, robinHood.arrowLocation.y);
	//a for loop that draws and moves all the goblins in the arrray
	for (var i = 0; i < goblinArray.length; i++) {

		if (goblinArray[i] === "do nothing") {

		}else{
		context.drawImage(goblinArray[i].image, goblinArray[i].x, goblinArray[i].y);
		}
	}
	// Draw the thug on the page
	context.drawImage(thug0.image, thug0.x, thug0.y);
	
	requestAnimationFrame(draw);

	for (var i = 0; i < thugArray.length; i++) {

		if (thugArray[i] === "do nothing"){
			//do nothing
			
		}else{
		context.drawImage(thugArray[i].image, thugArray[i].x, thugArray[i].y);
		}
	}

}

	

draw();