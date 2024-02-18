const express = require('express');
const cors = require('cors');
const mongoose  = require('mongoose');
const User = require('./models/user')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const salt = bcrypt.genSaltSync(10);
const secret = 'jhbzmgtw';

const app = express ();
app.use(cors({credentials:true, origin:'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());


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
           res.cookie('token',token).json({
            id: userDoc._id,
            username,
           });
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

app.get('/profile',(req,res)=>{
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, (err,info)=>{
        if(err) throw err;
        res.json(info);
    })
})

app.post('/logout',(req,res)=>{
    res.cookie('token','').json('ok');
})

app.listen(8800, (req,res)=>{
    console.log("Database connected successfully!!!! ");
});
