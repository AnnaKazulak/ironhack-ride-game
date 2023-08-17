class Player {
  constructor() {
    this.height = 8;
    this.width = 8;
    this.positionX = 50 - this.width / 2;
    this.positionY = 0;
    this.airplaneImg = null;

    this.createAirplane();
  }
  createAirplane() {
    // create an airplane
    this.airplaneImg = document.createElement("img");
    this.airplaneImg.setAttribute("src", "./images/airplane.svg");
    this.airplaneImg.id = "airplane";

    //add styles and position
    this.airplaneImg.style.display = "block";
    this.airplaneImg.style.width = this.width + "vw";
    this.airplaneImg.style.height = this.height + "vh";
    this.airplaneImg.style.left = this.positionX + "vw";
    this.airplaneImg.style.bottom = this.positionY + "vh";
    this.airplaneImg.style.zIndex = "100";

    //append to the dom
    const board = document.getElementById("board");
    board.appendChild(this.airplaneImg);
  }

  moveLeft() {
    this.positionX--;
    this.airplaneImg.style.left = this.positionX + "vw";
  }
  moveRight() {
    this.positionX++;
    this.airplaneImg.style.left = this.positionX + "vw";
  }
  moveDown() {
    this.positionY--;
    this.airplaneImg.style.bottom = this.positionY + "vw";
  }
  moveUp() {
    this.positionY++;
    this.airplaneImg.style.bottom = this.positionY + "vw";
  }
}

class Obstacle {
  constructor(positionX, imageAttribut) {
    this.width = 7;
    this.height = 7;
    this.positionX = positionX;
    this.positionY = 100;

    this.domElement = null;
    this.speedY = 1;

    this.createDomElement(imageAttribut);
  }

  createDomElement(imageAttribut) {
    this.imageAttribut = imageAttribut;

    // create dom element
    this.domElement = document.createElement("img");
    this.domElement.setAttribute("src", imageAttribut);

    // set id
    this.domElement.className = "obstacle";
    this.domElement.style.width = this.width + "vw";
    this.domElement.style.height = this.height + "vh";
    this.domElement.style.left = this.positionX + "vw";
    this.domElement.style.bottom = this.positionY + "vh";
    this.domElement.style.transform = "scaleX(-1)";
    if (this.positionX > 50) {
      this.domElement.style.transform = "scaleX(1)";
    }

    //append to the dom
    const parentElm = document.getElementById("board");
    parentElm.appendChild(this.domElement);
  }
  moveDown() {
    this.positionY -= this.speedY;
    this.domElement.style.bottom = this.positionY + "vh";
  }
  moveLeft() {
    this.positionX--;
    this.domElement.style.left = this.positionX + "vw";
  }
  moveRight() {
    this.positionX++;
    this.domElement.style.left = this.positionX + "vw";
  }
}

class Bullet {
  constructor(positionX, positionY) {
    this.width = 0.2;
    this.height = 2;
    this.positionX = positionX;
    this.positionY = positionY;

    this.bullet = null;
    this.speedY = 1;

    this.createDomElement();
  }
  createDomElement() {
    this.bullet = document.createElement("div");

    // Set the initial position of the bullet
    this.bullet.className = "bullet";
    this.bullet.style.width = this.width + "vw";
    this.bullet.style.height = this.height + "vh";
    this.bullet.style.left = this.positionX + "vw";
    this.bullet.style.bottom = this.positionY + "vh";

    // Append the bullet to the DOM
    const board = document.getElementById("board");
    board.appendChild(this.bullet);
  }

  moveUp() {
    this.positionY++;
    this.bullet.style.bottom = this.positionY + "vw"; // hard code BUG!
  }
}

class Fuel {
  constructor() {
    this.width = 50;
    this.height = 100;
    this.positionX = 0;
    this.domElement = null;
    this.createDomElement();
  }

  createDomElement() {
    this.domElement = document.createElement("div");

    this.domElement.style.backgroundColor = "#d3ae5c";
    this.domElement.style.width = this.width + "%";
    this.domElement.style.height = this.height + "%";
    this.domElement.style.left = this.positionX + "%";
    this.domElement.style.top = this.positionY + "%";

    const fuelContainer = document.getElementById("fuel-container");
    fuelContainer.appendChild(this.domElement);
  }

  decreaseFuel() {
    if (this.width < 1) {
      location.href = "./gameover.html";
    } else if (this.width < 10) {
      this.domElement.style.backgroundColor = "tomato";
    } else {
      this.domElement.style.backgroundColor = "#d3ae5c";
    }
    this.width -= 0.1;
    this.domElement.style.width = this.width + "%";
  }
  increaseFuel() {
    if (this.width < 100) {
      this.width++;
      this.domElement.style.width = this.width + "%";
    }
  }
}

const dangerousObstaclesArray = []; // submarine, shippr
const notDangerousObstaclesArrayLeft = []; // trees
const notDangerousObstaclesArrayRight = []; // trees
const dangerousObstaclesArrayRight = []; // fight-jet, helicopter
const fuelArray = []; // fuel
const bulletsArray = []; // bulets
let fuelLevel = 0;
let obstacleCount = 0;

let obstacleCountStr = obstacleCount.toString();

const dangerousObstacleInterval = 5000;
const leftObstacleInterval = 5500;
const rightObstacleInterval = 4500;
const fuelInterval = 10000;

const leftPositionXRange = [0, 16]; // hart  code
const rightPositionXRange = [80, 95]; // hart  code
const fuelPositionXRange = [20, 60]; // hart  code
const dangerousPositionXRange = [20, 60]; // hart  code

const notDangerousImageAttributArray = [
  "./images/tree.svg",
  "./images/trees.svg",
];
const dangerousImageAttributArray = [
  "./images/submarine-right.svg",
  "./images/ship-right.svg",
];

const dangerousImageAttributArrayRight = [
  "./images/fighter-jet.svg",
  // "./images/helicopter-right.svg",
];
const fuelImageAttribut = "./images/gas-station.svg";

// create obstacles
function createObstacles(
  interval,
  positionXRange,
  imageAttributArray,
  targetArray
) {
  setInterval(() => {
    const positionX = Math.floor(
      Math.random() * (positionXRange[1] - positionXRange[0]) +
        positionXRange[0]
    );
    const imageAttribut =
      imageAttributArray[Math.floor(Math.random() * imageAttributArray.length)];
    const newObstacle = new Obstacle(positionX, imageAttribut);
    targetArray.push(newObstacle);
  }, interval);
}

createObstacles(
  dangerousObstacleInterval,
  dangerousPositionXRange,
  dangerousImageAttributArray,
  dangerousObstaclesArray
);
// new dangerous obstacles
createObstacles(
  6000,
  rightPositionXRange,
  dangerousImageAttributArrayRight,
  dangerousObstaclesArrayRight
);
createObstacles(
  leftObstacleInterval,
  leftPositionXRange,
  notDangerousImageAttributArray,
  notDangerousObstaclesArrayLeft
);
createObstacles(
  rightObstacleInterval,
  rightPositionXRange,
  notDangerousImageAttributArray,
  notDangerousObstaclesArrayRight
);
createObstacles(
  fuelInterval,
  fuelPositionXRange,
  [fuelImageAttribut],
  fuelArray
);

// create bulletsArray
function createBullestArray() {
  setInterval(() => {
    bulletsArray.forEach((bullet) => {
      bullet.moveUp();
      if (bullet.positionY >= 100) {
        bullet.bullet.remove();
        bulletsArray.shift();
      }
    });
  }, 10);
}

// count points for removed obstacle and display it
function increaseObstacleCount() {
  obstacleCount++;
  console.log("obstacleCount", obstacleCount);
  const pointsTable = document.getElementById("points-table");
  pointsTable.textContent = obstacleCount;
  localStorage.setItem("playerScore", obstacleCount);
}

function moveObstacles(obstacleArray, collisionCallback) {
  setInterval(() => {
    obstacleArray.forEach((obstacleInstance, obstIndex, obstArr) => {
      if (obstacleInstance.positionY > -10) {
        obstacleInstance.moveDown();
      }
      if (obstacleInstance.positionY < 0) {
        obstacleInstance.domElement.remove(); // remove from the dom
        obstArr.splice(obstIndex, 1); // remove from the array
      }
      if (collisionCallback) {
        collisionCallback(obstacleInstance, obstIndex, obstArr);
      }
    });
  }, 100);
}

// collision with a bullet
function collisionWithBullets(obstacleInstance, obstIndex, obstArr) {
  if (bulletsArray.length === 0) {
    return;
  }

  bulletsArray.forEach((bulletInstance, i) => {
    if (
      bulletInstance.positionX <
        obstacleInstance.positionX + obstacleInstance.width &&
      bulletInstance.positionX + bulletInstance.width >
        obstacleInstance.positionX &&
      bulletInstance.positionY <
        obstacleInstance.positionY + obstacleInstance.height &&
      bulletInstance.positionY + bulletInstance.height >
        obstacleInstance.positionY
    ) {
      bulletsArray.splice(i, 1); // remove from array
      bulletInstance.bullet.remove(); // remove from DOM
      obstArr.splice(obstIndex, 1);
      obstacleInstance.domElement.remove();
      makeExplosion(obstacleInstance);
      increaseObstacleCount();
    }
  });
}

// move NOT dangerous obstacles
function moveNotDangerousObstacles(obstaclesArray) {
  setInterval(() => {
    obstaclesArray.forEach((obstacleInstance) => {
      if (obstacleInstance.positionY > -10) {
        obstacleInstance.moveDown();
      }
      if (obstacleInstance.positionY < 0) {
        obstacleInstance.domElement.remove(); //remove from the dom
        obstaclesArray.shift(); // remove from the array
      }
    });
  }, 100);
}

// move dangerous obstacles Right
function moveDangerousObstaclesArrayRight() {
  setInterval(() => {
    dangerousObstaclesArrayRight.forEach(
      (obstacleInstance, obstacleInstanceIndex, arr) => {
        if (obstacleInstance.positionY > -10) {
          obstacleInstance.moveDown();
        }

        if (obstacleInstance.positionY < 60) {
          obstacleInstance.moveLeft();
        }

        if (obstacleInstance.positionY < 0) {
          obstacleInstance.domElement.remove(); //remove from the dom
          dangerousObstaclesArray.shift(); // remove from the array
        }
        checkCollision(player, dangerousObstaclesArrayRight);
        collisionWithBullets(obstacleInstance, obstacleInstanceIndex, arr);
      }
    );
  }, 100);
}

// move dangerous obstacles River
function moveDangerousObstacleRiver() {
  setInterval(() => {
    dangerousObstaclesArray.forEach(
      (obstacleInstance, obstacleInstanceIndex, arr) => {
        if (obstacleInstance.positionY > -10) {
          obstacleInstance.moveDown();
        }

        if (
          obstacleInstance.positionY < 50 &&
          obstacleInstance.positionX > 50
        ) {
          obstacleInstance.moveRight();
          if (obstacleInstance.positionX > 80 - obstacleInstance.width) {
            obstacleInstance.moveLeft();
          }
        }

        if (
          obstacleInstance.positionY < 50 &&
          obstacleInstance.positionX < 50
        ) {
          obstacleInstance.moveLeft();
          if (obstacleInstance.positionX < 20) {
            obstacleInstance.moveRight();
          }
        }

        if (obstacleInstance.positionY < 0) {
          obstacleInstance.domElement.remove(); //remove from the dom
          dangerousObstaclesArray.shift(); // remove from the array
        }
        checkCollision(player, dangerousObstaclesArray);
        collisionWithBullets(obstacleInstance, obstacleInstanceIndex, arr);
      }
    );
  }, 100);
}

// move fuel

function moveFuel() {
  setInterval(() => {
    fuelArray.forEach((obstacleInstance) => {
      if (obstacleInstance.positionY > -10) {
        obstacleInstance.moveDown();
      }
      if (obstacleInstance.positionY < 0) {
        obstacleInstance.domElement.remove(); //remove from the dom
        fuelArray.shift(); // remove from the array
      }
      if (
        player.positionX <
          obstacleInstance.positionX + obstacleInstance.width &&
        player.positionX + player.width > obstacleInstance.positionX &&
        player.positionY <
          obstacleInstance.positionY + obstacleInstance.height &&
        player.positionY + player.height > obstacleInstance.positionY
      ) {
        // Collision detected!
        petrolBoard.increaseFuel();
      }
    });
  }, 100);
}

// Colision  detection
function checkCollision(player, obstaclesArr) {
  obstaclesArr.forEach((obstacleInstance, i, arr) => {
    if (
      player.positionX < obstacleInstance.positionX + obstacleInstance.width &&
      player.positionX + player.width > obstacleInstance.positionX &&
      player.positionY < obstacleInstance.positionY + obstacleInstance.height &&
      player.positionY + player.height > obstacleInstance.positionY
    ) {
      arr.splice(i, 1);
      console.log("game over!");
      location.href = "./gameover.html";
      obstacleInstance.domElement.remove();
      playGameOverSound();
    }
  });
}
// explosion
function makeExplosion(obstacle) {
  // Create explosion SVG
  const explosion = document.createElement("img");
  explosion.setAttribute("src", "./images/explosion.svg");
  explosion.className = "explosion";

  // Set the position of the explosion
  const explosionLeft = obstacle.positionX;
  const explosionTop = obstacle.positionY;
  explosion.style.left = explosionLeft + "vw";
  explosion.style.bottom = explosionTop + "vh";

  // Append the explosion to the DOM
  board.appendChild(explosion);

  // Remove the explosion after a delay
  setTimeout(() => {
    board.removeChild(explosion);
  }, 1000);
}

// moving player
document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft" && player.positionX >= 0) {
    player.moveLeft();
    petrolBoard.decreaseFuel();
  } else if (
    event.key === "ArrowRight" &&
    player.positionX < 100 - player.width
  ) {
    player.moveRight();
    petrolBoard.decreaseFuel();
  } else if (
    event.key === "ArrowUp" &&
    player.positionY <= 100 - player.width
  ) {
    player.moveUp();
    petrolBoard.decreaseFuel();
  } else if (event.key === "ArrowDown" && player.positionY > 0) {
    // buck: player can go to the northpool
    player.moveDown();
    petrolBoard.decreaseFuel();
  }
});

// shooting booltes
document.addEventListener("keydown", (event) => {
  if (event.key === " ") {
    const xPos = player.positionX + player.width / 2;
    const yPOs = player.positionY;
    const newBullet = new Bullet(xPos, yPOs);
    bulletsArray.push(newBullet);
    playShootSound();
  }
});

function playShootSound() {
  let audio = new Audio("../audio/shoot-laser.mp3");
  audio.play();
}

function playGameOverSound() {
  let audio = new Audio("../audio/game-over-sound.mp3");
  audio.play();
}
moveNotDangerousObstacles(notDangerousObstaclesArrayRight);
moveNotDangerousObstacles(notDangerousObstaclesArrayLeft);
moveDangerousObstacleRiver(dangerousObstaclesArray);
moveDangerousObstaclesArrayRight(dangerousObstaclesArrayRight);
moveFuel(fuelArray);
createBullestArray();
const player = new Player();
const petrolBoard = new Fuel(fuelLevel);
