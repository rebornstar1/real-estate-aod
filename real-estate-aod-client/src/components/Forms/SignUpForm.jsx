import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { MdCheckBoxOutlineBlank, MdOutlineCheckBox } from "react-icons/md";
import useAuth from "../../hooks/useAuth";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import SocialLogin from "../SocialLogin/SocialLogin";

const image_hosting_key = import.meta.env.VITE_IMAGE_API_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const SignUpForm = () => {
  const axiosPublic = useAxiosPublic();
  const [showPassword, setShowPassord] = useState(false);
  const [isAgent, setIsAgent] = useState(false); // State to toggle between Agent and User
  const { user, signupUser, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const username = data.first_name + " " + data.last_name;

    if (!user) {
      const imageFile = { image: data.image[0] };
      const res = await axiosPublic.post(image_hosting_api, imageFile, {
        headers: {
          "content-type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        const toastId = toast.loading("Creating new account...");

        try {
          await signupUser(data.email, data.password)
            .then((userCredential) => {
              updateUserProfile(username, res.data.data.display_url).then(() => {
                // Create user entry in the database with the respective role
                const userInfo = {
                  name: username,
                  email: data.email,
                  role: isAgent ? "agent" : "user", // Based on the form selection
                  ...(isAgent && { rera_number: data.rera_number, first_time:true,is_verifed:false }), // Add RERA number if Agent
                };
                axiosPublic.post("/api/v1/users", userInfo).then((res) => {
                  if (res.data?.insertedId) {
                    if (isAgent) {
                      toast.success("You will be able to log in once your profile is approved by the super admin.",{ id: toastId });
                      navigate(location?.state || "/login");
                    }else{
                      toast.success("Account created successfully!", { id: toastId });

                    }

                     // Show message for agents regarding admin approval

                    navigate(location?.state || "/");
                  }
                });
              });
            })
            .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
              console.log(errorCode, errorMessage);
            });
        } catch (err) {
          toast.error(err.message, { id: toastId });
        }
      } else {
        toast.error("OOPS! Something went wrong");
      }
    } else {
      toast("Log out of other account first!", {
        icon: "⚠",
        style: {
          borderRadius: "10px",
          background: "#fadf1b",
          color: "#1a1a1a",
        },
      });
    }
  };

  return (
    <section className="bg-base-200">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        <aside className="relative block h-16 lg:order-last lg:col-span-5 lg:h-full xl:col-span-6">
          <img
            alt="property"
            src="/assets/property/property1.jpg"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </aside>

        <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 xl:w-[80%] lg:py-12 xl:col-span-6">
          <div className="max-w-xl lg:max-w-3xl">
            <Link to={"/"}>
              <button className="button button-2 px-5 rounded-xl btn btn-secondary hover:text-white btn-sm">
                Go Home
              </button>
            </Link>

            <h1 className="mt-6 text-2xl font-bold sm:text-3xl md:text-4xl">
              Sign Up
            </h1>

            <p className="mt-4 leading-relaxed text-gray-500">
              Join our thriving community, where every neighbor is considered family...
            </p>

            <div className="flex mt-6">
              <button
                onClick={() => setIsAgent(false)}
                className={`px-4 py-2 border ${!isAgent ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                User
              </button>
              <button
                onClick={() => setIsAgent(true)}
                className={`ml-4 px-4 py-2 border ${isAgent ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                Agent
              </button>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mt-8 grid grid-cols-6 gap-6"
            >
              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="FirstName" className="block text-sm font-medium ">
                  First Name
                </label>
                <input
                  type="text"
                  id="FirstName"
                  name="first_name"
                  {...register("first_name", { required: true })}
                  className="mt-1 w-full border-0 rounded-md border-gray-200 focus:outline-2 px-3 bg-slate-100 focus:outline-slate-400 text-sm py-3 shadow-sm"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="LastName" className="block text-sm font-medium ">
                  Last Name
                </label>
                <input
                  type="text"
                  id="LastName"
                  name="last_name"
                  {...register("last_name", { required: true })}
                  className="mt-1 w-full border-0 rounded-md border-gray-200 focus:outline-2 px-3 bg-slate-100 focus:outline-slate-400 text-sm py-3 shadow-sm"
                />
              </div>

              <div className="col-span-6 w-full ">
                <label htmlFor="image" className="block text-sm font-medium  mb-2 w-full">
                  Upload Image
                </label>
                <input
                  type="file"
                  name="image"
                  {...register("image", { required: true })}
                  className="file-input file-input-bordered file-input-secondary w-auto lg:w-full"
                />
              </div>

              <div className="col-span-6">
                <label htmlFor="Email" className="block text-sm font-medium ">
                  Email Address
                </label>
                <input
                  type="email"
                  id="Email"
                  {...register("email", { required: true })}
                  name="email"
                  
                  className="mt-1 w-full border-0 rounded-md border-gray-200 focus:outline-2 px-3 bg-slate-100 focus:outline-slate-400 text-sm py-3 shadow-sm"
                />
              </div>
              <div className="col-span-6 relative">
                <label htmlFor="Password" className="block text-sm font-medium ">
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="Password"
                  name="password"
                  {...register("password", {
                    required: true,
                    minLength: 6,
                    maxLength: 20,
                    pattern:
                      /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                  })}
                  className="mt-1 px-3 w-full border-0 rounded-md border-gray-200 focus:outline-2 bg-slate-100 focus:outline-slate-400 text-sm py-3 shadow-sm"
                />
                {errors.password?.type === "required" && (
                  <p className="text-sm text-error">Password is required</p>
                )}
                {errors.password?.type === "minLength" && (
                  <p className="text-sm text-error">Minimum 6 characters</p>
                )}
                {errors.password?.type === "pattern" && (
                  <p className="text-sm text-error">
                    Must have at least one lowercase & uppercase, one number, and one special character
                  </p>
                )}
                <span
                  onClick={() => setShowPassord(!showPassword)}
                  className="cursor-pointer top-[55%] right-6 flex my-2 items-center w-fit"
                >
                  {showPassword ? (
                    <MdOutlineCheckBox className="text-slate-500" />
                  ) : (
                    <MdCheckBoxOutlineBlank className="text-slate-500" />
                  )}
                </span>
              </div>

              {isAgent && (
                <div className="col-span-6">
                  <label htmlFor="RERA Number" className="block text-sm font-medium ">
                    RERA Registration Number
                  </label>
                  <input
                    type="text"
                    name="rera_number"
                    {...register("rera_number", { required: isAgent })}
                    className="mt-1 w-full border-0 rounded-md border-gray-200 focus:outline-2 px-3 bg-slate-100 focus:outline-slate-400 text-sm py-3 shadow-sm"
                  />
                </div>
              )}

              <div className="col-span-6 mt-4 flex items-center">
                <SocialLogin />
              </div>

              <div className="col-span-6">
                <button type="submit" className="btn btn-primary w-full py-4 mt-4">
                  Sign up
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </section>
  );
};

export default SignUpForm;
