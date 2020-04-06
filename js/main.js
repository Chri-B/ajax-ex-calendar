var htmlGiorno = $('#calendar-template').html();
var templateGiorno = Handlebars.compile(htmlGiorno);


var primaData = moment('2018-01-01');                                          // prima data disponibile
var primoGiorno = primaData.isoWeekday();
console.log(primoGiorno);
var limiteIniziale = moment('2018-01-01');
var limiteFinale = moment('2018-12-01');

aggiungiGiorniVuoti(primoGiorno);
stampaGiorniMese(primaData);                                                    // inizializzazione calendario
stampaFestivo(primaData);

// al click sul bottone next viene stampato il mese successivo
$('#next').click(function() {
    $('#prev').prop('disabled', false);
    if (primaData.isSameOrAfter(limiteFinale)) {
        alert('Hai provato ad hackerarmi!');
    } else {
        $('#calendar').empty();
        primaData.add(1, 'M');
        primoGiorno = primaData.isoWeekday();
        console.log(primoGiorno);
        aggiungiGiorniVuoti(primoGiorno);
        stampaGiorniMese(primaData);
        stampaFestivo(primaData);
        if (primaData.isSameOrAfter(limiteFinale)) {
            $('#next').prop('disabled', true);
        }
    }
});

// al click sul bottone prev viene stampato il mese precedente
$('#prev').click(function() {
    $('#next').prop('disabled', false);
    if (primaData.isSameOrBefore(limiteIniziale)) {
        alert('Hai provato ad hackerarmi!');
    } else {
        $('#calendar').empty();
        primaData.subtract(1, 'M');
        primoGiorno = primaData.isoWeekday();
        console.log(primoGiorno);
        aggiungiGiorniVuoti(primoGiorno);
        stampaGiorniMese(primaData);
        stampaFestivo(primaData);
        if (primaData.isSameOrBefore(limiteIniziale)) {
            $('#prev').prop('disabled', true);
        }
    }
});


// ordinamento con giorno della settimana:
// 1- al click su next month richiedo il primo giorno della settimana qual è
// 2- confronto il giorno della settimana ricevuto e aggiunto n li vuoti all'occorrenza con un ciclo for su un array di 7 elementi dato dai gg della settimana
//      2.1- l'append dei li vuoti posso generarlo o con un semplice append o con un nuovo template Handlebars vuoto
// 3- introduco lo stesso ragionamento per il prev. ----> creo funzione da richiamare con la pressione dei due tasti e nel caso statico


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
    var standardDay = meseDaStampare.clone();
    var giorniMese = meseDaStampare.daysInMonth();
    var nomeMese = meseDaStampare.format('MMMM');
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

function aggiungiGiorniVuoti(primoGiornoMese) {
    for (var i = 1; i < primoGiornoMese; i++) {
        console.log(i);
        $('#calendar').append('<li></li>');
    }
}
