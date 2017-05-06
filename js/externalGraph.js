
/* global numeroAnnEsterne, numeroAnnotazioni, countAnnotazioniAutomatiche, endpointURL, activeURI, docNum */

 
 // questa funzione si occupera' di caricare nella parte sinistra della pagina tutti i documenti gia consultati
// vengono esclusi i documenti annotati nel nostro grafo
function caricaListaDocumenti() {
    docNum = 0;
    $('.badgeDocumenti').text(docNum + " Annotati");
    var titolo = "";
    var uri = "";
    var myquery = "\
    PREFIX oa: <http://www.w3.org/ns/oa#>\
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\
    PREFIX : <http://vitali.web.cs.unibo.it/raschietto/graph/>\
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\
    PREFIX fabio: <http://purl.org/spar/fabio/>\
    \
    SELECT DISTINCT ?doc\
    WHERE  {\
        ?doc a fabio:Item.\
        FILTER NOT EXISTS { ?doc a fabio:Item. FILTER regex(str(?doc), 'cited') } \
        FILTER NOT EXISTS { ?doc a fabio:Item. FILTER regex(str(?doc), 'Citation') }\
         FILTER NOT EXISTS { ?doc a fabio:Item. FILTER regex(str(?doc), 'Reference') }\
    }\
   ";
   
    var encodedquery = encodeURIComponent(myquery);
    var queryUrlDoc = endpointURL + "query?query=" + encodedquery + "&format=" + "json";
    var documents = "";
    $('#docList').empty();
    $('#docList').append('<i class="fa fa-spinner fa-spin fa-3x"></i>');
    
   return $.ajax({
        url: queryUrlDoc,
        dataType: 'jsonp',
        error: function() {
            $('#loading1').attr('class', ''); // Stop icona caricamento
            avviso("Attenzione! Non è stato possibile caricare almeno un documento. E' possibile che la pagina cercata non sia più presente al link memorizzato, o più facilmente è stato raggiunto il timeout della connessione.");
        }
    });
}
 
 // il metodo qui di seguito si occupa di scaricare tutti i grafi presenti sullo sparqlEndPoint. 
 //Dopo di che viene fatto lo scrape della pagina del corso e fatto un confronto, ossia verifica quali gruppi del corso sono presenti
 // sullo sparql endpoint (quindi che hanno gia annotato). Tali gruppi vengono visualizzati nella metaarea. Gli altri vengono
 // eliminati
function gruppiAttivi(){
    $('#loading4').attr('class', 'fa fa-cog fa-spin pull-right');
    $('#grafo').append('<i class="fa fa-spinning fa-spin fa-3x"></i>');
    var myquery = "\
    \
    SELECT DISTINCT ?g \
    WHERE  {\
             GRAPH ?g { ?s ?p ?o . }\
}\
";  
    var encodedquery = encodeURIComponent(myquery);
    var queryUrl = endpointURL + "query?query=" + encodedquery + "&format=" + "json";
    
    $.ajax({
        dataType : "jsonp",
        url : queryUrl,
        success : function(json) {
           var queryResults = json.results.bindings;
            var tec = 'http://vitali.web.cs.unibo.it/TechWeb15/ProgettoDelCorso';
            
            var grafi = [];
            var temp = [];
            
            for(var i in queryResults){
                 temp.push(queryResults[i]['g'].value);
            }
            for(var i in temp){
                var split=temp[i].split('/');
                grafi.push(split[split.length-1]);                
            }
            // adess viene fatto lo scrape della pagina del corso
            $.ajax({
                url: "php/SwitchGraph.php",
                data: "tec="+tec,
                type: 'get',
                dataType: 'json',
                success: function(data) { // prendo come risultato id e nome del gruppo
                    for(var i in data){
                        var found = $.inArray(data[i].id, grafi); // funzione che cerca se un elemento è presente o meno in un array
                        if(found==-1){ // se l'elemento non è stato trovato allora cancellalo da data
                            delete data[i];
                        }
                    }
                    var arrayPulito = [];
                    $(data).each(function () {
                        if (typeof this['nome'] !== "undefined" && typeof this['id'] !== "undefined")
                           arrayPulito.push({id: this['id'], nome: this['nome']});
                    });
                    graphs = arrayPulito;
                    createGraphsButtons(arrayPulito);
                    
                    // vengono caricati tutti i documenti
                    caricaDoc();
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    avviso("Errore nello switch tra i grafi.");
                }
            });
        },
        error: function() {
           avviso('Errore nello scaricare gli altri grafi.');
        }
    });
}


// questa query scarica e permette la gestione di tutte le annotazioni fatte ad opera di tutti i gruppi 
// presenti per ogni docuemnto selezionato
function interrogaGrafi(url, name){
    
    var id = findID(name);
    var myquery = "\
    PREFIX oa: <http://www.w3.org/ns/oa#>\
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\
    PREFIX owl: <http://www.w3.org/2002/07/owl#>\
    PREFIX : <http://vitali.web.cs.unibo.it/raschietto/graph/>\
    PREFIX rsch: <http://vitali.web.cs.unibo.it/raschietto/>\
    PREFIX schema: <http://schema.org/>\
    prefix prism: <http://prismstandard.org/namespaces/basic/2.0/>\
    prefix foaf: <http://xmlns.com/foaf/0.1/>\
    prefix dcterms: <http://purl.org/dc/terms/>\
    PREFIX fabio: <http://purl.org/spar/fabio/>\
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\
    PREFIX schema: <http://schema.org/>\
    PREFIX rscht: <http://vitali.web.cs.unibo.it/raschietto/>\
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\
    \
    SELECT ?label ?ora ?n ?type ?labelType ?inizio ?fine ?soggetto ?predicato ?fragment ?mail ?nome ?nomeAutore ?itemReference ?content ?labelAutore\
        WHERE  {\
        GRAPH <http://vitali.web.cs.unibo.it/raschietto/graph/"+ id +"> {\
            ?y a rdf:Statement;\
            rdf:subject ?soggetto;\
            rdf:predicate ?predicato;\
            rdf:object ?label.\
            ?sel a oa:FragmentSelector;\
            rdf:value ?fragment;\
            oa:end ?fine;\
            oa:start ?inizio.\
            ?t a oa:SpecificResource;\
            oa:hasSelector ?sel;\
            oa:hasSource ?itemReference.\
            ?x a oa:Annotation;\
            rdfs:label ?labelType;\
            oa:annotatedAt ?ora;\
            oa:annotatedBy ?n;\
            oa:hasBody ?y;\
            oa:hasTarget ?t.\
            OPTIONAL { ?x rscht:type ?type. }\
            OPTIONAL { ?n schema:email ?mail.  ?n foaf:name ?nome. }\
            OPTIONAL { ?label a foaf:Person. ?label rdfs:label ?nomeAutore. }\
            OPTIONAL { ?y rdf:label ?content. }\
            OPTIONAL { ?y rdfs:label ?labelAutore. }\
            FILTER regex(str(?itemReference), '^"+url+"','i')\
        }\
    }";

    var encodedquery = encodeURIComponent(myquery);
    var queryUrl = endpointURL + "query?query=" + encodedquery + "&format=" + "json";

    return $.ajax({
        dataType : "jsonp",
        url : queryUrl,
        error: function() {
            avviso("Errore nello scaricare gli altri grafi.");
        }
    });
}
