"use client";

import {useState , useEffect} from 'react';
import Image  from  "next/image"


export default function AdminPanel(){
   const [prompts , setPrompts] = useState([]);
   const [users , setUsers] = useState([]);
   const [activeTab , setActiveTab] = useState('prompts');

   useEffect(()=>{
    fetchPrompts();
    fetchUsers();
   },[]);

   const fetchPrompts = async ()=>{
     const res = await fetch('/api/admin/prompts');
     const data = await res.json();
     setPrompts(data.prompts || []);
   };

    const fetchUsers = async ()=>{
    const res = await fetch('/api/admin/users');
    const data = await res.json();
    setUsers(data.users || []);
   };
    

   const deletePrompt = async (id:string)=>{
      if(!confirm("Delete this prompt?")) return; 
      await fetch(`api/admin/prompts/${id}` , {method:"DELETE"});
      fetchPrompts();
   }


   const deleteUser = async (id:string) =>{
      if(!confirm("Delete this user and all their prompts?")) return;
      await fetch(`api/admin/users/${id}` , {method : "DELETE"});
      fetchUsers();
   }



   return (
    <div className="max-w-7xl mx-auto">
      {/* TABS */}
      <div className="flex gap-4 mb-8 justify-center">
        <button
          onClick={() => setActiveTab("prompts")}
          className={`px-8 py-3 rounded-full font-bold ${activeTab === "prompts" ? "bg-purple-600" : "bg-white/10"}`}
        >
          All Prompts ({prompts.length})
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`px-8 py-3 rounded-full font-bold ${activeTab === "users" ? "bg-purple-600" : "bg-white/10"}`}
        >
          All Users ({users.length})
        </button>
      </div>

      {/* PROMPTS TAB */}
      {activeTab === "prompts" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prompts.map((p: any) => (
            <div key={p._id} className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-purple-500/30">
              <Image src={p.previewUrl} alt="" width={400} height={400} className="rounded-xl w-full" />
              <h3 className="text-xl font-bold mt-3">{p.title}</h3>
              <p className="text-sm text-gray-300">by {p.createdBy?.name}</p>
              <p className="text-lg font-bold text-green-400">₹{p.price}</p>
              <button
                onClick={() => deletePrompt(p._id)}
                className="mt-4 w-full py-3 bg-red-600 hover:bg-red-700 rounded-xl font-bold"
              >
                DELETE PROMPT
              </button>
            </div>
          ))}
        </div>
      )}

      {/* USERS TAB */}
      {activeTab === "users" && (
        <div className="space-y-6">
          {users.map((u: any) => (
            <div key={u._id} className="bg-white/10 backdrop-blur rounded-2xl p-6 flex items-center justify-between border border-purple-500/30">
              <div className="flex items-center gap-4">
                <Image src={u.image || "/default-avatar.png"} alt="" width={60} height={60} className="rounded-full" />
                <div>
                  <h3 className="text-xl font-bold">{u.name}</h3>
                  <p className="text-gray-300">{u.email}</p>
                  <p className="text-sm text-purple-300">{u.prompts?.length || 0} prompts</p>
                </div>
              </div>
              <button
                onClick={() => deleteUser(u._id)}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-xl font-bold"
              >
                DELETE USER
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

}