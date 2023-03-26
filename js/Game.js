class Game {
  constructor() {
    this.resetTitle = createElement("h2");
    this.resetButton = createButton("");
    this.leaderboardTitle = createElement("h2");
    this.leader1 = createElement("h2");
    this.leader2 = createElement("h2");
  }

  getState() {
    var gameStateRef = database.ref("gameState");
    gameStateRef.on("value", function (data) {
      gameState = data.val();
    });
  }
  update(state) {
    database.ref("/").update({
      gameState: state
    });
  }

  start() {
    player = new Player();
    playerCount = player.getCount();

    form = new Form();
    form.display();

    car1 = createSprite(width / 2 - 50, height - 100);
    car1.addImage("car1", car1_img);
    car1.scale = 0.07;

    car2 = createSprite(width / 2 + 100, height - 100);
    car2.addImage("car2", car2_img);
    car2.scale = 0.07;

    cars = [car1, car2];
  }

  handleElements() {
    form.hide();
    form.titleImg.position(40, 50);
    form.titleImg.class("gameTitleAfterEffect");
    this.resetTitle.html("resetGame");
    this.resetTitle.position(width / 2 + 200, 40);
    this.resetButton.position(width / 2 + 230, 100);

    this.leaderboardTitle.html("leaderboard");
    this.leaderboardTitle.position(width / 3 - 60, 40);
    this.leader1.position(width / 3 - 50, 80);
    this.leader2.position(width / 3 - 50, 130);
    this.resetTitle.class("resetText");
    this.resetButton.class("resetButton");
    this.leaderboardTitle.class("leadersText");
    this.leader1.class("leadersText");
    this.leader2.class("leadersText");
  }

  play() {
    this.handleElements();

    Player.getPlayersInfo();

    if (allPlayers !== undefined) {
      image(track, 0, -height * 5, width, height * 6);

      //index of the array
      var index = 0;
      for (var plr in allPlayers) {
        //add 1 to the index for every loop
        index = index + 1;

        //use data form the database to display the cars in x and y direction
        var x = allPlayers[plr].positionX;
        var y = height - allPlayers[plr].positionY;

        cars[index - 1].position.x = x;
        cars[index - 1].position.y = y;

        if (index === player.index) {
          stroke(10);
          fill("red");
          ellipse(x, y, 60, 60);

          // Changing camera position in y direction
          camera.position.x = cars[index - 1].position.x;
          camera.position.y = cars[index - 1].position.y;
        }
      }

      this.handlePlayerControls();

      this.handleResetButton();

      console.log(player.positionY)

      const finishline = height * 6 - 100

      if (player.positionY > finishline) {
        gameState = 2
        player.rank += 1
        player.update();
        this.showRank()
      }

      drawSprites();
    }
  }

  handlePlayerControls() {
    // handling keyboard events
    if (keyIsDown(UP_ARROW)) {
      player.positionY += 10;
      player.update();
    }
  }

  handleResetButton() {
    this.resetButton.mousePressed(() => {
      database.ref("/").set({
        playerCount: 0,
        gameState: 0,
        players: {}
      })
      window.location.reload()
    })
  }

  showLeaderBoard() {
    var leader1, leader2
  }

  gameOver() {
    swal({
      title: `Game Over`,
      text: "Oops! You lost the Race.",
      imageUrl: "https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
      imageSize: "100x100",
      confirmButtonText: "Thanks for playing!"
    })
  }

  showRank() {
    swal({
      title: `Awesome! ${'\n'} rank${player.rank}`,
      text: "You reached the finish line sucessfully.",
      imageUrl: "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
      imageSize: "100x100",
      confirmButtonText: "Ok"
    })
  }
}