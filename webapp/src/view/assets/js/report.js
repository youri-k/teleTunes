

$('#download-report').click(function () {

    // vordefinierte Variavlen fuer PDFMake
    date = 'Januar';
    timeline = 'Hier steht der Zeitraum.';

    // PdfMake
    var pdf = {

        // Footer
        footer: function(currentPage, pageCount) { return currentPage.toString() + ' of ' + pageCount; },


        content: [

            {   // Header
                text: 'Tele-TUNES-Report \n\n', alignment:'center',
                style: 'header'
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

    } /* End of var pdf*/

    // download the PDF
    pdfMake.createPdf(pdf).download('automatischer-TeleTunes-Bericht.pdf');


}); /* End of #download-report*/

