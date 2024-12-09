import React, { useState } from 'react';
import axios from 'axios'; // Import Axios

function AddDisModal() {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');

    const handleAdd = async () => {
        try {
            // Call the API to add a new distributor
            const response = await axios.post('/api/suppliers', {
                company_name: name,
                address,
                contact_number: phone,
                contact_email: email,
            });
    
            if (response.status === 201) {
                alert('Distributor added successfully!');
                window.location.reload(); // Refresh the page after adding
            }
        } catch (error) {
            console.error('Error adding distributor:', error);
            alert('Failed to add distributor. Please try again.');
        }
    };
    

    return (
        <div>
            <h3 className="font-bold text-lg">Add new distributor</h3>
            <p className="py-4">Please Enter data of distributor</p>
            <div className="mb-5">
                <label htmlFor="name" className="block mb-2">
                    Name
                </label>
                <input
                    type="text"
                    id="name"
                    className="input ring-2 ring-gray-300 w-full"
                    value={name}
                    onChange={(e) => setName(e.target.value)} // Update state
                />
            </div>
            <div className="mb-5">
                <label htmlFor="address" className="block mb-2">
                    Address
                </label>
                <input
                    type="text"
                    id="address"
                    className="input ring-2 ring-gray-300 w-full"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)} // Update state
                />
            </div>
            <div className="mb-5">
                <label htmlFor="phone" className="block mb-2">
                    Phone
                </label>
                <input
                    type="text"
                    id="phone"
                    className="input ring-2 ring-gray-300 w-full"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)} // Update state
                />
            </div>
            <div className="mb-5">
                <label htmlFor="email" className="block mb-2">
                    Email
                </label>
                <input
                    type="text"
                    id="email"
                    className="input ring-2 ring-gray-300 w-full"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} // Update state
                />
            </div>

            <div className="modal-action">
                <button className="btn bg-green-400" onClick={handleAdd}>
                    Add
                </button>
            </div>
        </div>
    );
}

export default AddDisModal;
