import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { createSlug } from '../../ultils/helpers';

const Sidebar = () => {
  const { categories, isLoading, errorMessage } = useSelector(state => state.app || {});

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (errorMessage) {
    return <div>Error: {errorMessage}</div>;
  }

  if (!categories || categories.length === 0) {
    return <div>No categories available</div>; // Điều này sẽ hiển thị nếu không có danh mục
  }

  return (
    <div className='flex flex-col border'>
      {categories.map(el => (
        <NavLink
          key={createSlug(el.title)}
          to={createSlug(el.title)}
          className={({ isActive }) =>
            isActive
              ? 'bg-main text-white px-5 pt-[15px] pb-[14px] text-sm hover:text-main'
              : 'px-5 pt-[15px] pb-[14px] text-sm hover:text-main'
          }
        >
          {el.title}
        </NavLink>
      ))}
    </div>
  );
};

export default Sidebar;
