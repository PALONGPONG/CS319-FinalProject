import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Distributor {
    id: string;
    name: string;
    address: string;
    phone: string;
    email: string;
    total: number;
}

function EditDisModal(data: Distributor) {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        setName(data.name);
        setAddress(data.address);
        setPhone(data.phone);
        setEmail(data.email);
    }, [data]);

    const handleEdit = async () => {
        try {
            await axios.put('/api/suppliers', {
                supplier_id: data.id, // Use `id` as `supplier_id`
                company_name: name,
                address,
                contact_number: phone,
                contact_email: email,
            });

            alert('Distributor updated successfully!');
            window.location.reload(); // Refresh page to reflect updated data
        } catch (error) {
            console.error('Error updating distributor:', error);
            alert('Failed to update distributor. Please try again.');
        }
    };

    return (
        <div>
            <h3 className="font-bold text-lg">Edit Distributor</h3>
            <p className="py-4">Please update the distributor's details</p>
            {/* Name Input */}
            <div className="mb-5">
                <label htmlFor="name" className="block mb-2">
                    Name
                </label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)} // Update state
                    className="input ring-2 ring-gray-300 w-full"
                />
            </div>
            {/* Address Input */}
            <div className="mb-5">
                <label htmlFor="address" className="block mb-2">
                    Address
                </label>
                <input
                    type="text"
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)} // Update state
                    className="input ring-2 ring-gray-300 w-full"
                />
            </div>
            {/* Phone Input */}
            <div className="mb-5">
                <label htmlFor="phone" className="block mb-2">
                    Phone
                </label>
                <input
                    type="text"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)} // Update state
                    className="input ring-2 ring-gray-300 w-full"
                />
            </div>
            {/* Email Input */}
            <div className="mb-5">
                <label htmlFor="email" className="block mb-2">
                    Email
                </label>
                <input
                    type="text"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} // Update state
                    className="input ring-2 ring-gray-300 w-full"
                />
            </div>
            {/* Modal Action */}
            <div className="modal-action">
                <button className="btn bg-green-400" onClick={handleEdit}>
                    Save Changes
                </button>
            </div>
        </div>
    );
}

export default EditDisModal;
