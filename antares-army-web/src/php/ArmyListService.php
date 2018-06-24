<?php 
header('Access-Control-Allow-Origin: http://localhost:8080');

$action = $_REQUEST['action'];
        
switch($action) {
    case "GetArmyList":
        try {
            $army = $_REQUEST["army"];
            $contents = file_get_contents('../armylists/' . $army . '.xml');
            
            header("Content-type: text/xml");
            echo $contents;
        } catch(Exception $e) {
            http_response_code(500);
            return;
        }
}

?>