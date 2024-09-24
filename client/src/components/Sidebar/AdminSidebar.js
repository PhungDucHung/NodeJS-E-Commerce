import React,{memo} from 'react'
import logo from '../../assets/logo_digital_new_250x.png'

const AdminSidebar = () => {
  return (
    <div className='p-4 bg-zinc-800 h-full'>
        <div className='flex justify-center items-center py-4 gap-2'>
            <img src={logo} alt='logo' className='w-[200px]' object-contain></img>
            <small>Admin Workspace</small>
        </div>
    </div>
  )
}

export default memo(AdminSidebar)
