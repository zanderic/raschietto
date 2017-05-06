/* global fragmentselection, numeroAnnotazioni, time, arrayAnnotazioni, username, email, numeroAnnEsterne, ext, int, activeURI, id, istanzeAutori, numAnnTot, databaseAnnotations, primaSelezione, father */

//primo passo per inserire una nuova annotazione; ricava il testo selezionato, se esiste, e procede a registrare
//l'annotazione
function newAnnotation(type) {
    
    updateAutori();
    //ricavo il testo selezionato
    selezione = selection();
    
    //differenza tra selezione e fragmentselection: per operare sui nodi serve il primo, poichè è sostanzialmente
    //un riferimento all'interno del documento; il secondo invece estrapola dallo stesso il contenuto selezionato ogni
    //volta che viene rilasciato il tasto sinistro del mouse. dal secondo non si può risalire ai nodi, o almeno non si
    //può con il metodo utilizzato sotto. tuttavia, usando selezione è impossibile detectare se "esiste" la selezione
    //stessa o se è vuota, poichè jQuery per qualche motivo non riesce a confrontare l'oggetto con "", '', null o 
    //undefined; allo stesso tempo, è molto più difficile visualizzare selezione nel modale di inserimento annotazioni.
    //per questo motivo, viene più comodo e semplice usare due variabili separate che prelevano la stessa cosa e che 
    //la gestiscono in modo diverso e in momenti diversi.
    if (fragmentselection === '') {
        avviso("Attenzione! Nessun frammento selezionato.");
    } 
    else {
        registerAnnotation(type);
    }
}

//registrazione dell'annotazione; viene ricavato il più nodo che abbia come figli tutti i nodi della selezione, e si 
//procede ad operare sui nodi stessi inserendo l'evidenziazione
function registerAnnotation(type) {

    //viene ricavato il range della selezione
    var r = selezione.getRangeAt(0);
    
    //ricavo il nodo "padre" della selezione
    father = r.commonAncestorContainer;
    
    if (activeURI.indexOf('dlib.org') !== -1) {
        if (father.childNodes.length < 2) {
            father = father.parentNode;
        } 
    } else if (primaSelezione === 0) {
        if (father.childNodes.length < 2) {
            father = father.parentNode;
        }
        primaSelezione++;
    }
    
    //viene ricavato il range del documento
    var rangeFather = document.createRange();

    //all'interno del range del documento, viene selezionata la parte "interessante" e posto un limite alla stessa
    rangeFather.selectNodeContents(father);
    rangeFather.setEnd(r.endContainer, r.endOffset);

    //si ricava la dimensione del range del padre trovato sopra, e la dimensione del range della selezione
    var dimRangeFather = rangeFather.toString().length;
    var dimRange = r.toString().length;
    
    //in base a ciò, si può determinare dove inizia (relativamente) la selezione rispetto all'inizio del nodo padre,
    //e anche dove finisce
    var startSelection = dimRangeFather - dimRange;
    var endSelection = dimRangeFather;
    
    startFrag = startSelection;
    endFrag = endSelection;
    //viene determinato il codice della nuova annotazione, e ricavata l'ora attuale, che sarà quella di inserimento dell'annotazione
    numeroAnnotazioni++;
    currentTime();
    
    if(type === 'new') {
        //viene mostrato il modale di inserimento dei dati dell'annotazione
        $('#frammentoselezionato').html(fragmentselection);
        $('#insert-modal-2').modal('show');
    }

    //mentre l'utente inserisce i dati, l'annotazione viene selezionata; i dati inseriti verranno aggiunti all'annotazione
    //solo in un secondo tempo. questo perchè altrimenti la selezione andrebbe persa, a meno di non usare librerie esterne
    //che permettano di salvarla; dato che è sufficiente limitarsi ad aggiornare la selezione creata, ho ritenuto che
    //avesse poco senso dover importare una libreria esterna potenzialmente ridondante e pesante per un compito così
    //semplice
    scrollNodes(startSelection, endSelection, father);
}

//funzione che scrolla i nodi, determinando quelli che sono di tipo testo (e che quindi ci interessano)
function scrollNodes(start, end, node) {
    //viene definita una variabile, chiamata output, che conterrà un oggetto: dato che il passaggio per riferimento è 
    //possibile sostanzialmente sono con gli oggetti, non è possibile usare altri modi
    var output;
    
    //il primo passo è determinare se il nodo considerato sia un nodo di tipo testo o meno; se non lo è, si passa immediatamente
    //ad analizzare tutti i suoi figli; su di essi viene fatto lo stesso procedimento, invocando il metodo ricorsivamente
    if (node.nodeType !== 3) {
        //ricavo la lista dei figli
        var children = node.childNodes;
        
        //ciclo su ogni figlio
        var i = 0;
        if (typeof children !== "undefined") {
            while (i < children.length) 
            {
                //invoco il metodo su ogni figlio
                var result = scrollNodes(start, end, children[i]);

                //ho raggiunto il nodo finale: posso uscire dal metodo
                if (result.exit) return result; 

                else {
                    //quando inserisco un nodo span, esso verrà preso in considerazione nel passaggio successivo: in questo modo viene invece saltato
                    if (result.newNode) i++;

                    //imposto i nuovi valori di inizio e fine (ai valori precedenti è stata sottratta la lunghezza del nodo affrontato)
                    start = result.first; 
                    end = result.last;
                }
                i++;
            }
            output = {first: start, last: end};
        }
    }
    //finalmente abbiamo incontrato un nodo di tipo testo, e possiamo determinare se fa parte dell'annotazione o meno; in 
    //caso affermativo, procediamo a selezionare la parte di testo che ci interessa (l'intero nodo o una parte di esso)
    else {
         output = textNodesAnalyzer(start, end, node);
    }
    return output;
}

//di ogni nodo testo, si determina se fa parte o meno della selezione, nel caso evidenziandolo (tutto o in parte)
function textNodesAnalyzer(start, end, node)
{
    var output;
    var length = node.length; 
    
    //verifichiamo se il frammento selezionato non parte nel nodo corrente ma in uno successivo;
    //questo succede perchè il primo nodo selezionato è il "padre" del nodo da cui inizia la selezione del frammento
    //ma non è detto che il nodo di inizio del frammento sia il primo figlio: è anzi possibile che sia l'ultimo di essi
    //per questo motivo è necessario scorrere progressivamente tutti i nodi arrivando a quello di inizio effettivo
    if (start >= length) {
        output = {first: start-length, last: end-length};
    } 
    //controlla se l'annotazione finisce in questo stesso nodo
    else if (end < length){
        highlightAnnotation(start, end, node);
        output = {exit : true};
    } 
    //in caso contrario (l'annotazione si estende ad un altro nodo), è necessario considerare tutto il nodo attuale
    //come parte dell'annotazione, e procedere con i successivi fino a trovare il nodo finale
    else {
        highlightAnnotation(start, length, node);
        output =  {first: 0, last: end-length, newNode: true};
    }
    return output;
}

//evidenzia l'annotazione sul documento, creando in concreto il contenitore dell'annotazione
function highlightAnnotation(start, end, node) {
    //dato un nodo, e un punto di inizio e fine all'interno dello stesso, viene creato un frammento del documento
    //contenente la parte significativa
    
    //alcuni gruppi usano -4 come starting offset. lo risetto a 0.
    //logica vorrebbe che anche end sia settato al valore effettivo -1, ma stranamente non è così.
    //la logica di certe scelte progettuali mi sfugge.
    if (start < 0) {
        start = 0;
    }
    
    var fragment = document.createRange();
    fragment.setStart(node, start);
    fragment.setEnd(node, end);
    
    //viene creato lo span che conterrà la selezione; vi vengono aggiunti alcuni campi base (codice, cosa succede cliccando
    //[toggla un modale], quale modale viene "togglato")
    var span = document.createElement('span');
    if (int) span.setAttribute('codice', numeroAnnotazioni);
    else span.setAttribute('codice', numeroAnnEsterne);
    
    //il frammento viene circondato e racchiuso dallo span
    fragment.surroundContents(span);

    // ricavo XPath dell'elemento e lo metto in id
    prepareDOMPath(father);
}

//cancella un'annotazione. serve quando viene interroto il procedimento di inserimento di un'annotazione su un frammento;
//se l'utente ha aperto il modale per l'inserimento dei dati, ma lo chiude prima di inserire l'annotazione, la selezione
//viene cancellata
function deleteAnnotation()
{
    if (!insert) 
    {
        $("span[codice='" + numeroAnnotazioni + "']").contents().unwrap();
        if($("span[codice='" + numeroAnnotazioni + "']").text() === "") {
            $("span[codice='" + numeroAnnotazioni + "']").remove();
        }
        numeroAnnotazioni--;
    }
    insert=false;
}

//funzione che inserisce i dati di un'annotazione nello span precedentemente creato, una volta finita la procedura di 
//raccolta dei dati nel relativo modale
function setAnnotation()
{
    var tipo;
    var tipo2;
    var attr;
    numAnnTot++;
    
    //in base al tipo di annotazione si inseriscono i dati relativi
    if ($('#inserimentocommento').css('display') === 'block') {
        tipo = 'hasComment';
        tipo2 = 'commento';
        attr = $('#insertcomment').val();
    } else if ($('#inserimentoretorica').css('display') === 'block') {
        tipo = 'denotesRhetoric';
        tipo2 = 'retorica';
        attr = $('#insertreth option:selected').text();
    } else if ($('#inserimentoautore2').css('display') === 'block') {
        if ($('#selectauthor2 option:selected').val() !== "nothing") 
        {
            attr = $("#selectauthor2 option:selected").val();
            tipo = 'hasAuthor';
            tipo2 = 'autore';
        }
        else {
            attr = $('#insertauthor2').val();
            //nuova istanza di Autore
            tipo = 'hasAuthor';
            tipo2 = 'nuovoAutore';
        }
        // tipo = 'autore';
    } else if ($('#inserimentotitolo2').css('display') === 'block') {
        tipo = 'hasTitle';
        tipo2 = 'titolo';
        attr = $('#inserttitle2').val();
    } else if ($('#inserimentopubblicazione2').css('display') === 'block') {
        tipo = 'hasPublicationYear';
        tipo2 = 'pubblicazione';
        attr = $('#insertpubb2').val();
    } else if ($('#inserimentodoi2').css('display') === 'block') {
        tipo = 'hasDOI';
        tipo2 = 'doi';
        attr = $('#insertdoi2').val();
    } else if ($('#inserimentourl2').css('display') === 'block') {
        tipo = 'hasURL';
        tipo2 = 'url';
        attr = $('#inserturl2').val();
    }
    
    var escapeAttr = attr.replace(/(['"&;])/g, ''); // Replace di virgolette singole, doppie e caratteri speciali con un escape
    
    setSpanAttributes(escapeAttr, tipo, time, email, username, true, 'Heisenberg');
        
    arrayAnnotazioni.push({
        code : numeroAnnotazioni,
        username : username.trim(),
        email : email.trim(),
        id : id,
        start : startFrag,
        end : endFrag,
        type : tipo2.trim(),
        content : attr.trim(),
        date : time
    });
    databaseAnnotations.push({
        code : numeroAnnotazioni,
        username : username.trim(),
        email : email.trim(),
        id : id,
        start : startFrag,
        end : endFrag,
        type : tipo2.trim(),
        content : attr.trim(),
        date : time
    });

    if (tipo === 'hasAuthor') {
        if (istanzeAutori.indexOf(attr) === -1)
            istanzeAutori.push(attr);
    }

    $('.badgeAnnOnDocument').text(numAnnTot + " Totali");
    
    //ora che l'annotazione esiste, è possibile legargli l'ascoltatore che la evidenzia in caso di hovering
    onHover();
}
