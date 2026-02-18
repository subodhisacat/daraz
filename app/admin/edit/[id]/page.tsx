"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

interface ProductForm {
  title?: string;
  description?: string;
  price?: string;
  image_url: string;
  category?: string;
  affiliate_link: string;
}

export default function EditProduct() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState<ProductForm | null>(null);
  const [original, setOriginal] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // 🔹 Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      const snap = await getDoc(doc(db, "products", id as string));
      if (!snap.exists()) {
        alert("Product not found");
        router.push("/admin/dashboard");
        return;
      }

      const data = snap.data();
      setForm({
        title: data.title ?? "",
        description: data.description ?? "",
        price: data.price?.toString() ?? "",
        image_url: data.image_url,
        category: data.category ?? "",
        affiliate_link: data.affiliate_link,
      });
      setOriginal(data);
      setFetching(false);
    };

    fetchProduct();
  }, [id, router]);

  // 🔹 Handle change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!form) return;
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Validation (ONLY required fields)
  const validate = () => {
    if (!form?.image_url.startsWith("http"))
      return "Valid image URL is required";
    if (!form?.affiliate_link.startsWith("http"))
      return "Valid affiliate link is required";
    return null;
  };

  // 🔹 Get updates safely
  const buildUpdates = () => {
    if (!form) return {};

    const updates: any = {};

    if (form.title?.trim()) updates.title = form.title;
    if (form.description?.trim()) updates.description = form.description;
    if (form.category?.trim()) updates.category = form.category;

    if (form.price && !isNaN(Number(form.price)))
      updates.price = Number(form.price);

    updates.image_url = form.image_url;
    updates.affiliate_link = form.affiliate_link;
    updates.updatedAt = new Date();

    return updates;
  };

  // 🔹 Update handler
  const handleUpdate = async () => {
    const error = validate();
    if (error) {
      alert(error);
      return;
    }

    const updates = buildUpdates();
    if (Object.keys(updates).length <= 2) {
      alert("No changes detected");
      return;
    }

    try {
      setLoading(true);
      await updateDoc(doc(db, "products", id as string), updates);
      alert("✅ Product updated");
      router.push("/admin/dashboard");
    } catch (err) {
      console.error(err);
      alert("❌ Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (fetching || !form) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 border rounded-xl shadow">
      <h1 className="text-3xl font-bold mb-6 text-center">Edit Product</h1>

      <div className="grid gap-4">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          className="border p-3 rounded"
          placeholder="Title (optional)"
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="border p-3 rounded"
          placeholder="Description (optional)"
        />

        <input
          name="price"
          value={form.price}
          onChange={handleChange}
          className="border p-3 rounded"
          placeholder="Price (optional)"
        />

        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          className="border p-3 rounded"
          placeholder="Category (optional)"
        />

        <input
          name="image_url"
          value={form.image_url}
          onChange={handleChange}
          className="border p-3 rounded"
          placeholder="Image URL *"
          required
        />

        {form.image_url && (
          <img
            src={form.image_url}
            className="w-full h-48 object-cover rounded border"
          />
        )}

        <input
          name="affiliate_link"
          value={form.affiliate_link}
          onChange={handleChange}
          className="border p-3 rounded"
          placeholder="Affiliate Link *"
          required
        />

        <button
          onClick={handleUpdate}
          disabled={loading}
          className={`mt-4 py-3 rounded text-white ${
            loading
              ? "bg-gray-400"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Updating..." : "Update Product"}
        </button>
      </div>
    </div>
  );
}
