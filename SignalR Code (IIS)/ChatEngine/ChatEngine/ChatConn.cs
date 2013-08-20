using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Threading.Tasks;
using Microsoft.AspNet.SignalR;
using System.Collections.Concurrent;
using System.IO;
using System.Net.Mail;



namespace ChatEngine
{
    public class ChatConn : Hub
    {
        private readonly static ClientMapping<string> _connections = new ClientMapping<string>();
        private readonly static List<string> _operators = new List<string>();
        static string type;
        static string lo;

        private static ConcurrentDictionary<string, string> activethreads = new ConcurrentDictionary<string,string>();

        private static string path = (System.Web.HttpContext.Current == null)? System.Web.Hosting.HostingEnvironment.MapPath("~/"): System.Web.HttpContext.Current.Server.MapPath("~/");
        
     
        public void init()
        {
            
            type = Clients.Caller.Typ;
            lo = Clients.Caller.Loc;
            if (type == "operator")
            {
                //this block is executed when a new operator connects. he is added in operator group
                _operators.Add(Context.ConnectionId);
                Groups.Add(Context.ConnectionId, "operatorgroup");
                
                
                //set operator online status to true at the client side
                Clients.Group("clientgroup").op_online();
                //to populate the client list in the new operator's window. empty every operator's list and repopulate the list of all operators
                Clients.Group("operatorgroup").listing("refresh","" , "");
                Clients.Group("clientgroup").refreshlist();

                //if coming from thread.php
                var threadip = Clients.Caller.tip;
                if (threadip != "")
                {
                    if(activethreads.ContainsKey(threadip))
                    {
                        Clients.Caller.busybox("The client is busy with another operator now, try again later !");

                    }
                    else
                    {   
                        activethreads.TryAdd(threadip, Context.ConnectionId);
                        foreach (var connectionId in _connections.GetConnections(threadip))
                        {
                            Clients.Client(connectionId).addtoken(Context.ConnectionId);

                        }
                        Clients.Caller.sendMessage("Guest IP - " + threadip, Clients.Caller.uemail);
                        if(File.Exists(path + "\\chat\\" + threadip + ".rtf"))
                            Clients.Caller.sendMessage(File.ReadAllText(path + "\\chat\\" + threadip + ".rtf"), Clients.Caller.uemail);
                       

                    }
                }
            }
            else if(type == "client")
            {

                //when a new client connects, its ip is assigned to variable "clientip" defined at client side
                var ip = GetIpAddress();
                Clients.Caller.ipadd(ip);
                //new client is added in the client group
                _connections.Add(ip, Context.ConnectionId);
                Groups.Add(Context.ConnectionId, "clientgroup");
                if (_operators.Count!=0)
                {
                    //if atleast one operator is online then set operator online status to true at the client side 
                    Clients.Caller.op_online();
                    //append the new client's info to all the operator's client list
                    Clients.Group("operatorgroup").listing(ip,Clients.Caller.time, lo);
                    //Clients.Group("operatorgroup").listing(ip, Clients.Caller.Loc);

                }
                else
                    Clients.Caller.op_offline();

                if (File.Exists(path + "\\chat\\" + ip + ".rtf"))
                {
                    foreach (string line in File.ReadLines(path + "\\chat\\" + ip + ".rtf"))
                    {
                        Clients.Caller.sendMessage(line);
                    }
                    
                }

               
            }
        }
        public void sendmsg(string ip,string msg,string connid,string uname, string uemail)
        {
            type = Clients.Caller.Typ;
            //check: if the sender is client
            if (type == "client")
            {
               
                
                
                //display message in sender's box
                foreach (var connectionId in _connections.GetConnections(ip))
                {
                    Clients.Client(connectionId).sendMessage(uname + " : " + msg);
                }

                //display message in engaged operator's box
                if (_operators.Exists(id => id == connid))
                    Clients.Client(connid).sendMessage(uname + " : " + msg, uemail);
                else
                {
                    chatinitiate(ip, msg, uname, uemail);
                    return;
                }
               
                //chat transcript
                File.AppendAllText(path + "\\chat\\" + ip + ".rtf", uname+" : " + msg +Environment.NewLine);
               
            }
            else
            {   //for assigned operator via thread.php
                Clients.Caller.sendMessage("You: "+msg);
                foreach (var connectionId in _connections.GetConnections(ip))
                {
                    Clients.Client(connectionId).sendMessage("Operator: "+msg);
                   
                }

                //chat transcript
                File.AppendAllText(path + "\\chat\\" + ip + ".rtf", "Operator: " + msg +Environment.NewLine);
            }
            
        }

        public void sendnav(string newpage, string connid)
        {
            Clients.Client(connid).clientnavigated(newpage);
        }

        public void chatinitiate(string ip, string msg, string uname, string uemail)
        {
            
            foreach (var connectionId in _connections.GetConnections(ip))
            {
                Clients.Client(connectionId).sendMessage(uname + " : " + msg);
                Clients.Client(connectionId).sendMessage("System: Waiting for an operator to join you ...");
            }
            Clients.Group("operatorgroup").incoming(ip,Clients.Caller.Loc,msg,uname,uemail);

            //chat transcript
            if(File.Exists(path + "\\chat\\" + ip + ".rtf"))
                File.Delete(path + "\\chat\\" + ip + ".rtf");
            File.AppendAllText(path + "\\chat\\" + ip + ".rtf", uname+" : " + msg + Environment.NewLine);
        }

        public void refreshlisting(string ip)
        {
            lo = Clients.Caller.Loc;
            //append the client's(who calls this function) info to all the operator's client list
            Clients.Group("operatorgroup").listing(ip,Clients.Caller.time, lo);
            
        }

        public void mailchat(string ip,string emailid)
        {
            try
            {
                //to send email, replace the parameters with correct value of your smtp
                SmtpClient client = new SmtpClient();
                MailMessage msg = new MailMessage("username@mailservieprovider.com", emailid);
                client.Host = "smtp host (example: for gmail smtp write - smtp.gmail.com";
                client.Credentials = new System.Net.NetworkCredential("username", "password");
                client.Port = 587;
                msg.Body = "email body - if any";
                msg.Subject = "Chat Transcript";
                Attachment attachfile = new Attachment(path + "\\chat\\" + ip + ".rtf");
                msg.Attachments.Add(attachfile);
                client.EnableSsl = true;
                client.Send(msg);
            }
            catch { Clients.Caller.check("Mail not sent!"); }
        }

        public void offlinemsgmail(string name_input, string email_input, string phone_input, string body_input)
        {
            try
            {
                //to send email, replace the parameters with correct value of your smtp
                SmtpClient client = new SmtpClient();
                MailMessage msg = new MailMessage("username@mailserviceprovider.com", "email where to send the message");
                client.Host = "smtp host (example: for gmail smtp write - smtp.gmail.com";
                client.Credentials = new System.Net.NetworkCredential("username", "password");
                client.Port = 587;
                msg.Body = body_input + Environment.NewLine + "Sender Name:- " + name_input + Environment.NewLine + "Sender Phone No :-" + phone_input + Environment.NewLine + "Sender Email:-" + email_input;
                msg.Subject = "Message from" + name_input;
                client.EnableSsl = true;
                client.Send(msg);
                Clients.Caller.check("your message has been sent ");
            }
            catch { Clients.Caller.check("Mail not sent!"); }
        }

        

        public override Task OnDisconnected()
        {
            
           //client
                //if a client disconnects : remove it from client group and refresh the client list of all the operators
                var ip="";
                try
                {
                    ip = GetIpAddress();
                }
                catch {}
                var flag = 0;
                foreach (var connectionId in _connections.GetConnections(ip))
                {
                    if (connectionId == Context.ConnectionId)
                    {
                        flag = 1;
                        break;
                    }
                    
                }
                if (flag == 1)
                {
                    _connections.Remove(ip, Context.ConnectionId);
                    Groups.Remove(Context.ConnectionId, "clientgroup");
                    Clients.Group("operatorgroup").listing("refresh", "", "");
                    Clients.Group("clientgroup").refreshlist();

                    return base.OnDisconnected();
                }

           //end

           //operator
           
                //if coming from thread.php
                foreach (var thread in activethreads)
                {
                    if (thread.Value==Context.ConnectionId)
                    {
                        string deletedtoken;
                        
                        activethreads.TryRemove(thread.Key, out deletedtoken);

                        foreach (var connectionId in _connections.GetConnections(thread.Key))
                        {
                            Clients.Client(connectionId).sendMessage("System: Operator disconnected ! A new operator may join you.");
                            Clients.Client(connectionId).removetoken(deletedtoken);

                        }

                        if (File.Exists(path + "\\chat\\" + thread.Key + ".rtf"))
                            File.Delete(path + "\\chat\\" + thread.Key + ".rtf");
                       
                        break;
                        
                    }
                }
                
                //end

                if (_operators.Exists(id => id == Context.ConnectionId))
                {
                    Groups.Remove(Context.ConnectionId, "operatorgroup");
                    _operators.Remove(Context.ConnectionId);

                }
                if (_operators.Count == 0)
                    Clients.Group("clientgroup").op_offline();
            //end
            
            return base.OnDisconnected();
        }

        protected string GetIpAddress()
        {
            //function for detecting ip address
            var env = Get<IDictionary<string, object>>(Context.Request.Items, "owin.environment");
            if (env == null)
            {
                return null;
            }
            var ipAddress = Get<string>(env, "server.RemoteIpAddress");
            return ipAddress;
        }
        private static T Get<T>(IDictionary<string, object> env, string key)
        {
            object value;
            return env.TryGetValue(key, out value) ? (T)value : default(T);
        }

       
    }

    
}