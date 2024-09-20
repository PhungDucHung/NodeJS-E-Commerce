import React, { useRef, useEffect } from 'react';
import { FaStar } from "react-icons/fa";

const Votebar = ({ number, ratingCount, ratingTotal }) => {
    const percentRef = useRef();

    useEffect(() => {
        if (ratingTotal > 0) {
            const percent = Math.round(ratingCount * 100 / ratingTotal) || 0;
            percentRef.current.style.cssText = `right: ${100 - percent}%`;
        } else {
            percentRef.current.style.cssText = `right: 100%`; 
        }
    }, [ratingCount, ratingTotal]);

    return (
        <div className='flex items-center gap-2 text-sm text-gray-500'>
            <div className='flex w-[10%] items-center justify-center gap-1 text-sm'>
                <span>{number}</span>
                <FaStar color='orange' />
            </div>
            <div className='w-[75%]'>
                <div className='w-full h-[6px] relative rounded-r-full rounded-l-full bg-gray-200'>
                    <div ref={percentRef} className='absolute inset-0 bg-red-500 transition-all duration-300'></div>
                </div>
            </div>
            <div className='w-[15%] flex-2 flex justify-end text-xs text-gray-400'>
                {`${ratingCount || 0} reviewers`}
            </div>
        </div>
    );
};

export default Votebar;
