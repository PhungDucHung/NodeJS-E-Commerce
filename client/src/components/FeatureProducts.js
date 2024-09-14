import React, {useState , useEffect} from 'react'
import {ProductCard} from './'
import { apiGetProducts } from '../apis/product'
import banner1 from '../assets/banner1.jpg';
import banner2 from '../assets/banner2.jpg';
import banner3 from '../assets/banner3.jpg';
import banner4 from '../assets/banner4.jpg';


const FeatureProducts = () => {
  const [products, setProducts] = useState(null)

  const fetchProducts = async () => {
    const response = await apiGetProducts({limit: 9, totalRatings: 4})
    if(response.success) setProducts(response.products)
  }

    useEffect(() => {
      fetchProducts()
    },[])

  return (
    <div className='w-main'>
        <h3 className='text-[20px] font-semibold py-[15px] border-b-2 border-main'>FEATURED PRODUCTS</h3>
        <div className='flex flex-wrap mt-[15px] mx-[-10px]'>
            {products?.map(el => (
              <ProductCard
                key={el._id}
                image={el.thumb}
                title={el.title}
                totalRatings={el.totalRatings}
                price={el.price}
              />
            ))}
        </div>
        <div className='flex justify-between'>
            <img className='w-[49%] object-contain' src={banner1} alt=''/>
          <div className='flex flex-col justify-between gap-4 w-[24%]'>
            <img src={banner2} alt=''/>
            <img src={banner3} alt=''/>
          </div>
            <img className='w-[24%] object-contain' src={banner4} alt=''/>
        </div>
    </div>
  )
}

export default FeatureProducts
