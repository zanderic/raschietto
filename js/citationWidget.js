/* global numeroAnnotazioni, temporaryQuoteArray, time, quoteType, username, email, databaseAnnotations, arrayAnnotazioni, id, numAnnTot */

//pulisce l'array temporaneo delle annotazioni sulle citazioni
function clearTemporary()
{
    numeroAnnotazioni -= temporaryQuoteArray.length;
    temporaryQuoteArray = [];
    sendEvent("#citationModal", 1);
}

//riposiziona alcuni pulsanti
function annoteOverQuote()
{
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
}

// Extended disable function
jQuery.fn.extend({
    disable: function(state) {
        return this.each(function() {
            var $this = $(this);
            $this.toggleClass('disabled', state);
        });
    }
});

//procede avanti dopo aver creato una citazione
function checkAvanti()
{
    if (!$('#avantiif').hasClass('disabled'))
    {
        newAnn = true;
        fillQuote();
        sendEvent('#citationModal', 2);
    }
}

//crea la tabella di gestione delle annotazioni su citazione
function manageQuoteAnnotations()
{
    $('#bodyTabella').empty();
    for (var i = 0; i < temporaryQuoteArray.length; i++) {
        var color = "";
        var displayTipo = "";
        
        switch(temporaryQuoteArray[i].type) {
           case 'autore': 
                var displayTipo = 'Autore';
                var color = 'burlywood';
                break;
            case 'pubblicazione': 
                var displayTipo = 'Anno di Pubblicazione';
                var color = 'magenta';
                break;
            case 'titolo': 
                var displayTipo = 'Titolo';
                var color = 'blue';
                break;
            case 'doi': 
                var displayTipo = 'DOI';
                var color = 'red';
                break;
            case 'url': 
                var displayTipo = 'URL';
                var color = 'olive';
                break;
        }
        
        $('#bodyTabella2').append('<tr id="' + temporaryQuoteArray[i].code + '"><td><div id="circle" style="background:' + color + '"></div></td><td>' + displayTipo + '</td><td>' + temporaryQuoteArray[i].content + '</td>' +
                    '<td><a class="btn btn-default" onclick="temporaryDelete(' + temporaryQuoteArray[i].code + ');"><i class="fa fa-trash"></i></a></td></tr>');
    }
}   

//elimina un elemento dall'array temporaneo
function temporaryDelete(cod)
{
    for (var i = 0; i < temporaryQuoteArray.length; i++) {
        if (temporaryQuoteArray[i].code === cod)
        {
            temporaryQuoteArray.splice(i, 1);
        }
    }
    manageQuoteAnnotations();
}

//salva le annotazioni su di una citazione
function saveQuote()
{
    var tipoCit; 
    for (var i = 0; i < temporaryQuoteArray.length; i++) {
        switch (temporaryQuoteArray[i].type)
        {
            case 'autore':
                tipoCit = 'autoreCit';
                break;
            case 'nuovoAutore':
                tipoCit = 'nuovoAutoreCit';
                temporaryQuoteArray[i].type = 'autore';
                break;
            case 'pubblicazione':
                tipoCit = 'pubblicazioneCit';
                break;
            case 'titolo':
                tipoCit = 'titoloCit';
                break;
            case 'doi':
                tipoCit = 'doiCit';
                break;
            case 'url':
                tipoCit = 'urlCit';
                break;
        }
        var span = createSpan(temporaryQuoteArray[i].code, temporaryQuoteArray[i].content, temporaryQuoteArray[i].type, time, temporaryQuoteArray[i].email, temporaryQuoteArray[i].username, 'Heisenberg');
        //in base al tipo di documento, mette lo span al posto giusto
        if (quoteType === 'stat') {
            $('#articleCitations').find('.citazione').each(function () {
                var node = $(this).parents('p');
                if ($(node).text() === $('#block').text())
                {
                    if ($(this).find('span').length) {
                        $(this).find('*:not(:has("*"))').wrapInner(span);
                    }
                    else $(this).wrapInner(span);
                    prepareDOMPath($(node).get(0));
                }
            });
        } else if (quoteType === 'dlib') {
            $('#pannelloPrincipale').find('.citazione').each(function () {
                var node = $(this).parents('p');
                if ($(node).text() === $('#block').text())
                {
                    if ($(this).find('span').length) {
                        $(this).find('*:not(:has("*"))').wrapInner(span);
                    }
                    else $(this).wrapInner(span);
                    prepareDOMPath($(node).get(0));
                }
            });
        }

        //aggiorna gli array opportuni
        arrayAnnotazioni.push({
            code : temporaryQuoteArray[i].code,
            username : temporaryQuoteArray[i].username,
            email : temporaryQuoteArray[i].email,
            id : id,
            start : 0,
            end : $("span[codice=" + temporaryQuoteArray[i].code + "]").text().length,
            type : tipoCit,
            content : temporaryQuoteArray[i].content,
            date : time,
            target : $("#block").text()
        });
        databaseAnnotations.push({
            code : temporaryQuoteArray[i].code,
            username : temporaryQuoteArray[i].username,
            email : temporaryQuoteArray[i].email,
            id : id,
            start : 0,
            end : $("span[codice=" + temporaryQuoteArray[i].code + "]").text().length,
            type : tipoCit,
            content : temporaryQuoteArray[i].content,
            date : time,
            target : $("#block").text()
        });
    }
    
    //vuota l'array temporaneo
    temporaryQuoteArray = [];
    
    onHover();
}

function manageQuotes()
{
    var i = 0;
     //pulizia e inizializzazione del modale
    quoteList = [];
    $('#lista-cit').empty();
    $('#no-quotes-alert').remove();
    
    //si cerca un div specifico che contenga le citazioni
    $('#articleCitations').find('p').each(function () {
        quoteList.push($(this).html());
        $('#lista-cit').append('<option value="' + i + '" title="' + $(this).text() + '">' + $(this).text().substring(0, $('#lista-cit').width()*0.7) + '...');
        i++;
    });
    
    //se è stato trovato, si può procedere oltre
    if (i !== 0) {
        quoteType="stat";
        $('#no-quotes-alert').remove();
    }
    //altrimenti, si cercano eventuali link in formato citazione
    else {
        i++;
        var b = true;
        while (b)
        {
            if ($('a[name="' + i + '"').length) {
                quoteList.push($('a[name="' + i + '"]').parent().text());
                $('#lista-cit').append('<option value="' + (i-1) + '" title="' + $('a[name="' + i + '"').parent().text() + '">' + $('a[name="' + i + '"').parent().text().substring(0, $('#lista-cit').width()*0.7) + '...');
            }
            else b = false;
            i++;
        }
        i--;
        //se sono stati trovati, si può procedere oltre
        if (i !== 1) {
            quoteType="dlib";
            $('#no-quotes-alert').remove();
        }
        //in caso contrario, si mostra un avvertimento opportuno
        else {
            quoteType="none";
            $('#avantiif').disable(true);
            $('#bodyQuote').append('<h3 id="no-quotes-alert">In questo documento non sono presenti citazioni!</h3>');
        }
    }
    
    //viene mostrato il pannello
    $('#citationModal').modal('show');
}

function fillQuote()
{
    $('#block').empty();
    $('#block').append(quoteList[$('#lista-cit option:selected').val()]);
    
    var done = false;
    
    currentTime();
    numeroAnnotazioni++;
    var spa = createSpan(numeroAnnotazioni, $('#block').text(), 'citazione', time, email, username, 'Heisenberg');
    
    if (quoteType === 'stat') {
        $('#articleCitations').find('p').each(function () {
            if ($(this).text() === $('#block').text())
            {
                if (!$(this).find('.citazione').length) {
                    done = true;
                    $(this).wrapInner(spa);
                    prepareDOMPath($("span[codice=" + numeroAnnotazioni + "]").get(0));
                }
            }
        });
    } else if (quoteType === 'dlib') {
        var j = 1;
        var b = true;
        while (b)
        {
            if ($('a[name="' + j + '"').length) {
                var node = $('a[name="' + j + '"').parents('p');
                if ($(node).text() === $('#block').text())
                {
                    if (!$(node).find('.citazione').length) {
                        done = true;
                        $(node).wrapInner(spa);
                        prepareDOMPath($("span[codice=" + numeroAnnotazioni + "]").get(0));
                    }
                }
            }
            else b = false;
            j++;
        }
    }

    if (done) {
        onHover();

        arrayAnnotazioni.push({
            code : numeroAnnotazioni,
            username : username,
            email : email,
            id: id,
            start: 0,
            end: $("span[codice=" + numeroAnnotazioni + "]").text().length,
            type : 'citazione',
            content : $('#block').text().replace(/(['";])/g, "\\$1"),
            date : time
        });
        databaseAnnotations.push({
            code : numeroAnnotazioni,
            username : username,
            email : email,
            id: id,
            start: 0,
            end: $("span[codice=" + numeroAnnotazioni + "]").text().length,
            type : 'citazione',
            content : $('#block').text().replace(/(['";])/g, "\\$1"),
            date : time
        });   
    }
}

function insertQuoteAnnotation()
{
    currentTime();
    numeroAnnotazioni++;
    numAnnTot++;
    
    $('.badgeAnnOnDocument').text(numAnnTot + " Totali");
    
    var tipo = "";
    var attr = "";
    if ($('#inserimentoautore3').css('display') === 'block') {
        if ($('#selectauthor3 option:selected').val() === "nothing") {
            attr = $('#insertauthor3').val();
            tipo = 'nuovoAutore';
        }
        else attr = $('#selectauthor3 option:selected').val();
            tipo = 'autore';
    } else if ($('#inserimentotitolo3').css('display') === 'block') {
        tipo = 'titolo';
        attr = $('#inserttitle3').val();
    } else if ($('#inserimentopubblicazione3').css('display') === 'block') {
        tipo = 'pubblicazione';
        attr = $('#insertpubb3').val();
    } else if ($('#inserimentodoi3').css('display') === 'block') {
        tipo = 'doi';
        attr = $('#insertdoi3').val();
    } else if ($('#inserimentourl3').css('display') === 'block') {
        tipo = 'url';
        attr = $('#inserturl3').val();
    }
    
    var ann = {
        code : numeroAnnotazioni,
        username : username.trim(),
        email : email.trim(),
        type : tipo.trim(),
        content : attr.trim(),
        date : time
    };
    
    temporaryQuoteArray.push(ann);
}