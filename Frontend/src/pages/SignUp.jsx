import React, { useContext, useState } from "react";
import bg from "../assets/one.png";
import { IoEyeOutline } from "react-icons/io5";
import { IoEyeOffOutline } from "react-icons/io5";
import { Navigate, useNavigate } from "react-router-dom";
import { userDataContext } from "../context/UserContext";
import axios from "axios";

const SignUp = () => {
  
  const [showPassword, setShowPassword]=useState(false)
  const {serverUrl,userData, setUserData}=useContext(userDataContext)
  const nevigate = useNavigate()  
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] =useState("")
  const [loading, setLoading] = useState(false)
  const handleSignUp =async(e)=>{
     e.preventDefault()
     setError("")
     setLoading(true)
     try {
        let result=await axios.post(`${serverUrl}/api/auth/signup`,{name,email,password},{withCredentials:true})
        setUserData(result.data)
        setLoading(false)
        nevigate("/customize")
     } catch (error) {
        console.log(error)
        setUserData(null)
        setLoading(false)
        setError(error?.response?.data?.message || "Something went wrong!");

     }
  }
  

    
  return (
    <div
      className="w-full h-[100vh] flex justify-center items-center bg-cover  bg-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <form className="w-[90%] h-[600px] max-w-[500px] bg-[#0000062] backdrop-blur shadow-lg shadow-black flex flex-col items-center justify-center gap-[20px] px-[20px]" onSubmit={handleSignUp}>
        <h1 className="text-white text-[30px] font-semibold mb-[30px]">
          Register to <span className="text-yellow-400">Virtual Assistant</span>
        </h1>
        <input
          type="text"
          placeholder="Enter your name"
          className="w-full h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full "
          required
          onChange={(e)=>setName(e.target.value)}
          value={name}
        />
        <input
          type="text"
          placeholder="Enter your email"
          className="w-full h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full"
          required
          onChange={(e)=>setEmail(e.target.value)}
          value={email}
        />
        <div className="w-full h-[60px] border-2 border-white bg-transparent text-white rounded-full relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            className="w-full h-[60px] outline-none bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full"
            required
            onChange={(e)=>setPassword(e.target.value)}
            value={password}
          />
          {!showPassword && (
            <IoEyeOutline
              className="absolute top-[18px] right-[20px] text-white w-[25px] h-[25px]"
              onClick={() => {
                setShowPassword(true);
              }}
            />
          )}
          {showPassword && (
            <IoEyeOffOutline
              className="absolute top-[18px] right-[20px] text-white w-[25px] h-[25px]"
              onClick={() => {
                setShowPassword(false);
              }}
            />
          )}
        </div>
        {error.length>0 && <p className="text-red-500 text-[17px]">
            *{error}
        </p> }
        <button className="min-w-[150px] h-[60px] mt-[30px] text-black font-semibold bg-white tex-[19px] rounded-full" disabled={loading}>
        {loading?"Loading....":" SignUp"}
        </button>
        <p className="text-white " onClick={()=>nevigate('/signin')}>Already have an account ?<span className="text-blue-950 cursor-pointer">Sign In</span></p>
      </form> 
    </div>
  );
};

export default SignUp;
