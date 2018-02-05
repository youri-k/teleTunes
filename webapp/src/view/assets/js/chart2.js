var myChart2, responseDataChart2;
function showChart2(onACanvas, withTitle, start = null, end = null) {
  var ctx = document.getElementById(onACanvas).getContext("2d");
  myChart2 = new Chart(ctx, {
    type: "bar",
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
        text: withTitle,
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
              labelString: "Anzahl Gesamtdownloads",
              fontSize: 24
            }
          }
        ],
        xAxes: [
          {
            ticks: {
              autoSkip: false
            },
            scaleLabel: {
              display: true,
              labelString: "Namen der Kurse",
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
            var respObj = responseDataChart2[tooltipItem["index"]];
            var labelArr = [];
            labelArr.push("Downloads: " + respObj.download);
            labelArr.push("Browse: " + respObj.browse);
            labelArr.push("Subscriptions: " + respObj.subscribe);
            labelArr.push("Streams: " + respObj.stream);
            labelArr.push("AutoDownloads: " + respObj.auto_download);
            return labelArr;
          }
        },
        displayColors: false
      }
    }
  });
  loadDataForChart2(myChart2, start, end);
}

function loadDataForChart2(start, end) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      updateChart2(JSON.parse(this.responseText));
    }
  };

  var url =
    "http://localhost:8080/maxInteractionsInInterval?limit=10";
  if(typeof(fields) != "undefined"){
    url +="&fields=" + fields.join(",");
  }
  if (start) url += "&startDate=" + start;
  if (end) url += "&endDate=" + end;
  xhttp.open("GET", url, true);
  xhttp.send();
}

function updateChart2(responseData) {
  responseDataChart2 = responseData;
  var labels = [];
  var data = [];
  var maximum = 0;
  responseData.forEach(item => {
    labels.push(item.title);
    data.push(item.sum);
    if (item.sum > maximum) maximum = item.sum;
  });
  var maxYAxe = Math.ceil(maximum / 100) * 100;
  var tickRate = Math.ceil(maxYAxe / 4000) * 200;
  maxYAxe = Math.ceil(maximum / tickRate) * tickRate;

  myChart2.options.scales.yAxes[0].ticks.max = maxYAxe;
  myChart2.options.scales.yAxes[0].ticks.stepSize = tickRate;

  myChart2.data.labels = labels;
  myChart2.data.datasets[0].data = data;
  myChart2.update();
}
