import {
  Avatar,
  Dropdown,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
  Navbar,
} from "flowbite-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { HiShoppingBag, HiUser, HiMenu, HiX } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { signOut } from "../redux/user/userSlice";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await fetch("/api/user/signout");
      dispatch(signOut());
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Navbar className="border-b-2 relative z-50 bg-gradient-to-r from-green-700 to-green-900 text-white p-4 rounded-b-lg shadow-lg">
      <div className="container mx-auto flex flex-wrap items-center justify-between py-4">
        <div className="flex items-center">
          <NavLink to="/" className="ml-0 md:ml-16">
            {/* <img
              src="/path/to/your/logo.png"
              alt="Logo"
              className="h-10 w-auto md:h-14"
            /> */}
            <h1 className="text-white text-2xl">Eco<span className="text-yellow-300 text-lg font-semibold">Waste</span></h1>
          </NavLink>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex items-center text-white"
          onClick={toggleMenu}
        >
          {isOpen ? (
            <HiX className="w-6 h-6" />
          ) : (
            <HiMenu className="w-6 h-6" />
          )}
        </button>

        <div
          className={`w-full md:flex md:w-auto ${isOpen ? "block" : "hidden"}`}
        >
          {/* Links */}
          <div className="flex flex-col md:flex-row md:space-x-8 mt-4 md:mt-0">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "text-yellow-300" : "text-white"
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive ? "text-yellow-300" : "text-white"
              }
            >
              About Us
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                isActive ? "text-yellow-300" : "text-white"
              }
            >
              Contact Us
            </NavLink>
            <NavLink
              to="/blogs"
              className={({ isActive }) =>
                isActive ? "text-yellow-300" : "text-white"
              }
            >
              Blogs
            </NavLink>

          </div>
        </div>

        <div className="hidden md:flex space-x-8 items-center">
          

          {currentUser ? (
            <Dropdown
              arrowIcon={false}
              inline
              label={
                <Avatar
                  alt="user"
                  img={currentUser.profilePicture}
                  rounded
                  className="h-10 w-10"
                />
              }
            >
              <DropdownHeader>
                <span className="block text-sm">{currentUser.username}</span>
                <span className="block text-sm font-medium truncate">
                  {currentUser.email}
                </span>
              </DropdownHeader>
              <Link to={"/dashboard?tab=profile"}>
                <DropdownItem>Profile</DropdownItem>
              </Link>
              <DropdownDivider />
              <DropdownItem onClick={handleSignOut}>Sign Out</DropdownItem>
            </Dropdown>
          ) : (
            <Link to="/sign-in">
              <HiUser className="text-white" />
            </Link>
          )}
        </div>
      </div>
    </Navbar>
  );
}
