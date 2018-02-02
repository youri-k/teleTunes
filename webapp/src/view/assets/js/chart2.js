
function showChart2(onACanvas){
        var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        dataToChart2(JSON.parse(this.responseText));
                    }
                };
                xhttp.open("GET", "http://localhost:8080/maxInteractionsInInterval?fields=download&limit=10", true);
                xhttp.send();
                
                function dataToChart2(responseData) {
                    var labels = [];
                    var data = [];
                    responseData.forEach(item => {
                        labels.push(item.title); data.push(item.sum);
                    });
                var ctx = document.getElementById(onACanvas).getContext('2d');
                var myChart2 = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: labels,
                        datasets: [{
                            data: data,
                        }]
                    },
                    options: {
                        legend: {
                            display: false,
                        },
                        title: {
                            display: true,
                            text: 'Downloadanzahl der HPI-Kurse',
                            fontSize: 32
                        },
                        scales: {
                            yAxes: [{
                                ticks: {
                                    stepSize: 200
                                }, 
                                scaleLabel: {
                                            display: true,
                                            labelString: 'Anzahl Gesamtdownloads',
                                            fontSize: 24
                                        }
                                    }],
                                    xAxes: [{
                                        ticks: {
                                            autoSkip: false
                                        },
                                        scaleLabel: {
                                            display: true,
                                            labelString: 'Namen der Kurse',
                                            fontSize: 24
                                      }
                                    }]
                                },
                        tooltips: {
                            callbacks: {
                                title: function(tooltipItem, data) {
                                    return data['labels'][tooltipItem[0]['index']];
                                },
                                label: function(tooltipItem, data) {
                                    var respObj = responseData[tooltipItem['index']];
                                    var labelArr = [];
                                    labelArr.push("Downloads: " + respObj.download);
                                    labelArr.push("Browse: " + respObj.browse);
                                    labelArr.push("Subscriptions: " + respObj.subscribe);
                                    labelArr.push("Streams: " + respObj.stream);
                                    labelArr.push("AutoDownloads: " + respObj.auto_download);
                                    return labelArr;
                                },
                            },
                            displayColors: false
                        }
                    }
                });
            } 
}
