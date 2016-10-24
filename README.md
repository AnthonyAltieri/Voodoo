![Panic](https://raw.githubusercontent.com/AnthonyAltieri/PanicJS/master/logo.png)
# **Panic.js**
### No more anxiety about an offline client in a real-time application
---
##### **What is Panic?**
Panic is a tool that makes handles offline and unstable internet connections for HTTP queries by providing browser storage fall-backs for these conditions.

##### **How it works**
Initialize a panic singleton with an endpoint on your sever that will be used in part with failed requests to determine your connection status. Use panic to send HTTP requests (only GET and POST are supported currently) to your server as normal; these requests will be saved into storage (localStorage or cookies) if they are not made (due to connection problems or a server error), and will be completed when connection to the server is established again.

##### **Advantages of Panic**
1. Supported in most modern browsers (Chrome, Firefox, Safari, Opera)
2. Allows the user experience to be decoupled from pain due to unstable and unavailable wifi

##### **Features in progress**
In order to perform logic on responses, use globally accessible singletons that perform pure functions with response payloads; this is a feature that is being worked on actively and will be added shortly. Another way to retrieve data in the client would be using a socket based implementation, but that is overkill in many use-cases.



