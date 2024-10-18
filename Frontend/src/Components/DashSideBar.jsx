import { Sidebar } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiArchive, HiArrowSmRight, HiGift, HiLink, HiOutlineArrowsExpand, HiOutlineCollection, HiOutlineFolder, HiOutlineQuestionMarkCircle, HiOutlineTerminal, HiOutlineUserGroup, HiUser} from 'react-icons/hi';
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { signOut } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";


export default function DashSideBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentUser } = useSelector(state => state.user);
  const location = useLocation();
  const [tab, setTab] = useState();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  const handleSignOut = async () => {
    try {
      await fetch('/api/user/signout');
      dispatch(signOut());
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Link to='/dashboard?tab=profile' key="profile">
            <Sidebar.Item 
              active={tab === 'profile'} 
              icon={HiUser} 
              label={currentUser?.isAdmin ? 'Admin' : 'Collector'} 
              labelColor='dark'
              as='div'
            >
              Profile
            </Sidebar.Item>
          </Link>

          {currentUser?.isAdmin && (
            <>
              <Link to='/dashboard?tab=users' key="users">
                <Sidebar.Item
                  active={tab === 'users'}
                  icon={HiOutlineUserGroup}
                  as='div'
                >
                  Users
                </Sidebar.Item>
              </Link>

              <Link to='/dashboard?tab=routes' key="routes">
                <Sidebar.Item
                  active={tab === 'routes'}
                  icon={HiLink}
                  as='div'
                >
                  Route Manage
                </Sidebar.Item>
              </Link>

              <Link to='/dashboard?tab=resource' key="resource">
                <Sidebar.Item
                  active={tab === 'resource'}
                  icon={HiOutlineFolder}
                  as='div'
                >
                  Resource Manage
                </Sidebar.Item>
              </Link>

             
            </>
          )}

          {currentUser?.isCollector && (
            <>
              <Link to='/dashboard?tab=assignedRoutes' key="assignedRoutes">
                <Sidebar.Item
                  active={tab === 'assignedRoutes'}
                  icon={HiOutlineCollection}
                  as='div'
                >
                  Assigned Routes
                </Sidebar.Item>
              </Link>

              <Link to='/dashboard?tab=reportIssue' key="reportIssue">
                <Sidebar.Item
                  active={tab === 'reportIssue'}
                  icon={HiOutlineQuestionMarkCircle}
                  as='div'
                >
                  Report Issue
                </Sidebar.Item>
              </Link>


             
            </>
          )}


              
             

              
          <Sidebar.Item 
            icon={HiArrowSmRight} 
            className="cursor-pointer" 
            onClick={handleSignOut}
            key="signout"
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
