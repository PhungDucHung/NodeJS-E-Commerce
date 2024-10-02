import React, { memo, Fragment, useState } from 'react';
import avatar from '../../assets/avatar.jpg';
import { memberSidebar } from '../../ultils/contants';
import { NavLink, Link } from 'react-router-dom';
import clsx from 'clsx';
import { AiOutlineCaretDown, AiOutlineCaretLeft } from 'react-icons/ai';
import { useSelector } from 'react-redux';

const activedStyle = 'px-4 py-2 flex items-center gap-2 text-gray-900 bg-gray-400';
const notActivedStyle = 'px-4 py-2 flex items-center gap-2 text-gray-900 hover:bg-gray-100';

const MemberSidebar = () => {
  const [actived, setActived] = useState([]);
  const { current } = useSelector(state=>state.user)
  const handleShowTabs = (tabID) => {
    setActived(prev => 
      prev.includes(tabID) ? prev.filter(id => id !== tabID) : [...prev, tabID]
    );
  };

    return (
        <div className='bg-white h-full py-4 w-[250px] flex-none'>
        <div className='flex w-full flex-col justify-center items-center py-4 gap-2'>
            <img src={current?.avatar || avatar } alt='logo' className='w-16 h-16 object-cover' />
            <small>{`${current?.lastname} ${current?.firstname}`}</small>
        </div>
        <div className='flex flex-col'>
            {memberSidebar?.map(el => (
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

                {el.type === 'PARENT' && (
                <div className='flex flex-col'>
                    <div onClick={() => handleShowTabs(el.id)} className='flex items-center justify-between px-4 py-2 hover:bg-gray-400 cursor-pointer text-gray-900'>
                    <div className='flex items-center gap-2'>
                        <span>{el.icon}</span>
                        <span>{el.text}</span>
                    </div>
                    {actived.includes(el.id) ? <AiOutlineCaretDown /> : <AiOutlineCaretLeft />}
                    </div>
                    {actived.includes(el.id) && (
                    <div className='flex flex-col pl-6'>
                        {el.submenu.map(item => (
                        <NavLink 
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => clsx(isActive ? activedStyle : notActivedStyle, 'pl-10')}
                        >
                            {item.text}
                        </NavLink>
                        ))}
                    </div>
                    )}
                </div>
                )}
            </Fragment>
            ))}
        </div>
        </div>
    );
    };

    export default memo(MemberSidebar);
