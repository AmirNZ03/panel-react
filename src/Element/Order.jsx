import React, { useEffect, useState } from 'react'
import "./order.css"
import DeleteModal from './DeleteModal'
import EditModal from './EditModal'
// import {AiOutlineDollarCircle} from "react-icons"

import { MdOutlinePaid } from "react-icons/md";
export default function Order() {
    const[isShowModal,setIsShowModal]=useState(false)
    const[isShowEditModal,setIsShowEditModal]=useState(false)
    const[productID,setProductID]=useState(null)
    const[productName,setProductName]=useState(null)
    const[productPrice,setProductPrice]=useState(null)
    const[productCount,setProductCount]=useState(null)
      const[products,setProducts]=useState( [])
useEffect(()=>{
fetch("http://localhost:3001/api/products")
.then(res=>res.json())
.then(items=>setProducts(items))
    .catch(err => console.error("خطا در گرفتن محصولات:", err))

console.log(products);

},[])
    // const[isShowDet,setIsShowDet]=useState(false)
    const deleteact=()=>{
        
        setIsShowModal(false)
    fetch(`http://localhost:3001/api/products/delete/${productID}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
   
  })
    .then((res) => res.json())
    .then((result) => {
      console.log("محصول ویرایش شد:", result);
      setIsShowEditModal(false);
      
      swal({
        title: `محصول با موفقیت حذف شد`,
        icon: "success",
        button: {
          text: "باشه",
          closeModal: true
        },
        dangerMode: true
      });
      // لیست محصولات را دوباره بگیر
      fetch("http://localhost:3001/api/products")
        .then((res) => res.json())
        .then((items) => setProducts(items));
    })
    .catch((err) => {
      console.error("خطا در ویرایش:", err);
    });
        
    }
    const deleteClos=()=>{
        console.log("باز");
        
        setIsShowModal(false)
    }
  const update = (event) => {
  event.preventDefault();

  fetch(`http://localhost:3001/api/products/edit/${productID}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: productName,
      price: productPrice,
      count: productCount,
    }),
  })
    .then((res) => res.json())
    .then((result) => {
      console.log("محصول ویرایش شد:", result);
      setIsShowEditModal(false);
      
      swal({
        title: `محصول با موفقیت ویرایش شد`,
        icon: "success",
        button: {
          text: "باشه",
          closeModal: true
        },
        dangerMode: true
      });
      // لیست محصولات را دوباره بگیر
      fetch("http://localhost:3001/api/products")
        .then((res) => res.json())
        .then((items) => setProducts(items));
    })
    .catch((err) => {
      console.error("خطا در ویرایش:", err);
    });
};


  return (
    <div>
        <div className="adg">
    
    <table className='sca'>
     

        <tr className='msa'>
          <th className='ked'>
قیمت         
 </th>
          <th className='gev'>
تعداد         
 </th>
          <th className='esm'>
            اسم
          </th>
          <th className='aux'>
            عکس
          </th>
        </tr>
 <tbody>
{products.map((product)=>(
  <tr key={product.id}>
          
          <td>
          <button className='hazf' onClick={()=>{setIsShowModal(true)
            setProductID(product.id)
          }}>حذف</button>
          <button className='edir' onClick={()=>{setIsShowEditModal(true)
setProductName(product.name)
setProductCount(product.count)
setProductPrice(product.price)
            setProductID(product.id)

          }}>ویرایش</button>
         </td>
            <td className='count'>{product.count}</td>
            <td className='price'>{product.price}تومان</td>
            <td className='name'>{product.name}</td>
            <td><img src={product.image} alt="" className='aks' /></td>
          
          
          </tr>
))}
        
        </tbody>
     
      
    
      </table>
      {isShowModal && <DeleteModal submitAction={deleteact} cancelAction={deleteClos} msg={"آیا از حذف اطمینان دارید؟"}/>}
    
    { isShowEditModal && <EditModal
      onClose={()=>setIsShowEditModal(false)}
      onSubmit={update}
      >
<div className='edit-product'>
  <span>
<MdOutlinePaid/>
  </span>
  <input type="text" placeholder='عنوان جدید را وارد کنید' className='edit-inp' value={productName} onChange={(e)=>setProductName(e.target.value)}/>
</div>
<div className='edit-product'>
  <span>
  <MdOutlinePaid/>
  </span>
  <input type="text" placeholder='موجودی جدید را وارد کنید' className='edit-inp' value={productCount} onChange={(e)=>setProductCount(e.target.value)}/>
</div>
<div className='edit-product'>
  <span>
  <MdOutlinePaid/>
  </span>
  <input type="text" placeholder='قیمت جدید را وارد کنید' className='edit-inp' value={productPrice} onChange={(event)=>
    setProductPrice(event.target.value)
  }/>
</div>
</EditModal>}
 
    </div>
    </div>
  )
}
