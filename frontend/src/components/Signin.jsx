import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../redux/Slices/userSlices';


function Signin() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        axios.post('http://localhost:5000/api/v1/auth/login', formData)
            .then((res) => {
                localStorage.setItem("userToken", res.data.token);
                navigate('/contacts');
                console.log(res.data.user)
                toast.success('Login successful');
                useDispatch(setUser(res.data.user));
            })
            .catch((err) => {
                console.log(err)
                toast.error(err.response.data.message);
            });
        console.log(formData);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">

            <div className="max-w-md w-full px-6 py-8 bg-white dark:bg-gray-800 shadow-md rounded-lg">
                <h2 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">Sign In</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Email address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Your Email Address"
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
                            name="password"
                            type="password"
                            placeholder="**********************"
                            value={formData.password}
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
                            Sign In
                        </button>
                    </div>
                </form>
                <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">
                    Don't have an account?{' '}
                    <Link to='/' className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                        Sign up here
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Signin;
