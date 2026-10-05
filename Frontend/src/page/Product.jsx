import React, { useEffect, useRef, useState } from "react";
import { Pencil, Plus, Search, Trash2, X } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const Product = () => {
    const [products, setProducts] = useState([]);

    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        name: "",
        price: "",
        image: null,
    });

    // =========================
    // IMAGE URL
    // =========================

    const getImageUrl = (image) => {
        if (!image) return null;

        if (image.startsWith("http://") || image.startsWith("https://")) {
            return image;
        }

        return `${API_BASE_URL}${image}`;
    };

    // =========================
    // GET PRODUCTS
    // =========================

    const fetchProducts = async () => {
        try {
            setLoading(true);

            const response = await fetch(`${API_BASE_URL}/products/`, {
                method: "GET",
                credentials: "include",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.detail || "Failed to fetch products."
                );
            }

            setProducts(data);
        } catch (error) {
            console.error("Error fetching products:", error);
            alert(error.message || "Failed to load products.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // =========================
    // SEARCH
    // =========================

    const filteredProducts = products.filter((product) =>
        String(product.name || "")
            .toLowerCase()
            .includes(search.toLowerCase().trim())
    );

    // =========================
    // OPEN ADD MODAL
    // =========================

    const openAddModal = () => {
        setEditingProduct(null);

        setFormData({
            name: "",
            price: "",
            image: null,
        });

        setImagePreview(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }

        setShowModal(true);
    };

    // =========================
    // OPEN EDIT MODAL
    // =========================

    const openEditModal = (product) => {
        setEditingProduct(product);

        setFormData({
            name: product.name,
            price: product.price,
            image: null,
        });

        setImagePreview(getImageUrl(product.image));

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }

        setShowModal(true);
    };

    // =========================
    // CLOSE MODAL
    // =========================

    const closeModal = () => {
        setShowModal(false);
        setEditingProduct(null);

        setFormData({
            name: "",
            price: "",
            image: null,
        });

        setImagePreview(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // =========================
    // INPUT CHANGE
    // =========================

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // =========================
    // IMAGE CHANGE
    // =========================

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Please select a valid image.");
            e.target.value = "";
            return;
        }

        setFormData((prev) => ({
            ...prev,
            image: file,
        }));

        const previewUrl = URL.createObjectURL(file);

        setImagePreview(previewUrl);
    };

    // =========================
    // CREATE / UPDATE PRODUCT
    // =========================

    const handleSubmit = async (e) => {
        e.preventDefault();

        const productName = formData.name.trim();
        const productPrice = Number(formData.price);

        if (!productName) {
            alert("Please enter a product name.");
            return;
        }

        if (
            formData.price === "" ||
            Number.isNaN(productPrice) ||
            productPrice < 0
        ) {
            alert("Please enter a valid product price.");
            return;
        }

        try {
            setSaving(true);

            const url = editingProduct
                ? `${API_BASE_URL}/products/${editingProduct.id}`
                : `${API_BASE_URL}/products/`;

            const method = editingProduct ? "PUT" : "POST";

            // =========================
            // FORM DATA
            // =========================

            const data = new FormData();

            data.append("name", productName);
            data.append("price", productPrice.toString());

            if (formData.image) {
                data.append("image", formData.image);
            }

            const response = await fetch(url, {
                method,
                credentials: "include",
                body: data,
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(
                    responseData?.detail || "Failed to save product."
                );
            }

            if (editingProduct) {
                setProducts((prev) =>
                    prev.map((product) =>
                        product.id === responseData.id
                            ? responseData
                            : product
                    )
                );
            } else {
                setProducts((prev) => [...prev, responseData]);
            }

            closeModal();
        } catch (error) {
            console.error("Error saving product:", error);
            alert(error.message || "Failed to save product.");
        } finally {
            setSaving(false);
        }
    };

    // =========================
    // DELETE PRODUCT
    // =========================

    const handleDelete = async (product) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${product.name}"?`
        );

        if (!confirmed) return;

        try {
            setDeletingId(product.id);

            const response = await fetch(
                `${API_BASE_URL}/products/${product.id}`,
                {
                    method: "DELETE",
                    credentials: "include",
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.detail || "Failed to delete product."
                );
            }

            setProducts((prev) =>
                prev.filter((item) => item.id !== product.id)
            );
        } catch (error) {
            console.error("Error deleting product:", error);
            alert(error.message || "Failed to delete product.");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="w-full min-w-0">
            {/* Header */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                {/* Search */}
                <div className="relative w-full sm:max-w-[360px]">
                    <Search
                        size={18}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search products..."
                        className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-[#0D59F2] focus:ring-2 focus:ring-[#0D59F2]/10"
                    />
                </div>

                {/* Add Product */}
                <button
                    type="button"
                    onClick={openAddModal}
                    className="inline-flex h-11 w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-[#0D59F2] px-5 text-sm font-semibold text-white transition hover:bg-[#0848c7] sm:w-auto"
                >
                    <Plus size={18} />
                    Add Product
                </button>
            </div>

            {/* Table */}
            <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white">
                <div className="w-full overflow-x-auto">
                    <table className="w-full min-w-[700px] border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200 bg-slate-50">
                                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    ID
                                </th>

                                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Product Name
                                </th>

                                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Product Price
                                </th>

                                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                <tr>
                                    <td
                                        colSpan="4"
                                        className="px-5 py-12 text-center text-sm text-slate-500"
                                    >
                                        Loading products...
                                    </td>
                                </tr>
                            ) : filteredProducts.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="4"
                                        className="px-5 py-12 text-center"
                                    >
                                        <p className="text-sm font-medium text-slate-700">
                                            No products found
                                        </p>

                                        <p className="mt-1 text-xs text-slate-400">
                                            {search
                                                ? "Try a different search."
                                                : "Add your first product."}
                                        </p>
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map((product) => (
                                    <tr
                                        key={product.id}
                                        className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/60"
                                    >
                                        {/* ID */}
                                        <td className="px-5 py-4 text-sm font-medium text-slate-600">
                                            #{product.id}
                                        </td>

                                        {/* Product */}
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                                                    {product.image ? (
                                                        <img
                                                            src={getImageUrl(
                                                                product.image
                                                            )}
                                                            alt={
                                                                product.name
                                                            }
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                                                            No image
                                                        </div>
                                                    )}
                                                </div>

                                                <span className="text-sm font-semibold text-slate-800">
                                                    {product.name}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Price */}
                                        <td className="px-5 py-4 text-sm font-semibold text-slate-800">
                                            $
                                            {Number(product.price).toFixed(2)}
                                        </td>

                                        {/* Actions */}
                                        <td className="px-5 py-4">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        openEditModal(product)
                                                    }
                                                    disabled={
                                                        deletingId ===
                                                        product.id
                                                    }
                                                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-[#0D59F2] hover:bg-[#EFF6FF] hover:text-[#0D59F2] disabled:cursor-not-allowed disabled:opacity-50"
                                                    title="Edit product"
                                                >
                                                    <Pencil size={15} />
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDelete(product)
                                                    }
                                                    disabled={
                                                        deletingId ===
                                                        product.id
                                                    }
                                                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 bg-white text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                                    title="Delete product"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Product Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 py-6">
                    <div className="max-h-[90vh] w-full max-w-[520px] overflow-y-auto rounded-xl bg-white shadow-2xl">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6">
                            <div>
                                <h2 className="text-base font-semibold text-slate-900">
                                    {editingProduct
                                        ? "Edit Product"
                                        : "Add Product"}
                                </h2>

                                <p className="mt-0.5 text-xs text-slate-500">
                                    {editingProduct
                                        ? "Update product information."
                                        : "Add a new product to your catalog."}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closeModal}
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                            >
                                <X size={19} />
                            </button>
                        </div>

                        {/* Form */}
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5 p-5 sm:p-6"
                        >
                            {/* Product Name */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Product Name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Enter product name"
                                    className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#0D59F2] focus:ring-2 focus:ring-[#0D59F2]/10"
                                />
                            </div>

                            {/* Product Image */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Product Image
                                </label>

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/png,image/jpeg,image/jpg,image/webp"
                                    onChange={handleImageChange}
                                    className="block w-full cursor-pointer rounded-lg border border-slate-200 bg-white text-sm text-slate-500 file:mr-4 file:border-0 file:bg-slate-100 file:px-4 file:py-2.5 file:text-sm file:font-medium file:text-slate-700 hover:file:bg-slate-200"
                                />

                                <p className="mt-2 text-xs text-slate-400">
                                    {editingProduct
                                        ? "Select a new image only if you want to replace the current image."
                                        : "Upload PNG, JPG, JPEG or WEBP image."}
                                </p>

                                {imagePreview && (
                                    <div className="mt-4 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                                        <img
                                            src={imagePreview}
                                            alt="Product preview"
                                            className="h-48 w-full object-contain"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Product Price */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Product Price
                                </label>

                                <div className="flex h-11 items-center overflow-hidden rounded-lg border border-slate-200 bg-white focus-within:border-[#0D59F2] focus-within:ring-2 focus-within:ring-[#0D59F2]/10">
                                    <span className="border-r border-slate-200 px-3.5 text-sm text-slate-400">
                                        $
                                    </span>

                                    <input
                                        type="number"
                                        name="price"
                                        min="0"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        placeholder="0.00"
                                        className="h-full w-full px-3 text-sm text-slate-800 outline-none placeholder:text-slate-400"
                                    />
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    disabled={saving}
                                    className="h-11 rounded-lg border border-slate-200 bg-white px-5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#0D59F2] px-5 text-sm font-semibold text-white transition hover:bg-[#0848c7] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {editingProduct ? (
                                        <Pencil size={16} />
                                    ) : (
                                        <Plus size={17} />
                                    )}

                                    {saving
                                        ? "Saving..."
                                        : editingProduct
                                          ? "Save Changes"
                                          : "Add Product"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Product;