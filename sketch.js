//Create variables here
var dog, happyDog, database, foodS, foodStock;
var dogImg1;

var readState, changeState;
var bedroomImg, bathroomImg, gardenImg;

var feed;
var addFood

var gameState=readState; 

var play,bath,sleep,playGround,playImg;

var fedTime;
var lasFeed;

var foodObj;

function preload() {

  //load images here
  dogImg1 = loadImage("images/dogImg.png");
  happyDog = loadImage("images/dogImg1.png");
  gardenImg = loadImage("images/Garden.png");
  bathroomImg = loadImage("images/Wash Room.png");
  bedroomImg = loadImage("images/Bed Room.png");
  playImg = loadImage("images/Living Room.png");
}

function setup() {
  database = firebase.database();

  foodStock = database.ref('Food');
  foodStock.on("value", readStock);

  //reading gameState from database
  readState = database.ref("gameState");
  readState.on("value", function (data) {
    gameState = data.val();
  });

  createCanvas(800, 700);
  dog = createSprite(600, 400, 50, 50);
  dog.addImage(dogImg1);
  dog.scale = 0.2;

  foodObj = new Food();
  //creating buttons for adding and feeding food to the pet
  feed = createButton("Feed The Dog");
  play =createButton(" Lets Play! ");
  bath =createButton("I Want To Take Bath");
  sleep =createButton("I Am Very Sleepy");
  playGround =createButton("Lets Play In Ground");


  feed.position(380, 95);
  play.position(575, 95);
  bath.position(660, 95);
  sleep.position(800, 95);
  playGround.position(930, 95);

  feed.mousePressed(feedDog);
  play.mousePressed(Play);
  bath.mousePressed(Bath);
  sleep.mousePressed(Sleep);
  playGround.mousePressed(PlayGround);



  addFood = createButton("Add Food");
  addFood.position(490, 95);
  addFood.mousePressed(addFoods);


}


function draw() {
  background(46, 139, 87)
  //foodObj.display();
  //add styles here
 
  // read foodStock from firebase
  fedTime = database.ref('FeedTime');
  fedTime.on('value', function (data) {
    lasFeed = data.val();
  })

   // condition for gameState
  currentTime=hour();
  if(gameState == "playingInGround"){
        foodObj.garden();
  }else if(gameState == "sleeping"){
       foodObj.bedroom();
  }else if(gameState == "bathing"){
        foodObj.washroom();
  }else{
    update("hungry");
    foodObj.display();
    dog.addImage(happyDog);
  }

  if (gameState !=="hungry") {
    feed.hide();
    addFood.hide();
    dog.remove();
  } else {
    feed.show();
    addFood.show();
    dog.addImage(happyDog);
  }



  drawSprites();
  fill(255, 255, 254);
  textSize(15);
  if (lasFeed >= 12) {
    text("Last Feed : " + lasFeed % 12 + " PM", 350, 30);
  } else {
    if (lasFeed == 0) {
      text("Last Feed : 12 AM", 350, 30);
    } else {
      text("Last Feed : " + lasFeed + " AM", 350, 30);
    }
  }

}

function readStock(data) {
  foodS = data.val()
  foodObj.updateFoodStock(foodS);
}

function addFoods() {
  foodS += 1;
  database.ref('/').update({
    Food: foodS
  })
}

function feedDog() {
  dog.addImage(happyDog);

  //updating lastFeed and fedTime
  foodObj.updateFoodStock(foodObj.getFoodStock() - 1);
  database.ref('/').update({
    Food: foodObj.getFoodStock(),
    FeedTime: hour()
  })
}

//  updating gameState in database
function update(state) {
  database.ref('/').update({
    gameState: state
  });
}

function Play (){
  update("hungry");
  dog.addImage(happyDog);
}

function Bath (){
  update("bathing")
}

function Sleep (){
  update("sleeping")
}

function PlayGround (){
  update("playingInGround")
}


