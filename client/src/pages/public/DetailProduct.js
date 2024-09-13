import React from 'react'
import { useParams } from 'react-router-dom'

const DetailProduct = () => {
  const {pid, title} = useParams()

  return (
    <div className='w-full '>
      <div className='h-[81px] flex justify-center items-center bg-gray-100'>
        <div className='w-main'>
          <h3>{title}</h3>
        </div>
      </div>
    </div>
  )
}

export default DetailProduct
