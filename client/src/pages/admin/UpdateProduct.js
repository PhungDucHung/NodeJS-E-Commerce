import React, { memo, useState, useEffect, useCallback } from 'react';
import { InputForm, MarkdownEditor, Select, Button, Loading } from '../../components';
import { useForm } from 'react-hook-form';
import { validate, getBase64 } from '../../ultils/helpers';
import { toast } from 'react-toastify';
import { BsTrash } from 'react-icons/bs';
import { apiUpdateProduct } from '../../apis';
import { showModal } from '../../store/app/appSlice';
import { useSelector, useDispatch } from 'react-redux';

const UpdateProduct = ({ editProduct, setEditProduct }) => {
    const { categories } = useSelector(state => state.app);
    const dispatch = useDispatch();
    const { register, handleSubmit, formState: { errors }, reset, watch } = useForm();
    const [payload, setPayload] = useState({ description: '' });
    const [preview, setPreview] = useState({ thumb: null, images: [] });
    const [invalidFields, setInvalidFields] = useState([]);
    const [hoverEl, setHoverEl] = useState(null);

    useEffect(() => {
        reset({
            title: editProduct?.title || '',
            price: editProduct?.price || '',
            quantity: editProduct?.quantity || '',
            color: editProduct?.color || '',
            category: editProduct?.category || '',
            brand: editProduct?.brand?.toLowerCase() || '',
        });
        setPayload({ description: typeof editProduct?.description === 'object' ? editProduct?.description?.join(', ') : editProduct?.description});
        setPreview({
            thumb: editProduct?.thumb || '',
            images: editProduct?.images || []
        })
    }, [editProduct]);

    const changeValue = useCallback((e) => {
        setPayload(e);
    }, [payload]);

    const handlePreviewThumb = async (file) => {
        if (file && file instanceof File) {
            const base64Thumb = await getBase64(file);
            setPreview(prev => ({ ...prev, thumb: base64Thumb }));
        }
    };

    const handlePreviewImages = async (files) => {
        const imagesPreview = [];
        for (let file of files) {
            if (file instanceof File) {
                if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
                    toast.warning('Unsupported file type!');
                    return;
                }
                const base64 = await getBase64(file);
                imagesPreview.push(base64);
            }
        }
        setPreview(prev => ({ ...prev, images: imagesPreview }));
    };

    useEffect(() => {
        if ( watch('thumb') instanceof FileList && watch('thumb').length > 0 )
        handlePreviewThumb(watch('thumb')[0]);
    }, [watch('thumb')]);

    useEffect(() => {
        const images = watch('images');
        if (images && images.length > 0 && images instanceof FileList) {
            handlePreviewImages(Array.from(images));
        }
    }, [watch('images')]);
    

    const handleUpdateProduct = async (data) => {
        // Kiểm tra payload
        const invalids = validate(payload, setInvalidFields);
        if (invalids === 0) {
            // Xác định danh mục
            if (data.category) {
                const categoryItem = categories?.find(el => el.title === data.category);
                if (categoryItem) {
                    data.category = categoryItem.title;
                }
            }
    
            // Tạo finalPayload
            const finalPayload = { ...data, ...payload };
            const formData = new FormData();
    
            // Thêm các trường vào formData
            for (let [key, value] of Object.entries(finalPayload)) {
                formData.append(key, value);
            }
    
            // Xử lý thumb
            const thumbValue = watch('thumb') instanceof FileList ? watch('thumb')[0] : finalPayload.thumb;
            if (thumbValue) {
                formData.append('thumb', thumbValue);
            }
    
            // Xử lý images
            const images = finalPayload.images && Array.isArray(finalPayload.images) ? finalPayload.images : preview.images;
            for (let image of images) {
                if (image instanceof File) {
                    formData.append('images', image);
                } else {
                    // Nếu image không phải là File, hãy kiểm tra kiểu dữ liệu của nó
                    console.warn('Expected image to be a File but received:', image);
                }
            }
    
            // Hiển thị modal loading
            dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }));
    
            try {
                // Gọi API cập nhật sản phẩm
                const response = await apiUpdateProduct(formData, editProduct._id);
                
                if(response)
                // Kiểm tra phản hồi
                if (response.error) {
                    console.error('Error updating product:', response.error);
                    // Có thể hiển thị thông báo lỗi cho người dùng
                } else {
                    console.log('Product updated successfully:', response);
                    // Có thể thông báo thành công cho người dùng
                }
            } catch (error) {
                console.error('An error occurred while updating the product:', error);
            } finally {
                dispatch(showModal({ isShowModal: false, modalChildren: null }));
            }
        }
    };
    
    const handleRemoveImage = (name) => {
        const images = watch('images') || [];
        const filteredImages = images.filter(file => file.name !== name);
        reset({ images: filteredImages });

        setPreview(prev => ({
            ...prev,
            images: prev.images.filter(el => el.name !== name),
        }));
    };

    return (
        <div className='w-full flex flex-col gap-4 relative p-4'>
            <div className='border-b bg-gray-100 w-full flex justify-between items-center'>
                <h1 className='text-3xl font-bold tracking-tight'>Update Products</h1>
                <span className='text-main hover:underline cursor-pointer' onClick={() => setEditProduct(null)}>Cancel</span>
            </div>
            <form onSubmit={handleSubmit(handleUpdateProduct)} className='flex flex-col'>
                <InputForm
                    label='Name product'
                    register={register}
                    errors={errors}
                    id='title'
                    validate={{ required: 'This field is required' }}
                    fullWidth
                    placeholder="Name of new product"
                />
                <div className='flex gap-4'>
                    <InputForm
                        label='Price'
                        register={register}
                        errors={errors}
                        id='price'
                        validate={{ required: 'This field is required' }}
                        type='number'
                        fullWidth
                        placeholder="Price of new product"
                    />
                    <InputForm
                        label='Quantity'
                        register={register}
                        errors={errors}
                        id='quantity'
                        validate={{ required: 'This field is required' }}
                        type='number'
                        fullWidth
                        placeholder="Quantity of new product"
                    />
                    <InputForm
                        label='Color'
                        register={register}
                        errors={errors}
                        id='color'
                        validate={{ required: 'This field is required' }}
                        fullWidth
                        placeholder="Color of new product"
                    />
                </div>
                <div className='flex gap-4'>
                    <Select
                        label='Category'
                        options={categories?.map(el => ({ code: el._id, value: el.title }))}
                        register={register}
                        id='category'
                        errors={errors}
                        fullWidth
                    />
                    <Select
                        label='Brand (Optional)'
                        options={categories?.find(el => el.title === watch('category'))?.brand?.map(el => ({ code: el.toLowerCase(), value: el })) || []}
                        register={register}
                        id='brand'
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
                    value={payload.description}
                />

                <div className='flex flex-col gap-2 mt-8'>
                    <label className='font-semibold' htmlFor='thumb'>Upload Thumbnail</label>
                    <input
                        type='file'
                        id='thumb'
                        {...register('thumb')}
                    />
                    {errors['thumb'] && <small className='text-xs text-red-500'>{errors['thumb']?.message}</small>}
                </div>

                {preview.thumb && (
                    <div className='my-4'>
                        <img src={preview.thumb} alt='thumbnail' className='w-[200px] object-contain' />
                    </div>
                )}

                <div className='flex flex-col gap-2 mt-8'>
                    <label className='font-semibold' htmlFor='products'>Upload Images of Product</label>
                    <input
                        type='file'
                        id='products'
                        multiple
                        {...register('images')}
                    />
                    {errors['images'] && <small className='text-xs text-red-500'>{errors['images']?.message}</small>}
                </div>

                {preview.images.length > 0 && (
                    <div className='my-4 flex w-full gap-3 flex-wrap'>
                        {preview.images.map((el, idx) => (
                            <div key={idx} className='w-fit relative'>
                                <img src={el} alt='product' className='w-[200px] object-contain' />
                                {hoverEl === el.name && (
                                    <div
                                        className='absolute cursor-pointer inset-0 bg-overlay flex items-center justify-center'
                                        onClick={() => handleRemoveImage(el.name)}
                                    >
                                        <BsTrash size={24} color='white' />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                <div className='my-6'>
                    <Button type='submit'>Update Product</Button>
                </div>
            </form>
        </div>
    );
};

export default memo(UpdateProduct);
