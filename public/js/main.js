//we are in client mode right now in this file
const chatForm=document.getElementById('chat-form');
const chatMessages=document.querySelector('.chat-messages');
const roomName=document.getElementById('room-name');
const usersList=document.getElementById('users');


//Get username and room from URL
const {username,room}=Qs.parse(location.search,{
    ignoreQueryPrefix:true
});
//console.log(username,room);

const socket=io();// we have access to io by the script tag socket.io we added  /means talking to our server/
//join chatroom
socket.emit('joinRoom',{username,room});

//get rooms and users
socket.on('roomUsers',({room,users})=>{
    outputRoomName(room);
    outputUsers(users);
    
});

//message from server
socket.on('message',message=>{//using this socket.on we cxatch the msg that server emit to us with a first argument matching 'message'
    console.log(message);//we want this msg in our DOM so
    outputMessage(message);

    //scroll down
    chatMessages.scrollTop=chatMessages.scrollHeight;

    
 
});

//message submit
chatForm.addEventListener('submit',(e)=>{
    e.preventDefault();

    //get msg text
    const msg=e.target.elements.msg.value;//what we submit in the form we get the text input and then print that

    //emit msg to server//console.log(msg);
    socket.emit('chatMessage',msg);

    //clear input
    e.target.elements.msg.value='';
    e.target.elements.msg.focus();
      
}); 

function outputMessage(message)
{  const div= document.createElement('div');//as out output chat-messages are in a div format so we create that div format and then display
  div.classList.add('message');
  div.innerHTML=`<p class="meta"> ${message.username} <span> ${message.time}</span></p>
  <p class="text">
      ${message.text}
  </p>`;
  document.querySelector('.chat-messages').appendChild(div);
}

//add room name to DOM
function outputRoomName(room){
 roomName.innerText=room;
}

function outputUsers(users){
    usersList.innerHTML=`${users.map(user =>`<li>${user.username}</li>`).join('')}`;
}