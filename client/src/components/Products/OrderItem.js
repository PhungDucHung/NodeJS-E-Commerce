import React, { useState, useEffect } from 'react';
import { formatMoney } from '../../ultils/helpers';
import { useDispatch } from 'react-redux';
import SelectQuantity from '../Common/SelectQuantity';
import { updateCart } from '../../store/user/userSlice'; // Import updateCart
import withBaseComponent from '../../hocs/withBaseComponent';


const OrderItem = ({ el, handleChangeQuantites, defaultQuantity = 1 }) => {
    console.log(defaultQuantity)
    const dispatch = useDispatch();
    const [quantity, setQuantity] = useState(defaultQuantity);
    const handleQuantity = (number) => {
        if (+number > 1) setQuantity(number);
    };

    const handleChangeQuantity = (flag) => {
        if (flag === 'minus' && quantity === 1) return
        if (flag === 'minus') setQuantity(prev => +prev - 1);
        if (flag === 'plus') setQuantity(prev => +prev + 1);
    };
    console.log(el)
    useEffect(() => {
        handleChangeQuantites && handleChangeQuantites(el.product?._id, quantity, el.color)
    },[quantity])

    useEffect(() => {
        dispatch(updateCart({ pid: el.product?._id, quantity, color: el.color }));
    }, [quantity]);

    return (
        <div className='w-main mx-auto border-b font-bold grid grid-cols-10'>
            <span className='col-span-6 w-full text-center'>
                <div className='flex gap-2 px-4 py-3'>
                    <img src={el.product?.thumb} alt='thumb' className='w-28 h-28 object-cover' />
                    <div className='flex flex-col items-start gap-1'>
                        <span className='text-sm text-main'>{el.product?.title || "Tên sản phẩm không có"}</span>
                        <span className='text-[10px] font-main'>{el.color || "Màu không có"}</span>
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
                <span className='text-lg'>{formatMoney(el.price * quantity) + ' VNĐ'}</span>
            </span>
        </div>
    );
};

export default withBaseComponent(OrderItem);
