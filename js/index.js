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
    gameClock();
  }

  function gameClock() {
    // ### Draw and refresh canvas ###
    window.requestAnimationFrame(() => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(roadImg, 0, 0, canvas.width, canvas.height);
      context.drawImage(carImg, this.player.x, canvas.height - 140, 50, 101);
      context.fillStyle = 'darkred';
      this.obstacles.forEach(obstacle => {
        context.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
      });
      gameClock();
      checkBoundaries();
      playerMove();
      obstacleSpawn();
    });
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
    if (Date.now() - this.player.obstacleTimer > 3000) {
      const obstacle = new Obstacle();
      // console.log(obstacle);
      this.obstacles.push(obstacle);
      this.player.obstacleTimer = Date.now();
      // console.log(obstacles);
    }
  }
};

// ### Player class ###
class Player {
  obstacleTimer = Date.now();
  x = (canvas.width / 2) - 27;
}

// ### Obstacle class ###
class Obstacle {
  width = Math.floor(Math.random() * 200 + 150);
  height = 20;
  x = Math.floor(Math.random() * (canvas.width - this.width));
  y = 0;
}
