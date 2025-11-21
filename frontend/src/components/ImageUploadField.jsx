import { useState } from "react";
import api from "../api/client";
import { API_URL } from "../config/api";

export default function ImageUploadField({ value, onChange }) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setUploading(true);
    try {
      const res = await api.post("/services/admin/upload-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const url = res.data.imageUrl;
      onChange(url); 
    } catch (err) {
      console.error("Error uploading image:", err);
      alert(
        err.response?.data?.message || "Не вдалося завантажити зображення."
      );
    } finally {
      setUploading(false);
    }
  };

  const fullUrl =
    value && value.startsWith("/uploads")
      ? `${API_URL}${value}`
      : value || "";

  return (
    <div className="admin-image-upload flex !items-center">
      <div className="admin-image-upload__preview">
        {fullUrl ? (
          <img src={fullUrl} alt="Preview" />
        ) : (
          <span className="text-center">Зображення ще не вибрано</span>
        )}
      </div>

      <div className="admin-image-upload__controls">
        <label className="admin-image-upload__btn">
          <span>{uploading ? "Завантаження..." : "Обрати файл"}</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>

        {value && (
          <button
            type="button"
            className="admin-image-upload__clear"
            onClick={() => onChange("")}
          >
            Видалити
          </button>
        )}
      </div>
    </div>
  );
}