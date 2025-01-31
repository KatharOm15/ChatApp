import React,{useState} from 'react'
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';


function Contact() {

  return (
    <div className='w-80  bg-slate-400 rounded-lg m-4 items-center'>
        <div className='flex text-center '>
            <input type="text"  className='m-4 rounded-md w-11/12 h-10 text-center outline-none font-semibold text-black bg-white' placeholder='Search' />
        </div>

        <div className='flex flex-col w-64 h-[85%] bg-white rounded-lg items-center m-4 '>
            <div className='m-2 bg-blue-500  h-[10%] flex items-center rounded-lg w-11/12'>
            <Avatar className='m-2 h-full ' >H</Avatar>

            <div className='flex flex-row w-[80%] items-center'>
              <h1 className='w-[80%] font-bold text-slate-800'>Om</h1>
              <Badge badgeContent={4} color="secondary" className='w-[9%]'>
            </Badge>
            </div>

            
            
            </div>
            <div className='m-2 bg-blue-500  h-[10%] flex items-center rounded-lg w-11/12'>
            <Avatar className='m-2 h-full ' >H</Avatar>

            <div className='flex flex-row w-[80%] items-center'>
              <h1 className='w-[80%] font-bold text-slate-800'>Om</h1>
              <Badge badgeContent={4} color="secondary" className='w-[9%]'>
            </Badge>
            </div>

            
            
            </div>

           
           
        </div>
    </div>
  )
}

export default Contact