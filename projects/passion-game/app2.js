let bg_song = new Audio("intro-music.mp3");

    
window.addEventListener("keydown", function (event) {
    if (event.key === "s") {
        window.location.href = "game.html";
    }
})

function playMusic() {
    let button_press = new Audio("button-press.mp3");
    button_press.volume = 0.3;
    button_press.play();
    bg_song.volume = 0.1;
    bg_song.play();
}

function startGame() {
    let button_press = new Audio("button-press.mp3");
    button_press.volume = 0.3;
    button_press.play();
    window.location.href = "game.html";
}
