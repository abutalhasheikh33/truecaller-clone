import React, { useState } from 'react';
import axios from 'axios';
import Nav from './Nav';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
function AddContact() {
    const [formData, setFormData] = useState({
        name: '',
        phoneNumber: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        axios.post('http://localhost:5000/api/v1/contact/createContact', formData, {
            headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` }
        })
            .then((res) => {
                console.log(res.data);
                navigate('/contacts');
                toast.success('Contact added successfully');
            })
            .catch((err) => {
                console.log(err)
                toast.error(err.response.data.message);
            });
        console.log(formData);
    };

    return (
        <>
          
            <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
                <div className="max-w-md w-full px-6 py-8 bg-white dark:bg-gray-800 shadow-md rounded-lg">
                    <h2 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">Add Contact</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Name
                            </label>
                            <input
                                name="name"
                                type="text"
                                placeholder="John The Don"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:border-indigo-400 dark:focus:ring-indigo-400 dark:text-gray-200"
                            />
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Phone Number
                            </label>
                            <input
                                name="phoneNumber"
                                type="tel"
                                placeholder="+91 1234567890"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:border-indigo-400 dark:focus:ring-indigo-400 dark:text-gray-200"
                            />
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Add Contact
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default AddContact;
