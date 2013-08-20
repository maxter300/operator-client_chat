operator-client_chat
====================

ASP.NET signalR library based pro-active chat

The purpose of this project is to make a real time chat engine which allows live 
interaction with the visitors on a website. There are two roles played as customer and 
operator. The customer as a visitor of the website can chat with an operator if at least one 
of the operators is online with his operator panel. The customer (if wants) can also 
provide their personal info i.e. Name & Email id which will be used by the operator to 
whom the customer is currently chatting with. The operator can open his panel and 
monitor all the active visitors on the website. The operator panel displays each visitors 
information as IP, Page location of the website opened, Time elapsed on the page. Any 
operator can start a proactive chat with any visitor by forcibly starting a conversation, 
unless the visitor is not busy in another conversation with some other operator. A visitor 
can start a conversation by pinging through the chat box present on the webpage to all 
the operators online. The first operator to reply the visitor willing to chat, locks the 
conversation and no other operator is allowed to reply until the conversation is closed by 
the engaged operator. The engaged operator can save or mail the chat transcript at any 
point of time. The visitor’s navigation on the website is also passed to the operator. After 
closing the conversation, any other operator can continue the chat with the operator. A 
visitor can chat with only one operator at once while an operator can chat with multiple 
visitors simultaneously.
