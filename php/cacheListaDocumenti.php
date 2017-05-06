<?php

/*
 * questo script verifica se nel file json chiamato listaCache e' contenuto uno specifico url e il
 * titolo associato ad esso. Nel caso in cui non esista, alroa fa lo scrape della pagina e poi lo inserisce.
 * Quindi il file listaCache.json e' una cache.
 */

if(isset($_POST['listaDoc'])){
   print cache($_POST['listaDoc']);
}


function cache($risultato){
  
   $lista = json_decode($risultato, true);
   $listaCorretta = array();
   $temp = array();
   $listaTitoliDaRimandare = array(); 
   // pulisco tutti gli URL che contengono i ver_1 
   //var_dump($lista);
   foreach($lista as  $key=>$url){
       $var = $lista[$key]['doc']['value'] ;
       if(strpos($var, '_ver1') !== false){
           $var = str_replace('_ver1', '', $var);
       }
       array_push($listaCorretta, $var);
    
   }
   //var_dump($listaCorretta);
   // acquisisco le info presenti nel file json
   $json = file_get_contents("./../json/listaCache.json");
   $jsonList = json_decode($json, true);
   
   
   // essendo un json prendo gli URL contenuti nela cache 
   //$urlColumn = array_column($jsonList, 'url'); 
   
   $urlColumn = array_map(function($element){return $element['url'];}, $jsonList);
   // la logica e', se non c'è l'URL significa che non c'è non ce nemmeno il titolo, quindi vado a fare lo scrape 
   // e lo inserisco nel json per le nuove prossime chiamate
   foreach($listaCorretta as $key=>$value){
       
        // se l'url iterato, contenuto in listaCorretta (quella pulita), e' contenuto nella cache allora lo provo a inserire e rimandare
       if(in_array($listaCorretta[$key], $urlColumn)) {
           // se il titolo dell'URL in questione non e' vuoto lo inserisco nella lista da reiviare al client
           if($jsonList[$key]['titolo'] != ' '){
             
               $daInviare = array('url'=> $jsonList[$key]['url'], 'titolo'=> $jsonList[$key]['titolo']);
               array_push($listaTitoliDaRimandare, $daInviare); // aggiungo all'array dei titoli, quello corrispettivo dell'url iterato          
           }
       }         
       else { // altrimenti faccio scrape del titolo e lo aggiungo alla cache (al file json)
           
             $doc = new DOMDocument();
            libxml_use_internal_errors(true);
           
            /* se il server contattato non e' attivo allora viene messo un titolo vuoto sopprimendo l'errore:
             * Warning: DOMDocument::loadHTMLFile(http://www.dlib.org/dlib/march15/hienert/03hienert.html_cited_%20arXiv%20repository): failed to open stream: HTTP request failed! HTTP/1.1 404 Not Found in C:\xamp_workbench\xampp\htdocs\heisenberg\php\cacheListaDocumenti.php on line 56
               array(2) { ["url"]=> string(79) "http://www.dlib.org/dlib/march15/hienert/03hienert.html_cited_ arXiv repository" ["titolo"]=> string(1) " " } 
             * OVVIAMENTE viene comunque inserito l'URL e relativo titolo vuoto altrimenti si ripresenterebbe sempre 
             */
            if(!@$doc->loadHTMLFile($listaCorretta[$key])) { 
                $titolo = ' ';
            }else {
                $xpath = new DOMXPath($doc);
                $titolo = $xpath->query('//title/text()')->item(0)->nodeValue;
                //echo $titolo . "<br>";
            }
            
            $nuovo = array('url'=> $listaCorretta[$key], 'titolo'=> $titolo); // aggiungo al file json l'url corrispondente e il titolo 
            
            
           // lo aggiungo alla cache 
            array_push($jsonList, $nuovo);
            
           
            file_put_contents('./../json/listaCache.json',json_encode($jsonList));
           // unset($jsonList);//release memory*/
            $daInviare = array('url'=> $listaCorretta[$key], 'titolo'=> $titolo);
             array_push($listaTitoliDaRimandare, $daInviare); // aggiungo all'array dei titoli, quello corrispettivo dell'url iterato          
       }
   }
  // var_dump($listaTitoliDaRimandare);
  return json_encode($listaTitoliDaRimandare);
}
?>
