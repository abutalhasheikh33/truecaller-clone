import React from 'react';

function ContactModal({ contact, closeModal }) {
    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 space-y-2 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4">{contact.name}</h2>
                <p className="text-gray-600">Phone No: {contact.phoneNumber}</p>
                <p className="text-gray-600">Country: India</p>
                <p className="text-gray-600 pb-6">City: Mumbai</p>
                <button onClick={closeModal} className="px-4 py-2 bg-indigo-600 text-white rounded-md">
                    Close
                </button>
            </div>
        </div>
    );
}

export default ContactModal;
