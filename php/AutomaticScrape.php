<?php

/*
 *  Created by Antonio on 21/08/2015.
 * 
 * NOTA: Caricamento delle triple all'interno di un file.ttl caricato in precedenza mediante il comando:
 * - fuseki-server --file=C:/Users/Antonio/Desktop/ttl/RDF_Heisenberg.ttl /ds
 * Per invece attivare normalmente il server digitare nella directroy dove è installato apache-fuseky:
 * - fuseki-server --update --mem /ds
 * 
 * Lo script si occupa di:
 * - fare scraping del documento, caricare le annotazioni FRBR riguardanti il docuemnto e poi
 * caricare le restanti ottenute dallo scrape.
 *   scrape(param), loadAnnotation(param), annotazioneDocumento(param), InserisciAnnotazione($annotations)
 * - cancellare tutte le annotazioni automatiche sul documento (per il force scraping)
 *   delete(param), removeAnnotationOnDocument(param) deleteAnnotation(param, param)   
 */

require_once(__DIR__."./../easyrdflib/EasyRdf.php");

header('Access-Control-Allow-Origin: *'); 
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');

$GLOBALS['sparql'] = new EasyRdf_Sparql_Client(
        'http://tweb2015.cs.unibo.it:8080/data/query',
        'http://tweb2015.cs.unibo.it:8080/data/update?user=ltw1545&pass=aSSd)PoQ'
    );
/*$GLOBALS['sparql'] = new EasyRdf_Sparql_Client(
        'http://localhost:3030/ds/data/query',
        'http://localhost:3030/ds/update'
    );*/

$GLOBALS['annDoc'] = false;
// queste variabile globale mi serve per tenere unite tutte le annotazioni
$GLOBALS['fabioExpression'] = ""; 
$GLOBALS['fabioItem'] = ""; 
$GLOBALS['fabioWork'] = ""; 
// namespace
EasyRdf_Namespace::set('rsch', 'http://vitali.web.cs.unibo.it/raschietto/person/');
EasyRdf_Namespace::set('rscht', 'http://vitali.web.cs.unibo.it/raschietto/');
EasyRdf_Namespace::set('rdf', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#'); 
EasyRdf_Namespace::set('schema', 'http://schema.org/');  
EasyRdf_Namespace::set('rdfs', 'http://www.w3.org/2000/01/rdf-schema#');   
EasyRdf_Namespace::set('oa', 'http://www.w3.org/ns/oa#');   
EasyRdf_Namespace::set('prism', 'http://prismstandard.org/namespaces/basic/2.0/');
EasyRdf_Namespace::set('foaf', 'http://xmlns.com/foaf/0.1/');
EasyRdf_Namespace::set('dcterms', 'http://purl.org/dc/terms/');
EasyRdf_Namespace::set('fabio', 'http://purl.org/spar/fabio/');
EasyRdf_Namespace::set('xsd', 'http://www.w3.org/2001/XMLSchema#');
EasyRdf_Namespace::set('frbr', 'http://purl.org/vocab/frbr/core#');
EasyRdf_Namespace::set('gr', 'http://vitali.web.cs.unibo.it/raschietto/graph/'); // in php per specificare il prefisso del grafo si devono specificare dei caratteri alfanumerici
    

if(isset($_GET['url'])) {
    $uri = filter_input(INPUT_GET, 'url', FILTER_SANITIZE_URL);
    print scrape($uri);
}
else if (isset($_GET['scrape'])) {
    $uri_new = filter_input(INPUT_GET, 'scrape', FILTER_DEFAULT);
    print loadAnnotation($uri_new);
}
else if(isset($_GET['uri'])) {
    $uri = filter_input(INPUT_GET, 'uri', FILTER_SANITIZE_URL);
    delete($uri);
}
else if(isset($_POST['annotazioniDoc'])) {
    sendJson($_POST['annotazioniDoc']);
}

function scrape($uri) {
    $prefix = ""; // di default è vuota e serve per settare il prefisso.


    $options = Array(
        CURLOPT_RETURNTRANSFER => TRUE,  // Opzione per ritornare la pagina voluta
        CURLOPT_FOLLOWLOCATION => TRUE,  // Opzione per seguire la locazione degli HTTP headers
        CURLOPT_AUTOREFERER => TRUE, // Setta automaticamente il riferimento dove seguire gli HTTP headers
        CURLOPT_CONNECTTIMEOUT => 120,   // Ammontare dei secondi prima che la richiesta termini
        CURLOPT_TIMEOUT => 120,  // Ammontare dei secondi per eseguire le query
        CURLOPT_MAXREDIRS => 10, // Numero massimo di ridirezioni da seguire
        CURLOPT_USERAGENT => "Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.9.1a2pre) Gecko/2008073000 Shredder/3.0a2pre ThunderBrowse/3.2.1.8",
        CURLOPT_URL => $uri, // $url variabile passata alla funzione
    );

    $curl = curl_init($uri);
    curl_setopt_array($curl, $options);
    $page = curl_exec($curl);
    if(curl_errno($curl)) // check for execution errors per evitare che si sovraccari la mmemoria
    {
        echo 'Scraper error: ' . curl_error($curl);
        exit;
    }
    curl_close($curl);

    $doc = new DOMDocument;

    libxml_use_internal_errors(true);

    if (!$doc->loadHTML($page))
    {
        $errors="";
        foreach (libxml_get_errors() as $error)  {
            $errors.=$error->message."<br/>";
        }
        libxml_clear_errors();
        print "libxml errors:<br>$errors";
        return;
    }
    $xpath = new DOMXPath($doc);


    /*$doc = new DOMDocument(); // creo un nuovo docDocument
    libxml_use_internal_errors(true);
    $doc->loadHTMLFile($uri); // carico il file di mio interesse a cui poi passerò il parametro
    $xpath = new DOMXpath($doc); // passo il parser di XPath sul mio file di interesse*/


    $arrayUri = split('/', $uri); // splittiamo il path per riconoscere il tipo di url

    if ($arrayUri[2] == "rivista-statistica.unibo.it" || $arrayUri[2] == "danzaericerca.unibo.it" || $arrayUri[2] == "www.dlib.org" || $arrayUri[2] == "musicadocta.unibo.it") {

        if ($arrayUri[2] == "rivista-statistica.unibo.it" || $arrayUri[2] == "musicadocta.unibo.it") {
            // titolo
            $titolo = $xpath->query('//div[@id="articleTitle"]')->item(0)->nodeValue;
            $pathTitolo = $xpath->query('//div[@id="articleTitle"]')->item(0)->getNodePath();
            $startTitolo = 0;
            $endTitolo = strlen($titolo);

            // data di pubblicazione
            $tags = get_meta_tags($uri);
            $splitAnno = split('-', $tags["dc_date_datesubmitted"]);
            $annoPubblicazione = $splitAnno[0];
            $alternativeYears =  $xpath->query('//*[@id="breadcrumb"]/a[2]')->item(0)->nodeValue;
            $pathAnnoPubblicazioe = $xpath->query('//*[@id="breadcrumb"]/a[2]')->item(0)->getNodePath();
            $startAnno = strlen($alternativeYears)-5;
            $endAnno = strlen($alternativeYears)-1;


            // DOI
            $doi = $xpath->query('//a[@id="pub-id::doi"]')->item(0)->nodeValue;
            $pathDoi = $xpath->query('//a[@id="pub-id::doi"]')->item(0)->getNodePath();
            $startDoi = 0;
            $endDoi = strlen($doi);

            // estrapolo tutti gli autori
            $listaPath = array();
            $listaStartEnd = array();
            $i = 0;
            $autori = $xpath->query('//div[@id="authorString"]/em')->item(0)->nodeValue;
            $pathautori = $xpath->query('//div[@id="authorString"]/em')->item(0)->getNodePath();
            $listaAutori = split(", ", $autori);
            $fragment_autore = costruisciPathUrl($pathautori);
            // ciclo per inserire lo stesso path tante volte quante sono gli autori

            foreach ($listaAutori as $a) {
                $listaPath[$i] = $fragment_autore;
                // prendo l'ultimo valore presente nell'array, la prima volta sarà null, quindi sarà 0
                // per oi fare la somma e ottenere lo start e l'end di ogni autore
                $lastEnd = end($listaStartEnd);
                if ($lastEnd['end'] == NULL) {
                    $lastEnd['end'] = 0;
                }
                $nuovo = array('start' => $lastEnd['end'], 'end' => ($lastEnd['end'] + strlen($a)+1));
                array_push($listaStartEnd, $nuovo);
                $i++;
            }

            // $listaPath[0] = $fragment_autore;
            $fragment_titolo = costruisciPathUrl($pathTitolo);
            $fragment_annoPubblicazione = costruisciPathUrl($pathAnnoPubblicazioe);
            $fragment_doi = costruisciPathUrl($pathDoi);

            // costruzione variabili per identificare  gli Item, Work ed Expresssion (FRBR)
            $lenght = count($arrayUri) - 1;
            $html = $arrayUri[$lenght];
            $fabioWork = str_replace('.html', '', $html);
            $fabioExpression = $html."_ver1";

            // settiamo namespace e prefisso
            unset($arrayUri[$lenght]);
            $unionArray =  implode("/",$arrayUri);
            EasyRdf_Namespace::set('rivistastatistica',$unionArray."/");
            $prefix = 'rivistastatistica:';
            $path = $unionArray."/";

        } else if ($arrayUri[2] == "danzaericerca.unibo.it") {
            // titolo
            $titolo = $xpath->query('//div[@id="articleTitle"]')->item(0)->nodeValue;
            $pathTitolo = $xpath->query('//div[@id="articleTitle"]')->item(0)->getNodePath();
            $startTitolo = 0;
            $endTitolo = strlen($titolo);

            // data di pubblicazione
            $tags = get_meta_tags($uri);
            $splitAnno = split('-', $tags["dc_date_datesubmitted"]);
            $annoPubblicazione = $splitAnno[0];
            //$pathAnnoPubblicazioe = $xpath->query('//*[@id="breadcrumb"]/a[2]')->item(0)->getNodePath();
            $pathAnnoPubblicazioe = '';
            $startAnno = '';
            $endAnno = '';

            // DOI (NOTA: Il Doi non è disponibile per questo documento)
            $doi = "Non disponibile";
            $fragment_doi = '';
            $startDoi = '';
            $endDoi = '';

            // Estrapolo tutti gli autori
            $listaPath = array();
            $listaStartEnd = array();
            $i = 0;
            $autori = $xpath->query('//div[@id="authorString"]/em')->item(0)->nodeValue;
            $pathautori = $xpath->query('//div[@id="authorString"]/em')->item(0)->getNodePath();
            $listaAutori = split(",", $autori);

            $fragment_autore = costruisciPathUrl($pathautori);
            foreach($listaAutori as $a){
                $listaPath[$i] = $fragment_autore;
                $nuovo = array('start' => 0, 'end' => strlen($a));
                $listaStartEnd[$i] = $nuovo;
                $i++;
            }
            $fragment_titolo = costruisciPathUrl($pathTitolo);
            $fragment_annoPubblicazione = costruisciPathUrl($pathAnnoPubblicazioe);


            $lenght = count($arrayUri) - 1;
            $html = $arrayUri[$lenght];
            $fabioWork = str_replace('.html', '', $html);
            $fabioExpression = $html."_ver1";

            // settiamo namespace e prefisso
            unset($arrayUri[$lenght]);
            $unionArray =  implode("/",$arrayUri);
            EasyRdf_Namespace::set('danzaericerca',$unionArray."/");
            $prefix = 'danzaericerca:';
            $path = $unionArray."/";

        } else if ($arrayUri[2] == "www.dlib.org") {

            // titolo
            $titolo = $xpath->query('//h3[@class="blue-space"][2]')->item(0)->nodeValue;
            $pathTitolo = $xpath->query('//h3[@class="blue-space"][2]')->item(0)->getNodePath();


            $info1 = $xpath->query('//p[@class="blue"]')->item(0)->nodeValue;
            //$pathInfo1 = $xpath->query('//p[@class="blue"]')->item(0)->getNodePath();
            $pathInfo1 = '';

            // anno
            $meseEanno = explode("\n", trim($info1)); // La funzione explode di PHP ha il compito di suddividere una stringa sulla base di un dato separatore., trim collassa gli spazi
            $anno = split(' ', $meseEanno[0]);
            $annoPubblicazione = $anno[1];



            //autore - Contiente tutto il <p> che rachiude varie informazioni. Noi lo facciamo per il DOI
            $info2 = $xpath->query('//p[@class="blue"]')->item(1)->nodeValue;
            //$pathInfo2 = $xpath->query('//p[@class="blue"]')->item(1)->getNodePath();  // verificare il path del DOI
            $pathInfo2 = '';
            $contenitore_doi = explode("\n", trim($info2)); // path del DOI

            $tags = get_meta_tags($uri);
            $doi = $tags['doi'];

            // estrapolo tutti gli autori
            $listaStartEnd = array();
            $autori = $xpath->query('//p[@class="blue"]/b');
            // inserisco tutti gli autori all'interno di un array
            $listaAutori = array();
            $listaPath = array();
            $i = 0;
            foreach ($autori as $key=>$a) {
                $listaAutori[$i] = trim($a->nodeValue); // non considera gli spazi
                $listaPath[$i] = costruisciPathUrl($a->getNodePath());
                $nuovo = array('start' => 0, 'end' => strlen($listaAutori[$i]));
                $listaStartEnd[$i] = $nuovo;
                $i++;
            }

            $fragment_titolo = costruisciPathUrl($pathTitolo);
            $startTitolo = 0;
            $endTitolo = strlen($titolo);

            $fragment_annoPubblicazione = costruisciPathUrl($pathInfo1);
            $startAnno = '';
            $endAnno = '';

            $fragment_doi = costruisciPathUrl($pathInfo2);
            $startDoi = '';
            $endDoi = '';

            // costruzione variabili per identificare  gli Item, Work ed Expresssion (FRBR)
            //************************************************************************************************************
            $lenght = count($arrayUri) - 1;
            $html = $arrayUri[$lenght];

            $fabioWork = str_replace('.html', '', $html);
            $fabioExpression = str_replace('.html', '_ver1', $html);

            unset($arrayUri[$lenght]);
            $unionArray =  implode("/",$arrayUri);
            EasyRdf_Namespace::set('dlib',$unionArray."/");
            $prefix = 'dlib:';
            $path = $unionArray."/";

        }

        // creo il json che contiene tutte le informazioni ricavate.
        $scraping = array(
            'autore' => array(
                'author' => $listaAutori,
                'frammento' => $listaPath,
                'startEnd' => $listaStartEnd,
            ),
            'annoDiPubblicazione' => array(
                'pubblicato' => $annoPubblicazione,
                'frammento' => $fragment_annoPubblicazione,
                'start' => $startAnno,
                'end' => $endAnno,
            ),
            'titolo' => array(
                'title' => $titolo,
                'frammento' => $fragment_titolo,
                'start' => $startTitolo,
                'end' => $endTitolo,
            ),
            'doi' => array(
                'id' => $doi,
                'frammento' => $fragment_doi,
                'start' => $startDoi,
                'end' => $endDoi,
            ),
            'uri' => array(
                'url' => $uri,
                'frammento' => '',
                'start' => '',
                'end' => '',
                'html' => $prefix . $html, //
                'fabioWork' => $prefix . $fabioWork,
                'fabioExpression' => $prefix . $fabioExpression,
                'prefix' => $prefix,
                'path' => $path
            )
        );

        $GLOBALS['annDoc'] = true;
        libxml_use_internal_errors(false);
        return json_encode($scraping);
    } else {
        // titolo
        $titolo = $xpath->query('//title/text()')->item(0)->nodeValue;
        //$pathTitolo = $xpath->query('//title/text()')->item(0)->getNodePath();
        $pathTitolo = '';
        $startTitolo = '';
        $endTitolo = '';
        $fragment_titolo = costruisciPathUrl($pathTitolo);

        $sub = substr($uri, 11, 4);
        EasyRdf_Namespace::set($sub,$uri);
        $prefix = $sub.":";
        $path = $uri;
        $scraping = array(
            'titolo' => array(
                'title' => $titolo,
                'frammento' => $fragment_titolo,
                'start' => $startTitolo,
                'end' => $endTitolo,
            ),
            'uri' => array(
                'url' => $uri,
                'frammento' => '',
                'start' => '',
                'end' => '',
                'html' => $prefix."html",
                'fabioWork' => $prefix.str_replace(":", "", $prefix), // ipotizziamo che il work di un documento generico sia uguale al prefisso
                'fabioExpression' => $prefix."_ver1",
                'prefix' => $prefix,
                'path' => $path
            )
        );
        $GLOBALS['annDoc'] = false;
        libxml_use_internal_errors(false);
        return json_encode($scraping);
    }
}
// questa funzione serve per fare annotazioni riguardo le entità FRBR, a settare i namescpace e a istanziare le variabili globali
// che serviranno da collante tra le varie annotazioni di uno stesso documento.
function annotazioneDocumento($annotations){
    $prefix = "";
    $json =  json_decode($annotations, true);  // il true serve a convertire il json in objects array

    $graph = new EasyRdf_Graph();

    //salvataggio Item, Work e Expression (FRBR)
    $expr =  $json['uri']['fabioExpression'];
    //$item = $json['uri']['html'];
    $item = $json['uri']['url'];
    $work = $json['uri']['fabioWork'];

    $GLOBALS['fabioItem'] = $graph->resource($item, 'fabio:Item');
    $GLOBALS['fabioExpression'] = $graph->resource($expr, 'fabio:Expression');
    $GLOBALS['fabioExpression']->add('fabio:hasRepresentation', $item);


    //work
    $GLOBALS['fabioWork'] = $graph->resource($work, 'fabio:Work');
    $GLOBALS['fabioWork']->add('fabio:hasPortrayal', $GLOBALS['fabioItem']); // $item
    $GLOBALS['fabioWork']->add('frbr:realization', $GLOBALS['fabioExpression']); // $expr

    //echo $graph->dump();

    /*
     * Caricamento delle triple all'interno di un file.ttl caricato in precedenza mediante il comando:
     * fuseki-server --file=C:/Users/User/Desktop/ttl/RDF_Heisenberg.ttl /ds
     */



// Le seguenti due righe sono interscambiabili. La prima commentata è quella che deve funzionare perchè
// fa riferimento ad un grafo in particolare. La seconda invece non ha riferimenti a grafi generici.
    $result = $GLOBALS['sparql']->insert($graph, 'http://vitali.web.cs.unibo.it/raschietto/graph/ltw1545');

}


// questa funzione costruisce il frammento che identifica un annotazione
function costruisciPathUrl($frammento) {
    if($frammento == ''){
        return $frammento;
    }else {
        $string = str_replace('/', '_', $frammento);
        $string2 =  str_replace( array('[',']'),'',$string );
        $array = split('_', $string2);
        //array_splice($array, 0, 3); // mi cancella dall'array la parte dell frammento che non mi serve dalla 0 alla terza posizione
        $union = implode("_", $array); // unisce gli elementi dell'array
        $union = substr($union,1); // elimino il primo '_'
        return $union;
    }
}

//*************************************************************************************************************************
// metodo principale dello script. Serve a creare annotazioni. Dopo aver fatto lo scrape dell informazioni di una pagina chiama
// due metodi. Il primo crea le annotazioni riguardo le Entità FRBR, il secondo tutte le restanti annotazioni riguardo titolo, autore, doi anno e URl.
function loadAnnotation($uri) {
    $annotazioni = array();
    $scrape = scrape($uri);
    if ($GLOBALS['annDoc']) {
        $annotazioni = array('autore', 'titolo', 'annoPubblicazione', 'DOI', 'URL');
    } else {

        $annotazioni = array('titolo', 'URL');
    }
    // inserisco le annotazioni generiche sul documento.
    annotazioneDocumento($scrape);
    //inserisco il resto delle annotazioni in base all'array
    foreach ($annotazioni as $item) {
        createJson($item, $scrape);
    }
}
//*************************************************************************************************************************


/*
 * Fulname 2 parti = n-cognome
 * Se il fullname (nome + cognome) è composto da 3 parti si considera la prima come nome e le altre due come cognome
 * Se il fullname (nome + cognome) è composto da più di 3 parti si considera la prima come nome e le ultime due come cognome, ignorando le parti centrali
 */
function identificaAutore($author){
    $autore = strtolower($author); // lowercase


    // questo if mi verifica che il nome non contiene umlat. Presa da stackoverflow
    if (preg_match('/&[a-zA-Z]uml;/', htmlentities($autore, ENT_COMPAT, 'UTF-8')))
    {
        $autore = strtr(utf8_decode($autore),
            utf8_decode('ŠŒŽšœžŸ¥µÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýÿ'),
            'SOZsozYYuAAAAAAACEEEEIIIIDNOOOOOOUUUUYsaaaaaaaceeeeiiiionoooooouuuuyy');
    }

    // se contiene il punto
    if (strpos($autore,".") == true ){
        $autore = str_replace(".","",$autore);
    }
    // se contien gli apostrofi
    if (strpos($autore, "'") == TRUE){ // se contiene l'apostrofo
        $autore = str_replace("'", "", $autore);
    }
    $array = split(' ', $autore);
    //print_r($array);
    if(count($array)==2){
        $nome = substr($array[0], 0, 1);
        $cognome = $array[1];
        return $nome.'-'.$cognome;
    }elseif (count($array)== 3) {
        $nome = substr($array[0], 0, 1);
        $cognome = $array[1].$array[2];
        return $nome.'-'.$cognome;
    }elseif(count($array)>3) {
        $nome = substr($array[0], 0, 1);
        $cognome = array_slice($array, -2, 2, true); // prendo le utlime due parti dell'array
        return $nome.'-'.implode($cognome); // unisco gli elementi dell'array
    }

}

function createJson($type, $json) {

    // il secondo parametro sta ad indicare un array associativo anzichè un istanza di un oggetto
    $scrape =  json_decode($json, true);
    $target = "";
    $subject =  $scrape['uri']['fabioExpression'];
    $source = $scrape['uri']['html']; // source indica il file.html
    $date = date('Y-m-d H:i:s');
    switch ($type) {
        case "autore":
            $type = "hasAuthor";
            $label = "Autore";
            $predicate = 'dcterms:creator';
            $frammento = $scrape['autore']['frammento'];
            $startEnd = $scrape['autore']['startEnd'];
            $object = $scrape['autore']['author'];
            $target = array(
                "source" => $source,
                "id" => $frammento,
                "startEnd" => $startEnd,
            );

            break;
        case "titolo":
            $type = "hasTitle";
            $label = "Titolo";
            $predicate = 'dcterms:title';
            $frammento = $scrape['titolo']['frammento'];
            $start = $scrape['titolo']['start'];
            $end = $scrape['titolo']['end'];
            $object = $scrape['titolo']['title'];
            $target = array(
                "source" => $source,
                "id" => $frammento,
                "start" => $start,
                "end" => $end,
            );
            break;
        case "annoPubblicazione":
            $type = "hasPublicationYear";
            $label = "AnnoPubblicazione";
            $predicate = 'fabio:hasPubblicationYear';
            $frammento = $scrape['annoDiPubblicazione']['frammento'];
            $start = $scrape['annoDiPubblicazione']['start'];
            $end = $scrape['annoDiPubblicazione']['end'];
            $object = $scrape['annoDiPubblicazione']['pubblicato'];
            $target = array(
                "source" => $source,
                "id" => $frammento,
                "start" => $start,
                "end" => $end,
            );
            break;
        case "DOI":
            $type = "hasDOI";
            $label = "DOI";
            $predicate = 'prism:doi';
            $frammento = $scrape['doi']['frammento'];
            $start = $scrape['doi']['start'];
            $end = $scrape['doi']['end'];
            $object = $scrape['doi']['id'];
            $target = array(
                "source" => $source,
                "id" => $frammento,
                "start" => $start,
                "end" => $end,
            );
            break;
        case "URL":
            $type = "hasURL";
            $label = "URL";
            $predicate = 'fabio:hasURL';
            $frammento = $scrape['uri']['frammento'];
            $start = $scrape['uri']['start'];
            $end = $scrape['uri']['end'];
            $object = $scrape['uri']['url'];
            $target = array(
                "source" => $source,
                "id" => $frammento,
                "start" => $start,
                "end" => $end,
            );
            break;
    }


    // costruiamo l'array che contiente tutte le triple in formato json
    $annotazioni = array(
        "Annotazioni" => array(
            "type" => $type,
            "label" => $label,
            "body" => array(
                "subject" => $subject,
                "predicate" => $predicate,
                "object" => $object,
            ),
            'target' => $target,
            'provenance' => array(
                'author' => array(
                    'name' => "Heisenberg",
                    'email' => "raschietto@ltw1545.web.cs.unibo.it"
                ),
                'time' => $date
            )
        )
    );

    $finalJson = json_encode($annotazioni);

    InserisciAnnotazione($finalJson);

}

// questa funzione sostituisce idoppi apici con gli apici singoli e viene chiamate sul titolo e sull'autore dell'articolo.
// il tutto per evitare problemi con le annotazioni das inserire.
function deleteDoubleQuotes($string) {
    if (strpos($string, '"') !== false) {
        $string = str_replace('"', '\'', $string);
    }
    if (strpos($string, "’") == TRUE){ // se contiene l'apostrofo
        $string = str_replace("’","'",$string);
    }
    return $string;
}

function InserisciAnnotazione($annotations){

    $json =  json_decode($annotations, true);

    $graph = new EasyRdf_Graph();

    $type = $json['Annotazioni']['type'];
    $label = $json['Annotazioni']['label'];

    $predicate = $json['Annotazioni']['body']['predicate'];

    $nomiAnnotatori = $json['Annotazioni']['provenance']['author']['name'];
    $mailAnnotatori = $json['Annotazioni']['provenance']['author']['email'];

    $nameAnnotator = $graph->resource("<mailto:" .$mailAnnotatori. ">");
    $nameAnnotator->add('foaf:name', $nomiAnnotatori);
    $nameAnnotator->add('schema:email', $mailAnnotatori);

    $dateAnnotation = $json['Annotazioni']['provenance']['time'];

// switch per definire l'oggetto da inserire in base al titolo
    switch ($label) {
        case 'Autore':
            $i = 0;

            // cicla tutti gli autori
            foreach ($json['Annotazioni']['body']['object'] as $key=>$autori)
            {
                //echo $json['Annotazioni']['target']['id'][$key] . "<br>";
                $selettore = $graph->newBNode('oa:FragmentSelector');
                $selettore->add('rdf:value', $json['Annotazioni']['target']['id'][$key]);
                $selettore->add('oa:end', $json['Annotazioni']['target']['startEnd'][$key]['end']);
                $selettore->add('oa:start', $json['Annotazioni']['target']['startEnd'][$key]['start']);

                $resource = $graph->newBNode('oa:SpecificResource');
                $resource->add('oa:hasSource', $GLOBALS['fabioItem']);
                $resource->add('oa:hasSelector', $selettore);
                $autori = deleteDoubleQuotes($autori);
                $rschAutore = identificaAutore($autori);
                $value = $graph->resource('rsch:' . $rschAutore, 'foaf:Person');
                $value->add('rdfs:label', $autori);
                // body
                $body = $graph->newBNode('rdf:Statement');
                $body->add("rdf:subject", $GLOBALS['fabioExpression']);
                $body->add("rdf:predicate", $predicate);
                $body->add("rdf:object", $value);
                $body->add('rdfs:label', $autori);
                // nodo principale
                $annotazione = $graph->newBNode('oa:Annotation');
                $annotazione->add("rdfs:label", $label);
                $annotazione->add("rscht:type", $type);
                $annotazione->add("oa:hasTarget", $resource);
                $annotazione->add("oa:hasBody", $body);
                $annotazione->add('oa:annotatedBy', $nameAnnotator);
                $annotazione->add('oa:annotatedAt', $dateAnnotation);
            }
            break;
        case 'Titolo':
            $fragment = $json['Annotazioni']['target']['id'];
            $start = $json['Annotazioni']['target']['start'];
            $end = $json['Annotazioni']['target']['end'];

            $title = $json['Annotazioni']['body']['object'];

            //echo $title;
            $title = deleteDoubleQuotes($title);
            $value = new EasyRdf_Literal($title, 'en', "xsd:string");

            $selettore = $graph->newBNode('oa:FragmentSelector'); // prendere questa in considerazione
            $selettore->add('rdf:value', $fragment);
            $selettore->add('oa:end', $end);
            $selettore->add('oa:start', $start);

            $resource = $graph->newBNode('oa:SpecificResource');
            $resource->add('oa:hasSource', $GLOBALS['fabioItem']);
            $resource->add('oa:hasSelector', $selettore);

            $body = $graph->newBNode('rdf:Statement');
            $body->add("rdf:subject", $GLOBALS['fabioExpression']);
            $body->add("rdf:predicate", $predicate);
            $body->add("rdf:object", $value);

            // nodo principale
            $annotazione = $graph->newBNode('oa:Annotation');
            $annotazione->add("rdfs:label", $label);
            $annotazione->add("rscht:type", $type);
            $annotazione->add("oa:hasTarget", $resource);
            $annotazione->add("oa:hasBody", $body);
            $annotazione->add('oa:annotatedBy', $nameAnnotator);
            $annotazione->add('oa:annotatedAt', $dateAnnotation);
            break;
        case 'AnnoPubblicazione':

            $fragment = $json['Annotazioni']['target']['id'];
            $start = $json['Annotazioni']['target']['start'];
            $end = $json['Annotazioni']['target']['end'];

            $selettore = $graph->newBNode('oa:FragmentSelector');
            $selettore->set('rdf:value', $fragment);
            $selettore->add('oa:end', $end);
            $selettore->add('oa:start', $start);

            $resource = $graph->newBNode('oa:SpecificResource');
            $resource->add('oa:hasSource', $GLOBALS['fabioItem']);
            $resource->add('oa:hasSelector', $selettore);

            $body = $graph->newBNode('rdf:Statement');
            $body->add("rdf:subject", $GLOBALS['fabioExpression']); // $expr
            $body->add("rdf:predicate", $predicate);
            // $value = new EasyRdf_Literal_Date($json['Annotazioni']['body']['object']);
            $value = new EasyRdf_Literal($json['Annotazioni']['body']['object'], 'en', "xsd:gYear");
            $body->add("rdf:object", $value);


            // nodo principale
            $annotazione = $graph->newBNode('oa:Annotation');
            $annotazione->add("rdfs:label", $label);
            $annotazione->add("rscht:type", $type);
            $annotazione->add("oa:hasTarget", $resource);
            $annotazione->add("oa:hasBody", $body);
            $annotazione->add('oa:annotatedBy', $nameAnnotator);
            $annotazione->add('oa:annotatedAt', $dateAnnotation);
            break;
        case 'DOI':
            $fragment = $json['Annotazioni']['target']['id'];
            $start = $json['Annotazioni']['target']['start'];
            $end = $json['Annotazioni']['target']['end'];

            $selettore = $graph->newBNode('oa:FragmentSelector');
            $selettore->set('rdf:value', $fragment);
            $selettore->add('oa:end', $end);
            $selettore->add('oa:start', $start);

            $resource = $graph->newBNode('oa:SpecificResource');
            $resource->add('oa:hasSource', $GLOBALS['fabioItem']);
            $resource->add('oa:hasSelector', $selettore);

            $body = $graph->newBNode('rdf:Statement');
            $body->add("rdf:subject", $GLOBALS['fabioExpression']);
            $body->add("rdf:predicate", $predicate);
            $value = new EasyRdf_Literal($json['Annotazioni']['body']['object'], 'en', "xsd:string");
            $body->add("rdf:object", $value);

            // nodo principale
            $annotazione = $graph->newBNode('oa:Annotation');
            $annotazione->add("rdfs:label", $label);
            $annotazione->add("rscht:type", $type);
            $annotazione->add("oa:hasTarget", $resource);
            $annotazione->add("oa:hasBody", $body);
            $annotazione->add('oa:annotatedBy', $nameAnnotator);
            $annotazione->add('oa:annotatedAt', $dateAnnotation);
            break;
        case 'URL':
            $fragment = $json['Annotazioni']['target']['id'];
            $start = $json['Annotazioni']['target']['start'];
            $end = $json['Annotazioni']['target']['end'];

            $selettore = $graph->newBNode('oa:FragmentSelector');
            $selettore->set('rdf:value', $fragment);
            $selettore->add('oa:end', $end);
            $selettore->add('oa:start', $start);

            $resource = $graph->newBNode('oa:SpecificResource');
            $resource->add('oa:hasSource', $GLOBALS['fabioItem']);
            $resource->add('oa:hasSelector', $selettore);

            $body = $graph->newBNode('rdf:Statement');
            $body->add("rdf:subject", $GLOBALS['fabioExpression']);
            $body->add("rdf:predicate", $predicate);
            $value = new EasyRdf_Literal($json['Annotazioni']['body']['object'], 'en', "xsd:anyURL");

            $body->add("rdf:object", $value);

            $annotazione = $graph->newBNode('oa:Annotation');
            $annotazione->add("rdfs:label", $label);
            $annotazione->add("rscht:type", $type);
            $annotazione->add("oa:hasTarget", $resource);
            $annotazione->add("oa:hasBody", $body);
            $annotazione->add('oa:annotatedBy', $nameAnnotator);
            $annotazione->add('oa:annotatedAt', $dateAnnotation);
            break;
    }

    //echo $graph->dump();
    $result = $GLOBALS['sparql']->insert($graph, 'http://vitali.web.cs.unibo.it/raschietto/graph/ltw1545');


}

// ***********************************************************************************************************
// questo metodo provvederà ad eliminare tutte le annotazioni presenti sul documento servendosi dello scrape
// per reperire gli elementi da eliminare.
function delete($uri) {
    $label = array();
    $scrape = scrape($uri);
    if ($GLOBALS['annDoc']) {
        $label = array('autore', 'titolo', 'annoPubblicazione', 'DOI', 'URL');
    } else {
        $label = array('titolo', 'URL');
    }

    removeAnnotationOnDocument($scrape);

    $label = array('Autore', 'Titolo', 'AnnoPubblicazione', 'DOI', 'URL');
    foreach ($label as $item) {
        deleteAnnotations($item, $scrape);
    }
}

function removeAnnotationOnDocument($json) {
    $frbr = json_decode($json, true);
    $prefix = $frbr['uri']['prefix'];
    $path = $frbr['uri']['path'];
    $prefixRDF = str_replace(":", "", $prefix);
    EasyRdf_Namespace::set($prefixRDF, $path);

    $item = $frbr['uri']['html'];
    $expression = $frbr['uri']['fabioExpression'];
    $work = $frbr['uri']['fabioWork'];

    // elimino l'expression
    $result_expression = $GLOBALS['sparql']->update(
        "DELETE
                     WHERE  {
                     GRAPH <http://vitali.web.cs.unibo.it/raschietto/graph/ltw1545> {
    			$expression a fabio:Expression;
      			fabio:hasRepresentation ?i.
                            }
                        }");
    // elimino il work del documento
    $result_work = $GLOBALS['sparql']->update(
        "DELETE
                     WHERE  {
                     GRAPH <http://vitali.web.cs.unibo.it/raschietto/graph/ltw1545> {
                                $work a fabio:Work;
                                fabio:hasPortrayal ?i;
                                frbr:realization ?e.
                            }
                        }");

    // elimino l'item
    $result_item = $GLOBALS['sparql']->update(
        "DELETE
        WHERE  {
        GRAPH <http://vitali.web.cs.unibo.it/raschietto/graph/ltw1545> {

                            $item a fabio:Item.
            }
         }");
    //}
    // delete provenance
    /* $result_provenance= $GLOBALS['sparql']->update(
      "DELETE
      WHERE  {
      GRAPH <http://vitali.web.cs.unibo.it/raschietto/graph/ltw1545> {
      ?email schema:email 'raschietto@ltw1545.web.cs.unibo.it';
      foaf:name 'Heisenberg'.
      }
      }"); */
}

function deleteAnnotations($label, $scrape){
    $json = json_decode($scrape, true);
    $prefix =  $json['uri']['prefix'];
    $path =  $json['uri']['path'];
    $prefixRDF = str_replace(":", "", $prefix);
    EasyRdf_Namespace::set($prefixRDF,$path);
    $expression = $json['uri']['fabioExpression'];
    echo $prefix;
    echo $path;
    echo $expression;
    
    if($label == 'URL'){

        $url = $json['uri']['url'];
        $result = $GLOBALS['sparql']->update(
            "DELETE
                     WHERE  {
                     GRAPH <http://vitali.web.cs.unibo.it/raschietto/graph/ltw1545> {
    			?b a rdf:Statement;
                        rdf:subject  $expression;
                        rdf:predicate ?p;
                        rdf:object ?obj.

    			?f a oa:FragmentSelector;
      			rdf:value ?fr;
                        oa:end ?end;
                        oa:start ?start.

    			?t a oa:SpecificResource;
      			oa:hasSelector ?f;
    			oa:hasSource ?i.

                        ?x a oa:Annotation;
                        rdfs:label 'URL';
                        rscht:type ?type;
      			oa:annotatedBy <mailto:raschietto@ltw1545.web.cs.unibo.it>;
      			oa:annotatedAt ?o;
                        oa:hasBody ?b;
      			oa:hasTarget ?t.
                            }
                        }");
    }else if($label == "Titolo"){

        $title = $json['titolo']['title'];
        $result = $GLOBALS['sparql']->update(
            "DELETE
                     WHERE  {
                     GRAPH <http://vitali.web.cs.unibo.it/raschietto/graph/ltw1545> {
    			?b a rdf:Statement;
                        rdf:subject   $expression;
                        rdf:predicate ?p;
                        rdf:object ?obj.

    			?f a oa:FragmentSelector;
      			rdf:value ?fr;
                        oa:end ?end;
                        oa:start ?start.

    			?t a oa:SpecificResource;
      			oa:hasSelector ?f;
    			oa:hasSource ?i.

                        ?x a oa:Annotation;
                        rdfs:label 'Titolo';
                        rscht:type ?type;
      			oa:annotatedBy <mailto:raschietto@ltw1545.web.cs.unibo.it>;
      			oa:annotatedAt ?o;
                        oa:hasBody ?b;
      			oa:hasTarget ?t.
                            }
                        }");
    }else if($label == "DOI"){

        $doi = $json['doi']['id'];

        $result = $GLOBALS['sparql']->update(
            "DELETE
                     WHERE  {
                     GRAPH <http://vitali.web.cs.unibo.it/raschietto/graph/ltw1545> {
    			?b a rdf:Statement;
                        rdf:subject   $expression;
                        rdf:predicate ?p;
                        rdf:object ?obj.

    			?f a oa:FragmentSelector;
      			rdf:value ?fr;
                        oa:end ?end;
                        oa:start ?start.

    			?t a oa:SpecificResource;
      			oa:hasSelector ?f;
    			oa:hasSource ?i.

                        ?x a oa:Annotation;
                        rdfs:label 'DOI';
                        rscht:type ?type;
      			oa:annotatedBy <mailto:raschietto@ltw1545.web.cs.unibo.it>;
      			oa:annotatedAt ?o;
      		        oa:hasBody ?b;
      			oa:hasTarget ?t.
                            }
                        }");
    }else if($label == "AnnoPubblicazione"){

        $anno = $json['annoDiPubblicazione']['pubblicato'];
        $result = $GLOBALS['sparql']->update(
            "DELETE
                     WHERE  {
                     GRAPH <http://vitali.web.cs.unibo.it/raschietto/graph/ltw1545> {
    			?b a rdf:Statement;
                        rdf:subject   $expression;
                        rdf:predicate ?p;
                        rdf:object ?obj.

    			?f a oa:FragmentSelector;
      			rdf:value ?fr;
                        oa:end ?end;
                        oa:start ?start.

    			?t a oa:SpecificResource;
      			oa:hasSelector ?f;
    			oa:hasSource ?i.

                        ?x a oa:Annotation;
                        rdfs:label 'AnnoPubblicazione';
                        rscht:type ?type;
      			oa:annotatedBy <mailto:raschietto@ltw1545.web.cs.unibo.it>;
      			oa:annotatedAt ?o;
                        oa:hasBody ?b;
      			oa:hasTarget ?t.
                            }
                        }");

    } else if($label == 'Autore'){
        $result = $GLOBALS['sparql']->update(
            "DELETE
                     WHERE  {
                     GRAPH <http://vitali.web.cs.unibo.it/raschietto/graph/ltw1545> {
    			?b a rdf:Statement;
                        rdf:subject $expression;
                        rdf:predicate ?p;
                        rdfs:label ?l;
                        rdf:object ?label.

    			?f a oa:FragmentSelector;
      			rdf:value ?fr;
                        oa:end ?end;
                        oa:start ?start.

    			?t a oa:SpecificResource;
      			oa:hasSelector ?f;
    			oa:hasSource ?i.

                        ?x a oa:Annotation;
                        rdfs:label 'Autore';
                        rscht:type ?type;
      			oa:annotatedBy <mailto:raschietto@ltw1545.web.cs.unibo.it>;
      			oa:annotatedAt ?o;
                        oa:hasBody ?b;
      			oa:hasTarget ?t.
                            }
                        }");

        // eliminiamo tutte le risorse di tipo foaf:Person
        foreach($json['autore']['author'] as $author){
            
            $autori = deleteDoubleQuotes($author);
            $rschAutore = identificaAutore($autori);
            $result = $GLOBALS['sparql']->update(
                "DELETE
                     WHERE  {
                     GRAPH <http://vitali.web.cs.unibo.it/raschietto/graph/ltw1545> {
                            rsch:$rschAutore a foaf:Person;
      				rdfs:label ?n.
                            }
                        }");
        }
    }
}


// questa funzione serve a mandare le annotazioni fatte dall'utente allo sparql end point
// legge un json creato in jquery e poi le invia. E' stata fatta in php per ovviare a un warning che si verificava 
// inviandole da jquery
function sendJson($json){
    $jsonDaMandare = $GLOBALS['sparql']->update($json);
}
