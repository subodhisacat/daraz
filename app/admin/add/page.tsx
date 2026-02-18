"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export default function AddProduct() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetchingMeta, setFetchingMeta] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    image_url: "",
    category: "",
    affiliate_link: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔎 Fetch metadata from affiliate link
  const fetchMetadata = async () => {
    if (!form.affiliate_link.startsWith("http")) {
      alert("Enter a valid affiliate link first");
      return;
    }

    try {
      setFetchingMeta(true);
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: form.affiliate_link }),
      });

      const data = await res.json();

      if (data.error) {
        alert(data.error);
        return;
      }

      setForm((prev) => ({
        ...prev,
        title: data.title || prev.title,
        image_url: data.image_url || prev.image_url,
      }));
    } catch (err) {
      alert("Failed to fetch metadata");
    } finally {
      setFetchingMeta(false);
    }
  };

  // 🚀 Submit product
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.affiliate_link || !form.image_url) {
      alert("Affiliate link and image are required");
      return;
    }

    try {
      setLoading(true);
      await addDoc(collection(db, "products"), {
        title: form.title || "",
        description: form.description || "",
        category: form.category || "",
        affiliate_link: form.affiliate_link,
        image_url: form.image_url,
        price: form.price ? Number(form.price) : null,
        createdAt: new Date(),
      });

      alert("✅ Product added successfully!");
      router.push("/admin/dashboard");
    } catch (error) {
      console.error(error);
      alert("❌ Failed to add product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto backdrop-blur-3xl rounded-xl font-sans mt-10 p-4">
      <h1 className="text-3xl font-extrabold mb-6 text-center">
        Add Product
      </h1>

      <form onSubmit={handleSubmit} className="grid gap-4">
        {/* Affiliate Link */}
        <input
          name="affiliate_link"
          className="border p-3 rounded-lg"
          placeholder="Affiliate Link *"
          onChange={handleChange}
          required
        />

        <button
          type="button"
          onClick={fetchMetadata}
          disabled={fetchingMeta}
          className={`py-2 rounded-lg text-white ${
            fetchingMeta
              ? "bg-gray-400"
              : "bg-purple-600 hover:bg-purple-700"
          }`}
        >
          {fetchingMeta ? "Fetching..." : "🔎 Fetch Product Info"}
        </button>

        {/* Title (optional) */}
        <input
          name="title"
          className="border p-3 rounded-lg"
          placeholder="Product Title (optional)"
          value={form.title}
          onChange={handleChange}
        />

        {/* Image URL */}
        <input
          name="image_url"
          className="border p-3 rounded-lg"
          placeholder="Image URL *"
          value={form.image_url}
          onChange={handleChange}
          required
        />

        {form.image_url && (
          <img
            src={form.image_url}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border"
          />
        )}

        {/* Optional fields */}
        <input
          name="price"
          className="border p-3 rounded-lg"
          placeholder="Price (optional)"
          value={form.price}
          onChange={handleChange}
        />

        <input
          name="category"
          className="border p-3 rounded-lg"
          placeholder="Category (optional)"
          value={form.category}
          onChange={handleChange}
        />

        <textarea
          name="description"
          className="border p-3 rounded-lg"
          placeholder="Description (optional)"
          value={form.description}
          onChange={handleChange}
        />

        <button
          type="submit"
          disabled={loading}
          className={`mt-3 text-white text-lg font-semibold rounded-xl py-3 transition ${
            loading
              ? "bg-gray-400"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>
    </div>
  );
}
