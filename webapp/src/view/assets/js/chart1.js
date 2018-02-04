var responseDataChart1, myChart1;
function showChart1(onACanvas) {
  var ctx = document.getElementById(onACanvas).getContext("2d");
  $("#" + onACanvas).click(function(evt) {
    var activePoint = myChart1.getElementsAtEvent(evt);
    if (activePoint.length < 1) return;
    var date = myChart1.data.labels[activePoint[0]._index];
    window.open("/dayChart?day=" + date, "_blank");
  });
  myChart1 = new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Lade Daten"],
      datasets: [
        {
          data: []
        }
      ]
    },
    options: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: "Gesamtdownloads",
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
              labelString: "Downloads",
              fontSize: 24
            }
          }
        ],
        xAxes: [
          {
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
            var respObj = responseDataChart1[tooltipItem["index"]];
            var labelArr = [];
            labelArr.push("Summe: " + respObj.sum);
            var params = Object.keys(respObj);
            if (params.length > 3) {
              params
                .filter(item => item != "date" && item != "sum")
                .forEach(param => {
                  labelArr.push(param + ": " + respObj[param]);
                });
            }
            return labelArr;
          }
        },
        displayColors: false
      }
    }
  });
  loadDataForChart1();
}

function loadDataForChart1() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      updateChart1(JSON.parse(this.responseText));
    }
  };
  xhttp.open(
    "GET",
    "http://localhost:8080/combinedVisitsPerDay?fields=" +
      fields.join(",") +
      "&startDate=" +
      startDate +
      "&endDate=" +
      endDate,
    true
  );
  xhttp.send();
}

function updateChart1(responseData) {
  responseDataChart1 = responseData;
  var maximum = 0;
  var labels = [];
  var downloads = [];
  responseData.forEach(item => {
    labels.push(item.date);
    downloads.push(item.sum);
    if (item.sum > maximum) maximum = item.sum;
  });
  var maxYAxe = Math.ceil(maximum / 100) * 100;
  var tickRate = Math.ceil(maxYAxe / 2000) * 100;
  maxYAxe = Math.ceil(maximum / tickRate) * tickRate;

  myChart1.options.scales.yAxes[0].ticks.max = maxYAxe;
  myChart1.options.scales.yAxes[0].ticks.stepSize = tickRate;

  myChart1.data.labels = labels;
  myChart1.data.datasets[0].data = downloads;
  myChart1.update();
}
