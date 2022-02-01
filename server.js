const express = require('express')
const PASS = process.env.DB_PASS;
console.log(PASS)
var MongoClient = require('mongodb').MongoClient;
var url = `mongodb+srv://test:${PASS}@solus-db-3a415e48.mongo.ondigitalocean.com/admin?authSource=admin&replicaSet=solus-db&tls=true&tlsCAFile=ca-certificate.crt`
const app = express()

app.use(express.json())

const users = [{ name: 'Aidan'}]

app.get('/users', (req, res) => {
    res.json(users)
})

app.post('/users',(req,res) => {
    const uname = { name : req.body.name, password: req.body.password}
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("pwds");
        dbo.collection("userp").insertOne(uname, function(err, res) {
          if (err) throw err;
          console.log("1 document inserted");
          db.close();
        });
      });
    res.status(201).send()
})
app.listen(3000)