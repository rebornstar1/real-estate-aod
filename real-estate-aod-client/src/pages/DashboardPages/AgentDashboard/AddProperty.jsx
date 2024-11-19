import HeaderText from "../../../components/HeaderText/HeaderText";
import useAuth from "../../../hooks/useAuth";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import axios from 'axios';
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { BsBuildingAdd } from "react-icons/bs";
import { useState } from "react";
import { MdAttachMoney } from "react-icons/md";
import { FaMapMarkerAlt } from "react-icons/fa";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const image_hosting_key = import.meta.env.VITE_IMAGE_API_KEY;
const cloud_name = import.meta.env.CLOUDINARY_CLOUD_NAME;
const cloudinary_api_key = import.meta.env.CLOUDINARY_API_KEY;
const cloudinary_api_secret = import.meta.env.CLOUDINARY_API_SECRET;
const google_map_key = import.meta.env.GOOGLE_MAPS_API_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const AddProperty = () => {
  const [minimum, setMinimum] = useState(0);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageLinks, setImageLinks] = useState([]);
  const [videoLinks, setVideoLinks] = useState([]);
  const [videoPreviews, setVideoPreviews] = useState([]);
  const [modalImage, setModalImage] = useState(null);
  const [modalVideo, setModalVideo] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  console.log(minimum);
  const axiosPublic = useAxiosPublic();
  const location =useLocation()
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
  } = useForm();
  const [currentLocation, setCurrentLocation] = useState("");

  // useEffect(() => {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         const { latitude, longitude } = position.coords;
  //         console.log("latitude",latitude);
  //         console.log("longitude",longitude);
  //         fetch(
  //           `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${google_map_key}`
  //         )
  //           .then((response) => response.json())
  //           .then((data) => {
  //             console.log("data",data);
  //             const location = data.results[0]?.formatted_address;
  //             setCurrentLocation(location || "Location not found");
  //           })
  //           .catch((error) => console.error("Error fetching location:", error));
  //       },
  //       (error) => console.error("Error getting location:", error)
  //     );
  //   } else {
  //     console.log("Geolocation is not supported by this browser.");
  //   }
  // }, []);

  // google maps api Key is Required for this to be implemented Perfectly

  const handleVideoChange = async (e) => {
    const file = e.target.files[0]; // Single video file

    console.log(file);

    if (file) {
      // Generate a local video preview
      const videoPreview = URL.createObjectURL(file);
      setVideoPreviews((prevPreviews) => [...prevPreviews, videoPreview]);

      // Prepare data for Cloudinary upload
      const formData = new FormData();
      formData.append("VideoPitch", file); // Attach the file
      formData.append("upload_preset", "akshay_waghmare");
      formData.append("cloud_name", cloud_name); // Replace with your Cloudinary cloud name

      try {

        // const res = await fetch('http://localhost:3000/api/v1/properties/video', {
        //   method: 'POST',
        //   body: formData, 
        // onUploadProgress: (progressEvent) => {
        //   const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        //   setUploadProgress(percentage); // Update upload progress
        // },
        // });
        // const resData = await res.json();
        // console.log(resData);

        // if (res.status === 200) {
        //   const videoUrl = resData.videoUrl; // Extract the uploaded video URL
        //   console.log(videoUrl);
        //   setVideoLinks((prevLinks) => [...prevLinks, videoUrl]); // Update state
        // }

        const res = await axios.post('http://localhost:3000/api/v1/properties/video', formData, {
          onUploadProgress: (progressEvent) => {
            const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentage); // Update upload progress
          },
        });

        // const resData = await res.json();
        // console.log("resData",resData);
  
        if (res.status === 200) {
          const videoUrl = res.data.videoUrl; // Extract the uploaded video URL
          console.log(videoUrl);
          setVideoLinks((prevLinks) => [...prevLinks, videoUrl]);  // Update state
        }

      } catch (error) {
        console.error("Video upload failed:", error);
      } finally {
        setUploadProgress(0); // Reset progress after upload
      }
    }
  };


  const removeVideo = (index) => {
    setVideoPreviews((prevPreviews) => prevPreviews.filter((_, i) => i !== index));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0]; // Get the single uploaded file

    if (file) {
      // Generate a local preview of the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prevPreviews) => [...prevPreviews, reader.result]);
      };
      reader.readAsDataURL(file);

      // Upload the image
      const imageFile = new FormData();
      imageFile.append("image", file); // Append the file to FormData

      try {
        // Replace 'axiosPublic' and 'image_hosting_api' with your actual axios instance and API URL
        const res = await axiosPublic.post(image_hosting_api, imageFile, {
          headers: {
            "content-type": "multipart/form-data",
          },
        });

        if (res.data.success) {
          const uploadedImageUrl = res.data.data.display_url; // Extract the uploaded URL
          setImageLinks((prevLinks) => [...prevLinks, uploadedImageUrl]); // Update state with the new link
        } else {
          throw new Error("Image upload failed");
        }
      } catch (error) {
        console.error("Image upload error:", error);
      }
    }
  };

  const removeImage = (index) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    const priceRange = `$${data.minPrice} - $${data.maxPrice}`;
    console.log("priceRange",priceRange);
    console.log("data",data);

    try {
      const propertyData = {
        agentImage: user?.photoURL,
        ...data,
        priceRange,
        status: "pending",
        propertyImages: imageLinks, // Store array of image URLs
        propertyVideoes : videoLinks,
      };
      console.log("PROPERTYDATA",propertyData);

      // Submit property data to backend
      // const response = await axiosPublic.post("/api/v1/properties", propertyData);

      const res = await fetch('http://localhost:3000/api/v1/properties', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(propertyData),
      });

      if (!res.ok) {
        throw new Error(`HTTP Error: ${res.status}`);
      }

      const ResData = res.json();
      console.log("ResData",ResData);

      if (ResData?.insertedId) {
        Swal.fire({
          icon: "success",
          color: "white",
          title: "New Property Added!",
          text: "The Property is under pending status!",
          showConfirmButton: false,
          timer: 4000,
          background: "#18b47b",
        });
        reset();
        navigate(location?.state || "/");
      }
    } catch (error) {
      console.error("Error uploading images or submitting property data:", error);
      toast.error("OOPS! Something went wrong");
    }
  };
  
  return (
    <section className="bg-base-200 text-neutral">
      <div>
        <HeaderText headerText="Add New Property" />
      </div>
      <div className="">
        <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 xl:col-span-6">
          <div className="max-w-xl lg:max-w-3xl">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mt-8 grid grid-cols-6 gap-6"
            >
              <div className="col-span-6">
                <label
                  htmlFor="propertyTitle"
                  className="block text-sm font-medium text-neutral"
                >
                  Property Title
                </label>

                <input
                  type="text"
                  id="propertyTitle"
                  {...register("propertyTitle", { required: true })}
                  name="propertyTitle"
                  className="mt-1 w-full border-0 rounded-md border-gray-200 focus:outline-2 px-3 bg-slate-100 focus:outline-slate-400 text-sm text-gray-700 py-3 shadow-sm"
                />
              </div>
              <div className="mx-auto">
      {/* Image Section */}
      <div className="mb-8">
        <label
          htmlFor="image"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Property Images
        </label>
        <input
          id="image"
          type="file"
          {...register("image", { required: true })}
          multiple
          accept="image/*"
          onChange={handleImageChange}
          className="block px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {imagePreviews.length > 0 && (
          <div className="mt-4 gap-2 flex flex-row">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative">
                <button
                  onClick={() => setModalImage(preview)}
                  className="focus:outline-none"
                >
                  <img
                    src={preview}
                    alt={`Property Preview ${index + 1}`}
                    className="w-48 h-32 object-cover rounded-md cursor-pointer"
                  />
                </button>
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 text-white bg-red-500 rounded-full p-1 focus:outline-none"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Modal for full-screen preview */}
        {modalImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
            <div className="relative">
              <button
                onClick={() => setModalImage(null)}
                className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full p-2 focus:outline-none"
              >
                ✕
              </button>
              <img
                src={modalImage}
                alt="Full Property Preview"
                className="max-w-full max-h-screen rounded-md"
              />
            </div>
          </div>
        )}
      </div>

      {/* Video Section */}
      <div>
        <label
          htmlFor="video"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Property Videos
        </label>
        <input
          id="video"
          type="file"
          {...register("video", { required: true })}
          multiple
          accept="video/*"
          onChange={handleVideoChange}
          className="block px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {uploadProgress > 0 && (
          <div className="mt-4">
            <p>Uploading: {uploadProgress}%</p>
            <progress
              value={uploadProgress}
              max="100"
              className="w-full h-2 bg-gray-200 rounded-lg"
            ></progress>
          </div>
        )}
        {videoPreviews.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-6">
            {videoPreviews.map((preview, index) => (
              <div key={index} className="relative">
                <button
                  onClick={() => setModalVideo(preview)}
                  className="focus:outline-none"
                >
                  <video
                    src={preview}
                    controls
                    className="w-48 h-32 object-cover rounded-md cursor-pointer"
                  />
                </button>
                <button
                  onClick={() => removeVideo(index)}
                  className="absolute top-2 right-2 text-white bg-red-500 rounded-full p-1 focus:outline-none"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Modal for full-screen video preview */}
        {modalVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
            <div className="relative">
              <button
                onClick={() => setModalVideo(null)}
                className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full p-2 focus:outline-none"
              >
                ✕
              </button>
              <video
                src={modalVideo}
                controls
                className="max-w-full max-h-screen rounded-md"
              />
            </div>
          </div>
        )}
      </div>
    </div>

              <div className="col-span-6">
                <label
                  htmlFor="propertyDetails"
                  className="block text-sm font-medium text-neutral"
                >
                  Property Details
                </label>

                <textarea
                  type="text"
                  id="propertyDetails"
                  {...register("propertyDetails", { required: true })}
                  name="propertyDetails"
                  className="mt-1 w-full border-0 rounded-md border-gray-200 focus:outline-2 px-3 bg-slate-100 focus:outline-slate-400 text-sm  py-3 shadow-sm text-gray-700"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="minPrice"
                  className=" text-sm font-medium flex items-center text-neutral"
                >
                  <MdAttachMoney className="inline" /> Min Price Range
                </label>

                <input
                  type="number"
                  id="minPrice"
                  onBlurCapture={(e) => setMinimum(e.target.value)}
                  name="minPrice"
                  min={100}
                  {...register("minPrice", { required: true ,valueAsNumber:true})}
                  className="mt-1 w-full border-0 rounded-md border-gray-200 focus:outline-2 px-3 bg-slate-100 focus:outline-slate-400 text-sm text-gray-700 py-3 shadow-sm"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="maxPrice"
                  className=" text-sm font-medium flex items-center text-neutral"
                >
                  <MdAttachMoney className="inline text-xl" /> Max Price Range
                </label>

                <input
                  type="number"
                  id="maxPrice"
                  min={minimum}
                  name="maxPrice"
                  {...register("maxPrice", { required: true ,valueAsNumber:true})}
                  className="mt-1 w-full border-0 rounded-md border-gray-200 focus:outline-2 px-3 bg-slate-100 focus:outline-slate-400 text-sm text-gray-700 py-3 shadow-sm"
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="propertyLocation"
                  className="block text-sm font-medium text-neutral"
                >
                  <FaMapMarkerAlt className="inline" /> Property Location
                </label>

                <input
                  type="text"
                  id="propertyLocation"
                  name="propertyLocation"
                  {...register("propertyLocation", { required: true })}
                  className="mt-1 w-full border-0 rounded-md border-gray-200 focus:outline-2 px-3 bg-slate-100 focus:outline-slate-400 text-sm text-gray-700 py-3 shadow-sm"
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="size"
                  className="block text-sm font-medium text-neutral"
                >
                  Size (sqft)
                </label>

                <input
                  type="number"
                  min={500}
                  placeholder={">500"}
                  id="size"
                  name="size"
                  {...register("size", { required: true ,valueAsNumber:true})}
                  className="mt-1 w-full border-0 rounded-md border-gray-200 focus:outline-2 px-3 bg-slate-100 focus:outline-slate-400 text-sm text-gray-700 py-3 shadow-sm"
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="rooms"
                  className="block text-sm font-medium text-neutral"
                >
                  Rooms
                </label>

                <input
                  type="number"
                  id="rooms"
                  name="rooms"
                  min={1}
                  max={20}
                  placeholder="1-20"
                  {...register("rooms", { required: true,valueAsNumber:true })}
                  className="mt-1 w-full border-0 rounded-md border-gray-200 focus:outline-2 px-3 bg-slate-100 focus:outline-slate-400 text-sm text-gray-700 py-3 shadow-sm"
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="parking"
                  className="block text-sm font-medium text-neutral"
                >
                  Parking
                </label>

                <input
                  type="number"
                  min={0}
                  max={10}
                  placeholder={"0-10"}
                  id="parking"
                  name="parking"
                  {...register("parking", { required: true ,valueAsNumber:true})}
                  className="mt-1 w-full border-0 rounded-md border-gray-200 focus:outline-2 px-3 bg-slate-100 focus:outline-slate-400 text-sm text-neutral py-3 shadow-sm"
                />
              </div>
              {loading ? (
                <span className="loading loading-spinner text-primary loading-md"></span>
              ) : (
                <>
                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="agentName"
                      className="block text-sm font-medium text-neutral"
                    >
                      Agent Name
                    </label>

                    <input
                      type="text"
                      id="agentName"
                      value={user?.displayName}
                      name="agentName"
                      {...register("agentName", { required: true })}
                      className="mt-1 w-full border-0 rounded-md border-gray-200 focus:outline-2 px-3 bg-slate-100 focus:outline-slate-400 text-sm text-neutral py-3 shadow-sm"
                    />
                  </div>
                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="agentEmail"
                      className="block text-sm font-medium text-neutral"
                    >
                      Agent Email
                    </label>

                    <input
                      type="email"
                      id="agentEmail"
                      name="agentEmail"
                      value={user?.email}
                      {...register("agentEmail", { required: true })}
                      className="mt-1 w-full border-0 rounded-md border-gray-200 focus:outline-2 px-3 bg-slate-100 focus:outline-slate-400 text-sm text-neutral py-3 shadow-sm"
                    />
                  </div>
                </>
              )}

              <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                <button
                  type="submit"
                  className="inline-block shrink-0 rounded-md border border-secondary bg-secondary px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-secondary focus:outline-none focus:ring active:text-secondary"
                >
                  <BsBuildingAdd className="inline text-lg mr-2" /> Add Property
                </button>
              </div>
            </form>
            <div className="my-10"></div>
          </div>
        </main>
      </div>
    </section>
  );
};

export default AddProperty;
