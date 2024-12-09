'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Props {
    name: string;
    type: string;
    distributor: string;
    position: string;
    price: number;
    minimumStock: number;
    productId: number;
}

function EditModal({ name: initialName, type: initialType, distributor: initialDistributor, position: initialPosition, price: initialPrice, minimumStock: initialMinimumStock, productId }: Props) {
    const [name, setName] = useState(initialName || '');
    const [type, setType] = useState(initialType || '');
    const [distributor, setDistributor] = useState(initialDistributor || '');
    const [position, setPosition] = useState(initialPosition || '');
    const [price, setPrice] = useState(initialPrice || 0);
    const [minimumStock, setMinimumStock] = useState(initialMinimumStock || 0);
    const [typeForSelect, setTypeForSelect] = useState<{ value: string; label: string }[]>([]);
    const [distributorForSelect, setDistributorForSelect] = useState<{ value: string; label: string }[]>([]);

    // Fetch categories and distributors
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch categories (types)
                const categoriesResponse = await axios.get('/api/categories');
                const categories = categoriesResponse.data.map((category: any) => ({
                    value: category.category_id.toString(),
                    label: category.category_name,
                }));
                setTypeForSelect(categories);

                // Fetch distributors
                const distributorsResponse = await axios.get('/api/suppliers');
                const distributors = distributorsResponse.data.map((distributor: any) => ({
                    value: distributor.supplier_id.toString(),
                    label: distributor.company_name,
                }));
                setDistributorForSelect(distributors);
            } catch (error) {
                console.error('Error fetching data:', error);
                alert('Failed to fetch data. Please try again later.');
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        // Update state when the props change
        setName(initialName);
        setType(initialType);
        setDistributor(initialDistributor);
        setPosition(initialPosition);
        setPrice(initialPrice);
        setMinimumStock(initialMinimumStock);
    }, [initialName, initialType, initialDistributor, initialPosition, initialPrice, initialMinimumStock]);

    // Handle edit product
   const handleEdit = async () => {
    try {
        const productPayload = {
            product_id: productId, // Pass product_id
            product_name: name,
            category_id: parseInt(type), // Convert type (category) to integer
            supplier_id: parseInt(distributor), // Convert distributor (supplier) to integer
            position,
            price,
        };

        console.log('Product Payload Sent:', productPayload);

        // Call edit product API
        await axios.put(`/api/products`, productPayload, {
            headers: { 'Content-Type': 'application/json' },
        });

        // Update stock information (optional)
        const stockPayload = {
            product_id: productId, // Use the same product_id
            low_stock_level: minimumStock,
        };

        console.log('Stock Payload Sent:', stockPayload);

        await axios.put('/api/stock', stockPayload, {
            headers: { 'Content-Type': 'application/json' },
        });

        alert('Product and stock updated successfully!');
        (document.getElementById('Edit_modal') as HTMLDialogElement)?.close(); // Close modal
        window.location.reload(); // Refresh the page
    } catch (error) {
        console.error('Error updating product and stock:', error);
        alert('Failed to update product. Please try again.');
    }
};


    return (
        <div>
            <h3 className="font-bold text-lg">Edit Product</h3>
            <p className="py-4">Please update your product details</p>

            {/* Product Information */}
            <div>
                <h4 className="font-bold text-md mb-4">Product Information</h4>
                {/* Name Input */}
                <div className="mb-5">
                    <label htmlFor="name" className="block mb-2">Name</label>
                    <input
                        type="text"
                        id="name"
                        className="input ring-2 ring-gray-300 w-full"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                {/* Type Dropdown */}
                <div className="mb-5">
                    <label htmlFor="type" className="block mb-2">Type</label>
                    <div className="dropdown w-full">
                        <div
                            tabIndex={0}
                            role="button"
                            className="btn w-full ring-2 ring-gray-300"
                        >
                            {typeForSelect.find((cat) => cat.value === type)?.label || 'Select Type'}
                        </div>
                        <ul
                            tabIndex={0}
                            className="dropdown-content flex flex-col bg-base-100 rounded-box z-[1] w-full p-2 shadow max-h-40 overflow-y-auto mt-4"
                        >
                            {typeForSelect.map((typeItem) => (
                                <li key={typeItem.value} className="menu-title">
                                    <button
                                        onClick={() => setType(typeItem.value)}
                                        className="p-3 text-left w-full hover:bg-base-200"
                                    >
                                        {typeItem.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Distributor Dropdown */}
                <div className="mb-5">
                    <label htmlFor="distributor" className="block mb-2">Distributor</label>
                    <div className="dropdown w-full">
                        <div
                            tabIndex={0}
                            role="button"
                            className="btn w-full ring-2 ring-gray-300"
                        >
                            {distributorForSelect.find((dist) => dist.value === distributor)?.label || 'Select Distributor'}
                        </div>
                        <ul
                            tabIndex={0}
                            className="dropdown-content flex flex-col bg-base-100 rounded-box z-[1] w-full p-2 shadow max-h-40 overflow-y-auto mt-4"
                        >
                            {distributorForSelect.map((distributorItem) => (
                                <li key={distributorItem.value} className="menu-title">
                                    <button
                                        onClick={() => setDistributor(distributorItem.value)}
                                        className="p-3 text-left w-full hover:bg-base-200"
                                    >
                                        {distributorItem.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Position Input */}
                <div className="mb-5">
                    <label htmlFor="position" className="block mb-2">Position</label>
                    <input
                        type="text"
                        id="position"
                        className="input ring-2 ring-gray-300 w-full"
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                    />
                </div>

                {/* Price Input */}
                <div className="mb-5">
                    <label htmlFor="price" className="block mb-2">Price</label>
                    <input
                        type="number"
                        id="price"
                        className="input ring-2 ring-gray-300 w-full"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                    />
                </div>
            </div>

            {/* Stocking Information */}
            <div>
                <h4 className="font-bold text-md mb-4 mt-6">Stocking Information</h4>
                {/* Minimum Stock Input */}
                <div className="mb-5">
                    <label htmlFor="minimumStock" className="block mb-2">Minimum Stock</label>
                    <input
                        type="number"
                        id="minimumStock"
                        className="input ring-2 ring-gray-300 w-full"
                        value={minimumStock}
                        onChange={(e) => setMinimumStock(Number(e.target.value))}
                    />
                </div>
            </div>

            {/* Modal Actions */}
            <div className="modal-action">
                <button type="button" className="btn bg-green-200 w-20" onClick={handleEdit}>
                    Save
                </button>
            </div>
        </div>
    );
}

export default EditModal;
