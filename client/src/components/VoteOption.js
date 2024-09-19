import React,{memo, useRef, useEffect} from 'react'
import logo from '../assets/logo_digital_new_250x.png'
import { VoteOptions } from '../ultils/contants';
import { FaStar } from "react-icons/fa";
import {Button} from './'

const VoteOption = ({nameProduct}) => {
    const modalRef = useRef();
    useEffect(() => {
        modalRef.current.scrollIntoView({block: 'center', behavior: 'smooth'});
    },[])
  return (
    <div onClick={e => e.stopPropagation()} ref={modalRef} className='bg-white w-[700px] p-4 flex-col gap-4 flex items-center justify-center'>
        <img src={logo} alt='logo' className='w-[300px] my-8 object-contain'/>
        <h2 className='text-center text-medium text-lg'>{`Voting the product ${nameProduct}`}</h2>
        <textarea 
            className='form-textarea w-full placeholder:italic placeholder:text-xs placeholder:text-gray-500 text-sm'
            placeholder='Type something'
            >
        </textarea>
        <div className='w-full flex flex-col gap-4'>
            <p>How do you like this product ?</p>
            <div className='flex items-center gap-4 justify-center'>
                {VoteOptions.map(el => (
                    <div key={el.id} className='w-[100px] p-4 bg-gray-200 hover:bg-gray-300 rounded-md cursor-pointer h-[100px] flex items-center justify-center flex-col gap-2'>
                        <FaStar color='gray'/>
                        <span>{el.text}</span>
                    </div>
                )) }
            </div>
        </div>
        <Button fw>Submit</Button>
    </div>
  )
}

export default memo(VoteOption)
