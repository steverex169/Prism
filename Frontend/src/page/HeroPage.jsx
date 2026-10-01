import React, { useEffect, useState } from "react";

const HeroPage = () => {
    const [heroes, setHeroes] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [sections, setSections] = useState([]);

    const [formData, setFormData] = useState({
        section_name: "",
        alt_text: "",
        image: null,
    });

    const [preview, setPreview] = useState(null);

    const fetchSections = async () => {
        try {
            const response = await fetch(
                "http://localhost:8000/hero/sections"
            );

            if (!response.ok) {
                throw new Error("Failed to fetch hero sections");
            }

            const result = await response.json();

            setSections(result.data || []);
        } catch (error) {
            console.error("Error fetching hero sections:", error);
        }
    };

    // --------------------------------
    // FETCH HERO IMAGES
    // --------------------------------

    const fetchHeroImages = async () => {
        try {
            setLoading(true);

            const response = await fetch("http://localhost:8000/hero/");

            if (!response.ok) {
                throw new Error("Failed to fetch hero images");
            }

            const result = await response.json();

            setHeroes(result.data || []);
        } catch (error) {
            console.error("Error fetching hero images:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHeroImages();
        fetchSections();
    }, []);

    // --------------------------------
    // OPEN MODAL
    // --------------------------------

    const openModal = () => {
        setFormData({
            section_name: "",
            alt_text: "",
            image: null,
        });

        setPreview(null);
        setShowModal(true);
    };

    // --------------------------------
    // CLOSE MODAL
    // --------------------------------

    const closeModal = () => {
        if (saving) return;

        setShowModal(false);

        setFormData({
            section_name: "",
            alt_text: "",
            image: null,
        });

        setPreview(null);
    };

    // --------------------------------
    // HANDLE INPUT
    // --------------------------------

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // --------------------------------
    // HANDLE IMAGE
    // --------------------------------

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Please select a valid image file.");
            return;
        }

        setFormData((prev) => ({
            ...prev,
            image: file,
        }));

        const imageUrl = URL.createObjectURL(file);
        setPreview(imageUrl);
    };

    // --------------------------------
    // CREATE HERO IMAGE
    // --------------------------------

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.image) {
            alert("Please select an image.");
            return;
        }

        if (!formData.section_name) {
            alert("Please select a section.");
            return;
        }

        try {
            setSaving(true);

            const data = new FormData();

            data.append("image", formData.image);
            data.append("section_name", formData.section_name);
            data.append("alt_text", formData.alt_text);

            const response = await fetch("http://localhost:8000/hero/", {
                method: "POST",
                body: data,
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.detail || "Failed to create hero image");
            }

            // Close modal
            closeModal();

            // Refresh table
            await fetchHeroImages();
        } catch (error) {
            console.error("Error creating hero image:", error);
            alert(error.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="w-full">
            {/* --------------------------------
          TOP ACTION
      -------------------------------- */}
            <div className="mb-6 flex items-center justify-end">
                <button
                    type="button"
                    onClick={openModal}
                    className="inline-flex h-10 items-center rounded-lg bg-blue-600 px-5 text-sm font-medium text-white transition hover:bg-blue-700"
                >
                    Add Image
                </button>
            </div>

            {/* --------------------------------
          TABLE
      -------------------------------- */}
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b border-slate-200 bg-slate-50">
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                ID
                            </th>

                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Section Name
                            </th>

                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Image
                            </th>

                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Alt Text
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td
                                    colSpan="4"
                                    className="px-6 py-16 text-center text-sm text-slate-500"
                                >
                                    Loading...
                                </td>
                            </tr>
                        ) : heroes.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="4"
                                    className="px-6 py-16 text-center"
                                >
                                    <div className="flex flex-col items-center justify-center">
                                        <p className="text-sm font-medium text-slate-500">
                                            No records found
                                        </p>

                                        <button
                                            type="button"
                                            onClick={openModal}
                                            className="mt-3 text-sm font-medium text-blue-600 transition hover:text-blue-700"
                                        >
                                            Add Record
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            heroes.map((hero) => (
                                <tr
                                    key={hero.id}
                                    className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50"
                                >
                                    <td className="px-6 py-4 text-sm text-slate-700">
                                        {hero.id}
                                    </td>

                                    <td className="px-6 py-4 text-sm text-slate-700">
                                        {hero.section_name || "-"}
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="h-16 w-28 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                                            <img
                                                src={`http://localhost:8000/${hero.image_url}`}
                                                alt={hero.alt_text || "Hero image"}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 text-sm text-slate-700">
                                        {hero.alt_text || "-"}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* --------------------------------
          ADD IMAGE MODAL
      -------------------------------- */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4">
                    <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                            <div>
                                <h2 className="text-lg font-semibold text-[#17212f]">
                                    Add Hero Image
                                </h2>

                                <p className="mt-1 text-xs text-slate-400">
                                    Add an image to a website section
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closeModal}
                                disabled={saving}
                                className="text-2xl leading-none text-slate-400 transition hover:text-slate-600 disabled:cursor-not-allowed"
                            >
                                ×
                            </button>
                        </div>

                        {/* Modal Form */}
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-5 px-6 py-6">
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Select Section
                                    </label>

                                    <select
                                        value={formData.section_name}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                section_name: e.target.value,
                                            }))
                                        }
                                        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
                                        required
                                    >
                                        <option value="">Select Section</option>

                                        {sections.map((section) => (
                                            <option
                                                key={section.key}
                                                value={section.key}
                                            >
                                                {section.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Image */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Image
                                    </label>

                                    <input
                                        type="file"
                                        accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp"
                                        onChange={handleImageChange}
                                        className="block w-full cursor-pointer rounded-lg border border-slate-300 text-sm text-slate-500 file:mr-4 file:border-0 file:bg-slate-100 file:px-4 file:py-3 file:text-sm file:font-medium file:text-slate-700 hover:file:bg-slate-200"
                                        required
                                    />

                                    <p className="mt-2 text-xs text-slate-400">
                                        PNG, JPG, JPEG or WEBP
                                    </p>

                                    {/* Preview */}
                                    {preview && (
                                        <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
                                            <img
                                                src={preview}
                                                alt="Preview"
                                                className="h-40 w-full object-cover"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Alt Text */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Alt Text
                                    </label>

                                    <input
                                        type="text"
                                        name="alt_text"
                                        value={formData.alt_text}
                                        onChange={handleChange}
                                        placeholder="Enter image alt text"
                                        className="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-6 py-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    disabled={saving}
                                    className="h-10 rounded-lg border border-slate-300 px-4 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="h-10 rounded-lg bg-blue-600 px-5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {saving ? "Saving..." : "Add Image"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HeroPage;