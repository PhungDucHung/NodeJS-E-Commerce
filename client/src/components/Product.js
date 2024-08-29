import React from 'react'
import { formatMoney } from '../ultils/helpers'
import label from '../assets/label.png'
import labelGreen from '../assets/labelGreen.png'

const Product = ({productData, isNew }) => {
  return (
    <div className='w-full text-base px-[10px]'>
        <div className='w-full border p-[15px] flex flex-col itens-center'> 
            <div className='w-full relative'>
                <img 
                    src={productData?.thumb || 'https://niteair.co.uk/wp-content/uploads/2023/08/default-product-image.png'} alt='' className='w-[243px] h-[243px] object-cover' 
                />
              <img 
                  src={isNew ? label : labelGreen} 
                  alt='' 
                  className={`absolute w-[100px] h-[25px] top-[-10px] left-[180px] object-cover`}
                />
      
                </div>
                <div className='flex flex-col gap-1 mt-[15px] justify-start w-full '>
                    <span className='line-clamp-1'>{productData?.title}</span>
                    <span>{`${formatMoney(productData?.price)} VNĐ`}</span>
                </div>
        </div>
    </div>
  )
}

export default Product
