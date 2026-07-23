import { useCallback, useEffect, useMemo, useState } from "react";
import {
  createProduct,
  deleteProduct,
  getApiError,
  getProducts,
  updateProduct
} from "../api/api";
import { ErrorState, LoadingState } from "../components/PageState";
import { formatCurrency } from "../utils/format";

const EMPTY_FORM = {
  name: "",
  sku: "",
  category: "",
  price: "",
  quantity: ""
};

export default function Products() {
  const [products, setProducts] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setError("");
    try {
      const response = await getProducts();
      setProducts(response.data);
    } catch (requestError) {
      setError(getApiError(requestError, "Unable to load products."));
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const categories = useMemo(
    () => [...new Set((products || []).map((product) => product.category))].sort(),
    [products]
  );

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return (products || []).filter((product) => {
      const matchesQuery = !normalizedQuery ||
        product.name.toLowerCase().includes(normalizedQuery) ||
        product.sku.toLowerCase().includes(normalizedQuery);
      const matchesCategory = category === "All" || product.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [category, products, query]);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setNotice("");

    if (!form.name.trim() || !form.sku.trim() || !form.category.trim()) {
      setError("Name, SKU, and category are required.");
      return;
    }

    if (Number(form.price) < 0 || Number(form.quantity) < 0) {
      setError("Price and quantity cannot be negative.");
      return;
    }

    const payload = {
      ...form,
      price: Number(form.price),
      quantity: Number(form.quantity)
    };

    setSubmitting(true);
    try {
      if (editingId) {
        await updateProduct(editingId, payload);
        setNotice("Product updated successfully.");
      } else {
        await createProduct(payload);
        setNotice("Product added successfully.");
      }
      resetForm();
      await load();
    } catch (requestError) {
      setError(getApiError(requestError, "Unable to save this product."));
    } finally {
      setSubmitting(false);
    }
  };

  const startEditing = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      sku: product.sku,
      category: product.category,
      price: String(product.price),
      quantity: String(product.quantity)
    });
    setError("");
    setNotice("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (product) => {
    if (!window.confirm(`Delete ${product.name}? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteProduct(product.id);
      setNotice("Product deleted.");
      if (editingId === product.id) {
        resetForm();
      }
      await load();
    } catch (requestError) {
      setError(getApiError(requestError, "Unable to delete this product."));
    }
  };

  if (error && !products) {
    return <ErrorState message={error} onRetry={load} />;
  }

  if (!products) {
    return <LoadingState message="Loading product catalog…" />;
  }

  return (
    <div className="pageStack">
      <section className="pageHeader">
        <div>
          <p className="eyebrow">Catalog operations</p>
          <h1>Products</h1>
          <p>Add, update, search, and monitor every inventory item.</p>
        </div>
        <span className="countBadge">{products.length} total</span>
      </section>

      <section className="card">
        <div className="sectionHeader">
          <div>
            <p className="eyebrow">{editingId ? "Editing product" : "New inventory item"}</p>
            <h2>{editingId ? "Update product" : "Add product"}</h2>
          </div>
          {editingId && (
            <button className="textButton compact" type="button" onClick={resetForm}>
              Cancel edit
            </button>
          )}
        </div>

        <form onSubmit={submit}>
          <div className="productFormGrid">
            <label>
              <span className="fieldLabel">Product name</span>
              <input
                className="input"
                placeholder="Mechanical keyboard"
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
              />
            </label>
            <label>
              <span className="fieldLabel">SKU</span>
              <input
                className="input"
                placeholder="KEY-001"
                value={form.sku}
                onChange={(event) => setForm({ ...form, sku: event.target.value })}
              />
            </label>
            <label>
              <span className="fieldLabel">Category</span>
              <input
                className="input"
                placeholder="Accessories"
                value={form.category}
                onChange={(event) => setForm({ ...form, category: event.target.value })}
              />
            </label>
            <label>
              <span className="fieldLabel">Unit price</span>
              <input
                className="input"
                type="number"
                min="0"
                step="0.01"
                placeholder="129.99"
                value={form.price}
                onChange={(event) => setForm({ ...form, price: event.target.value })}
              />
            </label>
            <label>
              <span className="fieldLabel">Quantity</span>
              <input
                className="input"
                type="number"
                min="0"
                step="1"
                placeholder="25"
                value={form.quantity}
                onChange={(event) => setForm({ ...form, quantity: event.target.value })}
              />
            </label>
          </div>

          {error && <div className="formError" role="alert">{error}</div>}
          {notice && <div className="formNotice" role="status">{notice}</div>}

          <button className="primaryBtn" disabled={submitting}>
            {submitting ? "Saving…" : editingId ? "Save changes" : "Add product"}
          </button>
        </form>
      </section>

      <section className="card">
        <div className="catalogToolbar">
          <div>
            <p className="eyebrow">Inventory catalog</p>
            <h2>All products</h2>
          </div>
          <div className="filters">
            <input
              className="input searchInput"
              aria-label="Search products"
              placeholder="Search name or SKU…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <select
              className="input selectInput"
              aria-label="Filter by category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              <option>All</option>
              {categories.map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="emptyState">
            <h3>{products.length ? "No products match your filters" : "Your catalog is empty"}</h3>
            <p>{products.length ? "Try another search or category." : "Add your first product above."}</p>
          </div>
        ) : (
          <div className="tableWrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th><span className="srOnly">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td><strong>{product.name}</strong></td>
                    <td><span className="sku">{product.sku}</span></td>
                    <td>{product.category}</td>
                    <td>{formatCurrency(product.price)}</td>
                    <td>
                      <span className={`stockBadge ${
                        product.quantity === 0 ? "out" : product.quantity <= 5 ? "low" : "healthy"
                      }`}>
                        {product.quantity === 0 ? "Out" : `${product.quantity} units`}
                      </span>
                    </td>
                    <td>
                      <div className="rowActions">
                        <button className="secondaryBtn small" type="button" onClick={() => startEditing(product)}>
                          Edit
                        </button>
                        <button className="dangerBtn" type="button" onClick={() => remove(product)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
