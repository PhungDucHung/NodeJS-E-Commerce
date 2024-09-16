import React, { memo } from 'react'
import icons from '../ultils/icons'

const {FaChevronDown} = icons
const SearchItem = ({ name, activeClick ,changeActiveFilter }) => {
  return (
    <div 
        className='p-4 text-xs relative border border-gray-800 flex justify-between items-center gap-1'
        onClick={() => changeActiveFilter(name)}
        >
        <span className='capitalize'>{name}</span>
        <FaChevronDown/>
        {activeClick === name && <div className='absolute top-full left-0 w-fit p-4 bg-red-500'>
            cpntent
        </div>
        }
    </div>
  )
}

export default memo(SearchItem)
