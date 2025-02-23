import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Signup() {
  const navigate = useNavigate();

  // State for form fields and error messages
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Handle input change
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Form validation
    const { name, email, password, confirmPassword } = formData;
    if (!name || !email || !password || !confirmPassword) {
      setError('All fields are required.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      // Send signup data to the backend
      const response=axios.post('http://localhost:3000/app/',formData)
      


      if ((await response).status===200) {
        alert("Account Created Successfully")
        setSuccess('Account created successfully!');
        setTimeout(() => navigate('/signin'), 2000); // Redirect after 2 seconds
      } else {
        setError(data.message || 'Signup failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    }
  };

  const handleAcc = () => {
    navigate('/signin');
  };

  return (
    <div className="w-screen h-screen bg-blue-200 flex items-center justify-center">
      <div className="w-1/3 h-auto rounded-xl bg-cyan-500 shadow-xl flex flex-col items-center p-8">
        <h2 className="text-white text-2xl font-bold mb-6">Sign Up</h2>
        <form onSubmit={handleSubmit} className="w-full bg-white rounded-xl shadow-lg p-6 flex flex-col">
          {/* Name Input */}
          <label htmlFor="name" className="text-gray-700 font-semibold mb-2">
            User Name
          </label>
          <input
            id="name"
            type="text"
            minLength={3}
            placeholder="Enter your full name"
            className="bg-slate-200 outline-none p-3 w-full h-12 mb-4 rounded-lg border-none"
            value={formData.name}
            onChange={handleChange}
          />
          {/* Email Input */}
          <label htmlFor="email" className="text-gray-700 font-semibold mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            className="bg-slate-200 outline-none p-3 w-full h-12 mb-4 rounded-lg border-none"
            value={formData.email}
            onChange={handleChange}
          />
          {/* Password Input */}
          <label htmlFor="password" className="text-gray-700 font-semibold mb-2">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            className="bg-slate-200 outline-none p-3 w-full h-12 mb-4 rounded-lg border-none"
            value={formData.password}
            onChange={handleChange}
          />
          {/* Confirm Password Input */}
          <label htmlFor="confirmPassword" className="text-gray-700 font-semibold mb-2">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            className="bg-slate-200 outline-none p-3 w-full h-12 mb-6 rounded-lg border-none"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          {/* Error and Success Messages */}
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          {success && <p className="text-green-500 text-sm mb-4">{success}</p>}
          {/* Sign Up Button */}
          <button type="submit" className="w-full h-12 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
            Sign Up
          </button>
        </form>
        <p className="text-white mt-4">
          Already have an account?{' '}
          <span onClick={handleAcc} className="text-yellow-300 underline cursor-pointer">
            Log In
          </span>
        </p>
      </div>
    </div>
  );
}

export default Signup;
