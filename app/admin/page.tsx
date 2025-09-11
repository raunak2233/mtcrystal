"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl: string | null = null;

      if (image) {
        const { data, error } = await supabase.storage
          .from("products")
          .upload(`products/${Date.now()}-${image.name}`, image);

        if (error) throw error;

        const { data: urlData } = supabase.storage
          .from("products")
          .getPublicUrl(data.path);

        imageUrl = urlData.publicUrl;
      }

      const { error } = await supabase.from("products").insert([
        {
          name,
          description,
          price: parseFloat(price),
          category,
          image: imageUrl,
        },
      ]);

      if (error) throw error;

      alert("✅ Product uploaded successfully!");
      setName("");
      setDescription("");
      setPrice("");
      setCategory("");
      setImage(null);
    } catch (err: any) {
      console.error("Full error:", err); // Log full error for debugging
      alert("❌ Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin Upload</h1>
      <form onSubmit={handleUpload} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <textarea
          placeholder="Product Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white py-2 px-4 rounded"
        >
          {loading ? "Uploading..." : "Upload Product"}
        </button>
      </form>
    </div>
  );
}
