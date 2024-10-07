import React from 'react';
import OrderItem from '../../components/Products/OrderItem';
import { useSelector } from 'react-redux';
import withBaseComponent from '../../hocs/withBaseComponent';
import { Breadcrumb } from '../../components';
import { formatMoney } from '../../ultils/helpers';
import { createSearchParams, Link } from 'react-router-dom';
import path from '../../ultils/path';
import Swal from 'sweetalert2';

const DetailCart = ({ location, navigate }) => {
    const { currentCart, current } = useSelector(state => state.user);

    const handleChangeQuantites = (id, quantity, color) => {
        // Xử lý cập nhật số lượng sản phẩm trong giỏ hàng ở đây
        console.log(`Product ID: ${id}, Quantity: ${quantity}, Color: ${color}`);
        // Có thể gọi một action của Redux để cập nhật giỏ hàng
    };

    const handleSubmit = () => {
        if (!current?.address) {
            return Swal.fire({
                icon: 'info',
                title: 'Almost!',
                text: 'Please update your address before checkout',
                showCancelButton: true,
                showConfirmButton: true,
                confirmButtonText: 'Go Update',
                cancelButtonText: 'Cancel',
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate({
                        pathname: `/${path.MEMBER}/${path.PERSONAL}`,
                        search: createSearchParams({ redirect: location.pathname }).toString(),
                    });
                }
            });
        } else {
            window.open(`/${path.CHECKOUT}`, '_blank');
        }
    };

    return (
        <div className='w-full'>
            <div className='h-[81px] flex justify-center items-center bg-gray-100'>
                <div className='w-main'>
                    <h3 className='font-semibold text-2xl uppercase'>My Cart</h3>
                    <Breadcrumb category={location?.pathname?.replace('/', '')?.split('-')?.join(' ')} />
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
                        handleChangeQuantites={handleChangeQuantites} // Truyền hàm vào đây
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
                <Link target='_blank' className='bg-main text-white px-4 py-2 rounded-md' to={`/${path.CHECKOUT}`}>Thanh Toán</Link>
            </div>
        </div>
    );
};

export default withBaseComponent(DetailCart);
