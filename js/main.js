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
    // this.positionX = Math.random() * (60 - 20) + 20;
    // this.positionX = Math.floor(Math.random() * 16); // grass left
    // this.positionX = Math.floor(Math.random() * (95 - 80) + 80); // grass right
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
    // this.domElement.setAttribute("src", "./images/submarine.svg"); // submarine
    this.domElement.setAttribute("src", imageAttribut); // tree

    // set id
    // this.domElement.className = "obstacle submarine";
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

class ObstaclesOnTheGrass extends Obstacle {
  constructor() {
    super();
  }
}
const player = new Player();

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft" && player.positionX >= 0) {
    player.moveLeft();
  } else if (
    event.key === "ArrowRight" &&
    player.positionX < 100 - player.width
  ) {
    player.moveRight();
  } else if (
    event.key === "ArrowUp" &&
    player.positionY <= 100 - player.width
  ) {
    player.moveUp();
  } else if (event.key === "ArrowDown" && player.positionY > 0) {
    // buck: player can go to the northpool
    player.moveDown();
  }
});

const dangerousObstaclesArray = []; // submarine, halicopter
const notDangerousObstaclesArray = []; // trees, buildings, fuel

// create dangerous obstacles
setInterval(() => {
  const positionXRiver = Math.random() * (60 - 20) + 20;
  const imageAttributSubmarine = `/images/submarine.svg`;
  const newObstacleRiver = new Obstacle(positionXRiver, imageAttributSubmarine);
  dangerousObstaclesArray.push(newObstacleRiver);
}, 5000);

//create NOT dangerous obstacles
setInterval(() => {
  const positionXRight = Math.floor(Math.random() * (95 - 80) + 80);
  const positionXLeft = Math.floor(Math.random() * 16);

  const imageAttributArray = [
    "./images/tree.svg",
    "./images/trees.svg",
    "./images/factory.svg",
  ];

  const imageAttribut =
    imageAttributArray[Math.floor(Math.random() * imageAttributArray.length)];
  const newObstacleRighr = new Obstacle(positionXRight, imageAttribut);
  const newObstacleLeft = new Obstacle(positionXLeft, imageAttribut);

  notDangerousObstaclesArray.push(newObstacleRighr, newObstacleLeft);
}, 4500);

// move dangerous obstacles
setInterval(() => {
  let points = 0;
  dangerousObstaclesArray.forEach((obstacleInstance) => {
    if (obstacleInstance.positionY > -10) {
      obstacleInstance.moveDown();
    }
    if (obstacleInstance.positionY < 0 - obstacleInstance.height) {
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

// move NOT dangerous obstacles
setInterval(() => {
  let points = 0;
  notDangerousObstaclesArray.forEach((obstacleInstance) => {
    if (obstacleInstance.positionY > -10) {
      obstacleInstance.moveDown();
    }
    if (obstacleInstance.positionY < 0 - obstacleInstance.height) {
      obstacleInstance.domElement.remove(); //remove from the dom
      notDangerousObstaclesArray.shift(); // remove from the array
    }
  });
}, 100);
