'use client';
import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

interface EditOrderProps {
  id: string;
  name: string;
  supplier_id: string;
  product: string;
  product_id: string;
  quantity: number;
  status: string;
  date: string;
}

function EditOrderModal({
    id,
    name,
    supplier_id,
    product,
    product_id,
    quantity,
    status,
    date,
  }: EditOrderProps) {
    const [editableStatus, setEditableStatus] = useState(status); // Editable state for status
    const [editableDate, setEditableDate] = useState(date); // Editable state for date
  
    const handleEditOrder = async () => {
      const payload = {
        order_id: id,
        supplier_id: parseInt(supplier_id, 10),
        product_id: parseInt(product_id, 10),
        quantity,
        order_date: new Date(editableDate).toISOString(), // Convert date to ISO 8601 format
        status: editableStatus,
      };
  
      console.log('Sending payload to API:', payload);
  
      try {
        const response = await axios.put(`/api/orders`, payload, {
          headers: { 'Content-Type': 'application/json' },
        });
        console.log('Response from API:', response.data);
  
        // If status is completed, update the stock
        if (editableStatus === 'completed') {
          const stockPayload = {
            product_id: parseInt(product_id, 10),
            quantity: quantity,
          };
          console.log('Updating stock with payload:', stockPayload);
  
          await axios.put('/api/stock', stockPayload, {
            headers: { 'Content-Type': 'application/json' },
          });
          console.log('Stock updated successfully.');
        }
  
        Swal.fire('Success', 'Order updated successfully!', 'success');
        (document.getElementById('edit_order_modal') as HTMLDialogElement)?.close();
        window.location.reload();
      } catch (error) {
        console.error('Error updating order or stock:', error);
        Swal.fire('Error', 'Failed to update order.', 'error');
      }
    };
  
    return (
      <div>
        <h3 className="mb-4 font-bold text-lg">Edit Order</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block mb-1 font-medium">
              Distributor Name
            </label>
            <input
              type="text"
              id="name"
              defaultValue={name} // Use defaultValue for read-only fields
              className="input input-bordered w-full"
              readOnly
            />
          </div>
          <div>
            <label htmlFor="product" className="block mb-1 font-medium">
              Product
            </label>
            <input
              type="text"
              id="product"
              defaultValue={product} // Use defaultValue for read-only fields
              className="input input-bordered w-full"
              readOnly
            />
          </div>
          <div>
            <label htmlFor="quantity" className="block mb-1 font-medium">
              Quantity
            </label>
            <input
              type="number"
              id="quantity"
              defaultValue={quantity} // Use defaultValue for read-only fields
              className="input input-bordered w-full"
              readOnly
            />
          </div>
          <div>
            <label htmlFor="status" className="block mb-1 font-medium">
              Status
            </label>
            <select
              id="status"
              value={editableStatus} // Controlled field with state
              onChange={(e) => setEditableStatus(e.target.value)} // Update state on change
              className="select select-bordered w-full"
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label htmlFor="date" className="block mb-1 font-medium">
              Order Date
            </label>
            <input
              type="date"
              id="date"
              value={editableDate} // Controlled input for editable date
              onChange={(e) => setEditableDate(e.target.value)} // Update date state on change
              className="input input-bordered w-full"
            />
          </div>
        </div>
        <div className="modal-action mt-4">
          <button className="btn btn-primary" onClick={handleEditOrder}>
            Save
          </button>
        </div>
      </div>
    );
  }
  
  export default EditOrderModal;
  
