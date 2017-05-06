<?php

header('Access-Control-Allow-Origin: *'); 
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');

    if(isset($_POST['uri'])) {
        $url = filter_input(INPUT_POST, 'uri', FILTER_SANITIZE_URL);
        // Controllo la presenza dell'header qui di seguito, se presente non e' possibile visualizzare la pagina in questione
        $header = get_headers($url, 1);
        if(isset($header["X-Frame-Options"])) {
            echo 'Attenzione! La pagina inserita non consente la visualizzazione in frame di pagine esterne, come questo. '.
                 'Al momento, non è supportato nessun metodo per aggirare questo blocco. Ci scusiamo per l\'inconveniente. '.
                 'Vi preghiamo di inserire un nuovo indirizzo.';
        } else {
            // Se e' possibile visualizzare la pagina ritorno il titolo e l'url della stessa tramite jason data
            $doc = new DOMDocument();
            libxml_use_internal_errors(true);
            $doc->loadHTMLFile($url);

            $xpath = new DOMXPath($doc);
            $titles = $xpath->query('//title/text()');

            foreach ($titles as $t) {
                $title = $t->nodeValue;
            }
            $data = array('title'=>$title, 'url'=>$url);
            libxml_use_internal_errors(false);
            echo json_encode($data);
        }
    }