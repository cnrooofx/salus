const express = require('express')
const { MongoClient, ServerApiVersion } = require("mongodb");
var url = `mongodb+srv://test:7hH398r5cFQD46j0@solus-db-3a415e48.mongo.ondigitalocean.com/admin?authSource=admin&replicaSet=solus-db&tls=true&tlsCAFile=ca-certificate.crt`
const client = new MongoClient(url, { serverApi: ServerApiVersion.v1 });
const app = express()

app.use(express.json())

const hostname = '0.0.0.0';
const port = 5000;
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
          dbo.collection("users").insertOne(data, function(err, res) {
            if (err) throw err;
            console.log("User created");
            db.close();
          });
    });
    res.status(201).send();
  });
})
})

app.get('/salt', (req, res) => {
   MongoClient.connect(url, function(err,db) {
     if (err) throw err;
      var dbo = db.db("users");
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


app.get('/login', (req, res) => {
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
     }
     )
  })
})

app.listen(port, hostname, () => {
      console.log(`Server running at http://${hostname}:${port}/`);
});