import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSideBar from "../Components/DashSideBar";
import DashProfile from "../Components/DashProfile";
import DashUsers from "../Components/DashUsers";
import DashAssignedRoutes from "../Components/DashAssignedRoutes";
import DashResource from "../Components/DashResource";
import DashRoutes from "../Components/DashRoutes";
import DashIssueCollector from "../Components/DashIssueCollector";
import AddTruckForm from "./AddTruckForm";
import DashTrucks from "../Components/DashTrucks";

import DashRequest from "../Components/DashRequest";







export default function DashBoard() {
  const location = useLocation();
  const[tab,setTab]= useState();

  useEffect(()=>{
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if(tabFromUrl){
      setTab(tabFromUrl)
    }
  },[location.search]);
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-56">
        <DashSideBar/>
      </div>
      {tab==='profile' && <DashProfile/>}
      {tab === 'users' && <DashUsers/>}
      {tab === 'assignedRoutes' && <DashAssignedRoutes/>}
      {tab === 'resource' && <DashResource/>}
      {tab === 'route' && <DashRoutes/>}
      {tab === 'reportIssue' && <DashIssueCollector/>}
      {tab === 'addtruck' && <AddTruckForm/>}
      {tab === 'trucks' && <DashTrucks/> }

      {tab === 'request' && <DashRequest/>}

      
   
     
    </div>
  )
}
