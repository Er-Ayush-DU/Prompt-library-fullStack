"use client";

import Navbar from "./Navbar";
import { SessionProvider } from "next-auth/react"; // Yeh yahan nahi chahiye, SessionWrapper handle karega

export default function Header() {
  return (
    <Navbar /> 
  );
}