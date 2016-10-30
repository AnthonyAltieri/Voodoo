<p align="center">
<img src="https://raw.githubusercontent.com/AnthonyAltieri/PanicJS/master/logo.png" />
</p>
  
## A framework for seamless offline and lie-fi handling for your HTTP logic
---  
  

## What is Voodoo?
Voodoo provides you with the tools to create a website or web application that will work regardless of connection status. If a User goes offline or has spotty network connection (ie. lie-fi) Voodoo will store and manage your requests to the server as well as store the response logic. When connection is re-established, Vodoo will make the requests in the in the order they where performed and trigger your response logic related to each successfull request; requests that fail in this process will remain in the queue waiting to be attempted again when connection is stable.  


## How does it work?
**Initial Steps**: Create an endpoint on your server that sends back a 200 status response, this will be the endpoint used to periodically check if network connection is available. In your website/web applications javascript create a new Panic object with the class Panic. This module will automatically keep track of your online status and keep it in the variable `Panic.isAlive`.  
  
**Handling Response Logic**: Create a new source for your `Voodoo` global object with `Voodoo.createSource` and pass in a root `Grave` as a parameter. A `Grave` is an object that contains other graves and `Zombie Functions`. A `Zombie Function` is a function of the signature:
```
(tag, payload) => void
```
where there is a switch case inside of the function body that switches on `tag` and the default is to do nothing;  your response logic is written in the cases of this function. The idea is very simple, you want to make an HTTP query you use the function `Panic.http` with the signature:
```
(type, url, params, tag, withCredentials) => void
```
**type** is either 'GET' or 'POST' (more types will be supported later on)  
**url** is the full url of your server endpoint that you are trying to hit
**params** is the parameters for the query you are trying to make
**tag** is a string that is a tag that will identify the response logic you want to perform whenever this call is made successfully, if no response logic is needed pass in null
**withCredentials** is a boolean that defaults to true which determines if this Ajax request has withCredentials as true  
  
When the HTTP query is successfully made, the framework calls `Voodoo.perform(tag, payload)` where tag is the tag you have entered while making the call originally and payload is the data that was received from the server upon a successful request. This will move move down the structure of your graves and when the correct tag case is reached your response logic will be executed.  
  

## Why use Voodoo?
Voodoo might seem like a divergence from your normal workflow but it was designed to enforce a stricter separation of concerns than most current web sites/ web applications perform currently. Now response logic can be encapsulated by Graves that focus on individual components or portions of your application. Voodoo's benefit moves beyond better coding practices and into real life user benefits by providing a mechanism to deal with offline logic and lie-fi user connections. With Voodoo your application can move into an "offline first" mentality with across the board browser support. This framework was spawned out of admiration for the concept of ServiceWorkers and the frustration of their minimal support across all modern browsers; Voodoo addresses the problem of connectivity in the most efficient way possible without relying on browser implemented features. 
  
