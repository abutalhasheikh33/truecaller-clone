import React, { useEffect, useState } from "react";
import axios from "axios"; // Import Axios library
import { debounce, set } from "lodash"; // Import debounce function from lodash
import ContactModal from "./ContactModal";

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
                        console.log(res.data);
                    })
                    .catch((err) => console.log(err));
            }
        }, 1000);

        return () => {
            clearTimeout(timerId);
        };
    }, [searchTerm]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        // console.log(`Searching for ${searchTerm}`);
    };

    const handleSpam = (id) => {
        console.log(`Marked contact with ID ${id} as spam`);
    };

    const handleContactClick = (contact) => {
        setSelectedContact(contact);
    };

    const closeModal = () => {
        setSelectedContact(null);
    };

    const filteredContacts = contacts.filter(
        (contact) =>
            contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contact.phoneNumber.includes(searchTerm)
    );

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
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
                    {filteredContacts.map((contact) => (
                        <li
                            key={contact.id}
                            className="flex items-center justify-between py-2 border-b border-gray-300"
                        >
                            <div
                                onClick={() => handleContactClick(contact)}
                                className="cursor-pointer"
                            >
                                <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
                                    {contact.name}
                                </p>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {contact.phoneNumber}
                                </p>
                            </div>
                            <div>
                                <button
                                    onClick={() => handleSpam(contact.id)}
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
