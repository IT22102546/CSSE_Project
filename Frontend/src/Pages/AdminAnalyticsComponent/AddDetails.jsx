import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { app } from '../../firebase';
import { useSelector } from 'react-redux';
import { getStorage, uploadBytesResumable, ref, getDownloadURL } from 'firebase/storage';
import '../Admincss/adddetails.css';

export default function AddDetails() {
  const [imagePercent, setImagePercent] = useState(0);
  const fileRef1 = useRef(null);
  const [imageError, setImageError] = useState(false);
  const [image1, setImage1] = useState(undefined);
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();


  const [formData, setFormData] = useState({
   
    type: '',
    freequency: '',
    disposal_method: '',
    quentity: '',
    area: '',
    profilePicture: '',
  });

  // Image upload handler
  useEffect(() => {
    if (image1) {
      handleFileUpload(image1, 'profilePicture');
    }
  }, [image1]);

  const handleFileUpload = async (image, field) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImagePercent(Math.round(progress));
      },
      (error) => {
        setImageError(true);
        setError('Image upload failed');
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData((prev) => ({
            ...prev,
            [field]: downloadURL,
          }));
        });
      }
    );
  };

  const handleImage1Click = () => {
    fileRef1.current.click();
  };

  // Form validation
  const validateForm = () => {
    const errors = {};

    if (!formData.type.trim()) {
      errors.type = 'Type is required';
    }
    if (!formData.freequency.trim()) {
      errors.freequency = 'freequency Code is required';
    }
    if (!formData.quentity || isNaN(formData.quentity) || formData.quentity <= 0) {
      errors.quentity = 'Quantity must be a positive integer';
    }
  
    if (!formData.area.trim()) {
      errors.area = 'Area is required';
    }
    if (!formData.profilePicture) {
      errors.profilePicture = 'Profile picture is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate form data
    if (!validateForm()) {
      return;
    }

    try {
      const res = await fetch('/api/adminauth/store', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to create item');
      }

      alert('Item added successfully');
      navigate('/items');
    } catch (error) {
      setError('Something went wrong!');
      console.log(error);
    }
  };

  return (
    <div className="add-pet-container">
      <h1 id='main-topic-form'>Add Garabage Details</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Garbage Type"
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
        />
        {formErrors.type && <p className="error">{formErrors.type}</p>}

        <input
          type="text"
          placeholder="Frequency"
          value={formData.freequency}
          onChange={(e) => setFormData({ ...formData, freequency: e.target.value })}
        />
        {formErrors.itemCode && <p className="error">{formErrors.itemCode}</p>}
        
        <input
          type="text"
          placeholder="Disposal Method"
          value={formData.disposal_method}
          onChange={(e) => setFormData({ ...formData, disposal_method: e.target.value })}
        />
        {formErrors.disposal_method && <p className="error">{formErrors.disposal_method}</p>}

        <input
          type="text"
          placeholder="Quantity"
          value={formData.quentity}
          onChange={(e) => setFormData({ ...formData, quentity: e.target.value })}
        />
        {formErrors.quentity && <p className="error">{formErrors.quentity}</p>}

        <input
          type="text"
          placeholder="Area"
          value={formData.area}
          onChange={(e) => setFormData({ ...formData, area: e.target.value })}
        />
        {formErrors.area && <p className="error">{formErrors.area}</p>}

        <div>
          <button className="upload-button"  onClick={handleImage1Click}>
            Upload Picture
          </button>
          <input
            ref={fileRef1}
            type="file"
            accept="image/*"
            onChange={(e) => setImage1(e.target.files[0])}
            hidden
          />
        </div>
        {formErrors.profilePicture && <p className="error">{formErrors.profilePicture}</p>}

        <div>
          <img
            src={formData.profilePicture || 'https://media.istockphoto.com/id/1294866141/vector/picture-reload.jpg?s=612x612&w=is&k=20&c=Ei6q4n6VkP3B0R30d1VdZ4i11CFbyaEoAFy6_WEbArE='}
            alt="Profile"
            onClick={handleImage1Click}
          />
        </div>

        <p className="upload-progress">Image Uploading: {imagePercent}%</p>

        <button id="submit-button-additem" >
          Submit
        </button>
        <Link to='/items' className='my-items-button'>
        View  Garbage Details
        </Link>
        {error && <p className="error">{error}</p>}
      </form>
 
    </div>
  );
}
