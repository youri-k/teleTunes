
function showChart1(onACanvas){
 var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        dataToChart(JSON.parse(this.responseText));
                    }
                };
                xhttp.open("GET", "http://localhost:8080/combinedVisitsPerDay?fields=download", true);
                xhttp.send();
                
                function dataToChart(responseData) {
                    var labels = []; var downloads = [];
                    responseData.forEach(item => {
                        labels.push(item.date); downloads.push(item.sum);
                    });
                    var ctx = document.getElementById(onACanvas).getContext('2d');
                    $("#" + onACanvas).click(function(evt){
                        var activePoint = myChart1.getElementsAtEvent(evt);
                        if(activePoint.length < 1)
                            return;
                        var date = myChart1.data.labels[activePoint[0]._index];
                        window.open("/dayChart?day=" + date,'_blank');
                    });
                    var myChart1 = new Chart(ctx, {
                        type: 'line',
                        data: {
                            labels: labels,
                            datasets: [{
                            data: downloads
                        }]
                        },
                        options: {
                        legend: {
                            display: false
                        },
                        title: {
                            display: true,
                            text: 'Gesamtdownloads',
                            fontSize: 32
                        },
                        scales: {
                            yAxes: [{
                                ticks: {
                                    min: 0,
                                    max: 2000,
                                    stepSize: 100
                                },
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Downloads',
                                    fontSize: 24
                                }
                            }],
                            xAxes: [{
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Datum',
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
                                    labelArr.push("Summe: " + respObj.sum);
                                    var params = Object.keys(respObj);
                                    if(params.length > 3){
                                        params.filter(item => item != "date" && item != "sum").forEach(param => {
                                            labelArr.push(param + ": " + respObj[param]);
                                        })
                                    }
                                    return labelArr;
                                },
                            },
                            displayColors: false
                        }
                    }
                });
                } 
}
