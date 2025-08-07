"use client";

import { useState } from "react";

export default function Home() {
  const [form, setForm] = useState({ to: "", subject: "", text: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:3001/email/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      setMessage(data.message || "Амжилттай илгээгдлээ");
    } catch (error) {
      setMessage("Алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 bg-white">
      <form onSubmit={handleSubmit} className="max-w-md w-full space-y-4">
        <h1 className="text-2xl font-bold mb-4 text-center">Имэйл илгээх</h1>
        <input
          type="email"
          name="to"
          placeholder="Хүлээн авагчийн имэйл"
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="subject"
          placeholder="Гарчиг"
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="text"
          placeholder="Мессеж"
          rows={5}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Илгээж байна..." : "Илгээх"}
        </button>
        {message && <p className="text-center text-green-600">{message}</p>}
      </form>
    </div>
  );
}
