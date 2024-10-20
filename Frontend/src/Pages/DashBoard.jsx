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
import ResolvedIssues from "./ResolvedIssues";
import DashComplain from "../Components/DashComplain";
import CollectorIssueAdmin from "./CollectorIssueAdmin";

import DashRequest from "../Components/DashRequest";
import Bindetails from "./Bindetails";
import DashAdminViewAssignedRoutes from "../Components/DashAdminViewAssignedRoutes";
import CollectionMap from "./CollectionMap";



import DashMyRequest from "../Components/DashMyRequest";




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
      {tab === 'routes' && <DashRoutes/>}
      {tab === 'reportIssue' && <DashIssueCollector/>}
      {tab === 'addtruck' && <AddTruckForm/>}
      {tab === 'trucks' && <DashTrucks/> }
      {tab === 'resolvedIssue' && <ResolvedIssues/>}
      {tab === 'complain' && <DashComplain/>}
      {tab === 'CollectorIssuesRecieved' && <CollectorIssueAdmin/>}
      {tab === 'request' && <DashRequest/>}
      {tab === 'bindetails' && <Bindetails/>}
      {tab === 'AssignedroutesAdminView' && <DashAdminViewAssignedRoutes/>}
      {tab === 'collectionmap' && <CollectionMap/>}
      {tab === 'myrequest' && <DashMyRequest/>}

      
   
     
    </div>
  )
}
