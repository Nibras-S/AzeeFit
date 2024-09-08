import React from 'react'
import './pageActive.css'
import Expired from '../components/admin/Expired'
import { useNavigate } from 'react-router-dom';
import logo from'../components/static/assets/AZEELOGO.png'
// import { useState } from 'react';
function PageExpired() {
  // const [gender,setGender] = useState('Male')
  // const HandleSwitchUser = () =>{
  //     setGender(prevGender => prevGender === 'Male' ? 'Female' : 'Male');
  // }
    const navigate= useNavigate();
  return (
    <div className='main'>
      <div className="leftbar">
    <div className="profile-pic-container">
        <img src={logo} alt="Profile" className="profile-pic" />
    </div>
    <div className="buttons-container">
        <button className="leftbar-btn" onClick={()=> navigate('/register')}>New Member</button>
        <button className="leftbar-btn">Announcement</button>
    </div>
    <div className="logout-container">
    {/* <button className="leftbar-btn" onClick={HandleSwitchUser}>Switch User</button> */}

        <button className="logout-btn" onClick={()=> navigate('/')}>Logout</button>
    </div>
</div>
      <div className='rightbar'>
        <div className='rtbuttons'>
          <button className='rtbtnActive' onClick={()=> navigate('/active')}>Active Members</button>
          <button className='rtbtnInActive'onClick={()=> navigate('/inactive')}>InActive Members</button>
          <button className='rtbtnExpired'style={{ color: 'red' }} onClick={()=> navigate('/expired')}>Expired Members</button>
        </div>
        <Expired/>
      </div>
    </div>
  )
}

export default PageExpired
