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

// ----------------------------------------------------------
// ----------------Administrative Section, Instructions------
// ----------------------------------------------------------






var score = 0;
counterInterval = setInterval(updateCounter, 1000);

function updateCounter(){
	
	score++; 

	document.getElementById("scoreKeeper").innerHTML = "Score: " + score;
	
}


var highScore = localStorage.getItem("highScore");
document.getElementById("highScoreKeeper").innerHTML = "High Score: "+ highScore;
//get the highsore
function checkIfHighScore(){
	// convert highScore into a number because it is currently a string
	highScore = Number(highScore);
	if (score > highScore){
		highScore = score; 
		document.getElementById("highScoreKeeper").innerHTML = "High Score: "+ highScore;
		localStorage.setItem("highScore", highScore);
	}else{
		document.getElementById("highScoreKeeper").innerHTML = "High Score: "+ highScore;
	}
}


var gameOn = true;

monsterIntervalManager(false);

function monsterIntervalManager(clearMe){
	// clear Intervals if clearMe is true, otherwise don't
	
	if(clearMe){
		clearInterval(goblinInterval);
		clearInterval(thugInterval);
		clearInterval(golemInterval);
	}else{		
		goblinInterval = setInterval(generateGoblinNumber, 5000);
		thugInterval = setInterval(generateThugNumber, 7000);
		golemInterval = setInterval(generateGolemNumber, 35000);
	}
}

function startGame(){
	
	//set hero's health to 20  when the game starts
	// refresh teh page to start a new game
	location.reload();	
}



function pauseGame(){
	gameOn = false;
	monsterIntervalManager(true);
}

function resumeGame(){
	gameOn = true;
	counterInterval = setInterval(updateCounter, 1000); //update the counter every second
	monsterIntervalManager(false);
	// var goblinInterval = setInterval(generateGoblinNumber, 5000);
	// var golemInterval = setInterval(generateGolemNumber, 35000);
	// var thugInterval = setInterval(generateThugNumber, 7000);
}

function openShop(){
	// pause ggame so it's not running in the background
	gameOn = false;
	monsterIntervalManager(false);

}

function clearMonsterIntervals(){

}

// CREATE EVENT LISTENERS

var keysPressed = []; //array that holds whats in the array
var displayGold;//need to define out here for global scope 

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
		// stop robinhood from shooting and return the arrow to teh character
		shooting = false;
		this.arrowFollow();		
	}
	
}	

// ----------------------------------------------------------
// ------------MONSTER AND ALLY CONSTRUCTORS BELOW-----------
// ----------------------------------------------------------



function Goblin(name){
	this.name = name; 
	this.health = 3;
	this.image = new Image();
	this.image.src = "possible-enemies-allies/royalty goblin.png"
	this.speed = 1; 
	this.x = Math.random() * 440 + 40; ;
	this.y = Math.random() * 400 + 20;
	this.destinationX = Math.random() * 440 + 40; 
	this.destinationY = Math.random() * 400 + 20; 
	this.move = function(){
		if (Math.abs(this.x - this.destinationX) < 32) {
			this.destinationX = Math.random() * 440 + 40; 
		}else if(this.x < this.destinationX){
			this.x += 2.94 * this.speed;
			this.image.src = "possible-enemies-allies/royalty-goblin-right.png";
		}else{
			this.x -= 2.94 * this.speed;
			this.image.src = "possible-enemies-allies/royalty goblin-left.png";
		}
		
		if (Math.abs(this.y - this.destinationY) < 32) {
			this.destinationY = Math.random() * 400 + 20; 
		}else if(this.y > this.destinationY){
			this.y -= 2.94 * this.speed;
		}else{
			this.y += 2.94 * this.speed;
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
	this.x = this.x = Math.random() * 440 + 40; 
	this.y = this.y = Math.random() * 400 + 20; 
	this.move = function(){
		if (Math.abs(this.x - robinHood.x) < 32) {
			this.catchRobinHood();
		}else if(this.x < robinHood.x){
			this.x += 2 * this.speed;
			this.image.src = "possible-enemies-allies/thug.png";
		}else{
			this.x -= 2 * this.speed;
			this.image.src = "possible-enemies-allies/thug-left.png";
		}
		
		if (Math.abs(this.y - robinHood.y) < 32) {
			this.catchRobinHood();
		}else if(this.y > robinHood.y){
			this.y -= 2 * this.speed;			

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
	this.health = 90;
	this.image = new Image();
	this.image.src = "possible-enemies-allies/golem1.png";
	this.speed = 1; 
	this.x = 300;
	this.y = 200;
	this.move = function(){
		if (Math.abs(this.x - robinHood.x) < 32) {
			this.catchRobinHood();
		}else if(this.x < robinHood.x){
			this.x += 1.3 * this.speed;	
			this.image.src="possible-enemies-allies/golem1.png";			
		}else{
			this.x -= 1.3 * this.speed;
			this.image.src="possible-enemies-allies/golem-face-left.png";			
		}
		
		if (Math.abs(this.y - robinHood.y) < 32) {
			this.catchRobinHood();
		}else if(this.y > robinHood.y){
			this.y -= 1.3 * this.speed;			
		}else{
			this.y += 1.3 * this.speed;
		}
	}

	this.catchRobinHood = function() {
		// if this goblin is within 32 of robinhood, robinhood gets hurt unless goblin is a coin
		if(
			Math.abs((this.x - robinHood.x)) < 32
			&& Math.abs(this.y - robinHood.y) < 32
		){

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
		&& Math.abs(robinHood.arrowLocation.y - this.y) < 70
		&& shooting === true
		){
			// if the goblin gets hit by the arrow, it loses health, robinhood stops shooting and teh goblin slows
			this.health -= 1;
			shooting = false;
			robinHood.stopShooting();
			this.changeSpeed();
		}
	}
	//changes the speed of the goblin and adds gold if dead
	this.changeSpeed = function() {
		if (this.health == 50){
			this.speed = .4; 
		}else if(this.health == 20){
			this.speed = .2;
		}else if(this.health == 5){
			this.speed = .05;
		}
		else if (this.health <= 0){
			var golemNumber = this.name.slice(4);
			console.log(golemNumber);

			//change property in thug array to do nothing
			golemArray[golemNumber] = "do nothing";

			// change image source to nothing and increase gold
			this.image.src = "";
			robinHood.gold += 40;
			document.getElementById("gold-collected").innerHTML = "Gold: " + robinHood.gold;

			//display the amount of gold Collected for 2 seconds
			document.getElementById("textDisplay").style.color = "goldenRod"; 
			document.getElementById("textDisplay").innerHTML = "You collected " + 40 + " gold!";

			// clear the text display after 2 seconds
			displayGold = setInterval(clearDisplay, 3000); //update the counter every second

		}	
	}

}

// NINJA CONSTRUCTOR!!! 
function Ninja(name){
	this.name = name;
	this.image = new Image(); 
	this.image.src = "possible-enemies-allies/ninja2.png";
	this.ninjaStarImage = new Image(); 
	this.ninjaStarImage.src = "possible-enemies-allies/ninja-star.png"
	this.ninjaStarLocation = {
		x: 329, 
		y: 229,
		destinationX: 0,
		destinationY: 0
	}

	this.speed = 1; 
	this.x = 300; 
	this.y = 200;
	this.destinationX = Math.random() * 440 + 40;
	this.destinationY = Math.random() * 400 + 20;
	this.faceLeft = false;
	this.throwing = false;

	this.move = function(){
		if (Math.abs(this.x - this.destinationX) < 32) {
			this.destinationX = Math.random() * 440 + 40; 
		}else if(this.x < this.destinationX){
			this.x += 2.00 * this.speed;
			this.image.src = "possible-enemies-allies/ninja2.png";
			this.faceLeft = false;
		}else{
			this.x -= 2.00 * this.speed;
			this.image.src = "possible-enemies-allies/ninja2-left.png";
			this.faceLeft = true;
		}
		
		if (Math.abs(this.y - this.destinationY) < 32) {
			this.destinationY = Math.random() * 400 + 20; 
			this.ninjaStarThrow();
		}else if(this.y > this.destinationY){
			this.y -= 2.00 * this.speed;
		}else{
			this.y += 2.00 * this.speed;
		}
	}

	//ninja star should follow the ninja as long as he is not shooting 
	this.ninjaStarFollow = function(){		
		if (!this.throwing){
			if(this.faceLeft){
				this.ninjaStarLocation.x = this.x + 29;
				this.ninjaStarLocation.y = this.y + 29;
				
			}else if(!this.faceLeft){
				this.ninjaStarLocation.x = this.x + 18;
				this.ninjaStarLocation.y = this.y + 29;
				
			}
		}
	
	}

	this.ninjaStarThrow = function(){
		// when this is called throw star
		this.throwing = true;
		// if he is facing left throw left
		if (this.x > 300){
			// throw left and turn left
			// this.ninjaStarLocation.destinationX = this.ninjaStarLocation.x - 400; 
			this.image.src = "possible-enemies-allies/ninja2-left.png";
		}else if(this.x < 301){
			// throw right and turn right
			this.image.src = "possible-enemies-allies/ninja2.png";
			// this.ninjaStarLocation.destinationX = this.ninjaStarLocation.x + 400;
		}

		//make star move

		// if the ninjaStar is within 10 pixels of its destination stop it
		// if(Math.abs(this.ninjaStarLocation.x - this.ninjaStarLocation.destinationX) < 10){
		// 	this.stopThrowing();
		// }else{
		// 	//if the ninjaStar is not within 10 pixels of its destination, keep it going
		// 	if(this.ninjaStarLocation.x < this.ninjaStarLocation.destinationX && this.throwing == true){
				
		// 		setInterval(this.ninjaStarLocation.x += 10, 300);
				
			

		// 	}else if(this.ninjaStarLocation.x > this.ninjaStarLocation.destinationX && this.throwing == true){
					
		// 	}								
		// }
	}
	this.stopThrowing = function() {
		this.throwing = false;
		this.ninjaStarFollow();
	}
}

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


// ----------------------------------------------------------
// ----create Heros, Monsters and Allies below---------------
// ----------------------------------------------------------



//create robinhood - create an image object and send it through to the constructore




// ----------------------GOBLINS-----------------------------
var goblinInterval, thugInterval, golemInterval;



// var goblinInterval = setInterval(generateGoblinNumber, 5000);

	


var goblin0 = new Goblin("goblin0");
var goblin1 = new Goblin("goblin1");



var goblinNumber = 2;
function generateGoblinNumber(){

	//create a goblin with a number at the end - first one generated will be goblin2
	var newGoblin = "goblin" + goblinNumber;
	//add 1 to the goblin number so that the next goblin generated will be goblin 
	goblinNumber++;
	// send the newGoblin to the goblin GEnerator
	generateGoblin(newGoblin);
}

function generateGoblin(newGoblin){
	var newGoblin = new Goblin(newGoblin);
	goblinArray.push(newGoblin);
}

// create a goblin array
var goblinArray = [];
goblinArray.push(goblin0,goblin1);

// ----------------------THUGS-----------------------------
// var thugInterval = setInterval(generateThugNumber, 7000);


var thugArray = []; 
var thug0 = new Thug("thug0");
thugArray.push(thug0);
var thugNumber = 1;

function generateThugNumber(){
	var newThug = "thug"+thugNumber;
	thugNumber++;
	generateThug(newThug);
}

function generateThug(newThug){
	var newThug = new Thug(newThug);
	thugArray.push(newThug);
	
}
// ----------------------GOLEMS-----------------------------

// var golemInterval = setInterval(generateGolemNumber, 35000);

//create a golem
// var golem0 = new Golem("golem0");
//empty golemArray and then you push golem0 to the golem array  
var golemArray = []; 
// golemArray.push(golem0);
var golemNumber = 0; 

function generateGolemNumber(){
	var newGolem = "golem" + golemNumber;
	golemNumber++;
	generateGolem(newGolem);
}

function generateGolem(newGolem){
	var golem = new Golem(newGolem);
	console.log(golem);
	golemArray.push(golem);
	
}

// HERO section
var robinHood = new Hero("Robin Hood","possible-enemies-allies/archer3.png", 1);

//let's create a NINJA

var ninja0 = new Ninja("ninja0");
// ----------------------------------------------------------
// ----------------Shop Section here-------------------------
// ----------------------------------------------------------

// get modal
var modalShop = document.getElementById('modal-shop');

// Get the <span> element that closes the modal
var leaveShop = document.getElementsByClassName("close-shop")[0];

// When the user clicks on the button, open the modal 
function openShop() {
    // when the user opens the shop, change the display to block
    modalShop.style.display = "block";
    // pause the game
    pauseGame();	
}

// When the user clicks on <span> (x), close the modal
leaveShop.onclick = function() {
    modalShop.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modalShop) {
        modalShop.style.display = "none";
    }
}

//after the user opens up shop - below is the code for using / purchasing items after 

// create functions that enable and disable purchasing buttons depending on robinhood's gold
function disableButton(buttonString){
	var button = document.getElementById(buttonString);
	button.disabled = true;
}

function enableButton(buttonString){
	var button = document.getElementById(buttonString);
	button.disabled = false;
}

// check to see what robinHood can purchase
function checkPurchasingAbility(){
	if (robinHood.gold < 10){
	disableButton("health-potion-button");	
	}else{
	enableButton("health-potion-button")
	}
}



function drinkHealthPotion(){
	// when user buys and drinks potion, increase health by 3, decrease gold by 50
	robinHood.health += 3; 
	robinHood.gold -= 50; 
	document.getElementById("health").innerHTML = robinHood.health; 	
	document.getElementById("gold-collected").innerHTML = "Gold: " + robinHood.gold;
	checkPurchasingAbility();	
}


	




// ----------------------------------------------------------
// ----------------UPDATE AND DRAW SECTIONS BELOW------------
// ----------------------------------------------------------


function update(){
	robinHood.move(keysPressed);
	robinHood.shoot(keysPressed);
	robinHood.arrowFollow();
	checkGameStatus(robinHood.health);
	checkIfHighScore();


	ninja0.move(); 
	ninja0.ninjaStarFollow();
	// a for loop that goes through all necessary updates for all goblins
	for (var i = 0; i < goblinArray.length; i++) {
		if(goblinArray[i] === "do nothing"){
		
		}else{
			goblinArray[i].move();
			//need to add catch robinhood function for goblins because they move randomly
			goblinArray[i].catchRobinHood();
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

	for (var i = 0; i < golemArray.length; i++) {

		if (golemArray[i] === "do nothing"){
			
		}else{
			golemArray[i].move();
			golemArray[i].getHitByArrow();
		}
	}

}


//end game if player has 0 or less health
function checkGameStatus(health){
	if(health <= 0){
		gameOn = false;
		document.getElementById("textDisplay").innerHTML = "GAME OVER";
		monsterIntervalManager(true);
	}
}
// need to draw the image constantly

function draw(){
	if(gameOn){
		update();
	}else{
		clearInterval(counterInterval);
	}

	
	context.drawImage(backgroundImage, 0, 0);
	// context.drawImage(golem0.image, golem0.x, golem0.y);
	context.drawImage(robinHood.image, robinHood.x, robinHood.y);
	context.drawImage(robinHood.arrowImage, robinHood.arrowLocation.x, robinHood.arrowLocation.y);
	context.drawImage(ninja0.image, ninja0.x, ninja0.y);
	context.drawImage(ninja0.ninjaStarImage, ninja0.ninjaStarLocation.x, ninja0.ninjaStarLocation.y);
	//a for loop that draws and moves all the goblins in the arrray
	for (var i = 0; i < goblinArray.length; i++) {

		if (goblinArray[i] === "do nothing") {

		}else{
			context.drawImage(goblinArray[i].image, goblinArray[i].x, goblinArray[i].y);
		}
	}
	// Draw the thug on the page
	// context.drawImage(thug0.image, thug0.x, thug0.y);
	
	requestAnimationFrame(draw);

	for (var i = 0; i < thugArray.length; i++) {

		if (thugArray[i] === "do nothing"){
			//do nothing
			
		}else{
			context.drawImage(thugArray[i].image, thugArray[i].x, thugArray[i].y);
		}
	}

	for (var i = 0; i < golemArray.length; i++) {

		if (golemArray[i] === "do nothing"){
			//do nothing
			
		}else{
			context.drawImage(golemArray[i].image, golemArray[i].x, golemArray[i].y);
		}
	}

}

	
draw();	



