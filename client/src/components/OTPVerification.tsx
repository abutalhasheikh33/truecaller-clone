import React, { useState, useRef, ChangeEvent, KeyboardEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/Store';
import { setUser } from '../redux/Slices/userSlices';
import axios from 'axios';
import toast from 'react-hot-toast';

interface UserDetails {
    otp: string;
}

const OTPVerification: React.FC = () => {
    const [otp, setOTP] = useState<string[]>(['', '', '', '', '', '']);
    const [error] = useState<string>('');
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const userDetails = useSelector((state: RootState) => state.user.userDetails);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (index: number, value: string) => {
        if (!isNaN(Number(value)) && value.length <= 1) {
            const updatedOTP = [...otp];
            updatedOTP[index] = value;
            setOTP(updatedOTP);

            if (index < 5 && value !== '') {
                inputRefs.current[index + 1]?.focus();
            }
        }
    };

    const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && index > 0 && otp[index] === '') {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const enteredOTP = otp.join('');
        console.log(enteredOTP);

        if (!userDetails) {
            toast.error('User details not found');
            return;
        }

        const updatedUser: UserDetails = {
            ...userDetails,
            otp: enteredOTP
        };

        try {
            const response = await axios.post('http://localhost:5000/api/v1/auth/register', updatedUser);
            console.log(response.data);
            toast.success('Registration successful');
            dispatch(setUser(updatedUser));
            navigate('/signin');
        } catch (error: any) {
            console.error('Registration failed:', error);
            toast.error(error.response?.data?.message || 'Registration failed');
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
                                onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(index, e.target.value)}
                                onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => handleKeyDown(index, e)}
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
};

export default OTPVerification;
