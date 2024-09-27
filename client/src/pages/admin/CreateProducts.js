import React, { useCallback, useEffect, useState } from 'react';
import { InputForm, Select, Button, MarkdownEditor } from '../../components';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { validate, getBase64 } from '../../ultils/helpers';
import { toast } from 'react-toastify';
import { BsTrash } from "react-icons/bs";
import { apiCreateProduct } from '../../apis'


const CreateProducts = () => {
  const { categories } = useSelector(state => state.app);
  const { register, formState: { errors }, handleSubmit, watch, reset } = useForm();
  
  const [preview, setPreview] = useState({ thumb: null, images: [] });
  const [payload, setPayload] = useState({ description: '' });
  const [invalidFields, setInvalidFields] = useState([]);

  const changeValue = useCallback((e) => {
    setPayload(e);
  }, [payload]);

  const [hoverEl, sethoverEl] = useState(null)
  const handlePreviewThumb = async (file) => {
    if (file) {
      const base64Thumb = await getBase64(file);
      setPreview(prev => ({ ...prev, thumb: base64Thumb }));
    }
  };

  const handlePreviewImages = async (files) => {
    const imagesPreview = [];
    for (let file of files) {
      if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
        toast.warning('Tệp không được hỗ trợ!');
        return;
      }
      const base64 = await getBase64(file);
      imagesPreview.push({name: file.name, path: base64});
    }
    setPreview(prev => ({ ...prev, images: imagesPreview }));
  };

  useEffect(() => {
    const thumbFiles = watch('thumb');
    if (thumbFiles) {
      handlePreviewThumb(thumbFiles[0]);
    }
  }, [watch('thumb')]);

  useEffect(() => {
    const images = watch('images');
    if (images && images.length) {
      handlePreviewImages(images);
    }
  }, [watch('images')]);


  const handleCreateProduct = async(data) => {
    const invalids = validate(payload, setInvalidFields);
    if (invalids === 0) {
      const selectedCategory = categories.find(el => el._id === data.category);
      if (selectedCategory) {
        data.category = selectedCategory.title;
      } else {
        console.error('Category not found');
      }
      const finalPayload = { ...data, ...payload };
      const formData = new FormData();
      for (let [key, value] of Object.entries(finalPayload)) {
        formData.append(key, value);
      }
      if(finalPayload.thumb) formData.append('thumb', finalPayload.thumb[0]);
      if(finalPayload.images) {
        for(let image of finalPayload.images) formData.append('images', image);
      }

      const response = await apiCreateProduct(formData);
      console.log(response)
    }
  };

  const handleRemoveImage = (name) => {
    const images = watch('images') || []; // Đảm bảo có giá trị mặc định là mảng
    const files = [...images]; // Spread images thành mảng
  
    reset({
      images: files.filter((file) => file.name !== name), // Lọc bỏ hình ảnh cần xóa
    });
  
    if (preview.images?.some((el) => el.name === name)) {
      setPreview((prev) => ({
        ...prev,
        images: prev.images.filter((el) => el.name !== name), // Cập nhật preview
      }));
    }
  };

  return (
    <div>
      <h1 className='h-[75px] flex justify-between items-center text-3xl font-bold px-4 borde-b'>
        <span>Create New Product</span>
      </h1>
      <div className='p-4'>
        <form onSubmit={handleSubmit(handleCreateProduct)}>
          <InputForm
            label='Name product'
            register={register}
            errors={errors}
            id='title'
            validate={{ required: 'Need fill this field' }}
            fullWidth
            placeholder="Name of new product"
          />
          <div className='w-full my-6 flex gap-4'>
            <InputForm
              label='Price'
              register={register}
              errors={errors}
              id='price'
              validate={{ required: 'Need fill this field' }}
              style='flex-auto'
              placeholder="Price of new product"
              type='number'
              fullWidth={true}
            />
            <InputForm
              label='Quantity'
              register={register}
              errors={errors}
              id='quantity'
              validate={{ required: 'Need fill this field' }}
              style='flex-auto'
              fullWidth
              placeholder="Quantity of new product"
              type='number'
            />
            <InputForm
              label='Color'
              register={register}
              errors={errors}
              id='color'
              validate={{ required: 'Need fill this field' }}
              style='flex-auto'
              fullWidth
              placeholder="Color of new product"
            />
          </div>
          <div className='w-full my-6 flex gap-4'>
            <Select
              label='Category'
              options={categories?.map(el => ({ code: el._id, value: el.title }))}
              register={register}
              id='category'
              validate={{ required: 'Need fill this field' }}
              style='flex-auto'
              errors={errors}
              fullWidth
            />
            <Select
              label='Brand (Optional)'
              options={categories?.find(el => el._id === watch('category'))?.brand?.map(el => ({ code: el, value: el }))}
              register={register}
              id='brand'
              validate={{ required: false }} // Brand is optional
              style='flex-auto'
              errors={errors}
              fullWidth
            />
          </div>
          <MarkdownEditor
            name='description'
            changeValue={changeValue}
            label='Description'
            invalidFields={invalidFields}
            setInvalidFields={setInvalidFields}
          />
          <div className='flex flex-col gap-2 mt-8'>
            <label className='font-semibold' htmlFor='thumb'>Upload thumb</label>
            <input 
              type='file' 
              id='thumb' 
              {...register('thumb', { required: 'Need fill' })}
            />
            {errors['thumb'] && <small className='text-xs text-red-500'>{errors['thumb']?.message}</small>}
          </div>

          {preview.thumb && (
            <div className='my-4'>
              <img src={preview.thumb} alt='thumbnail' className='w-[200px] object-contain' />
            </div>
          )}

          <div className='flex flex-col gap-2 mt-8'>
            <label className='font-semibold' htmlFor='products'>Upload images of product</label>
            <input 
              type='file' 
              id='products' 
              multiple
              {...register('images', { required: 'Need fill' })}
            />
            {errors['images'] && <small className='text-xs text-red-500'>{errors['images']?.message}</small>}
          </div>

          {preview.images.length > 0 && (
            <div className='my-4 flex w-full gap-3 flex-wrap'>
              {preview.images.map((el, idx) => (
                  <div 
                      onMouseEnter={() => sethoverEl(el.name)}
                      key={idx} 
                      className='w-fit relative'
                      onMouseLeave={() => sethoverEl(null)}
                  >
                      <img onMouseEnter={() => sethoverEl(el.name)} src={el.path} alt='product' className='w-[200px] object-contain' />
                      {hoverEl === el.name && <div 
                      className='absolute cursor-pointer animate-scale-up-center inset-0 bg-overlay flex items-center justify-center'
                      onClick={() => handleRemoveImage(el.name)}
                      >
                        <BsTrash size={24} color='white'/>
                        </div>}
                  </div>
              ))}
            </div>
          )}
 
          <div className='my-6'>
            <Button type='submit'>Create new product</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProducts;
