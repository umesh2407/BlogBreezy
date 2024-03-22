const express = require('express');
const cors = require('cors');
const mongoose  = require('mongoose');
const User = require('./models/user');
const Post = require('./models/post');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const salt = bcrypt.genSaltSync(10);
const secret = 'jhbzmgtw';
const multer = require('multer');
const uploadMiddleware = multer({dest:'uploads/'});
const fs = require('fs');
require('dotenv').config();

const app = express ();
app.use(cors({credentials:true, origin:'https://blog-breezy.vercel.app/'}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads',express.static(__dirname + '/uploads'));

mongoose.connect(process.env.MONGO_URL);

app.use('/',(req,res)=>{
    res.json("Server is Working");
});

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

app.post('/post', uploadMiddleware.single('file') , async (req,res)=>{

const {originalname,path} = req.file;
const parts = originalname.split('.');
const ext  = parts[parts.length - 1 ];
const newpath = path+'.'+ext;
fs.renameSync(path,newpath);

const {token} = req.cookies;
jwt.verify(token, secret, {}, async(err,info)=>{
    if(err) throw err;
    const {title,summary,content} = req.body;
    const postDoc = await Post.create({
        title,
        summary,
        content,
        cover:newpath,
        author:info.id,
    });
    res.json(postDoc);
})
})


app.put('/post', uploadMiddleware.single('file'), async (req, res) => {
    let newPath = null;
    if (req.file) {
        const { originalname, path } = req.file;
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        newPath = path + '.' + ext;
        fs.renameSync(path, newPath);
    }

    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) throw err;
        const { id, title, summary, content } = req.body;
        const postDoc = await Post.findById(id);
        const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
        if (!isAuthor) {
            return res.status(400).json('you are not the author');
        }

        // Replace `update` with `findByIdAndUpdate`
        const updatedPost = await Post.findByIdAndUpdate(id, {
            title,
            summary,
            content,
            cover: newPath ? newPath : postDoc.cover,
        }, { new: true }); // to return the updated document

        res.json(updatedPost);
    });

});


app.get('/post', async (req,res) => {
    res.json(
      await Post.find()
        .populate('author', ['username'])
        .sort({createdAt: -1})
        .limit(20)
    );
  });

  app.get('/post/:id', async (req, res) => {
    const {id} = req.params;
    const postDoc = await Post.findById(id).populate('author', ['username']);
    res.json(postDoc);
  })

app.listen("https://blog-app-server-roan.vercel.app/", (req,res)=>{
    console.log("Database connected successfully!!!! ");
});
