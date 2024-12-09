'use client';
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import axios from "axios";
import Add_modal from "./componant/add_modal";
import Edit_modal from "./componant/edit_modal";
import Swal from "sweetalert2";

interface Product {
  id: string;
  name: string;
  type: string;
  distributor: string;
  position: string;
  price: number;
  total: number;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [idselected, setIdselected] = useState<string>("");

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/products");
        const data = response.data;

        console.log("Fetched Products:", data);

        // Map API response to match the Product interface
        const transformedProducts = data.map((product: any) => ({
          id: product.product_id,
          name: product.product_name,
          type: product.Categories?.category_name || "N/A", // Map category name
          distributor: product.supplier_id || "N/A", // Map distributor (supplier_id)
          position: product.position,
          price: product.price,
          total: product.Stock?.[0]?.quantity || 0, // Map stock quantity
        }));

        setProducts(transformedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
        Swal.fire("Error", "Failed to fetch products. Please try again later.", "error");
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on the search query
  const filteredProducts = products.filter(product => {
    const name = product.name || ""; // Default to empty string if undefined
    const type = product.type || ""; // Default to empty string if undefined
    const distributor = (product.distributor || "").toString().toLowerCase();
    const position = product.position || ""; // Default to empty string if undefined
    const price = product.price?.toString() || ""; // Convert to string or default to empty string
    const total = product.total?.toString() || ""; // Convert to string or default to empty string
    const id = (product.id || "").toString().toLowerCase(); // Default to empty string if undefined

    return (
      name.toLowerCase().includes(search.toLowerCase()) ||
      type.toLowerCase().includes(search.toLowerCase()) ||
      distributor.toLowerCase().includes(search.toLowerCase()) ||
      position.toLowerCase().includes(search.toLowerCase()) ||
      price.toLowerCase().includes(search.toLowerCase()) ||
      total.toLowerCase().includes(search.toLowerCase()) ||
      id.toLowerCase().includes(search.toLowerCase())
    );
  });

  const onclickremove = (id: string) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `You will remove ${products.find(product => product.id === id)?.name} from the list.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Call the DELETE API
          await axios.delete(`/api/products`, {
            data: { product_id: id }, // Pass the product ID in the request body
          });
  
          // Remove the product locally from the state
          setProducts((prevProducts) =>
            prevProducts.filter((product) => product.id !== id)
          );
  
          Swal.fire('Deleted!', 'The product has been removed.', 'success');
        } catch (error) {
          console.error('Error deleting product:', error);
          Swal.fire('Error!', 'Failed to delete the product. Please try again.', 'error');
        }
      }
    });
  };
  

  const onclicksell = async (id: string) => {
    const product = products.find(product => product.id === id);
  
    if (product && product.total > 0) {
      let sellAmount = 0;
  
      // Prompt user to enter the sell amount
      Swal.fire({
        title: 'Please input amount of product to sell',
        input: 'number',
        inputAttributes: {
          min: '1',
          max: `${product.total}`,
          step: '1',
        },
        showCancelButton: true,
        confirmButtonText: 'Sell',
        showLoaderOnConfirm: true,
        preConfirm: (amount) => {
          sellAmount = parseInt(amount);
          if (sellAmount > product.total || sellAmount <= 0) {
            Swal.showValidationMessage(`Invalid amount. You have only ${product.total} product(s) available.`);
          }
        },
      }).then(async (result) => {
        if (result.isConfirmed && sellAmount > 0) {
          try {
            // API call to update stock quantity
            const updatedQuantity = product.total - sellAmount;
  
            await axios.put(`/api/stock`, {
              product_id: product.id,
              quantity: updatedQuantity,
            });
  
            // Update the product list locally
            setProducts((prevProducts) =>
              prevProducts.map((p) =>
                p.id === id ? { ...p, total: updatedQuantity } : p
              )
            );
  
            Swal.fire('Success!', `Successfully sold ${sellAmount} product(s).`, 'success');
          } catch (error) {
            console.error('Error updating stock:', error);
            Swal.fire('Error!', 'Failed to update stock. Please try again.', 'error');
          }
        }
      });
    } else {
      Swal.fire('Error!', 'You have no product to sell.', 'error');
    }
  };
  

  const onclicktobuy = (id: string) => {
    const product = products.find(product => product.id === id);
  
    if (product) {
      Swal.fire({
        title: 'Enter the quantity to buy',
        input: 'number',
        inputAttributes: {
          min: '1',
          autocapitalize: 'off',
        },
        showCancelButton: true,
        confirmButtonText: 'Buy',
        showLoaderOnConfirm: true,
        preConfirm: async (amount) => {
          const quantity = parseInt(amount || "0", 10);
          if (quantity <= 0) {
            Swal.showValidationMessage('Quantity must be greater than 0');
          } else {
            try {
              // Construct the order payload
              const orderPayload = {
                supplier_id: product.distributor, // Assuming `distributor` holds the supplier ID
                product_id: id,
                quantity,
                order_date: new Date().toISOString(), // Current date for order_date
                status: 'pending', // Set a default status
              };
  
              console.log('Order Payload Sent:', orderPayload);
  
              // Call the POST order API
              const response = await axios.post(`/api/orders`, orderPayload, {
                headers: { 'Content-Type': 'application/json' },
              });
  
              const createdOrder = response.data;
  
              console.log('Created Order:', createdOrder);
  
              // Update the stock locally (optional)
              setProducts((prevProducts) =>
                prevProducts.map((prod) =>
                  prod.id === id
                    ? { ...prod, total: prod.total + quantity }
                    : prod
                )
              );
  
              return quantity; // Return the quantity to show a success message
            } catch (error) {
              console.error('Error creating order:', error);
              Swal.showValidationMessage('Failed to create order. Please try again.');
            }
          }
        },
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire(
            'Success!',
            `You have successfully bought ${result.value} units of ${product.name}. See Order in Order History`,
            'success'
          );
        }
      });
    }
  };
  

  return (
    <main className="">
      <div>
        <div className="">
          <h1 className="text-4xl pl-10 font-bold text-blue-500">ALL Product</h1>
        </div>
        <div className="divider"></div>
        <div className="flex justify-center items-center w-svw px-10 pb-10">
          <input
            type="text"
            placeholder="Search"
            className="input input-bordered w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value.toString())}
          />
          <button
            className="flex justify-center items-center btn ml-4"
            onClick={() => (document.getElementById('Add_modal') as HTMLDialogElement)?.showModal()}
          >
            <FontAwesomeIcon icon={faPlus} />
            NEW
          </button>
        </div>
        <div className="px-10 overflow-auto">
          {filteredProducts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Distributor</th>
                    <th>Position</th>
                    <th>Price</th>
                    <th className="text-center">Total</th>
                    <th className="text-center">Sell</th>
                    <th className="text-center">Buy</th>
                    <th className="text-center">Remove</th>
                    <th className="text-center">Detail</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product, index) => (
                    <tr key={product.id}>
                      <td>{index + 1}</td>
                      <th>{product.id}</th>
                      <td>{product.name}</td>
                      <td>{product.type}</td>
                      <td>{product.distributor}</td>
                      <td>{product.position}</td>
                      <td>{product.price}</td>
                      <td className="text-center">
                        <p className={product.total <= 20 ? 'bg-red-700 rounded-lg text-white' : ''}>
                          {product.total <= 0 ? 'Out of stock' : product.total}
                        </p>
                      </td>
                      <td className="text-center">
                        <button
                          className="btn btn-sm bg-green-200 text-gray-700"
                          onClick={() => onclicksell(product.id)}
                        >
                          Sell
                        </button>
                      </td>
                      <td className="text-center">
                        <button
                          className="btn btn-sm text-gray-700 bg-blue-200"
                          onClick={() => onclicktobuy(product.id)}
                        >
                          Buy
                        </button>
                      </td>
                      <td className="text-center">
                        <button
                          className="btn btn-sm text-gray-700 bg-red-200"
                          onClick={() => onclickremove(product.id)}
                        >
                          Remove
                        </button>
                      </td>
                      <td className="text-center">
                        <button
                          className="btn btn-sm text-gray-700 bg-orange-200"
                          onClick={() => {
                            (document.getElementById('Edit_modal') as HTMLDialogElement)?.showModal();
                            setIdselected(product.id);
                          }}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center">No products found</p>
          )}
        </div>

        {/* Add Modal */}
        <dialog id="Add_modal" className="modal">
          <div className="modal-box">
            <Add_modal />
          </div>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>

        {/* Edit Modal */}
        <dialog id="Edit_modal" className="modal">
          <div className="modal-box">
            <Edit_modal
              name={products.find(product => product.id === idselected)?.name || ""}
              type={products.find(product => product.id === idselected)?.type || ""}
              distributor={products.find(product => product.id === idselected)?.distributor || ""}
              position={products.find(product => product.id === idselected)?.position || ""}
              price={products.find(product => product.id === idselected)?.price || 0}
              productId={parseInt(products.find(product => product.id === idselected)?.id || "0")}
              minimumStock={0}
            />
          </div>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
      </div>
    </main>
  );
}
