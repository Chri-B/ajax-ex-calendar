var htmlGiorno = $('#calendar-template').html();
var templateGiorno = Handlebars.compile(htmlGiorno);


var primaData = moment('2018-01-01');                                          // prima data disponibile
var primoGiorno = primaData.isoWeekday();
var limiteIniziale = moment('2018-01-01');
var limiteFinale = moment('2018-12-01');

aggiungiGiorniVuoti(primoGiorno);
var giorniMeseCorrente = stampaGiorniMese(primaData); // salvo in una variabile il numero di giorni del mese corrente
stampaFestivo(primaData);
var quadratiniMancanti = (7 - ((giorniMeseCorrente + primoGiorno - 1) % 7) + 1); // calcolo il numero di quadratini necessari a completare la griglia del calendario tenendo conto che il ciclo ha come condizione strettamente minore
if (quadratiniMancanti != 8) { // nel caso il numero fosse uguale a 8, non aggiungo una riga intera di quadratini.
    aggiungiGiorniVuoti(quadratiniMancanti);
}

// al click sul bottone next viene stampato il mese successivo
$('#next').click(function() {
    $('#prev').prop('disabled', false);
    if (primaData.isSameOrAfter(limiteFinale)) {
        alert('Hai provato ad hackerarmi!');
    } else {
        $('#calendar').empty();
        primaData.add(1, 'M');
        primoGiorno = primaData.isoWeekday();
        aggiungiGiorniVuoti(primoGiorno);
        var giorniMeseCorrente = stampaGiorniMese(primaData);
        quadratiniMancanti = (7 - ((giorniMeseCorrente + primoGiorno - 1) % 7) + 1);
        if (quadratiniMancanti != 8) {
            aggiungiGiorniVuoti(quadratiniMancanti);
        }
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
        aggiungiGiorniVuoti(primoGiorno);
        var giorniMeseCorrente = stampaGiorniMese(primaData);
        quadratiniMancanti = (7 - ((giorniMeseCorrente + primoGiorno - 1) % 7) + 1);
        if (quadratiniMancanti != 8) {
            aggiungiGiorniVuoti(quadratiniMancanti);
        }
        stampaFestivo(primaData);
        if (primaData.isSameOrBefore(limiteIniziale)) {
            $('#prev').prop('disabled', true);
        }
    }
});


// funzione per richiedere i giorni festivi in un mese
function stampaFestivo(primaData) {
    $.ajax({
        url: 'https://flynn.boolean.careers/exercises/api/holidays',
        method: 'GET',
        data: {
            year: primaData.year(),
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

// funzione per stampare i giorni del mese e dare come valore in uscita il numero di giorni nel mese
function stampaGiorniMese(meseDaStampare) {
    var standardDay = meseDaStampare.clone();
    var giorniMese = meseDaStampare.daysInMonth(); // variabile globale per
    var nomeMese = meseDaStampare.format('MMMM');
    $('#nome-mese').text(nomeMese); // modifico il nome del mese nel top-calendar
    for (var i = 1; i <= giorniMese; i++) {
        var output = {
            day: i + ' ' + nomeMese,
            dataDay: standardDay.format('YYYY-MM-DD')
        }
        var templateFinale = templateGiorno(output);
        $('#calendar').append(templateFinale);
        standardDay.add(1, 'day');
    }
    return giorniMese; // return giorniMese per utilizzarlo in un'altra funzione
};

// funzione per aggiungere una serie di quadratini vuoti nella griglia del calendario
function aggiungiGiorniVuoti(limiteSupGiorni) {
    for (var i = 1; i < limiteSupGiorni; i++) {
        $('#calendar').append('<li></li>');
    }
}
