<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>Operator</title>
    <meta http-equiv="pragma" content="no-cache" >
    <meta http-equiv="expires" content="0" >
    <script src="Scripts/jquery-1.6.4.min.js"></script>
    <script src="Scripts/jquery.signalR-1.1.0.min.js"></script>
    <script src="http://localhost:36687/signalr/hubs" type="text/javascript"></script>
    <script src="Scripts/operatorchat.js"></script>
    <link href="css/operatorchat.css" rel="stylesheet" type="text/css" />  
    
</head>
<body>
     <div class="chatbox">
        <div id="top">ChatBox</div>
        <div id="ct">
        	<a href="#" id="ctmail" style="float:left; text-decoration:none; color:#9C0;">&nbsp;Mail Chat</a>
    		<a href="#" id="ctsave" style="float:right; text-decoration:none; color:#9C0;">Save Chat&nbsp;</a>
        </div>
        <div id="top1">User email:- not given</div>
        <div id="toggle">
            <div id="content">
                <ul id="contentin"></ul>
            </div>
            <div id="sender">
                <textarea rows="3" cols="50" id="data" ></textarea>
                <button id="send">Send</button>
            </div>
        </div>
        
    </div>
    
    
</body>
</html>