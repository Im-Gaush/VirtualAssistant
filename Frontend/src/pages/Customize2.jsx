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
    <div className="relative w-full min-h-screen 
  bg-gradient-to-br from-[#0f0f0f] via-[#1a1a2e] to-[#16213e] 
  flex flex-col items-center py-10 px-4 md:py-14 md:px-6 overflow-hidden">

  <FaArrowLeft 
    className="absolute top-4 left-4 text-white w-6 h-6 md:w-[25px] md:h-[25px]" 
    onClick={() => nevigate("/customize")} 
  />

  {/* Background glow */}
  <div className="absolute -top-10 -left-10 w-40 h-40 md:w-72 md:h-72 bg-purple-600/20 rounded-full blur-3xl"></div>
  <div className="absolute top-32 -right-10 w-56 h-56 md:w-96 md:h-96 bg-yellow-500/10 rounded-full blur-3xl"></div>

  {/* Title */}
  <h1 className="text-3xl md:text-6xl font-extrabold text-transparent bg-clip-text 
    bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 mb-6 md:mb-14 
    tracking-wider drop-shadow-lg text-center">
    ⚓ Straw Hat Pirates
  </h1>

  <p className="text-lg md:text-3xl font-extrabold text-transparent bg-clip-text 
    bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 mb-6 md:mb-14 
    drop-shadow-lg text-center">
    Enter Your Pirate Name
  </p>

  {/* Input */}
  <input
    type="text"
    placeholder="Enter your name"
    className="w-full max-w-[90%] md:max-w-[600px] h-12 md:h-[60px] 
      outline-none bg-transparent text-white placeholder-gray-300 
      px-4 py-2 rounded-full border-2 text-sm md:text-base"
    required
    onChange={(e) => setAssistantName(e.target.value)}
    value={assistantName}
  />

  {/* Button */}
  {assistantName && (
    <button 
      className="min-w-[120px] md:min-w-[150px] h-10 md:h-[60px] mt-6 md:mt-[30px] 
        text-black font-semibold bg-white rounded-full cursor-pointer text-sm md:text-lg"
      disabled={loading}
      onClick={() => {
        nevigate("/")
        handleUpdateAssistant()
      }}
    >
      {!loading ? "Create" : "Loading..."}
    </button>
  )}
</div>

  )
}

export default Customize2
