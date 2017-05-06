/* global numeroAnnotazioni, time, arrayAnnotazioni, temporaryQuoteArray, listElement, numPages, perPage, istanzeAutori, activeURI, graphs, databaseAnnotations, title, countAnnotazioniAutomatiche, numeroAnnEsterne, heisenbergJson */

//serie di funzioni che mostra il campo opportuno per l'inserimento di un'annotazione; si tratta di autore, anno di 
//pubblicazione, titolo, doi, url, commento, funzione retorica e citazione. viene usato css per nascondere o mostrare
//gli elementi opportuni
function switchToAuthor()
{
    $('#inserimentoautore').css("display", "block");
    $('#inserimentopubblicazione').css("display", "none");
    $('#inserimentotitolo').css("display", "none");
    $('#inserimentodoi').css("display", "none");
    $('#inserimentourl').css("display", "none");
    $('#errorAuthor2').css("display", "none");
    $('#errorType2').css("display", "none");
}

function switchToPubblication()
{
    if ($('#pubblication').prop("checked", true)) {
        $('#inserimentoautore').css("display", "none");
        $('#inserimentopubblicazione').css("display", "block");
        $('#inserimentotitolo').css("display", "none");
        $('#inserimentodoi').css("display", "none");
        $('#inserimentourl').css("display", "none");
        $('#errorAuthor2').css("display", "none");
        $('#errorType2').css("display", "none");
    } 
}

function switchToTitle()
{
    if ($('#title').prop("checked", true)) {
        $('#inserimentoautore').css("display", "none");
        $('#inserimentopubblicazione').css("display", "none");
        $('#inserimentotitolo').css("display", "block");
        $('#inserimentodoi').css("display", "none");
        $('#inserimentourl').css("display", "none");
        $('#errorAuthor2').css("display", "none");
        $('#errorType2').css("display", "none");
    } 
}

function switchToDOI()
{
    if ($('#doi').prop("checked", true)) {
        $('#inserimentoautore').css("display", "none");
        $('#inserimentopubblicazione').css("display", "none");
        $('#inserimentotitolo').css("display", "none");
        $('#inserimentodoi').css("display", "block");
        $('#inserimentourl').css("display", "none");
        $('#errorAuthor2').css("display", "none");
        $('#errorType2').css("display", "none");
    } 
}

function switchToURL()
{
    if ($('#url').prop("checked", true)) {
        $('#inserimentoautore').css("display", "none");
        $('#inserimentopubblicazione').css("display", "none");
        $('#inserimentotitolo').css("display", "none");
        $('#inserimentodoi').css("display", "none");
        $('#inserimentourl').css("display", "block");
        $('#errorAuthor2').css("display", "none");
        $('#errorType2').css("display", "none");
    } 
}

function switchToAuthor2()
{
    $('#inserimentoautore2').css("display", "block");
    $('#inserimentopubblicazione2').css("display", "none");
    $('#inserimentotitolo2').css("display", "none");
    $('#inserimentodoi2').css("display", "none");
    $('#inserimentourl2').css("display", "none");
    $('#inserimentocommento').css("display", "none");
    $('#inserimentoretorica').css("display", "none");
    $('#errorAuthor').css("display", "none");
    $('#errorType').css("display", "none");
}

function switchToPubblication2()
{
    if ($('#pubblication2').prop("checked", true)) {
        $('#inserimentoautore2').css("display", "none");
        $('#inserimentopubblicazione2').css("display", "block");
        $('#inserimentotitolo2').css("display", "none");
        $('#inserimentodoi2').css("display", "none");
        $('#inserimentourl2').css("display", "none");
        $('#inserimentocommento').css("display", "none");
        $('#inserimentoretorica').css("display", "none");
        $('#errorAuthor').css("display", "none");
        $('#errorType').css("display", "none");
    } 
}

function switchToTitle2()
{
    if ($('#title2').prop("checked", true)) {
        $('#inserimentoautore2').css("display", "none");
        $('#inserimentopubblicazione2').css("display", "none");
        $('#inserimentotitolo2').css("display", "block");
        $('#inserimentodoi2').css("display", "none");
        $('#inserimentourl2').css("display", "none");
        $('#inserimentocommento').css("display", "none");
        $('#inserimentoretorica').css("display", "none");
        $('#errorAuthor').css("display", "none");
        $('#errorType').css("display", "none");
    } 
}

function switchToDOI2()
{
    if ($('#doi2').prop("checked", true)) {
        $('#inserimentoautore2').css("display", "none");
        $('#inserimentopubblicazione2').css("display", "none");
        $('#inserimentotitolo2').css("display", "none");
        $('#inserimentodoi2').css("display", "block");
        $('#inserimentourl2').css("display", "none");
        $('#inserimentocommento').css("display", "none");
        $('#inserimentoretorica').css("display", "none");
        $('#errorAuthor').css("display", "none");
        $('#errorType').css("display", "none");
    } 
}

function switchToURL2()
{
    if ($('#url2').prop("checked", true)) {
        $('#inserimentoautore2').css("display", "none");
        $('#inserimentopubblicazione2').css("display", "none");
        $('#inserimentotitolo2').css("display", "none");
        $('#inserimentodoi2').css("display", "none");
        $('#inserimentourl2').css("display", "block");
        $('#inserimentocommento').css("display", "none");
        $('#inserimentoretorica').css("display", "none");
        $('#errorAuthor').css("display", "none");
        $('#errorType').css("display", "none");
    } 
}

function switchToComment()
{
    if ($('#comment').prop("checked", true)) {
        $('#inserimentoautore2').css("display", "none");
        $('#inserimentopubblicazione2').css("display", "none");
        $('#inserimentotitolo2').css("display", "none");
        $('#inserimentodoi2').css("display", "none");
        $('#inserimentourl2').css("display", "none");
        $('#inserimentocommento').css("display", "block");
        $('#inserimentoretorica').css("display", "none");
        $('#errorAuthor').css("display", "none");
        $('#errorType').css("display", "none");
    } 
}

function switchToRhetoric()
{
    if ($('#rhetoric').prop("checked", true)) {
        $('#inserimentoautore2').css("display", "none");
        $('#inserimentopubblicazione2').css("display", "none");
        $('#inserimentotitolo2').css("display", "none");
        $('#inserimentodoi2').css("display", "none");
        $('#inserimentourl2').css("display", "none");
        $('#inserimentocommento').css("display", "none");
        $('#inserimentoretorica').css("display", "block");
        $('#errorAuthor').css("display", "none");
        $('#errorType').css("display", "none");
    } 
}

function switchToAuthor3()
{
    $('#inserimentoautore3').css("display", "block");
    $('#inserimentopubblicazione3').css("display", "none");
    $('#inserimentotitolo3').css("display", "none");
    $('#inserimentodoi3').css("display", "none");
    $('#inserimentourl3').css("display", "none");
    $('#errorAuthor3').css("display", "none");
    $('#errorType3').css("display", "none");
}

function switchToPubblication3()
{
    if ($('#pubblication3').prop("checked", true)) {
        $('#inserimentoautore3').css("display", "none");
        $('#inserimentopubblicazione3').css("display", "block");
        $('#inserimentotitolo3').css("display", "none");
        $('#inserimentodoi3').css("display", "none");
        $('#inserimentourl3').css("display", "none");
        $('#errorAuthor3').css("display", "none");
        $('#errorType3').css("display", "none");
    } 
}

function switchToTitle3()
{
    if ($('#title4').prop("checked", true)) {
        $('#inserimentoautore3').css("display", "none");
        $('#inserimentopubblicazione3').css("display", "none");
        $('#inserimentotitolo3').css("display", "block");
        $('#inserimentodoi3').css("display", "none");
        $('#inserimentourl3').css("display", "none");
        $('#errorAuthor3').css("display", "none");
        $('#errorType3').css("display", "none");
    } 
}

function switchToDOI3()
{
    if ($('#doi3').prop("checked", true)) {
        $('#inserimentoautore3').css("display", "none");
        $('#inserimentopubblicazione3').css("display", "none");
        $('#inserimentotitolo3').css("display", "none");
        $('#inserimentodoi3').css("display", "block");
        $('#inserimentourl3').css("display", "none");
        $('#errorAuthor3').css("display", "none");
        $('#errorType3').css("display", "none");
    } 
}

function switchToURL3()
{
    if ($('#url3').prop("checked", true)) {
        $('#inserimentoautore3').css("display", "none");
        $('#inserimentopubblicazione3').css("display", "none");
        $('#inserimentotitolo3').css("display", "none");
        $('#inserimentodoi3').css("display", "none");
        $('#inserimentourl3').css("display", "block");
        $('#errorAuthor3').css("display", "none");
        $('#errorType3').css("display", "none");
    } 
}

//verifica che l'utente abbia inserito username e email, o mostra un messaggio di errore
function checkUsrInput()
{
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    var check = 0;
    var format = false;
    if ($("#usrnm").val())
    {
        $('#usrnm').parent().removeClass('has-error has-feedback');
        $('#usrnm').parent().find('span').remove();  
        check++;
    }
    else 
    {
        $('#usrnm').parent().addClass('has-error has-feedback');
        $('#usrnm').parent().append('<span class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true">' +
                '</span><span id="inputErrorStatus" class="sr-only">(error)</span>');
    }
    if ($("#email").val().match(re))
    {
        if ($("#email").val() !== "raschietto@ltw1545.web.cs.unibo.it") {
            $('#email').parent().removeClass('has-error has-feedback');
            $('#email').parent().find('span').remove();
            check++;
        } else {
            $('#email').parent().addClass('has-error has-feedback');
            $('#email').parent().append('<span class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true">' +
                '</span><span id="inputErrorStatus" class="sr-only">(error)</span>');
            if ($('#email').val() !== "") format = true;
        }
    }
    else 
    {
        $('#email').parent().addClass('has-error has-feedback');
        $('#email').parent().append('<span class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true">' +
            '</span><span id="inputErrorStatus" class="sr-only">(error)</span>');
        if ($('#email').val() !== "") format = true;
    }
    
    if (check === 2) 
    {
        $('#errorInput').css("display", "none");
        $('#errorInput2').css("display", "none");
        login();
    }
    else if (format && check === 1)
    {
        $('#errorInput2').css("display", "block");
        $('#errorInput').css("display", "none");
    }
    else if (format && check === 0)
    { 
        $('#errorInput2').css("display", "block");
        $('#errorInput').css("display", "block");
    }
    else {
        $('#errorInput').css("display", "block");
        $('#errorInput2').css("display", "none");
    }
}

//verifica che l'utente abbia compilato il campo con i dati dell'annotazione
function checkTypeInput()
{
    var val;
    var actual;
    if ($('#inserimentocommento').css('display') === 'block') {
        actual = '#insertcomment';
        val = $(actual).val();
    } else if ($('#inserimentoautore2').css('display') === 'block') {
        if ($('#selectauthor2 option:selected').val() === "nothing") {
            actual = '#insertauthor2';
            val = $(actual).val();
        }
        else {
            actual = '#selectauthor2';
            val = $('#selectauthor2 option:selected').val();
        }
    } else if ($('#inserimentotitolo2').css('display') === 'block') {
        actual = '#inserttitle2'; 
        val = $(actual).val();
    } else if ($('#inserimentodoi2').css('display') === 'block') {
        actual = '#insertdoi2'; 
        val = $(actual).val();
    } else if ($('#inserimentourl2').css('display') === 'block') {
        actual = '#inserturl2'; 
        val = $(actual).val();
    }
    if (val !== "" && actual !== '#insertauthor2')
    {
        clearErrors(2);
        sendEvent('#insert-modal-2', 3);
        flag('insert');
        newAnn = true;
        setAnnotation();
    } else if (($('#inserimentoretorica').css('display') === 'block') || ($('#inserimentopubblicazione').css('display') === 'block'))
    {
        clearErrors(2);
    }
    else if (actual === '#insertauthor2') {
        var prova = val.trim();
        if (prova === "")
        {
            $('#errorType').css("display", "block");
            $(actual).parent().addClass('has-error');
            $(actual).parent().append('</span><span id="inputErrorStatus" class="sr-only">(error)</span>');
        } else if (!hasWhiteSpace(prova))
        {
            $('#errorType').css("display", "none");
            $('#errorAuthor').css("display", "block");
            $(actual).parent().addClass('has-error');
            $(actual).parent().append('</span><span id="inputErrorStatus" class="sr-only">(error)</span>');
        }
        else {
            clearErrors(2);
            sendEvent('#insert-modal-2', 3);
            flag('insert');
            newAnn = true;
            setAnnotation();
        }
    }
    else 
    {
        $('#errorType').css("display", "block");
        $(actual).parent().addClass('has-error');
        $(actual).parent().append('</span><span id="inputErrorStatus" class="sr-only">(error)</span>');
    }
}

//verifica che l'utente abbia compilato il campo con i dati dell'annotazione
function checkTypeInput2() 
{
    var val;
    var actual;
    if ($('#inserimentoautore').css('display') === 'block') {
        if ($('#selectauthor option:selected').val() === "nothing") {
            actual = '#insertauthor';
            val = $(actual).val();
        }
        else {
            actual = '#selectauthor';
            val = $('#selectauthor option:selected').val();
        }
    } else if ($('#inserimentotitolo').css('display') === 'block') {
        actual = '#inserttitle'; 
        val = $(actual).val();
    } else if ($('#inserimentodoi').css('display') === 'block') {
        actual = '#insertdoi'; 
        val = $(actual).val();
    } else if ($('#inserimentourl').css('display') === 'block') {
        actual = '#inserturl'; 
        val = $(actual).val();
    }
    
    if (val !== "" && actual !== '#insertauthor')
    {
        clearErrors(1);
        sendEvent('#insert-modal-1', 2);
        newAnn = true;
        insertDocAnnotation();
    } 
    else if ($('#inserimentopubblicazione').css('display') === 'block')
    {
        clearErrors(1);
    }
    else if (actual === '#insertauthor') {
        var prova = val.trim();
        if (prova === "")
        {
            $('#errorType2').css("display", "block");
            $(actual).parent().addClass('has-error');
            $(actual).parent().append('</span><span id="inputErrorStatus" class="sr-only">(error)</span>');
        }
        else if (!hasWhiteSpace(prova))
        {
            $('#errorType2').css("display", "none");
            $('#errorAuthor2').css("display", "block");
            $(actual).parent().addClass('has-error');
            $(actual).parent().append('</span><span id="inputErrorStatus" class="sr-only">(error)</span>');
        }
        else {
            clearErrors(1);
            sendEvent('#insert-modal-1', 2);
            newAnn = true;
            insertDocAnnotation();
        }
    }
    else 
    {
        $('#errorType2').css("display", "block");
        $(actual).parent().addClass('has-error');
        $(actual).parent().append('</span><span id="inputErrorStatus" class="sr-only">(error)</span>');
    }
}

function checkTypeInput3() 
{
    var val;
    var actual;
    if ($('#inserimentoautore3').css('display') === 'block') {
        if ($('#selectauthor3 option:selected').val() === "nothing") {
            actual = '#insertauthor3';
            val = $(actual).val();
        }
        else {
            actual = '#selectauthor3';
            val = $('#selectauthor3 option:selected').val();
        }
    } else if ($('#inserimentotitolo3').css('display') === 'block') {
        actual = '#inserttitle3'; 
        val = $(actual).val();
    } else if ($('#inserimentodoi3').css('display') === 'block') {
        actual = '#insertdoi3'; 
        val = $(actual).val();
    } else if ($('#inserimentourl3').css('display') === 'block') {
        actual = '#inserturl3'; 
        val = $(actual).val();
    }
    
    if (val !== "" && actual !== '#insertauthor3')
    {
        clearErrors(3);
        sendEvent('#citationModal', 4);
        insertQuoteAnnotation();
    } 
    else if ($('#inserimentopubblicazione3').css('display') === 'block')
    {
        clearErrors(3);
    }
    else if (actual === '#insertauthor3') {
        var prova = val.trim();
        if (prova === "")
        {
            $('#errorType3').css("display", "block");
            $(actual).parent().addClass('has-error');
            $(actual).parent().append('</span><span id="inputErrorStatus" class="sr-only">(error)</span>');
        }
        else if (!hasWhiteSpace(prova))
        {
            $('#errorType3').css("display", "none");
            $('#errorAuthor3').css("display", "block");
            $(actual).parent().addClass('has-error');
            $(actual).parent().append('</span><span id="inputErrorStatus" class="sr-only">(error)</span>');
        }
        else {
            clearErrors(3);
            sendEvent('#citationModal', 4);
            insertQuoteAnnotation();
        }
    }
    else 
    {
        $('#errorType3').css("display", "block");
        $(actual).parent().addClass('has-error');
        $(actual).parent().append('</span><span id="inputErrorStatus" class="sr-only">(error)</span>');
    }
}

//svuota il modale che mostra le annotazioni
function resetAnnotationModal()
{
    contatoreDisplay = 0;
}

function clearErrors(modal) 
{
    if (modal === 1) 
    {
        $('#errorAuthor2').css("display", "none");
        $('#errorType2').css("display", "none");
        $('#insertauthor').parent().removeClass('has-error');
        $('#insertauthor').parent().find('span').remove();
        $('#inserttitle').parent().removeClass('has-error');
        $('#inserttitle').parent().find('span').remove();
        $('#insertdoi').parent().removeClass('has-error');
        $('#insertdoi').parent().find('span').remove();
        $('#inserturl').parent().removeClass('has-error');
        $('#inserturl').parent().find('span').remove();
    }
    else if (modal === 2) 
    {
        $('#errorAuthor').css("display", "none");
        $('#errorType').css("display", "none");
        $('#insertauthor2').parent().removeClass('has-error');
        $('#insertauthor2').parent().find('span').remove();
        $('#inserttitle2').parent().removeClass('has-error');
        $('#inserttitle2').parent().find('span').remove();
        $('#insertdoi2').parent().removeClass('has-error');
        $('#insertdoi2').parent().find('span').remove();
        $('#inserturl2').parent().removeClass('has-error');
        $('#inserturl2').parent().find('span').remove();
        $('#insertcomment').parent().removeClass('has-error');
        $('#insertcomment').parent().find('span').remove();
    } 
    else if (modal === 3) 
    {
        $('#errorAuthor3').css("display", "none");
        $('#errorType3').css("display", "none");
        $('#insertauthor3').parent().removeClass('has-error');
        $('#insertauthor3').parent().find('span').remove();
        $('#inserttitle3').parent().removeClass('has-error');
        $('#inserttitle3').parent().find('span').remove();
        $('#insertdoi3').parent().removeClass('has-error');
        $('#insertdoi3').parent().find('span').remove();
        $('#inserturl3').parent().removeClass('has-error');
        $('#inserturl3').parent().find('span').remove();
    }
}

//permette di seguire lo scorrimento del documento mostrandone il progresso sull'apposita barra
function scrollBar() {
    $(window).on("scroll", function () {
        var s = $(window).scrollTop(),
                d = $(document).height(),
                c = $(window).height();
        scrollPercent = (s / (d - c)) * 100;
        var position = scrollPercent;
        $(".progress-bar").css("width", "" + position + "%");
    });
}

//questa funzione permette di selezionare il frammento selezionato e successivamente mostrarlo nel pannello specifico
//nel modale per l'inserimento di un'annotazione su un frammento. ho preso spunto dal codice mostrato al link:
//http://stackoverflow.com/questions/5222814/window-getselection-return-html
function getSelectedText() {
    var text = "";
    if (typeof window.getSelection !== "undefined") {
        var sel = window.getSelection();
        if (sel.rangeCount) {
            var container = document.createElement("div");
            for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                container.appendChild(sel.getRangeAt(i).cloneContents());
            }
            text = container.innerHTML;
        }
    } else if (typeof document.selection !== "undefined") {
        if (document.selection.type === "Text") {
            text = document.selection.createRange().htmlText;
        }
    }
    return text;
}
   
function doSomethingWithSelectedText() {
    var selectedText = getSelectedText();
    fragmentselection = selectedText;
}
    
document.onmouseup = doSomethingWithSelectedText;

//ricava il testo selezionato permettendone l'uso; si differenzia dalla precedente, poichè con questo tipo di selezione
//è possibile operare direttamente sui nodi
function selection() {
    if (document.getSelection) {
        return document.getSelection();
    } else if (document.selection) {
        return document.selection.createRange().text;
    }
}

//rimuove la selezione, nel senso che non risulta più esservi testo selezionato
function clearSelection() {
    if (window.getSelection) {
        if (window.getSelection().empty) {
            window.getSelection().empty();
        } else if (window.getSelection().removeAllRanges) {
            window.getSelection().removeAllRanges();
        }
    } else if (document.selection) {
        document.selection.empty();
    }
}

//scorrimento delle pagine dei modali multi-step
sendEvent = function (sel, step) {
    $(sel).trigger('next.m.' + step);
};

//determina l'ora e la data corrente
function currentTime()
{
    dt = new Date();
    var hours = "";
    var minutes = "";
    var seconds = "";
    if (dt.getHours() < 10)
        hours = "0" + dt.getHours();
    else hours = dt.getHours();
    if (dt.getMinutes() < 10)
        minutes = "0" + dt.getMinutes();
    else minutes = dt.getMinutes();
    if (dt.getSeconds() < 10)
        seconds = "0" + dt.getSeconds();
    else seconds = dt.getSeconds();
    time = dt.getDate() + "/" + (dt.getMonth()+1) + "/" + dt.getFullYear() + " " + hours + ":" + minutes + ":" + seconds;
}

//gestisce alcune flag
function flag(something)
{
    switch(something)
    {
        case 'insert': insert=true;
            break;
    }
}

//permette di evidenziare per intero un'annotazione quando il mouse è sopra di essa; come funziona?
//viene aggiunta una classe ad ogni span con classe "annotation" e codice come quello dell'annotazione su cui si trova
//il mouse; la classe aggiunta fornisce un'ombra all'annotazione, facendola sembrare evidenziata
function onHover() 
{
    $(".autore").hover(function(){
        var code = $(this).attr("codice");
        $(".autore[codice="+code+"]").addClass("highlight");
    },function(){        
        var code = $(this).attr("codice");
        $(".autore[codice="+code+"]").removeClass("highlight");
    });
    $(".pubblicazione").hover(function(){
        var code = $(this).attr("codice");
        $(".pubblicazione[codice="+code+"]").addClass("highlight");
    },function(){        
        var code = $(this).attr("codice");
        $(".pubblicazione[codice="+code+"]").removeClass("highlight");
    });
    $(".titolo").hover(function(){
        var code = $(this).attr("codice");
        $(".titolo[codice="+code+"]").addClass("highlight");
    },function(){        
        var code = $(this).attr("codice");
        $(".titolo[codice="+code+"]").removeClass("highlight");
    });
    $(".doi").hover(function(){
        var code = $(this).attr("codice");
        $(".doi[codice="+code+"]").addClass("highlight");
    },function(){        
        var code = $(this).attr("codice");
        $(".doi[codice="+code+"]").removeClass("highlight");
    });
    $(".url").hover(function(){
        var code = $(this).attr("codice");
        $(".url[codice="+code+"]").addClass("highlight");
    },function(){        
        var code = $(this).attr("codice");
        $(".url[codice="+code+"]").removeClass("highlight");
    });
    $(".commento").hover(function(){
        var code = $(this).attr("codice");
        $(".commento[codice="+code+"]").addClass("highlight");
    },function(){        
        var code = $(this).attr("codice");
        $(".commento[codice="+code+"]").removeClass("highlight");
    });
    $(".retorica").hover(function(){
        var code = $(this).attr("codice");
        $(".retorica[codice="+code+"]").addClass("highlight");
    },function(){        
        var code = $(this).attr("codice");
        $(".retorica[codice="+code+"]").removeClass("highlight");
    });
    $(".citazione").hover(function(){
        var code = $(this).attr("codice");
        $(".citazione[codice="+code+"]").addClass("highlight");
    },function(){        
        var code = $(this).attr("codice");
        $(".citazione[codice="+code+"]").removeClass("highlight");
    });
}

// Messaggio d'errore personalizzato
function avviso(msg) {
    $("#sgrido").empty();
    $("#sgrido").append(msg);
    $("#modalWarning").modal("show");
}

//riposiziona la checkbox se si chiude il modale di login senza aver completato la procedura
function untoggleCheckbox()
{
    $('#modalita').bootstrapToggle('on');
}

//effettua il login
function login()
{
    username = $('#usrnm').val().trim();
    email = $('#email').val().trim();
    $('.progress-bar').css("background-color", "#ec971f");
    $('#modalLogin').modal('hide');
}

//determina se una stringa ha spazi vuoti
function hasWhiteSpace(s) {
  return s.indexOf(' ') >= 0;
}

//metodo per creare una pagination nel pannello lista documenti
//special thanks to http://stackoverflow.com/questions/17390179/using-bootstrap-to-paginate-a-set-number-of-p-elements-on-a-webpage
function pageList(){
    var listElement = $('#docList');
    var perPage = 10; 
    var numItems = listElement.children().size();
    var numPages = Math.ceil(numItems/perPage);

    $('.pager').empty();
    $('.pager').append('<li class="previous"><a class="disabled" href="#" id="previous" aria-label="Previous"><span aria-hidden="true"><i class="fa fa-long-arrow-left"></i></span></a></li>' +
                       '<li><h3 id="pagerNumberOfPages"><span class="label label-info" id="pageNumber">Nessuna pagina</span></h3></li>' + 
                       '<li class="next"><a class="disabled" href="#" id="next" aria-label="Next"><span aria-hidden="true"><i class="fa fa-long-arrow-right"></i></span></a></li>');

    $('.pager').attr("curr", 0);
    
    //gestisco i tasti: disabilitati se le pagine sono < 2
    if (numPages < 2) {
        $('#previous').addClass('disabled');
        $('#next').addClass('disabled');
    }
    else {
        $('#previous').removeClass('disabled');
        $('#next').removeClass('disabled');
    }
    
    $('.pager .page_link:first').addClass('active');

    listElement.children().css('display', 'none');
    
    $('#pageNumber').text('Pagina ' + 1);
    listElement.children().slice(0, perPage).css('display', 'block');

    //funzione click: se le pagine sono >=2, invio l'azione
    $('.pager li a').click(function(){
        if (numPages >= 2) {
            if (this.id === 'previous') previous();
            else next();
        }
    });
    
    //carica la pagina precedente
    function previous(){
        if (typeof $('.pager').attr('curr') !== "undefined") 
            goToPage = parseInt($('.pager').attr('curr')) - 1;
        else goToPage = parseInt($('.pager').data("curr"));
        if (goToPage >= 0)
            goTo(goToPage);
    }

    //carica la pagina successiva
    function next(){
        if (typeof $('.pager').attr('curr') !== "undefined") 
            goToPage = parseInt($('.pager').attr('curr')) + 1;
        else goToPage = parseInt($('.pager').data("curr")) + 1;
        if (goToPage < numPages)
            goTo(goToPage);
    }
    
    //va alla pagina voluta
    function goTo(page){
        $('#pageNumber').text('Pagina ' + (page+1));
        var startAt = page * perPage,
        endOn = startAt + perPage;
        listElement.children().css('display','none').slice(startAt, endOn).css('display','block');
        $('.pager').attr("curr", page);
    }
}

//carica le istanze di autori nei selector
function updateAutori() {
    $('#selectauthor').empty();
    $('#selectauthor2').empty();
    $('#selectauthor3').empty();
    $('#selectauthor4').empty();

    $('#selectauthor').append('<option value="nothing">Seleziona');
    $('#selectauthor2').append('<option value="nothing">Seleziona');
    $('#selectauthor3').append('<option value="nothing">Seleziona');
    $('#selectauthor4').append('<option value="nothing">Seleziona');

    for (var i = 0; i < istanzeAutori.length; i++) {
        if(istanzeAutori[i].split(" ").length !== 1) {
            $('#selectauthor').append('<option value="' + istanzeAutori[i] + '">' + istanzeAutori[i]);
            $('#selectauthor2').append('<option value="' + istanzeAutori[i] + '">' + istanzeAutori[i]);
            $('#selectauthor3').append('<option value="' + istanzeAutori[i] + '">' + istanzeAutori[i]);
            $('#selectauthor4').append('<option value="' + istanzeAutori[i] + '">' + istanzeAutori[i]);
        }
    }
}

//crea i bottoni che permettono di selezionare il grafo // DA MODIFICARE ***********************************************
function createGraphsButtons(names) {
    $('.badgeGrafi').text("0 Grafi");
    $('#grafo').empty();
    
    $(names).each(function () {
        var nome = "";
        nome = '<i class="fa fa-star-o">  ' + this['nome'] + '</i>';
        $('#grafo').append('<a class="list-group-item graph disabled" href="#" id="' + this['nome'].replace(/ /g,'') + '">' + nome + '</a>');
    });
    $('.badgeGrafi').text(graphs.length + " Grafi");
    $('#loading4').attr('class', '');
}

// questo metodo è simile ma andrà a sostituire il createGraphButton con il numero delle annotazioni settate. In pratica
// fa un append del nome che gli viene passato come metodo (per esempio The Scraper') e assegna in sua corrispondenda
// un badge che identifica il numero delle annotazioni. Quest'ultimo viene settato in base alla lunghezza dell'array
// anche esso passato come parametro. Tale array si ottiene dal risultato dalla query.
// Nel momento in cui viene pigiato, fa stampa le annotazioni del gruppo scelto (di default viene scelto il grafo di tutti)
// il quale contiente le annotazioni di tutti.
function replaceGraphsButton(json, nome, index, uri){
    
    var name = "";
    name = '<i class="fa fa-star">  ' + nome + '</i>';
    $('#grafo').append('<a class="list-group-item graph disabled" href="#" id="' + index + '">' + name + '</a>');
    newAnn = false;
    numeroAnnotazioniInCorso = 0;
    numeroMassimoAnnotazioni = 0;
    
    if (nome === "Tutti") {
        var numeroAnnot = 0;
        for (var i = 0; i < json.length; i++) {
            numeroAnnot += Object.keys(json[i].results.bindings).length;
        }
        
        $('#'+ index +'').click(function ()
        {
            $('#annotationPanel').find('span').parent().remove();
            clearAllFragments(); // eventualmente metterlo prima 
    
            numAnnTot = 0;
            $('.badgeAnnOnDocument').text(numAnnTot + " Totali");
              
            currentGraph = nome;
            if (!$('#modalita').is(':checked')) {
                $('#hideButtonBar').fadeIn();
                $('#buttonBar').fadeOut();
            }
         
            for (var i = 0; i < json.length; i++) {
                printAnnotation(json[i], numeroAnnot, index, nome);
            }
        });
        
        $('.badgeAnnOnDocument').text(numAnnTot + " Totali");
            
        if (numeroAnnot > 0) $('#' + index).find('i').attr('class', 'fa fa-star');
            else $('#' + index).find('i').attr('class', 'fa fa-star-o');
        
        $('#' + index).append('<span class="badge badge'+index+'">'+numeroAnnot+'</span>');
    } else {
        var numeroAnnot = Object.keys(json.results.bindings).length;
        $('#'+ index +'').click(function ()
        {
            $('#annotationPanel').find('span').parent().remove();
            clearAllFragments(); // eventualmente metterlo prima 
    
            numAnnTot = 0;
            $('.badgeAnnOnDocument').text(numAnnTot + " Totali");
              
            currentGraph = nome;
            if (nome === "Heisenberg") {
                $.when(interrogaGrafi(activeURI, 'Heisenberg')).then(function (j) {
                    numeroAnnot = Object.keys(j.results.bindings).length;
        
                    countAnnotazioniAutomatiche = 0;

                    if (!$('#modalita').is(':checked') && currentGraph === "Heisenberg") {
                        $('#hideButtonBar').fadeOut();
                        $('#buttonBar').fadeIn();
                    } else if (!$('#modalita').is(':checked')) {
                        $('#hideButtonBar').fadeIn();
                        $('#buttonBar').fadeOut();
                    } else {
                        $('#hideButtonBar').fadeOut();
                        $('#buttonBar').fadeOut();
                    }
                    
                    queryAnnotations[index] = j;
                    printAnnotation(j, numeroAnnot, index, nome);
                    $('.badge' + index).text(numeroAnnot);
                });
            } else {
                
                countAnnotazioniAutomatiche = 0;

                if (!$('#modalita').is(':checked') && currentGraph === "Heisenberg") {
                    $('#hideButtonBar').fadeOut();
                    $('#buttonBar').fadeIn();
                } else if (!$('#modalita').is(':checked')) {
                    $('#hideButtonBar').fadeIn();
                    $('#buttonBar').fadeOut();
                } else {
                    $('#hideButtonBar').fadeOut();
                    $('#buttonBar').fadeOut();
                }

                printAnnotation(json, numeroAnnot, index, nome);
            }
            
            //$('.list-group-item.graph.disabled').attr('class', 'list-group-item graph');
        });
    
        if (numeroAnnot > 0) $('#' + index).find('i').attr('class', 'fa fa-star');
            else $('#' + index).find('i').attr('class', 'fa fa-star-o');
        
        $('#' + index).append('<span class="badge badge'+index+'">'+numeroAnnot+'</span>');
    }
}

// questo metodo quando chiamato stampa e gestisce le annotazioni. Per cui se si tratta di frammenti verrà chiamato
// scrollFragment se si tratta di annotazioni automatiche (stampaRisultato) per cui funge da vigile
function printAnnotation(json, numeroAnnot, index, nome){
     //carica tutti gli elementi: nome grafo, rotelle, badge, ecc.
    $('#loading2').attr('class', 'fa fa-cog fa-spin pull-right');
    $('#loading3').attr('class', 'fa fa-cog fa-spin pull-right');
    $('#grafo').find('.list-group-item').removeClass('active');
    $('#' +  index).addClass('active');   

    
    // Stampa FRAMMENTI
    var queryResults = json.results.bindings;
    scrollFragments(queryResults, false, nome);

    // Stampa ANNOTAZIONI SU DOCUMENTO
    $('#loading3').attr('class', '');
    for (var i in queryResults) {
        numeroAnnEsterne--;
        var tipo = queryResults[i]['labelType'].value.toLowerCase();
        if (tipo == 'Titolo'.toLowerCase() || tipo == 'Title'.toLowerCase()){
            stampaRisultato(json, 'hasTitle', i, false, nome);
        }
        if (tipo == 'AnnoPubblicazione'.toLowerCase() || tipo == 'Anno Pubblicazione'.toLowerCase() || tipo == 'Publication Year'.toLowerCase() || tipo == 'PublicationYear'.toLowerCase()){
            stampaRisultato(json, 'hasPublicationYear', i, false, nome);
        }
        if (tipo == 'URL'.toLowerCase() || tipo == 'indirizzo'.toLowerCase()){
            stampaRisultato(json, 'hasURL', i, false, nome);
        }
        if (tipo == 'DOI'.toLowerCase()){
            stampaRisultato(json, 'hasDOI', i, false, nome);
        }
        if (tipo == 'Autore'.toLowerCase() || tipo == 'Author'.toLowerCase()){
            stampaRisultato(json, 'hasAuthor', i, false, nome);
        }
    }
}

//elimina tutti gli span dal documento
function clearAllFragments()
{
    $('#pannelloPrincipale').find('span').contents().unwrap();
    $('#pannelloPrincipale').find('span').each(function () {
       if ($(this).text() === '') $(this).remove(); 
    });
}

//trova l'id di un gruppo dato il nome
function findID(name)
{
    for (var i = 0; i < graphs.length; i++) {
        if (graphs[i].nome === name)
        {
            return graphs[i].id;
        }
    }
}

function reprocessArray(codice) {
    // Cancello la vecchia annotazione dall'array arrayAnnotazioni e dal databaseAnnotations
    for(var i = 0; i < arrayAnnotazioni.length; i++) {
        if(arrayAnnotazioni[i].code === codice) {
            arrayAnnotazioni.splice(i, 1);
        }
        if(databaseAnnotations[i].code === codice) {
            databaseAnnotations.splice(i, 1);
        }
    }
}

function prepareFullname(name) {
    var fullname = name.trim();
    fullname = fullname.replace(/[.,-\/#!`’'“‘"$%\^&\*;:{}=\-_`~()]/g, "");
    fullname = fullname.toLowerCase();
    // fullname = fullname.replace(/[^\x00-\x7F]/g, "");
    var decompose = fullname.split(' ');
    var nome = decompose[0].charAt(0);
    var cognome;
    if (decompose.length > 3) {
        cognome = decompose[decompose.length - 2]  + decompose[decompose.length - 1];
    } else if (decompose.length === 3) {
        cognome = decompose[1] + decompose[2];
    } else {
        cognome = decompose[1];
    }
    var final = nome + '-' + cognome;
    return final;
}
