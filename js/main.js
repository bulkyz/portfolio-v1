let projectText = document.getElementById('project-text');
projectText.innerText = 'Projects';

//cleanup code

// Shows project name based on which project you hover on
function showText1() {
    projectText.innerText = 'EatWell app (phone view needed)'
}

function showText2() {
    projectText.innerText = 'API demo app (phone view needed)'
}

function showText3() {
    projectText.innerText = 'JS game (desktop)'
}

function defaultText() {
    projectText.innerText = 'Projects'
}