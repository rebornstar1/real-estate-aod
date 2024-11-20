import HeaderText from "../../../components/HeaderText/HeaderText";
import useAuth from "../../../hooks/useAuth";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import axios from 'axios';
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { BsBuildingAdd } from "react-icons/bs";
import { useRef } from "react";
import { useState } from "react";
import { MdAttachMoney } from "react-icons/md";
import { FaMapMarkerAlt, FaMapSigns, FaCouch, FaHome, FaKey, FaEnvelope, FaUser, FaCar, FaBed,FaRulerCombined, FaInfoCircle, FaVideo, FaImage } from "react-icons/fa";
import { FaPlus } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Check } from 'lucide-react'
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import e from "cors";

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
  const [selectedOptions, setSelectedOptions] = useState([])
  const [addingCustom, setAddingCustom] = useState(false)
  const [customOption, setCustomOption] = useState('')
  const [flooringOptions, setFlooringOptions] = useState(['Vitrified', 'Marble', 'Granite', 'Wooden'])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isDropdownOpenF, setIsDropdownOpenF] = useState(false)
  const [selectedOwnership, setSelectedOwnership] = useState(null)
  const [selectedOwnershipF, setSelectedOwnershipF] = useState(null)
  const [isDropdownLoading, setIsDropdownLoading] = useState(false)
  const [isDropdownLoadingF, setIsDropdownLoadingF] = useState(false)
  const [isFurnishingDropdownOpen, setIsFurnishingDropdownOpen] = useState(false)
  const [selectedFurnishingOption, setSelectedFurnishingOption] = useState(null)
  const [isFurnishingDropdownLoading, setIsFurnishingDropdownLoading] = useState(false)
  const furnishingDropdownRef = useRef(null)
  const dropdownContainerRef = useRef(null);
  const dropdownContainerRefF = useRef(null);


  const optionsList = [
    { value: 'freehold', label: 'Freehold' },
    { value: 'leasehold', label: 'Leasehold' },
    { value: 'cooperative', label: 'Cooperative Housing Society' },
  ]

  const furnishingOptions = [
    { value: 'semi-furnished', label: 'Semi-Furnished' },
    { value: 'furnished', label: 'Furnished' },
    { value: 'unfurnished', label: 'Unfurnished' },
  ]

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownContainerRef.current && !dropdownContainerRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
        setIsFurnishingDropdownOpen(false)
      }
    }
  
    document.addEventListener('mousedown', handleOutsideClick)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [])
  
  const handleDropdownToggle = () => {
    if (!isDropdownOpen) {
      setIsDropdownLoading(true)
      setTimeout(() => {
        setIsDropdownLoading(false)
        setIsDropdownOpen(true)
      }, 500)
    } else {
      setIsDropdownOpen(false)
    }
  }

  const handleDropdownToggleF = () => {
    if (!isDropdownOpenF) {
      setIsDropdownLoadingF(true)
      setTimeout(() => {
        setIsDropdownLoadingF(false)
        setIsDropdownOpenF(true)
      }, 500)
    } else {
      setIsDropdownOpenF(false)
    }
  }
  
  const handleOwnershipSelect = (option) => {
    setSelectedOwnership(option)
    setIsDropdownOpen(false)
  }

  const handleOwnershipSelectF = (option) => {
    setSelectedOwnershipF(option)
    setIsDropdownOpenF(false)
  }

  const toggleFurnishingDropdown = (e) => {
    console.log("toggleFurnishing is called");
    // e.preventDefault();
    if(!isFurnishingDropdownOpen) {
      setIsFurnishingDropdownLoading(true)
      setTimeout(() => {
        setIsFurnishingDropdownLoading(false)
        setIsFurnishingDropdownOpen(true);
      }, 500)
    }
    else
    {
      setIsFurnishingDropdownOpen(false);
    }
  }

  const handleFurnishingOptionSelect = (option) => {
    setSelectedFurnishingOption(option)
    setIsFurnishingDropdownOpen(false)
  }
 
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

  const [youtubeUrl, setYouTubeUrl] = useState("");

  const [agentEmailValue, setAgentEmailValue] = useState(user?.email || '')
  const [isAgentEmailFocused, setIsAgentEmailFocused] = useState(false)

  const [propertyLocationValue, setPropertyLocationValue] = useState('')
  const [isPropertyLocationFocused, setIsPropertyLocationFocused] = useState(false)

  const [sizeValue, setSizeValue] = useState('')
  const [isSizeFocused, setIsSizeFocused] = useState(false)

  const [maxPriceValue, setMaxPriceValue] = useState('')
  const [isMaxPriceFocused, setIsMaxPriceFocused] = useState(false)

  const [minPriceValue, setMinPriceValue] = useState('')
  const [isMinPriceFocused, setIsMinPriceFocused] = useState(false)

  const [propertyDetailsValue, setPropertyDetailsValue] = useState('')
  const [isPropertyDetailsFocused, setIsPropertyDetailsFocused] = useState(false)

  const [isImageFocused, setIsImageFocused] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);

  const handleImageFocus = () => {
    setIsImageFocused(true);
  };

  const handleImageBlur = () => {
    setIsImageFocused(false);
  };

  const handleDetailsFocus = () => {
    setIsPropertyDetailsFocused(true)
  }

  const handleDetailsBlur = () => {
    setIsPropertyDetailsFocused(false)
  }

  const handleMinPriceFocus = () => {
    setIsMinPriceFocused(true)
  }

  const handleMinPriceBlur = (e) => {
    setIsMinPriceFocused(false)
    setMinimum(e.target.value)
  }

  const handleMaxPriceFocus = () => {
    setIsMaxPriceFocused(true)
  }

  const handleMaxPriceBlur = () => {
    setIsMaxPriceFocused(false)
  }

  const handleSizeFocus = () => {
    setIsSizeFocused(true)
  }

  const handleSizeBlur = () => {
    setIsSizeFocused(false)
  }

  const handleLocationFocus = () => {
    setIsPropertyLocationFocused(true)
  }

  const handleLocationBlur = () => {
    setIsPropertyLocationFocused(false)
  }

  const handleEmailFocus = () => {
    setIsAgentEmailFocused(true)
  }

  const handleEmailBlur = () => {
    setIsAgentEmailFocused(false)
  }

  const handleYouTubeChange = (e) => {
    setYouTubeUrl(e.target.value);
  };

  const [roomsValue, setRoomsValue] = useState('')
  const [isRoomsFocused, setIsRoomsFocused] = useState(false)

  const handleRoomsFocus = () => {
    setIsRoomsFocused(true)
  }

  const handleRoomsBlur = () => {
    setIsRoomsFocused(false)
  }

  const [agentNameValue, setAgentNameValue] = useState(user?.displayName || '')
  const [isAgentNameFocused, setIsAgentNameFocused] = useState(false)

  const [isVideoFocused, setIsVideoFocused] = useState(false);
  const [videoFiles, setVideoFiles] = useState([]);

  const handleVideoFocus = () => {
    setIsVideoFocused(true);
  };

  const handleVideoBlur = () => {
    setIsVideoFocused(false);
  };

  const handleNameFocus = () => {
    setIsAgentNameFocused(true)
  }

  const handleNameBlur = () => {
    setIsAgentNameFocused(false)
  }

  const getYouTubeId = (url) => {
    const regExp = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : "";
  };

  const [parkingValue, setParkingValue] = useState('')
  const [isParkingFocused, setIsParkingFocused] = useState(false)

  const [isYouTubeFocused, setIsYouTubeFocused] = useState(false);

  const [isTitleFocused, setIsTitleFocused] = useState(false);

  const handleTitleFocus = () => setIsTitleFocused(true);
  const handleTitleBlur = () => setIsTitleFocused(false);

const handleYouTubeFocus = () => {
  setIsYouTubeFocused(true);
};

const handleYouTubeBlur = () => {
  setIsYouTubeFocused(false);
};

  const handleParkingFocus = () => {
    setIsParkingFocused(true)
  }

  const handleParkingBlur = () => {
    setIsParkingFocused(false)
  }

  const toggleOption = (option) => {
    setSelectedOptions(prev =>
      prev.includes(option) ? prev.filter(item => item !== option) : [...prev, option]
    )
  }

  const addCustomOption = () => {
    if (customOption && !flooringOptions.includes(customOption)) {
      setFlooringOptions(prev => [...prev, customOption])
      setSelectedOptions(prev => [...prev, customOption])
      setCustomOption('')
      setAddingCustom(false)
    }
  }

  const handleCustomInputChange = (e) => {
    setCustomOption(e.target.value);
  };
  
  

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
        furnishing : selectedOwnershipF,
        ownership : selectedOwnership,
        options : selectedOptions
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
        <main className="flex items-center justify-center px-2 py-8 md:py-16 sm:px-12 rounded-2xl lg:col-span-7 xl:col-span-6">
          <div className="max-w-xl lg:max-w-3xl">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mt-8 grid grid-cols-6 gap-6"
            >
              <div className="col-span-6 p-6 bg-blue-50 rounded-lg shadow-md">
        <label
          htmlFor="propertyTitle"
          className={`text-lg font-medium mb-4 transition-colors flex items-center ${
            isTitleFocused ? 'text-blue-800' : 'text-gray-800'
          }`}
        >
          Property Title
        </label>

        <input
          type="text"
          id="propertyTitle"
          name="propertyTitle"
          className={`mt-1 w-full px-3 py-3 text-sm text-gray-700 bg-slate-100 rounded-md border-0 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50
            ${isTitleFocused ? 'ring-2 ring-blue-400' : 'hover:ring-2 hover:ring-gray-300'}`}
          onFocus={handleTitleFocus}
          onBlur={handleTitleBlur}
          placeholder="Enter property title"
          {...register("propertyTitle", { required: true })}
        />
      </div>

      {/* Image Section */}
          <div className="col-span-6 p-6 bg-blue-50 rounded-lg shadow-md">
          <label
            htmlFor="image"
            className={`text-lg font-medium mb-4 transition-colors flex items-center ${
              isImageFocused ? 'text-blue-800' : 'text-gray-800'
            }`}
          >
            <FaImage className="inline text-xl mr-2 text-blue-500" />
            Property Images
          </label>

            <input
              id="image"
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              onFocus={handleImageFocus}
              onBlur={handleImageBlur}
              className={`block px-4 py-3 text-gray-700 text-sm rounded-md shadow-sm border-0 bg-white resize-none transition-all duration-300 ease-in-out
                ${
                  isImageFocused
                    ? 'ring-2 ring-blue-400'
                    : 'hover:ring-2 hover:ring-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100`}
            />
            <span
              className={`absolute inset-y-0 right-3 flex items-center pointer-events-none transition-transform duration-300 ${
                isImageFocused ? 'text-blue-400' : 'text-gray-400'
              }`}
            >
              🖼️
            </span>
          
          

          {imageFiles.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-700">Selected Images:</p>
              <ul className="list-disc pl-5 text-sm text-gray-700">
                {imageFiles.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            </div>
          )}
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
      <div className="col-span-6 p-6 bg-blue-50 rounded-lg shadow-md">
      <label
        htmlFor="video"
        className={`text-lg font-medium mb-4 transition-colors flex items-center ${
          isVideoFocused ? 'text-blue-800' : 'text-gray-800'
        }`}
      >
        <FaVideo className="inline text-xl mr-2 text-blue-500" />
        Property Videos
      </label>

        <input
          id="video"
          type="file"
          multiple
          accept="video/*"
          onChange={handleVideoChange}
          onFocus={handleVideoFocus}
          onBlur={handleVideoBlur}
          className={`block px-4 py-3 text-gray-700 text-sm rounded-md shadow-sm border-0 bg-white resize-none transition-all duration-300 ease-in-out
            ${
              isVideoFocused
                ? 'ring-2 ring-blue-400'
                : 'hover:ring-2 hover:ring-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-blue-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100`}
        />
        <span
          className={`absolute inset-y-0 right-3 flex items-center pointer-events-none transition-transform duration-300 ${
            isVideoFocused ? 'text-blue-400' : 'text-gray-400'
          }`}
        >
          🎥
        </span>

      {videoFiles.length > 0 && (
        <div className="mt-4">
          <p className="text-sm text-gray-700">Selected Videos:</p>
          <ul className="list-disc pl-5 text-sm text-gray-700">
            {videoFiles.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}

       

        
          <label
            htmlFor="youtube"
            className={`text-lg font-medium my-4 transition-colors flex items-center ${
              isYouTubeFocused ? 'text-blue-800' : 'text-gray-800'
            }`}
          >
            <FaInfoCircle className="inline text-xl mr-2 text-blue-500" />
            YouTube Video Link
          </label>

            <input
              id="youtube"
              type="url"
              placeholder="Enter YouTube video URL"
              {...register('Youtube', { required: true })}
             //  value={youtubeUrl} // Make sure to track the YouTube URL value
              onFocus={handleYouTubeFocus}
              onBlur={handleYouTubeBlur}
             // onChange={(e) => 
              //   {
              //     e.preventDefault()
              //     setYouTubeUrl(e.target.value)
              // }
            // } // Update state on input change
              className={`mt-1 w-full px-4 py-3 text-gray-700 text-sm rounded-md shadow-sm border-0 bg-white transition-all duration-300 ease-in-out
                ${
                  isYouTubeFocused
                    ? 'ring-2 ring-blue-400'
                    : 'hover:ring-2 hover:ring-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-400`}
            />
            <span
              className={`absolute inset-y-0 right-3 flex items-center pointer-events-none transition-transform duration-300 ${
                isYouTubeFocused ? 'text-blue-400' : 'text-gray-400'
              }`}
            >
              🔗
            </span>
     

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

      {youtubeUrl && (
    <div className="mt-4">
      <p>YouTube Video Preview:</p>
      <iframe
        width="320"
        height="180"
        src={`https://www.youtube.com/embed/${getYouTubeId(youtubeUrl)}`}
        title="YouTube video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-48 h-32 rounded-md"
      ></iframe>
    </div>
  )}

    <div className="col-span-6 p-6 bg-blue-50 rounded-lg shadow-md">
      <label
        htmlFor="propertyDetails"
        className={`text-lg font-medium mb-4 transition-colors flex items-center ${
          isPropertyDetailsFocused ? 'text-blue-800' : 'text-gray-800'
        }`}
      >
        <FaInfoCircle className="inline text-xl mr-2 text-blue-500" />
        Property Details
      </label>

        <textarea
          type = "text"
          id="propertyDetails"
          name="propertyDetails"
          placeholder="Enter details about the property..."
          // value={propertyDetailsValue}
          {...register('propertyDetails', { required: true })}
          onFocus={handleDetailsFocus}
          onBlur={handleDetailsBlur}
          // onChange={(e) => setPropertyDetailsValue(e.target.value)}
          className={`mt-1 w-full px-4 py-3 text-gray-700 text-sm rounded-md shadow-sm border-0 bg-white resize-none transition-all duration-300 ease-in-out
            ${
              isPropertyDetailsFocused
                ? 'ring-2 ring-blue-400'
                : 'hover:ring-2 hover:ring-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-blue-400`}
          rows="4"
        ></textarea>
        <span
          className={`absolute inset-y-0 right-3 flex items-center pointer-events-none transition-transform duration-300 ${
            isPropertyDetailsFocused ? 'text-blue-400' : 'text-gray-400'
          }`}
        >
          📝
        </span>
    </div>

              <div className="col-span-6 sm:col-span-3 p-6 bg-blue-50 rounded-lg shadow-md">
                <label
                  htmlFor="minPrice"
                  className={`text-lg font-medium mb-4 transition-colors flex items-center ${
                    isMinPriceFocused ? 'text-blue-800' : 'text-gray-800'
                  }`}
                >
                  <MdAttachMoney className="inline text-xl mr-2 text-blue-500" />
                  Min Price Range
                </label>

                <div className="relative">
                  <input
                    type="number"
                    id="minPrice"
                    name="minPrice"
                    placeholder="> 100"
                    min={100}
                    // value={minPriceValue}
                    {...register('minPrice', { required: true, valueAsNumber: true })}
                    onFocus={handleMinPriceFocus}
                    onBlur={handleMinPriceBlur}
                    // onChange={(e) => setMinPriceValue(e.target.value)}
                    className={`mt-1 w-full px-4 py-3 text-gray-700 text-sm rounded-md shadow-sm border-0 bg-white transition-all duration-300 ease-in-out
                      ${
                        isMinPriceFocused
                          ? 'ring-2 ring-blue-400'
                          : 'hover:ring-2 hover:ring-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-blue-400`}
                  />
                  
                </div>
              </div>

              <div className="col-span-6 sm:col-span-3 p-6 bg-blue-50 rounded-lg shadow-md">
                <label
                  htmlFor="maxPrice"
                  className={`text-lg font-medium mb-4 transition-colors flex items-center ${
                    isMaxPriceFocused ? 'text-blue-800' : 'text-gray-800'
                  }`}
                >
                  <MdAttachMoney className="inline text-xl mr-2 text-blue-500" />
                  Max Price Range
                </label>

                <div className="relative">
                  <input
                    type="number"
                    id="maxPrice"
                    name="maxPrice"
                    placeholder={`> ${minimum}`}
                    {...register('maxPrice', { required: true, valueAsNumber: true })}
                    // value={maxPriceValue}
                    onFocus={handleMaxPriceFocus}
                    onBlur={handleMaxPriceBlur}
                    // onChange={(e) => setMaxPriceValue(e.target.value)}
                    min={minimum}
                    className={`mt-1 w-full px-4 py-3 text-gray-700 text-sm rounded-md shadow-sm border-0 bg-white transition-all duration-300 ease-in-out
                      ${
                        isMaxPriceFocused
                          ? 'ring-2 ring-blue-400'
                          : 'hover:ring-2 hover:ring-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-blue-400`}
                  />
                  
                </div>
              </div>
              <div className="col-span-6 sm:col-span-3 p-6 bg-blue-50 rounded-lg shadow-md">
                <label
                  htmlFor="propertyLocation"
                  className={`text-lg font-medium mb-4 transition-colors flex items-center ${
                    isPropertyLocationFocused ? 'text-blue-800' : 'text-gray-800'
                  }`}
                >
                  <FaMapMarkerAlt className="inline text-xl mr-2 text-blue-500" />
                  Property Location
                </label>

                <div className="relative">
                  <input
                    type="text"
                    id="propertyLocation"
                    name="propertyLocation"
                    {...register('propertyLocation', { required: true })}
                    // value={propertyLocationValue}
                    onFocus={handleLocationFocus}
                    onBlur={handleLocationBlur}
                    // onChange={(e) => setPropertyLocationValue(e.target.value)}
                    className={`mt-1 w-full px-4 py-3 text-gray-700 text-sm rounded-md shadow-sm border-0 bg-white transition-all duration-300 ease-in-out
                      ${
                        isPropertyLocationFocused
                          ? 'ring-2 ring-blue-400'
                          : 'hover:ring-2 hover:ring-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-blue-400`}
                  />
                  
                </div>
              </div>
              <div className="col-span-6 sm:col-span-3 p-6 bg-blue-50 rounded-lg shadow-md">
                  <label
                    htmlFor="size"
                    className={`text-lg font-medium mb-4 transition-colors flex items-center ${
                      isSizeFocused ? 'text-blue-800' : 'text-gray-800'
                    }`}
                  >
                    <FaRulerCombined className="inline text-xl mr-2 text-blue-500" />
                    Size (sqft)
                  </label>

                  <div className="relative">
                    <input
                      type="number"
                      id="size"
                      name="size"
                      placeholder=">500"
                      {...register('size', { required: true, valueAsNumber: true })}
                      // value={sizeValue}
                      onFocus={handleSizeFocus}
                      onBlur={handleSizeBlur}
                      // onChange={(e) => setSizeValue(e.target.value)}
                      min={500}
                      className={`mt-1 w-full px-4 py-3 text-gray-700 text-sm rounded-md shadow-sm border-0 bg-white transition-all duration-300 ease-in-out
                        ${
                          isSizeFocused
                            ? 'ring-2 ring-blue-400'
                            : 'hover:ring-2 hover:ring-gray-300'
                        } focus:outline-none focus:ring-2 focus:ring-blue-400`}
                    />
                    <span
                      className={`absolute inset-y-0 right-3 flex items-center pointer-events-none transition-transform duration-300 ${
                        isSizeFocused ? 'text-blue-400' : 'text-gray-400'
                      }`}
                    >
                      📐
                    </span>
                  </div>
                </div>
              <div className="col-span-6 sm:col-span-3 p-6 bg-blue-50 rounded-lg shadow-md">
                <label
                  htmlFor="rooms"
                  className={`text-lg font-medium mb-4 transition-colors flex items-center ${
                    isRoomsFocused ? 'text-blue-800' : 'text-gray-800'
                  }`}
                >
                  <FaBed className="inline text-xl mr-2 text-blue-500" />
                  Rooms
                </label>

                <div className="relative">
                  <input
                    type="number"
                    id="rooms"
                    name="rooms"
                    min={1}
                    max={20}
                    placeholder="1-20"
                    {...register('rooms', { required: true, valueAsNumber: true })}
                    // value={roomsValue}
                    onFocus={handleRoomsFocus}
                    onBlur={handleRoomsBlur}
                    // onChange={(e) => setRoomsValue(e.target.value)}
                    className={`mt-1 w-full px-4 py-3 text-gray-700 text-sm rounded-md shadow-sm border-0 bg-white transition-all duration-300 ease-in-out
                      ${
                        isRoomsFocused
                          ? 'ring-2 ring-blue-400'
                          : 'hover:ring-2 hover:ring-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-blue-400`}
                  />
                </div>
              </div>
              <div className="col-span-6 sm:col-span-3 p-6 bg-blue-50 rounded-lg shadow-md">
                <label
                  htmlFor="parking"
                  className={`text-lg font-medium mb-4 transition-colors flex items-center ${
                    isParkingFocused ? 'text-blue-800' : 'text-gray-800'
                  }`}
                >
                  <FaCar className="inline text-xl mr-2 text-blue-500" />
                  Parking
                </label>

                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    max={10}
                    placeholder="0-10"
                    id="parking"
                    name="parking"
                    {...register('parking', { required: true, valueAsNumber: true })}
                    // value={parkingValue}
                    onFocus={handleParkingFocus}
                    onBlur={handleParkingBlur}
                    // onChange={(e) => setParkingValue(e.target.value)}
                    className={`mt-1 w-full px-4 py-3 text-gray-700 text-sm rounded-md shadow-sm border-0 bg-white transition-all duration-300 ease-in-out
                      ${
                        isParkingFocused
                          ? 'ring-2 ring-blue-400'
                          : 'hover:ring-2 hover:ring-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-blue-400`}
                  />
                </div>
              </div>
              {loading ? (
                <span className="loading loading-spinner text-primary loading-md"></span>
              ) : (
                <>
                  <div className="col-span-6 sm:col-span-3 p-6 bg-blue-50 rounded-lg shadow-md">
                    <label
                      htmlFor="agentName"
                      className={`text-lg font-medium mb-4 transition-colors flex items-center ${
                        isAgentNameFocused ? 'text-blue-800' : 'text-gray-800'
                      }`}
                    >
                      <FaUser className="inline text-xl mr-2 text-blue-500" />
                      Agent Name
                    </label>

                    <div className="relative">
                      <input
                        type="text"
                        id="agentName"
                        name="agentName"
                        // value={agentNameValue}
                        {...register('agentName', { required: true })}
                        onFocus={handleNameFocus}
                        onBlur={handleNameBlur}
                        // onChange={(e) => setAgentNameValue(e.target.value)}
                        className={`mt-1 w-full px-4 py-3 text-gray-700 text-sm rounded-md shadow-sm border-0 bg-white transition-all duration-300 ease-in-out
                          ${
                            isAgentNameFocused
                              ? 'ring-2 ring-blue-400'
                              : 'hover:ring-2 hover:ring-gray-300'
                          } focus:outline-none focus:ring-2 focus:ring-blue-400`}
                      />
                      
                    </div>
                  </div>
                  <div className="col-span-6 sm:col-span-3 p-6 bg-blue-50 rounded-lg shadow-md">
                    <label
                      htmlFor="agentEmail"
                      className={`text-lg font-medium mb-4 transition-colors flex items-center ${
                        isAgentEmailFocused ? 'text-blue-800' : 'text-gray-800'
                      }`}
                    >
                      <FaEnvelope className="inline text-xl mr-2 text-blue-500" />
                      Agent Email
                    </label>

                    <div className="relative">
                      <input
                        type="email"
                        id="agentEmail"
                        name="agentEmail"
                        // value={agentEmailValue}
                        {...register('agentEmail', { required: true })}
                        onFocus={handleEmailFocus}
                        onBlur={handleEmailBlur}
                        // onChange={(e) => setAgentEmailValue(e.target.value)}
                        className={`mt-1 w-full px-4 py-3 text-gray-700 text-sm rounded-md shadow-sm border-0 bg-white transition-all duration-300 ease-in-out
                          ${
                            isAgentEmailFocused
                              ? 'ring-2 ring-blue-400'
                              : 'hover:ring-2 hover:ring-gray-300'
                          } focus:outline-none focus:ring-2 focus:ring-blue-400`}
                      />
                    
                    </div>
                  </div>
                </>
            )}
    
              <div className="flex flex-col col-span-6 sm:flex sm:items-center sm:gap-4">

              <div className="flex items-center gap-2 mb-6">
                <div className="text-blue-500 text-xl">
                  <i className="fas fa-info-circle"></i>
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  <span className="text-blue-500">More</span> Detailed Information
                </h2>
              </div>

              <div className="grid grid-cols-6 gap-6">

{/* Price Breakup - Registration Charges */}
<div className="col-span-6 sm:col-span-3 p-6 bg-blue-50 rounded-lg shadow-md">
  <label htmlFor="priceBreakupTotal" className="block text-lg font-medium text-blue-800 mb-4">
    <i className="fas fa-rupee-sign inline text-xl mr-2" /> Total Price
  </label>
  
  <input
    type="text"
    id="priceBreakupTotal"
    {...register("price_total_price", { required: true })}
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    className="mt-1 w-full border-0 rounded-md border-gray-200 focus:outline-none px-3 bg-white focus:ring-2 focus:ring-blue-400 text-sm text-gray-900 py-3 shadow-sm transition-all duration-300 ease-in-out transform"
    placeholder="Enter Total Price"
  />
</div>

{/* Price Breakup - Registration Charges */}
<div className="col-span-6 sm:col-span-3 p-6 bg-blue-50 rounded-lg shadow-md">
  <label htmlFor="priceBreakupRegistration" className="block text-lg font-medium text-blue-800 mb-4">
    <i className="fas fa-file-contract inline text-xl mr-2" /> Registration Charges
  </label>
  
  <motion.input
    type="text"
    id="priceBreakupRegistration"
    {...register("price_registeration_chrages", { required: true })}
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    className="mt-1 w-full border-0 rounded-md border-gray-200 focus:outline-none px-3 bg-white focus:ring-2 focus:ring-blue-400 text-sm text-gray-900 py-3 shadow-sm transition-all duration-300 ease-in-out transform"
    placeholder="Enter Registration Charges"
  />
</div>

{/* Address */}
<div className="col-span-6 p-6 bg-blue-50 rounded-lg shadow-md">
  <label htmlFor="address" className="block text-lg font-medium text-blue-800 mb-4">
    <FaMapMarkerAlt className="inline text-xl mr-2" /> Address
  </label>
  
  <motion.textarea
    id="address"
    rows="3"
    {...register("add_address", { required: true })}
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    className="mt-1 w-full border-0 rounded-md border-gray-200 focus:outline-none px-3 bg-white focus:ring-2 focus:ring-blue-400 text-sm text-gray-900 py-3 shadow-sm transition-all duration-300 ease-in-out transform"
    placeholder="Enter your address"
  ></motion.textarea>
</div>

{/* Landmarks */}
<div className="col-span-6 p-6 bg-blue-50 rounded-lg shadow-md">
  <label htmlFor="landmarks" className="block text-lg font-medium text-blue-800 mb-4">
    <FaMapSigns className="inline text-xl mr-2" /> Landmarks
  </label>
  
  <motion.input
    type="text"
    id="landmarks"
    {...register("Landmarks_add", { required: true })}
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    className="mt-1 w-full border-0 rounded-md border-gray-200 focus:outline-none px-3 bg-white focus:ring-2 focus:ring-blue-400 text-sm text-gray-900 py-3 shadow-sm transition-all duration-300 ease-in-out transform"
    placeholder="Enter landmarks"
  />
</div>

  {/* Furnishing */}
  {/* <div className="col-span-6 sm:col-span-3 p-6 bg-blue-50 rounded-lg shadow-md">
  <label htmlFor="furnishing" className="block text-lg font-medium text-blue-800 mb-4">
    <FaCouch className="inline text-xl mr-2" /> Furnishing
  </label>
  <div className="relative" ref={furnishingDropdownRef}>
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        toggleFurnishingDropdown()
      }}
      className={`w-full px-4 py-3 text-left bg-white rounded-md shadow-sm transition-all duration-300 ease-in-out ${
        isFurnishingDropdownOpen
          ? 'ring-2 ring-blue-400 ring-opacity-50'
          : 'hover:ring-2 hover:ring-blue-300 hover:ring-opacity-50'
      } focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50`}
    >
      <span className="block truncate text-gray-700">
        {selectedFurnishingOption ? selectedFurnishingOption.label : 'Select furnishing type'}
      </span>
      <span className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
        {isFurnishingDropdownLoading ? (
          <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <ChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
              isFurnishingDropdownOpen ? 'transform rotate-180' : ''
            }`}
          />
        )}
      </span>
    </button>

    {isFurnishingDropdownOpen && (
      <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-auto transition-all duration-300 ease-in-out">
        <ul className="py-1">
          {furnishingOptions.map((option) => (
            <li key={option.label}>
              <button
                type="button"
                className={`w-full text-left px-4 py-2 text-sm leading-5 transition-colors duration-150 ease-in-out ${
                  selectedFurnishingOption?.value === option.value
                    ? 'text-blue-900 bg-blue-100'
                    : 'text-gray-700 hover:bg-blue-50'
                }`}
                onClick={handleFurnishingOptionSelect(option)}
              >
                <span className="flex items-center">
                  {selectedFurnishingOption?.value === option.value && (
                    <Check className="w-4 h-4 mr-2 text-blue-500" />
                  )}
                  {option.label}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
</div> */}



  {/* Flooring */}
  <div className="col-span-6 sm:col-span-3 p-6 bg-blue-50 rounded-lg shadow-md">
      <label htmlFor="flooring" className="block text-lg font-medium text-blue-800 mb-4">
        <FaHome className="inline text-xl mr-2" /> Flooring Options
      </label>
      <div className="flex flex-wrap items-center gap-3">
        <AnimatePresence>
          {flooringOptions.map((option) => (
            <motion.button
              key={option}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.preventDefault()
                toggleOption(option)
              }}
              className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ease-in-out shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                selectedOptions.includes(option)
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-white text-blue-800 hover:bg-blue-100'
              }`}
            >
              <span className={`mr-2 ${selectedOptions.includes(option) ? 'text-white' : 'text-blue-500'}`}>
                {selectedOptions.includes(option) ? '✓' : '+'}
              </span>
              {option}
            </motion.button>
          ))}
        </AnimatePresence>

        <motion.button
          initial={false}
          animate={{ width: addingCustom ? 0 : 'auto', opacity: addingCustom ? 0 : 1 }}
          onClick={(e) => {
            e.preventDefault();
            setAddingCustom(true)
          }}
          className="flex items-center px-4 py-2 rounded-full bg-white text-sm font-medium text-blue-800 hover:bg-blue-100 transition-all duration-200 ease-in-out shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          style={{ display: addingCustom ? 'none' : 'flex' }}
        >
          <FaPlus className="mr-2 text-blue-500" /> Add Custom
        </motion.button>
      </div>

      <AnimatePresence>
        {addingCustom && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 flex items-center gap-2"
          >
            <input
              type="text"
              value={customOption}
              onChange={(e) => {
                e.preventDefault();
                setCustomOption(e.target.value)
              }}
              placeholder="Enter flooring type"
              className="flex-grow px-4 py-2 rounded-full border-2 border-blue-300 focus:border-blue-500 focus:outline-none transition-all duration-200 ease-in-out"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.preventDefault();
                addCustomOption();
              }}
              className="px-6 py-2 rounded-full bg-blue-500 text-white font-medium hover:bg-blue-600 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Add
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>

  {/* Type of Ownership */}
  <div className="col-span-6 sm:col-span-3 p-6 bg-blue-50 rounded-lg shadow-md">
      <label htmlFor="ownership" className="block text-lg font-medium text-blue-800 mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="inline-block w-5 h-5 mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z" />
        </svg>
        Ownership
      </label>
      <div className="relative" ref={dropdownContainerRef}>
        <button
          type="button"
          onClick={handleDropdownToggle}
          className={`w-full px-4 py-3 text-left bg-white rounded-md shadow-sm transition-all duration-300 ease-in-out
            ${isDropdownOpen ? 'ring-2 ring-blue-400 ring-opacity-50' : 'hover:ring-2 hover:ring-blue-300 hover:ring-opacity-50'}
            focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50`}
        >
          <span className="block truncate text-gray-700">
            {selectedOwnership ? selectedOwnership.label : 'Select ownership type'}
          </span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
            {isDropdownLoading ? (
              <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <ChevronDown
                className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isDropdownOpen ? 'transform rotate-180' : ''}`}
              />
            )}
          </span>
        </button>

        {isDropdownOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-auto transition-all duration-300 ease-in-out">
            <ul className="py-1">
              {optionsList.map((option) => (
                <li key={option.value}>
                  <button
                    type="button"
                    className={`w-full text-left px-4 py-2 text-sm leading-5 transition-colors duration-150 ease-in-out 
                      ${selectedOwnership?.value === option.value
                        ? 'text-blue-900 bg-blue-100'
                        : 'text-gray-700 hover:bg-blue-50'}`}
                    onClick={() => {
                      console.log(option)
                      handleOwnershipSelect(option)
                    }}
                  >
                    <span className="flex items-center">
                      {selectedOwnership?.value === option.value && (
                        <Check className="w-4 h-4 mr-2 text-blue-500" />
                      )}
                      {option.label}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>

{/* New Ownership */}
    <div className="col-span-6 sm:col-span-3 p-6 bg-blue-50 rounded-lg shadow-md">
      <label htmlFor="furnishing" className="block text-lg font-medium text-blue-800 mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="inline-block w-5 h-5 mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z" />
        </svg>
        Furnishing
      </label>
      <div className="relative" ref={dropdownContainerRefF}>
        <button
          type="button"
          onClick={handleDropdownToggleF}
          className={`w-full px-4 py-3 text-left bg-white rounded-md shadow-sm transition-all duration-300 ease-in-out
            ${isDropdownOpenF ? 'ring-2 ring-blue-400 ring-opacity-50' : 'hover:ring-2 hover:ring-blue-300 hover:ring-opacity-50'}
            focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50`}
        >
          <span className="block truncate text-gray-700">
            {selectedOwnershipF ? selectedOwnershipF.label : 'Select ownership type'}
          </span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
            {isDropdownLoadingF ? (
              <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <ChevronDown
                className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isDropdownOpenF ? 'transform rotate-180' : ''}`}
              />
            )}
          </span>
        </button>

        {isDropdownOpenF && (
          <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-auto transition-all duration-300 ease-in-out">
            <ul className="py-1">
              {furnishingOptions.map((option) => (
                <li key={option.value}>
                  <button
                    type="button"
                    className={`w-full text-left px-4 py-2 text-sm leading-5 transition-colors duration-150 ease-in-out 
                      ${selectedOwnershipF?.value === option.value
                        ? 'text-blue-900 bg-blue-100'
                        : 'text-gray-700 hover:bg-blue-50'}`}
                    onClick={() => {
                      console.log(option)
                      handleOwnershipSelectF(option)
                    }}
                  >
                    <span className="flex items-center">
                      {selectedOwnershipF?.value === option.value && (
                        <Check className="w-4 h-4 mr-2 text-blue-500" />
                      )}
                      {option.label}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
</div>

                <button
                  type="submit"
                  // onClick={(e) => {
                  //   e.preventDefault(); // Prevent default form submission
                  //   onSubmit(); // Call your function to handle the button click
                  // }}
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
