import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { setUser } from '../redux/Slices/userSlices';
import { useDispatch } from 'react-redux';

function Signup() {
    const [formData, setFormData] = useState({
        name: '',
        phoneNumber: '',
        password: '',
        email: '',
        city: '',
        country: '',
    });



    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        // axios.post('http://localhost:5000/api/v1/auth/register', formData)
        //     .then((res) => {
        //         toast.success('Registration successful');
        //         console.log(res.data)
        //     })
        //     .catch((err) => {
        //         console.log(err)
        //         toast.error(err.response.data.message);
        //     });
        // console.log(formData);
        const userEmail = formData.email;
        axios.post('http://localhost:5000/api/v1/auth/sendOtp', {
            email: userEmail,
        })
            .then((res) => {
                console.log(res.data);
                toast.success('OTP sent successfully');
            })
            .catch((err) => {
                console.log(err);
                toast.error(err.response.data.message);
            });

        dispatch(setUser(formData)); // Dispatching setUser action with form data
        navigate('/verify');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
            <div className="max-w-md w-full px-6 py-8 bg-white dark:bg-gray-800 shadow-md rounded-lg">
                <h2 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">Register</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Name
                        </label>
                        <input
                            autoComplete="name"
                            // id="name"
                            name="name"
                            type="text"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={handleChange}
                            // required
                            className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:border-indigo-400 dark:focus:ring-indigo-400 dark:text-gray-200"
                        />
                    </div>
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Phone Number
                        </label>
                        <div className='flex items-center'>
                            <span className='mt-1 p-2 block border-r-2 border-white rounded-l-md shadow-sm dark:bg-gray-700 dark:border-gray-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400 dark:text-gray-200'>+91</span>

                            <input
                                name="phoneNumber"
                                type="number"
                                placeholder="Your phone number"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                className="mt-1 p-2 block w-full border-gray-300 rounded-r-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:border-indigo-400 dark:focus:ring-indigo-400 dark:text-gray-200"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Email address
                        </label>
                        <input
                            autoComplete="email"
                            // id="email"
                            name="email"
                            type="email"
                            placeholder="Tell us your email id"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:border-indigo-400 dark:focus:ring-indigo-400 dark:text-gray-200"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Password
                        </label>
                        <input
                            autoComplete="current-password"
                            name="password"
                            type="password"
                            placeholder="***************"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:border-indigo-400 dark:focus:ring-indigo-400 dark:text-gray-200"
                        />
                    </div>

                    <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            City
                        </label>
                        <input
                            autoComplete="address-level2"
                            // id="city"
                            name="city"
                            type="text"
                            placeholder="Your city name"
                            value={formData.city}
                            onChange={handleChange}
                            required
                            className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:border-indigo-400 dark:focus:ring-indigo-400 dark:text-gray-200"
                        />
                    </div>
                    <div>
                        <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Country
                        </label>
                        <input
                            autoComplete="country"
                            id="country"
                            name="country"
                            type="text"
                            placeholder="Where are you from?"
                            value={formData.country}
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
                            Register
                        </button>
                    </div>
                </form>
                <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">
                    Already have an account?{' '}
                    <Link to="/signin" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                        Sign in here
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Signup;
