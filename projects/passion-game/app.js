const frames_per_second = 60;
let frames = 0;
let enemy_spawnpoint = 0;
let ally_spawnpoint = 150;
let enemies = [];
let allies = [];
let enemy_current_id=1;
let ally_current_id = 1;
let points = 200;
let enemies_left = 12;
let pointsSelect = document.querySelector("#points");
pointsSelect.innerHTML = (points + " points");
let enemyCounter = document.querySelector("#enemy-counter");
enemyCounter.innerHTML = (enemies_left + " Enemies left");
let background_music = new Audio("bg-song.mp3");
let you_win = new Audio("you_win.mp3");
let you_lose = new Audio("you_lose.mp3");
let death_sound = new Audio("death_sound.mp3");
let hit_sound = new Audio("hit_sound.mp3");
let tower = document.querySelector("#tower");
let bg_images = ["bg2.png", "bg3.png", "bg4.png", "bg5.png"];
let i = 1;

// de game loop
const game_loop = setInterval(gameLoop, 1000/frames_per_second);
background_music.volume = 0.1;
background_music.loop = true;
background_music.play();

//game loop, code in gameLoop 60 keer per seconde uitvoeren
function gameLoop() {
  frames++;
  // check of er enemies over zijn anders win je
  if (enemies_left == 0 && enemies.length == 0) {
    you_win.volume = 0.1;
    you_win.play();
    window.location.href = "index.html";
    alert("JE HEBT GEWONNEN, DE PRINCESS IS VEILIG!");
    
  }
  //console.log(enemies);
  checkGameEnd();
  calculateDistance();
  moveAlly();
  // spawns enemies till the counter hits 0
  if (enemies_left > 0 && frames % 300 == 0) {
    spawnEnemy();
    enemies_left--;
    enemyCounter.innerHTML = enemies_left + " Enemies left";
  }
  moveWizard();
  fighting();
}


// beweegt enemy wizard naar rechts
function moveWizard() {
    // foreach is voor elk element in het array met een eigen benaming, index is optioneel maar is nodig hier
    enemies.forEach((enemy,index)=>{        
        if(!enemy.combat){
            const enemy_element = document.querySelector("img.wizard[data-id='"+enemy.id+"']");
            enemies[index].location = enemies[index].location + 2;
            enemy_element.style.left = enemies[index].location + "px";
            //console.log(enemies);
        }
    });
}

// beweegt ally naar links
function moveAlly() {
    allies.forEach((ally, index) => {
        if(!ally.combat){
            const ally_element = document.querySelector("img.ally[data-id='"+ally.id+"']");
            allies[index].location = allies[index].location + 2;
            ally_element.style.right = allies[index].location + "px";
            //console.log(allies[index]);
        }
    });
}

// spawn ally met knop + optional: checking for points and delay on purchase
function spawnAlly() {
  let button_press = new Audio("button-press.mp3");
  button_press.volume = 0.3;
  button_press.play();
    if (points == 0) {
        let noPointsMessage = document.createElement("h3");
        const mainWrapper = document.querySelector("body");
        mainWrapper.appendChild(noPointsMessage);
        noPointsMessage.innerHTML = "Geen punten!";
        //console.log(noPointsMessage);
        setInterval(function(){noPointsMessage.remove();},1500);
    }
    if (points >= 50) {
        
        const ally_properties = {
            id: ally_current_id,
            combat: false,
            location: ally_spawnpoint,
            hp: 500,
            damage: 30,
            interval: 500
        }
        let mainWrapper = document.querySelector("main");
        let allyImage = document.createElement("img");
        allyImage.classList.add("ally");
        allyImage.src = "adventurer_walk2.png";
        allyImage.dataset.id = ally_current_id;
        allyImage.style.right = ally_spawnpoint + "px";
        mainWrapper.appendChild(allyImage);
        allies.push(ally_properties);
        ally_current_id++;
        points = points - 50;
        pointsSelect.innerHTML = (points + " points");
    }
    
}

// enemy interval spawn + enemies left counter + win scherm als geen enemies meer over zijn
function spawnEnemy() {
    //creating properties
    const enemy_properties={
        id:enemy_current_id,
        combat:false,
        location:enemy_spawnpoint,
        hp: 350,
        damage: 30,
        interval: 500
    }
    ///Adding html element
    let mainWrapper = document.querySelector("main");
    let enemyImage = document.createElement("img");
    enemyImage.classList.add("wizard");
    enemyImage.src = "zombie_walk1.png";
    enemyImage.dataset.id=enemy_current_id;
    enemyImage.style.left=enemy_spawnpoint+"px";
    mainWrapper.appendChild(enemyImage);
    // push wizard? into enemies array
    enemies.push(enemy_properties);
    
    //Upping enemy ID
    enemy_current_id++;
}

// meet afstand tussen elke enemy en ally
function calculateDistance() {
  //Van alle enemies controleren of ze tegen 1 van de allies aan staan
  enemies.forEach((enemy, index_enemy) => {
    allies.forEach((ally, index_ally) => {
      //1 op 1 vergelijking
      let domRect_enemy = document.querySelector("img.wizard[data-id='" + enemy.id + "']").getBoundingClientRect();
      let domRect_ally = document.querySelector("img.ally[data-id='" + ally.id + "']").getBoundingClientRect();

      // de afstand tussen de elementen
      let distance = Math.floor(domRect_ally.left - domRect_enemy.right);

      //console.log(distance);

      if (distance < 1) {
        enemies[index_enemy].combat = true;
        allies[index_ally].combat = true;
      }

    });
  });
  //console.log("---");
}

  // Als combat true is dan vechten ze
function fighting() {
  enemies.forEach((enemy, index_enemy) => {
    allies.forEach((ally, index_ally) => {
      if (enemies[index_enemy].combat && allies[index_ally].combat == true) {
        enemies[index_enemy].hp = enemies[index_enemy].hp - allies[index_ally].damage / 60;
        allies[index_ally].hp = allies[index_ally].hp - enemies[index_enemy].damage / 60;
        hit_sound.volume = 0.5;
        hit_sound.play();
        //console.log("Enemy HP: " + enemies[index_enemy].hp);
        //console.log("Ally HP: " + allies[index_ally].hp);
        document.querySelector("img.wizard[data-id='" + enemy.id + "']").src = "zombie_action2.png";
        document.querySelector("img.ally[data-id='" + ally.id + "']").src = "adventurer_action2.png";
      }
      if (enemies[index_enemy].hp < 0) {
        enemies.splice(index_enemy, 1);
        death_sound.volume = 0.2;
        death_sound.play();
        points = points + 30;
        updatePoints();
        document.querySelector("img.wizard[data-id='" + enemy.id + "']").remove();
      }
      if (allies[index_ally].hp < 0) {
        allies.splice(index_ally, 1);
        death_sound.volume = 0.2;
        death_sound.play();
        document.querySelector("img.ally[data-id='" + ally.id + "']").remove();
      }

    });
  });
  // Laat ze doorlopen als combat voorbij is
  allies.forEach((ally, index_ally) => {
      allies[index_ally].combat = false;
  });
  enemies.forEach((enemy, index_enemy) => {
    enemies[index_enemy].combat = false;
  });

}

function updatePoints() {
  pointsSelect.innerHTML = (points + " points");
}

// Checkt of zombies bij de tower zijn
function checkGameEnd() {
  enemies.forEach((enemy, index_enemy) => {
    let domRect_enemy = document.querySelector("img.wizard[data-id='" + enemy.id + "']").getBoundingClientRect();
    let domRect_tower = document.querySelector("#tower").getBoundingClientRect();
    let danger_distance = Math.floor(domRect_tower.left - domRect_enemy.right);
    //console.log(danger_distance);

    if (danger_distance < 40) {
      tower.src = "tower2.png";
    }

    if (danger_distance < 1) {
      tower.src = "tower2.png";
      you_lose.volume = 0.1;
      you_lose.play();
      window.location.href = "index.html";
      alert("JE HEBT VERLOREN, DE PRINCESS IS MEEGENOMEN.");
    }
  });
}


// Verandert de achtergrond op klik
function changeBackground() {
  let button_press = new Audio("button-press.mp3");
  button_press.volume = 0.3;
  button_press.play();
  //console.log(i);
  if (i < 4) {
    let current_image = document.body.style.backgroundImage = "url("+bg_images[i]+")";
    i++;
  }
  if (i == 4) {
    i = 0;
  }
}

function backToStart() {
  let button_press = new Audio("button-press.mp3");
  button_press.volume = 0.3;
  button_press.play();
  window.location.href = "index.html";
}