const express = require('express');
const app = express ();

app.post('/register',(req,res)=>{
    res.json('test ok');
})

app.listen(8800, (req,res)=>{
    console.log("Database connected successfully!!!! ");
});
