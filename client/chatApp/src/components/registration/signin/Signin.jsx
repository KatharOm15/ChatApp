import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

function Signin() {
  const navigate = useNavigate();

  // State for form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleAcc = () => {
    navigate('/');
  };

  const handleLogin = async () => {
    try {
      
      const response = await axios.post('http://localhost:3000/app/signin', {
        email,
        password
      });

      // Handle success
      if (response.status==200) {
        console.log("Login successful:", response.data);
        localStorage.setItem('userId', response.data.user_id);
        alert("Login success")
        // Redirect to a dashboard or home page
        navigate('/dashboard');
      } else {
        console.log("Login failed:", response.data.message);
      }
    } catch (error) {
      // Handle error
      console.log("error ",error)
      alert('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className='w-screen h-screen bg-blue-200 flex items-center justify-center'>
      <div className='w-1/3 h-auto rounded-xl bg-cyan-500 shadow-xl flex flex-col items-center p-8'>
        <h2 className='text-white text-2xl font-bold mb-6'>Log In</h2>
        <div className='w-full bg-white rounded-xl shadow-lg p-6 flex flex-col'>
          {/* Email Input */}
          <label htmlFor='email' className='text-gray-700 font-semibold mb-2'>
            Email
          </label>
          <input
            id='email'
            type='email'
            placeholder='Enter your email'
            className='bg-slate-200 outline-none p-3 w-full h-12 mb-4 rounded-lg border-none'
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Update state
          />
          {/* Password Input */}
          <label htmlFor='password' className='text-gray-700 font-semibold mb-2'>
            Password
          </label>
          <input
            id='password'
            type='password'
            placeholder='Enter your password'
            className='bg-slate-200 outline-none p-3 w-full h-12 mb-6 rounded-lg border-none'
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Update state
          />
          {/* Sign In Button */}
          <button
            className='w-full h-12 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition'
            onClick={handleLogin} 
          >
            Log In
          </button>
        </div>
        <p className='text-white mt-4'>
          Don't have an account?{' '}
          <span
            className='text-yellow-300 underline cursor-pointer'
            onClick={handleAcc}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}

export default Signin;
