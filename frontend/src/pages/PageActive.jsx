import React from 'react'
import './pageActive.css'
import Active from '../components/admin/Active'
import { useNavigate } from 'react-router-dom'
import logo from '../components/static/assets/AZEELOGO.png'
import { useState } from 'react'

function PageActive() {
  const navigate = useNavigate();
  const [gender,setGender] = useState('Male')
  const HandleSwitchUser = () =>{
      setGender(prevGender => prevGender === 'Male' ? 'Female' : 'Male');
  }
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
    <button className="leftbar-btn" onClick={HandleSwitchUser}>Switch User</button>
        <button className="logout-btn" onClick={()=> navigate('/')}>Logout</button>
    </div>
</div>

      <div className='rightbar'>
        <div className='rtbuttons'>
          <button className='rtbtnActive' style={{ color: 'green' }} onClick={()=> navigate('/active')}>Active Members</button>
          <button className='rtbtnInActive' onClick={()=> navigate('/inactive')}>InActive Members</button>
          <button className='rtbtnExpired' onClick={()=> navigate('/expired')}>Expired Members</button>
        </div>
        <Active gender={gender}/>
      </div>
    </div>
  )
}

export default PageActive
