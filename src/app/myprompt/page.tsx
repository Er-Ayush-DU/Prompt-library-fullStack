"use client";
import { useState, useEffect } from "react";

interface Prompt {
  _id: string;
  title: string;
}

interface PurchasedResponse {
  purchased: boolean;
}

export default function MyPrompts({ userId }: { userId: string }) {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [purchasedIds, setPurchasedIds] = useState<string[]>([]);

  useEffect(() => {
    // Example prompts; replace with fetch from your DB
    setPrompts([
      { _id: "68b632debc9486e0d55a3f49", title: "Prompt 1" },
      { _id: "68c7ed31249fe8ade878424d", title: "Prompt 2" },
    ]);
  }, []);

  const checkPurchased = async (promptId: string) => {
    const res = await fetch(
      `/api/check-purchased?promptId=${promptId}&userId=${userId}`
    );
    const data: PurchasedResponse = await res.json();

    if (data.purchased) {
      setPurchasedIds((prev) => [...prev, promptId]);
    }
  };

  useEffect(() => {
    // Check all prompts purchased status
    prompts.forEach((prompt) => checkPurchased(prompt._id));
  }, [prompts]);

  return (
    <div>
      {prompts.map((prompt) => (
        <div key={prompt._id} style={{ marginBottom: "1rem" }}>
          <h3>{prompt.title}</h3>
          {purchasedIds.includes(prompt._id) ? (
            <p style={{ color: "green" }}>Purchased ✅</p>
          ) : (
            <p style={{ color: "red" }}>Not Purchased ❌</p>
          )}
        </div>
      ))}
    </div>
  );
}
