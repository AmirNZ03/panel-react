import React, { useEffect, useState } from 'react'
import './Pishkhan.css'
import Box from '../Main/Box/Box'
import Cunsom from '../Main/Cunsom/Cunsom'
import Map from '../Main/Map/Map'
import Farm from './Farm/Farm'
import { jwtDecode } from "jwt-decode";


export default function Pishkhan() {
      const [name, setName] = useState("");
  
 useEffect(() => {
  let token = localStorage.getItem("token");
  if (token) {
    token = token.trim();
    try {
      const decoded = jwtDecode(token);
      console.log("✅ decoded:", decoded);
      setName(decoded.name);

      swal({
        title: `خوش آمدید ${decoded.name}`,
        icon: "success",
        button: {
          text: "باشه",
          closeModal: true
        },
        dangerMode: true
      });

    } catch (error) {
      console.error("❌ خطا در دیکد کردن توکن:", error);
    }
  }
}, []);

  return (
    <div className='ls'>
  
    <div className='lox'>
    <Box/>
  
    </div>
    <div className='lox'>
    <Cunsom/>
    </div>
    {/* <div className='cac'>
 <Map/>
    </div> */}
    <>

    <Farm/>
    </>
        </div>
        
  )
}
