import React, { useEffect,useState } from 'react'
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import VideocamIcon from '@mui/icons-material/Videocam';
import CallIcon from '@mui/icons-material/Call';
import axios from 'axios';




function Profile() {
  const userId=localStorage.getItem('userId');
  const [users, setUser] = useState([]);
  const firstLetter = users?.name?.toString().charAt(0).toUpperCase() || '';
  useEffect(()=>{
      axios.get(`http://localhost:3000/app/users/getName/${userId}`)
      .then((response) => setUser(response.data))
      .catch((error) => console.error("Error fetching sent requests:", error));
  },

  )
  
  return (
    <div className='w-11/12 h-[10%] flex rounded-lg  bg-white m-4'>

        <div className='m-4 flex items-center float-left w-[80%]'>
        <Avatar className='m-2 h-full ' >{firstLetter}</Avatar>
        <h1 className='m-2 text-2xl font-bold'> {users.name}</h1>
        </div>

        <div className=' float-right flex items-center'>
          <VideocamIcon className='h-28 w-16 m-4 hover:text-black' style={{ fontSize: '35px',color:'rgb(71 85 105)' }}/>
          <CallIcon className='h-16 w-16  m-4' style={{ fontSize: '30px' ,color:'rgb(71 85 105)'}}/>
        </div>
    </div>
  )
}

export default Profile