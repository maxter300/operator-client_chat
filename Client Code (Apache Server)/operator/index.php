<?php
session_start();

//redirect function
function returnheader($location){
	$returnheader = header("location: $location");
	return $returnheader;
}


$connection = mysql_connect("localhost","root","") OR die(mysql_error());
$db_select = mysql_select_db("chatdb",$connection) OR die(mysql_error());

$errors = array();

if(isset($_POST["iebugaround"])){

//lets fetch posted details
$uname = trim(htmlentities($_POST['username']));
$passw = trim(htmlentities($_POST['password']));

//check username is present
if(empty($uname)){

	//let echo error message
	$errors[] = "Please input a username";
	
}

//check password was present
if(empty($passw)){

	//let echo error message
	$errors[] = "Please input a password";
	
}

if(!$errors){

	//encrypt the password
	$passw = sha1($passw);
	$salt = md5("u1s2e3r4");
	$pepper = "p1e2p3p4e5r6";
	
	$passencrypt = $salt . $passw . $pepper;
	
	//find out if user and password are present
	$query = "SELECT * FROM users WHERE username='".mysql_real_escape_string($uname)."' AND password='".mysql_real_escape_string($passencrypt)."'";
	$result = mysql_query($query) OR die(mysql_error());
	
	$result_num = mysql_num_rows($result);
	
	if($result_num > 0){
	
		while($row = mysql_fetch_array($result)){
		
			$idsess = stripslashes($row["id"]);
			$firstnamesess = stripslashes($row["firstname"]);
			$username = stripslashes($row["username"]);
			
			$_SESSION["SESS_USERID"] = $idsess;
			$_SESSION["SESS_USERFIRSTNAME"] = $firstnamesess;
			$_SESSION["SESS_USERNAME"] = $username;
			
			setcookie("userloggedin", $username);
			setcookie("userloggedin", $username, time()+43200); // expires in 1 hour
			
			//success lets login to page
			returnheader("operator.php");
		
		}
	
	} else {
	
		//tell there is no username etc
		$errors[] = "Your username or password are incorrect";
	
	}

}


} else {

$uname = "";

}

?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Operator Login</title>
<link href="css/login.css" rel="stylesheet" type="text/css" />
</head>

<body>
<div id="loginwrap">

	<h1>Operator Login Area</h1>
    
    <div id="loginform">
	
        <form action="#" method="post">
        	<input name="iebugaround" type="hidden" value="1"> 
            
            <label>Username</label>
            
            <fieldset class="fieldset2"><input type="text" name="username" class="requiredField" value="<?php echo $uname ; ?>"/></fieldset>
            
            <label>Password</label>
            
            <fieldset class="fieldset2"><input type="password" name="password" class="text requiredField subject"/></fieldset>

            <fieldset>
                <input name="submit" id="submit" value="Submit" class="button big round deep-red" type="submit"/>
            </fieldset>
        
        </form>
	
	</div>
    
    <div id="loginwarning">
	
		<?php
			if(count($errors) > 0){
				foreach($errors as $error){
					echo $error . "<br />";
				}
			}
		?>
	
	</div>

</div>
</body>
</html>