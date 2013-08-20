
        
       
        $(document).ready(function () {

            generateChatbox();

            //to trigger click() event of send button on pressing Enter key
            $("#data").keyup(function (event) {
                if (event.keyCode == 13) {
                    $("#send").click();
                }
            });
            //end
            
            $("#msgform").hide("fast");
            $("#sender").hide("fast");
            $("#toggle").hide();
            $("#top").click(function (event) {
                $("#toggle").slideToggle("fast");
                if (op_online)
                    $('#msgform').hide("fast");
            });


            //for Hub API connection
            //if using client code on different server , change src in script tag to "http://urchat.somee.com/signalr/hubs" and uncomment code below
            $.connection.hub.url = 'http://localhost:36687/signalr';//uncommented//
            var clientip;
            var chat = $.connection.chatConn;
            chat.state.Typ = "client";
            var ln = window.location;
            chat.state.Loc = ln.toString();

            var d = new Date;
            var time = Math.round(d.getTime() / 1000);
            chat.state.time = time;

            chat.client.check = function (msg) {
               
                alert(msg);
            };

            chat.client.sendMessage = function (message) {

                $("#toggle").show("fast");
                var encodedMsg = $('<div />').text(message).html();
                $('#contentin').append('<li>' + encodedMsg + '</li>' + '<br />');
                $("#content").scrollTop($('#content').scrollTop() + $('#contentin').height());
            };

            
            chat.client.refreshlist = function () {
                chat.server.refreshlisting(clientip);
            };

            var op_online = false;
            chat.client.offmsg = function () {
                $("#msgform").hide("fast");
            }
            chat.client.op_online = function () {
                op_online = true;
                $("#top").empty();
                $("#top").append('Chat With Us <img src="grn.png" />');
                $("#msgform").hide("fast");
                $("#sender").show("fast");
                $("#content").scrollTop(0);
             
            };

            chat.client.op_offline = function () {
                op_online = false;
                $("#top").empty();
                $("#top").append('Contact Us  <img src="red.png" />');
                $("#sender").hide("fast");
                $("#msgform").show("fast");
                $("#content").scrollTop($("contentin").outerHeight());
             
            };
           
            chat.client.ipadd = function (ip) {
                clientip = ip;

            };

            chat.client.addtoken = function (token) {
                if (getCookie("chat_token") == null || getCookie("chat_token") == "")
                    setCookie("chat_token", token, 1);
            }

            chat.client.removetoken = function (token) {
                if (getCookie("chat_token") != null || getCookie("chat_token") != "")
                    setCookie("chat_token", token, -1);
            }

         


            $.connection.hub.start()
            .done(function () {
                var token = getCookie("chat_token");
                if (token != null && token != "") {
                    chat.server.sendnav(document.location.href, token);
                }
                chat.server.init();
                $("#send").click(function () {

                    if ($("#data").val() != "" && $("#data").val() != null && $("#data").val() != '\n') {
                        if (op_online) {
                            token = getCookie("chat_token");
							var uname = getCookie("chat_username");
							var uemail = getCookie("chat_useremail");
							if(uname == null || uname == "")
								uname="Guest";
							if(uemail == null || uemail == "")
								uemail="not given";
                            if (token != null && token != "")
                                chat.server.sendmsg(clientip, $('#data').val(), token, uname, uemail);
                            else
                                chat.server.chatinitiate(clientip, $('#data').val(), uname, uemail);
                        }
                        else {
                           
                            alert("Sorry ! None of the operators is available right now.");
                        }
                    }
                    $('#data').val('').focus();
                });

                $("#send2").click(function () {
                    var n=1;
                    var emailRegexStr = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
                    var nameRegexStr = /^[a-zA-Z ]+$/;
                    var phoneRegexStr = /^\+{0,1}\d+-{0,1}\d+$/;
                    var name = $("#name_input").val();
                    if (!nameRegexStr.test(name)) {
                        alert('please write your name !');
                        $("#name_input").focus();
                        n = 0;
                    }
                    if ($("#body_input").val() == "") {
                        alert('please write some message !');
                        $("#body_input").focus();
                        n = 0;
                    }
                    var email=$("#email_input").val();
                    if (!emailRegexStr.test(email))
                    {
                        alert('please write your email id !');
                        $("#email_input").focus();
                        n = 0;
                    }
                    var phone = $("#phone_input").val();
                    if (!phoneRegexStr.test(phone)) 
                    {
                        alert('please give valid phone number using one + and - sign only!');
                        $("#phone_input").focus();
                        n = 0;
                    }
                    if (n == 1)
                        chat.server.offlinemsgmail(name, email, phone, $("#body_input").val());
                    else
                        return false;
                });

            })
            .fail(function () { alert("Could not connect!"); });
            //end

            
        });

        



        function generateChatbox() {
            $('body').append(
				'<div class="chatbox"><div id="top">Chat with us! &nbsp;<img src="red.png" /></div>' +
        		'<div id="toggle"><div id="backgroundPopup"><button id="popupContactClose" class="close">Close</button><p id="sbmitmsg"></p><form id="contactform" action="" method="GET" onsubmit="return saveuserdata(this);">' +
				' <fieldset>'+
				'<label for="yourname">Your Name</label><input type="text" name="yourname" id="yourname" required value=""><br />'+
				'<label for="email">Email Address</label>'+
				'<input type="email" name="email" id="email" required><br />' +
				'<input type="submit" value="Send Details" id="sendbutton">' +
				'</fieldset>'+
				'</form>' +
				'</div>' +
        		'<div id="content">' +
                '<div id="msgform"><form action="" method="GET" onsubmit="return mailusermsg(this);">' +
				'<input id="name_input" type="text" name="name_input" placeholder=" Type your Name here"></textarea>' +
				'<input id="email_input" type="email" name="email_input" placeholder=" Type your Email here"></textarea>' +
				'<input id="phone_input" type="text" name="phone_input" placeholder="Phone:(digits & only one + or - sign)"></textarea>' +
				'<textarea id="body_input" name="body_input" placeholder=" Leave us a note:"></textarea><br />'+
				'<input  name="submit_input" id="send2" type="submit" value="Send Message">' +
        		'</div>'+
				'</form>'+
                '<ul id="contentin"></ul></div>' +
        		'<div id="sender">' +
            	'<textarea rows="3" cols="50" id="data" /><button id="send">Send</button><button id="send1" class="info">Details<span>Click to set your Name and Email-Id</span></button>' +
        		'</div>' +
        		'</div>' +
    			'</div>'
			);
			 
			$(function() {
			  $('input, textarea').placeholder();
			 
			 });
            
        }

        function setCookie(c_name, value, exdays) {
            var exdate = new Date();
            exdate.setDate(exdate.getDate() + exdays);
            var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
            document.cookie = c_name + "=" + c_value;
        }

        function getCookie(c_name) {
            var c_value = document.cookie;
            var c_start = c_value.indexOf(" " + c_name + "=");
            if (c_start == -1) {
                c_start = c_value.indexOf(c_name + "=");
            }
            if (c_start == -1) {
                c_value = null;
            }
            else {
                c_start = c_value.indexOf("=", c_start) + 1;
                var c_end = c_value.indexOf(";", c_start);
                if (c_end == -1) {
                    c_end = c_value.length;
                }
                c_value = unescape(c_value.substring(c_start, c_end));
            }
            return c_value;
        }
		
		
		
		 function saveuserdata(x) {
              document.getElementById('contactform').style.display = 'none';

              document.getElementById('sbmitmsg').innerHTML = "Thank you !!! <br /> <br /> We have received your credentials. <br /><br /> Name: " + x.yourname.value + "<br /> Email: " + x.email.value + "<br /><br /> You may close this popup and continue the chat.";
              setCookie("chat_username", x.yourname.value, 1);
              setCookie("chat_useremail",x.email.value, 1);
              return false;
          }
          function mailusermsg(y) {
              document.getElementById('msgform').style.display = 'none';
              return false;
          }

          //SETTING UP OUR -----------------------------------------POPUP
          //0 means disabled; 1 means enabled;
          var popupStatus = 0;
       
          //loading popup with jQuery magic!
          function loadPopup() {
              //loads popup only if it is disabled

              document.getElementById('contactform').style.display = 'block';
              document.getElementById('sbmitmsg').innerHTML = "";
              if (popupStatus == 0) {
                  $("#backgroundPopup").css({
                      "opacity": "0.9"
                  });
                  $("#backgroundPopup").fadeIn("slow");
               
                  popupStatus = 1;
              }
          }
         
          //disabling popup with jQuery magic!
          function disablePopup() {
              //disables popup only if it is enabled
              if (popupStatus == 1) {
                  $("#backgroundPopup").fadeOut("slow");
                 
                  popupStatus = 0;
              }
          }
       

          //CONTROLLING EVENTS IN jQuery
          $(document).ready(function () {

              //LOADING POPUP
              //Click the button event!
              $("#send1").click(function () {
                  
                  //load popup
                  loadPopup();

              });

              //CLOSING POPUP
              //Click the x event!
              $("#popupContactClose").click(function () {
                  if (popupStatus == 1)
                      disablePopup();
                 });
              
              //Press Escape event!
              $(document).keypress(function (e) {
                  if (e.keyCode == 27 && popupStatus == 1) {
                      disablePopup();
                  }
                 
              });

          });
