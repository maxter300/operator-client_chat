<?php
session_start();
require_once("user.cookies.php");
$uname = $_SESSION["SESS_USERFIRSTNAME"];
?>


<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>Operator - <?php echo $uname; ?></title>
    <meta http-equiv="pragma" content="no-cache" >
    <meta http-equiv="expires" content="0" >
    <script src="Scripts/jquery-1.6.4.min.js"></script>
    <script src="Scripts/jquery.signalR-1.1.0.min.js"></script>
    <script src="http://localhost:36687/signalr/hubs" type="text/javascript"></script>
    <script src="Scripts/operatorchat.js"></script>
    <link href="css/operatorchat.css" rel="stylesheet" type="text/css" />  
    
    <style type="text/css">
    	.box {
			border:medium gray dashed;
			background-color:#D5E0FF;
			margin:20px;
			width:80%;
		}
		.box p {
			background-color:#FFF;
			padding:10px;
			font-size:large;
			color:lightblue;
		}
    </style>
</head>

<body>
	<div class="thought"><h1>Operator Panel</h1></div>
    <div id="op_column">
	<div id="visitorbox" class="box">
    	<h3>Visitorbox</h3>
		<ul id="clist"></ul>
    </div>
    
    <div id="incoming" class="box">
    	<h3>Incoming from Customers</h3>
    	<ul id="waitinglist"></ul>
    </div>
    </div>
    
    <!--<div class="chatbox">
        <div id="top">ChatEngine</div>
        <div id="toggle">
        <div id="content">
            <ul id="contentin"></ul>
        </div>
        <div id="sender">
            <input type="text" id="data" /><button id="send">Send</button>
        </div>
        </div>
    </div>-->
</body>
</html>