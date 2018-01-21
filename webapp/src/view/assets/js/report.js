// Main-Programm, welches funktioniert

// vordefinierte Variabeln fuer PDFMake
date = 'Januar';
timeline = 'Hier steht der Zeitraum';

currentTime = new Date();
year = currentTime.getFullYear();

// Images
headerImage = 'sampleImage.jpg';


$('#download-report').click(function () {

     // HTML2Canvas
    html2canvas($("#chart1"), {
            onrendered: function(canvas) {
                // toDataURL defaults to png, so we need to request a jpeg, then convert for file download.
                var chart1Image = canvas.toDataURL("image/jpeg");



        // PDF-Make
        var pdf = {

            pageMargins: [ 20, 60, 40, 60 ],
            pageSize: 'A4',

            // Header
            header: {
                    margin: 10,
                    columns: [
                        {
                            // usually you would use a dataUri instead of the name for client-side printing
                            // sampleImage.jpg however works inside playground so you can play with it
                            image: chart1Image,
                            width: 40
                        }
                    ]
                },

            // Footer
            footer: function(page, pages) {
                return {
                    widths:['*'],
                    columns: [
                        {
                        alignment: 'left',
                        color: '#000',
                        text: 'Copyright ©' + year +  ' – tele-Tunes – All Rights Reserved',
                        },

                        {
                            alignment: 'right',
                            color:'#000',
                            text: [
                                { text: 'Seite ' + page.toString(), italics: true },
                                ' von ',
                                { text: pages.toString(), italics: true }
                            ]
                        }

                    ], // end of columns
                    style: 'footer',


                }; // end of return
            }, // end of function for footer


            content: [

                    {   // Header
                        text: 'Tele-TUNES-Report \n\n', alignment:'center',
                        style: 'header',
                    },


                    {   // Text
                        text: 'Dies ist der automatisch erzeugte Bericht für die ITunes Statistiken vom HPI-Podcast für den Monat',
                        style: 'text'
                    },

                    {   // Text

                        text: date + ' (' + timeline +').' +  '\n\n',
                        style: 'text'
                    },

                    {
                        image: chart1Image,
                        width: 550,

                    },

                     {
                        text: '\n\n'

                    },

                    {
                        image: chart1Image,
                        width: 550,

                    },
                    {
                        text: '\n\n' + 'Für den ' + date + ' ('  +  timeline + ')'+ ' wurden die Kurse so angenommen:\n\n',
                        pageBreak: 'before'

                    },

                    {
                        image: chart1Image,
                        width: 550,

                    },

                    {
                        text: '\n\n'

                    },

                    {
                        image: chart1Image,
                        width: 550,

                    },





            ], // End of Content



            // Styling pdfMake
            styles: {
                header: {
                    fontSize: 18,
                    bold: true
                },
                footer: {
                    margin: [10, 0],
                    color: '#5a6065',
                    bold: true

                },
                text: {
                    fontSize: 11,
                    bold: false
                },
                quote: {
                    italics: true
                },
                small: {
                    fontSize: 8
                }
            }

        }; // End of var pdf



    // download the PDF
    pdfMake.createPdf(pdf).download('manueller-TeleTunes-Bericht.pdf');
            } // End of onrenderd
        }); //End of HTML2Canvas



}); // End of #download-report


/*

// Take Screenshot and
function getScreenshot(imgId) {
    html2canvas($(imgId), {
            onrendered: function(canvas) {
                //var data = canvas.toDataURL();
                var data = canvas.toDataURL("image/jpeg");



                $.ajax({

            type: "POST",
            url: data,
            data: data,
            success : function(data)
            {
                console.log("screenshot done");
            }
             }).done(function() {
            //$('body').html(data);
        });

        }// end of onrendered
    }); // end of html2canvas

  }; // End of fucntion getScreenshot



// PDF-Make
function pdfMaker(){
    // PDF-Make
        var pdf = {

            pageMargins: [ 20, 60, 40, 60 ],
            pageSize: 'A4',

            // Header
            header: {
                    margin: 10,
                    columns: [
                        {
                            // usually you would use a dataUri instead of the name for client-side printing
                            // sampleImage.jpg however works inside playground so you can play with it
                            image: headerImage,
                            width: 40
                        }
                    ]
                },

            // Footer
            footer: function(page, pages) {
                return {
                    widths:['*'],
                    columns: [
                        {
                        alignment: 'left',
                        color: '#000',
                        text: 'Copyright ©' + year +  ' – tele-Tunes – All Rights Reserved',
                        },

                        {
                            alignment: 'right',
                            color:'#000',
                            text: [
                                { text: 'Seite ' + page.toString(), italics: true },
                                ' von ',
                                { text: pages.toString(), italics: true }
                            ]
                        }

                    ], // end of columns
                    style: 'footer',


                }; // end of return
            }, // end of function for footer


            content: [

                    {   // Header
                        text: 'Tele-TUNES-Report \n\n', alignment:'center',
                        style: 'header',
                    },


                    {   // Text
                        text: 'Dies ist der automatisch erzeugte Bericht für die ITunes Statistiken vom HPI-Podcast für den Monat',
                        style: 'text'
                    },

                    {   // Text

                        text: date + ' (' + timeline +').' +  '\n\n',
                        style: 'text'
                    },

                    {
                        image: chart1,
                        width: 550,

                    },

                     {
                        text: '\n\n'

                    },

                    {
                        image: chart1,
                        width: 550,

                    },
                    {
                        text: '\n\n' + 'Für den ' + date + ' ('  +  timeline + ')'+ ' wurden die Kurse so angenommen:\n\n',
                        pageBreak: 'before'

                    },

                    {
                        image: chart1,
                        width: 550,

                    },

                    {
                        text: '\n\n'

                    },

                    {
                        image: chart1,
                        width: 550,

                    },





            ], // End of Content



            // Styling pdfMake
            styles: {
                header: {
                    fontSize: 18,
                    bold: true
                },
                footer: {
                    margin: [10, 0],
                    color: '#5a6065',
                    bold: true

                },
                text: {
                    fontSize: 11,
                    bold: false
                },
                quote: {
                    italics: true
                },
                small: {
                    fontSize: 8
                }
            }

        }; // End of var pdf

    // download the PDF
    pdfMake.createPdf(pdf).download('automatischer-TeleTunes-Bericht.pdf');
}; // End of function pdfMake



// Main-Programm
$('#download-report').click(function () {
// vordefinierte Variavlen fuer PDFMake
date = 'Januar';
timeline = 'Hier steht der Zeitraum';

currentTime = new Date();
year = currentTime.getFullYear();

// Images
headerImage = 'sampleImage.jpg';

// id of charts
chartId1 = '#chart1';
chartId2 = '#chart2';
chartId3 = '#chart3';

// save charts as URI
chart1 = getScreenshot(chartId1);
chart2 = getScreenshot(chartId2);
chart3 = getScreenshot(chartId3);
chart4 = getScreenshot(chartId3);
chart5 = getScreenshot(chartId3);

// pdf-make
pdfMaker();



});// End of download-report

*/



