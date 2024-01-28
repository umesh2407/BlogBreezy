const express = require('express');
const cors = require('cors');
const mongoose  = require('mongoose');
const User = require('./models/user')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const salt = bcrypt.genSaltSync(10);
const secret = 'jhbzmgtw';

const app = express ();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/BLOGAPP');

app.post('/register',async (req,res)=>{
    const {username,password}= req.body;
    try {
        await User.create({username,
            password: bcrypt.hashSync(password,salt),
            }); 
        res.json({message: 'User registered succesfully!!'});
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
    
})

app.post('/login',async (req,res)=>{
    const {username,password}= req.body;
    try {
        const userDoc = await User.findOne({username}); 
        const passOk = bcrypt.compareSync(password, userDoc.password);
        if(passOk){
        jwt.sign({username, id:userDoc._id}, secret , {}, (err,token)=>{
           if(err) throw err;
           res.json(token);
        })
        }
        else{
        res.status(400).json('invalid credentials');
        };
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
    
})
app.listen(8800, (req,res)=>{
    console.log("Database connected successfully!!!! ");
});
