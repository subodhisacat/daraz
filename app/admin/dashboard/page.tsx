"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  deleteDoc,
} from "firebase/firestore";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  affiliate_link: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    if (isAdmin !== "true") {
      router.push("/admin/login");
    } else {
      async function fetchProducts() {
        const q = query(
          collection(db, "products"),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        const productsData: Product[] = [];
        querySnapshot.forEach((doc) => {
          productsData.push({ id: doc.id, ...doc.data() } as Product);
        });
        setProducts(productsData);
      }
      fetchProducts();
    }
  }, [router]);

  // Navigate to add product page
  const handleAddProduct = () => {
    router.push("/admin/add");
  };

  // Navigate to edit product page
  const handleEdit = (id: string) => {
    router.push(`/admin/edit/${id}`);
  };

  // Delete product from Firestore and update UI
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await deleteDoc(doc(db, "products", id));
      alert("Product deleted successfully.");
      setProducts(products.filter((product) => product.id !== id));
    } catch (error) {
      console.error("Failed to delete product:", error);
      alert("Failed to delete product.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-5 font-sans">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="flex  mb-8">
        <button
          onClick={handleAddProduct}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-base font-semibold rounded-lg shadow transition"
        >
          <span className="text-xl">➕</span>
          <span>Add Product</span>
        </button>
      </div>
      {products.length === 0 && (
        <p className="text-gray-500">No products found.</p>
      )}
      {products.map((product) => (
        <div
          key={product.id}
          className="border border-gray-300 rounded-lg p-4 mb-4 shadow-sm"
        >
          <h3 className="text-xl font-semibold">{product.title}</h3>
          <p className="text-gray-700">Price: Rs. {product.price}</p>
          <p className="text-gray-600">Category: {product.category}</p>
          <div className="flex gap-4 mt-3">
            <button
              onClick={() => handleEdit(product.id)}
              className="px-4 py-2 bg-yellow-400 hover:bg-yellow-300 rounded text-black font-medium transition"
            >
              ✏️ Edit
            </button>
            <button
              onClick={() => handleDelete(product.id)}
              className="px-4 py-2 bg-red-500 hover:bg-red-400 rounded text-white font-medium transition"
            >
              🗑️ Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
