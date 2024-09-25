import React, { memo, Fragment, useState } from 'react';
import logo from '../../assets/logo_digital_new_250x.png';
import { adminSidebar } from '../../ultils/contants';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { AiOutlineCaretDown, AiOutlineCaretLeft } from 'react-icons/ai'

const activedStyle = 'px-4 py-2 flex items-center gap-2 text-gray-900 bg-gray-400';
const notActivedStyle = 'px-4 py-2 flex items-center gap-2 text-gray-900 hover:bg-gray-100';

const AdminSidebar = () => {
  const [actived, setActived] = useState([])
  const handleShowTabs = (tabID) => {
    if(actived.some(el => el === tabID)) setActived(prev => prev.filter(el => el!== tabID))
    else setActived(prev => [...prev, tabID])
  }

  console.log(actived)
  return (
    <div className='bg-white h-full py-4'>
      <div className='flex flex-col justify-center items-center p-4 gap-2'>
        <img src={logo} alt='logo' className='w-[200px]' />
        <small>Admin Workspace</small>
      </div>
      <div className='flex flex-col'>
        {adminSidebar?.map(el => (
          <Fragment key={el.id}>
            {el.type === 'SINGLE' && (
              <NavLink 
                to={el.path}
                className={({ isActive }) => clsx(isActive ? activedStyle : notActivedStyle, 'pl-6')}
              >
                <span>{el.icon}</span>
                <span>{el.text}</span>
              </NavLink>
            )}

            {el.type === 'PARENT' && 
              <div onClick={() => handleShowTabs(el.id)} className='flex flex-col text-gray-900'>
                <div className='flex items-center justify-between px-4 py-2 hover:bg-gray-400 cursor-pointer'>
                  <div className='flex items-center gap-2'>
                      <span>{el.icon}</span>
                      <span>{el.text}</span>
                  </div>
                  {!actived.some(id => id === el.id) ? <AiOutlineCaretLeft/> : <AiOutlineCaretDown/>}
                </div>
                {actived.some(id => +id === +el.id) && <div className='flex flex-col'>
                  {el.submenu.map(item => (
                    <NavLink 
                      key={item.path}  // Sử dụng item.path để đảm bảo tính duy nhất
                      to={item.path}
                      className={({ isActive }) => clsx(isActive && activedStyle, !isActive && notActivedStyle ,'pl-10')}
                    >
                      {item.text}
                    </NavLink>
                  ))}
                </div>}
         
              </div>
            }
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default memo(AdminSidebar);
