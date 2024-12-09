interface Product {
  id: string;
  name: string;
  type: string;
  distributor: string;
  position: string;
  price: string;
  total: string;
}

function CardProduct({ data }: { data: Product[] }) {
  if (!Array.isArray(data)) {
    return <div>Invalid data format</div>;
  }

  return (
    <div>
      <div>
        {data.map((product) => (
          <div key={product.id} className="m-10 bg-base-100 shadow-xl border-2 rounded-xl">
            <div>
              <h1 className="card-title pt-5">{product.name}</h1>
              <p className="card-subtitle">{product.type}</p>
              <p className="card-subtitle">{product.distributor}</p>
              <p className="card-subtitle">{product.position}</p>
              <p className="card-subtitle">{product.price}</p>
              <p className="card-subtitle">{product.total}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CardProduct;
