import React, { useEffect, useState } from 'react'
import "./Chart.css"
import { IoIosNotificationsOutline } from "react-icons/io";
import { FaAngleUp } from "react-icons/fa6";
import { FaRegEdit } from "react-icons/fa";
import { jwtDecode } from 'jwt-decode';

export default function Chart() {

  const[name,setName]=useState("")
  const[phone,setPhone]=useState("")
  const[image,setImage]=useState("")
  useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) {
    const decoded = jwtDecode(token);
    setName(decoded.name || "");
    setPhone(decoded.phone || "");
    setImage(decoded.image || "");
  }
}, []);

            const handleclick=()=>{
             
                  let token = localStorage.getItem("token");
                   
                            const decodef = jwtDecode(token);
                        

                                                                                 

                   console.log("iddec",decodef.id);
const formData = new FormData();
formData.append("id", decodef.id);
formData.append("name", name);
formData.append("phone", phone);
formData.append("image", image);
        fetch("http://localhost:3001/api/users/edit/profile", {

      method: "PUT",
      
      body:formData
    })
    .then((res) => res.json())
    .then((data) => {
      if (data.token) {
      localStorage.setItem("token", data.token);
         const decoded = jwtDecode(data.token); // 🆕
    setName(decoded.name || "");
    setPhone(decoded.phone || "");
    setImage(decoded.image || ""); // 🆕 توکن جدید رو ذخیره کن
    }
   swal({
    title: "اطلاعات شما با موفقیت ویرایش شد",
    icon: "success",
    button: {
      text: "باشه",
      closeModal: true
    },
    dangerMode: true
  });
      })
    
   
    }
  return (
    <div className='kds'>
      <div className='qo'>
        <button className='ang'>
          <div className='up'>
<FaAngleUp/>
</div>
        </button>
        <p className='paf'>ویرایش پروفایل</p>
        <div className='edt'>
<FaRegEdit/>
</div>
        
      </div>
      <div className='line'>

      </div>
      <div className='cma'>
        <p className='xam'>مدارک احراز هویت شما در حال بررسی می باشد. لطفا تا مشخص شدن وضعیت صبور باشید.</p>
        {/* <div className='madz'>
<IoIosNotificationsOutline/>
</div> */}
      </div>
      <div className='atri'>
        <div>
          <div className='rim'>
            <div className='mir'>
            <p>نام کاربری</p>
            <p>مدیر ارشد</p>
            <div className='yi'>
      <div className='nz'>
        <p className='mai'>دردسترس</p>
        <div className='cir'></div>
      </div>
    </div>
            </div>
        
          </div>
          {image && (
  <img
src={`http://localhost:3001/uploads/${image}`}
    alt="profile"
    style={{ width: "100px", height: "100px", borderRadius: "50%" ,marginLeft:"37rem", marginTop:"-6rem" }}
  />
)}

          <input type="file" name="" id="" className='lasq' placeholder='برای آپلود کلیک کنید'  onChange={(e)=>setImage(e.target.files[0])} />
          
          <div></div>
          <div className='line'>

</div>
          <div className='mxz'>
            <div className='alex'>
              <p id='lf'>نام و نام خانوادگی</p>
            <input type="text" id='paqs' value={name} onChange={(e)=>setName(e.target.value)} />
            </div>
          
          </div>
          <div className='alex'>
            <p className='lfl'>موبایل</p>
            <input type="text" className='lasq' placeholder='09---------' value={phone} onChange={(e)=>setPhone(e.target.value)} />
          </div>
          <div className='alex'>
            <p className='lfl'>ایمیل</p>
            <input type="text" className='lasq' />
          </div>
          <div className='alex'>
            <p className='lfl'>شماره شبا</p>
            <input type="text" className='lasq' placeholder='IR----------' />
          </div>
          <div className='alex'>
            <p className='lfl'>شماره کارت</p>
            <input type="text" className='lasq' />
          </div>
          <div className='mxz'>
          <div className='alex'>
            <p className='lf'>شهر</p>
           <select name="" id="" className='paqs' >
            <option value="">زنجان</option>
            <option value="">ابهر</option>
            <option value="">خرمدره</option>
            <option value="">خدابنده</option>
           </select>
          </div>
          <div className='alex'>
            <p className='lfn'>استان</p>
           <select name="" id="" className='paqsx' >
            <option value="">زنجان</option>
            <option value="">تهران</option>
            <option value="">فارس</option>
            <option value="">یزد</option>
           </select>
          </div>
          
          </div>
         
          <div id='ali'>
  <button className='baz'>بازگشت</button>
  <button className='zah' onClick={handleclick}>ذخیره</button>
</div>
          
        </div>
      </div>
    </div>
  )
}
