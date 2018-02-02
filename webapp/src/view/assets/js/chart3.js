function showChart3(onACanvas){
    var ctx = document.getElementById(onACanvas).getContext('2d');
                var myChart3 = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: ["Datum_1", "Datum_2", "Datum_3", "Datum_4", "Datum_5", "Datum_6"],
                        datasets: [{
                            data: [12, 19, 3, 5, 2, 3]
                        }]
                    },
                    options: {
                        legend: {
                            display: false,
                        },
                        title: {
                            display: true,
                            text: 'Anzahl Downloads | Zeitraum',
                            fontSize: 32
                        },
                        scales: {
                            yAxes: [{
                                ticks: {
                                    min: 0,
                                    max: 100,
                                    stepSize: 25
                                },
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Anzahl Gesamtdownloads | Kurs',
                                    fontSize: 24
                                }
                            }],
                            xAxes: [{
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Zeitraum',
                                    fontSize: 24
                              }
                            }]
                        }
                    }
                });
}
