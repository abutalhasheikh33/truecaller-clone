import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Nav from './Nav';
import toast from 'react-hot-toast';

function ContactsList() {
    const [contacts, setContacts] = useState([]);



    useEffect(() => {
        axios.get('http://localhost:5000/api/v1/contact/listContacts', {
            headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` }
        })
            .then((res) => {
                console.log(res.data.personalContacts)
                setContacts(res.data.personalContacts)
            })
            .catch((err) => console.log(err));
    }, []);


    const handleDelete = (id) => {
        setContacts((prevContacts) => prevContacts.filter((contact) => contact.id !== id));
    };

    const handleSpam = (phoneNumber) => {
        axios.patch(
            `http://localhost:5000/api/v1/contact/markSpam`,
            {
                phoneNumber: phoneNumber
            },
            {
                headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` }
            }
        )
            .then((res) => {
                console.log(res.data)
                toast.success('Contact marked as spam');
            })
            .catch((err) => console.log(err));
        console.log(phoneNumber);
    };


    const handleAddContact = () => {
        console.log('Add contact clicked');
    };

    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredContacts = contacts.filter((contact) =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.phone.includes(searchTerm)
    );




    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <Nav />
            <div className="max-w-md mx-auto py-8 px-4">
                <h2 className="text-3xl font-bold mb-4 text-center text-gray-800 dark:text-gray-200">My Contacts</h2>
                <p className="text-gray-600 mb-6 text-center dark:text-gray-400">Manage your personal contacts</p>
                <input
                    type="text"
                    placeholder="Search contacts"
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full px-3 py-2 rounded-md border-gray-300 focus:outline-none focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:focus:border-indigo-400 dark:text-gray-200"
                />
                <ul className="mt-4">
                    {filteredContacts.map((contact) => (
                        <li key={contact._id} className="flex items-center justify-between py-2 border-b border-gray-300">
                            <div>
                                <p className="text-lg font-medium text-gray-800 dark:text-gray-200">{contact.name}</p>
                                <p className="text-gray-600 dark:text-gray-400">{contact.phoneNumber}</p>
                            </div>
                            <div>
                                <button
                                    onClick={() => handleDelete(contact.id)}
                                    className="px-3 py-1 mr-2 bg-red-500 text-white rounded-md"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() => handleSpam(contact.phoneNumber)}
                                    className="px-3 py-1 bg-yellow-500 text-white rounded-md"
                                >
                                    Mark as Spam
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
                <div className="mt-8">
                    <Link
                        to="/add"
                        onClick={handleAddContact}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md"
                    >
                        Add Contact

                    </Link>
                </div>
            </div>
        </div>
    );
}

export default ContactsList;
