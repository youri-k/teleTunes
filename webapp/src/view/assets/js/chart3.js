var myChart3, responseDataChart3, course;
function showChart3(onACanvas) {
  var ctx = document.getElementById(onACanvas).getContext("2d");
  myChart3 = new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Einen Kurs wählen..."],
      datasets: []
    },
    options: {
      legend: {
        display: true
      },
      title: {
        display: true,
        text: "Interaktionen des gewählten Kurses",
        fontSize: 32
      },
      scales: {
        yAxes: [
          {
            ticks: {
              min: 0,
              max: 0,
              stepSize: 1
            },
            scaleLabel: {
              display: true,
              labelString: "Interaktionen",
              fontSize: 24
            }
          }
        ],
        xAxes: [
          {
            gridLines: {
              offsetGridLines: true
            },
            scaleLabel: {
              display: true,
              labelString: "Datum",
              fontSize: 24
            }
          }
        ]
      },
      tooltips: {
        callbacks: {
          title: function(tooltipItem, data) {
            return data["labels"][tooltipItem[0]["index"]];
          },
          label: function(tooltipItem, data) {
            return (
              capitalizeFirstLetter(allParams[tooltipItem["datasetIndex"]]) +
              ": " +
              data["datasets"][tooltipItem["datasetIndex"]]["data"][
                tooltipItem["index"]
              ]
            );
          }
        },
        displayColors: false
      }
    }
  });
}

function loadDataForChart3(newCourse) {
  if(newCourse) course = newCourse;
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      updateChart3(JSON.parse(this.responseText));
    }
  };
  xhttp.open(
    "GET",
    "http://localhost:8080/api/course?fields=" +
      allParams.join(",") +
      "&name=" +
      [course] +
      "&startDate=" +
      startDate +
      "&endDate=" +
      endDate,
    true
  );
  xhttp.send();
}

function updateChart3(responseData) {
  console.log("updateChart3");
  responseDataChart3 = responseData;
  var maximum = 0;
  var labels = [];
  var datasets = [];

  if (responseData.length == 0) {
    var dataObj = {};
    var paramArray = [];
    dataObj.data = paramArray;
    datasets.push(dataObj);
    myChart3.data.labels = ["Keine Daten vorhanden!"];
    myChart3.data.datasets = datasets;
    myChart3.options.scales.xAxes[0].gridLines.offsetGridLines = true;
    myChart3.options.scales.yAxes[0].ticks.max = 0;
    myChart3.options.scales.yAxes[0].ticks.stepSize = 1;
    myChart3.update();
    return;
  }

  allParams.forEach((param, index) => {
    var dataObj = {};
    var paramArray = [];
    dataObj.data = paramArray;
    dataObj.borderColor = colors[index];
    dataObj.fill = false;
    dataObj.label = capitalizeFirstLetter(param);
    datasets.push(dataObj);
  });
  responseData.forEach(item => {
    labels.push(item.date);
    allParams.forEach((param, index) => {
      datasets[index].data.push(item[param]);
      if (item[param] > maximum) maximum = item[param];
    });
  });

  var maxYAxe = Math.ceil(maximum / 10) * 10;
  var tickRate = Math.ceil(maxYAxe / 200) * 10;
  maxYAxe = Math.ceil(maximum / tickRate) * tickRate;

  myChart3.options.scales.yAxes[0].ticks.max = maxYAxe;
  myChart3.options.scales.yAxes[0].ticks.stepSize = tickRate;
  myChart3.options.scales.xAxes[0].gridLines.offsetGridLines = false;

  myChart3.data.labels = labels;
  myChart3.data.datasets = datasets;
  myChart3.update();
}
