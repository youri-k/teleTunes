function showChart2(onACanvas, withTitle, start = null, end = null) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      dataToChart2(JSON.parse(this.responseText));
    }
  };

  var url =
    "http://localhost:8080/maxInteractionsInInterval?fields=download&limit=10";
  if (start != null) url += "&startDate=" + start;
  if (end != null) url += "&endDate=" + end;
  xhttp.open("GET", url, true);
  xhttp.send();

  function dataToChart2(responseData) {
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
    var ctx = document.getElementById(onACanvas).getContext("2d");
    var myChart2 = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            data: data
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
                max: maxYAxe,
                stepSize: tickRate
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
              var respObj = responseData[tooltipItem["index"]];
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
  }
}
