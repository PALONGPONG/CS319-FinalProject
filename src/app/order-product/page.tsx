'use client';
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import axios from "axios";
import AddOrderModal from "../componant/add_order_modal";
import EditOrderModal from "../componant/edit_order_modal";
import Swal from "sweetalert2";

interface Order {
  id: string;
  name: string;
  supplier_id: string | number; // Allow both string and number
  product: string;
  product_id: string | number; // Allow both string and number
  quantity: number;
  status: string;
  date: string;
}

export default function Order() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState<string>(""); // State for search
  const [idEditSelected, setIdEditSelected] = useState<string>(""); // Selected ID for editing

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("/api/orders");
        console.log("API Response:", response.data);

        // Map the API response to match the Order interface
        const transformedOrders = response.data.map((order: any) => ({
          id: order.order_id || "N/A", // Map order ID
          name: order.Suppliers?.company_name || "Unknown", // Map supplier name
          supplier_id: order.Suppliers?.supplier_id || "", // Include supplier ID
          product: order.Products?.product_name || "Unknown", // Map product name
          product_id: order.Products?.product_id || "", // Include product ID
          quantity: order.quantity || 0, // Map quantity
          status: order.status || "pending", // Map status
          date: order.order_date ? new Date(order.order_date).toLocaleString() : "No Date", // Map and format order date
        }));

        setOrders(transformedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
        Swal.fire("Error", "Failed to fetch orders. Please try again later.", "error");
      }
    };

    fetchOrders();
  }, []);

  // Filter orders based on search query
  const filteredOrders = orders.filter((item) => {
    const name = item.name || ""; // Ensure no undefined
    const id = item.id || ""; // Ensure no undefined
    const product = item.product || ""; // Ensure no undefined
    const status = item.status || ""; // Ensure no undefined

    return (
      name.toLowerCase().includes(search.toLowerCase()) ||
      id.toString().toLowerCase().includes(search.toString().toLowerCase()) ||
      product.toLowerCase().includes(search.toLowerCase()) ||
      status.toLowerCase().includes(search.toLowerCase())
    );
  });

  // Handle remove action
  const onClickRemove = async (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: `You will remove ${orders.find((order) => order.id === id)?.name} from the list`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Call API to delete order
          await axios.delete(`/api/orders/`,
            { data: { order_id: id } }
          );
          setOrders((prevOrders) => prevOrders.filter((item) => item.id !== id));
          Swal.fire("Deleted!", "Your order has been removed.", "success");
        } catch (error) {
          console.error("Error deleting order:", error);
          Swal.fire("Error", "Failed to delete order", "error");
        }
      }
    });
  };

  return (
    <main>
      <div>
        <div className="">
          <h1 className="text-4xl pl-10 font-bold text-blue-500">All Orders</h1>
        </div>
        <div className="divider"></div>
        <div className="flex justify-center items-center w-svw px-10 pb-10">
          <input
            type="text"
            placeholder="Search"
            className="input input-bordered w-full"
            value={search} // Bind search state
            onChange={(e) => setSearch(e.target.value.toString())} // Update search state
          />
          <button
            className="flex justify-center items-center btn ml-4"
            onClick={() =>
              (document.getElementById("add_order_modal") as HTMLDialogElement)?.showModal()
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
            {/* head */}
            <thead>
              <tr>
                <th>No.</th>
                <th>ID</th>
                <th>Distributor Name</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Order Date</th>
                <th>Status</th>
                <th className="text-center">Edit</th>
                <th className="text-center">Remove</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((item, index) => (
                <tr key={item.id || index}>
                  <th>{index + 1}</th>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.product}</td>
                  <td>{item.quantity}</td>
                  <td>{item.date}</td>
                  <td>
                    <span
                      className={`badge ${
                        item.status === "pending"
                          ? "bg-yellow-500 text-black"
                          : item.status === "completed"
                          ? "bg-green-500 text-white"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="text-center">
                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() => {
                        setIdEditSelected(item.id);
                        (document.getElementById("edit_order_modal") as HTMLDialogElement)?.showModal();
                      }}
                    >
                      Edit
                    </button>
                  </td>
                  <td className="text-center">
                    <button
                      className="btn btn-sm btn-error"
                      onClick={() => onClickRemove(item.id)}
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
      <dialog id="add_order_modal" className="modal">
        <div className="modal-box">
          <AddOrderModal
            onAddOrder={(newOrder) => {
              try {
                axios.post("/api/orders", newOrder).then((response) => {
                  setOrders((prevOrders) => [
                    ...prevOrders,
                    {
                      id: response.data.order_id,
                      name: response.data.Suppliers?.company_name || newOrder.supplier_id.toString(),
                      product: response.data.Products?.product_name || newOrder.product_id.toString(),
                      supplier_id: newOrder.supplier_id,
                      product_id: newOrder.product_id,
                      quantity: newOrder.quantity,
                      status: newOrder.status,
                      date: new Date(newOrder.order_date).toLocaleString(),
                    },
                  ]);
                });
              } catch (error) {
                console.error("Error adding new order:", error);
                Swal.fire("Error", "Failed to add order. Please try again later.", "error");
              }
            }}
          />
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>Close</button>
        </form>
      </dialog>
      <dialog id="edit_order_modal" className="modal">
        <div className="modal-box">
          {orders.find((order) => order.id === idEditSelected) && (
            <EditOrderModal
            id={idEditSelected}
            name={orders.find((order) => order.id === idEditSelected)?.name || ""}
            supplier_id={
              String(orders.find((order) => order.id === idEditSelected)?.supplier_id || "")
            } // Convert to string
            product={orders.find((order) => order.id === idEditSelected)?.product || ""}
            product_id={
              String(orders.find((order) => order.id === idEditSelected)?.product_id || "")
            } // Convert to string
            quantity={orders.find((order) => order.id === idEditSelected)?.quantity || 0}
            status={orders.find((order) => order.id === idEditSelected)?.status || "pending"}
            date={orders.find((order) => order.id === idEditSelected)?.date || ""}
          />
          
          )}
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>Close</button>
        </form>
      </dialog>
    </main>
  );
}
