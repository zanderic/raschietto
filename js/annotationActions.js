/* global numeroAnnotazioni, time, arrayAnnotazioni, contatoreDisplay, title, endpointURL, id, startFrag, endFrag, username, email, temporaryQuoteArray, quoteType, istanzeAutori, activeURI, numeroAnnEsterne, notes, flag, databaseAnnotations, numAnnDoc, numAnnTot, numAnnFrag, newAnn */

//inserisce gli attributi ad uno span appena creato
function setSpanAttributes(label, tipo, ora, mail, user, flag, name) {
    var escapeLabel = label.replace(/(['"&])/g, "\\$1"); // Replace di virgolette singole, doppie e caratteri speciali con un escape

    var codice;
    if (flag) {
        codice = numeroAnnotazioni;
    } else {
        codice = numeroAnnEsterne;
    }
    
    $('span[codice=' + codice + ']').attr('data-toggle', 'tooltip');
    $('span[codice=' + codice + ']').attr('username', user);
    $('span[codice=' + codice + ']').attr('email', mail);
    $('span[codice=' + codice + ']').attr('graph', name);

    if(newAnn) {
        $('span[codice=' + codice + ']').attr('new', 'true');
    }

    switch (tipo) {
        case "hasAuthor":
            $('span[codice=' + codice + ']').attr('tipo', 'autore');
            $('span[codice=' + codice + ']').attr('class', 'annotation autore');
            $('span[codice=' + codice + ']').attr('autore', label);
            tipo = 'autore';
            if (istanzeAutori.indexOf(label) === -1) {
                istanzeAutori.push(label);
            }
            break;
        case "hasTitle":
            $('span[codice=' + codice + ']').attr('tipo', 'titolo');
            $('span[codice=' + codice + ']').attr('class', 'annotation titolo');
            $('span[codice=' + codice + ']').attr('titolo', label);
            tipo = 'titolo';
            break;
        case "hasPublicationYear":
            $('span[codice=' + codice + ']').attr('tipo', 'pubblicazione');
            $('span[codice=' + codice + ']').attr('class', 'annotation pubblicazione');
            $('span[codice=' + codice + ']').attr('pubblicazione', label);
            tipo = 'pubblicazione';
            break;
        case "hasDOI":
            $('span[codice=' + codice + ']').attr('tipo', 'doi');
            $('span[codice=' + codice + ']').attr('class', 'annotation doi');
            $('span[codice=' + codice + ']').attr('doi', label);
            tipo = 'doi';
            break;
        case "hasURL":
            $('span[codice=' + codice + ']').attr('tipo', 'url');
            $('span[codice=' + codice + ']').attr('class', 'annotation url');
            $('span[codice=' + codice + ']').attr('url', label);
            tipo = 'url';
            break;
        case "hasComment":
            $('span[codice=' + codice + ']').attr('tipo', 'commento');
            $('span[codice=' + codice + ']').attr('class', 'annotation commento');
            $('span[codice=' + codice + ']').attr('commento', label);
            tipo = 'commento';
            break;
        case "denotesRhetoric":
            $('span[codice=' + codice + ']').attr('tipo', 'retorica');
            $('span[codice=' + codice + ']').attr('class', 'annotation retorica');
            $('span[codice=' + codice + ']').attr('retorica', label);
            tipo = 'retorica'; 
            break;
        case "cites":
            $('span[codice=' + codice + ']').attr('tipo', 'citazione');
            $('span[codice=' + codice + ']').attr('class', 'annotation citazione');
            $('span[codice=' + codice + ']').attr('citazione', label);
            tipo = 'citazione';
            break;
        case "references":
            $('span[codice=' + codice + ']').attr('tipo', 'citazione');
            $('span[codice=' + codice + ']').attr('class', 'annotation citazione');
            $('span[codice=' + codice + ']').attr('citazione', label);
            tipo = 'citazione';
            break;
    }

    //vengono aggiunti data, ora e funzione che si attiva al click (riempie il modale che visualizza l'annotazione stessa)
    $('span[codice=' + codice + ']').attr('title', 'Clicca per visualizzare i dettagli dell\'annotazione');
    $('span[codice=' + codice + ']').attr('data', ora);
    $('span[codice=' + codice + ']').attr('onclick', 'displayAnnotation(\'' + user + '\', \'' + mail + '\', \'' + tipo + '\', \'' + escapeLabel + '\', \'' + ora + '\')');

    onHover();
}

function createSpan(codice, label, tipo, ora, mail, user, name){
    var span = document.createElement('span');
    span.setAttribute('codice', codice);
        
    span.setAttribute('data-toggle', 'tooltip');
    span.setAttribute('username', user);
    span.setAttribute('email', mail);
    span.setAttribute('graph', name);

    switch (tipo)
    {
        case 'autore':
            span.setAttribute('tipo', 'autore');
            span.setAttribute('class', 'annotation autore');
            span.setAttribute('autore', label);
            break;
        case 'pubblicazione':
            span.setAttribute('tipo', 'pubblicazione');
            span.setAttribute('class', 'annotation pubblicazione');
            span.setAttribute('pubblicazione', label);
            break;
        case 'titolo':
            span.setAttribute('tipo', 'titolo');
            span.setAttribute('class', 'annotation titolo');
            span.setAttribute('titolo', label);
            break;
        case 'doi':
            span.setAttribute('tipo', 'doi');
            span.setAttribute('class', 'annotation doi');
            span.setAttribute('doi', label);
            break;
        case 'url':
            span.setAttribute('tipo', 'url');
            span.setAttribute('class', 'annotation url');
            span.setAttribute('url', label);
            break;
        case 'citazione':
            span.setAttribute('tipo', 'citazione');
            span.setAttribute('class', 'annotation citazione');
            span.setAttribute('citazione', label);
            break;
    }

    var label2 = label.replace(/(['"&;])/g, '\\$1');
    
    //aggiustamento della lunghezza del campo url
    if (tipo === 'url') {
        var length = label.length;
        var max = $('#docs').width()/10;
        var times = Math.floor(length / max);
        var start = 0;
        var end = max;
        
        for (var i = 0; i < times; i++) {
            label = label.substring(0, end) + "\n" + label.substring(end, length);
            length = label.length;
            start = start + max + 2;
            end = end + max + 2;
        }
    }

    span.setAttribute('value', label2);

    span.setAttribute('title', 'Clicca per visualizzare i dettagli dell\'annotazione');
    span.setAttribute('data', ora);

    span.setAttribute('onclick', 'displayAnnotation(\'' + user + '\', \'' + mail + '\', \'' + tipo + '\', \'' + label2 + '\', \'' + ora + '\')');

    if (newAnn) {
        span.setAttribute('new', 'true');
    }

    return span;
}

//funzione che mostra un'annotazione in un modale
function displayAnnotation(usr, ml, tp, at, tm) {
    var color; 
    
    //switch per scegliere il colore opportuno
    switch (tp)
    {
        case 'autore': color = "burlywood";
            var displayTp = 'Autore';
            break;
        case 'pubblicazione': color = "magenta";
            var displayTp = 'Anno di Pubblicazione';
            break;
        case 'titolo': color = "blue";
            var displayTp = 'Titolo';
            break;
        case 'doi': color = "red";
            var displayTp = 'DOI';
            break;
        case 'url': color = "olive";
            var displayTp = 'URL';
            break;
        case 'commento': color = "yellow";
            var displayTp = 'Commento';
            break;
        case 'retorica': color = "chartreuse";
            var displayTp = 'Funzione Retorica';
            break;
        case 'citazione': color = "cyan";
            var displayTp = 'Citazione';
            break;
    }
    
    //viene creato un div che conterrà i dati dell'annotazione
    var s = '<tr class="row"><td><div class="panel panel-primary view">';
    
    s += '<div class="panel-heading">Annotazione</div>' +
         '<div class="panel-body"><div class="col-md-3"><div id="circle2" style="background:' + color + '"></div></div>';
    
    //aggiunta dei dati su chi ha inserito l'annotazione e sul suo tipo
    s += '<div class="col-md-9"><b>Inserita da: </b>' +
         usr + 
         '<br /><b>E-mail: </b>' +
         ml + 
         '<br /><b>Tipo di annotazione: </b>' + 
         displayTp;
 
    //switch per inserire i dati relativi al tipo
    switch (tp)
    {
        case 'autore': s += '<br /><b>Autore: </b>' + at;
            break;
        case 'pubblicazione': s += '<br /><b>Anno di pubblicazione: </b>' + at;
            break;
        case 'titolo': s += '<br /><b>Titolo: </b>' + at;
            break;
        case 'doi': s += '<br /><b>DOI: </b>' + at;
            break;
        case 'url': s += '<br /><b>URL associato: </b><a href="' + at + '" target="_blank">' + at + '</a>';
            break;
        case 'commento': s += '<br /><b>Commento inserito: </b>' + at;
            break;
        case 'retorica': s += '<br /><b>Funzione retorica inserita: </b>' + at;
            break;
        case 'citazione': s += '<br /><b>Citazione: </b>' + at;
            break;
    }
    
    //aggiunta della data
    s += '<br /><b>Data e ora: </b>' +
         tm +
         '</div></div></div></td></tr>';
 
    //aggiunta al modale stesso: si verifica se è necessario vuotare il modale dalle visualizzazioni precedenti
    if (contatoreDisplay === 0) {
        $('#bodyAnnotazione').empty();
    }
    
    //aggiunta del codice da mostrare
    $('#bodyAnnotazione').append(s);
    
    //se il modale è già stato aperto, se ne impediscono ulteriori aperture; questo poichè invocare nuovamente l'azione
    //'show', come avveniva quando usavamo il campo data-target, provoca la chiusura (se invocato due volte di fila) del
    //modale stesso, oppure problemi ulteriori (chiusura, perdita di focus della pagina, impossibilità di interagire) in
    //caso di invocazioni >=3
    if (contatoreDisplay === 0) {
        contatoreDisplay++;
        $('#modalAnnotazione').modal('show');
    }
}

// Riepilogo delle annotazioni fatte e gestione delle stesse
function manageAnnotation() {
    var row = "";
    var rowToSend = "";
    for (var i = numeroAnnEsterne; i <= numeroAnnotazioni; i++) {
        // Controllo se lo span si riferisce al nostro grafo, quindi risulta modificabile
        if ($('span[codice="'+i+'"]').attr('graph') === 'Heisenberg') {
            var target = 1; // Se e' 0 e' frammento se e' 1 e' documento
            var tipo = $('span[codice="' + i + '"]').attr("tipo");
            var oggetto = $('span[codice="' + i + '"]').attr('value');
            var toSend = $('span[codice="' + i + '"]').attr("new"); // Definisce se un'annotazione sia da inviare oppure no
            switch (tipo) {
                // In base al tipo di ann setto l'oggetto da cercare e il colore da visualizzare
                case 'commento':
                    var displayTipo = 'Commento';
                    oggetto = $('span[codice="' + i + '"]').attr('commento');
                    target = 0;
                    var color = 'yellow';
                    break;
                case 'retorica':
                    var displayTipo = 'Funzione Retorica';
                    oggetto = $('span[codice="' + i + '"]').attr('retorica');
                    target = 0;
                    var color = 'chartreuse';
                    break;
                case 'citazione':
                    var displayTipo = 'Citazione';
                    oggetto = $('span[codice="' + i + '"]').attr('citazione');
                    target = 0;
                    var color = 'cyan';
                    break;
                case 'autore':
                    var displayTipo = 'Autore';
                    if (oggetto === undefined) {
                        // Se di default non ho trovato l'oggetto nell'attrinuto value allora vuol dire che e' un'annotazione sul frammento
                        target = 0;
                        oggetto = $('span[codice="' + i + '"]').attr('autore');
                    }
                    var color = 'burlywood';
                    break;
                case 'pubblicazione':
                    var displayTipo = 'Anno di Pubblicazione';
                    if (oggetto === undefined) {
                        target = 0;
                        oggetto = $('span[codice="' + i + '"]').attr('pubblicazione');
                    }
                    var color = 'magenta';
                    break;
                case 'titolo':
                    var displayTipo = 'Titolo';
                    if (oggetto === undefined) {
                        target = 0;
                        oggetto = $('span[codice="' + i + '"]').attr('titolo');
                    }
                    var color = 'blue';
                    break;
                case 'doi':
                    var displayTipo = 'DOI';
                    if (oggetto === undefined) {
                        target = 0;
                        oggetto = $('span[codice="' + i + '"]').attr('doi');
                    }
                    var color = 'red';
                    break;
                case 'url':
                    var displayTipo = 'URL';
                    if (oggetto === undefined) {
                        target = 0;
                        oggetto = $('span[codice="' + i + '"]').attr('url');
                    }
                    var color = 'olive';
                    break;
            }
            if (tipo !== undefined && oggetto !== undefined) {
                if (toSend !== undefined) {
                    if (target === 0) {
                        rowToSend += '<tr id="' + i + '" class="active"><td><div id="circle" style="background:' + color + '"></div></td><td>Frammento</td><td>' + displayTipo + '</td><td>' + oggetto.replace(/[â]/g, "'") + '</td>' +
                            '<td><a class="btn btn-default" onclick="resumeAnnotation(' + i + ', \'' + title.replace(/(['"&;])/g, "\\$1") + '\', \'' + tipo + '\', \'' + oggetto.replace(/(['"&;])/g, "\\$1") + '\', \'frag\');"><i class="fa fa-pencil"></i></a></td>' +
                            '<td><a class="btn btn-default" onclick="cancelAnnotation(' + i + ', \'' + tipo + '\', \'' + oggetto.replace(/(['"&;])/g, "\\$1") + '\', \'' + $('span[codice="' + i + '"]').attr('data') + '\');"><i class="fa fa-trash"></i></a></td></tr>';
                    } else {
                        rowToSend += '<tr id="' + i + '" class="active"><td><div id="circle" style="background:' + color + '"></div></td><td>Documento</td><td>' + displayTipo + '</td><td>' + oggetto.replace(/[â]/g, "'") + '</td>' +
                            '<td><a class="btn btn-default" onclick="resumeAnnotation(' + i + ', \'' + title.replace(/(['"&;])/g, "\\$1") + '\', \'' + tipo + '\', \'' + oggetto.replace(/(['"&;])/g, "\\$1") + '\', \'doc\');"><i class="fa fa-pencil"></i></a></td>' +
                            '<td><a class="btn btn-default" onclick="cancelAnnotation(' + i + ', \'' + tipo + '\', \'' + oggetto.replace(/(['"&;])/g, "\\$1") + '\', \'' + $('span[codice="' + i + '"]').attr('data') + '\');"><i class="fa fa-trash"></i></a></td></tr>';
                    }
                } else {
                    if (target === 0) {
                        row += '<tr id="' + i + '"><td><div id="circle" style="background:' + color + '"></div></td><td>Frammento</td><td>' + displayTipo + '</td><td>' + oggetto.replace(/[â]/g, "'") + '</td>' +
                            '<td><a class="btn btn-default" onclick="resumeAnnotation(' + i + ', \'' + title.replace(/(['"&;])/g, "\\$1") + '\', \'' + tipo + '\', \'' + oggetto.replace(/(['"&;])/g, "\\$1") + '\', \'frag\');"><i class="fa fa-pencil"></i></a></td>' +
                            '<td><a class="btn btn-default" onclick="cancelAnnotation(' + i + ', \'' + tipo + '\', \'' + oggetto.replace(/(['"&;])/g, "\\$1") + '\', \'' + $('span[codice="' + i + '"]').attr('data') + '\');"><i class="fa fa-trash"></i></a></td></tr>';
                    } else {
                        row += '<tr id="' + i + '"><td><div id="circle" style="background:' + color + '"></div></td><td>Documento</td><td>' + displayTipo + '</td><td>' + oggetto.replace(/[â]/g, "'") + '</td>' +
                            '<td><a class="btn btn-default" onclick="resumeAnnotation(' + i + ', \'' + title.replace(/(['"&;])/g, "\\$1") + '\', \'' + tipo + '\', \'' + oggetto.replace(/(['"&;])/g, "\\$1") + '\', \'doc\');"><i class="fa fa-pencil"></i></a></td>' +
                            '<td><a class="btn btn-default" onclick="cancelAnnotation(' + i + ', \'' + tipo + '\', \'' + oggetto.replace(/(['"&;])/g, "\\$1") + '\', \'' + $('span[codice="' + i + '"]').attr('data') + '\');"><i class="fa fa-trash"></i></a></td></tr>';
                    }
                }
            }
        }
    }
    
    $("#bodyTabella").empty();
    if (rowToSend !== "" && row !== "") {
        $("#bodyTabella").append("<tr><td colspan=6 align='center'><i class='fa fa-paper-plane fa-2x'></i>&nbsp; <strong>ANNOTAZIONI DA INVIARE</strong></td></tr>");
        $("#bodyTabella").append(rowToSend);
        $("#bodyTabella").append("<tr><td colspan=6 align='center'><i class='fa fa-hdd-o fa-2x'></i>&nbsp; <strong>ANNOTAZIONI SUL GRAFO</strong></td></tr>");
        $("#bodyTabella").append(row);
        $("#modalGestioneAnnotazioni").modal("show");
    } else if (row === "" && rowToSend !== "") {
        $("#bodyTabella").append("<tr><td colspan=6 align='center'><i class='fa fa-paper-plane fa-2x'></i>&nbsp; <strong>ANNOTAZIONI DA INVIARE</strong></td></tr>");
        $("#bodyTabella").append(rowToSend);
        $("#modalGestioneAnnotazioni").modal("show");
    } else if (rowToSend === "" && row !== "") {
        $("#bodyTabella").append("<tr><td colspan=6 align='center'><i class='fa fa-hdd-o fa-2x'></i>&nbsp; <strong>ANNOTAZIONI SUL GRAFO</strong></td></tr>");
        $("#bodyTabella").append(row);
        $("#modalGestioneAnnotazioni").modal("show");
    } else {
        avviso("Non e' ancora stata fatta nessuna annotazione sul documento, inserirne almeno una per poterla modificare.");
    }
}

// Funzione da chiamare in caso di cancellazione di un'annotazione
function cancelAnnotation(codice, tipo, valore, data) {
    numAnnTot--;
    $('.badgeAnnOnDocument').text(numAnnTot + " Totali");

    deleteSingleAnnotation(tipo, valore, activeURI, data); // Cancellazione dal grafo

    if (tipo === 'citazione') {
        $("span[codice='"+codice+"']").parents('p').find('span').each(function() {
            if (!$(this).hasClass('commento') && !$(this).hasClass('retorica')) {
                $("tr#" + $(this).attr('codice') + "").remove(); // Rimozione nella tabella riassuntiva
                $(this).contents().unwrap();
                if($(this).text() === "") {
                    $(this).remove();
                }
            }
        });
    } else {
        $("span[codice='"+codice+"']").contents().unwrap(); // Rimozione dello span
        if($("span[codice='"+codice+"']").text() === "") {
            $("span[codice='"+codice+"']").remove(); // Rimozione degli span vuoti
        }
    }
    $("li[codice='"+codice+"']").remove(); // Rimozione dell'elenco puntato in caso sia un'annotazione sul documento
    
    manageAnnotation();
}

// Funzione che gestisce il modale di modifca di una singola annotazione
function resumeAnnotation(codice, titolo, tipo, oggetto, target) {
    // Resettare eventuali messaggi d'errore precedentemente scatenati
    $('#errorType4').css("display", "none");
    $('#errorAuthor4').css("display", "none");
    $('#changeObj').parent().removeClass('has-error has-feedback');
    $('#changeObj').parent().remove('span.form-control-feedback');
    $('#changeObj').parent().remove('span#inputErrorStatus');

    // In base al tipo e oggetto dell'annotazione viene preparato il modale con le opzioni preselezionate
    var frag = $("span[codice='" + codice + "']").text();
    var resume = "<blockquote><p class='lead'>" + frag + "</p></blockquote>";
    // Se e' un frammento viene aggiunto il bottone per la modifica degli estremi
    if(target === 'frag' && tipo !== 'citazione') {
        resume += "<h4 class='text-center'>Attenzione!<br /><small>Cliccando questo pulsante non si potrà più recuperare la precedente selezione.</small></h4><br />\n\
                    <button type='button' class='btn btn-warning btn-block' onclick='modifyFragment("+codice+")'>Modifica testo annotato</button><br />";
    }
    resume += "<div class='form-group'><label for='resumeTitolo'>Documento: </label> " + titolo + "</div><div class='form-group'><label for='changeType'>Tipo Annotazione: </label>";
    switch(tipo) {
        case 'commento':
            resume += "<select id='changeType' class='form-control' onchange='whichType(this)'><option value='autore'>Autore</option><option value='pubblicazione'>Anno di Pubblicazione</option><option value='titolo'>Titolo</option><option value='doi'>DOI</option><option value='url'>URL</option>" +
                "<option value='commento' selected>Commento</option><option value='retorica'>Funzione Retorica</option></select></div>" +
                "<div class='form-group'><label for='changeObj'>Oggetto: </label><div id='toChange'><input class='form-control' id='changeObj' value='" + oggetto +"'></div></div>";
            break;
        case 'retorica':
            resume += "<select id='changeType' class='form-control' onchange='whichType(this)'><option value='autore'>Autore</option><option value='pubblicazione'>Anno di Pubblicazione</option><option value='titolo'>Titolo</option><option value='doi'>DOI</option><option value='url'>URL</option>" +
                "<option value='commento'>Commento</option><option value='retorica' selected>Funzione Retorica</option></select></div>" +
                "<div class='form-group'><label for='changeObj'>Oggetto: </label><div id='toChange'><select class='form-control' id='changeObj'>";
            switch(oggetto) {
                case 'Abstract':
                    resume += "<option value='Abstract' selected>Abstract</option><option value='Introduction'>Introduction</option><option value='Materials'>Materials</option>" +
                        "<option value='Methods'>Methods</option><option value='Results'>Results</option><option value='Discussion'>Discussion</option><option value='Conclusion'>Conclusion</option></select></div></div>";
                    break;
                case 'Introduction':
                    resume += "<option value='Abstract'>Abstract</option><option value='Introduction' selected>Introduction</option><option value='Materials'>Materials</option>" +
                        "<option value='Methods'>Methods</option><option value='Results'>Results</option><option value='Discussion'>Discussion</option><option value='Conclusion'>Conclusion</option></select></div></div>";
                    break;
                case 'Materials':
                    resume += "<option value='Abstract'>Abstract</option><option value='Introduction'>Introduction</option><option value='Materials' selected>Materials</option>" +
                        "<option value='Methods'>Methods</option><option value='Results'>Results</option><option value='Discussion'>Discussion</option><option value='Conclusion'>Conclusion</option></select></div></div>";
                    break;
                case 'Methods':
                    resume += "<option value='Abstract'>Abstract</option><option value='Introduction'>Introduction</option><option value='Materials'>Materials</option>" +
                        "<option value='Methods' selected>Methods</option><option value='Results'>Results</option><option value='Discussion'>Discussion</option><option value='Conclusion'>Conclusion</option></select></div></div>";
                    break;
                case 'Results':
                    resume += "<option value='Abstract'>Abstract</option><option value='Introduction'>Introduction</option><option value='Materials'>Materials</option>" +
                        "<option value='Methods'>Methods</option><option value='Results' selected>Results</option><option value='Discussion'>Discussion</option><option value='Conclusion'>Conclusion</option></select></div></div>";
                    break;
                case 'Discussion':
                    resume += "<option value='Abstract'>Abstract</option><option value='Introduction'>Introduction</option><option value='Materials'>Materials</option>" +
                        "<option value='Methods'>Methods</option><option value='Results'>Results</option><option value='Discussion' selected>Discussion</option><option value='Conclusion'>Conclusion</option></select></div></div>";
                    break;
                case 'Conclusion':
                    resume += "<option value='Abstract' >Abstract</option><option value='Introduction'>Introduction</option><option value='Materials'>Materials</option>" +
                        "<option value='Methods'>Methods</option><option value='Results'>Results</option><option value='Discussion'>Discussion</option><option value='Conclusion' selected>Conclusion</option></select></div></div>";
                    break;
            }
            break;
        case 'citazione':
            resume += "<select id='changeType' class='form-control' onchange='whichType(this)'><option value='autore'>Autore</option><option value='pubblicazione'>Anno di Pubblicazione</option><option value='titolo'>Titolo</option><option value='doi'>DOI</option><option value='url'>URL</option>" +
                "<option value='commento'>Commento</option><option value='retorica'>Funzione Retorica</option><option value='citazione' selected>Citazione</option></select></div>" +
                "<div class='form-group'><label for='changeObj'>Oggetto: </label><div id='toChange'><input class='form-control' id='changeObj' value='" + oggetto +"'></div></div>";
            break;
        case 'autore':
            if (target === 'frag') {
                resume += "<select id='changeType' class='form-control' onchange='whichType(this)'><option value='autore' selected>Autore</option><option value='pubblicazione'>Anno di Pubblicazione</option><option value='titolo'>Titolo</option><option value='doi'>DOI</option><option value='url'>URL</option>" +
                    "<option value='commento'>Commento</option><option value='retorica'>Funzione Retorica</option></select></div>" +
                    "<div id='toChange'><div class='form-group'><label for='changeObj'>Scegli l'autore del documento:</label><select class='form-control' id='selectauthor4'><option value='nothing'>Seleziona</select>" +
                    "<label class='control-label' for='changeObj'>Altrimenti, inserisci manualmente l'autore del documento:</label><input type='text' class='form-control' placeholder='Mario Rossi' id='changeObj'></div></div>";
            } else {
                resume += "<select id='changeType' class='form-control' onchange='whichType(this)'><option value='autore' selected>Autore</option><option value='pubblicazione'>Anno di Pubblicazione</option><option value='titolo'>Titolo</option><option value='doi'>DOI</option><option value='url'>URL</option></select></div>" +
                    "<div id='toChange'><div class='form-group'><label for='changeObj'>Scegli l'autore del documento:</label><select class='form-control' id='selectauthor4'><option value='nothing'>Seleziona</select>" +
                    "<label class='control-label' for='insertauthor'>Altrimenti, inserisci manualmente l'autore del documento:</label><input type='text' class='form-control' placeholder='Mario Rossi' id='changeObj'></div></div>";
            }
            break;
        case 'pubblicazione':
            if (target === 'frag') {
                resume += "<select id='changeType' class='form-control' onchange='whichType(this)'><option value='autore'>Autore</option><option value='pubblicazione' selected>Anno di Pubblicazione</option><option value='titolo'>Titolo</option><option value='doi'>DOI</option><option value='url'>URL</option>" +
                    "<option value='commento'>Commento</option><option value='retorica'>Funzione Retorica</option></select></div>" +
                    "<div class='form-group'><label for='changeObj'>Oggetto: </label><div id='toChange'><select class='form-control' id='changeObj'></select></div></div>";
            } else {
                resume += "<select id='changeType' class='form-control' onchange='whichType(this)'><option value='autore'>Autore</option><option value='pubblicazione' selected>Anno di Pubblicazione</option><option value='titolo'>Titolo</option><option value='doi'>DOI</option><option value='url'>URL</option></select></div>" +
                    "<div class='form-group'><label for='changeObj'>Oggetto: </label><div id='toChange'><select class='form-control' id='changeObj'></select></div></div>";
            }
            break;
        case 'titolo':
            if (target === 'frag') {
                resume += "<select id='changeType' class='form-control' onchange='whichType(this)'><option value='autore'>Autore</option><option value='pubblicazione'>Anno di Pubblicazione</option><option value='titolo' selected>Titolo</option><option value='doi'>DOI</option><option value='url'>URL</option>" +
                    "<option value='commento'>Commento</option><option value='retorica'>Funzione Retorica</option></select></div>" +
                    "<div class='form-group'><label for='changeObj'>Oggetto: </label><div id='toChange'><input class='form-control' id='changeObj' value='" + oggetto +"'></div></div>";
            } else {
                resume += "<select id='changeType' class='form-control' onchange='whichType(this)'><option value='autore'>Autore</option><option value='pubblicazione'>Anno di Pubblicazione</option><option value='titolo' selected>Titolo</option><option value='doi'>DOI</option><option value='url'>URL</option></select></div>" +
                    "<div class='form-group'><label for='changeObj'>Oggetto: </label><div id='toChange'><input class='form-control' id='changeObj' value='" + oggetto + "'></div></div>";
            }
            break;
        case 'doi':
            if (target === 'frag') {
                resume += "<select id='changeType' class='form-control' onchange='whichType(this)'><option value='autore'>Autore</option><option value='pubblicazione'>Anno di Pubblicazione</option><option value='titolo'>Titolo</option><option value='doi' selected>DOI</option><option value='url'>URL</option>" +
                    "<option value='commento'>Commento</option><option value='retorica'>Funzione Retorica</option></select></div>" +
                    "<div class='form-group'><label for='changeObj'>Oggetto: </label><div id='toChange'><input class='form-control' id='changeObj' value='" + oggetto +"'></div></div>";
            } else {
                resume += "<select id='changeType' class='form-control' onchange='whichType(this)'><option value='autore'>Autore</option><option value='pubblicazione'>Anno di Pubblicazione</option><option value='titolo'>Titolo</option><option value='doi' selected>DOI</option><option value='url'>URL</option></select></div>" +
                    "<div class='form-group'><label for='changeObj'>Oggetto: </label><div id='toChange'><input class='form-control' id='changeObj' value='" + oggetto + "'></div></div>";
            }
            break;
        case 'url':
            if (target === 'frag') {
                resume += "<select id='changeType' class='form-control' onchange='whichType(this)'><option value='autore'>Autore</option><option value='pubblicazione'>Anno di Pubblicazione</option><option value='titolo'>Titolo</option><option value='doi'>DOI</option><option value='url' selected>URL</option>" +
                    "<option value='commento'>Commento</option><option value='retorica'>Funzione Retorica</option></select></div>" +
                    "<div class='form-group'><label for='changeObj'>Oggetto: </label><div id='toChange'><input class='form-control' id='changeObj' value='" + oggetto +"'></div></div>";
            } else {
                resume += "<select id='changeType' class='form-control' onchange='whichType(this)'><option value='autore'>Autore</option><option value='pubblicazione'>Anno di Pubblicazione</option><option value='titolo'>Titolo</option><option value='doi'>DOI</option><option value='url' selected>URL</option></select></div>" +
                    "<div class='form-group'><label for='changeObj'>Oggetto: </label><div id='toChange'><input class='form-control' id='changeObj' value='" + oggetto + "'></div></div>";
            }
            break;
    }
    resume += "<div id='errorType4' class='error' style='display: none;'>Attenzione! Non puoi lasciare campi vuoti.</div>" +
            "<div id='errorAuthor4' class='error' style='display: none;'>Attenzione! L'autore deve contenere almeno due parole.</div>" +
        "<input id='hiddenCod' value='"+codice+"' hidden><input id='hiddenTip' value='"+tipo+"' hidden><input id='hiddenOgg' value='"+oggetto+"' hidden><input id='hiddenTg' value='"+target+"' hidden>";
    $("#bodyModify").empty();
    $("#bodyModify").append(resume);
    updateAutori();
    // Composizione della select con gli anni di pubblicazione
    for (var i = 2015; i > 1800; i--) {
        $('#changeObj').append($('<option>', {
            value: i,
            text: i
        }), '</option>');
    }
    $("#modalGestioneAnnotazioni").modal("hide");
    $("#modalModificaAnnotazione").modal("show");
}

// Funzione che cambia dinamicamente il campo di selezione dell'oggetto in base al tipo scelto
function whichType(type) {
    var commenazione = "<input class='form-control' id='changeObj'>";
    var funzione = "<select id='changeObj' class='form-control'><option value='Abstract'>Abstract</option><option value='Introduction'>Introduction</option>" +
        "<option value='Materials'>Materials</option><option value='Methods'>Methods</option><option value='Results'>Results</option><option value='Discussion'>Discussion</option>" +
        "<option value='Conclusion'>Conclusion</option>";
    var anni = "<select class='form-control' id='changeObj'></select>";
    var autore = "<div id='toChange'><div class='form-group'><label for='changeObj'>Scegli l'autore del documento:</label><select class='form-control' id='selectauthor4'><option value='nothing'>Seleziona</select>" +
        "<label class='control-label' for='changeObj'>Altrimenti, inserisci manualmente l'autore del documento:</label><input type='text' class='form-control' placeholder='Mario Rossi' id='changeObj'></div></div>";
    $('#toChange').empty();
    if(type.value === 'retorica') {
        $('#toChange').append(funzione);
    } else if (type.value === 'pubblicazione') {
        $('#toChange').append(anni);
        for (var i = 2015; i > 1800; i--) {
            $('#changeObj').append($('<option>', {
                value: i,
                text: i
            }), '</option>');
        }
    } else {
        // Cambio del campo placeholder
        switch(type.value) {
            case 'autore':
                $('#toChange').append(autore);
                updateAutori();
                break;
            case 'titolo':
                $('#toChange').append(commenazione);
                $('#changeObj').attr('placeholder', 'La Radiazione di Corpo Nero');
                break;
            case 'doi':
                $('#toChange').append(commenazione);
                $('#changeObj').attr('placeholder', '1.10/1-2-3-4');
                break;
            case 'url':
                $('#toChange').append(commenazione);
                $('#changeObj').attr('placeholder', 'http://it.esempio.org/esempio');
                break;
            case 'commento':
                commenazione = '<textarea class="form-control" placeholder="Inserisci un commento" id="changeObj" rows="3"></textarea>';
                $('#toChange').append(commenazione);
                $('#changeObj').attr('placeholder', 'Inserisci un commento');
                break;
            case 'citazione':
                $('#toChange').append(commenazione);
                $('#changeObj').attr('placeholder', 'Inserisci uri citato');
                break;
        }
    }
}

// Modifica dei campi dell'annotazione
function modifyAnnotation() {
    var tipo = $("#hiddenTip").val();
    var cod = $("#hiddenCod").val();
    var tar = $("#hiddenTg").val();
    var newTipo = $("#changeType").val();
    var newOggetto = $("#changeObj").val();
    var questoSpan = $("span[codice='"+cod+"']");

    if(newOggetto !== '') {
        if (newTipo === 'autore' && !hasWhiteSpace(newOggetto.trim())) {
            $('#errorAuthor4').css("display", "block");
            $('#changeObj').parent().addClass('has-error has-feedback');
            $('#changeObj').parent().append('<span class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true">' +
            '</span><span id="inputErrorStatus" class="sr-only">(error)</span>');
        } else {
            questoSpan.attr('tipo', newTipo);
            var oldEmail = questoSpan.attr('email'); // Vecchia email di provenance
            questoSpan.attr('username', username);
            questoSpan.attr('email', email);
            // Setto nuova annotazione come annotazione da inviare
            questoSpan.attr('new', 'true');
            questoSpan.attr("graph", "Heisenberg");
            
            // Cancella la vecchia annotazione dagli array d'appoggio
            reprocessArray(cod);

            if(tar === 'doc') {
                var value = questoSpan.attr("value"); // Vecchio valore
                // Modifica dei valori dello span
                questoSpan.attr('value', newOggetto.trim());
                questoSpan.attr('class', 'annotation ' + newTipo);
                questoSpan.attr('onclick', 'displayAnnotation("'+questoSpan.attr("username")+'", "'+questoSpan.attr("email")+'", ' +
                '"'+newTipo+'", "'+newOggetto+'", "'+questoSpan.attr("data")+'")');
                questoSpan.text(newOggetto);
                // Rimozione del vecchio punto e aggiunta del nuovo nel caso di ann su documento
                var punto = $("li[codice='"+cod+"']").html();
                $("li[codice='"+cod+"']").remove();

                var tipoStatement;
                switch(newTipo) {
                    case 'autore':
                        $('#lista-autore').append("<li codice='"+cod+"'>"+punto+"</li>");
                        tipoStatement = "Autore";
                        break;
                    case 'pubblicazione':
                        $('#lista-pubblicazione').append("<li codice='"+cod+"'>"+punto+"</li>");
                        tipoStatement = "AnnoPubblicazione";
                        break;
                    case 'titolo':
                        $('#lista-titolo').append("<li codice='"+cod+"'>"+punto+"</li>");
                        tipoStatement = "Titolo";
                        break;
                    case 'doi':
                        $('#lista-doi').append("<li codice='"+cod+"'>"+punto+"</li>");
                        tipoStatement = "DOI";
                        break;
                    case 'url':
                        $('#lista-url').append("<li codice='"+cod+"'>"+punto+"</li>");
                        tipoStatement = "URL";
                        break;
                }

                arrayAnnotazioni.push({
                    code : cod,
                    username : username,
                    email : email,
                    type : questoSpan.attr("tipo"),
                    content : questoSpan.attr("value"),
                    date : questoSpan.attr("data")
                });
                databaseAnnotations.push({
                    code : cod,
                    username : username,
                    email : email,
                    type : questoSpan.attr("tipo"),
                    content : questoSpan.attr("value"),
                    date : questoSpan.attr("data")
                });
            } else {
                var value = questoSpan.attr(tipo); // Vecchio valore
                // Modifica dei valori dello span
                questoSpan.removeAttr(tipo);
                questoSpan.attr(newTipo, newOggetto);
                questoSpan.attr('class', 'annotation ' + newTipo);
                questoSpan.attr('onclick', 'displayAnnotation("'+questoSpan.attr("username")+'", "'+questoSpan.attr("email")+'", ' +
                '"'+newTipo+'", "'+newOggetto+'", "'+questoSpan.attr("data")+'")');

                var start;
                var end;
                var idFrag;
                // Cerco nell'array che contiene lo storico delle annotazioni lo start e end del frammento dell'annotazione che sto modificando
                for (var i = 0; i < databaseAnnotations.length; i++) {
                    if(databaseAnnotations[i].code == cod) {
                        idFrag = databaseAnnotations[i].id;
                        start = databaseAnnotations[i].start;
                        end = databaseAnnotations[i].end;
                    }
                }
                
                arrayAnnotazioni.push({
                    code : cod,
                    username : username,
                    email : email,
                    id : idFrag,
                    start : start,
                    end : end,
                    type : questoSpan.attr("tipo"),
                    content : questoSpan.attr(questoSpan.attr("tipo")),
                    date : questoSpan.attr("data")
                });
                databaseAnnotations.push({
                    code : cod,
                    username : username,
                    email : email,
                    id : idFrag,
                    start : start,
                    end : end,
                    type : questoSpan.attr("tipo"),
                    content : questoSpan.attr(questoSpan.attr("tipo")),
                    date : questoSpan.attr("data")
                });
            }
            deleteSingleAnnotation(tipo, value, activeURI, questoSpan.attr('data'));
            $("#modalModificaAnnotazione").modal("hide");
            $("#modalGestioneAnnotazioni").modal("hide");
        }
    } else {
        // Messaggio d'errore
        $('#errorType4').css("display", "block");
        $('#errorAuthor4').css("display", "none");
        $('#changeObj').parent().addClass('has-error has-feedback');
        $('#changeObj').parent().append('<span class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true">' +
        '</span><span id="inputErrorStatus" class="sr-only">(error)</span>');
    }
    // Chiamata funzione che gestisce l'onhover
    onHover();
}

// Funzione che modifica il frammento sul quale si è annotato
function modifyFragment(codice) {
    // Salvo tutti i dati dell'annotazione per poi cancellarla
    var username = $("span[codice='"+codice+"']").attr('username');
    var email = $("span[codice='"+codice+"']").attr('email');
    var tipo = $("span[codice='"+codice+"']").attr('tipo');
    var oggetto = $("span[codice='"+codice+"']").attr(tipo);
    var data = $("span[codice='"+codice+"']").attr('data');
    cancelAnnotation(codice, tipo, oggetto, data);

    reprocessArray(codice);

    $("#modalModificaAnnotazione").modal("hide");
    $("#modalGestioneAnnotazioni").modal("hide");

    // Disabilito altre interazioni nell'applicazione per far si che l'utente possa solo selezionare la nuova porzione di testo
    $("#search").attr('disabled', true);
    $("#invia").attr('disabled', true);
    $("#home").attr('disabled', true);
    // Nascondo i tasti inutili e faccio comparire quello di fine selezione
    $("#bartab1, #bartab2, #bartab3, #bartab5").fadeOut();
    $("#bartab4").fadeIn();
    $("#bartab4").attr("onclick", "completeSelection("+codice+", \'" +tipo+"\', \'"+oggetto+"\', \'"+data+"\');");
}

/*
 * Setto il nuovo frammento con le vecchie opzioni del vecchio span, appena cancellato
 * Per modificare il frammento di un'annotazione non faccio altro che eleiminare l'annotazione che voglio modificare per andare a crearne una nuova
 * sulla nuova porzione di testo selezionata ed avente le stesse caratteristiche e informazioni.
 */
function completeSelection(codice, tipo, oggetto, data) {
    if (fragmentselection === '') {
        avviso("Attenzione! Nessun frammento selezionato.");
    } 
    else {
        if (codice < 0) {
            var target = numeroAnnEsterne - 1;
            numeroAnnEsterne--;
        } else {
            var target = numeroAnnotazioni + 1;
        }
        var numero = numeroAnnotazioni;
        newAnnotation();
        // Se e' stato selezionato qualcose e dunque creato lo span
        if (numeroAnnotazioni > numero) {
            // Modifico il nuovo span appena creato in base alle vecchie informazioni
            var modifyedAnn = $("span[codice='"+target+"']");
            modifyedAnn.attr('codice', codice);
            modifyedAnn.attr('data-toggle', 'tooltip');
            modifyedAnn.attr('username', username);
            modifyedAnn.attr('email', email);
            modifyedAnn.attr('tipo', tipo);
            modifyedAnn.attr('class', 'annotation ' + tipo);
            modifyedAnn.attr(tipo, oggetto);
            modifyedAnn.attr('title', 'Clicca per visualizzare i dettagli dell\'annotazione');
            modifyedAnn.attr('data', data);
            modifyedAnn.attr('onclick', 'displayAnnotation(\''+username+'\', \''+email+'\', \''+tipo+'\', \''+oggetto+'\', \''+data+'\');');
            modifyedAnn.attr('new', 'true');
            modifyedAnn.attr("graph", "Heisenberg");
            onHover();
            // Una volta creato la nuova annotazione ripristino la schermata con le interazioni di default
            $("#bartab1, #bartab2, #bartab3, #bartab5").fadeIn();
            $("#bartab4").fadeOut();
            $("#search").attr('disabled', false);
            $("#home").attr('disabled', false);
            $("#invia").attr('disabled', false);
            numeroAnnotazioni--;

            arrayAnnotazioni.push({
                code : codice,
                username : username.trim(),
                email : email.trim(),
                id : id,
                start : startFrag,
                end : endFrag,
                type : tipo.trim(),
                content : oggetto.trim(),
                date : data
            });
            databaseAnnotations.push({
                code : codice,
                username : username.trim(),
                email : email.trim(),
                id : id,
                start : startFrag,
                end : endFrag,
                type : tipo.trim(),
                content : oggetto.trim(),
                date : data
            });
        }
    }
}
