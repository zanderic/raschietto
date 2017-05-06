var selezione;
var fragmentselection;
var numeroAnnotazioni = -1;
var numeroAnnEsterne = 0;
var arrayAnnotazioni = [];
var contatoreDisplay = 0;
var id;
var startFrag;
var endFrag;
var dt;
var time;
var insert = false;
var title = "Raschietto - Guida generale";
var activeURI;
var endpointURL = "http://tweb2015.cs.unibo.it:8080/data/";
var json;
var username = "";
var email = "";
var temporaryQuoteArray = [];
var quoteType;
var istanzeAutori = [];
var int = true;
var notes;
var countAnnotazioniAutomatiche = 0;
var databaseAnnotations = [];
var graphs;
var currentGraph;
var countCit = 0;
var father;
var docNum = 0;
var numFiltri = 0;
var numAnnTot = 0;
var indexHeisenberg;
var newAnn = false;
var queryAnnotations = [];
var jsonFragment;
var lastIndex;
var numeroAnnot;
var listaDocGrafi = []; // conterrà tutti gli url (quindi tutti gli item) su cui qualsiasi gruppo ha fatto annotazioni
var quoteList = [];
var primaSelezione = 0;
var numeroMassimoAnnotazioni = 0;
var numeroAnnotazioniInCorso = 0;

$(document).ready(function () {
    $('#docList').append('<i class="fa fa-spinner fa-spin fa-3x"></i>');
    
    gruppiAttivi();  
    //carica pagina iniziale
    load('main.html');

    //nascondi la barra che mostra il progresso nella visualizzazione di un documento
    $('.progress').hide();

    $('#loading1').attr("class", "fa fa-cog fa-spin pull-right");
    
    //chiamata Ajax per caricare la pagina html ricercata
    $('form').on("submit", function(event) {
        if ($('#loading2').hasClass('fa') || $('#loading3').hasClass('fa') || $('#loading4').hasClass('fa')) {
            avviso("Non puoi aprire un nuovo documento quando un altro è ancora in fase di caricamento!");
        } else {
            event.preventDefault(); // previene il comportamento di default ed esegue la chiamata ajax
            var uri = $("input[name='uri']").val();
            $('.badgeAnnOnDocument').text(0 + " Totali");
            $('#grafo').empty();
            $('#grafo').append('<i class="fa fa-spinner fa-spin fa-3x"></i>');
            $('html, body').animate({ scrollTop: 0 }, 'slow');
            $('ann').find('span').parent().remove();
            if (uri !== '') {
                numeroAnnotazioni = 0;
                numAnnTot = 0;
                countCit = 0;
                activeURI = uri;
                newAnn = false;
                arrayAnnotazioni = []; // Cancello tutte le annotaizoni in corso
                numeroAnnotazioni = -1; // Azzero il contatore delle annotazioni
                $('#docs').collapse('hide');
                $('#ann').collapse('hide');
                $('#filt').collapse('hide');
                $("#pannelloPrincipale").html("<h3><i class='fa fa-spinner fa-spin fa-2x'></i>&nbsp; Caricamento del documento in corso...</h3>");
                $.ajax({
                    type : 'POST',
                    url : 'php/SetFrame.php',
                    data : 'uri=' + uri,
                    dataType : 'json',
                    success : function (result) {
                        title = result.title;
                        var url = result.url;
                        
                        var i = 0;
                        $('#docList').find('a').each(function (index) {
                            if ($(this).attr('title') === title)
                            {
                                i = index;
                            }
                        });
                        
                        var local = Math.ceil(i/10);
                        $('#pageNumber').text('Pagina ' + (local));
                        $('#docList').children().css('display','none').slice((local-1)*10, (local*10)).css('display', 'block');
                        $('.pager').attr("curr", local-1);

                        apriDocumento(title, url);
                        $('.badgeHeisenberg').text(numeroAnnotazioni + 1);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        avviso("Attenzione! L'indirizzo inserito punta ad una pagina inesistente, oppure non è corretto.");
                        load('main.html');
                    }
                });
            } else {
                avviso("Campo vuoto, immettere un URI per cercare una risorsa!");
            }
            // Azzeramento campo ricerca dopo l'invio
            $("input[name='uri']").prop('value', '');
            $(".progress-bar").css("width", "0%");
            $('.progress').fadeOut();
            $('.badgeHeisenberg').text(numeroAnnotazioni + 1);
        }
    });

    //carica i selettori degli anni di pubblicazione
    for (var i = 2015; i > 1800; i--)
    {
        $('#insertpubb').append($('<option>', {
            value: i,
            text: i
        }), '</option>');
        $('#insertpubb2').append($('<option>', {
            value: i,
            text: i
        }), '</option>');
        $('#insertpubb3').append($('<option>', {
            value: i,
            text: i
        }), '</option>');
    }
    
    applyFilters();

    buttonBinds();

    modalBinds();
    
    $('[data-toggle="tooltip"]').tooltip({'placement': 'bottom'});
});



function applyFilters()
{
    //aggiunge il filtro degli autori
    $('#filterAuthor').change(function () {
        if (!$(this).prop("checked"))
        {
            $('span[tipo="autore"]').removeClass('autore');
            $('span[tipo="autore"]').addClass('hidd');
            $('span[tipo="autore"]').removeClass('annotation');
            $('span[tipo="autore"]').css("pointerEvents", "none");
            $('#autoreDoc').hide();
            $('#autoreDocScrap').hide();
            numFiltri++;
            $('.badgeFiltri').text(numFiltri + " Attivi");
        }
        else 
        {   
            $('span[tipo="autore"]').addClass('annotation');
            $('span[tipo="autore"]').removeClass('hidd');
            $('span[tipo="autore"]').addClass('autore');
            $('span[tipo="autore"]').css("pointerEvents", "auto");
            $('#autoreDoc').show();
            $('#autoreDocScrap').show();
            numFiltri--;
            $('.badgeFiltri').text(numFiltri + " Attivi");
        }
    });
    //aggiunge il filtro dell'anno di pubblicazione
    $('#filterPublication').change(function () {
        if (!$(this).prop("checked"))
        {
            $('span[tipo="pubblicazione"]').removeClass('pubblicazione');
            $('span[tipo="pubblicazione"]').addClass('hidd');
            $('span[tipo="pubblicazione"]').removeClass('annotation');
            $('span[tipo="pubblicazione"]').css("pointerEvents", "none");
            $('#annoPubblicazioneDoc').hide();
            $('#annoPubblicazioneDocScrap').hide();
            numFiltri++;
            $('.badgeFiltri').text(numFiltri + " Attivi");
        }
        else 
        {   
            $('span[tipo="pubblicazione"]').addClass('annotation');
            $('span[tipo="pubblicazione"]').removeClass('hidd');
            $('span[tipo="pubblicazione"]').addClass('pubblicazione');
            $('span[tipo="pubblicazione"]').css("pointerEvents", "auto");
            $('#annoPubblicazioneDoc').show();
            $('#annoPubblicazioneDocScrap').show();
            numFiltri--;
            $('.badgeFiltri').text(numFiltri + " Attivi");
        }
    });
    //aggiunge il filtro del titolo
    $('#filterTitle').change(function () {
        if (!$(this).prop("checked"))
        {
            $('span[tipo="titolo"]').removeClass('titolo');
            $('span[tipo="titolo"]').addClass('hidd');
            $('span[tipo="titolo"]').removeClass('annotation');
            $('span[tipo="titolo"]').css("pointerEvents", "none");
            $('#titoloDoc').hide();
            $('#titoloDocScrap').hide();
            numFiltri++;
            $('.badgeFiltri').text(numFiltri + " Attivi");
        }
        else 
        {   
            $('span[tipo="titolo"]').addClass('annotation');
            $('span[tipo="titolo"]').removeClass('hidd');
            $('span[tipo="titolo"]').addClass('titolo');
            $('span[tipo="titolo"]').css("pointerEvents", "auto");
            $('#titoloDoc').show();
            $('#titoloDocScrap').show();
            numFiltri--;
            $('.badgeFiltri').text(numFiltri + " Attivi");
        }
    });
    //aggiunge il filtro dei DOI
    $('#filterDOI').change(function () {
        if (!$(this).prop("checked")) {
            $('span[tipo="doi"]').removeClass('doi');
            $('span[tipo="doi"]').addClass('hidd');
            $('span[tipo="doi"]').removeClass('annotation');
            $('span[tipo="doi"]').css("pointerEvents", "none");
            $('#doiDoc').hide();
            $('#doiDocScrap').hide();
            numFiltri++;
            $('.badgeFiltri').text(numFiltri + " Attivi");
        }
        else 
        {   
            $('span[tipo="doi"]').addClass('annotation');
            $('span[tipo="doi"]').removeClass('hidd');
            $('span[tipo="doi"]').addClass('doi');
            $('span[tipo="doi"]').css("pointerEvents", "auto");
            $('#doiDoc').show();
            $('#doiDocScrap').show();
            numFiltri--;
            $('.badgeFiltri').text(numFiltri + " Attivi");
        }
    });
    //aggiunge il filtro degli URL
    $('#filterURL').change(function () {
        if (!$(this).prop("checked"))
        {
            $('span[tipo="url"]').removeClass('url');
            $('span[tipo="url"]').addClass('hidd');
            $('span[tipo="url"]').removeClass('annotation');
            $('span[tipo="url"]').css("pointerEvents", "none");
            $('#urlDoc').hide();
            $('#urlDocScrap').hide();
            numFiltri++;
            $('.badgeFiltri').text(numFiltri + " Attivi");
        }
        else 
        {   
            $('span[tipo="url"]').addClass('annotation');
            $('span[tipo="url"]').removeClass('hidd');
            $('span[tipo="url"]').addClass('url');
            $('span[tipo="url"]').css("pointerEvents", "auto");
            $('#urlDoc').show();
            $('#urlDocScrap').show();
            numFiltri--;
            $('.badgeFiltri').text(numFiltri + " Attivi");
        }
    });
    
    //aggiunge il filtro dei commenti
    $('#filterComment').change(function () {
        if (!$(this).prop("checked"))
        {
            $('span[tipo="commento"]').removeClass('commento');
            $('span[tipo="commento"]').addClass('hidd');
            $('span[tipo="commento"]').removeClass('annotation');
            $('span[tipo="commento"]').css("pointerEvents", "none");
            numFiltri++;
            $('.badgeFiltri').text(numFiltri + " Attivi");
        }
        else 
        {   
            $('span[tipo="commento"]').addClass('annotation');
            $('span[tipo="commento"]').removeClass('hidd');
            $('span[tipo="commento"]').addClass('commento');
            $('span[tipo="commento"]').css("pointerEvents", "auto");
            numFiltri--;
            $('.badgeFiltri').text(numFiltri + " Attivi");
        } 
    });
    
    //aggiunge il filtro delle funzioni retoriche
    $('#filterRhet').change(function () {
        if (!$(this).prop("checked"))
        {
            $('span[tipo="retorica"]').removeClass('annotation');
            $('span[tipo="retorica"]').addClass('hidd');
            $('span[tipo="retorica"]').removeClass('retorica');
            $('span[tipo="retorica"]').css("pointerEvents", "none");
            numFiltri++;
            $('.badgeFiltri').text(numFiltri + " Attivi");
        }
        else 
        {
            $('span[tipo="retorica"]').addClass('annotation');
            $('span[tipo="retorica"]').removeClass('hidd');
            $('span[tipo="retorica"]').addClass('retorica');
            $('span[tipo="retorica"]').css("pointerEvents", "auto");
            numFiltri--;
            $('.badgeFiltri').text(numFiltri + " Attivi");
        } 
    });
    
    //aggiunge il filtro delle citazioni
    $('#filterQuote').change(function () {
        if (!$(this).prop("checked"))
        {
            $('span[tipo="citazione"]').removeClass('annotation');
            $('span[tipo="citazione"]').addClass('hidd');
            $('span[tipo="citazione"]').removeClass('citazione');
            $('span[tipo="citazione"]').css("pointerEvents", "none");
            numFiltri++;
            $('.badgeFiltri').text(numFiltri + " Attivi");
        }
        else 
        {
            $('span[tipo="citazione"]').addClass('annotation');
            $('span[tipo="citazione"]').removeClass('hidd');
            $('span[tipo="citazione"]').addClass('citazione');
            $('span[tipo="citazione"]').css("pointerEvents", "auto");
            numFiltri--;
            $('.badgeFiltri').text(numFiltri + " Attivi");
        } 
    });
    
}

function buttonBinds() 
{
    // bottone relativo al force scraping
    $('#scrape').click(function() {
        //verificaForce(activeURI);
        forceScraping(activeURI);
    });
    
    //IE fix --> in questo modo non si perde la selezione nel momento in cui si clicca per inserire un'annotazione sul
    //frammento selezionato; successivamente, vengono anche aggiunti alcuni event binders per i bottoni che permettono
    //la scelta dell'annotazione da inserire, in modo da gestirne meglio lo stile
    $('#bartab2').bind("mousedown", function (e) {
        e.preventDefault();
        int = true;
        
        newAnnotation('new');
        
        $(".shrinkable").removeClass("shrink");
            
        $("#author2").addClass("shrink");
        
        $(".shrinkable").hover(function(){
            var code = $(this).attr("id");
            $(".shrinkable[id='" + code + "']").addClass("active");
        },function(){
            var code = $(this).attr("id");
            $(".shrinkable[id='" + code + "']").removeClass("active");
        });
        
        $("#author2").click(function(){
            var code = $(this).attr("id");
            $(".shrinkable").removeClass("shrink");
            $(".shrinkable[id='" + code + "']").addClass("shrink");
        });
        
        $("#pubb2").click(function(){
            var code = $(this).attr("id");
            $(".shrinkable").removeClass("shrink");
            $(".shrinkable[id='" + code + "']").addClass("shrink");
        });
        
        $("#title2").click(function(){
            var code = $(this).attr("id");
            $(".shrinkable").removeClass("shrink");
            $(".shrinkable[id='" + code + "']").addClass("shrink");
        });
        
        $("#doi2").click(function(){
            var code = $(this).attr("id");
            $(".shrinkable").removeClass("shrink");
            $(".shrinkable[id='" + code + "']").addClass("shrink");
        });
        
        $("#url2").click(function(){
            var code = $(this).attr("id");
            $(".shrinkable").removeClass("shrink");
            $(".shrinkable[id='" + code + "']").addClass("shrink");
        });
        
        $("#comment").click(function(){
            var code = $(this).attr("id");
            $(".shrinkable").removeClass("shrink");
            $(".shrinkable[id='" + code + "']").addClass("shrink");
        });
        
        $("#rhetoric").click(function(){
            var code = $(this).attr("id");
            $(".shrinkable").removeClass("shrink");
            $(".shrinkable[id='" + code + "']").addClass("shrink");
        });
    });
    
    //come sopra, viene legato uno stile ai bottoni che permettono la scelta del tipo di annotazione
    $('#bartab1').bind("mousedown", function (e) {
        $(".shrinkable").removeClass("shrink");
            
        $("#author").addClass("shrink");
        
        $(".shrinkable").hover(function(){
            var code = $(this).attr("id");
            $(".shrinkable[id='" + code + "']").addClass("active");
        },function(){
            var code = $(this).attr("id");
            $(".shrinkable[id='" + code + "']").removeClass("active");
        });
        
        $("#author").click(function(){
            var code = $(this).attr("id");
            $(".shrinkable").removeClass("shrink");
            $(".shrinkable[id='" + code + "']").addClass("shrink");
        });
        
        $("#pubb").click(function(){
            var code = $(this).attr("id");
            $(".shrinkable").removeClass("shrink");
            $(".shrinkable[id='" + code + "']").addClass("shrink");
        });
        
        $("#title3").click(function(){
            var code = $(this).attr("id");
            $(".shrinkable").removeClass("shrink");
            $(".shrinkable[id='" + code + "']").addClass("shrink");
        });
        
        $("#doi").click(function(){
            var code = $(this).attr("id");
            $(".shrinkable").removeClass("shrink");
            $(".shrinkable[id='" + code + "']").addClass("shrink");
        });
        
        $("#url").click(function(){
            var code = $(this).attr("id");
            $(".shrinkable").removeClass("shrink");
            $(".shrinkable[id='" + code + "']").addClass("shrink");
        });
    });
    
    $('#bartab5').bind("mousedown", function (e) {
        $(".shrinkable").removeClass("shrink");
            
        $("#author3").addClass("shrink");
        
        $(".shrinkable").hover(function(){
            var code = $(this).attr("id");
            $(".shrinkable[id='" + code + "']").addClass("active");
        },function(){
            var code = $(this).attr("id");
            $(".shrinkable[id='" + code + "']").removeClass("active");
        });
        
        $("#author3").click(function(){
            var code = $(this).attr("id");
            $(".shrinkable").removeClass("shrink");
            $(".shrinkable[id='" + code + "']").addClass("shrink");
        });
        
        $("#pubb3").click(function(){
            var code = $(this).attr("id");
            $(".shrinkable").removeClass("shrink");
            $(".shrinkable[id='" + code + "']").addClass("shrink");
        });
        
        $("#title4").click(function(){
            var code = $(this).attr("id");
            $(".shrinkable").removeClass("shrink");
            $(".shrinkable[id='" + code + "']").addClass("shrink");
        });
        
        $("#doi3").click(function(){
            var code = $(this).attr("id");
            $(".shrinkable").removeClass("shrink");
            $(".shrinkable[id='" + code + "']").addClass("shrink");
        });
        
        $("#url3").click(function(){
            var code = $(this).attr("id");
            $(".shrinkable").removeClass("shrink");
            $(".shrinkable[id='" + code + "']").addClass("shrink");
        });
    });
    
    //mostra la barra di interazione con il documento solo se si è in modalità annotator
    $('#modalita').change(function () {
        if ($(this).prop('checked') === false) {
            $('#modalLogin').modal('show');
            if (currentGraph !== "Heisenberg") {
                $('#hideButtonBar').fadeIn();
            } else {
                $('.nav-tabs').fadeIn();
            }
        } else {
            $(".progress-bar").css("background-color", "#5bc0de");
            username = "";
            email = "";
            $('#usrnm').val('');
            $('#email').val('');
            $('.nav-tabs').fadeOut();
            $('#hideButtonBar').fadeOut();
        }
    });
    
    $('#annotationquote').on('click', function (event) {event.preventDefault();  annoteOverQuote(); sendEvent("#citationModal", 3);});
    $('#managequote').on('click', function (event) {event.preventDefault();  manageQuoteAnnotations(); sendEvent("#citationModal", 5);});
    $('#savequote').on('click', function (event) {event.preventDefault();  saveQuote(); sendEvent("#citationModal", 6);});
    
    //associa le azioni ai pulsanti della barra principale; tre cambiano il background dei pannelli principali, uno riporta alla home
    $("#chiaro").click(function () {
        $("#contenitorePrincipale").css("background-color", "rgb(253,253,253)");
        $("#pannelloPrincipale").css("color", "rgb(49,49,49)");
    });
    $("#scuro").click(function () {
        $("#contenitorePrincipale").css("background-color", "rgb(41,41,41)");
        $("#pannelloPrincipale").css("color", "white");
    });
    $("#seppia").click(function () {
        $("#contenitorePrincipale").css("background-color", "rgb(251,240,214)");
        $("#pannelloPrincipale").css("color", "rgb(91,70,52)");
    });
    
    $("#home").click(function () {
        activeURI = "";
        arrayAnnotazioni = [];
        numeroAnnotazioni = -1;
        $('#docs').collapse('hide');
        $('#ann').collapse('hide');
        $('#ann2').collapse('hide');
        $('#filt').collapse('hide');
        $("#contenitorePrincipale").css("background-color", "rgb(253,253,253)");
        $("#pannelloPrincipale").css("color", "rgb(49,49,49)");
        
        if (!$('#modalita').is(':checked')) {
            $('#hideButtonBar').fadeIn();
            $('#buttonBar').fadeOut();
        }
        
        $('.badgeAnnOnDocument').text("0 Totali");
        $('#grafo').empty();
        createGraphsButtons(graphs);
        load("main.html");
    });
}

function modalBinds()
{
    //resetta il modale di inserimento delle annotazioni sui frammenti
    $('#insert-modal-2').on('hide.bs.modal', function (e){
        sendEvent('#insert-modal-2', 1);
         $('#selectauthor2 option[selected="selected"]').each(
            function() {
                $(this).removeAttr('selected');
            }
        );
        $("#selectauthor2 option:first").attr('selected','selected');
        $('#insertauthor2').val('');
        
        $('#insertpubb2 option[selected="selected"]').each(
            function() {
                $(this).removeAttr('selected');
            }
        );
        $("#insertpubb2 option:first").attr('selected','selected');

        $('#inserttitle2').val('');
        $('#insertdoi2').val('');
        $('#inserturl2').val('');
        
        $('#insertcomment').val('');

        $('#insertreth option[selected="selected"]').each(
            function() {
                $(this).removeAttr('selected');
            }
        );
        $("#insertreth option:first").attr('selected','selected');

        $('#insertquote').val('');
        switchToAuthor2();
    });
    
    //resetta il modale di inserimento delle annotazioni sul documento
    $('#insert-modal-1').on('hide.bs.modal', function (e){
        sendEvent('#insert-modal-1', 1);
        $('#selectauthor option[selected="selected"]').each(
            function() {
                $(this).removeAttr('selected');
            }
        );
        $("#selectauthor option:first").attr('selected','selected');
        $('#insertauthor').val('');
        
        $('#insertpubb option[selected="selected"]').each(
            function() {
                $(this).removeAttr('selected');
            }
        );
        $("#insertpubb option:first").attr('selected','selected');

        $('#inserttitle').val('');
        $('#insertdoi').val('');
        $('#inserturl').val('');
        switchToAuthor();
    });
    
    $('#citationModal').on('hide.bs.modal', function (e){
        sendEvent('#citationModal', 1);
        $('#avantiif').disable(false);
         $('#selectauthor3 option[selected="selected"]').each(
            function() {
                $(this).removeAttr('selected');
            }
        );
        $("#selectauthor3 option:first").attr('selected','selected');
        $('#insertauthor3').val('');
        
        $('#insertpubb3 option[selected="selected"]').each(
            function() {
                $(this).removeAttr('selected');
            }
        );
        $("#insertpubb3 option:first").attr('selected','selected');

        $('#inserttitle3').val('');
        $('#insertdoi3').val('');
        $('#inserturl3').val('');
        switchToAuthor3();
    });
        
    //resetta il modale che mostra i dettagli delle annotazioni
    $('#modalAnnotazione').on('hide.bs.modal', function (e){
        $('#bodyAnnotazione').empty();
        $('div.view').remove();
    });
}

function modalSwitcher() {
    $("#modalModificaAnnotazione").modal("hide");
    $("#modalGestioneAnnotazioni").modal("show");
}
