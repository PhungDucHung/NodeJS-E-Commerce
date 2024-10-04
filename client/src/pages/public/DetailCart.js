import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import withBaseComponent from '../../hocs/withBaseComponent'
import { Breadcrumb, SelectQuantity } from '../../components'
import { formatMoney } from '../../ultils/helpers'

const DetailCart = ({location}) => {
    const { current } = useSelector(state => state.user)
    const [quantity, setQuantity] = useState(0)
    const handleQuantity = (number) => {
       if (+number > 1) setQuantity(number)
    }

    const handleChangeQuantity = (flag) => {
        if (flag === 'minus' && quantity === 1) return;
        if (flag === 'minus') {
            setQuantity(prev => +prev - 1);
        }
        if (flag === 'plus') {
            setQuantity(prev => +prev + 1);
        }
    }

    return (
        <div className='w-full'>
            <div className='h-[81px] flex justify-center items-center bg-gray-100'>
                <div className='w-main'>
                        <h3 className='font-semibold uppercase'>My Cart</h3>
                        <Breadcrumb category={location?.pathname} />
                </div>
            </div>

            {current?.cart?.map(el => (
            <div key={el._id} className='w-main mx-auto font-bold my-8 border py-3 grid grid-cols-10'>
                <span className='col-span-6 w-full text-center'>
                <div className='flex gap-2'>
                   <img src={el.product?.thumb} alt='thumb' className='w-28 h-28 object-cover' />
                    <div className='flex flex-col items-start gap-1'>
                        <span className='text-sm text-main'>{el.product?.title || "Tên sản phẩm không có"}</span>
                        <span className='text-[10px]'>{el.color || "Màu không có"}</span>
                    </div>
                   </div>
                </span>
                <span className='col-span-1 w-full text-center'>
                    <div className='flex items-center h-full'>
                    <SelectQuantity
                        quantity={quantity} 
                        handleQuantity={handleQuantity} 
                        handleChangeQuantity={handleChangeQuantity}
                    />
                    </div>
                </span>
                <span className='col-span-3 w-full h-full flex items-center justify-center text-center'>
                <span className='text-lg'>{formatMoney(el.product?.price) + 'VNĐ' }</span>
                </span>
            </div>
            ))}
        </div>
    )}

export default withBaseComponent(DetailCart)
