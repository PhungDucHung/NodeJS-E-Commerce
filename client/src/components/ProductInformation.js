import React,{ memo, useState , useCallback} from 'react'
import {productInfoTabs} from '../ultils/contants'
import { Button, Votebar, VoteOption, Comment } from './'
import { renderStarFromNumber } from '../ultils/helpers'
import { apiRatings } from '../apis'
import { useDispatch, useSelector } from 'react-redux'
import {showModal} from '../store/app/appSlice'
import Swal from 'sweetalert2'
import path from '../ultils/path'
import { useNavigate } from 'react-router-dom'


const ProductInformation = ({totalRatings, ratings, nameProduct, pid, rerender }) => {
    const [activedTab, setActivedTab] = useState(1);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLoggedIn } = useSelector(state => state.user)

    const handleSubmitVoteOption = async({comment, score}) => {
        if (!comment || !pid || !score ){
          alert('Please vote when click submit');
          return
        }
         await apiRatings({star: score, comment , pid , updatedAt: Date.now()})
         dispatch(showModal({ isShowModal: false, modalChildren: null }))
         rerender()
    }

    const handleVoteNow = () => {
      if (!isLoggedIn) {
        Swal.fire({
          text: 'Login to vote',
          cancelButtonText: 'Cancel',
          confirmButtonText: 'Go login',
          title: 'Oops!',
          showCancelButton: true,
        }).then((result) => {
          if (result.isConfirmed) navigate(`/${path.LOGIN}`);
        });
      } else {
        dispatch(showModal({
          isShowModal: true,
          modalChildren: (
            <VoteOption 
              nameProduct={nameProduct}
              handleSubmitVoteOption={handleSubmitVoteOption}
            />
          ),
        }));
      }
    }
    
  return (
    <div>
      <div className='flex items-center gap-2 relative bottom-[-1px]'>
          {
              productInfoTabs.map(el => (
                  <span 
                      className={`py-2 cursor-pointer px-4 ${activedTab === +el.id ? 'bg-white border border-b-0' : 'bg-gray-200' }` } 
                      key={el.id}
                      onClick={() => setActivedTab(el.id)}
                  >
                      {el.name}
                  </span>
              ))}
      
      </div>
      <div className='w-full  border p-4'>
            {productInfoTabs.some(el => el.id === activedTab) && productInfoTabs.find(el => el.id === activedTab)?.content }
      </div>

      <div className='flex flex-col py-8 w-main'>
      <span className={`py-2 cursor-pointer px-4 bg-white border border-b-0` } >
            CUSTOMER REVIEW
      </span>
               <div className='flex'>
               <div className='flex-4 border flex flex-col items-center justify-center border-red-500'>
                    <span className='font-semibold text-3xl'>{`${totalRatings}/5`}</span>
                    <span className='flex items-center gap-1'>{renderStarFromNumber(totalRatings)?.map((el,index)=>(
                      <span key={index}>{el}</span>
                    ))}</span>
                    <span className='text-sm'>
                        {`${ratings?.length} reviewers and comments`}
                    </span>
                </div>
                <div className='flex-6 border p-2 flex gap-4 flex-col'>
                  {Array.from(Array(5).keys()).reverse().map(el => (
                     <Votebar
                        key={el}
                        number={el+1}
                        ratingTotal={ratings?.length}
                        ratingCount={ratings?.filter(i => i.star === el+1)?.length}
                     />
                  ))}
                </div>
               </div>
                <div className='flex-col flex items-center p-4 text-m'>
                  <span>Comment and review now</span>
                  <Button handleOnclick={handleVoteNow}
                    >
                      Vote now !
                  </Button>
            </div>
            <div className='flex flex-col gap-4'>
                { ratings?.map(el => (
                  <Comment
                    key={el._id}
                    star={el.star}
                    updatedAt={el.updatedAt} 
                    comment={el.comment}
                    name={`${el.postedBy?.lastname} ${el.postedBy?.firstname}`}
                  />
                ))}
            </div>
            </div>
      </div>
  )
}

export default memo(ProductInformation)
