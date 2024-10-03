import React, { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { InputForm } from '../../components';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import Button from '../../components/Buttons/Button';
import avatar from '../../assets/avatar.jpg'
import { apiUpdateCurrent } from '../../apis';
import { getCurrent } from '../../store/user/asyncActions';
import { toast } from 'react-toastify'

const Personal = () => {
  const { register, formState: { errors, isDirty }, handleSubmit, reset } = useForm();
  const { current } = useSelector(state => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (current) {
      reset({
        firstname: current.firstname,
        lastname: current.lastname,
        mobile: current.mobile,
        email: current.email,
        avatar: current.avatar
      });
    }
  }, [current, reset]);

  const handleUpdateInfor = async (data) => {
    const formData = new FormData();
    
    // Kiểm tra avatar và thêm vào formData
    if (data.avatar && data.avatar.length > 0) {
      formData.append('avatar', data.avatar[0]);
      delete data.avatar; // Xóa avatar khỏi data
    }
  
    // Chuyển đổi các trường từ mảng thành chuỗi (nếu cần)
    for (let [key, value] of Object.entries(data)) {
      if (Array.isArray(value)) {
        formData.append(key, value.join(', ')); // Chuyển mảng thành chuỗi
      } else {
        formData.append(key, value);
      }
    }
  
    try {
      const response = await apiUpdateCurrent(formData);
      if (response.success) { 
        dispatch(getCurrent());
        toast.success(response.mes);
      } else {
        toast.error(response.mes);
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
      console.error(error); // In lỗi ra console để dễ dàng debug
    }
  };
  

  return (
    <div className='w-full relative px-4'>
      <header className='text-3xl font-semibold py-4 border-b-blue-200'>
        Thông Tin Cá Nhân
      </header>
      <form onSubmit={handleSubmit(handleUpdateInfor)} className='w-3/5 mx-auto py-8 flex flex-col gap-4'>
        <InputForm
          label='Họ'
          register={register}
          errors={errors}
          id='firstname'
          validate={{ required: 'Vui lòng điền trường này' }}
        />

        <InputForm
          label='Tên'
          register={register}
          errors={errors}
          id='lastname'
          validate={{ required: 'Vui lòng điền trường này' }}
        />

        <InputForm
          label='Địa Chỉ Email'
          register={register}
          errors={errors}
          id='email'
          validate={{
            required: 'Vui lòng điền trường này',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Email không hợp lệ'
            }
          }}
        />

        <InputForm
          label='Số Điện Thoại'
          register={register}
          errors={errors}
          id='mobile'
          validate={{
            required: 'Vui lòng điền trường này',
            pattern: {
              value: /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/,
              message: 'Số điện thoại không hợp lệ',
            },
          }}
        />

        <div className='flex items-center gap-2'>
          <span className='font-medium'>Trạng Thái Tài Khoản:</span>
          <span>{current?.isBlocked ? 'Đã Bị Khóa' : 'Đang Hoạt Động'}</span>
        </div>
        <div className='flex items-center gap-2'>
          <span className='font-medium'>Vai Trò:</span>
          <span>{current?.role === 1945 ? 'Quản Trị Viên' : 'Người Dùng'}</span>
        </div>
        <div className='flex items-center gap-2'>
          <span className='font-medium'>Ngày Tạo:</span>
          <span>{moment(current?.createdAt).fromNow()}</span>
        </div>

        <div className='flex flex-col gap-2'>
          <span className='font-medium'>Profile image: </span>
          <label htmlFor='file'>
              <img src={current?.avatar || avatar} alt='avatar' className='w-20 h-20 ml-8 object-cover rounded-full'/>
          </label>
          <input type='file' id='file' {...register('avatar')} hidden/>
        </div>

        {isDirty && <div className='w-full flex justify-end'><Button type="submit">Cập Nhật Thông Tin</Button></div>}
      </form>
    </div>
  );
}

export default Personal;
