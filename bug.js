const express = require('express');
const serialize = require('node-serialize');
const cookieParser = require('cookie-parser');
const app = express();

app.use(cookieParser());

app.get('/', function(req, res) {
 if (req.cookies.profile) {
   // --- THE VULNERABILITY ---
   // This line takes a string from a cookie and turns it back into an object.
   // If that string contains a function, node-serialize will EXECUTE it.
   const str = Buffer.from(req.cookies.profile, 'base64').toString();
   const obj = serialize.unserialize(str);
   
   if (obj.username) {
     res.send("Hello " + obj.username);
   }
 } else {
   res.cookie('profile', "eyJ1c2VybmFtZSI6ICJBc3RyYWVhIn0=", { maxAge: 900000, httpOnly: true });
   res.send("Welcome hehhe! Cookie set.");
 }
});

app.listen(3000);
