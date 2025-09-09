"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
      action: "login"
    });

    if (result?.error) {
      setError("Invalid email or password");
    } else {
      window.location.href = "/"; // Redirect after login
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="bg-black p-8 rounded-2xl shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-400"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition"
          >
            Login
          </button>
          <div className="text-center mt-2">
            <a
              href="/reset-password"
              className="text-blue-400 hover:text-blue-600 text-sm"
            >
              Forgot Password?
            </a>
          </div>

            <div className="text-center mt-2">
            <a
              href="/signup"
              className="text-white"
            >
              Have you account? <span className="text-blue-600">Register</span>
            </a>
          </div>

        </form>
      </div>
    </div>
  );
}