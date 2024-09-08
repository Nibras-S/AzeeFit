import React from 'react'
import './pageActive.css'
import Active from '../components/admin/Active'
import { useNavigate } from 'react-router-dom'
import NewMember from '../components/admin/newMember'
import logo from '../components/static/assets/AZEELOGO.png'

function PageNewMember() {
  const navigate = useNavigate();
  return (
    <div className='main'>
      <div className="leftbar">
    <div className="profile-pic-container">
        <img src={logo} alt="Profile" className="profile-pic" />
    </div>
    <div className="buttons-container">
        <button className="leftbar-btn">New Member</button>
        <button className="leftbar-btn">Announcement</button>
    </div>
    <div className="logout-container">
        <button className="logout-btn" onClick={()=> navigate('/')}>Logout</button>
    </div>
</div>
      <div className='rightbar'>
        <NewMember/>
      </div>
    </div>
  )
}

export default PageNewMember
