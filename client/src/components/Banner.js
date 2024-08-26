import React from 'react'
import banner from '../assets/slideshow.jpg'

const Banner = () => {
  return (
    <div>
       <div className='w-full'>
              <img src={banner}
              className='w-full object-contain'
            ></img>
            
        </div>
    </div>
  )
}

export default Banner
