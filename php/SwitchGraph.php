<?php

header('Access-Control-Allow-Origin: *'); 
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');

error_reporting(0);
error_reporting(E_ERROR | E_WARNING | E_PARSE);
/*
 * Questo script serve per fare swich tra i grafi
 */
if($_GET["tec"]){
     $grafi  =  filter_input(INPUT_GET, 'tec', FILTER_SANITIZE_URL);
     print grafiDisponibili($grafi);
}
  
// scrape della pagina di tec web
function grafiDisponibili($grafi){
    error_reporting( E_NOTICE);
    $doc = new DOMDocument(); 
    libxml_use_internal_errors(true);
    $doc->loadHTMLFile($grafi); 
    $xpath = new DOMXpath($doc); 
    
    $rows = $xpath->query('//div[@class="twikiTopic"]/table//tr[position()>2]');
    
    $lista = array();
    
    foreach($rows as $r){
        $temp = array();
        $temp['id'] = $xpath->query('th[@class="twikiFirstCol"]/strong/font[@color="#FFFFCC"]', $r)->item(0)->nodeValue;
        $temp['nome'] = $xpath->query('th[@bgcolor="#000099"]/strong/font[@color="#FFFFCC"]', $r)->item(1)->nodeValue;
        
        $lista[] = $temp;
    }
    
    libxml_use_internal_errors(false);
    return json_encode($lista);
}

?>