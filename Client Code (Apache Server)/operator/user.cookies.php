<?php

//redirect function
function returnheader($location){
	$returnheader = header("location: $location");
	return $returnheader;
}

if(!strlen($_SESSION["SESS_USERNAME"]) > 0){

	//redirect
	returnheader("index.php");
}

?>