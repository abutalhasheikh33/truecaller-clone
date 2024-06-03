import { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
// import { useSelector } from 'react-redux';
// import { RootState } from '../redux/Store.ts';

interface FormData {
    name: string;
    phoneNumber: string;
}

function AddContact() {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        phoneNumber: '',
    });

    // const userDetails = useSelector((state: RootState) => state.user.userDetails);
    const navigate = useNavigate();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/v1/contact/createContact', formData, {
                headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` }
            });
            console.log(response.data);
            navigate('/contacts');
            toast.success('Contact added successfully');
        } catch (err: any) {
            console.error(err);
            toast.error(err.response.data.message);
        }
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
                                placeholder="Full Name"
                                value={formData.name}
                                onChange={handleChange}
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
                                    type="text"
                                    placeholder="Your phone number"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    minLength={10}
                                    maxLength={10}
                                    pattern="[0-9]{10}"
                                    className="mt-1 p-2 block w-full border-gray-300 rounded-r-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:border-indigo-400 dark:focus:ring-indigo-400 dark:text-gray-200"
                                />
                            </div>
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
