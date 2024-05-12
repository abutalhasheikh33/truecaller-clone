import React, { useState } from 'react';

function ContactsList() {
    const [contacts, setContacts] = useState([
        { id: 1, name: 'Rudra', phone: '+911234567890' },
        { id: 2, name: 'Abu Talha', phone: '+910987654321' },
    ]);

    const handleDelete = (id) => {
        setContacts((prevContacts) => prevContacts.filter((contact) => contact.id !== id));
    };

    const handleSpam = (id) => {
        console.log(`Marked contact with ID ${id} as spam`);
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
                        <li key={contact.id} className="flex items-center justify-between py-2 border-b border-gray-300">
                            <div>
                                <p className="text-lg font-medium text-gray-800 dark:text-gray-200">{contact.name}</p>
                                <p className="text-gray-600 dark:text-gray-400">{contact.phone}</p>
                            </div>
                            <div>
                                <button
                                    onClick={() => handleDelete(contact.id)}
                                    className="px-3 py-1 mr-2 bg-red-500 text-white rounded-md"
                                >
                                    Delete
                                </button>
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
                <div className="mt-8">
                    <button
                        onClick={handleAddContact}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md"
                    >
                        Add Contact
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ContactsList;
