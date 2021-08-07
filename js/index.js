const canvas = document.querySelector('#canvas');
const context = canvas.getContext('2d');

const roadImg = new Image();
roadImg.src = './images/road.png';

// ######################################
// ## Iteration 1: Draw the game board ##
// ######################################

window.onload = () => {
  document.getElementById('start-button').onclick = () => {
    startGame();
  };

  function startGame() {
    context.drawImage(roadImg, 0, 0, canvas.width, canvas.height);
  }
};
