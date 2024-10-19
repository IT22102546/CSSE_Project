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
import SubmitIssue from './Pages/SubmitIssue';
import UpdateCollectorIssue from './Pages/UpdateCollectorIssue';
import CollectionRequestForm from './Pages/CollectionRequestForm';
import OrderSummary from './Pages/OrderSummary';
import RequestSuccess from './Pages/RequestSuccess';


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
        <Route path="/order-summary" element={<OrderSummary/>} />

        <Route path="/Adminhome" element={<AnalyticalRepoart/>}></Route>
        <Route path="/Adminsign-in" element={<AdminSignIn/>}></Route>
        <Route path="/additem" element={<AddDetails/>}></Route>
        <Route path="/Adminsign-up" element={<AdminSignUp/>}></Route>

        
         <Route path="/items" element={<ItemProfile/>}></Route>
        <Route path="/update-item/:id" element={<UpdateItem/>}></Route>







        <Route element={<PrivateRoute/>}/>



          <Route path="/dashboard" element={<DashBoard/>}/> 

          <Route path="/addtruck" element={<AddTruckForm/>}/>
          <Route path="/update-truck/:id" element={<UpdateTruck/>}/>
          <Route path="/submittIssue" element={<SubmitIssue/>}/>
          <Route path="/update-issue/:id" element={<UpdateCollectorIssue/>}/>

          <Route path="/request" element={<CollectionRequestForm/>}/> 
          <Route path="/request-success" element={<RequestSuccess/>}/> 
          

        <Route/> 
      </Routes>
    </BrowserRouter>
  )
}


import ItemProfile from './Pages/AdminAnalyticsComponent/ItemProfile';



import AddDetails from './Pages/AdminAnalyticsComponent/AddDetails';
import AnalyticalRepoart from './Pages/AdminAnalyticsComponent/ReportDetails';
import AdminSignIn from './Pages/AdminAnalyticsComponent/AdminSignin';
import AdminSignUp from './Pages/AdminAnalyticsComponent/AdminSignUp';

import UpdateItem from './Pages/AdminAnalyticsComponent/UpdateItem';
import AdminHeader from './admincomponents/header';






