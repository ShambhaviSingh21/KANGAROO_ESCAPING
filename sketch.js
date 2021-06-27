var PLAY = 1;
var END = 0;
var gameState = PLAY;

var kangaroo, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;

var cactus1,cactus2,cactus3,cactus4,cactus5;

var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound

function preload(){
  trex_running = loadImage("kangaroo2.png");
  trex_collided = loadImage("kangaroo2.png");
  
   groundImage = loadImage("ground2.png");
 
  cloudImage = loadImage("cloud.png");
  
   cactus1 = loadImage("cactus4.png");
  cactus2 = loadImage("cactus6.png");
 cactus3 = loadImage("cactus8.png");
  cactus4 = loadImage("cactus1.png");
  cactus5 = loadImage("cactus3.png");
  
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameover.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(600, 200);
  
kangaroo = createSprite(50,180,20,50);
  
  kangaroo.addImage("running", trex_running);
  kangaroo.addImage("collided", trex_collided);
  kangaroo.scale = 0.3;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
 // ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.2;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  
  kangaroo.setCollider("rectangle",0,0,kangaroo.width,kangaroo.height);
  kangaroo.debug = true
  
  score = 0;
  
}

function draw() {
  
  background(255);
  //displaying score
  text("Score: "+ score, 500,50);
  
  
  if(gameState === PLAY){
    //move the 
    gameOver.visible = false;
    restart.visible = false;
    //change the trex animation
      kangaroo.changeImage("running", trex_running);
    
    ground.velocityX = -(6 + 3* score/1000)
    //scoring
    score = score + Math.round(frameCount/60);
    
    if(score>0 && score%1000 === 0){
       checkPointSound.play() 
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& kangaroo.y >= 100) {
        kangaroo.velocityY = -12;
        jumpSound.play();
    }
    
    //add gravity
   kangaroo.velocityY = kangaroo.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(kangaroo)){
        //trex.velocityY = -12;
        jumpSound.play();
        gameState = END;
        dieSound.play()
      
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     //change the trex animation
     kangaroo.changeImage("collided", trex_collided);
       
       obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);    
     
      ground.velocityX = 0;
      kangaroo.velocityY = 0
      
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);    
   }
  
   if(mousePressedOver(restart)) {
      reset();
    }
 
  //stop kangaroo from falling down
  kangaroo.collide(invisibleGround);
  

  drawSprites();
}




function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(600,165,10,40);
   obstacle.velocityX = -(6 + score/100);
   
    //generate random obstacles
    var rand = Math.round(random(1,5));
    switch(rand) {
      case 1: obstacle.addImage(cactus1);
              break;
      case 2: obstacle.addImage(cactus2);
              break;
      case 3: obstacle.addImage(cactus3);
              break;
      case 4: obstacle.addImage(cactus4);
              break;
      case 5: obstacle.addImage(cactus5);
        break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.3;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
 if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.2;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = kangaroo.depth;
    kangaroo.depth = kangaroo.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  kangaroo.changeImage("running",trex_running);
  
  score = 0;
  
}

