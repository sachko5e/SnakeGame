/*
JavaScript Snake Game.

Demo version.
Tested in Google Chrome Version 64.0.3282.167 (Official Build) (64-bit).
It will not work in IE version before IE9 - not supporting setTimeout with third parameter.
Features from ES6  that are not supported in most of the major browsers are not used because I am not using polyfill - like "fat arrow", "destructuring", "spread".

Rules supported:
1. Move the snake by using the Arrow keyboard keys.
2. If the head hits the wall - the snake is dead - alert will appear - after click on OK - the game will reload.
3. When the head hits the food - it will eat the food and increase by one size of the head of the snake.
4. The snake simulates twisting the tail.
5. The snake is allowed to cross it's tail.

*/

//Enclosed in a function to make the name space private
(function() {
  //Initialize - it could be separated into a config module, not done for simplicity

  //Constants - not to be redifined or changed after Initialization
  const snClass = 'snBlock'; //css class for the snake
  const snFoodClass = 'snFoodClass'; //css class for the food
  const root = document.getElementById('root'); //the root div in the html file
  const snakeSize = 25; // defines the snake head size
  const boxMaxY = 500; // defines how big is the game board
  const boxMaxX = boxMaxY; // for simplicity box should always be square
  const foodSize = snakeSize; // the size of the food is the same as the snake head
  const endGame = function(score, message) {
    var defaultMessage = 'Snake is dead! Your score is :';
    if(message) {
      defaultMessage = message;
    }
    alert(defaultMessage + score); //change the end game message here
    location.reload();
  }
  const boxMinY = 0; //for simplicity as dev version numbers diferent then 0 are not yet supported
  const boxMinX = 0; //for simplicity as dev version numbers diferent then 0 are not yet supported
  const snakeSpeed = 200; // smaller numbers makes the speed higher
  const arrKeyNumbers = { // Tested in Chrome and IE 11
    39: 'ArrowRight',
    37: 'ArrowLeft',
    38: 'ArrowUp',
    40: 'ArrowDown'
  }
  const snakeTailCrossMin = 2;
  const crossTailTolerance = 2;

  //Variables that may change during the game
  var foodY = boxMaxY / 2 - (foodSize / 2); //place the food initialy in the middle of the game board
  var foodX = boxMaxX / 2 - (foodSize / 2); //place the food initialy in the middle of the game board
  var currentInt = []; //used to keep the Id of the setInterval
  var currentY = boxMinY; // start with the head of the snake in the top left corner
  var currentX = boxMinX; // start with the head of the snake in the top left corner

  //Helper function to get random numbers in particular range - used to move the food to a new place
  function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  //Set the DOM game box size
  root.style.height = (boxMaxY + snakeSize) + 'px';
  root.style.width = (boxMaxX + snakeSize) + 'px';
  root.style.left = (boxMinY) + 'px';
  root.style.top = (boxMinX) + 'px';

  //Create Snake DOM element
  function createSnElement() {
    var sn = document.createElement("div");
    sn.id = 'sn';
    sn.innerHTML = 'snake';
    sn.className = snClass;
    sn.style.height = snakeSize + 'px';
    sn.style.width = snakeSize + 'px';
    return sn;
  }
  var elem = createSnElement();

  //Create Food DOM element
  function createSnFood() {
    var f = document.createElement("div");
    f.id = 'snFood';
    f.innerHTML = 'food';
    f.className = snFoodClass;
    f.style.height = foodSize + 'px';
    f.style.width = foodSize + 'px';
    f.style.left = foodY + 'px';
    f.style.top = foodX + 'px';
    return f;
  }
  var food = createSnFood();

  //Move the food after it has been eaten to a new random place
  //It may need a check so not to be placed under the snake current position - this check is not implemented but this also could be permitted
  function moveFood() {
    foodX = getRandomInt(boxMaxX - foodSize);;
    foodY = getRandomInt(boxMaxY - foodSize);;
    food.style.left = foodX + 'px';
    food.style.top = foodY + 'px';
  }


  //Snake Tail functions
  var tail = [];
  var tailCount = 0;

  //Occures after food has been eaten
  var eatFood = function(snX, snY, fdX, fdY) {
    if((snX + snakeSize >= fdX && snX <= fdX + snakeSize) && (snY + snakeSize >= fdY && snY <= fdY + snakeSize)) { // test if the snake head touches the food
      tail.push(createSnElement());
      tail[tailCount].style.left = snX;
      tail[tailCount].style.top = snY;
      tail[tailCount].innerHTML = '';
      root.appendChild(tail[tailCount]);
      tailCount++;
      moveFood();
      return true;
    } else {
      return false;
    }
  }


  //Check if snake cross it's own tail
  var crossTail = function(currentX, currentY) {
    for(let j = snakeTailCrossMin; j < tail.length; j++) { // tail can be croossed only if you have at least 4 boxes
      var boxX = parseInt(tail[j].style.left.replace('px', ''));
      var boxY = parseInt(tail[j].style.top.replace('px', ''));
      var cX = currentX - snakeTailCrossMin; // small tollerance
      var cY = currentY - snakeTailCrossMin;
      if((cX + snakeSize >= boxX && cX <= boxX + snakeSize) && (cY + snakeSize >= boxY && cY <= boxY + snakeSize)) {
        endGame(tail.length, 'You cross your tail, snake is dead! Your Score is: ');
      }
    }

  }

  //Move the tails boxes separatly from the head so it will look like it is twisting
  var moveTail = function(newX, newY, direction) {
    var nextX = 0;
    var nextY = 0;
    var arrX = [];
    var arrY = [];



    //Let remember the current postions of the tailboxes
    for(let j = 0; j < tail.length; j++) {
      arrX[j] = tail[j].style.left;
      arrY[j] = tail[j].style.top;
    }


    function setXY(i) {
      if(direction == 'ArrowRight') {
        nextX = newX - (snakeSize * (i + 1));
        nextY = newY;
      }
      if(direction == 'ArrowLeft') {
        nextX = newX + (snakeSize * (i + 1));
        nextY = newY;
      }
      if(direction == 'ArrowDown') {
        nextX = newX;
        nextY = newY - (snakeSize * (i + 1));
      }
      if(direction == 'ArrowUp') {
        nextX = newX;
        nextY = newY + (snakeSize * (i + 1));
      }

      if(i == 0) {
        tail[i].style.left = nextX;
        tail[i].style.top = nextY;
      } else {
        tail[i].style.left = arrX[i - 1];
        tail[i].style.top = arrY[i - 1];
      }
    }

    //Executing the box moving with a little delay to simulate the twisting of the snake
    for(let i = 0; i < tail.length; i++) {
      setTimeout(setXY, 30, i); //sending parameters after the time delay is supported in IE9 and higher
    }

  }


  //Main function to start the game and listen for pressed keys
  function startGame(e) {

    var keyNumber = e.keyCode || e.which;
    var keyNum = arrKeyNumbers[keyNumber];

    //Filter out any other key then arrows
    if(keyNum != 'ArrowRight' && keyNum != 'ArrowUp' && keyNum != 'ArrowDown' && keyNum != 'ArrowLeft') {
      return;
    }

    //Clear all intervalls - remove ability to move diagonaly
    function clearInt() {
      for(var i = 0; i < currentInt.length; i++) {
        window.clearInterval(currentInt[i]);
      }
    }
    //Start new Interval
    clearInt();
    currentInt.push(setInterval(moveSnake, snakeSpeed));

    //Move the snake
    function moveSnake() {
      var welcomeElm = document.getElementById("help");
      if(welcomeElm) {
        root.removeChild(welcomeElm);
      }

      //Check if snake croos it's own tail
      crossTail(currentX, currentY);
      //Check if we eat food
      let foodGulp = eatFood(currentX, currentY, foodX, foodY);

      var currentScore = tail.length;

      //Move the snake according to key pressed
      if(keyNum == 'ArrowRight') {
        if(currentX >= boxMaxX) {
          clearInt();
          endGame(currentScore);
        } else {
          currentX = currentX + snakeSize;
          elem.style.left = currentX + 'px';
          moveTail(currentX, currentY, keyNum);

        }
      }
      if(keyNum == 'ArrowLeft') {
        if(currentX <= 0) {
          clearInt();
          endGame(currentScore);
        } else {
          currentX = currentX - snakeSize;
          elem.style.left = currentX + 'px';
          moveTail(currentX, currentY, keyNum);
        }
      }
      if(keyNum == 'ArrowDown') {
        if(currentY >= boxMaxY) {
          clearInt();
          endGame(currentScore);
        } else {
          currentY = currentY + snakeSize;
          elem.style.top = currentY + 'px';
          moveTail(currentX, currentY, keyNum);
        }
      }
      if(keyNum == 'ArrowUp') {
        if(currentY <= 0) {
          clearInt();
          endGame(currentScore);
        } else {
          currentY = currentY - snakeSize;
          elem.style.top = currentY + 'px';
          moveTail(currentX, currentY, keyNum);
        }
      }

    }
  }

  //Append the snake to the root div before the welcome message
  root.insertAdjacentElement('afterbegin', elem);
  root.appendChild(food);
  root.focus();
  //Add key pressed listener
  document.addEventListener('keydown', startGame, false);

})();
