import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

function MarkSpam() {
    const [phoneNumber, setPhoneNumber] = useState("");

    const handleChange = (e) => {
        setPhoneNumber(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('phoneNumber', phoneNumber);
        try {
            const response = await axios.patch(
                "http://localhost:5000/api/v1/contact/markSpam",
                { phoneNumber: phoneNumber },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                    },
                }
            );
            console.log(response.data); // Handle the response if needed

            // Optionally, you can reset the form fields or show a success message
            setPhoneNumber("");
            toast.success("Phone number marked as spam successfully!");
        } catch (error) {
            console.error("Error marking phone number as spam:", error);
            toast.error("Failed to mark phone number as spam. Please try again later.");
        }
    };

    return (
        <div className="bg-gray-100 dark:bg-gray-900">
            <div className="max-w-md mx-auto py-8 px-4">
                <h2 className="text-3xl font-bold mb-4 text-center text-gray-800 dark:text-gray-200">
                    Mark Spam
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="flex items-center justify-between">
                        <div className="flex">
                            <span className=" p-2 block border-r border-white rounded-l-md shadow-sm dark:bg-gray-800 dark:border-gray-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400 dark:text-gray-200">+91</span>
                            <input
                                name="phoneNumber"
                                type="number"
                                placeholder="Your phone number"
                                value={phoneNumber}
                                onChange={handleChange}
                                required
                                className=" p-2 block min-w-full border-gray-300 rounded-r-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:focus:border-indigo-400 dark:focus:ring-indigo-400 dark:text-gray-200"
                            />
                        </div>
                        <div className="">
                            <button
                                type="submit"
                                className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Mark Spam
                            </button>
                        </div>
                    </div>
                </form>




            </div>
        </div>
    );
}

export default MarkSpam;
