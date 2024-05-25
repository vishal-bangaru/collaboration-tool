const exp=require("express");
const app=exp()
const http = require('http');
const server = http.createServer(app);
// const { Server } = require("socket.io");
const io = require("socket.io")(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });
  const path=require("path")

  //connecting to react build (frontend and backend)
  app.use(exp.static(path.join(__dirname, '../client/build')));


  
const {addUser,getUser,removeUser,allUsersInRoom}=require("./utils/users")
app.get('/',(req,res)=>{
  res.send("get route")
})
var collabObj;
const mclient=require("mongodb").MongoClient;
//mongodb+srv://vishalbangaru4:vishalbangaru4@cluster0.8ttchzw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
//mongodb://127.0.0.1:27017
mclient
.connect("mongodb+srv://vishalbangaru4:vishalbangaru4@cluster0.8ttchzw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
.then((dbRef)=>
{   
      const dbObj=dbRef.db('testdb')
      collabObj=dbObj.collection('collab')
       console.log("db connection successful")
     
})
.catch(err=>console.log(err))
const pageRefresh = (req, res, next) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
};


app.get('*', pageRefresh);
const findorCreate=async(roomId)=>{
    const user=await collabObj.findOne({id:roomId})
    if(user==null)
    {
        await collabObj.insertOne({id:roomId,content:""})   
    }
}  
let usernameGlobal; 
io.on("connection",socket=>{
  
    socket.on('get-document',async(roomId,username)=>{
        roomIdGlobal=roomId;
        usernameGlobal=username;
        socket.join(roomId)
    
             const users=addUser({roomId,username,socketId:socket.id})
             socket.broadcast.to(roomId).emit("allUsers",users,username)  
             socket.emit("users",users)      
            await findorCreate(roomId)
               const user=await collabObj.findOne({id:roomId})
            socket.emit('load-document',user.content,{socketId:socket.id})
            
        socket.on('send-changes',(delta)=>{
            socket.broadcast.to(roomId).emit('receive-changes',delta)
        })
        socket.on('save-changes',async(data)=>{
                await collabObj.updateOne({id:roomId},{$set:{content:data}})
        })
        socket.on("message", (data) => {
            const { message } = data;
            const socketId=socket.id;
            const user = getUser(socketId);
            if (user) {
              socket.broadcast
                .to(roomIdGlobal)
                .emit("messageResponse", { message, name: user.username });
            }
          });

        socket.on("disconnect",()=>{
          const user=getUser(socket.id);
        
          if(user){
          const removedUser=removeUser(socket.id);
          socket.broadcast.to(roomIdGlobal).emit("userLeft",user.username);
          const allUsers=allUsersInRoom(roomIdGlobal)
          socket.broadcast.to(roomIdGlobal).emit("updatedUsers",allUsers);
          }
        })
    })

    
    
})
server.listen(4000, () => {
    console.log('server running on 4000');
  });