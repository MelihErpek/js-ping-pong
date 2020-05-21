const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
let keyState = [];
let offset;
let playerScore = 0,aiScore = 0;
let pi = Math.PI;
const upArrow = 38 , downArrow = 40, Width = 700, Height = 600 ;
const Player = {
  x : null,
  y : null ,
  width : 20,
  height : 100,
  draw : function() {     
    ctx.fillRect(this.x,this.y,this.width,this.height);
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText("Player Score",120,20);
    ctx.fillText(playerScore,170,40);
  } , 
  update : function() {
      if(keyState[upArrow])
      {
        this.y -= 7;
      }
      if(keyState[downArrow])
      {
        this.y += 7;
      }

  }
}
const AI = {
  x : null,
  y : null ,
  width : 20,
  height : 100,
  draw : function() {
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText("AI Score",440,20);
    ctx.fillText(aiScore,470,40);
    ctx.fillRect(this.x,this.y,this.width,this.height);
  } , 
  update : function(){
    let aiPosition = Ball.y - (this.height-Ball.side)*0.5;
    this.y += (aiPosition - this.y)*0.4;  
  }
}
const Ball = {
  x : null,
  y : null ,
  side : 20,
  velocity : null ,
  speed : 15,
  draw : function() {
    
    ctx.fillRect(this.x,this.y,this.side,this.side);
  } , 
  update : function() {
      this.x += this.velocity.x;
      this.y += this.velocity.y;
      if(this.y < 0 || this.y + this.side > Height) // ONEMLİ
      {
        if(this.velocity.y < 0 )
        {
          offset = 0 - this.y;
        }
        else
        {
          offset = Height - (this.y+this.side);
        }
        this.y += 2*offset;
        this.velocity.y *= -1;
      }
      const intersect = (ax,ay,aw,ah,bx,by,bw,bh) => // carpisma ani
      {
        if( ax<bx+bw && ay < by+bh && bx < ax+aw && by < ay+ah )
        {
          return true;
        }
        else {return false;}
      }
      let whichSide;
      if(this.velocity.x < 0) 
      {
        whichSide = Player;
      }
      else {whichSide=AI;}
      if(intersect(whichSide.x,whichSide.y,whichSide.width,whichSide.height,this.x,this.y,this.side,this.side))
      { 
        if(whichSide === Player)
        {
          this.x = Player.x+Player.width ;
        }
        else
        {
          this.x = AI.x - this.side;
        }
        let n = (this.y+this.side - whichSide.y)/(whichSide.height+this.side);
        let phi = 0.25*pi*(2*n-1); // pi/4 45 dereceye esit
        if(whichSide===Player)
        {
          this.velocity.x =  this.speed*Math.cos(phi);
        }
        else
        {
          this.velocity.x =  -(this.speed*Math.cos(phi));
        }
        this.velocity.y = this.speed*Math.sin(phi);
      }
      if(0 > this.x+this.side )
      {
        Ball.x = (700-Ball.side)/2;
        Ball.y = (600-Ball.side)/2;
        aiScore++;
        console.log("Ai:"+aiScore+"Player:"+playerScore);
        Ball.velocity = {
        x : -(Ball.speed),
        y : 0
        }
      }
      if(this.x > Width)
      {
        Ball.x = (700-Ball.side)/2;
        Ball.y = (600-Ball.side)/2;
        playerScore++;
        console.log("Ai:"+aiScore+"Player:"+playerScore);
        Ball.velocity = {
        x : Ball.speed,
        y : 0
        }
      }
    }
}
const main =  () => {
  init();
  document.addEventListener("keydown",function(evt){
    keyState[evt.keyCode] = true; // tuşa basıldığında diziye atıyor
  });
  document.addEventListener("keyup",function(evt){
    delete keyState[evt.keyCode]; // tuştan kaldırılınca siliniyor.
  })

  const loop = () => {
    update();
    draw();
    window.requestAnimationFrame(loop,canvas);
  }
  window.requestAnimationFrame(loop,canvas);
}
const init =  () => {
  
  
  Player.x = Player.width;
  Player.y = (600-Player.height)/2;

  AI.x = 700 - (Player.width+AI.width);
  AI.y = (600 - AI.height)/2;

  Ball.x = (700-Ball.side)/2;
  Ball.y = (600-Ball.side)/2;

  Ball.velocity = {
    x : Ball.speed,
    y : 0
  }
  
  
}
const update =  () => {
  Player.update();
  Ball.update();
  AI.update();
}
const draw =  () => {
  ctx.fillRect(0,0,700,600);
  ctx.save(); // 	Saves the state of the current context
  ctx.fillStyle = "#fff";
  Player.draw();
  Ball.draw();
  AI.draw();
  ctx.restore(); // Returns previously saved path state and attributes
  
}
main();