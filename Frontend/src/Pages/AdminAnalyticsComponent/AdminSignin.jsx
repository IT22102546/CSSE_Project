import  { useState } from 'react'
import {useNavigate} from 'react-router-dom'
import '../Admincss/AdminLogin.css'

export default function AdminSignIn() {
  const navigate=useNavigate();
  const [formData, setFormData] = useState({
    email:"",
    password:""
  });

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Assuming validation is successful, proceed with logging in
    try {
        const response = await fetch('/api/adminauth/admin_signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: formData.email,
                password: formData.password,
            }),
        });

        const data = await response.json();
        console.log(response.status);
        if (response.ok) {
            alert(data.message); 
            navigate('/additem')// Display success message
            // Redirect to the next page or perform any other action
        } else {
            alert(data.message); // Display error message
        }
     
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
    }
};


return(
   
<div className='login-form'>
   
<form onSubmit={handleSubmit}>
<lable> Email:</lable>
<input type="text" id="email" name="email" onChange={handleOnChange}/><br></br>
<lable>Password:</lable>
<input type="text" id="password" name="password" onChange={handleOnChange}/><br></br>

 <br></br>
 <button>Log in</button>
</form>



    </div>
    
)
}

