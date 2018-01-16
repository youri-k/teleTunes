// vordefinierte Variavlen fuer PDFMake
date = 'Januar';
timeline = 'Hier steht der Zeitraum';

currentTime = new Date();
year = currentTime.getFullYear();

$('#download-report').click(function () {

     // HTML2Canvas
    html2canvas($("#chart1"), {
            onrendered: function(canvas) {
                //var data = canvas.toDataURL();
                 var chart1Image = document.createElement('a');
                // toDataURL defaults to png, so we need to request a jpeg, then convert for file download.
                chart1Image.href = canvas.toDataURL("image/jpeg");


        // PDF-Make
        var pdf = {

            pageMargins: [ 20, 60, 40, 60 ],
            pageSize: 'A4',

            // Footer
            footer: function(page, pages) {
                return {
                    columns: [
                        {
                        alignment: 'left',
                        color: '#fff',
                        text: 'Copyright ©' + year +  ' – tele-Tunes – All Rights Reserved',
                        },

                        {
                            alignment: 'right',
                            color:'#fff',
                            text: [
                                { text: 'Seite ' + page.toString(), italics: true },
                                ' von ',
                                { text: pages.toString(), italics: true }
                            ]
                        }

                    ],
                    margin: [10, 0],
                    background: '#5a6065'

                };
            },


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
                    text: 'It is possible to apply multiple styles, by passing an array. This paragraph uses two styles: quote and small. When multiple styles are provided, they are evaluated in the specified order which is important in case they define the same properties',
                    style: ['quote', 'small']
                }
            ],
            styles: {
                header: {
                    fontSize: 18,
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
            } // End of onrenderd
        }); //End of HTML2Canvas



}); // End of #download-report


