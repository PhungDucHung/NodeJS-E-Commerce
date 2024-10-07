import React from 'react';
import payment from '../../assets/payment.gif';
import { useSelector } from 'react-redux';
import { formatMoney } from '../../ultils/helpers';
import { InputForm, Paypal } from '../../components';
import { useForm } from 'react-hook-form';

const Checkout = () => {
  const {currentCart} = useSelector(state => state.user)
  const { register, formState: { errors }, handleSubmit, watch, reset } = useForm();


  console.log(currentCart)
  return (
    <div className='p-8 w-full grid grid-cols-10 h-full max-h-screen overflow-y-auto gap-6'>
      <div className='w-full flex items-center col-span-4'>
          <img src={payment} alt='payment' className='h-[70%] object-contain'></img>
      </div>
      <div className='flex w-full flex-col items-center justify-center col-span-6 gap-6'>
        <h2 className='text-3xl mb-6 font-bold'>Checkout your order</h2>
          <div className='w-full flex gap-6 '>
                <table className='table-auto flex-1 '>
                    <thead>
                        <tr className='border bg-gray-200 p-2'>
                            <th className='text-left p-2'>Products</th>
                            <th className='text-center p-2'>quantity</th>
                            <th className='text-right p-2'>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentCart?.map(el => (<tr className='border' key={el._id}>
                            <td className='text-left p-2'>{el?.product?.title}</td>
                            <td className='text-center p-2'>{el?.quantity}</td>
                            <td className='text-right p-2'>{ formatMoney(el?.product?.price) + ' VND' }</td>

                        </tr>))}
                    </tbody>
                </table>
              <div className='flex-1 w-full flex flex-col justify-between gap-[45px]'>
                  <div className='flex flex-col gap-6'>
                    <span className='flex w-full items-center gap-8 text-sm'>
                          <span className='font-medium'>Tổng cộng</span>
                          <span className='text-main font-bold'>
                              {`${formatMoney(currentCart?.reduce((sum, el) => sum + (el.product?.price * el.quantity), 0))} VNĐ`}
                          </span>
                      </span>
                      <InputForm               
                          label='Your address'
                          register={register}
                          errors={errors}
                          id='address'
                          validate={{ required: 'Need fill this field' }}
                          placeholder="Please type your address for ship"
                          style='text-sm'
                      />
                  </div>              
          <div className='w-full mx-auto'>
              <Paypal amount={Math.round(+currentCart?.reduce((sum, el) => sum + (el.product?.price * el.quantity), 0)/23500)}/>
          </div>
      </div>
    </div>
    </div>
    </div>
  );
}

export default Checkout;
