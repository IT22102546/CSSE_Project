import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './header.css';  // Ensure this points to where your CSS is stored

export default function AdminHeader() {

  return (
    <div className="nav"> 
      <div className='navbardetails'>
        <Link to='/'><h1 className='twebpagename'>Topic</h1></Link> 
   
        <ul className='other-topics'>
          <Link to='/'><li>Home</li></Link>  
          <Link to='/about'><li>About</li></Link>
          <Link to='/Adminsign-in'>
        
              <li>Sign In</li>
          
          </Link>  
        </ul>
      </div>   
    </div>
  );
}
