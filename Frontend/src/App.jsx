import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './Components/Header';
import Home from './Pages/Home';
import SignUp from './Pages/SignUp';
import SignIn from './Pages/SignIn';
import ResetPassword from './Pages/ResetPassword';
import ForgetPassword from './Pages/ForgetPassword';
import PrivateRoute from './Components/PrivateRoute';
import DashBoard from './Pages/DashBoard';
import AddTruckForm from './Pages/AddTruckForm';
import UpdateTruck from './Pages/UpdateTruck';
import CollectionRequestForm from './Pages/CollectionRequestForm';


export default function App() {
  return (
    <BrowserRouter>
      <Header/>
      <Routes>



        
        <Route path="/" element={<Home />} />
        <Route path="/sign-up" element={<SignUp/>}/>
        <Route path="/sign-in" element={<SignIn/>}/>
        <Route path="/forgetPassword" element={<ForgetPassword/>}/>
        <Route path="/resetpassword/:id/:token" element={<ResetPassword/>} />







        <Route element={<PrivateRoute/>}/>



          <Route path="/dashboard" element={<DashBoard/>}/> 

          <Route path="/addtruck" element={<AddTruckForm/>}/>
          <Route path="/update-truck/:id" element={<UpdateTruck/>}/>

          <Route path="/request" element={<CollectionRequestForm/>}/> 


        <Route/> 
      </Routes>
    </BrowserRouter>
  )
}
