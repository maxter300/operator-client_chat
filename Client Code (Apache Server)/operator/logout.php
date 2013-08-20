<?php
session_start();

//redirect function
function returnheader($location){
	$returnheader = header("location: $location");
	return $returnheader;
}

$connection = mysql_connect("localhost","root","") OR die(mysql_error());
$db_select = mysql_select_db("chatdb",$connection) OR die(mysql_error());

// destroy cookies and sessions
setcookie("userloggedin", "");
$username = "";
session_destroy();

//redirect
returnheader("index.php");

?>