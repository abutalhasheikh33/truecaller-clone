import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../redux/Slices/userSlices';
import axios from 'axios'; // Import Axios
import toast from 'react-hot-toast';

function OTPVerification() {
    const [otp, setOTP] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const inputRefs = useRef([]);
    const userDetails = useSelector((state) => state.user.userDetails);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (index, value) => {
        // Only allow digits and limit to one character
        if (!isNaN(value) && value.length <= 1) {
            const updatedOTP = [...otp];
            updatedOTP[index] = value;
            setOTP(updatedOTP);

            // Focus next input if current input is filled and not the last one
            if (index < 5 && value !== '') {
                inputRefs.current[index + 1].focus();
            }
        }
    };

    const handleKeyDown = (index, e) => {
        // Handle Backspace to move focus to previous input
        if (e.key === 'Backspace' && index > 0 && otp[index] === '') {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const enteredOTP = otp.join('');
        console.log(enteredOTP);

        // Dispatching OTP along with user details
        const updatedUser = {
            ...userDetails,
            otp: enteredOTP
        };

        try {
            // Sending POST request to register endpoint
            const response = await axios.post('http://localhost:5000/api/v1/auth/register', updatedUser);
            console.log(response.data); // Log response data if needed
            toast.success('Registration successful'); // Display success message
            dispatch(setUser(updatedUser)); // Update Redux store with user details
            navigate('/signin'); // Navigate to contacts page
        } catch (error) {
            console.error('Registration failed:', error);
            toast.error(error.response.data.message); // Display error message
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
            <div className="max-w-md w-full px-6 py-8 bg-white dark:bg-gray-800 shadow-md rounded-lg">
                <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-gray-200">OTP Verification</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex justify-center">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={(ref) => (inputRefs.current[index] = ref)}
                                type="text"
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                maxLength={1}
                                className="w-12 h-12 text-4xl mx-1 text-center border border-gray-300 rounded focus:outline-none focus:ring focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:border-indigo-400 dark:focus:ring-indigo-400 dark:text-gray-200"
                            />
                        ))}
                    </div>
                    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                    <div>
                        <button
                            type="submit"
                            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Verify OTP
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default OTPVerification;
