import React, { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";

interface AddOrderModalProps {
  onAddOrder: (newOrder: {
    supplier_id: number;
    product_id: number;
    quantity: number;
    status: string;
    order_date: string;
  }) => void;
}

function AddOrderModal({ onAddOrder }: AddOrderModalProps) {
  const [distributors, setDistributors] = useState<{ value: number; label: string }[]>([]);
  const [products, setProducts] = useState<{ value: number; label: string }[]>([]);
  const [selectedDistributor, setSelectedDistributor] = useState<{
    value: number;
    label: string;
  } | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<{
    value: number;
    label: string;
  } | null>(null);
  const [quantity, setQuantity] = useState<number>(0);
  const [status, setStatus] = useState("pending");
  const [orderDate, setOrderDate] = useState("");

  useEffect(() => {
    const fetchDistributors = async () => {
      try {
        const response = await axios.get("/api/suppliers");
        const options = response.data.map((supplier: any) => ({
          value: supplier.supplier_id,
          label: supplier.company_name,
        }));
        setDistributors(options);
      } catch (error) {
        console.error("Error fetching distributors:", error);
        alert("Failed to fetch distributors.");
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/products");
        const options = response.data.map((product: any) => ({
          value: product.product_id,
          label: product.product_name,
        }));
        setProducts(options);
      } catch (error) {
        console.error("Error fetching products:", error);
        alert("Failed to fetch products.");
      }
    };

    fetchDistributors();
    fetchProducts();
  }, []);

  const handleAdd = () => {
    if (!selectedDistributor || !selectedProduct) {
      alert("Please select a distributor and product.");
      return;
    }

    const newOrder = {
      supplier_id: selectedDistributor.value,
      product_id: selectedProduct.value,
      quantity,
      status,
      order_date: orderDate ? new Date(orderDate).toISOString() : new Date().toISOString(),
    };

    console.log(newOrder);
    onAddOrder(newOrder);
    (document.getElementById("add_order_modal") as HTMLDialogElement)?.close();
  };

  return (
    <div>
      <h3 className="mb-4 font-bold text-lg">Add New Order</h3>
      <div className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Distributor</label>
          <Select
            options={distributors}
            value={selectedDistributor}
            onChange={(option) => setSelectedDistributor(option)}
            placeholder="Select Distributor"
            instanceId="distributor-select" // Static instanceId
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Product</label>
          <Select
            options={products}
            value={selectedProduct}
            onChange={(option) => setSelectedProduct(option)}
            placeholder="Select Product"
            instanceId="product-select" // Static instanceId
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Quantity</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="input input-bordered w-full"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="select select-bordered w-full"
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium">Order Date</label>
          <input
            type="date"
            value={orderDate}
            onChange={(e) => setOrderDate(e.target.value)}
            className="input input-bordered w-full"
          />
        </div>
      </div>
      <div className="modal-action mt-4">
        <button className="btn btn-primary" onClick={handleAdd}>
          Add
        </button>
      </div>
    </div>
  );
}

export default AddOrderModal;
