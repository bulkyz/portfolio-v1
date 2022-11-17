// PWA LEX

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register("/serviceworker.js")
      .then((res) => console.log("service worker registered"))
      .catch((err) => console.log("service worker not registered", err));
  });
}

window.addEventListener("load", function (e) {
  console.log("Page loaded.");

  var navButtons = Array.from(document.querySelectorAll(".tab"));

  for (navButton of navButtons) {
    navButton.addEventListener("click", navClickHandler);
  }

  function navClickHandler(event) {
    for (navButton of navButtons) {
      navButton.classList.remove("active");
    }
    this.classList.add("active");
  }

  const userButtons = document.querySelectorAll(".showUserData");
  userButtons.forEach((userButton) => {
    userButton.addEventListener("click", (event) => {
      chartIt(event.target.getAttribute("data-userid"));
      chartIt2(event.target.getAttribute("data-userid"));
      lineIt(event.target.getAttribute("data-userid"));
      window.open("#screenB", "_self"); //method loads the specified resource into the existing browsing context (#screenB)
    });
  });

  // creates text line/sidenote under graphs
  async function lineIt(userId) {
    // selecting the h3/h4 under chart wrap
    var sidenote = document.querySelectorAll(
      ".chart-wrap h3, .chart-wrap-2 h4"
    );
    // removes existing text and cleans screen/resets
    if (sidenote.length > 0) {
      sidenote[0].remove();
      sidenote[1].remove();
    }
    // get user
    const data = await getData(userId);
    const data2 = await getData2(userId);
    // get data
    var difference = data.yDifference[0];
    var weights = data2.yWeight;
    if (check_for_dangerous_amount_loss(weights, 6, 2)) {
      console.error(
        "There is a dangerous possibility that you are losing weight too fast"
      );
    }
    // put data into integer
    parseInt(difference);
    // var for the if
    var diffText = "";
    // compare difference
    if (difference < 0) {
      diffText = "% less";
    } else if (difference > 0) {
      diffText = "% more";
    }
    // remove minus from the number (must be after difference check)
    var difference = Math.abs(difference);
    // selecting then creating the text line
    var wrapper = document.querySelector(".chart-wrap");
    var wrapper2 = document.querySelector(".chart-wrap-2");
    var theLine = document.createElement("h3");
    var theLine2 = document.createElement("h4");

    theLine.innerText =
      "Eating " + difference + diffText + " compared to last month";
    wrapper.appendChild(theLine);

    theLine2.innerText = "Attention! There is rapid loss of weight";
    wrapper2.appendChild(theLine2);
  }

  /* function - for a weight graph*/
  function check_for_dangerous_amount_loss(weights, months, kilograms) {
    //some settings (ampunt of months occuring / amount of kg loss that is dangerous)
    const danger_amount_of_months_with_loss = months;
    const amount_in_kg_dangerous = kilograms;
    //counter for amount of months with dangerous loss
    let amount_of_dangerous_months = 0;

    //loop over all the weights to check dangerous loss
    weights.forEach((value, index, weights) => {
      //only run from second month, otherwise no comparison
      if (index > 0) {
        //calculate difference with last month
        const difference_with_last_month = weights[index - 1] - value;
        console.log(difference_with_last_month);
        //compare current weight with previous month
        if (difference_with_last_month >= amount_in_kg_dangerous) {
          amount_of_dangerous_months++;
        }
      }
    });
    return amount_of_dangerous_months >= danger_amount_of_months_with_loss;
  }
  // create chart
  // instantiate a line chart showing the numbers for 3 months
  async function chartIt(userId) {
    const data = await getData(userId);
    const ctx = document.getElementById("myChart").getContext("2d");
    const myChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: data.xTime,
        datasets: [
          {
            label: "Last month",
            data: data.yMonth1,
            borderWidth: 2,
            borderColor: "#6d98ba",
            fill: false,
          },
          {
            label: "Current month",
            data: data.yMonth2,
            borderWidth: 2,
            borderColor: "#1b4774",
            fill: false,
          },
        ],
      },
      options: {
        scales: {
          yAxes: [
            {
              display: true,
            },
          ],

          xAxes: [
            {
              gridLines: {
                display: true,
              },
            },
          ],
        },
        elements: {
          point: {
            radius: 0,
          },
        },
      },
    });
  }
  // create chart2
  // instantiate a line chart showing the amount of weights and average
  async function chartIt2(userId) {
    const data2 = await getData2(userId);
    const ctx2 = document.getElementById("myChart2").getContext("2d");
    const myChart = new Chart(ctx2, {
      type: "line",
      data: {
        labels: data2.xDate,
        datasets: [
          {
            label: "Weight",
            data: data2.yWeight,
            borderWidth: 2,
            borderColor: "#1b4774",
            fill: false,
          },
          {
            label: "Your average",
            data: data2.yWaverage,
            borderWidth: 2,
            borderColor: "#6d98ba",
            fill: false,
          },
        ],
      },
      options: {
        elements: {
          point: {
            radius: 0,
          },
        },
      },
    });
  }

  // fetch data as text
  async function getData(userId) {
    const xTime = [];
    const yMonth1 = [];
    const yMonth2 = [];
    const yDifference = [];

    const response = await fetch("user" + userId + "_data.csv");
    const data = await response.text();

    // splitting the data up in rows
    const table = data.split("\n").slice(1);

    // splitting rows into columns + pushing data into array
    table.forEach((row) => {
      const columns = row.split(";");
      const time = columns[0];
      xTime.push(time);
      const month1 = columns[1];
      yMonth1.push(month1);
      const month2 = columns[2];
      yMonth2.push(month2);
      const difference = columns[5];
      yDifference.push(difference);
    });
    return {
      xTime,
      yMonth1,
      yMonth2,
      yDifference,
    };
  }

  async function getData2(userId) {
    const xDate = [];
    const yWeight = [];
    const yWaverage = [];

    const response = await fetch("user" + userId + "_data2.csv");
    const data2 = await response.text();

    // splitting the data up in rows
    const table = data2.split("\n").slice(1);

    // splitting rows into columns + pushing data into array
    table.forEach((row) => {
      const columns = row.split(";");
      const date = columns[0];
      xDate.push(date);
      const weight = columns[1];
      yWeight.push(weight);
      const waverage = columns[3];
      yWaverage.push(waverage);
    });
    return {
      xDate,
      yWeight,
      yWaverage,
    };
  }
});
