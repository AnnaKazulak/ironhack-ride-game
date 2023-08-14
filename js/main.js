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

  shoot() {
    const bullet = document.createElement("div");
    bullet.className = "bullet";

    // Set the initial position of the bullet
    bullet.style.left = this.positionX + this.width / 2 + "vw";
    bullet.style.bottom = this.positionY + this.height + "vh";

    // Append the bullet to the DOM
    const board = document.getElementById("board");
    board.appendChild(bullet);

    // Move the bullet upwards with an interval
    const bulletInterval = setInterval(() => {
      const bulletTop = parseFloat(bullet.style.bottom);
      bullet.style.bottom = bulletTop + 1 + "vh";

      // Check for collisions with obstacles
      const obstacles = document.querySelectorAll(".obstacle");

      obstacles.forEach((obstacle) => {
        if (checkCollision(bullet, obstacle)) {
          clearInterval(bulletInterval);
          board.removeChild(bullet);
          board.removeChild(obstacle);

          // Create explosion SVG
          const explosion = document.createElement("img");
          explosion.setAttribute("src", "./images/explosion.svg");
          explosion.className = "explosion";
          console.log(explosion);
          // Set the position of the explosion
          const explosionLeft = parseFloat(obstacle.style.left);
          const explosionTop = parseFloat(obstacle.style.bottom);
          explosion.style.left = explosionLeft + "vw";
          explosion.style.bottom = explosionTop + "vh";

          // Append the explosion to the DOM
          board.appendChild(explosion);

          // Remove the explosion after a delay
          setTimeout(() => {
            board.removeChild(explosion);
          }, 1000);
        }
      });

      // Check if the bullet is out of the screen
      if (bulletTop >= 100) {
        clearInterval(bulletInterval);
        board.removeChild(bullet);
      }
    }, 10);
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
    this.domElement.setAttribute("src", imageAttribut); // tree

    // set id
    this.domElement.className = "obstacle tree";
    this.domElement.style.width = this.width + "vw";
    this.domElement.style.height = this.height + "vh";
    this.domElement.style.left = this.positionX + "vw";
    this.domElement.style.bottom = this.positionY + "vh";

    //append to the dom
    const parentElm = document.getElementById("board");
    parentElm.appendChild(this.domElement);
  }
  moveDown() {
    this.positionY -= this.speedY;
    this.domElement.style.bottom = this.positionY + "vh";
  }
}

const player = new Player();

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

document.addEventListener("keydown", (event) => {
  if (event.key === " ") {
    player.shoot();
  }
});

const dangerousObstaclesArray = []; // submarine, halicopter
const notDangerousObstaclesArrayLeft = []; // trees, buildings
const notDangerousObstaclesArrayRight = []; // trees, buildingsl
const fuelArray = []; // fuel

// create dangerous obstacles
setInterval(() => {
  const positionXRiver = Math.random() * (60 - 20) + 20;
  const imageAttributSubmarine = `/images/submarine.svg`;
  const newObstacleRiver = new Obstacle(positionXRiver, imageAttributSubmarine);
  dangerousObstaclesArray.push(newObstacleRiver);
}, 5000);

//create NOT dangerous obstacles Left
setInterval(() => {
  const positionXLeft = Math.floor(Math.random() * 16);

  const imageAttributArray = ["./images/tree.svg", "./images/trees.svg"];
  const imageAttribut =
    imageAttributArray[Math.floor(Math.random() * imageAttributArray.length)];
  const newObstacleLeft = new Obstacle(positionXLeft, imageAttribut);
  notDangerousObstaclesArrayLeft.push(newObstacleLeft);
}, 5500);

//create NOT dangerous obstacles Right
setInterval(() => {
  const positionXRight = Math.floor(Math.random() * (95 - 80) + 80);

  const imageAttributArray = ["./images/tree.svg", "./images/trees.svg"];
  const imageAttribut =
    imageAttributArray[Math.floor(Math.random() * imageAttributArray.length)];
  const newObstacleRighr = new Obstacle(positionXRight, imageAttribut);
  notDangerousObstaclesArrayRight.push(newObstacleRighr);
}, 4500);

// create fuel
setInterval(() => {
  const positionXRiver = Math.floor(Math.random() * (60 - 20) + 20);
  const imageAttributFuel = `/images/gas-station.svg`;
  const newObstacleRiver = new Obstacle(positionXRiver, imageAttributFuel);
  fuelArray.push(newObstacleRiver);
}, 10000);

// move dangerous obstacles
setInterval(() => {
  let points = 0;
  dangerousObstaclesArray.forEach((obstacleInstance) => {
    if (obstacleInstance.positionY > -10) {
      obstacleInstance.moveDown();
    }
    if (obstacleInstance.positionY < 0) {
      obstacleInstance.domElement.remove(); //remove from the dom
      dangerousObstaclesArray.shift(); // remove from the array
      // points += 10; // does not work
      // console.log("points:", points);
    }
    if (
      player.positionX < obstacleInstance.positionX + obstacleInstance.width &&
      player.positionX + player.width > obstacleInstance.positionX &&
      player.positionY < obstacleInstance.positionY + obstacleInstance.height &&
      player.positionY + player.height > obstacleInstance.positionY
    ) {
      // Collision detected!
      console.log("game over! ");
      // location.href = "./gameover.html";
    }
  });
}, 100);

// move NOT dangerous obstacles Left
setInterval(() => {
  let points = 0;
  notDangerousObstaclesArrayLeft.forEach((obstacleInstance) => {
    if (obstacleInstance.positionY > -10) {
      obstacleInstance.moveDown();
    }
    if (obstacleInstance.positionY < 0) {
      obstacleInstance.domElement.remove(); //remove from the dom
      notDangerousObstaclesArrayLeft.shift(); // remove from the array
    }
  });
}, 100);

// move NOT dangerous obstacles Right
setInterval(() => {
  let points = 0;
  notDangerousObstaclesArrayRight.forEach((obstacleInstance) => {
    if (obstacleInstance.positionY > -10) {
      obstacleInstance.moveDown();
    }
    if (obstacleInstance.positionY < 0) {
      obstacleInstance.domElement.remove(); //remove from the dom
      notDangerousObstaclesArrayRight.shift(); // remove from the array
    }
  });
}, 100);
let fuelLevel = 0;

// move fuel
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
      player.positionX < obstacleInstance.positionX + obstacleInstance.width &&
      player.positionX + player.width > obstacleInstance.positionX &&
      player.positionY < obstacleInstance.positionY + obstacleInstance.height &&
      player.positionY + player.height > obstacleInstance.positionY
    ) {
      // Collision detected!
      petrolBoard.increaseFuel();
    }
  });
}, 100);

class Fuel {
  constructor() {
    this.width = 50;
    this.height = 100;
    this.positionX = 0;
    this.domElement = null;
    this.createDomeElement();
  }

  createDomeElement() {
    this.domElement = document.createElement("div");

    this.domElement.id = "fuel-pointer";
    this.domElement.style.backgroundColor = "#d3ae5c";
    this.domElement.style.width = this.width + "%";
    this.domElement.style.height = this.height + "%";
    this.domElement.style.left = this.positionX + "%";
    this.domElement.style.top = this.positionY + "%";

    const fuelContainer = document.getElementById("fuel-container");
    fuelContainer.appendChild(this.domElement);
  }

  decreaseFuel() {
    if (this.width < 10) {
      this.domElement.style.backgroundColor = "tomato";
    } else {
      this.domElement.style.backgroundColor = "#d3ae5c";
    }
    this.width -= 0.2;
    this.domElement.style.width = this.width + "%";
  }
  increaseFuel() {
    if (this.width < 100) {
      this.width++;
      this.domElement.style.width = this.width + "%";
    }
  }
}

const petrolBoard = new Fuel(fuelLevel);

// Function to check collision between two elements
function checkCollision(elem1, elem2) {
  const rect1 = elem1.getBoundingClientRect();
  const rect2 = elem2.getBoundingClientRect();
  return (
    rect1.left < rect2.right &&
    rect1.right > rect2.left &&
    rect1.top < rect2.bottom &&
    rect1.bottom > rect2.top
  );
}
