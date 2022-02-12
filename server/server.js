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
    

          const data = { _id: result.seq, uname : req.body.uname, password: req.body.pass}
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


app.post('/users',(req,res) => {
  const uname = { name : req.body.name, password: req.body.password}
  MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("pwds");
      dbo.collection("userp").insertOne(uname, function(err, res) {
        if (err) throw err;
        console.log("User created");
        db.close();
      });
    });
  res.status(201).send()
})
app.listen(port, hostname, () => {
      console.log(`Server running at http://${hostname}:${port}/`);
});