<?php

header('Access-Control-Allow-Origin: *'); 
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');

    // Definizione della funzione CURL
    function curl($url) {
        $options = Array(
            CURLOPT_RETURNTRANSFER => TRUE,  // Opzione per ritornare la pagina voluta
            CURLOPT_FOLLOWLOCATION => TRUE,  // Opzione per seguire la locazione degli HTTP headers
            CURLOPT_AUTOREFERER => TRUE, // Setta automaticamente il riferimento dove seguire gli HTTP headers
            CURLOPT_CONNECTTIMEOUT => 120,   // Ammontare dei secondi prima che la richiesta termini
            CURLOPT_TIMEOUT => 120,  // Ammontare dei secondi per eseguire le query
            CURLOPT_MAXREDIRS => 10, // Numero massimo di ridirezioni da seguire
            CURLOPT_USERAGENT => "Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.9.1a2pre) Gecko/2008073000 Shredder/3.0a2pre ThunderBrowse/3.2.1.8",
            CURLOPT_URL => $url, // $url variabile passata alla funzione
        );

        $ch = curl_init();
        curl_setopt_array($ch, $options);   // Setta le opzioni di CURL in base a quanto scritto sopra
        ini_set('max_execution_time', 300);
        $data = curl_exec($ch); // Esegue la richiesta CURL
        $data = preg_replace("/<head.*>/i", "<head><base href='$url' />", $data, 1); // URL di riferimento per risorse e riferimenti esterni
        curl_close($ch);
        return $data;
    }

    // Funzione per estrarre soo pezzi di pagine
    function scrape_between($data, $start, $end) {
        $data = stristr($data, $start); // Eliminazione della parte prima dell'inizio
        $data = substr($data, strlen($start));  // Prepare la parte iniziale
        $stop = stripos($data, $end);   // Estrazione della posizione di fine scraping
        $data = substr($data, 0, $stop);    // Cancellazione dei dati da dalla fine (inclusa) della selezione
        return $data;
    }

    // Sostituzione automatica di ogni src delle immagini da path relativo a path assoluto
    function replace_img_src($page, $url) {
        $doc = new DOMDocument();
        libxml_use_internal_errors(true);
        $doc->loadHTML($page);
        $tags = $doc->getElementsByTagName('img');
        foreach ($tags as $tag) {
            $old_src = $tag->getAttribute('src');
            $new_src_url = $url.'/../'.$old_src;
            $tag->setAttribute('src', $new_src_url);
        }
        libxml_use_internal_errors(false);
        return $doc->saveHTML();
    }
    
    // Rimuove tutto il testo nascosto che non si vede nelle pagine
    function strip_html_tags($str) {
        $str = preg_replace('/(<|>)\1{2}/is', '', $str);
        $str2 = $str;
        $str = preg_replace(
            array( // Rimozione contenuto invisibile
                '@<head[^>]*?>.*?</head>@siu',
                '@<style[^>]*?>.*?</style>@siu',
                '@<script[^>]*?.*?</script>@siu',
                '@<noscript[^>]*?.*?</noscript>@siu',
                ),
            "", // Replace con nulla
            $str );
        $str = replaceWhitespace($str);
        //$str = strip_tags($str, '<em></em><em /><b></b><b /><br><br /><br/><button></button><meta></meta><meta /><nav></nav><ul></ul><li></li><ol></ol><span></span><span /><p></p><p /><figure></figure><figure /><h1></h1><h1 /><h2></h2><h2 /><h3></h3><h3 /><h4</h4><h4 /><h5></h5><h5 /><h6></h6><h6 /><section></section><section />');
        if ($str != NULL) {
            echo $str;
        }
        else {
            echo '<script language="javascript">';
            echo 'avviso("Attenzione! La pagina inserita non supporta la formattazione forzata in uso. Verrà mostrata una versione parzialmente formattata della pagina richiesta, ma non ne è garantita la compatibilità.");';
            echo '</script>';
            $str2 = replaceWhitespace($str2);
            $str2 = strip_tags($str2, '<em></em><em /><div></div><div /><b></b><b /><br><br /><br/><img><button></button><a></a><meta></meta><meta /><nav></nav><ul></ul><li></li><ol></ol><span></span><span /><p></p><p /><figure></figure><figure /><h1></h1><h1 /><h2></h2><h2 /><h3></h3><h3 /><h4</h4><h4 /><h5></h5><h5 /><h6></h6><h6 /><section></section><section />');
            echo $str2;
        }
    }

    // Sostituzione di tutti i tipi di whitespaces con un singolo spazio
    function replaceWhitespace($str) {
        $result = $str;
        foreach (array(
                     "  ", " \t",  " \r",  " \n",
                     "\t\t", "\t ", "\t\r", "\t\n",
                     "\r\r", "\r ", "\r\t", "\r\n",
                     "\n\n", "\n ", "\n\t", "\n\r",
                 ) as $replacement) {
            $result = str_replace($replacement, $replacement[0], $result);
        }
        return $str !== $result ? replaceWhitespace($result) : $result;
    }

    // Analisi dell'URL e in base a quello scaping delle pagine - tre tipi diversi di URL corrispondono a tre strutture diverse e a tre scarping diversi
    if(isset($_POST['uri'])) {
        $uri = filter_input(INPUT_POST, 'uri', FILTER_SANITIZE_URL);
        $type = filter_input(INPUT_POST, 'type', FILTER_DEFAULT);
        if ($type === 'dlib') {
            $page = curl($uri);
            $scrap = scrape_between($page, '<h3 class="blue-space">', '</html>');
            $final = replace_img_src($scrap, $uri);
            echo $final;
        } else if ($type === 'stat' || $type === 'jour') {
            $page = curl($uri);
            $scrap = scrape_between($page, '<div id="content">', '<!--');
            echo $scrap;
        } else {
            $fileHeaders = get_headers($uri);
            if($fileHeaders[0] == "HTTP/1.1 200 OK" || $fileHeaders[0] == "HTTP/1.0 200 OK") {
                $content = strip_html_tags(curl($uri));
            }
        }
    } else {
        echo "<script language='javascript'>avviso('Non e\' arrivato un URI valido allo script o c\'e\' stato qualche problema...');</script>";
    }