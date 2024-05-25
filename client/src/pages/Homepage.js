import React from 'react'
import { v4 } from 'uuid'
import {useNavigate} from 'react-router-dom'
import { useState } from 'react'
import toast,{Toaster} from "react-hot-toast";


function Homepage() {
  const navigate=useNavigate()
  const fun=()=>{
     if(!room || !username)
      {
        toast.error("Room ID and Username is required")
        return;
      }
     navigate(`/editor/${room}`,{state:{user:username}})
    
  }
  const handleEnter=(e)=>{
    if(e.code==='Enter')
      {
        fun();
      }
  }
  const [room,setRoom]=useState("")
  const [username,setUsername]=useState("");
 
  const createRoom=()=>{
    setRoom(v4())
    toast.success("New room created")
  }
  return (
    <div className='container d-flex align-items-center justify-content-center ' style={{height:"100vh"}}>
      
      <div className=' p-5  shadow rounded ' style={{width:"500px"}}>
      <h1 className=" text-primary  mb-4 opacity-75 fw-bold fs-1 display-4 lead " >&nbsp;Collab!  </h1>
        <div className=''>
        <input type="text" className="form-control py-4 m-2"placeholder='Enter room id'  value={room} onChange={(e)=>setRoom(e.target.value)}
        
         onKeyUp={handleEnter}
        />
        <input type="text" className="form-control py-4 m-2"placeholder='Enter username' onChange={(e)=>setUsername(e.target.value)}
         
         onKeyUp={handleEnter}
        />
        <button onClick={fun} className=' mx-2 mt-2 join'> Join</button>
        <button  className="create"onClick={createRoom}>Create room</button>
        </div>
      </div>
      
    </div>
   
  )
}

export default Homepage