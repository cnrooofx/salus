const express = require('express')
const app = express()

app.use(express.json())

const users = [{ name: 'Aidan'}]

app.get('/users', (req, res) => {
    res.json(users)
})

app.post('/users',(req,res) => {
    const uname = { name : req.body.name, password: req.body.password}
    users.push(uname)
    res.status(201).send()
})
app.listen(3000)