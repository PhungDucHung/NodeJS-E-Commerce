import React from 'react'
import { useSelector } from 'react-redux'
import { Product } from '../../components'

const Wishlist = () => {
  const { current} = useSelector(s=>s.user)
  return (
    <div className='w-full relative px-4'>
        <header className='text-3xl font-semibold py-4 border-b-blue-200'>
            Wishlist
        </header>
        <div className='p-4 w-full grid grid-cols-5 gap-4'>
            {current?.wishlist?.map(el => (
                <div key={el._id}>
                    <Product
                        pid={el._id}
                        className='bg-white rounded-md drop-shadow'
                        productData={el}
                      
                    />
                </div>
            ))}
        </div>

    </div>
  )
}

export default Wishlist
