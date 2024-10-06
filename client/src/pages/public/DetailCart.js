import React from 'react';
import OrderItem from '../../components/Products/OrderItem';
import { useSelector } from 'react-redux';
import withBaseComponent from '../../hocs/withBaseComponent';
import { Breadcrumb, Button, SelectQuantity } from '../../components';
import { formatMoney } from '../../ultils/helpers';

const DetailCart = ({ location }) => {
    const { currentCart } = useSelector(state => state.user);

    return (
        <div className='w-full'>
            <div className='h-[81px] flex justify-center items-center bg-gray-100'>
                <div className='w-main'>
                    <h3 className='font-semibold uppercase'>My Cart</h3>
                    <Breadcrumb category={location?.pathname} />
                </div>
            </div>

            <div className='flex flex-col border w-main mx-auto my-8'>
                <div className='w-main mx-auto bg-gray-200 opacity-70 py-3 font-bold grid grid-cols-10'>
                    <span className='col-span-6 w-full text-center'>Sản phẩm</span>
                    <span className='col-span-1 w-full text-center'>Số lượng</span>
                    <span className='col-span-3 w-full text-center'>Giá</span>
                </div>

                {currentCart?.map(el => (
                    <OrderItem
                        key={el._id}
                        el={el}
                        defaultQuantity={el.quantity}
                    />
                ))}
            </div>

            <div className='w-main mx-auto flex flex-col mb-12 justify-center items-end gap-3'>
                <span className='flex items-center gap-8 text-sm'>
                    <span>Tổng cộng</span>
                    <span className='text-main font-bold'>
                        {`${formatMoney(currentCart?.reduce((sum, el) => sum + (el.product?.price * el.quantity), 0))} VNĐ`}
                    </span>
                </span>
                <span className='text-xs italic'>Chi phí vận chuyển, thuế và giảm giá sẽ được tính khi thanh toán</span>
                <Button>Thanh Toán</Button>
            </div>
        </div>
    );
};

export default withBaseComponent(DetailCart);
