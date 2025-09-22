import React, { useContext, useState } from 'react'
import { userDataContext } from '../context/UserContext'
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import { FaArrowLeft } from "react-icons/fa6";


const Customize2 = () => {
  const {userData,backendImage,selectedImage,serverUrl,setUserData}=useContext(userDataContext)
  const [assistantName,setAssistantName]=useState(userData?.assistantName || "") 
  const [loading,setLoading]=useState(false)
  const nevigate = useNavigate() 
  const handleUpdateAssistant=async()=>{
    setLoading(true)
    try {
        
        let formData=new FormData()
        formData.append("assistantName",assistantName)
        if(backendImage){
            formData.append("assistantImage",backendImage)
        }else{
            formData.append("imageUrl",selectedImage)
        }

        const result=await axios.post(`${serverUrl}/api/user/update`,formData,{withCredentials:true})
        setLoading(false)
        console.log(result.data)
        setUserData(result.data)
        nevigate("/")
        
    } catch (error) {
        console.log(error)
        setLoading(false)
    }
  }
  return (
    <div  className="relative w-full min-h-screen bg-gradient-to-br from-[#0f0f0f] via-[#1a1a2e] to-[#16213e] flex flex-col items-center py-14 px-6 overflow-hidden">
      <FaArrowLeft className='absolute top-[30px] left-[30px] text-white w-[25px] h-[25px]' onClick={()=>nevigate("/customize")}/>
   
    <div className="absolute -top-20 -left-20 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl"></div>
      <div className="absolute top-40 -right-20 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl"></div>

      <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 mb-14 tracking-wider drop-shadow-lg">
        ⚓ Straw Hat Pirates
      </h1>
      <p className='text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 mb-14 tracking-wider drop-shadow-lg'>Enter Your Pirate Name</p>
      <input
            type="text"
            placeholder="Enter your name"
            className="w-full max-w-[600px] h-[60px] outline-none bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full border-2"
            required
            onChange={(e)=>setAssistantName(e.target.value)}
            value={assistantName}
            
          />
          {assistantName && <button className="min-w-[150px] h-[60px] mt-[30px] text-black font-semibold bg-white tex-[19px] rounded-full cursor-pointer" 
          disabled={loading}
          onClick={()=>{
            nevigate("/")
            handleUpdateAssistant()
            }}>
       {!loading?" Create":"Loading..."}
      </button>}
           
    </div>
  )
}

export default Customize2