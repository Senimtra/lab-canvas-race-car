const canvas = document.querySelector('#canvas');
const context = canvas.getContext('2d');

const roadImg = new Image();
roadImg.src = './images/road.png';

const carImg = new Image();
carImg.src = './images/car.png';

// ######################################
// ## Iteration 1: Draw the game board ##
// ######################################

window.onload = () => {
  document.getElementById('start-button').onclick = () => {
    startGame();
  };

  function startGame() {
    context.drawImage(roadImg, 0, 0, canvas.width, canvas.height);

    // ###############################
    // ## Iteration 2: Draw the car ##
    // ###############################

    context.drawImage(carImg, (canvas.width / 2) - 27, canvas.height - 140, 50, 101);
    // ### New player ###
    this.player = new Player();
    this.obstacles = [];
    // ### Controls object ###
    this.controls = {
      ArrowLeft: { pressed: false },
      ArrowRight: { pressed: false },
    }
    window.addEventListener('keydown', (event) => {
      // ### Activate keys in controller object ###
      if (this.controls[event.code]) {
        this.controls[event.code].pressed = true
      }
    });
    window.addEventListener('keyup', (event) => {
      // ### Deactivate keys in controller object ###
      if (this.controls[event.code]) {
        this.controls[event.code].pressed = false;
      }
    });
    displayRefresh();
    gameClock();
  }

  function displayRefresh() {
    // ### Draw and refresh canvas ###
    window.requestAnimationFrame(() => {
      if (this.player.gamePaused === 0) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(roadImg, 0, 0, canvas.width, canvas.height);
        context.drawImage(carImg, this.player.x, canvas.height - 140, 50, 101);
        context.fillStyle = 'darkred';
        this.obstacles.forEach(obstacle => {
          context.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        });
        displayRefresh();
        drawScore();
      }
    });
  }

  function gameClock() {
    // ### Cope with different display refresh rates ###
    window.clockTimer = setInterval(() => {
      runLogic();
    }, 10); // 100 ups
  }

  function runLogic() {
    // ### Run game logic ###
    checkBoundaries();
    playerMove();
    obstacleSpawn();
    moveObstacles();
    collectGarbage();
    checkCollision();
    addScore();
  }

  // ###################################################
  // ## Iteration 3: Make the car move right and left ##
  // ###################################################

  function checkBoundaries() {
    // ### Check for boundaries ###
    if (this.player.x < 0) this.player.x = 0;
    if (this.player.x > canvas.width - 50) this.player.x = canvas.width - 50;
  }

  function playerMove() {
    // ### Move player left/right ###
    if (this.controls['ArrowLeft'].pressed === true) this.player.x -= 3;
    if (this.controls['ArrowRight'].pressed === true) this.player.x += 3;
  }

  // ###################################
  // ## Iteration 4: Create obstacles ##
  // ###################################

  function obstacleSpawn() {
    // ### Spawn obstacles ###
    if (Date.now() - this.player.obstacleTimer > 1500) {
      const obstacle = new Obstacle(Math.floor(Math.random() * 200 + 150));
      this.obstacles.push(obstacle);
      this.player.obstacleTimer = Date.now();
    }
  }

  // #####################################
  // ## Iteration 5: Move the obstacles ##
  // #####################################

  function moveObstacles() {
    // ### Move obstacles ###
    this.obstacles.forEach(obstacle => {
      obstacle.y += 2;
    });
  }

  function collectGarbage() {
    // ### Remove obstacles that left canvas ###
    this.obstacles.forEach((obstacle, index) => {
      if (obstacle.y > canvas.height) this.obstacles.splice(index, 1);
    });
  }

  // #########################################
  // ## Iteration 6: Points, points, points ##
  // #########################################

  function checkCollision() {
    // ### Check for player obstacle collisions ###
    this.obstacles.forEach((obstacle, index) => {
      if (
        // turns true if right side of element is beyond left side of player
        obstacle.x + obstacle.width >= this.player.x &&
        // turns true if left side of element is beyond right side of player
        obstacle.x <= this.player.x + this.player.width &&
        // turns true if top edge of element is above bottom edge of player
        obstacle.y <= this.player.y + this.player.height &&
        // turns true if bottom side of element is beyond top side of player
        obstacle.y + obstacle.height >= this.player.y
      ) gameOver();
    });
  }

  function addScore() {
    // ### Add +1 to player's score every second ###
    if (Date.now() - player.scoreTimer > 1000) {
      player.score++;
      player.scoreTimer = Date.now();
    }
  }

  function drawScore() {
    // ### Draw player's score ###
    context.save();
    context.font = 'bold 30px Arial';
    context.lineWidth = 2;
    context.fillStyle = 'white';
    context.fillText(`Score: ${this.player.score}`, 80, 50);
    context.restore();
  }

  function gameOver() {
    // ### Stop game + display game-over-message ###
    clearInterval(window.clockTimer);
    this.player.gamePaused = 1;
    context.save();
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(roadImg, 0, 0, canvas.width, canvas.height);
    context.fillStyle = 'black';
    context.fillRect(0, 200, canvas.width, 300);
    context.fillStyle = 'darkred';
    context.font = '60px Arial';
    context.textAlign = 'center';
    context.fillText('Game Over!', 250, 300);
    context.fillStyle = 'white';
    context.font = 'bold 50px Arial';
    context.fillText('Your final score', 250, 375);
    context.fillText(this.player.score, 250, 440);
    context.restore();
  }
};

// ### Player class ###
class Player {
  gamePaused = 0;
  obstacleTimer = Date.now();
  scoreTimer = Date.now();
  x = (canvas.width / 2) - 27;
  y = canvas.height - 140
  width = 50;
  height = 101;
  score = 0;
}

// ### Obstacle class ###
class Obstacle {
  constructor(width) {
    this.width = width;
    this.height = 25;
    this.x = Math.floor(Math.random() * (canvas.width - this.width));
    this.y = 0;
  }
}
