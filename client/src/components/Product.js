import React, { useState, useSyncExternalStore } from 'react'
import { formatMoney } from '../ultils/helpers'
import label from '../assets/label.png'
import labelGreen from '../assets/labelGreen.png'
import { renderStarFromNumber } from '../ultils/helpers'
import SelectOption from './SelectOption'
import icons from '../ultils/icons'
import { Link } from 'react-router-dom'
import path from '../ultils/path'

const {FaEye ,MdOutlineMenu, FaHeart} = icons

const Product = ({productData, isNew }) => {
  const [isShowOption, setIsShowOption] = useState(false)


  return (
    <div className='w-full text-base px-[10px]'>
        <Link className='w-full border p-[15px] flex flex-col items-center'
             to={`/${path.DETAIL_PRODUCT}/${productData?._id}/${productData?.title}`}
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
                <div className='flex flex-col mt-[15px] items-start gap-1 w-full'>
                    <span className='flex h-4'>{renderStarFromNumber(productData?.totalRatings)?.map((el, index)=>(
                        <span key={index}>{el}</span>
                    ))}</span>
                    <span className='line-clamp-1 pt-2'>{productData?.title}</span>
                    <span>{`${formatMoney(productData?.price)} VNĐ`}</span>
                </div>
        </Link>
    </div>
  )
}
export default Product
