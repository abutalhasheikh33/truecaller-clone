import React, { useEffect, useState } from "react";
import axios from "axios"; // Import Axios library
import ContactModal from "./ContactModal";
import toast from 'react-hot-toast';

function GlobalSearch() {
    const [selectedContact, setSelectedContact] = useState(null);
    const [contacts, setContacts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const timerId = setTimeout(() => {
            if (searchTerm !== "") {
                console.log(`Searching for ${searchTerm}`);
                axios
                    .patch(
                        `http://localhost:5000/api/v1/contact/searchContacts`,
                        {
                            query: searchTerm,
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                            },
                        }
                    )
                    .then((res) => {
                        console.log(res.data)
                        const concat = (res.data.phoneNumberResults.concat(res.data.nameResults))
                        concat.sort()
                        setContacts(concat);
                        console.log('concat', concat);
                        if (concat.length === 0) {
                            toast.error('No results found');
                        } else {

                            toast.success('Search successful');
                        }
                    })
                    .catch((err) => {
                        console.log(err)
                        toast.error(err.response.data.message);
                    });
            }
        }, 1000);

        return () => {
            clearTimeout(timerId);
        };
    }, [searchTerm]);


    useEffect(() => {
        if (searchTerm === "") {
            setContacts([]);
        }
    }, [searchTerm]);



    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        // console.log(`Searching for ${searchTerm}`);
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

    const handleContactClick = (contact) => {
        setSelectedContact(contact);
    };

    const closeModal = () => {
        setSelectedContact(null);
    };


    return (
        <div className=" bg-gray-100 dark:bg-gray-900">
            <div className="max-w-md mx-auto py-8 px-4">
                <h2 className="text-3xl font-bold mb-4 text-center text-gray-800 dark:text-gray-200">
                    Global Contacts
                </h2>
                <input
                    type="text"
                    placeholder="Search Global contacts"
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full px-3 py-2 rounded-md border-gray-300 focus:outline-none focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:focus:border-indigo-400 dark:text-gray-200"
                />
                <ul className="mt-4">
                    {contacts.map((contact, index) => (
                        <li
                            key={`${contact._id}-${index}`}
                            className="flex items-center justify-between py-2 border-b border-gray-300"
                        >
                            <div
                                onClick={() => handleContactClick(contact)}
                                className="cursor-pointer"
                            >
                                <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
                                    {/* {typeof contact.name === 'Array' ? contact.name : contact.name} */}
                                    {/* {contact.name[0]} */}
                                    {Array.isArray(contact.name) ? contact.name[0] : contact.name}
                                </p>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {contact.phoneNumber}
                                </p>
                            </div>
                            <div>
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
            </div>
            {selectedContact && (
                <ContactModal contact={selectedContact} closeModal={closeModal} />
            )}
        </div>
    );
}

export default GlobalSearch;
