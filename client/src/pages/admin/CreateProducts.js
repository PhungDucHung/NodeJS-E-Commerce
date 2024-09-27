import React, { useCallback, useState } from 'react';
import { InputForm, Select, Button, MarkdownEditor } from '../../components';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { validate } from '../../ultils/helpers';

const CreateProducts = () => {
  const { categories } = useSelector(state => state.app);
  const { register, formState: { errors }, reset, handleSubmit, watch } = useForm();

  const [payload, setPayload] = useState({ description: '' });
  const [invalidFields, setInvalidFields] = useState([]);

  const changeValue = useCallback((e) => {
    setPayload(e);
  }, [payload]);

  const handleCreateProduct = (data) => {
    const invalids = validate(payload, setInvalidFields);
      if (invalids === 0) {
        const selectedCategory = categories.find(el => el._id === data.category);
        if (selectedCategory) {
          data.category = selectedCategory.title;
        } else {
          console.error('Category not found'); // Debugging statement
        }
        console.log({ ...data, ...payload });
      }
      if(data.category) data.category = categories?.find(el => el._id === data.category)?.title
      const finalPayload = { ...data, ...payload }
      const formData = new FormData()
      for(let i of Object.entries(finalPayload)) formData.append(i[0], i[1])
   
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
              id='quantity' // Fixed the ID here to be consistent
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

          <div className='my-6'>
              <Button type='submit'>Create new product</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProducts;
