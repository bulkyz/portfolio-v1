// wacht tot pagina geladen is dan begint js pas
window.addEventListener('load', function(e) {
  console.log('Page loaded.');

  // de menu knoppen
  var navButtons = Array.from(document.querySelectorAll(".tab"));

  // listener als je op knop klikt
  for (navButton of navButtons) {
    navButton.addEventListener("click", navClickHandler);
  }

  // functie als je klikt
  // maakt knop actief en de andere niet
  function navClickHandler(event) {
    for (navButton of navButtons) {
      navButton.classList.remove("active");
    }
    this.classList.add("active");

    var container = document.querySelector("main");
    container.scrollTo({
    left: window.innerWidth * navButtons.indexOf(this),
    top: 0,
    behavior: "smooth" 
  })
  };

// weather api
fetch("https://api.openweathermap.org/data/2.5/weather?id=2754652&appid=2a6b2e2a4bef81e884c10526b8a72404&units=metric")
.then(response => response.json())
.then(data => {
  console.log(data);

  var datum = new Date();
  var tijd = datum.getHours() + ":" + datum.getMinutes();
  var uren = new Date().getHours();

  console.log(uren);

  const screenContainer = document.getElementById("screenB");
  const articleWrapper = document.querySelector("article");
  const weatherTekst = document.createElement("h2");
  const tijdTekst = document.createElement("h3");
  const jasTekst = document.createElement("h2");
  const welkomTekst = document.createElement("h2");
  
  screenContainer.appendChild(articleWrapper);
  articleWrapper.appendChild(welkomTekst);
  articleWrapper.appendChild(tijdTekst);
  articleWrapper.appendChild(weatherTekst);
  articleWrapper.appendChild(jasTekst);

  tijdTekst.innerText = (tijd);

  weatherTekst.innerText = ("Het is " + Math.trunc(data.main.temp) + " graden");

if (data.main.temp < 18) {
  jasTekst.innerText = ("Neem je jas mee");
}
if (data.main.temp > 18) {
  jasTekst.innerText = ("Laat je jas thuis");
}

if (uren >= 1 && uren < 12) {
  welkomTekst.innerText = ("Goedeochtend");
}
if (uren >= 12 && uren < 18) {
  welkomTekst.innerText = ("Goedemiddag");
}
if (uren >= 18) {
  welkomTekst.innerText = ("Goedeavond");
}

})

.catch(error => {
  console.log(error);
})

});

//verdelen in 3 verschillende stukken

// api

// time + welkom

// jas

