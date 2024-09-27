import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiGetProduct, apiGetProducts } from '../../apis';
import { Breadcrumb, Button, ProductExtraInfoItem, SelectQuantity, ProductInformation, CustomSlider } from '../../components';
import Slider from 'react-slick';
import ReactImageMagnify from 'react-image-magnify';
import { formatMoney, formatPrice, renderStarFromNumber } from '../../ultils/helpers';
import { productExtraInformation } from '../../ultils/contants';
import DOMPurify from 'dompurify';

var settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
};

const DetailProduct = () => {
  const { pid, title, category } = useParams();
  const [product, setProduct] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState(null);
  const [update, setUpdate] = useState(false);
  const fetchProductData = async () => {
    const response = await apiGetProduct(pid);
    if (response.success) {
      setProduct(response.productData);
      setCurrentImage(response.productData?.thumb);
    } else {
      // Xử lý lỗi nếu cần
    }
  };

  const fetchProducts = async () => {
    const response = await apiGetProducts({ category });
    if (response.success) setRelatedProducts(response.products);
  };

  useEffect(() => {
    if (pid) {
      fetchProductData();
      fetchProducts();
    }
    window.scrollTo(0, 0)
  }, [pid]);

  useEffect(() => {
    if (pid) fetchProductData()
  },[update])

  const rerender = useCallback(() => {
      setUpdate(!update)
  },[update])

  const handleQuantity = useCallback((number) => {
    if (!Number(number) || Number(number) < 1) {
      return;
    } else {
      setQuantity(number);
    }
  }, [quantity]);

  const handleChangeQuantity = useCallback((flag) => {
    if (flag === 'minus' && quantity === 1) return;
    if (flag === 'minus') setQuantity(prev => +prev - 1);
    if (flag === 'plus') setQuantity(prev => +prev + 1);
  }, [quantity]);

  const handleClickImage = (e, el) => {
    e.stopPropagation();
    setCurrentImage(el);
  };

  if (!product) {
    return <div>Loading...</div>; // Hiển thị loader khi dữ liệu chưa tải xong
  }

  return (
    <div className='w-full '>
      <div className='h-[81px] flex justify-center items-center bg-gray-100'>
        <div className='w-main'>
          <h3 className='font-bold'>{title}</h3>
          <Breadcrumb title={title} category={product?.category} />
        </div>
      </div>
      <div className='w-main m-auto mt-4 flex'>
        <div className='flex flex-col gap-4 w-2/5'>
          <div className='h-[458px] w-[458px] border overflow-hidden'>
            <ReactImageMagnify {...{
              smallImage: {
                alt: 'Wristwatch by Ted Baker London',
                isFluidWidth: true,
                src: currentImage,
              },
              largeImage: {
                src: currentImage,
                width: 1800,
                height: 1500,
              },
            }} />
          </div>
          <div className='w-[458px]'>
            <Slider className='image-slider' {...settings}>
              {product?.images?.map(el => (
                <div className='flex-1' key={el}>
                  <img onClick={e => handleClickImage(e, el)} src={el} alt='sub-product' className='h-[143px] w-[143px] border cursor-pointer object-cover' />
                </div>
              ))}
            </Slider>
          </div>
        </div>
        <div className='w-2/5 flex flex-col gap-4'>
          <div className='flex items-center justify-between'>
            <h2 className='text-[30px] font-semibold'>{`${formatMoney(formatPrice(product?.price))}`} VNĐ</h2>
            <span className='text-sm text-main'>{`${product?.quantity} products remaining`}</span>
          </div>
          <div className='flex items-center gap-1'>
            {renderStarFromNumber(product?.totalRatings)?.map((el, index) => (
              <span key={index}>{el}</span>
            ))}
            <span className='text-sm text-main italic'>{`(Sold: ${product?.sold} pieces)`}</span>
          </div>
          <ul className='list-disc text-sm text-gray-500 pl-4'>
            {product?.description?.length > 1 && product?.description?.map(el => ( <li className='leading-6' key={el}>{el}</li>))}
            {product?.description?.length === 1 && <div className='text-sm' dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(product?.description) }}></div> }
          </ul>
          <div className='flex flex-col gap-8'>
            <div className='flex items-center gap-4'>
              <span className='font-semibold'>Quality</span>
              <SelectQuantity 
                quantity={quantity} 
                handleQuantity={handleQuantity} 
                handleChangeQuantity={handleChangeQuantity}
              />
            </div>
            <Button fw>
              Add to Cart
            </Button>
          </div>
        </div>
        <div className='w-1/5'>
          {productExtraInformation.map(el => (
            <ProductExtraInfoItem  
              key={el.id}
              title={el.title}
              icon={el.icon}
              sub={el.sub}
            />
          ))}
        </div> 
      </div>
      <div className='w-main m-auto mt-8'>
        <ProductInformation 
          totalRatings={product?.totalRatings } 
          ratings={product?.ratings} 
          nameProduct={product?.title}
          pid={product?._id}
          rerender={rerender}
        />
      </div>
      <div className='w-main m-auto mt-8'>
        <h3 className='text-[20px] font-semibold py-[15px] border-b-2 border-main'>OTHER CUSTOMERS ALSO LIKED</h3>
        <CustomSlider normal={true} products={relatedProducts} />
      </div>
      <div className='h-[100px] w-full'></div>
    </div>
  );
}

export default DetailProduct;
