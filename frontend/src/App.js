
import {Routes,Route} from 'react-router-dom' 
import PageHome from './pages/PageHome';
import PageActive from './pages/PageActive';
import PageInActive from './pages/PageInActive';
// import Header from './components/static/components/header/Header'
// import Program from './components/static/components/program/Program'
// import Navbar from './components/static/components/navbar/Navbar'
// import Class from './components/static/components/class/Class';
// import Price from './components/static/components/pricing/Price';

import './App.css'

// import Active from './components/admin/Active';
import NewMember from './components/admin/newMember';
// import Inactive from './components/admin/Inactive';
import AdminAuth from './components/admin/adminauth';
import PageNewMember from './pages/PageNewMember';
import PageExpired from './pages/PageExpired'

function App() {
  return (
    <div className="App">
       <Routes>
        <Route element={<PageHome/>} path=''/>
      <Route element={<AdminAuth/> } path='/admin'/>
      <Route element={<PageActive/>} path='/active'/>
      <Route element={<PageInActive/>} path='/inactive'/>
      <Route element={<PageExpired/>} path='/expired'/>
      <Route element={<NewMember/>} path='/login'/>
      <Route element={<PageNewMember/>} path='/register'/>

          </Routes>
      {/* <NewMember/>
      <Active/>
      <Inactive/>
      */}
    </div>
  );
}

export default App;
