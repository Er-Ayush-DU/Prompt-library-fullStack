import React from 'react';
import mongoose from 'mongoose';

export const dbConnect = async ()=>{
  if (process.env.MONGODB_URI){
    const mongoose = require('mongoose')
  }
try{
  mongoose.connect(process.env.MONGODB_URI!);
  const db = mongoose.connection;
  db.on('connected', ()=>{
    console.log('✅ Database connected successfully'); 
  })
  db.on('error', (error) => {
    console.error('Database connection error:', error);
    process.exit(1); // Exit the process if connection fails
  });
}
catch (error) {
  console.error('Database connection error:', error);
  throw new Error('❌ Failed to connect to the database');   
}
}