/* global numeroAnnotazioni, time, email, username, numAnnTot, countAnnotazioniAutomatiche, arrayAnnotazioni, databaseAnnotations, istanzeAutori, numeroAnnEsterne, newAnn */

//inserisce una nuova annotazione sul documento; in particolare, mostra il modale che ne permette l'inserimento
function newDocAnnotation()
{
    updateAutori();
    // Chiamata del modale
    $('#insert-modal-1').modal('show');
}

//inserisce un'annotazione sul documento
function insertDocAnnotation() {
    //determina data, ora e codice annotazione
    currentTime();
    numeroAnnotazioni++;
    var attr;
    var selettore;
    
    //in base al tipo di annotazione, inserisce i dati in uno span che viene aggiunto all'opportuna lista
    if ($('#inserimentoautore').css('display') === 'block') {
        if ($('#selectauthor option:selected').val() === "nothing") {
            attr = $("#insertauthor").val();
            selettore = "lista-autore-new";
        } else {
            attr = $('#selectauthor option:selected').val();
            selettore = "lista-autore";
        }
    } else if ($('#inserimentopubblicazione').css('display') === 'block') {
        attr = $("#insertpubb").val();
        selettore = "lista-pubblicazione";
    } else if ($('#inserimentotitolo').css('display') === 'block') {
        attr = $("#inserttitle").val(); 
        selettore = "lista-titolo";
    } else if ($('#inserimentodoi').css('display') === 'block') {
        attr = $("#insertdoi").val();
        selettore = "lista-doi";
    } else if ($('#inserimentourl').css('display') === 'block') {
        attr = $("#inserturl").val();
        selettore = "lista-url";
    }

    setDocAnnotation(selettore, attr, username, email, time, true, 'Heisenberg');
}

//funzione che inserisce un'annotazione sul documento
function setDocAnnotation(selettore, label, nome, mail, ora, flag, name)
{
    var escapeLabel = label.replace(/(['"&;])/g, "\\$1"); // Replace di virgolette singole, doppie e caratteri speciali con un escape
    // escapeLabel = escapeLabel.replace(/(â)/g, "\\'");
    var tipo;
    numAnnTot++;

    if (mail === "raschietto@ltw1545.web.cs.unibo.it")
        countAnnotazioniAutomatiche++;

    //switcha il tipo di lista
    switch (selettore)
    {
        case 'lista-autore':
            tipo = 'autore';
            break;
        case 'lista-autore-new':
            tipo = 'nuovoAutore';
            selettore = 'lista-autore';
            break;
        case 'lista-pubblicazione':
            tipo = 'pubblicazione';
            break;
        case 'lista-titolo':
            tipo = 'titolo';
            break;
        case 'lista-doi':
            tipo = 'doi';
            break;
        case 'lista-url':
            tipo = 'url';
            break;
        case 'citazione':
            tipo = 'citazione';
            break;
    }

    //controllo istanze
    if (tipo === 'autore' || tipo === 'nuovoAutore') {
        if (istanzeAutori.indexOf(label) === -1)
            istanzeAutori.push(label);
        tipo = 'autore';
    }

    //controllo sulla provenance
    if (flag || mail === "raschietto@ltw1545.web.cs.unibo.it") {
        numeroAnnotazioni++;
        code = numeroAnnotazioni;
    } else {
        numeroAnnEsterne--;
        code = numeroAnnEsterne;
    }
    
    var label2 = label;
    //aggiustamento della lunghezza del campo url
    if (tipo == 'url') {
        var length = label2.length;
        var max = $('#docs').width() / 10;
        var times = Math.floor(length / max);
        var start = 0;
        var end = max;

        for (var i = 0; i < times; i++) {
            label2 = label2.substring(0, end) + "\n" + label2.substring(end, length);
            length = label2.length;
            start = start + max + 2;
            end = end + max + 2;
        }
    }

    if (newAnn) {
        $('#' + selettore).append('<li codice=' + code + '>' +
                '<span class="annotation ' + tipo + '" codice="' + code + '"' +
                'username="' + nome + '" ' +
                'email="' + mail + '"' +
                'graph="' + name + '"' +
                'title="Clicca per visualizzare i dettagli dell\'annotazione"' +
                'tipo="' + tipo + '"' +
                'value="' + label + '"' +
                'data="' + ora + '"' +
                'onclick="displayAnnotation(\'' +
                nome + '\', \'' +
                mail + '\', \'' +
                tipo + '\', \'' +
                escapeLabel + '\', \'' +
                ora + '\')"' +
                'new=true>' +
                label2 +
                '</span></li>');
    } else {
        $('#' + selettore).append('<li codice=' + code + '>' +
                '<span class="annotation ' + tipo + '" codice="' + code + '"' +
                'username="' + nome + '" ' +
                'email="' + mail + '"' +
                'graph="' + name + '"' +
                'title="Clicca per visualizzare i dettagli dell\'annotazione"' +
                'tipo="' + tipo + '"' +
                'value="' + label + '"' +
                'data="' + ora + '"' +
                'onclick="displayAnnotation(\'' +
                nome + '\', \'' +
                mail + '\', \'' +
                tipo + '\', \'' +
                escapeLabel + '\', \'' +
                ora + '\')">' +
                label2 +
                '</span></li>');
    }
    
    //inserisce l'annotazione dove serve
    if (flag) {
        arrayAnnotazioni.push({
            code: numeroAnnotazioni,
            username: nome.trim(),
            email: mail.trim(),
            type: tipo.trim(),
            content: label.trim(),
            date: ora
        });
    }
    databaseAnnotations.push({
        code: numeroAnnotazioni,
        username: nome.trim(),
        email: mail.trim(),
        type: tipo.trim(),
        content: label.trim(),
        date: ora
    });

    updateAutori();

    $('.badgeAnnOnDocument').text(numAnnTot + " Totali");
    onHover();
}
