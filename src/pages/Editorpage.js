import React, { useState } from 'react'
import "quill/dist/quill.snow.css"
import { useEffect ,useRef,useCallback} from 'react';
import Quill from 'quill'
import {io} from 'socket.io-client'
import {useParams,useLocation} from 'react-router-dom'
import Chat from './Chat';
import toast, { Toaster } from 'react-hot-toast';
import Avatar from 'react-avatar';
function Editorpage() {
  const op = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["bold", "italic", "underline"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    [{ align: [] }],
    ["image", "blockquote", "code-block"],
    ["clean"],
  ]

 
    
 
  const [quill,setQuill]=useState()
  const [socket,setSocket]=useState()
  const [users,setUsers]=useState([])
  const {id}=useParams()
  const interval=2000
  let location=useLocation()
  const [curSocketId,setCurSocketId]=useState();
 const curUser=location.state.user
 
  useEffect(()=>{
    const s=io("http://localhost:4000")
    setSocket(s)
  },[])
  

  useEffect(()=>{
    if(socket==null || quill==null) return
    
    socket.once('load-document',(document,{socketId})=>{
      quill.setContents(document)
      setCurSocketId(socketId);
      
      //quill.enable()
       
      
    })
   socket.on("allUsers",(users,username)=>{
    setUsers(users);
    toast.success(`${username} has joined`)

   })
   socket.on("users",users=>{
    setUsers(users);
   })

   },[socket,quill])

   useEffect(()=>{
    if(socket==null || quill==null) return
 
    socket.on("updatedUsers",users=>{
      setUsers(users);
    })
 
   },[socket,quill])

  
  useEffect(()=>{
   if(socket==null || quill==null) return

   
 
   socket.emit('get-document',id,curUser)
  
  //  setUsers(users=>[...users,{id,user}])
   

  },[socket,quill])
  
  
  useEffect(()=>{
    if(socket==null || quill==null) return
    
    setInterval(()=>{
      socket.emit('save-changes',quill.getContents())
    },[interval])
    
    

  },[socket,quill])
  useEffect(()=>{
    if(socket==null || quill==null) return
    
   socket.on("userLeft",name=>{
    toast(`${name} left`)
   })
    
    

  },[socket,quill])


  useEffect(()=>{
    if(socket==null || quill==null) return
    
      const fun=(delta)=>{
        quill.updateContents(delta)
      }
        socket.on('receive-changes',fun)    
    return()=>{
      socket.off('receive-changes',fun)
    }
  },[socket,quill,id])

  useEffect(()=>{
    if(socket==null || quill==null) return
    const fun=(delta, oldDelta, source) => {
      if (source !== 'user') return 
        socket.emit('send-changes',delta)
      
    }
    quill.on('text-change',fun );
    return()=>{
      quill.off('text-change',fun);
    }
  },[socket,quill])
  const wrap=useCallback((wrapper)=>{
    if(wrapper==null) return;
    wrapper.innerHTML=""
    const editor=document.createElement("div")
    wrapper.append(editor)
    const q=new Quill(editor, {theme: 'snow',modules:{toolbar:op}})
     setQuill(q);
     //q.disable()
     
  },[])
  const [usersTab,setUsersTab]=useState(false)
  const [openedChatTab, setOpenedChatTab] = useState(false);
  const copy=async()=>{
    try{
      await navigator.clipboard.writeText(id);
      toast.success("Room ID copied")
    }
    catch(err){
     toast.error("Could not copy Room ID");
     console.log(err)
    }
  }
  return (
   
   <div>
  
    
    <button type="button" className='b mt-1'  style={{position:"fixed",left: "1%",zIndex:"999"}} onClick={()=>{setUsersTab(true)}} >Users</button>
    <button type="button" className='b mt-1'  style={{position:"fixed",left:"7%",zIndex:"999"}}   onClick={() => {setOpenedChatTab(true);setUsersTab(false)}}  >Chats</button>
    <button className='b' style={{position:"fixed",bottom:"0%",left:"1%"}} onClick={copy}>Copy Room ID</button>
    {
    usersTab&&
    <div className="btn btn-outline-secondary rounded " style={{display:"block",position:"fixed",top:"15%",height:"50vh",width:"300px",zIndex:"999",overflowY:"auto"}}>

    <button className="btn btn-danger   mb-3" onClick={()=>{setUsersTab(false)}}
    style={{position:"fixed",left:"15.5%",top:"15%"}}
    >Close</button>
    <div className='mt-3'>
    {
      users.map(user=>(
        <div key={user.scoketId} className='p-2 m-1' >
          <Avatar color={Avatar.getRandomColor('sitebase', ['red'])} name={user.username} size={30} round="24px" />
         &nbsp;{user.username} {user.socketId===curSocketId
           && "(You)"}
        </div>
      ))
    }
    </div>
     
    </div>
    
    }
    {openedChatTab && (

      
        <Chat setOpenedChatTab={setOpenedChatTab} socket={socket}  />
      )}
    <div className='doc' ref={wrap}>
     
    </div>
    
    
    </div>
   
  )
}

export default Editorpage