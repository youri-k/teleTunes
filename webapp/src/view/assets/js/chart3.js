function showChart3(onACanvas) {
  var params = ["download", "subscribe"];

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      dataToChart(JSON.parse(this.responseText));
    }
  };
  xhttp.open(
    "GET",
    "http://localhost:8080/api/course?fields=" +
      params.join(",") +
      "&id=728270905",
    true
  );
  xhttp.send();

  function dataToChart(responseData) {
    var maximum = 0;
    var labels = [];
    var datasets = [];
    params.forEach(param => {
      var dataObj = {};
      var paramArray = [];
      dataObj.data = paramArray;
      datasets.push(dataObj);
    });
    responseData.forEach(item => {
      labels.push(item.date);
      params.forEach((param, index) => {
        datasets[index].data.push(item[param]);
        if (item[param] > maximum) maximum = item[param];
      });
    });
    var maxYAxe = Math.ceil(maximum / 50) * 50;
    var tickRate = Math.ceil(maxYAxe / 1000) * 50;
    maxYAxe = Math.ceil(maximum / tickRate) * tickRate;
    var ctx = document.getElementById(onACanvas).getContext("2d");
    var myChart3 = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: datasets
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
                max: maxYAxe,
                stepSize: tickRate
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
              return //data["datasets"][tooltips]; //TODO
            }
          },
          displayColors: false
        }
      }
    });
  }
}
