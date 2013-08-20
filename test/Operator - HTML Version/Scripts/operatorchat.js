
        
        $(document).ready(function () {

            //to trigger click() event of send button on pressing Enter key
            $("#data").keyup(function (event) {
                if (event.keyCode == 13) {
                    $("#send").click();
                }
            });
            //end
           
		    var serverpath = 'http://urchat.somee.com';
            //$("#toggle").hide();
            //$("#top").click(function (event) { $("#toggle").slideToggle("fast") });
			
           

            //for Hub API connection
 			//if using client code on different server , change src in script tag to "http://localhost:36687/signalr/hubs" and uncomment code below
            //$.connection.hub.url = 'http://urchat.somee.com/signalr';//uncommented//
			$.connection.hub.url = serverpath+'/signalr';//uncommented//
			//var clientip;
			
            var chat = $.connection.chatConn;
			chat.state.Typ = "operator";
			
			
			chat.client.check = function (msg) {
				alert(msg);
			};
			
			//increment time class every second
			setInterval(function (){elapsedtime("time");},1000);


			chat.client.incoming = function (cip, pagelocation, startmsg, uname, uemail) {
				$('#waitinglist').append('<li class="border"><p class="basic1 loc">Location : '+pagelocation+'</p><span class="basic1">Says:</span> <br /><textarea id="textarea1" cols="30" rows="2" readonly="true" style=" overflow-x:auto; margin-bottom:0; height:auto; ">'+startmsg+'</textarea> <span class="basic2">IP:'+cip+'</span><button id="send1" class="sendpos" onClick="thread(\''+cip+'\',\''+uname+'\',\''+uemail+'\')" value="'+cip+'">Reply</button></li>');
				
				var notify = new Audio('sound/notify.mp3');
        		notify.play();
			};
			
			
			
			
            chat.client.sendMessage = function (message,email) {
				if(!(typeof email === 'undefined'))
				showdetails(email);
                var encodedMsg = $('<div />').text(message).html();
                $('#contentin').append('<li>'+ encodedMsg + '</li>');
				$("#content").scrollTop($('#content').scrollTop() + $('#contentin').height());
            };
			
			function showdetails(email)
			{ 
				 document.getElementById('top1').innerHTML = "User email:- " + email;
			
			}
			
			
			chat.client.listing = function (ip,t,location) {
				var encodedip = $('<div />').text(ip).html();
				var encodedlocation = $('<div />').text(location).html();
				var d = new Date;
				var time =Math.round(d.getTime()/1000);
				time= parseInt(time)-parseInt(t); //seconds elapsed on client page
				var h=Math.floor(time/3600);
				h=(h < 10 ? '0' : '') + h;
				var m=Math.floor((time/60)-(h*60));
				m=(m < 10 ? '0' : '') + m;
				var s=Math.floor(time-((h*3600)+(m*60)));
				s=(s < 10 ? '0' : '') + s;
				if (ip=="refresh")
					$("#clist").empty();
				else
				<!--$("#clist").append('<li>IP : '+encodedip+' Time : <span class="time">'+h+':'+m+':'+s+'</span>'+' Location : '+encodedlocation+' <button onClick="thread(\''+ip+'\')" value="'+ip+'">Start Chat</button></li>');-->
				$("#clist").append('<li class="border"><span class="timewrapper">Time :<span class="time">'+h+':'+m+':'+s+'</span></span>'+'<span class="basic1"> IP : '+encodedip+'</span> <button onClick="thread(\''+ip+'\')" value="'+ip+'" id="send1">Start Chat</button><p class="basic1 loc">Location : '+encodedlocation+'</p></li>');
			};
			
			
			window.onbeforeunload = function () {
                chat.server.leave("");
            };
			

           // chat.client.ipadd = function (ip) {
           //     clientip = ip;
                
           // };
		   
		   //code for thread.php
		   var thread_ip = getqs("ip");
		   chat.state.tip= thread_ip;
		   var name = getqs("name");
		   if(name=="" || name== null || name=='undefined')
		   	name="Guest";
		   var email = getqs("email");
		   if(email=="" ||email == null || email=='undefined')
		   	email="not given";
		   
		   chat.state.uname= name;
		   chat.state.uemail= email;
		   
		   chat.client.busybox = function (msg) {
			   $('#toggle').html('<div style="height:230px; color:gray">'+msg+'</div>');
		   }
		   
		   
		   $('#ctmail').click(function () {
			   var email
			   email=prompt("Enter the email address to which the chat transcript will be sent:");
			   if(email != null || email != "")
			   	chat.server.mailchat(thread_ip,email);
			   
		   });
		   
		   $('#ctsave').click(function () {
			   var path= serverpath+'/chat/'+thread_ip+'.rtf';
			   window.open(path);
		   });
		   
		   chat.client.clientnavigated = function (page) {
			   $('#contentin').append('<li>Client moved on: '+page+'</li>');
			   $("#content").scrollTop($('#content').scrollTop() + $('#contentin').height());
		   }
			   
		   
		   //end
			

            $.connection.hub.start()
            .done(function () {
				chat.server.init();
				
                $("#send").click(function () {
                    if ($("#data").val()!="" && $("#data").val() != null && $("#data").val() != '\n')
                    chat.server.sendmsg(thread_ip,$('#data').val(), "", "", "");
                    $('#data').val('').focus();
                });

               
            })
            .fail(function () { alert("Could not connect!"); });
            //end
			
			
			
        });
		
		
		function thread (ip,name,email) {
			var randomno = Math.floor((Math.random()*100)+1);
			window.open("thread.html?ip="+ip+"&name="+name+"&email="+email,"thread"+randomno,'resizable=no,width=320,height=390');
		}
		
		function getqs(name) {
			name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
			var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
				results = regex.exec(location.search);
			return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
		}
		
		function elapsedtime(matchClass) {
			var elems = document.getElementsByTagName('*'), i;
			for (i in elems) {
				if((' ' + elems[i].className + ' ').indexOf(' ' + matchClass + ' ')	> -1) {
					var t=elems[i].innerHTML;
					var te=t.split(":");
					te[2]=parseInt(te[2])+1;
					te[2]=(te[2] < 10 ? '0' : '') + te[2];
					if(te[2]==60){
						te[2]='00';
						te[1]=parseInt(te[1])+1;
						te[1]=(te[1] < 10 ? '0' : '') + te[1];
					}
					if(te[1]==60){
						te[1]='00';
						te[0]=parseInt(te[0])+1;
						te[0]=(te[0] < 10 ? '0' : '') + te[0];
					}
					t=te[0]+':'+te[1]+':'+te[2];
					elems[i].innerHTML=t;
				}
			}
		}
		