import React from 'react'
import banner from '../assets/slideshow.jpg'

const Banner = () => {
  return (
       <div className='w-full'>
              <img src={banner}
              className='h-[400px] w-full object-cover'
            ></img>
            
        </div>
  )
}

export default Banner
