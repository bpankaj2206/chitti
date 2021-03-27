const path=require('path');// using path module here
const http=require('http');//adding http module/pakage 
const express=require('express');// just creating a express server by using express module
const socketio=require('socket.io');// to use socket.io
const formatMessage=require('./utils/messages');
const {userJoin,getCurrentUser,userLeave,getRoomUsers}=require('./utils/users');

const app=express();// creating a app component
const server=http.createServer(app);
const io=socketio(server);//creating io variable

//setting our public folder as static folder so that when we go for localhost:3000 our html file will run by default
app.use(express.static(path.join(__dirname,'public')));
const botName='Admin bot: Chitti';

//run when client connects //io.on mean io will listen to when some happening event
io.on('connection',socket=>{
    //console.log('New WS Connection');//this msg will be printed out when connection is build in console
      
    //joinRoom username
     socket.on('joinRoom',({username,room}) =>{
       const user=userJoin(socket.id,username,room);

       socket.join(user.room);
   //welcome the user
   socket.emit('message',formatMessage(botName,'Welcome to Chat With Chitti!  '));//emit to the frontend  for the client who is connecting

   //broadcast when a user connects //in this way message is sent to all except the connection user 
   socket.broadcast.to(user.room).emit('message',formatMessage(botName,`${user.username} has joined the chat`));

    //Send users and room info
    io.to(user.room).emit('roomUsers',{
      room:user.room,
      users:getRoomUsers(user.room)
    });


     });

    
 
    //listen for chatMessage
    socket.on('chatMessage',msg =>{
       //console.log(msg);
       const user=getCurrentUser(socket.id);
       io.to(user.room).emit('message',formatMessage(user.username,msg));//we emit msg back to client
    });

    //runs when client disconnects
    socket.on('disconnect',()=>{
      const user= userLeave(socket.id);
      if(user){
        io.to(user.room).emit('message',formatMessage(botName,`${user.username} has left the chat`));//send msg to all
      //Send users and room info
    io.to(user.room).emit('roomUsers',{
      room:user.room,
      users:getRoomUsers(user.room)
    });

      }

      
    });

    
});

const PORT= process.env.PORT || 3000 ; // 3000 is fixed value but if we have this variable process.env.PORT then it will assign that value to PORT

server.listen(PORT,()=>console.log(`serevr running at port ${PORT}`));

