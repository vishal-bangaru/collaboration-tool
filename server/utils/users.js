const users=[]
const addUser=({roomId,username,socketId})=>{
    users.push({roomId,username,socketId})
    return users.filter(user=>user.roomId===roomId);
}

const removeUser=(id)=>{
const index=users.findIndex(user=>user.socketId===id)
if(index!==-1)
return users.splice(index,1)[0];
}

const getUser=(socketId)=>{
    
    return users.find(user=>user.socketId===socketId)
}
const allUsersInRoom=(roomId)=>{
    return users.filter(user=>user.roomId===roomId)
}
module.exports={
    addUser,getUser,removeUser,allUsersInRoom
};