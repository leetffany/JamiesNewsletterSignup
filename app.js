//jshint esversion: 6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res) {
      res.sendFile(__dirname + "/signup.html")
    });

app.post("/", function(req, res){

  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  var data = {
    members: [
      {
      email_address: email,
      status:"subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }
  ]
};
//console.log(firstName, lastName, email);
  //we want to send data to chimp
  const jsonData = JSON.stringify(data);

  const url = "https://us19.api.mailchimp.com/3.0/lists/3fc253fa9c";

  const options ={
    method: "POST",
    auth: "jamie:f7bf6d5cc26f1f691ce98dd19519e184-us19"

  }
  //now make request. want to post data to external src
  const request = https.request(url, options, function(response){

    if(response.statusCode === 200){
      res.sendFile(__dirname + "/success.html");
    }else{
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function(data){
      console.log(JSON.parse(data));
    })
  })

  request.write(jsonData);
  request.end();
  });

app.post("/failure", function(req, res){
  res.redirect("/");
})

app.listen(process.env.PORT || 3000, function(){
  console.log("Server is running on port 3000. ");
});
