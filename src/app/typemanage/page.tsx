'use client';
import React, { useEffect, useState } from 'react';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Swal from 'sweetalert2';
import axios from 'axios';

interface Type {
    category_id: number;
    category_name: string;
    total: number; // Assuming you want a "total" field to represent additional data
}

function Typemanage() {
    const [type, setType] = useState<Type[]>([]);
    const [search, setSearch] = useState<string>(''); // State for search

    // Fetch categories from API
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('/api/categories');
                const categories = response.data.map((category: any) => ({
                    category_id: category.category_id,
                    category_name: category.category_name,
                    total: category.Products ? category.Products.length : 0, // If "Products" relation exists
                }));
                setType(categories);
            } catch (error) {
                console.error('Error fetching categories:', error);
                alert('Failed to fetch categories. Please try again later.');
            }
        };

        fetchCategories();
    }, []);

    // Add a new category
    function addType() {
        Swal.fire({
            title: 'Add Type',
            input: 'text',
            inputLabel: 'Type Name',
            showCancelButton: true,
            confirmButtonText: 'Add',
            showLoaderOnConfirm: true,
            allowOutsideClick: () => !Swal.isLoading(),
        }).then(async (result) => {
            if (result.isConfirmed && result.value) {
                try {
                    const response = await axios.post('/api/categories', {
                        category_name: result.value,
                    });

                    const newCategory = response.data;
                    setType((prevType) => [
                        ...prevType,
                        { ...newCategory, total: 0 },
                    ]);
                    Swal.fire('Success!', `Category Added: ${result.value}`, 'success');
                } catch (error) {
                    console.error('Error adding category:', error);
                    Swal.fire('Error', 'Failed to add category', 'error');
                }
            }
        });
    }

    // Remove a category
    function removeType(id: number) {
        Swal.fire({
            title: 'Are you sure?',
            text: `You will remove ${type.find((type) => type.category_id === id)?.category_name} from the list`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete('/api/categories', { data: { category_id: id } });

                    setType((prevType) =>
                        prevType.filter((item) => item.category_id !== id)
                    );
                    Swal.fire('Deleted!', 'Your category has been removed.', 'success');
                } catch (error) {
                    console.error('Error deleting category:', error);
                    Swal.fire('Error', 'Failed to delete category', 'error');
                }
            }
        });
    }

    // Edit a category
    function editType(id: number) {
        const currentType = type.find((item) => item.category_id === id);
        if (!currentType) return;

        Swal.fire({
            title: 'Edit Type Name',
            input: 'text',
            inputLabel: 'Type Name',
            inputValue: currentType.category_name,
            showCancelButton: true,
            confirmButtonText: 'Edit',
            showLoaderOnConfirm: true,
            allowOutsideClick: () => !Swal.isLoading(),
        }).then(async (result) => {
            if (result.isConfirmed && result.value) {
                try {
                    const response = await axios.put('/api/categories', {
                        category_id: id,
                        category_name: result.value,
                    });

                    setType((prevType) =>
                        prevType.map((item) =>
                            item.category_id === id
                                ? { ...item, category_name: response.data.category_name }
                                : item
                        )
                    );
                    Swal.fire('Success!', `Category Edited: ${result.value}`, 'success');
                } catch (error) {
                    console.error('Error editing category:', error);
                    Swal.fire('Error', 'Failed to edit category', 'error');
                }
            }
        });
    }

    // Filter categories
    const filteredTypes = type.filter((item) =>
        item.category_name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <main>
            <div>
                <div>
                    <h1 className="text-4xl pl-10 font-bold text-blue-500">Categories</h1>
                </div>
                <div className="divider"></div>
                <div className="flex justify-center items-center w-svw px-10 pb-10">
                    <input
                        type="text"
                        placeholder="Search"
                        className="input input-bordered w-full"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button
                        className="flex justify-center items-center btn ml-4"
                        onClick={addType}
                    >
                        <FontAwesomeIcon icon={faPlus} />
                        NEW
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto px-10">
                <table className="table">
                    {/* head */}
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Total</th>
                            <th className="text-center">Edit</th>
                            <th className="text-center">Remove</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTypes.map((item, index) => (
                            <tr key={item.category_id} className="hover">
                                <th>{index + 1}</th>
                                <td>{item.category_id}</td>
                                <td>{item.category_name}</td>
                                <td>{item.total}</td>
                                <td className="text-center">
                                    <button
                                        className="btn btn-sm btn-warning"
                                        onClick={() => editType(item.category_id)}
                                    >
                                        Edit
                                    </button>
                                </td>
                                <td className="text-center">
                                    <button
                                        className="btn btn-sm btn-error"
                                        onClick={() => removeType(item.category_id)}
                                    >
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    );
}

export default Typemanage;
