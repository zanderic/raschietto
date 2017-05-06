/* global numAnnTot, numeroAnnEsterne, numeroAnnotazioni, activeURI, databaseAnnotations, countAnnotazioniAutomatiche */

//i FRAMMENTI scaricati dal grafo vengono processati. per ognuno di loro, si controlla che non siano undefined e si procede
//ad caricarli sul documento.
function scrollFragments(json, flag, name) {
    if (typeof json !== "undefined") {
        var i = 0;
        var length = Object.keys(json).length;
        numeroMassimoAnnotazioni += parseInt(length);
        var interval2 = setInterval(function () {
            if (i >= length) {
                numeroAnnotazioniInCorso += i;
                if (numeroAnnotazioniInCorso === numeroMassimoAnnotazioni) {
                    $('.list-group-item.graph.disabled').attr('class', 'list-group-item graph');
                    $('#loading2').attr('class', '');
                }
                clearInterval(interval2);
            }
            else {
                insertAnnotation(json[i], flag, name);
                i++;
                $('.badgeAnnOnDocument').text(numAnnTot + " Totali");
            }
        }, 1);
    }
    
    //gestisco alcune rotelle e il badge con il numero annotazioni
    $('.badgeHeisenberg').text(numeroAnnotazioni + Math.abs(numeroAnnEsterne - 1) + 1);
    $('.badgeAnnOnDocument').text(numAnnTot + " Totali");
}


//ottiene il dom path di un elemento
function prepareDOMPath(element) {
    var dom = '';
    var a;
    
    //ottengo il path locale dell'elemento
    for ( ; element && element.nodeType == 1; element = element.parentNode ) {
        a = $(element.parentNode).children(element.tagName).index(element) + 1;
        a > 1 ? (a = '[' + a + ']') : (a = '');
        dom = '_' + element.tagName.toLowerCase() + a + dom;
    }
    var one = dom.replace("_html", "html");
    
    //ricostruisco il path assoluto (effettivo) tenendo conto del tipo di documento; per prima cosa tolgo html e body 
    one = one.replace('html_body_', '');
    
    //poi elimino la parte locale del path
    one = one.replace('div[2]_div_div[2]_div[2]_', '');
    one = one.replace('div[2]_div_div[2]_div[3]_', '');
    one = one.replace('div[2]_div_div[2]_div[3]', '');
    var add = "";
    
    //infine aggiungo il path assoluto del documento
    if (activeURI.indexOf('dlib.org') !== -1) {
        add = 'form_table[3]_tr_td_table[5]_tr_td_table_tr_td[2]_';
    } else if (activeURI.indexOf('rivista-statistica') !== -1 || activeURI.indexOf('danzaericerca') !== -1 || activeURI.indexOf('musicadocta') !== -1) {
        add = 'div_div[2]_div[2]_div[3]_';
    } else {
        //non è necessario fare nessun cambiamento negli altri casi
    }
    
    //e termino reinserendo html e body e pulendo il path
    one = 'html_body_' + add + one;
    if (one.slice(-1) === '_') 
        one = one.slice(0, - 1); 
    id = one.replace(/(_span(\[+\d+\])?)/g, "");
}


//ricostruisce il nodo indicato dal dom path
function reconstructDOMPath(selectorlist)
{   
    var range;
    
    /*considerazioni su questo codice.
    OGNI GRUPPO HA GESTITO I DOM PATH COME HA PREFERITO.
    ESEMPIO: alcuni usano un dom path locale e dell'app; altri usano il dom path completo della pagina originale;
    altri usano un path misto; altri ancora escludono a priori 'html' e 'body' dal path; ecc.
    QUESTO METODO CERCA DI TENERE CONTO DI TUTTE QUESTE SFUMATURE, NEI LIMITI DEL POSSIBILE.
     */
    
    //si uniformano i separatori: tutti i _ vengono trasformati in /
    selectorlist = selectorlist.replace(/\_/g, '/');
    
    //aggiunta di html/body/ dove manca. se è presente un tbody nel dom path (gruppo Sparkle Parkle solitamente)
    //se ne tiene conto e si posticipa l'operazione.
    if (selectorlist.indexOf('body') === -1 && selectorlist.indexOf('tbody') === -1) 
    {
        selectorlist = 'body/' + selectorlist;
        if (selectorlist.indexOf('html') === -1) selectorlist = 'html/' + selectorlist;
    }
    else if (selectorlist.indexOf('tbody') !== -1)
        selectorlist = '/' + selectorlist;
    
    selectorlist = selectorlist.toLowerCase();
    
    //pulisce il dom path: si cerca di uniformare i path ad una tipologia comune, tenendo conto delle differenze
    //individuali principali. per i documenti esterni a statistica e dlib, il lavoro è francamente impossibile, e
    //si suppone che il documento venga riformattato senza cancellare nodi
    range = document.getElementById('pannelloPrincipale');
    if (activeURI.indexOf('dlib') !== -1) {
        selectorlist = selectorlist.replace('/form/table3/tr/td/table5/tr/td/table1/tr/td2', ''); //DLIB
        selectorlist = selectorlist.replace('/form/table[3]/tr/td/table[5]/tr/td/table/tr/td[2]', ''); //DLIB
        selectorlist = selectorlist.replace('/form/table[3]/tr/td/table[5]/tr/td/table[1]/tr/td[2]', ''); //DLIB
        selectorlist = selectorlist.replace('/form/table[3]/tbody/tr/td/table[5]/tbody/tr/td/table[1]/tbody/tr/td[2]', ''); //DLIB
        selectorlist = selectorlist.replace('/form1/table3/tr1/td1/table5/tr1/td1/table1/tr1/td2', ''); //dlib
        selectorlist = selectorlist.replace('/form/table3/tr/td/table5/tr1/td1/table1/tr1/td2', ''); //DLIB
        selectorlist = selectorlist.replace('/form1/table3/tbody1/tr1/td1/table5/tbody1/tr1/td1/table1/tbody1/tr1/td2/table2/tbody1/tr1/td2/', ''); // DLIB
        selectorlist = selectorlist.replace('/form1/table3/tbody1/tr1/td1/table5/tbody1/tr1/td1/table1/tbody1/tr1/td2/', ''); // DLIB
        selectorlist = selectorlist.replace('/form1/table3/tbody1/tr1/td1/table5/tbody1/tr1/td1/table1/tbody1/tr1/td2', ''); // DLIB
        selectorlist = selectorlist.replace('/table/tbody/tr/td[2]', ''); //DLIB
    }
    else if (activeURI.indexOf('rivista-statistica') !== -1 || activeURI.indexOf('danzaericerca') !== -1 || activeURI.indexOf('musicadocta') !== -1) {
        selectorlist = selectorlist.replace('div/div[2]/div[2]/div[3]', ''); //statistica
        selectorlist = selectorlist.replace('div[1]/div[2]/div[2]/div[3]', ''); //statistica
        selectorlist = selectorlist.replace('div1/div2/div2/div3/', ''); //statistica
        selectorlist = selectorlist.replace('div/div2/div2/div3/', ''); //statistica
    }
    
    //aggiunta di body e html se prima è stato necessario posticipare
    if (selectorlist.indexOf('body') === -1) selectorlist = 'body/' + selectorlist;
    if (selectorlist.indexOf('html') === -1) selectorlist = 'html/' + selectorlist;
    
    //creazione dell'array contenente i vari nodi
    var array = selectorlist.split("/");
    
    //pulizia dei nodi. 
    //la maggior parte dei gruppi usa un path del tipo nodo[numero]/altronodo[numero], ma alcuni
    //usano nodoNUMERONODO/altronodoALTRONUMERO ecc., spesso pure con i _, eliminati sopra.
    //si potrebbero quindi avere dom path come: html/body/h32 in cui si vuole il secondo h3, o
    //dei path del tipo html/body/h3[2]. alcuni usano mettere sempre l'1 dopo i nodi singoli, altri fanno altre 
    //'modifiche' ancora. questo ciclo for cicla ogni nodo e cerca di formattarlo portandolo ad essere
    //qualcosa di utilizzabile.
    //ESEMPIO: si supponga di avere html1/body1/div2/div1/h33, ovvero uno dei peggiori casi possibili. il dom path 
    //finale sarà html/body/div[2]/div/h3[3], prondo ad essere utilizzato.
    for (var i = 0; i < array.length; i++) {
        if (!array[i].match(/\[+\d+\]/)) {
            if (array[i].match(/\d/)) {
                if (array[i].indexOf('h3') !== -1)
                {
                    var suffix = array[i].toString().substring(2, array[i].length);
                    if (suffix != 1 && suffix != "")
                    {
                        array[i] = 'h3[' + suffix + ']';
                    }
                    else array[i] = 'h3';
                }
                else if (array[i].indexOf('h4') !== -1)
                {
                    var suffix = array[i].toString().substring(2, array[i].length);
                    if (suffix != 1 && suffix != "")
                    {
                        array[i] = 'h4[' + suffix + ']';
                    }
                    else array[i] = 'h4';
                } else if (array[i].indexOf('h2') !== -1)
                {
                    var suffix = array[i].toString().substring(2, array[i].length);
                    if (suffix != 1 && suffix != "")
                    {
                        array[i] = 'h2[' + suffix + ']';
                    }
                    else array[i] = 'h2';
                }
                else {
                    var suffix = array[i].match(/\d/g);
                    if (suffix != 1) {
                        array[i] = array[i].toString().replace(/\d/g, '') + '[';
                        for (var j = 0; j < suffix.length; j++) {
                            array[i] += suffix[j];
                        }
                        array[i] += ']';
                    }
                    else array[i] = array[i].toString().replace(/\d/g, '');
                }
            }
        }
    }
    
    //cicla su ogni elemento del dom path, cercandone i figli
    for (var i = 0; i < array.length; i++) {
        
        if (array[i] !== '' && array[i] !== 'html' && array[i] !== 'html1') 
        {
            //recupero dei suffissi (quelli dentro le '[]'
            var suffix = array[i].match(/\[+\d+\]+/);
            
            if (suffix !== null) 
            {
                suffix = suffix.toString().replace(/\[/g, '');
                suffix = suffix.toString().replace(/\]/g, '');
            }
            
            array[i] = array[i].replace(/\[+\d+\]+/, '');
            
            var local = 0;
            
            if (typeof range === "undefined") break;
            
            //si analizzano tutti i figli di range
            for (var j = 0; j < range.length; j++)
            {
                if (range[j].nodeName.toLowerCase() === array[i]) {
                    //ho trovato il figlio che stavo cercando! ora controllo il suffisso
                    local++;
                    if (suffix !== null) {
                        if (local == suffix) {
                            //sono nel nodo desiderato! es. div[4], range[j].nodeName deve essere div, e 
                            //local = suffix = 4
                            range = range[j];
                            //il tbody è solitamente escluso (?) dal dom path; ne tengo conto
                            if (array[i] === 'table') {
                                range = range.childNodes;
                                range = range[0];
                            }
                            break;
                        }
                    }
                    //se il suffisso mancava, basta prendere il primo nodo con nome corrispondente
                    else {
                        range = range[j];
                        if (array[i] === 'table') {
                            range = range.childNodes;
                            range = range[0];
                        }
                    }
                } 
            }
            //procedo ai figli (ultimo passaggio escluso)
            if (i !== array.length -1) range = range.childNodes;
        }
    }
    return range;
}

//inserisce la nuova annotazione ottenuta dal grafo
function insertAnnotation(note, flag, name) {
    if (typeof note.fragment !== "undefined" && note.fragment.value !== "") {
        if (typeof note.type !== "undefined") {
            //ottengo i vari valori dal json: tipo, label, ora, mail, username, nodo, start e end
            var tipo = note.type.value;
        } else {
            //se il campo 'rscht:type' non è specificato, utilizzo un altro campo switchando sui tipi indicati a parole
            if (typeof note.labelType !== "undefined") {
                tipo = note.labelType.value.toLowerCase();
                if (tipo == 'Titolo'.toLowerCase() || tipo == 'Title'.toLowerCase()) {
                    tipo = "hasTitle";
                }
                else if(tipo == 'Anno Pubblicazione'.toLowerCase() || tipo == 'Publication Year'.toLowerCase() || tipo == 'AnnoPubblicazione'.toLowerCase() || tipo == 'PublicationYear'.toLowerCase()){
                    tipo = "hasPublicationYear";
                }
                else if(tipo == 'URL'.toLowerCase() || tipo == 'indirizzo'.toLowerCase()){
                    tipo = "hasURL";
                }
                else if(tipo == 'DOI'.toLowerCase()){
                    tipo = "hasDOI";
                }
                else if(tipo == 'Autore'.toLowerCase() || tipo == 'Author'.toLowerCase()){
                    tipo = "hasAuthor";
                }
                else if(tipo == 'Commento'.toLowerCase() || tipo == 'Comment'.toLowerCase()){
                    tipo = "hasComment";
                }
                else if(tipo == 'Retorica'.toLowerCase() || tipo == 'Rhetoric'.toLowerCase()){
                    tipo = "denotesRhetoric";
                }
                else if(tipo == 'Citazione'.toLowerCase() || tipo == 'Citation'.toLowerCase()){
                    tipo = "cites";
                }
            }
            else {
                var tipo = "indef";
            }
        }
        
        //stesso discorso per la label, a volte non è specificata, oppure devo andarla a prendere dall'istanza
        var label = "";
        if (typeof note.label !== "undefined") {
            label = note.label.value;
            if (label.match("^http://")) {
                if (tipo === 'cites' || tipo === 'references') {
                    if (typeof note.content !== 'undefined') {
                        label = note.content.value;
                    } else if (typeof note.labelAutore !== 'undefined') {
                        label = note.labelAutore.value;
                    }
                } else if (tipo === 'hasAuthor') {
                    if (typeof note.nomeAutore !== 'undefined') {
                        label = note.nomeAutore.value;
                    } else if (typeof note.labelAutore !== 'undefined') {
                        label = note.labelAutore.value;
                    }
                }
            }
        } else {
            label = note.title.value;
        }

        var ora = note.ora.value;
        if(typeof note.mail === 'undefined') {
            var mail = 'Non definita';
        } else {
            var mail = note.mail.value;
        }
        var user;
        if (typeof note.nome === 'undefined') {
            user = 'Non definito';
        } else {
            user = note.nome.value;
        }
        
        //recupero il dom path del nodo (in realtà, recupero il nodo stesso)
        var node = reconstructDOMPath(note.fragment.value);
        
        //se il nodo non è undefined (ergo, il dom path era corretto e utilizzabile) creo lo span
        if (typeof node !== "undefined") {
            var start = parseInt(note.inizio.value);
            var end = parseInt(note.fine.value);

            if (start >= 0 && end > 0 && end > start) {
                var cod;
                if(flag) {
                    numeroAnnotazioni++;
                    cod = numeroAnnotazioni;
                } else {
                    numeroAnnEsterne--;
                    cod = numeroAnnEsterne;
                }
                int = flag;

                //mi posiziono nel nodo
                scrollNodes(start, end, node);

                numAnnTot++;

                databaseAnnotations.push({
                    code : cod,
                    username : user,
                    email : mail.trim(),
                    id : note.fragment.value,
                    start : note.inizio.value,
                    end : note.fine.value,
                    name: name,
                    type : tipo.trim(),
                    content : label.trim(),
                    date : ora
                });


                if (mail === "raschietto@ltw1545.web.cs.unibo.it") countAnnotazioniAutomatiche++;

                //completo lo span precedentemente creato in scrollNodes
                setSpanAttributes(label, tipo, ora, mail, user, flag, name);
            }
        }
    }
}
