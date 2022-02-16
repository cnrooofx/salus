const express = require('express')
var fs = require('fs');
var http = require('http');
var https = require('https');
var privateKey= fs.readFileSync('privkey.pem');
var certificate = fs.readFileSync('fullchain.pem');

var credentials = {key: privateKey, cert: certificate};

const { MongoClient, ServerApiVersion } = require("mongodb");
var url = `mongodb+srv://test:7hH398r5cFQD46j0@solus-db-3a415e48.mongo.ondigitalocean.com/admin?authSource=admin&replicaSet=solus-db&tls=true&tlsCAFile=ca-certificate.crt`
const client = new MongoClient(url, { serverApi: ServerApiVersion.v1 });
const app = express()



app.use(express.json())

const hostname = '0.0.0.0';
const port = 5000;
const hport= 5443;
const users = [{ name: 'Aidan'}]



app.get('/users', (req, res) => {
    res.json(users)
})

app.post('/signup',(req,res) => {
  MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("users");
      dbo.collection("counters").findOne({_id:"userid"}, function(err, result) {
        if (err) throw err;
            var myq = { _id:"userid" };
            var newvalues = { $inc: { seq: 1 } };

            dbo.collection("counters").updateOne(myq, newvalues, function(err, res) {
              if (err) throw err;
              console.log("1 document updated");
    

          const data = { _id : result.seq, email : req.body.email, password : req.body.pass, salt : req.body.salt}
          const pdata = {_id: result.seq, pass:{}}
          dbo.collection("users").insertOne(data, function(err, res) {
            if (err) throw err;
            console.log("Made it through users");
            dbo.collection("passwords").insertOne(pdata, function(err, res) {
              if (err) throw err;
              console.log("User created");
              db.close();
            });
          });
    });
    res.status(201).send("true");
  });
})
})

app.post('/salt', (req, res) => {
   MongoClient.connect(url, function(err,db) {
     if (err) throw err;
      var dbo = db.db("users");
	  console.log()
      dbo.collection("users").findOne({email:req.body.email}, function(err,result){
        if (result == null){
          res.send('false')
      }
      else{
        res.send(result.salt);
      }
      }
      )
   })
})

app.post('/password', (req, res) => {
  MongoClient.connect(url, function(err,db) {
    if (err) throw err;
     var dbo = db.db("users");
     dbo.collection("passwords").findOne({_id:req.body.id}, function(err,result){
      if (err) throw err;
       result.pass = req.body.data;
       console.log[result];
       var myq = { _id:req.body.id};
      var newvalues = {result};
       dbo.collection("passwords").replaceOne(myq, newvalues, function(err, res) {
        if (err) throw err;
        console.log("1 document updated");
    })
  })
})
})

app.post('/login', (req, res) => {
  MongoClient.connect(url, function(err,db) {
    if (err) throw err;
     var dbo = db.db("users");
     dbo.collection("users").findOne({email:req.body.email}, function(err,result){
       console.log(result)
       if (req.body.pass == result.password){
         res.send('true')
     }
     else{
       res.send(false);
     }
    })
  })
})

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(port, hostname, () => {
      console.log(`HTTP Server running at http://${hostname}:${port}/`);
});

httpsServer.listen(hport, hostname, () => {
	console.log(`HTTP Server running at http://${hostname}:${port}/`);
});