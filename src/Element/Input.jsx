import React, { useEffect, useState } from 'react'
import "./input.css"
import { json } from 'body-parser'

export default function Input() {
  const[files,setFiles]=useState("")
    const[count,setCount]=useState("")
      const[price,setPrice]=useState("")
        const[name,setName]=useState("")
      const addpro = () => {
  fetch("http://localhost:3001/api/products/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: name,
      count: count,
      price: price,
      image: files.name || "",
    }),
  })
    .then((res) => res.json())
    .then((result) => {
      console.log("ثبت موفق:", result);
    })
    .catch((err) => {
      console.error("خطا در ثبت:", err);
    });
};


  return ( 
    
    <div className='tie'>
    <div className='kx'>
      <div className='pqi'>
        <input type="file" className='cxc'  onChange={(e)=>setFiles(e.target.files[0])}  />
        <input type="text" className='lpa' placeholder='موجودی محصول را بنویسید' value={count} onChange={(e)=>setCount(e.target.value)}  />
      </div>
      <div className='pqil'>
        <input type="text" className='asx' placeholder='اسم محصول را بنویسید' value={name} onChange={(e)=>setName(e.target.value)}  />
        <input type="text" className='twe' placeholder='قیمت محصول را بنویسید' value={price} onChange={(e)=>setPrice(e.target.value)}  />
      </div>
    </div>
    <button style={{backgroundColor:"green", color:"white", border:"none",outline:"none",borderRadius:"5px", padding:"8px",marginLeft:"30rem"}} onClick={addpro}>ثبت اطلاعات</button>
  </div>
  )
}
