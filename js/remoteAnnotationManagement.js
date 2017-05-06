/*
 * Created by Antonio on 21/08/2015.
 * - Al caricamento di un documento il client interroga SPARQL Service per verificare se esistono annotazioni. Nel caso in cui
 *  non vi fossero, il sistema provvederà a crearle invocando lo script php AutomaticScrape. Altrimenti verranno solo scaricate.
 *      VerificaAnnotazioni(param), creaAnnotazioniDoc(param), getFRBRExpression(param), interrogaSparqlService(prefix, path, doc), stampaRisultato(param)
 * - Caricamento pannello Documenti. 
 *      caricaListaDocumenti()
 * - Force scraping.
 *      forceScraping(param)
 */

// caricamento della lista dei documenti nella doc area
function caricaDoc() {
    // solo nel momento in cui loadDocumentofAllGraphh ha finito, allora viene fatta la chiamata al
    // server per prendere i titoli
    loadDocumentOfAllGraph(function () {
        
        var lista = JSON.stringify(listaDocGrafi);
        
        $.ajax({
            type: 'POST',
            url: 'php/cacheListaDocumenti.php',
           // dataType: 'json',
            data: 'listaDoc=' + lista, 
            success: function (json) {
                var queryResults = jsonParse(json);
                // per ogni titolo e url che ci ritorna, allora lo stampiamo nella docList
                $('#docList').empty();
                $.each(queryResults, function (i, url, titolo) {
                    var titolo = queryResults[i].titolo;
                    var cleanTitle = titolo.replace(/(['"&:;])/g, ""); // Replace di virgolette singole, doppie e caratteri speciali con un escape
                    var url = queryResults[i].url;
                    var doc = "";
                    if (url === activeURI) {
                        doc += '<a class="list-group-item active" href="#" data-toggle="collapse" data-target="#collapseOne" title="' + titolo + '" name="' + url
                            + '" onclick="apriDocumento(\'' + cleanTitle + '\',\'' + url + '\');">' + titolo + '</a>';
                    } else {
                        doc += '<a class="list-group-item" href="#" data-toggle="collapse" data-target="#collapseOne" title="' + titolo + '" name="' + url
                            + '" onclick="apriDocumento(\'' + cleanTitle + '\',\'' + url + '\');">' + titolo + '</a>';
                    }
                    $('#docList').append(doc);
                    docNum++;
                    $('.badgeDocumenti').text(docNum + " Annotati");
                    $('#loading1').attr('class', ''); // Stop icona caricamento

                });
                pageList();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                avviso("Qualcosa è andato storto nel caricamento della lista dei documenti.");
            }
        });
    });
}

// qui viene richiamato un metodo (caricaListaDocumenti) che per ogni id, quindi per ogni gruppo,  vengono scaricati gli URL 
// annotati
function loadDocumentOfAllGraph(callback) {
    //per ogni grafo vengono scaricati tutti gli item 
    $.when(caricaListaDocumenti()).then(function (json)
    {
        var arrayPulito = json.results.bindings;
        listaDocGrafi = arrayPulito;
        callback();
    });
}

// questo metodo viene eseguito per scarcare tutte le informazioni da parte di tutti i gruppi sfruttando il metodo
// interroga grafi che si trovain externalGraph
function loadAllAnnotationOfGraphs(url, callback) {
    var i = 0;
    var k = 0;
    // countAnnotazioniAutomatiche = 0; non so da dove proviene
    $('#grafo').empty(); // pulisco tutti i pannelli dei grafi
    $(graphs).each(function(index) {                         
        $.when(interrogaGrafi(url, graphs[index]['nome'])).then(function(json){
                queryAnnotations.push(json);
                 //$('#annotationPanel').find('span[email="raschietto@ltw1545.web.cs.unibo.it"]').parent().remove();
                replaceGraphsButton(json, graphs[index]['nome'], index, url);
                k++;

                if(k === graphs.length) {
                    callback();
                }
            });
        i++;
    });
    lastIndex = i;
}

// questa funzione servirà per effettuare il force scraping ossia, verranno cancellate le annotazioni di un documento che non
// ha subito modifiche e ne verranno inserite delle nuove
function forceScraping(uri) {

    $('#scrape').find('#force').remove();
    $('#scrape').append('<i class="fa fa-spinner fa-spin fa-2x"></i>');

    $("#container-bar").show(); // rendo visibile la progress bar
    $('.badgeAnnOnDocument').text("0 Totali");
    numeroAnnot = 0;
    numAnnTot = 0;
    $('#loading1').attr("class", "fa fa-cog fa-spin pull-right");
    $('#loading2').attr("class", "fa fa-cog fa-spin pull-right");
    $('#annotationPanel').find('span[email="raschietto@ltw1545.web.cs.unibo.it"]').parent().remove();
    $('#pannelloPrincipale').find('span[email="raschietto@ltw1545.web.cs.unibo.it"]').contents().unwrap();
    
    $.ajax({
        url: 'php/AutomaticScrape.php',
        data: "uri=" + uri,
        type: 'GET',
        datatype: 'jsonp',
        success: function () {
            $('#annotationPanel').find('span').parent().remove();
            creaAnnotazioniDoc(uri);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            avviso("c'è stato un errore nella funzione id force scraping");
        }
    });
}

// questa funzione si occupa di creare le annotazioni su un documento andando a fare prima lo scrape e poi le stampa 
// nella metaArea
function creaAnnotazioniDoc(url) {
    $.ajax({
        headers: {'Content-Type': 'text/plain'},
        url: 'php/AutomaticScrape.php',
        data: "scrape="+url,
        type: 'GET',
        success: function (result) {
            //riazzero l'array che conterrà tutti i grafi
            queryAnnotations.length = 0;
            // nel momento in cui viene aperto un documento
            loadAllAnnotationOfGraphs(url, function () {
                lastIndex++;
                //$('#annotationPanel').find('span[email="raschietto@ltw1545.web.cs.unibo.it"]').parent().remove();
                replaceGraphsButton(queryAnnotations, 'Tutti', lastIndex, activeURI);
                $('#' + lastIndex).click();
            }); // scarica tutte le annotazioni di tutti i gruppi
            
            // qui vine fermata la rotella del force scraping se e' stato chiamato forcescraping
            $('#scrape').find('i').remove();
            $('#scrape').append('<img id="force" alt="raschietto" src="image/raschietto.png" style="width:30px;height:30px;">');
            caricaDoc();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            avviso("Qualcosa è andato storto nella creazione delle annotazioni sul document");
        }
    });
}


// gli passo anche la posizione per evitare di dover fare un nuovo ciclo per scorrere gli elementi e quindi evitare che se il documento contiene
// piu' di un autore, che questo si ripeta.
function stampaRisultato(json, type, index, flag, name) {
    var label;
    var queryResults = json.results.bindings;
    if (typeof queryResults[index]['fragment'] !== "undefined") {
        if (queryResults[index]['fragment'].value === "") {
            var label = queryResults[index]['label'];
            if (type === 'hasAuthor') {
                if (typeof queryResults[index]['nomeAutore'] !== "undefined") {
                    label = queryResults[index]['nomeAutore'];
                } else if (typeof queryResults[index]['labelAutore'] !== "undefined") {
                    label = queryResults[index]['labelAutore'];
                }
            }
            var ora = queryResults[index]['ora'];
            var nome = queryResults[index]['nome'];
            var mail = queryResults[index]['mail'];

            var selettore = "";
            switch (type) {
                case "hasTitle":
                    selettore = "lista-titolo";
                    break;
                case "hasPublicationYear":
                    selettore = "lista-pubblicazione";
                    break;
                case "hasAuthor":
                    selettore = "lista-autore";
                    break;
                case "hasDOI":
                    selettore = "lista-doi";
                    break;
                case "hasURL":
                    selettore = "lista-url";
                    break;
            }
            if (typeof nome !== 'undefined') {
                setDocAnnotation(selettore, label.value, nome.value, mail.value, ora.value, flag, name);
            } else {
                var mail = queryResults[index]['n'].value.substring(7, queryResults[index]['n'].value.lenght); // str.substring(1, 4);
                setDocAnnotation(selettore, label.value, nome, mail, ora.value, flag, name);
            }
            if (currentGraph !== "Heisenberg" && currentGraph !== "Tutti")
                numAnnTot--;
            $('.badgeAnnOnDocument').text(numAnnTot + " Totali");
        }
    }
}


function deleteSingleAnnotation(tipo, valore, uri, data) {
    var query = "PREFIX oa: <http://www.w3.org/ns/oa#>\
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\
        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\
        PREFIX skos: <http://www.w3.org/2004/02/skos/core#>\
        PREFIX rscht: <http://vitali.web.cs.unibo.it/raschietto/>\
        PREFIX rsch: <http://vitali.web.cs.unibo.it/raschietto/person/>\
        DELETE\
        WHERE {\
            GRAPH <http://vitali.web.cs.unibo.it/raschietto/graph/ltw1545> {\
                ?b a rdf:Statement;";
    var queryAnnSuCit = query;
    var tipoStatement;
    switch (tipo) {
        case 'autore':
            tipoStatement = "Autore";
            query += "rdf:object rsch:" + prepareFullname(valore) + ";" +
                    "rdfs:label ?nome ;";
            break;
        case 'pubblicazione':
            tipoStatement = "AnnoPubblicazione";
            query += "rdf:object '" + valore + "'^^xsd:gYear;";
            break;
        case 'titolo':
            tipoStatement = "Titolo";
            query += "rdf:object '" + valore.replace(/(['";])/g, "\\$1") + "'^^xsd:string;";
            break;
        case 'doi':
            tipoStatement = "DOI";
            query += "rdf:object '" + valore + "'^^xsd:string;";
            break;
        case 'url':
            tipoStatement = "URL";
            query += "rdf:object '" + valore + "'^^xsd:anyURL;";
            break;
        case 'citazione':
            tipoStatement = "Citazione";
            query += "rdf:label '" + valore.replace(/(['";])/g, "\\$1") + "';";
            break;
        case 'retorica':
            tipoStatement = "FunzioneRetorica";
            query += "rdf:object '" + valore + "'^^skos:Concept;";
            break;
        case 'commento':
            tipoStatement = "Commento";
            query += "rdf:object '" + valore + "'^^xsd:string;";
            break;
    }
    if (tipo === 'citazione') {
        query += "rdf:predicate ?p;\
                    rdf:subject ?sub.\
                ?sel a oa:FragmentSelector;\
                    rdf:value ?v;\
                    oa:end ?e;\
                    oa:start ?s.\
                ?t a oa:SpecificResource;\
                    oa:hasSelector ?sel;\
                    oa:hasSource <" + uri + ">.\
                ?x a oa:Annotation;\
                    rdfs:label '" + tipoStatement + "';\
                    rscht:type ?d;\
                    oa:annotatedAt '" + data + "';\
                    oa:annotatedBy ?c;\
                    oa:hasBody ?b;\
                    oa:hasTarget ?t.\
                }\
            }";
        queryAnnSuCit += "rdf:predicate ?p;\
                   rdf:subject <" + activeURI.replace('.html', '') + "_cited_" + encodeURIComponent(valore.replace(/(['";])/g, "\\$1")) + "_ver1>.\
                ?sel a oa:FragmentSelector;\
                    rdf:value ?v;\
                    oa:end ?e;\
                    oa:start ?s.\
                ?t a oa:SpecificResource;\
                    oa:hasSelector ?sel;\
                    oa:hasSource <" + uri + ">.\
                ?x a oa:Annotation;\
                    rdfs:label ?l;\
                    rscht:type ?d;\
                    oa:annotatedAt ?u;\
                    oa:annotatedBy ?c;\
                    oa:hasBody ?b;\
                    oa:hasTarget ?t.\
                }\
            }";
        $.post( "php/AutomaticScrape.php", { annotazioniDoc: query },
        function(){ 

        });
        $.post( "php/AutomaticScrape.php", { annotazioniDoc: queryAnnSuCit },
        function(){ 

        });
    } else {
        query += "rdf:predicate ?p;\
                rdf:subject ?sub.\
            ?sel a oa:FragmentSelector;\
                rdf:value ?v;\
                oa:end ?e;\
                oa:start ?s.\
            ?t a oa:SpecificResource;\
                oa:hasSelector ?sel;\
                oa:hasSource <" + uri + ">.\
            ?x a oa:Annotation;\
                rdfs:label '" + tipoStatement + "';\
                rscht:type ?d;\
                oa:annotatedAt '" + data + "';\
                oa:annotatedBy ?c;\
                oa:hasBody ?b;\
                oa:hasTarget ?t.\
            }\
        }";
        $.post( "php/AutomaticScrape.php", { annotazioniDoc: query },
        function(){ 

        });
    }
    /*var queryUrl = endpointURL + 'update?user=ltw1545&pass=aSSd)PoQ&format=json'; //'update?update=' + encodeURIComponent + '&user...'
    $.ajax({
        dataType: "text", //json jsonp html
        type: 'POST',
        data: {update: query}, //messo anche nella query
        url: queryUrl,
        success: function () {
        }
    });*/
}

function createJson()
{
    if (arrayAnnotazioni.length > 0) {
        //definizione dei prefissi
        json = "PREFIX oa: <http://www.w3.org/ns/oa#>\
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\
            PREFIX owl: <http://www.w3.org/2002/07/owl#>\
            PREFIX rsch: <http://vitali.web.cs.unibo.it/raschietto/person/>\
            PREFIX rscht: <http://vitali.web.cs.unibo.it/raschietto/>\
            PREFIX schema: <http://schema.org/>\
            PREFIX prism: <http://prismstandard.org/namespaces/basic/2.0/>\
            PREFIX foaf: <http://xmlns.com/foaf/0.1/>\
            PREFIX dcterms: <http://purl.org/dc/terms/>\
            PREFIX fabio: <http://purl.org/spar/fabio/>\
            PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\
            PREFIX frbr: <http://purl.org/vocab/frbr/core#>\
            PREFIX skos: <http://www.w3.org/2004/02/skos/core#>\
            PREFIX cito: <http://purl.org/spar/cito/>\
            PREFIX sem: <http://www.ontologydesignpatterns.org/cp/owl/semiotics.owl#>\
            INSERT DATA { GRAPH <http://vitali.web.cs.unibo.it/raschietto/graph/ltw1545> {";

            for (var i = 0; i < arrayAnnotazioni.length; i++) {
                var type = ""; // Tipo grezzo di annotazione
                var label = ""; // Nome dell'annotazione
                var predicate = ""; // Predicato dell'annotazione
                var object = ""; // Risorsa o letterale che fa da soggetto all'annotazione
                var content = ""; // Il nome umano dato alla risorsa o al letterale
                var annDoc = false;

                if (!arrayAnnotazioni[i].id) {
                    annDoc = true;
                }
                switch (arrayAnnotazioni[i].type) {
                    case "autore":
                    {
                        label = "Autore";
                        type = "hasAuthor";
                        predicate = "dcterms:creator";
                        object = "rsch:"+prepareFullname(arrayAnnotazioni[i].content);
                        content = '"' + arrayAnnotazioni[i].content + '"';
                    }
                        break;
                    case "autoreCit":
                    {
                        label = "Autore";
                        type = "hasAuthor";
                        predicate = "dcterms:creator";
                        object = "rsch:"+prepareFullname(arrayAnnotazioni[i].content);
                        content = '"' + arrayAnnotazioni[i].content + '"';
                    }
                        break;
                    case "nuovoAutoreCit":
                    {
                        label = "Autore";
                        type = "hasAuthor";
                        predicate = "dcterms:creator";
                        object = createJsonInstance(arrayAnnotazioni[i].type, arrayAnnotazioni[i].content);
                        content = '"' + arrayAnnotazioni[i].content + '"';
                    }
                        break;
                    case "nuovoAutore":
                    {
                        label = "Autore";
                        type = "hasAuthor";
                        predicate = "dcterms:creator";
                        object = createJsonInstance(arrayAnnotazioni[i].type, arrayAnnotazioni[i].content);
                        content = '"' + arrayAnnotazioni[i].content + '"';
                    }
                        break;
                    case "pubblicazione":
                    {
                        label = "AnnoPubblicazione";
                        type = "hasPublicationYear";
                        predicate = "fabio:hasPublicationYear";
                        object = '"' + arrayAnnotazioni[i].content + '"^^xsd:gYear';
                    }
                        break;
                    case "pubblicazioneCit":
                    {
                        label = "AnnoPubblicazione";
                        type = "hasPublicationYear";
                        predicate = "fabio:hasPublicationYear";
                        object = '"' + arrayAnnotazioni[i].content + '"^^xsd:gYear';
                        content = '"' + arrayAnnotazioni[i].content + '"';
                    }
                        break;
                    case "titolo":
                    {
                        label = "Titolo";
                        type = "hasTitle";
                        predicate = "dcterms:title";
                        object = '"' + arrayAnnotazioni[i].content + '"^^xsd:string';
                    }
                        break;
                    case "titoloCit":
                    {
                        label = "Titolo";
                        type = "hasTitle";
                        predicate = "dcterms:title";
                        object = '"' + arrayAnnotazioni[i].content + '"^^xsd:string';
                        content = '"' + arrayAnnotazioni[i].content + '"';
                    }
                        break;
                    case "doi":
                    {
                        label = "DOI";
                        type = "hasDOI";
                        predicate = "prism:doi";
                        object = '"' + arrayAnnotazioni[i].content + '"^^xsd:string';
                    }
                        break;
                    case "doiCit":
                    {
                        label = "DOI";
                        type = "hasDOI";
                        predicate = "prism:doi";
                        object = '"' + arrayAnnotazioni[i].content + '"^^xsd:string';
                        content = '"' + arrayAnnotazioni[i].content + '"';
                    }
                        break;
                    case "url":
                    {
                        label = "URL";
                        type = "hasURL";
                        predicate = "fabio:hasURL";
                        object = '"' + arrayAnnotazioni[i].content + '"^^xsd:anyURL';
                    }
                        break;
                    case "urlCit":
                    {
                        label = "URL";
                        type = "hasURL";
                        predicate = "fabio:hasURL";
                        object = '"' + arrayAnnotazioni[i].content + '"^^xsd:anyURL';
                        content = '"' + arrayAnnotazioni[i].content + '"';
                    }
                        break;
                    case "commento":
                    {
                        label = "Commento";
                        type = "hasComment";
                        predicate = "schema:comment";
                        object = '"' + arrayAnnotazioni[i].content + '"^^xsd:string';
                    }
                        break;
                    case "retorica":
                    {
                        label = "FunzioneRetorica";
                        type = "denotesRhetoric";
                        predicate = "sem:denotes";
                        object = '"' + arrayAnnotazioni[i].content + '"^^skos:Concept';
                    }
                        break;
                    case "citazione":
                    {
                        label = "Citazione";
                        type = "cites";
                        predicate = "cito:cites";
                        object = createJsonInstance(arrayAnnotazioni[i].type, arrayAnnotazioni[i].content);
                        content = '"' + arrayAnnotazioni[i].content + '"';
                    }
                        break;
                }
                if(annDoc) {
                    countAnnotazioniAutomatiche++;
                    if (arrayAnnotazioni[i].type === 'autore' || arrayAnnotazioni[i].type === 'nuovoAutore') {
                        json += '\
                            [ a oa:Annotation ;\
                                rdfs:label "' + label + '";\
                                rscht:type "' + type + '"; \
                                oa:annotatedAt "' + arrayAnnotazioni[i].date + '" ;\
                                oa:annotatedBy <mailto:' + arrayAnnotazioni[i].email + '> ;\
                                oa:hasBody[ a rdf:Statement ;\
                                    rdf:object ' + object + ';\
                                    rdf:predicate ' + predicate + ' ;\
                                    rdf:subject <' + activeURI.replace(".html", "") + '_ver1' + '> ;\
                                    rdfs:label ' + content + '\
                                ] ;\
                                oa:hasTarget[ a oa:SpecificResource ;\
                                    oa:hasSelector[ a oa:FragmentSelector ;\
                                        rdf:value "" ;\
                                        oa:start "" ;\
                                        oa:end ""\
                                    ] ;\
                                oa:hasSource <' + activeURI + '>\
                                ]\
                            ] .\
                            ';
                    } else {
                        json += '\
                            [ a oa:Annotation ;\
                                rdfs:label "' + label + '";\
                                rscht:type "' + type + '"; \
                                oa:annotatedAt "' + arrayAnnotazioni[i].date + '" ;\
                                oa:annotatedBy <mailto:' + arrayAnnotazioni[i].email + '> ;\
                                oa:hasBody[ a rdf:Statement ;\
                                    rdf:object ' + object + ' ;\
                                    rdf:predicate ' + predicate + ' ;\
                                    rdf:subject <' + activeURI.replace(".html", "") + '_ver1' + '> ;\
                                ] ;\
                                oa:hasTarget[ a oa:SpecificResource ;\
                                    oa:hasSelector[ a oa:FragmentSelector ;\
                                        rdf:value "" ;\
                                        oa:start "" ;\
                                        oa:end ""\
                                    ] ;\
                                oa:hasSource <' + activeURI + '>\
                                ]\
                            ] .';
                    }
                } else {
                    if (arrayAnnotazioni[i].type === 'autore' || arrayAnnotazioni[i].type === 'nuovoAutore') {
                        json += '\
                            [ a oa:Annotation ;\
                                rdfs:label "' + label + '";\
                                rscht:type "' + type + '" ;\
                                oa:annotatedAt "' + arrayAnnotazioni[i].date + '" ;\
                                oa:annotatedBy <mailto:' + arrayAnnotazioni[i].email + '> ;\
                                oa:hasBody[ a rdf:Statement ;\
                                    rdf:object ' + object + ' ;\
                                    rdf:predicate ' + predicate + ' ;\
                                    rdf:subject <' + activeURI + '#' + arrayAnnotazioni[i].id + '-' + arrayAnnotazioni[i].start + '-' + arrayAnnotazioni[i].end + '> ;\
                                    rdfs:label ' + content + '\
                                ] ;\
                                oa:hasTarget[ a oa:SpecificResource ;\
                                    oa:hasSelector[ a oa:FragmentSelector ;\
                                        rdf:value "' + arrayAnnotazioni[i].id + '" ;\
                                        oa:start "' + arrayAnnotazioni[i].start + '";\
                                        oa:end "' + arrayAnnotazioni[i].end + '"\
                                    ] ;\
                                oa:hasSource <' + activeURI + '>\
                                ]\
                            ] .';
                    } else if (arrayAnnotazioni[i].type === 'citazione') {
                        json += '\
                            [ a oa:Annotation ;\
                                rdfs:label "' + label + '";\
                                rscht:type "' + type + '" ;\
                                oa:annotatedAt "' + arrayAnnotazioni[i].date + '" ;\
                                oa:annotatedBy <mailto:' + arrayAnnotazioni[i].email + '> ;\
                                oa:hasBody[ a rdf:Statement ;\
                                    rdf:object ' + object + ' ;\
                                    rdf:predicate ' + predicate + ' ;\
                                    rdf:subject <' + activeURI.replace(".html", "") + '_ver1' + '>;\
                                    rdf:label ' + content + '\
                                ] ;\
                                oa:hasTarget[ a oa:SpecificResource ;\
                                    oa:hasSelector[ a oa:FragmentSelector ;\
                                        rdf:value "' + arrayAnnotazioni[i].id + '" ;\
                                        oa:start "' + arrayAnnotazioni[i].start + '";\
                                        oa:end "' + arrayAnnotazioni[i].end + '"\
                                    ] ;\
                                oa:hasSource <' + activeURI + '>\
                                ]\
                            ] .';
                    } else if (arrayAnnotazioni[i].type === 'autoreCit' || arrayAnnotazioni[i].type === 'nuovoAutoreCit' || arrayAnnotazioni[i].type === 'titoloCit' || arrayAnnotazioni[i].type === 'pubblicazioneCit' || arrayAnnotazioni[i].type === 'doiCit' || arrayAnnotazioni[i].type === 'urlCit') {
                        json += '\
                            [ a oa:Annotation ;\
                                rdfs:label "' + label + '";\
                                rscht:type "' + type + '" ;\
                                oa:annotatedAt "' + arrayAnnotazioni[i].date + '" ;\
                                oa:annotatedBy <mailto:' + arrayAnnotazioni[i].email + '> ;\
                                oa:hasBody[ a rdf:Statement ;\
                                    rdf:object ' + object + ' ;\
                                    rdf:predicate ' + predicate + ' ;\
                                    rdf:subject <' + activeURI.replace(".html", "") + '_cited_' + encodeURIComponent(arrayAnnotazioni[i].target) + '_ver1>;\
                                    rdfs:label ' + content + '\
                                ] ;\
                                oa:hasTarget[ a oa:SpecificResource ;\
                                    oa:hasSelector[ a oa:FragmentSelector ;\
                                        rdf:value "' + arrayAnnotazioni[i].id + '" ;\
                                        oa:start "' + arrayAnnotazioni[i].start + '";\
                                        oa:end "' + arrayAnnotazioni[i].end + '"\
                                    ] ;\
                                oa:hasSource <' + activeURI + '>\
                                ]\
                            ] .';
                    } else {
                        json += '\
                            [ a oa:Annotation ;\
                            rdfs:label "' + label + '";\
                            rscht:type "' + type + '" ;\
                            oa:annotatedAt "' + arrayAnnotazioni[i].date + '" ;\
                            oa:annotatedBy <mailto:' + arrayAnnotazioni[i].email + '> ;\
                            oa:hasBody[ a rdf:Statement ;\
                                rdf:object ' + object + ' ;\
                                rdf:predicate ' + predicate + ' ;\
                                rdf:subject <' + activeURI + '#' + arrayAnnotazioni[i].id + '-' + arrayAnnotazioni[i].start + '-' + arrayAnnotazioni[i].end + '> ;\
                            ] ;\
                            oa:hasTarget[ a oa:SpecificResource ;\
                                oa:hasSelector[ a oa:FragmentSelector ;\
                                    rdf:value "' + arrayAnnotazioni[i].id + '" ;\
                                    oa:start "' + arrayAnnotazioni[i].start + '";\
                                    oa:end "' + arrayAnnotazioni[i].end + '"\
                                ] ;\
                            oa:hasSource <' + activeURI + '>\
                            ]\
                        ] .';
                    }
                }

                // Rimozione dell'attributo new per segnalare l'annotazione come gia' scritta
                $("span[codice='" + arrayAnnotazioni[i].code + "']").removeAttr("new");
            }

            json += '\
                    <mailto:' + email +'>\
                        schema:email  "'+ email +'" ;\
                        foaf:name     "'+ username+'" .' +
                    '} ' +
                '}';
            sendJson(json);
            $("#modalGestioneAnnotazioni").modal("hide");
        } else {
            $("#modalGestioneAnnotazioni").modal("hide");
            avviso("Non c'è nessuna annotazione da inviare.");
        }
}

function createJsonInstance(type, value) {
    var oggetto;
    var predicato;
    var uri;
    var label = value;

    switch(type) {
        case "citazione":
            oggetto = "fabio:Expression";
            uri = '<' + activeURI.replace(".html", "") + '_cited_' + encodeURIComponent(value) + '_ver1>';
            break;
        default:
            value = prepareFullname(value);
            oggetto = "foaf:Person";
            predicato = "rdfs:label";
            uri = "rsch:"+value;
            break;
            countCit++;
    }
    json += '\
            '+uri+'\
                a '+oggetto+'';
    if(type !== "citazione") {
        json += ';\
                '+predicato+' "'+label+'".' ;
    } else {
        json += '; rdfs:label "' + value + '".';
    }
    return uri;
}

function sendJson(jsonDaInviare) {
    var queryUrl = endpointURL + 'update?user=ltw1545&pass=aSSd)PoQ&format=json'; //'update?update=' + encodeURIComponent + '&user...'
    /*$.ajax({
        dataType : "json", //json jsonp html
        type : 'POST',
        data: {update: jsonDaInviare}, //messo anche nella query
        url : queryUrl
    });
    arrayAnnotazioni = [];
    json = "";*/
    $.post( "php/AutomaticScrape.php", { annotazioniDoc: jsonDaInviare }, function() { 
            arrayAnnotazioni = [];
            json = ""; 
    })
            .fail(function() {
                avviso("L'inserimento delle annotazioni sul grafo non è andato a buon fine.");
    });
}
