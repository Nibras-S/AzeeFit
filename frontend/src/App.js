
import {Routes,Route} from 'react-router-dom' 
import PageHome from './pages/PageHome';
import PageActive from './pages/PageActive';
import PageInActive from './pages/PageInActive';


import './App.css'

import NewMember from './components/admin/newMember';
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
      <Route element={<PageNewMember/>} path='/register'/>

    
          </Routes>
      
    </div>
  );
}

export default App;
