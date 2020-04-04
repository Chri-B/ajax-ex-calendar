var htmlGiorno = $('#calendar-template').html();
var templateGiorno = Handlebars.compile(htmlGiorno);


var primaData = moment('2018-01-01'); // prima data disponibile
stampaGiorniMese(primaData); // inizializzazione calendario

$('#next').click(function() {
    primaData.add(1, 'M'); // funzione add con moment.js - aggiungo al mese 'M' un valore +1 .add(number, 'String')
    console.log(primaData);
});


function stampaGiorniMese(meseDaStampare) {
    var giorniMese = primaData.daysInMonth();
    var nomeMese = primaData.format('MMMM');

    for (var i = 1; i <= giorniMese; i++) {
        var output = {
            day: i + ' ' + nomeMese
        }
        var templateFinale = templateGiorno(output);
        $('#calendar').append(templateFinale);
    }
}
