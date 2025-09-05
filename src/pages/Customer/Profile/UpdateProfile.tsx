/* eslint-disable react-hooks/exhaustive-deps */
import { Link, useNavigate } from "react-router-dom";
import { InputField } from "../../../components/Customer/InputField";
import { useCustomer } from "../../CustomHooks/useCustomer";
import { CustomAlert, CustomAlertConfirm } from "../../../utils/CustomAlert";
import React, { useState } from "react";
import { useAuth } from "../../../Auth/useAuth";
import { Errors } from "../../../types/common.type";
import { getErrorField } from "../../../utils/getErrorField";
import { IUpdateCustomer } from "../../../types/customer.type";
import { AxiosError } from "axios";

export default function UpdateProfile() {
  const { user } = useAuth();
  const { authCustomer, updateCustomer } = useCustomer(user?.userId);
  const navigate = useNavigate();

  const [formUpdateCustomer, setFormUpdateCustomer] = useState<IUpdateCustomer>({});
  const [uploadedImageName, setUploadedImageName] = useState<string>("");
  const [hasErrors, setHasErrors] = useState<Errors[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { type, name, value, files } = e.target as HTMLInputElement;
    let newValue: string | File | undefined = value;

    if (type === "file" && files?.length) {
      setUploadedImageName(files[0].name);
      newValue = files[0];
    }

    if (name === "post_code" || name === "phone_number") {
      newValue = value.replace(/\D/g, ""); // Only Number
    }

    setFormUpdateCustomer((prevState) => ({
      ...prevState,
      [name]: newValue,
    }));
  };

  const handleUpdateCustomer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isConfirm = await CustomAlertConfirm("Are you sure want to update profile ?");

    if (isConfirm) {
      updateCustomer.mutate(formUpdateCustomer, {
        onSuccess: (data) => {
          setFormUpdateCustomer({});
          setHasErrors([]);
          CustomAlert(data.message, "success");
          navigate("/profile");
        },
        onError: (error: any) => {
          if (error instanceof AxiosError) {
            const errors = error.response?.data.errors;

            // NO FIELDS CHANGES
            if (!errors && !error.response?.data.success && error.response?.status === 404) {
              setFormUpdateCustomer({});
              setHasErrors([]);
              CustomAlert("error", "error", error.response?.data.message);
            }

            // VALIDATION ERROR
            if (errors && errors !== null && error.response?.data.message === "validation error") {
              setHasErrors(errors);
            }
          } else {
            navigate("/profile");
            setFormUpdateCustomer({});
            setHasErrors([]);
            CustomAlert("error", "error", "Error while update profile, please try again later.");
          }
        },
      });
    }
  };

  return (
    <>
      <section className="pb-[50px]">
        <div className="pt-[30px] px-[16px] flex items-center">
          {/* Header */}
          <Link
            to="/profile"
            className="p-2 bg-white flex justify-center items-center rounded-full ring-1 ring-black hover:ring-0 hover:bg-red-500 transition-all duration-200 ease-in-out group"
          >
            <img
              src="assets/img/arrow-left.png"
              alt="back-button"
              className="group-hover:filter group-hover:invert group-hover:brightness-0"
            />
          </Link>
          <h1 className="font-bold text-xl absolute left-1/2 -translate-x-1/2">Profile</h1>
        </div>

        {/* Data User */}
        <div className="px-[16px]">
          <div className="bg-white mt-[20px] rounded-t-[60px] rounded-b-[60px]">
            <div className="p-5 bg-white rounded-[24px] mt-[10px]">
              <div>
                <form onSubmit={handleUpdateCustomer} className="flex flex-col gap-y-3">
                  {/* Username */}
                  <InputField
                    label="Username"
                    name="username"
                    type="text"
                    placeholder="Username"
                    icon="assets/img/register-profile.png"
                    value={formUpdateCustomer.username ?? authCustomer?.username ?? ""}
                    onChange={handleChange}
                  />

                  {/* Email */}
                  <InputField
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="Email"
                    icon="assets/img/email.png"
                    isError={!!getErrorField(hasErrors, "email")}
                    value={formUpdateCustomer.email ?? authCustomer?.email ?? ""}
                    onChange={handleChange}
                  />

                  {getErrorField(hasErrors, "email") && (
                    <p className="ml-5 -mt-1 text-red-500 font-semibold tracking-wider">
                      {getErrorField(hasErrors, "email")?.message}
                    </p>
                  )}

                  {/* Address */}
                  <div className="relative">
                    <label htmlFor="address" className="font-semibold">
                      Address
                    </label>
                    <textarea
                      name="address"
                      id="address"
                      placeholder="Your address"
                      className="w-full h-full px-12 py-3 mt-2 border border-slate-300 rounded-2xl placeholder:text-[16px] focus:outline-none focus:ring-2 focus:ring-[#FD915A]"
                      value={formUpdateCustomer.address ?? authCustomer?.address ?? ""}
                      onChange={handleChange}
                    ></textarea>
                    <img src="assets/img/location.png" alt="note" className="absolute top-[47px] left-[15px]" />
                  </div>

                  {/* City */}
                  <InputField
                    label="City"
                    name="city"
                    type="text"
                    placeholder="City"
                    icon="assets/img/city.png"
                    value={formUpdateCustomer.city ?? authCustomer?.city ?? ""}
                    onChange={handleChange}
                  />

                  {/* Post Code */}
                  <InputField
                    label="Post Code"
                    name="post_code"
                    type="text"
                    placeholder="Post Code"
                    icon="assets/img/house.png"
                    inputMode={"numeric"}
                    pattern="[0-9]*"
                    maxLength={5}
                    isError={!!getErrorField(hasErrors, "post_code")}
                    value={formUpdateCustomer.post_code ?? authCustomer?.post_code ?? ""}
                    onChange={handleChange}
                  />

                  {getErrorField(hasErrors, "post_code") && (
                    <p className="ml-5 -mt-1 text-red-500 font-semibold tracking-wider">
                      {getErrorField(hasErrors, "post_code")?.message}
                    </p>
                  )}

                  {/* Phone Number */}
                  <InputField
                    label="Phone Number"
                    name="phone_number"
                    type="text"
                    placeholder="Phone Number"
                    icon="assets/img/call.png"
                    inputMode={"numeric"}
                    pattern="[0-9]*"
                    maxLength={12}
                    isError={!!getErrorField(hasErrors, "phone_number")}
                    value={formUpdateCustomer.phone_number ?? authCustomer?.phone_number ?? ""}
                    onChange={handleChange}
                  />

                  {getErrorField(hasErrors, "phone_number") && (
                    <p className="ml-5 -mt-1 text-red-500 font-semibold tracking-wider">
                      {getErrorField(hasErrors, "phone_number")?.message}
                    </p>
                  )}

                  {/* Photo Profile */}
                  <div>
                    <label htmlFor="photo_profile" className="font-bold">
                      Photo Profile
                    </label>
                    <div className="mt-[10px]">
                      <label
                        htmlFor="profile_image"
                        className="flex items-center gap-x-3 cursor-pointer py-3 text-slate-400 px-3 border border-slate-300 rounded-3xl placeholder:text-[16px] hover:outline-none hover:ring-2 hover:ring-[#FD915A]"
                      >
                        <img src="assets/img/folder.png" alt="photo_profile" className="cursor-pointer" />
                        {uploadedImageName ? uploadedImageName : "Select Picture Here"}
                      </label>
                      <input
                        id="profile_image"
                        name="profile_image"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <button className="text-center mt-[10px] tracking-wider px-6 py-3 bg-[#FD915A] text-white font-bold rounded-[50px] hover:bg-white hover:text-[#FD915A] hover:ring-2 hover:ring-[#FD915A] duration-300">
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
