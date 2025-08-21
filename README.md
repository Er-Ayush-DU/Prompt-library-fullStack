built a prompt Library


## Getting Started

First, run the development server:

```bash
npm run dev
```




# api/login

``` typecript
// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";

// export default function LoginPage() {
//   const router = useRouter();
//   const [form, setForm] = useState({ email: "", password: "" });
//   const [error, setError] = useState("");

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");
//     try {
//       const res = await fetch("/api/auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(form)
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error || "Login failed");
//       router.push("/"); // Home page
//     } catch (err: any) {
//       setError(err.message);
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-900">
//       <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
//         <h1 className="text-2xl font-bold text-white mb-4">Login</h1>
//         {error && <p className="text-red-500 mb-2">{error}</p>}

//         <input
//           name="email"
//           type="email"
//           placeholder="Email"
//           value={form.email}
//           onChange={handleChange}
//           className="w-full p-2 mb-3 rounded bg-gray-700 text-white"
//           required
//         />
//         <input
//           name="password"
//           type="password"
//           placeholder="Password"
//           value={form.password}
//           onChange={handleChange}
//           className="w-full p-2 mb-3 rounded bg-gray-700 text-white"
//           required
//         />
//         <button
//           type="submit"
//           className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
//         >
//           Login
//         </button>
//       </form>
//     </div>
//   );// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";

// export default function SignupPage() {
//   const router = useRouter();
//   const [form, setForm] = useState({ name: "", email: "", password: "", bio: "" });
//   const [error, setError] = useState("");

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");
//     try {
//       const res = await fetch("/api/auth/signup", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(form)
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error || "Signup failed");
//       router.push("/login");
//     } catch (err: any) {
//       setError(err.message);
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-900">
//       <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
//         <h1 className="text-2xl font-bold text-white mb-4">Sign Up</h1>
//         {error && <p className="text-red-500 mb-2">{error}</p>}

//         <input
//           name="name"
//           type="text"
//           placeholder="Name"
//           value={form.name}
//           onChange={handleChange}
//           className="w-full p-2 mb-3 rounded bg-gray-700 text-white"
//           required
//         />
//         <input
//           name="email"
//           type="email"
//           placeholder="Email"
//           value={form.email}
//           onChange={handleChange}
//           className="w-full p-2 mb-3 rounded bg-gray-700 text-white"
//           required
//         />
//         <input
//           name="password"
//           type="password"
//           placeholder="Password"
//           value={form.password}
//           onChange={handleChange}
//           className="w-full p-2 mb-3 rounded bg-gray-700 text-white"
//           required
//         />
//         <textarea
//           name="bio"
//           placeholder="Short Bio"
//           value={form.bio}
//           onChange={handleChange}
//           className="w-full p-2 mb-3 rounded bg-gray-700 text-white"
//         />
//         <button
//           type="submit"
//           className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
//         >
//           Sign Up
//         </button>
//       </form>
//     </div>
//   );
// }

// }


```

# api/signup

