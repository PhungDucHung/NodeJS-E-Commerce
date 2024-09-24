import React,{memo} from 'react'
import banner from '../../assets/slideshow.jpg'

const Banner = () => {
  return (
       <div className='w-full'>
              <img src={banner}
              className='h-[400px] w-full object-cover' alt='banner'
            ></img>
            
        </div>
  )
}

export default memo(Banner)
