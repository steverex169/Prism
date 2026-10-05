import { useEffect, useRef, useState } from "react";
import {
    Pencil,
    Plus,
    Search,
    Trash2,
    X,
} from "lucide-react";


const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "";


const EMPTY_FORM = {
    name: "",
    price: "",

    cas_number: "",
    chemical_name: "",
    molecular_formula: "",
    molecular_weight: "",
    purity: "",
    appearance: "",
    solubility: "",
    storage_conditions: "",

    batch_number: "",
    coa: null,

    image: null,
};


export default function Product() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const [imagePreview, setImagePreview] = useState(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const [formData, setFormData] = useState(EMPTY_FORM);

    const fileInputRef = useRef(null);
    const coaInputRef = useRef(null);


    useEffect(() => {
        fetchProducts();
    }, []);


    const fetchProducts = async () => {
        try {
            setLoading(true);

            const response = await fetch(
                `${API_BASE_URL}/products/`,
                {
                    credentials: "include",
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch products");
            }

            const data = await response.json();

            setProducts(data);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };


    const filteredProducts = products.filter((product) =>
        product.name
            .toLowerCase()
            .includes(search.toLowerCase())
    );


    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };


    const handleImageChange = (e) => {
        const file = e.target.files?.[0];

        if (!file) {
            return;
        }

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
        ];

        if (!allowedTypes.includes(file.type)) {
            alert("Only JPG, PNG and WEBP images are allowed.");

            e.target.value = "";
            return;
        }

        setFormData((previous) => ({
            ...previous,
            image: file,
        }));

        setImagePreview(URL.createObjectURL(file));
    };


    const handleCoaChange = (e) => {
        const file = e.target.files?.[0];

        if (!file) {
            return;
        }

        const isPdf =
            file.type === "application/pdf" ||
            file.name.toLowerCase().endsWith(".pdf");

        if (!isPdf) {
            alert("Only PDF files are allowed for the COA.");

            e.target.value = "";
            return;
        }

        setFormData((previous) => ({
            ...previous,
            coa: file,
        }));
    };


    const openAddModal = () => {
        setEditingProduct(null);

        setFormData({
            ...EMPTY_FORM,
        });

        setImagePreview(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }

        if (coaInputRef.current) {
            coaInputRef.current.value = "";
        }

        setShowModal(true);
    };


    const openEditModal = (product) => {
        setEditingProduct(product);

        setFormData({
            name: product.name || "",
            price: product.price ?? "",

            cas_number: product.cas_number || "",
            chemical_name: product.chemical_name || "",
            molecular_formula: product.molecular_formula || "",
            molecular_weight: product.molecular_weight || "",
            purity: product.purity || "",
            appearance: product.appearance || "",
            solubility: product.solubility || "",
            storage_conditions: product.storage_conditions || "",

            batch_number: product.batch_number || "",
            coa: null,

            image: null,
        });

        if (product.image) {
            setImagePreview(
                product.image.startsWith("http")
                    ? product.image
                    : `${API_BASE_URL}${product.image}`
            );
        } else {
            setImagePreview(null);
        }

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }

        if (coaInputRef.current) {
            coaInputRef.current.value = "";
        }

        setShowModal(true);
    };


    const closeModal = () => {
        if (saving) {
            return;
        }

        setShowModal(false);
        setEditingProduct(null);

        setFormData({
            ...EMPTY_FORM,
        });

        setImagePreview(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }

        if (coaInputRef.current) {
            coaInputRef.current.value = "";
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            alert("Product name is required.");
            return;
        }

        if (
            formData.price === "" ||
            Number(formData.price) < 0
        ) {
            alert("Please enter a valid product price.");
            return;
        }

        try {
            setSaving(true);

            const data = new FormData();

            data.append(
                "name",
                formData.name
            );

            data.append(
                "price",
                formData.price
            );


            // Technical / Scientific Information

            data.append(
                "cas_number",
                formData.cas_number
            );

            data.append(
                "chemical_name",
                formData.chemical_name
            );

            data.append(
                "molecular_formula",
                formData.molecular_formula
            );

            data.append(
                "molecular_weight",
                formData.molecular_weight
            );

            data.append(
                "purity",
                formData.purity
            );

            data.append(
                "appearance",
                formData.appearance
            );

            data.append(
                "solubility",
                formData.solubility
            );

            data.append(
                "storage_conditions",
                formData.storage_conditions
            );


            // Batch Information

            data.append(
                "batch_number",
                formData.batch_number
            );


            // Batch-Specific COA

            if (formData.coa) {
                data.append(
                    "coa",
                    formData.coa
                );
            }


            // Product Image

            if (formData.image) {
                data.append(
                    "image",
                    formData.image
                );
            }


            const url = editingProduct
                ? `${API_BASE_URL}/products/${editingProduct.id}`
                : `${API_BASE_URL}/products/`;

            const method = editingProduct
                ? "PUT"
                : "POST";


            const response = await fetch(
                url,
                {
                    method,
                    body: data,
                    credentials: "include",
                }
            );


            const result = await response.json();


            if (!response.ok) {
                throw new Error(
                    result.detail ||
                    "Failed to save product"
                );
            }


            if (editingProduct) {
                setProducts((previous) =>
                    previous.map((product) =>
                        product.id === editingProduct.id
                            ? result
                            : product
                    )
                );
            } else {
                setProducts((previous) => [
                    ...previous,
                    result,
                ]);
            }


            closeModal();

        } catch (error) {
            console.error(
                "Error saving product:",
                error
            );

            alert(
                error.message ||
                "Failed to save product."
            );

        } finally {
            setSaving(false);
        }
    };


    const handleDelete = async (productId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeletingId(productId);

            const response = await fetch(
                `${API_BASE_URL}/products/${productId}`,
                {
                    method: "DELETE",
                    credentials: "include",
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.detail ||
                    "Failed to delete product"
                );
            }

            setProducts((previous) =>
                previous.filter(
                    (product) =>
                        product.id !== productId
                )
            );

        } catch (error) {
            console.error(
                "Error deleting product:",
                error
            );

            alert(
                error.message ||
                "Failed to delete product."
            );

        } finally {
            setDeletingId(null);
        }
    };


    return (
        <div className="p-6">

            {/* Header */}

            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                <div>

                    <h1 className="text-2xl font-semibold text-[#1E293B]">
                        Products
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage your products and technical specifications.
                    </p>

                </div>


                <button
                    type="button"
                    onClick={openAddModal}
                    className="flex items-center justify-center gap-2 rounded-lg bg-[#0047ab] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#003b91]"
                >
                    <Plus size={18} />
                    Add Product
                </button>

            </div>


            {/* Search */}

            <div className="mb-5">

                <div className="relative max-w-md">

                    <Search
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                        type="text"
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        placeholder="Search products..."
                        className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#0047ab]"
                    />

                </div>

            </div>


            {/* Table */}

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">

                <div className="overflow-x-auto">

                    <table className="w-full min-w-[700px]">

                        <thead>

                            <tr className="border-b border-gray-200 bg-gray-50">

                                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    ID
                                </th>

                                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Product Name
                                </th>

                                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Product Price
                                </th>

                                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Action
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {loading ? (

                                <tr>

                                    <td
                                        colSpan="4"
                                        className="px-5 py-10 text-center text-sm text-gray-500"
                                    >
                                        Loading products...
                                    </td>

                                </tr>

                            ) : filteredProducts.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="4"
                                        className="px-5 py-10 text-center text-sm text-gray-500"
                                    >
                                        No products found.
                                    </td>

                                </tr>

                            ) : (

                                filteredProducts.map(
                                    (product) => (

                                        <tr
                                            key={product.id}
                                            className="border-b border-gray-100 last:border-b-0"
                                        >

                                            <td className="px-5 py-4 text-sm text-gray-600">
                                                {product.id}
                                            </td>


                                            <td className="px-5 py-4">

                                                <div className="flex items-center gap-3">

                                                    {product.image ? (

                                                        <img
                                                            src={
                                                                product.image.startsWith(
                                                                    "http"
                                                                )
                                                                    ? product.image
                                                                    : `${API_BASE_URL}${product.image}`
                                                            }
                                                            alt={product.name}
                                                            className="h-10 w-10 rounded-lg object-cover"
                                                        />

                                                    ) : (

                                                        <div className="h-10 w-10 rounded-lg bg-gray-100" />

                                                    )}


                                                    <span className="text-sm font-medium text-[#1E293B]">
                                                        {product.name}
                                                    </span>

                                                </div>

                                            </td>


                                            <td className="px-5 py-4 text-sm text-gray-600">
                                                ${Number(product.price).toFixed(2)}
                                            </td>


                                            <td className="px-5 py-4">

                                                <div className="flex justify-end gap-2">

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            openEditModal(
                                                                product
                                                            )
                                                        }
                                                        className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-[#0047ab]"
                                                        title="Edit"
                                                    >
                                                        <Pencil size={17} />
                                                    </button>


                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDelete(
                                                                product.id
                                                            )
                                                        }
                                                        disabled={
                                                            deletingId ===
                                                            product.id
                                                        }
                                                        className="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={17} />
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    )
                                )

                            )}

                        </tbody>

                    </table>

                </div>

            </div>


            {/* Add / Edit Modal */}

            {showModal && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

                    <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-white shadow-xl">

                        {/* Modal Header */}

                        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">

                            <div>

                                <h2 className="text-lg font-semibold text-[#1E293B]">
                                    {editingProduct
                                        ? "Edit Product"
                                        : "Add Product"}
                                </h2>

                                <p className="mt-1 text-xs text-gray-500">
                                    Enter the product's technical and scientific information.
                                </p>

                            </div>


                            <button
                                type="button"
                                onClick={closeModal}
                                disabled={saving}
                                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
                            >
                                <X size={20} />
                            </button>

                        </div>


                        {/* Modal Body */}

                        <form
                            onSubmit={handleSubmit}
                            className="overflow-y-auto"
                        >

                            <div className="space-y-6 p-6">

                                {/* Basic Product Information */}

                                <div>

                                    <h3 className="mb-4 text-sm font-semibold text-[#1E293B]">
                                        Product Information
                                    </h3>


                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                                        {/* Product Name */}

                                        <div className="md:col-span-2">

                                            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                                Product Name

                                                <span className="ml-1 text-red-500">
                                                    *
                                                </span>

                                            </label>


                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#0047ab]"
                                                placeholder="Product name"
                                            />

                                        </div>


                                        {/* Price */}

                                        <div>

                                            <label className="mb-1.5 block text-sm font-medium text-gray-700">

                                                Product Price

                                                <span className="ml-1 text-red-500">
                                                    *
                                                </span>

                                            </label>


                                            <input
                                                type="number"
                                                name="price"
                                                value={formData.price}
                                                onChange={handleChange}
                                                min="0"
                                                step="1"
                                                required
                                                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#0047ab]"
                                                placeholder="0"
                                            />

                                        </div>


                                        {/* CAS Number */}

                                        <div>

                                            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                                CAS Number
                                            </label>


                                            <input
                                                type="text"
                                                name="cas_number"
                                                value={
                                                    formData.cas_number
                                                }
                                                onChange={handleChange}
                                                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#0047ab]"
                                                placeholder="e.g. 50-00-0"
                                            />

                                        </div>


                                        {/* Chemical Name */}

                                        <div>

                                            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                                Chemical Name
                                            </label>


                                            <input
                                                type="text"
                                                name="chemical_name"
                                                value={
                                                    formData.chemical_name
                                                }
                                                onChange={handleChange}
                                                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#0047ab]"
                                                placeholder="Chemical name"
                                            />

                                        </div>


                                        {/* Molecular Formula */}

                                        <div>

                                            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                                Molecular Formula
                                            </label>


                                            <input
                                                type="text"
                                                name="molecular_formula"
                                                value={
                                                    formData.molecular_formula
                                                }
                                                onChange={handleChange}
                                                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#0047ab]"
                                                placeholder="e.g., C₆₂H₉₈N₁₆O₂₂ for BPC-157"
                                            />

                                        </div>


                                        {/* Molecular Weight */}

                                        <div>

                                            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                                Molecular Weight
                                            </label>


                                            <input
                                                type="text"
                                                name="molecular_weight"
                                                value={
                                                    formData.molecular_weight
                                                }
                                                onChange={handleChange}
                                                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#0047ab]"
                                                placeholder="Expressed in g/mol"
                                            />

                                        </div>


                                        {/* Purity */}

                                        <div>

                                            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                                Purity
                                            </label>


                                            <input
                                                type="text"
                                                name="purity"
                                                value={
                                                    formData.purity
                                                }
                                                onChange={handleChange}
                                                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#0047ab]"
                                                placeholder="Must be backed by a COA."
                                            />

                                        </div>

                                    </div>

                                </div>


                                {/* Technical Specifications */}

                                <div>

                                    <h3 className="mb-4 text-sm font-semibold text-[#1E293B]">
                                        Technical Specifications
                                    </h3>


                                    <div className="space-y-4">

                                        {/* Appearance */}

                                        <div>

                                            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                                Appearance
                                            </label>


                                            <textarea
                                                name="appearance"
                                                value={
                                                    formData.appearance
                                                }
                                                onChange={handleChange}
                                                rows="2"
                                                className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#0047ab]"
                                                placeholder="Physical appearance"
                                            />

                                        </div>


                                        {/* Solubility */}

                                        <div>

                                            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                                Solubility
                                            </label>


                                            <textarea
                                                name="solubility"
                                                value={
                                                    formData.solubility
                                                }
                                                onChange={handleChange}
                                                rows="3"
                                                className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#0047ab]"
                                                placeholder="Solubility information"
                                            />

                                        </div>


                                        {/* Storage Conditions */}

                                        <div>

                                            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                                Storage Conditions
                                            </label>


                                            <textarea
                                                name="storage_conditions"
                                                value={
                                                    formData.storage_conditions
                                                }
                                                onChange={handleChange}
                                                rows="3"
                                                className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#0047ab]"
                                                placeholder="Store at -20°C, desiccated"
                                            />

                                        </div>


                                        {/* Batch Number */}

                                        <div>

                                            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                                Batch Number
                                            </label>


                                            <input
                                                type="text"
                                                name="batch_number"
                                                value={
                                                    formData.batch_number
                                                }
                                                onChange={handleChange}
                                                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#0047ab]"
                                                placeholder="Current batch number"
                                            />

                                        </div>


                                        {/* Batch-Specific COA */}

                                        <div>

                                            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                                Batch-Specific COA
                                            </label>


                                            <input
                                                ref={coaInputRef}
                                                type="file"
                                                name="coa"
                                                accept="application/pdf,.pdf"
                                                onChange={
                                                    handleCoaChange
                                                }
                                                className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-gray-100 file:px-4 file:py-2 file:text-sm file:font-medium file:text-gray-700 hover:file:bg-gray-200"
                                            />


                                            <p className="mt-1.5 text-xs text-gray-400">
                                                Certificate of Analysis for the current batch. Each product page must link to the current batch COA. PDF only.
                                            </p>


                                            {editingProduct &&
                                                editingProduct.coa_file && (
                                                    <p className="mt-2 text-xs text-gray-500">
                                                        Current COA is already uploaded. Select a new PDF to replace it.
                                                    </p>
                                                )}

                                        </div>

                                    </div>

                                </div>


                                {/* Product Image */}

                                <div>

                                    <h3 className="mb-4 text-sm font-semibold text-[#1E293B]">
                                        Product Image
                                    </h3>


                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start">

                                        {imagePreview && (

                                            <div className="h-28 w-28 overflow-hidden rounded-lg border border-gray-200">

                                                <img
                                                    src={imagePreview}
                                                    alt="Product preview"
                                                    className="h-full w-full object-cover"
                                                />

                                            </div>

                                        )}


                                        <div className="flex-1">

                                            <label className="mb-1.5 block text-sm font-medium text-gray-700">

                                                {editingProduct
                                                    ? "Replace Product Image"
                                                    : "Product Image"}

                                            </label>


                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/jpeg,image/png,image/webp"
                                                onChange={
                                                    handleImageChange
                                                }
                                                className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-gray-100 file:px-4 file:py-2 file:text-sm file:font-medium file:text-gray-700 hover:file:bg-gray-200"
                                            />


                                            <p className="mt-1.5 text-xs text-gray-400">
                                                JPG, PNG or WEBP
                                            </p>

                                        </div>

                                    </div>

                                </div>

                            </div>


                            {/* Modal Footer */}

                            <div className="flex justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">

                                <button
                                    type="button"
                                    onClick={closeModal}
                                    disabled={saving}
                                    className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="rounded-lg bg-[#0047ab] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#003b91] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {saving
                                        ? "Saving..."
                                        : editingProduct
                                            ? "Update Product"
                                            : "Add Product"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
}