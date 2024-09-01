import React, { useState, useSyncExternalStore } from 'react'
import { formatMoney } from '../ultils/helpers'
import label from '../assets/label.png'
import labelGreen from '../assets/labelGreen.png'
import { renderStarFromNumber } from '../ultils/helpers'
import SelectOption from './SelectOption'
import icons from '../ultils/icons'


const {FaEye ,MdOutlineMenu, FaHeart} = icons

const Product = ({productData, isNew }) => {
  const [isShowOption, setIsShowOption] = useState(false)
  return (
    <div className='w-full text-base px-[10px]'>
        <div className='w-full border p-[15px] flex flex-col items-center'
             onMouseEnter={e => {
                e.stopPropagation();
                setIsShowOption(true)
             }}
             onMouseLeave={e => {
                e.stopPropagation();
                setIsShowOption(false)
             }}
        > 
            <div className='w-full relative'>
                {isShowOption && <div className='absolute bottom-[-10px] left-0 right-0 flex justify-center gap-2 animate-slide-top'>
                    <SelectOption icon={<FaEye/>}/>
                    <SelectOption icon={<MdOutlineMenu/>}/>
                    <SelectOption icon={<FaHeart/>}/>
                </div>}
                <img 
                    src={productData?.thumb || 'https://niteair.co.uk/wp-content/uploads/2023/08/default-product-image.png'} alt='' className='w-[274px] h-[274px] object-cover' 
                />
              <img 
                  src={isNew ? label : labelGreen} 
                  alt='' 
                  className={`absolute w-[100px] h-[25px] top-[-10px] left-[160px] object-cover`}
                />
                </div>
        </div>
    </div>
  )
}
export default Product
