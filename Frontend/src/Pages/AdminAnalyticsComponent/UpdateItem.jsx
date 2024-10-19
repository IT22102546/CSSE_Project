import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../Admincss/updateitem.css';
import { app } from '../../firebase';
import { getStorage, uploadBytesResumable, ref, getDownloadURL } from 'firebase/storage';

function UpdateItem() {
  const [imagePercent, setImagePercent] = useState(0);
  const navigate = useNavigate();
  const { id } = useParams();
  const fileRef1 = useRef(null);

  const [image1, setImage1] = useState(undefined);
  const [updatediscount, setupdatediscount] = useState({
    type: '',
    freequency: '',
    disposal_method: '',
    quentity: '',
    area: '',
    profilePicture: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        console.error('Image upload failed:', error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setupdatediscount((prev) => ({
            ...prev,
            [field]: downloadURL,
          }));
        });
      }
    );
  };

  const handleImage1Click = () => {
    if (fileRef1.current) {
      fileRef1.current.click();
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/adminuser/getitem/${id}`);
        const data = await response.json();

        if (data.success) {
          setupdatediscount(data.data);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [id]);

  const handleInputChange = (e) => {
    setupdatediscount({
      ...updatediscount,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    let errors = {};

    if (!updatediscount.type.trim()) {
      errors.type = "Order ID is required";
    }
    if (!updatediscount.freequency.trim()) {
      errors.freequency = "freequency Code is required";
    }
    if (!updatediscount.quentity.trim() || isNaN(updatediscount.quentity) || Number(updatediscount.quentity) <= 0) {
      errors.quentity = "Valid quantity is required";
    }
    if (!updatediscount.disposal_method.trim()) {
      errors.disposal_method = "disposal_method is required";
    }
    if (!updatediscount.area.trim()) {
      errors.area = "area is required";
    }
    
   

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleUpdate = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/adminuser/updateitem`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: updatediscount._id,
          ...updatediscount,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Updated successfully");
        navigate('/items');
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('Error updating user:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="service-update">
      <select  value={updatediscount.type}  name="type"    onChange={handleInputChange}>
      <option>Organic Waste</option>
          <option>Plastic</option>
          <option>Paper</option>
          <option>Metal</option>
          <option>Glass</option>
          <option>Electronic Waste</option>
          <option>Hazardous Waste</option>
          <option>Textile Waste</option>
          <option>Electronic Waste</option>
          <option>Construction Debris</option>
          <option>Medical Waste</option>
         
        </select>
      {/* <input
        type="text"
        placeholder="Garbage Type"
        name="type"
        onChange={handleInputChange}
        value={updatediscount.type}
      /> */}
      {formErrors.type && <p className="error">{formErrors.type}</p>}

      <input
      type="text"
      placeholder="Frequency"
      name="freequency"
      onChange={handleInputChange}
      value={updatediscount.freequency}
      />
      {formErrors.freequency && <p className="error">{formErrors.freequency}</p>}

      <input
        type="text"
        placeholder="Quantity"
        name="quentity"
        onChange={handleInputChange}
        value={updatediscount.quentity}
      />
      <br></br>
      {formErrors.quentity && <p className="error">{formErrors.quentity}</p>}
      <select  onChange={handleInputChange}  name="disposal_method" >
          <option>Recycling</option>
          <option>Composting</option>
          <option>Landfill</option>
          <option>Incineration</option>
          <option>Glass</option>
          <option>Reuse</option>
          <option>Special Disposal (for hazardous or medical waste)</option>
         
        </select>
      {/* <input
       type="text"
       placeholder="Disposal Method"
       name="disposal_method"
      onChange={handleInputChange}
      value={updatediscount.disposal_method}
      /> */}
      {formErrors.disposal_method && <p className="error">{formErrors.disposal_method}</p>}
<br></br><br></br>
      <select  value={updatediscount.area}  name="area"   onChange={handleInputChange}>
          <option>Residential</option>
          <option>Commercial</option>
          <option>Industrial</option>
          <option>Public Spaces</option>
          <option>Construction Site</option>
          <option>Medical Facility</option>
          <option>Educational Institution</option>
         
        </select>
      {/* <input
          type="text"
          placeholder="Area"
          name="area"
        onChange={handleInputChange}
        value={updatediscount.area}
      /> */}
      {formErrors.area && <p className="error">{formErrors.area}</p>}
      <br></br><br></br>
      
      <div className="flex justify-center items-center gap-4">
        <button
          type="button"
          onClick={handleImage1Click}
          className="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Update Picture
        </button>
      </div>

      <input
        type="file"
        ref={fileRef1}
        onChange={(e) => setImage1(e.target.files[0])}
        style={{ display: 'none' }}
      />

      <div className="flex justify-center items-center gap-4">
        <img
          src={
            updatediscount.profilePicture ||
            'https://media.istockphoto.com/id/1294866141/vector/picture-reload.jpg?s=612x612&w=is&k=20&c=Ei6q4n6VkP3B0R30d1VdZ4i11CFbyaEoAFy6_WEbArE='
          }
          alt="Profile"
          className="h-12 w-12 rounded-full object-cover border border-gray-300"
        />
      </div>

      {imagePercent > 0 && <p>Uploading: {imagePercent}%</p>}

      <button
        type="submit"
        id="btn-update"
        onClick={handleUpdate}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Updating...' : 'Update'}
      </button>
    </div>
  );
}

export default UpdateItem;
