import { useEffect, useState } from "react";
import { getProducts, createProduct, deleteProduct } from "../api/api";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    sku: "",
    price: "",
    quantity: ""
  });

  const load = async () => {
    const res = await getProducts();
    setProducts(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const add = async () => {
    await createProduct(form);
    setForm({ name: "", sku: "", price: "", quantity: "" });
    load();
  };

  const remove = async (id) => {
    await deleteProduct(id);
    load();
  };

  return (
    <div>

    <div className="card">
      <h2>Products Management</h2>
      <p>Manage inventory items like a SaaS dashboard</p>
    </div>

      <div className="card">
        <h2>Add Product</h2>

        <div className="formGrid">
          <input className="input" placeholder="Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })} />

          <input className="input" placeholder="SKU"
            value={form.sku}
            onChange={e => setForm({ ...form, sku: e.target.value })} />

          <input className="input" placeholder="Price"
            value={form.price}
            onChange={e => setForm({ ...form, price: e.target.value })} />

          <input className="input" placeholder="Qty"
            value={form.quantity}
            onChange={e => setForm({ ...form, quantity: e.target.value })} />
        </div>

        <button className="primaryBtn" onClick={add} style={{ marginTop: 15 }}>
          Add Product
        </button>
      </div>

      <div className="card">
  <h2>Products</h2>

  <table className="table">
    <thead>
      <tr>
        <th>Name</th>
        <th>SKU</th>
        <th>Price</th>
        <th>Qty</th>
        <th></th>
      </tr>
    </thead>

    <tbody>
      {products.map(p => (
        <tr key={p.id} className="tableRow">
          <td>{p.name}</td>
          <td>{p.sku}</td>
          <td>${p.price}</td>
          <td>{p.quantity}</td>
          <td>
            <button className="dangerBtn" onClick={() => remove(p.id)}>
              Delete
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
    </div>
  );
}