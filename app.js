const express = require('express');
const app = require('express')();
const dotenv = require('dotenv');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose')
const chat_router = require('./router/chat.router');
const auth_router = require('./router/auth.router');
const path = require('path');

dotenv.config();
// Connect To DataBase

mongoose.connect(
  process.env.DB_CONNECT,
  // "mongodb+srv://ahmedFouad:12345@Aa@cluster0-2i8dn.mongodb.net/test?retryWrites=true&w=majority",
  { useNewUrlParser: true , useUnifiedTopology: true} , (e)=>{console.log('connected to mongodb !')})


app.use(express.json());

app.use(express.static('./chat-app'));

// app.get('/*',(req,res)=>{
//   res.sendFile(__dirname + "/chat-app/src/index.html");
// })

// Solve CORS POLICE
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With , Content-Type , Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE');
    next();
});

app.use('/chat',chat_router);

app.use('/auth',auth_router);



io.on('connection',(soket)=>{
console.log('New User Connect')
  soket.on('chat message',(msg)=>{
    io.emit('chat message', msg);
  });

  soket.on('disconnect',()=>{
    console.log('user disconnect');
  });

});




http.listen(process.env.PORT || 3000 ,(r)=>{
  console.log('app run on port 3000');
});
