import React, { useState, useSyncExternalStore } from 'react'
import { formatMoney } from '../../ultils/helpers'
import label from '../../assets/label.png'
import labelGreen from '../../assets/labelGreen.png'
import { renderStarFromNumber } from '../../ultils/helpers'
import SelectOption from '../Search/SelectOption'
import icons from '../../ultils/icons'
import { Link } from 'react-router-dom'
const {FaEye ,MdOutlineMenu, FaHeart} = icons

const Product = ({productData, isNew, normal , navigate}) => {
    const [isShowOption, setIsShowOption] = useState(false)

const handleClickOptions = (e, flag) => {
    e.stopPropagation()
    if(flag === 'MENU') navigate(`${productData?.category?.toLowerCase()}/${productData?._id}/${productData?.title}`)
    if(flag === 'WISHLIST') console.log('WISHLIST')
    if(flag === 'QUICK_VIEW') console.log('QUICK_VIEW')
}

  return (
    <div className='w-full text-base px-[10px]'>
        <div className='w-full border p-[15px] flex flex-col items-center'
            onClick={e => navigate(`/${productData?.category?.toLowerCase()}/${productData?._id}/${productData?.title}`)}
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
                    <span onClick={(e) => handleClickOptions(e,'QUICK_VIEW')}><SelectOption icon={<FaEye/>}/></span>
                    <span onClick={(e) => handleClickOptions(e,'MENU')}><SelectOption icon={<MdOutlineMenu/>} /></span>
                    <span onClick={(e) => handleClickOptions(e,'WISHLIST')}><SelectOption icon={<FaHeart/>}/></span>
                </div>}
                <img 
                    src={productData?.thumb || 'https://niteair.co.uk/wp-content/uploads/2023/08/default-product-image.png'} alt='' className='w-[274px] h-[274px] object-cover' 
                />

                {!normal && <img 
                  src={isNew ? label : labelGreen} 
                  alt='' 
                  className={`absolute w-[100px] h-[25px] top-[-10px] left-[160px] object-cover`}
                />}
                
                </div>
                <div className='flex flex-col mt-[15px] items-start gap-1 w-full'>
                    <span className='flex h-4'>{renderStarFromNumber(productData?.totalRatings)?.map((el, index)=>(
                        <span key={index}>{el}</span>
                    ))}</span>
                    <span className='line-clamp-1 pt-2'>{productData?.title}</span>
                    <span>{`${formatMoney(productData?.price)} VNĐ`}</span>
                </div>
        </div>
    </div>
  )
}
export default Product
