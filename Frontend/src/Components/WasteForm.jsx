import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Label, Select, FileInput } from 'flowbite-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function WasteForm() {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();
  const [date, setDate] = useState(new Date());
  const [location, setLocation] = useState(null);
  const [defaultCenter, setDefaultCenter] = useState([51.505, -0.09]); // Default center before fetching user's location

  // Function to get user location with high accuracy
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setDefaultCenter([latitude, longitude]);
          setLocation({ lat: latitude, lng: longitude });
          setValue("location", { lat: latitude, lng: longitude }); // Set initial location value
        },
        (error) => {
          console.error("Error fetching user location:", error);
        },
        {
          enableHighAccuracy: true, // Request high accuracy for location
          timeout: 10000, // 10 seconds timeout
          maximumAge: 0 // Do not use cached location
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, [setValue]);

  const onSubmit = (data) => {
    console.log(data);
  };

  const LocationPicker = () => {
    useMapEvents({
      click(e) {
        setLocation(e.latlng);
        setValue("location", e.latlng); // Update form value for location
      },
    });
    return location === null ? null : (
      <Marker position={location}></Marker>
    );
  };

  console.log(location);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto p-4 space-y-6 border rounded-md shadow-md bg-white">
      {/* Image Upload */}
      <div>
        <Label htmlFor="image" className="block mb-2">Upload Waste Location Image</Label>
        <FileInput 
          id="image" 
          {...register("image", { required: true })} 
          className="w-full"
          accept="image/*" 
        />
        {errors.image && <p className="text-red-500 text-sm mt-1">This field is required</p>}
      </div>

      {/* Waste Type */}
      <div>
        <Label htmlFor="wasteType" className="block mb-2">Waste Type</Label>
        <Select 
          id="wasteType" 
          {...register("wasteType", { required: true })}
          className="w-full">
          <option value="">Select Type</option>
          <option value="general">General Waste</option>
          <option value="recyclable">Recyclable</option>
          <option value="e-waste">E-Waste</option>
        </Select>
        {errors.wasteType && <p className="text-red-500 text-sm mt-1">This field is required</p>}
      </div>

      {/* Date Picker */}
      <div>
        <Label htmlFor="date" className="block mb-2">Select Date</Label>
        <DatePicker 
          selected={date} 
          onChange={(date) => setDate(date)} 
          className="w-full border p-2 rounded-md" 
        />
      </div>

      {/* Location Picker */}
      <div>
        <Label htmlFor="location" className="block mb-2">Select Location</Label>
        <MapContainer 
          center={defaultCenter} 
          zoom={13} 
          style={{ height: '300px', width: '100%' }}
          className="rounded-md border">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <LocationPicker />
        </MapContainer>
        {location === null && <p className="text-gray-500 text-sm mt-1">Click on the map to set the location</p>}
        <input type="hidden" {...register("location", { required: true })} />
        {errors.location && <p className="text-red-500 text-sm mt-1">This field is required</p>}
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full">Submit</Button>
    </form>
  );
}
