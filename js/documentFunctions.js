/* global numeroAnnotazioni, queryAnnotations, lastIndex */

function apriDocumento(titolo, name) {
    activeURI = name;
    title = titolo;
    lastIndex = 0;
    arrayAnnotazioni = []; // Cancello tutte le annotaizoni in corso
    numeroAnnotazioni = -1;
    numeroAnnEsterne = 0;
    numeroAnnot = 0;
    jsonFragment = "";
    heisenbergJson = [];
    queryAnnotations = [];
    countCit = 0;
    primaSelezione = 0;
    newAnn = false;
    
    if ($('#loading2').hasClass('fa') || $('#loading3').hasClass('fa') || $('#loading4').hasClass('fa')) {
        avviso("Non è possibile aprire un documento mentre un altro è ancora in fase di caricamento!");
    } else {
        if (!$('#modalita').is(':checked')) {
            $('#hideButtonBar').fadeOut();
            $('#buttonBar').fadeIn();
        }

        $('#docs').collapse('hide');
        $("a[class='list-group-item active']").attr('class', 'list-group-item'); // Rende inattivo il documento precedente dalla lista
        $("a[name='"+name+"']").attr('class', 'list-group-item active'); // Rende attivo il documento che sta per essere caricato
        $('#loading2').attr("class", "fa fa-cog fa-spin pull-right");
        $("#pannelloPrincipale").html("<h3><i class='fa fa-spinner fa-spin fa-2x'></i>&nbsp; Caricamento del documento in corso...</h3>");
        $("#mainIntestazione").html(titolo);
        spotDoc(name);
    }
}

// Funzione che controlla se il documento cercato è tra quelli del dataset
function spotDoc(link) {
    var spotted = false;
    /*
     * Chiamata ajax che cicla il file package.json contenente i documenti del dataset e controlla se l'url digitato e' tra quelli oppure no (else).
     * In base a ciò viene chiamato il metodo load in maniere differenti.
     */
    $.getJSON("json/package.json", function(data) {
        outerloop:
        for(var i in data) {
            for(var k in data[i]) {
                if(link === data[i][k]) {
                    if(i === 'dlib') {
                        spotted = true;
                        load(link, 'dlib');
                        break outerloop;
                    } else if (i === 'statistica') {
                        spotted = true;
                        load(link, 'stat');
                        break outerloop;
                    } else {
                        spotted = true;
                        load(link, 'jour');
                        break outerloop;
                    }
                }
            }
        }
        if (spotted === false) {
            if (link.indexOf('dlib.org') !== -1) load(link, 'dlib');
            else if (link.indexOf('rivista-statistica') !== -1) load(link, 'stat');
            else load(link, 'else');
        }
    });
}

// Caricamento del contenuto nell'apposita area
function load(file, doc) {
    // pulisco tutte le annotazioni che eventualmente erano caricate
    $('.lista-annotazioni').empty(); 
    // Caricamento della homepage con informazioni su come utilizzare il tool
    if (file === "main.html") {
        $("#scrape").prop("disabled", true);
        $('.progress').fadeOut();
        $("body").css("padding-top", "70px");
        $("#chiaro").prop("disabled", true);
        $("#scuro").prop("disabled", true);
        $("#seppia").prop("disabled", true);
        $("#mainIntestazione").html("Raschietto - Guida generale");
        $.ajax({
            url : "main.html",
            success: function(result) {
                $('#pannelloPrincipale').html(result);
            }
        });
    } else {
        $("#scrape").prop("disabled", false);
        $("#chiaro").prop("disabled", false);
        $("#scuro").prop("disabled", false);
        $("#seppia").prop("disabled", false);
        // Chiamata alla funzione di scraping in base al tipo di documento cercato
        $.ajax({
            url : 'php/pageScraping.php',
            data : {uri:file, type:doc},
            type : 'POST',
            success : function(result) {
                // Documento interno al dataset (else) oppure no?
                if (doc !== 'else') {
                    $('#pannelloPrincipale').html(result);
                    $("p:first:contains('D-Lib Magazine')").replaceWith("<h3>D-Lib Magazine</h3>");
                } else {
                    $('#modalLoad').modal('show');
                    $('#pannelloPrincipale').html(result);
                    setTimeout(function () {
                        $('#modalLoad').modal('hide');
                    }, 10000);
                }
                
                numAnnTot = 0;
                $('.badgeAnnOnDocument').text(numAnnTot + " Totali");
                $('#loading3').attr('class', 'fa fa-cog fa-spin pull-right');
            
                currentGraph = 'Tutti';
                // nel momento in cui viene aperto un documento
                loadAllAnnotationOfGraphs(activeURI, function () {
                    lastIndex++;
                   // ok quindi questo replace graphButton va a prendere le annotazioni di tutti messi insieme
                    replaceGraphsButton(queryAnnotations, 'Tutti', lastIndex, activeURI);
                    $('#' + lastIndex).click();
                }); // scarica tutte le annotazioni di tutti i gruppi
                $('#grafo').find('i').each(function () {
                    if ($(this).text() === '  Tutti'){ 
                        $(this).addClass('active');
                    }
                });
                
                $('.badgeHeisenberg').text(numeroAnnotazioni + 1);

                // Controllo sulla barra che indica il punto di lettura del documento
                $('.progress').fadeIn();
                $("body").css("padding-top", "75px");
                scrollBar();
                if ($('#pannelloPrincipale').html() === "")
                    avviso("Attenzione! La pagina indicata non può essere aperta in questa finestra. Verifica di aver correttamente specificato l'indirizzo (presta particolare attenzione alla differenza tra http e https) e riprova." +
                        "\nIn caso di un nuovo insuccesso, è probabile che la pagina indicata non permetta di essere visualizzata su una pagina esterna al proprio dominio come questa.");

                /*OPZIONALE : rimuovi gli attributi href e onclick dai tag <a> presenti nel documento caricato. perchè?
                attualmente i link vengono tolti usando la funzione strip_html_tags() del file pageScraping.php; ciò che 
                avviene è che viene eliminato l'intero tag. se invece volessimo lasciare il tag, ma eliminarne i riferi-
                menti esterni al documento, bisogna usare questo metodo; ciò permetterebbe di mantenere lo "stile" link
                ma impedendo comunque l'apertura dei link. L'apertura è bloccata perchè altrimenti può succedere, cliccando
                su un'annotazione composta da soli link, di caricare una pagina esterna e perdere quindi tutto il proprio 
                lavoro.*/
                $("#pannelloPrincipale").find("a").removeAttr("href");
                $("#pannelloPrincipale").find("a").removeAttr("onclick");
            }
        });
    }
}
