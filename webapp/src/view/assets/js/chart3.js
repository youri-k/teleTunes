var myChart3, responseDataChart3;
function showChart3(onACanvas) {
  var ctx = document.getElementById(onACanvas).getContext("2d");
  myChart3 = new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Lade Daten"],
      datasets: []
    },
    options: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: "Anzahl Downloads / Zeitraum",
        fontSize: 32
      },
      scales: {
        yAxes: [
          {
            ticks: {
              min: 0,
              max: 0,
              stepSize: 0
            },
            scaleLabel: {
              display: true,
              labelString: "Anzahl Gesamtdownloads | Kurs",
              fontSize: 24
            }
          }
        ],
        xAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: "Zeitraum",
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
            return allParams[tooltipItem["datasetIndex"]] + ": " + data["datasets"][tooltipItem["datasetIndex"]]["data"][tooltipItem["index"]];
          },

        },
        displayColors: false
      }
    }
  });
}

function loadDataForChart3(course) {
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
      [course],
    true
  );
  xhttp.send();
}

function updateChart3(responseData) {
  responseDataChart3 = responseData;
  var maximum = 0;
  var labels = [];
  var datasets = [];
  allParams.forEach(param => {
    var dataObj = {};
    var paramArray = [];
    dataObj.data = paramArray;
    datasets.push(dataObj);
  });
  responseData.forEach(item => {
    labels.push(item.date);
    allParams.forEach((param, index) => {
      datasets[index].data.push(item[param]);
      if (item[param] > maximum) maximum = item[param];
    });
  });
  var maxYAxe = Math.ceil(maximum / 50) * 50;
  var tickRate = Math.ceil(maxYAxe / 1000) * 50;
  maxYAxe = Math.ceil(maximum / tickRate) * tickRate;

  myChart3.options.scales.yAxes[0].ticks.max = maxYAxe;
  myChart3.options.scales.yAxes[0].ticks.stepSize = tickRate;

  myChart3.data.labels = labels;
  myChart3.data.datasets = datasets;
  myChart3.update();
}
