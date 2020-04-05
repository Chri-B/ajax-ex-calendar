var htmlGiorno = $('#calendar-template').html();
var templateGiorno = Handlebars.compile(htmlGiorno);


var primaData = moment('2018-01-01');                                           // prima data disponibile
stampaGiorniMese(primaData);                                                    // inizializzazione calendario
stampaFestivo(primaData);

// al click sul bottone next viene stampato il mese successivo
$('#next').click(function() {
    if (primaData.month() < 11) {                                               // se il mese corrente è impostato su dicembre (11), non posso andare avanti con il tasto prev
        primaData.add(1, 'M');                                                  // funzione add con moment.js - aggiungo al mese 'M' un valore +1 .add(number, 'String')
        stampaGiorniMese(primaData);
        stampaFestivo(primaData);
    }
});

// al click sul bottone prev viene stampato il mese precedente
$('#prev').click(function() {
    if (primaData.month() > 0) {                                                // se il mese corrente è impostato su gennaio (0), non posso tornare indietro con il tasto prev
        primaData.subtract(1, 'M');                                             // funzione subtract con moment.js - sottraggo al mese 'M' un valore        stampaGiorniMese(primaData);
        stampaGiorniMese(primaData);
        stampaFestivo(primaData);
    }
});


function stampaFestivo(primaData) {
    $.ajax({
        url: 'https://flynn.boolean.careers/exercises/api/holidays',
        method: 'GET',
        data: {
            year: 2018,
            month: primaData.month()
        },
        success: function (data) {
            var giorniFestivi = data.response;
            for (var i = 0; i < giorniFestivi.length; i++) {
                var giornoFestivo = giorniFestivi[i];
                var nomeFestivo = giornoFestivo.name;
                var dataFestivo = giornoFestivo.date;
                $('#calendar li[data-day="' + dataFestivo + '"]').addClass('festivo').append(' - ' + nomeFestivo);
            }
        }
    });
};


function stampaGiorniMese(meseDaStampare) {
    $('#calendar').empty();
    var standardDay = meseDaStampare.clone();
    var giorniMese = primaData.daysInMonth();
    var nomeMese = primaData.format('MMMM');
    $('#nome-mese').text(nomeMese);                                             // modifico il nome del mese nel top-calendar
    for (var i = 1; i <= giorniMese; i++) {
        var output = {
            day: i + ' ' + nomeMese,
            dataDay: standardDay.format('YYYY-MM-DD')
        }
        var templateFinale = templateGiorno(output);
        $('#calendar').append(templateFinale);
        standardDay.add(1, 'day');
    }
};
