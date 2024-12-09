'use client';

import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Add_dis_modal from '../componant/add_dis_modal';
import Edit_dis_modal from '../componant/edit_dis_modal';
import Swal from 'sweetalert2';

interface Distributor {
    supplier_id: number;
    company_name: string;
    address: string;
    contact_number: string;
    contact_email: string;
}

function Distributor() {
    const [distributor, setDistributor] = useState<Distributor[]>([]);
    const [search, setSearch] = useState<string>(''); // State for search
    const [idediteselected, setidediteselected] = useState<number | null>(null); // Selected ID for editing

    // Load distributors data from API
    useEffect(() => {
        const fetchDistributors = async () => {
            try {
                const response = await axios.get('/api/suppliers'); // Call the Suppliers API
                setDistributor(response.data); // Set the fetched data in state
            } catch (error) {
                console.error('Error fetching distributors:', error);
                Swal.fire('Error', 'Failed to fetch distributors. Please try again later.', 'error');
            }
        };

        fetchDistributors();
    }, []);

    // Filter distributors based on search query
    const filteredDistributor = distributor.filter((item) =>
        item.company_name.toLowerCase().includes(search.toLowerCase()) ||
        item.supplier_id.toString().includes(search) ||
        (item.address && item.address.toLowerCase().includes(search.toLowerCase())) ||
        (item.contact_number && item.contact_number.includes(search)) ||
        (item.contact_email && item.contact_email.toLowerCase().includes(search.toLowerCase()))
    );

    // Handle remove action
    function onclickremove(supplier_id: number) {
    Swal.fire({
        title: 'Are you sure?',
        text: `You will remove ${distributor.find((dist) => dist.supplier_id === supplier_id)?.company_name} from the list.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                // Call the DELETE API
                await axios.delete('/api/suppliers', {
                    data: { supplier_id }, // Pass supplier_id in the request body
                });

                Swal.fire('Deleted!', 'The distributor has been removed.', 'success');

                // Refresh the page to reflect changes
                window.location.reload();
            } catch (error) {
                console.error('Error deleting distributor:', error);
                Swal.fire('Error', 'Failed to delete distributor. Please try again.', 'error');
            }
        }
    });
}


    return (
        <main>
            <div>
                <h1 className="text-4xl pl-10 font-bold text-blue-500">All Distributors</h1>
                <div className="divider"></div>
                <div className="flex justify-center items-center w-svw px-10 pb-10">
                    <input
                        type="text"
                        placeholder="Search"
                        className="input input-bordered w-full"
                        value={search} // Bind search state
                        onChange={(e) => setSearch(e.target.value)} // Update search state
                    />
                    <button
                        className="flex justify-center items-center btn ml-4"
                        onClick={() =>
                            (document.getElementById('dis_modal') as HTMLDialogElement)?.showModal()
                        }
                    >
                        <FontAwesomeIcon icon={faPlus} />
                        NEW
                    </button>
                </div>
            </div>
            <div>
                <div className="overflow-x-auto px-10">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Address</th>
                                <th>Phone</th>
                                <th>Email</th>
                                <th className="text-center">Edit</th>
                                <th className="text-center">Remove</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDistributor.map((item, index) => (
                                <tr key={item.supplier_id} className="hover">
                                    <th>{index + 1}</th>
                                    <td>{item.supplier_id}</td>
                                    <td>{item.company_name}</td>
                                    <td>{item.address || 'N/A'}</td>
                                    <td>{item.contact_number || 'N/A'}</td>
                                    <td>{item.contact_email || 'N/A'}</td>
                                    <td className="text-center">
                                        <button
                                            className="btn btn-sm btn-warning"
                                            onClick={() => {
                                                setidediteselected(item.supplier_id);
                                                (document.getElementById('edit_dis_modal') as HTMLDialogElement)?.showModal();
                                            }}
                                        >
                                            Edit
                                        </button>
                                    </td>
                                    <td className="text-center">
                                        <button
                                            className="btn btn-sm btn-error"
                                            onClick={() => onclickremove(item.supplier_id)}
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <dialog id="dis_modal" className="modal">
                <div className="modal-box">
                    <Add_dis_modal />
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
            <dialog id="edit_dis_modal" className="modal">
                <div className="modal-box">
                    {idediteselected !== null &&
                        distributor.find((dist) => dist.supplier_id === idediteselected) && (
                            <Edit_dis_modal
                                id={idediteselected.toString()}
                                name={
                                    distributor.find((dist) => dist.supplier_id === idediteselected)
                                        ?.company_name || ''
                                }
                                address={
                                    distributor.find((dist) => dist.supplier_id === idediteselected)
                                        ?.address || ''
                                }
                                phone={
                                    distributor.find((dist) => dist.supplier_id === idediteselected)
                                        ?.contact_number || ''
                                }
                                email={
                                    distributor.find((dist) => dist.supplier_id === idediteselected)
                                        ?.contact_email || ''
                                }
                                total={0} // Adjust as per requirements
                            />
                        )}
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </main>
    );
}

export default Distributor;
