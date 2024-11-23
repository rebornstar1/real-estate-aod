import { BsBookmarkHeart, BsBookmarkHeartFill } from "react-icons/bs";
import { FaParking } from "react-icons/fa";
import { FiMapPin } from "react-icons/fi";
import { MdOutlineBedroomChild, MdPriceChange } from "react-icons/md";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { TbRulerMeasure } from "react-icons/tb";
import { Link, useLoaderData, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import AddReviews from "../Reviews/AddReviews";
import HeaderText from "./../HeaderText/HeaderText";
import useAuth from "../../hooks/useAuth";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import useWishlistByEmail from "../../hooks/useWishlistByEmail";
import { useEffect, useState } from "react";
import ScheduleMeetModal from "./ScheduleMeetModal";
import useRole from "../../hooks/useRole";
import axios from "axios";

const SinglePropertyCard = () => {
  const { user } = useAuth();
  const [role, isLoading] = useRole(user?.email);
  const [disableBtn, setDisableBtn] = useState(false);
  const axiosPublic = useAxiosPublic();
  const property = useLoaderData();
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);
// Modal state

  //   console.log(property);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const {
    _id,
    propertyImages,
    propertyLocation,
    priceRange,
    propertyTitle,
    agentEmail,
    agentName,
    agentImage,
    status,
    propertyDetails,
    parking,
    rooms,
    size,
  } = property;
  const location = useLocation();
  //   console.log(location);
  const [wishlistDataByEmail,refetch] = useWishlistByEmail(user.email);

  useEffect(() => {
    if (wishlistDataByEmail) {
      const found = wishlistDataByEmail.find(
        (wishlist) => wishlist.propertyID === _id
      );
      console.log("found", found);
      if (found) {
        setDisableBtn(true)
      }
    }
  }, [_id, wishlistDataByEmail]);

  useEffect(() => {
    const fetchMeetingStatus = async () => {
      try {
        const response = await axiosPublic.get(
          `/api/v1/meeting-status?propertyId=${_id}&buyerEmail=${user.email}`
        );

        console.log(response);
        
        setMeeting(response.data.data);
      } catch (error) {
        console.error("Error fetching meeting status:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeetingStatus();
  }, [_id, user.email]);

  const reviewData = {
    _id,
    agentName,
    agentEmail,
    propertyTitle,
  };
  console.log(reviewData);

  //   wishlist handling
  const handleAddtoWishlist = () => {
    const { _id, ...propertyData } = property;
    const wishlistData = {
      userEmail: user.email,
      propertyID: _id,
      ...propertyData,
    };
    console.log("wishListData", wishlistData);

    axiosPublic.post("/api/v1/wishlists", wishlistData).then((res) => {
      console.log(res.data);
      Swal.fire({
        position: "top-end",
        imageUrl:
          "https://png.pngtree.com/png-vector/20190423/ourmid/pngtree-bookmark-icon-vector-illustration-in-filled-style-for-any-purpose-png-image_975418.jpg",
        imageWidth: 50,
        imageHeight: 50,
        imageAlt: "wishlist image",
        titleText: "Added to wishlist!",
        showConfirmButton: false,
        timer: 1500,
      });
      refetch()
    });
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 bg-base-200 rounded-2xl lg:max-w-[80%] md:mx-auto p-2 md:p-6">
        <div className="text-sm breadcrumbs">
          <ul>
            <li>
              <Link to={"/"}>Home</Link>
            </li>
            <li>
              <Link to={"/all-properties"}>All properties</Link>
            </li>
            <li>
              <Link to={`${location.pathname}`}>{propertyTitle}</Link>
            </li>
          </ul>
        </div>
        <div className="flex items-center  justify-between gap-4 py-4 ">
          <h3 className="text-2xl/relaxed font-bold">{propertyTitle}</h3>
          {
            disableBtn?<button
            onClick={handleAddtoWishlist}
            className="btn btn-sm text-white btn-disabled"
          >
            <BsBookmarkHeartFill className="text-2xl" />
            Already Added
           
          </button> :<button
            onClick={handleAddtoWishlist}
            className="btn btn-sm bg-pink-600 text-white hover:bg-pink-800 "
          >
            <BsBookmarkHeart className="text-2xl" />
            Add to wishlist
           
          </button>

          }
          
         
        </div>
        <img
          alt="Home"
          src={propertyImages[0]}
          className="w-full max-h-[400px] rounded-md object-cover"
        />

        <div className="mt-2 border-2 rounded-2xl p-4">
          <dl>
            <div>
              <p className="mt-2 line-clamp-3  ">
                <MdPriceChange className="inline mr-3 text-success" />
                {priceRange}
              </p>
            </div>

            <div>
              <p className="mt-2 line-clamp-3 font-semibold text-lg  ">
                <FiMapPin className="inline mr-3 text-primary" />
                {propertyLocation}
              </p>
            </div>
            <div>
              <p className="mt-2 line-clamp-3 font-semibold text-lg  ">
                <RiVerifiedBadgeFill className="inline mr-3 text-primary" />
                {status}
              </p>
            </div>
          </dl>
          <div className="flex flex-col gap-3 my-4">
            <h2>Details: </h2>
            <hr />
            <p className="text-base/relaxed">{propertyDetails}</p>
          </div>
          <div className="mt-6 flex items-center gap-8 text-xs">
            <div className="sm:inline-flex sm:shrink-0 sm:items-center sm:gap-2">
              <FaParking className="text-2xl text-primary" />

              <div className="mt-1.5 sm:mt-0">
                <p className="text-gray-500">Parking</p>

                <p className="font-medium">{parking} spaces</p>
              </div>
            </div>

            <div className="sm:inline-flex sm:shrink-0 sm:items-center sm:gap-2">
              <MdOutlineBedroomChild className="text-2xl text-primary" />

              <div className="mt-1.5 sm:mt-0">
                <p className="text-gray-500">Rooms</p>

                <p className="font-medium">{rooms} rooms</p>
              </div>
            </div>

            <div className="sm:inline-flex sm:shrink-0 sm:items-center sm:gap-2">
              <TbRulerMeasure className="text-2xl text-primary" />

              <div className="mt-1.5 sm:mt-0">
                <p className="text-gray-500">Size</p>

                <p className="font-medium">{size} sqft</p>
              </div>
            </div>
          </div>
        </div>
        <div>
          <AddReviews reviewData={reviewData} />
        </div>
      </div>
      <div className="md:p-6 lg:max-w-[80%]  bg-base-200 rounded-2xl h-fit">
        <div className=" ">
          <HeaderText
            headerText="Contact Info"
            headerText3={"contact our agent"}
          />
        </div>
        <div className="py-3 flex flex-col items-center textcenter">
          <p className="text-xl font-bold">AGENT INFO</p>
          <div className=" text-center py-6 border-2 rounded-2xl mt-3 border-success w-full mx-auto space-y-3 md:text-lg/relaxed font-semibold bg-gradient-to-tr from-success to-primary text-white ">
            <img
              src={agentImage}
              alt="agent image"
              className="max-w-[60px] rounded-full border-2 mx-auto"
            />
            <p>
              Agent Name: <span className="font-normal"> {agentName}</span>{" "}
            </p>
            <p>
              Agent Name: <span className="font-normal">{agentEmail} </span>{" "}
            </p>
            <p>
              Contact Info: <span className="font-normal"> 017XXXXXXXX</span>{" "}
            </p>
          </div>
        </div>
        
        {/* <div className="mt-6 p-4 bg-white shadow rounded-2xl">
          <h2 className="text-lg font-bold">Schedule a Meeting</h2>
          <p className="mt-2 text-sm text-gray-500">
            Interested in this property? Schedule a meeting with our agent to know more.
          </p>
          <button
            className="btn btn-primary mt-4 w-full"
            onClick={openModal}
          >
            Schedule Meet
          </button>
        </div> */}

<div className="mt-6 p-4 bg-white shadow rounded-2xl">
  <h2 className="text-lg font-bold">Schedule a Meeting</h2>
  {console.log(role)}
  {role === "agent" ? (
    <p className="mt-2 text-sm text-gray-500">
      You are logged in as an agent. Scheduling is not available.
    </p>
  ) : loading ? (
    <p className="mt-2 text-sm text-gray-500">Loading meeting status...</p>
  ) : meeting ? (
    <>
      <p className="mt-2 text-sm text-gray-500">
        Meeting Status: <span className="font-bold">{meeting.status}</span>
      </p>
      <p className="mt-1 text-sm text-gray-500">
        Scheduled on: {new Date(meeting.date).toLocaleDateString()} at {meeting.time}
      </p>
      <p className="mt-1 text-sm text-gray-500">Location: {meeting.location}</p>
    </>
  ) : (
    <>
      <p className="mt-2 text-sm text-gray-500">
        Interested in this property? Schedule a meeting with our agent to know more.
      </p>
      <button className="btn btn-primary mt-4 w-full" onClick={openModal}>
        Schedule Meet
      </button>
    </>
  )}
</div>


        <div>

            {/* Include the modal */}
      <ScheduleMeetModal
        isOpen={isModalOpen}
        onClose={closeModal}
        propertyId={_id}
        propertyTitle={propertyTitle}
        propertyLocation={propertyLocation}
      />

        </div>
      </div>
      
    </div>
  );
};

export default SinglePropertyCard;
