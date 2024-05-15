import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ContactModal({ contact, closeModal }) {

    const [contactDetails, setContactDetails] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true); // Set loading to true when fetching data
        axios.patch(`http://localhost:5000/api/v1/contact/showDetails`, {
            phoneNumber: contact.phoneNumber
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("userToken")}`
            }
        }).then(res => {
            console.log(res.data);
            setContactDetails(res.data);
            setLoading(false); // Set loading to false after data is fetched
        }).catch(err => {
            console.log(err);
            setLoading(false); // Set loading to false if an error occurs
        })
    }, [contact]);


    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8  rounded-lg shadow-md">
                {loading ? ( // Render loader if loading is true
                    <div>Loading...</div>
                ) : (
                    <div className='space-y-[14px]'>
                        <h2 className="text-2xl font-bold mb-4">{contactDetails.name}</h2>
                        <p className="text-gray-600">Phone No: {contactDetails.phoneNumber}</p>
                        <p className="text-gray-600">Country: {contactDetails.country?contactDetails.country:"Not provided"}</p>
                        <p className="text-gray-600 ">City: {contactDetails.city?contactDetails.city:"Not provided"}</p>
                        <p className="text-gray-600 pb-6">Spam: {Math.floor(contactDetails.spamLikelihood)}%</p>
                        <button onClick={closeModal} className="px-4 py-2 bg-indigo-600 text-white rounded-md">
                            Close
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ContactModal;
