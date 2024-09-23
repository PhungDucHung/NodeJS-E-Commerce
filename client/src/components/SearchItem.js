import React, { memo, useEffect, useState } from 'react'
import icons from '../ultils/icons'
import { colors } from '../ultils/contants'
import { createSearchParams, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { apiGetProducts } from '../apis'
import  useDebounce  from '../hook/useDebounce'

const {FaChevronDown} = icons
const SearchItem = ({ name, activeClick ,changeActiveFilter, type = 'checkbox' }) => {
    const navigate = useNavigate()
    const {category} = useParams()
    const [selected, setSelected] = useState([])
    const [params] = useSearchParams()
    const [price, setPrice] = useState({
        from: '',
        to: '',
    })

    const [bestPrice, setBestPrice] = useState(null)
    const handleSelect = (e) => {
        const alreadyEl = selected.find(el => el === e.target.value)
        if (alreadyEl) setSelected(prev => prev.filter(el => el !== e.target.value))
        else setSelected(prev => [...prev, e.target.value])
        changeActiveFilter(null)
    }
    const fetchBestPriceProduct = async() => {
        const response = await apiGetProducts({sort: '-price',limit: 1})
        if(response.success) setBestPrice(response.products[0]?.price)
        
    }

    useEffect(() => {
        if(selected.length > 0){
            let param = []
            for (let i of params.entries()) param.push(i)
            const queries = {}
            for (let i of param) queries[i[0]] = i[1]
            queries.color = selected.join(',')
            navigate({
            pathname: `/${category}`,
            search: createSearchParams(queries).toString(),
        })
        }else{
            navigate(`/${category}`);
        }
    },[selected])

    useEffect(() => {
        if(type === 'input') fetchBestPriceProduct()
    },[type])

    useEffect(() => {
        if(price.from && price.to && price.from > price.to) alert('From price cannot greater than to price')
    }, [price]) 

    const deboucePriceFrom = useDebounce(price.from, 500)
    const deboucePriceTo = useDebounce(price.to, 500)
    
    useEffect(() => {
       
        let param = []
            for (let i of params.entries()) param.push(i)
            const queries = {}
            for(let i of param) queries[i[0]] = i[1]
            queries.page = 1
            const data = {}
            if(Number(price.from) > 0) queries.from = price.from
            if(Number(price.to) > 0) queries.to = price.to
            navigate({
                pathname:  `/${category}`,
                search: createSearchParams(queries).toString(),
            })
    },[deboucePriceFrom, deboucePriceTo ])

  return (
    <div 
        className='p-4 cursor-pointer text-xs relative border border-gray-800 flex justify-between items-center gap-1'
        onClick={() => changeActiveFilter(name)}
        >
        <span className='capitalize'>{name}</span>
        <FaChevronDown/>
        {activeClick === name && <div className='absolute z-10 top-[calc(100%+1px)] left-0 w-fit p-4 border bg-white min-w-[150px]'>
            {type === 'checkbox' && <div className=''>
                <div className='p-4 items-center flex justify-between gap-8 border-b'>
                    <span className='whitespace-nowrap'>{`${selected.length} selected`}</span>
                    <span
                    onClick={e => {
                        e.stopPropagation();
                        setSelected([])
                    }}
                    className='underline cursor-pointer hover:text-main'>Reset</span>
                </div>
                <div onClick={e => e.stopPropagation()} className='flex flex-col gap-3 mt-4'>
                    {colors.map((el, index) => (
                        <div key={index} className='flex items-center gap-4'>
                            <input 
                                type='checkbox' 
                                className='w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500'
                                value={el}
                                id={el}
                                onChange={handleSelect}
                                checked={selected.some(selectedItem => selectedItem === el)}
                            />
                            <label className='capitalize text-gray-700' htmlFor={el}>{el}</label>
                            
                        </div>
                    ))}
                </div>
            </div>}

            {type === 'input' && <div onClick={e => e.stopPropagation()}>
                <div  className='p-4 items-center flex justify-between gap-8 border-b'>
                    <span className='whitespace-nowrap'>{`The highest price is ${Number(bestPrice).toLocaleString()} VND `}</span>
                    <span
                    onClick={e => {
                        e.stopPropagation();
                        setPrice({from: '', to: ''})
                        changeActiveFilter(null)
                    }}
                    className='underline cursor-pointer hover:text-main'>Reset</span>
                </div>
                <div className='flex items-center p-2 gap-2'>
                    <div className='flex items-center gap-2'>
                        <label htmlFor='from'>From</label>
                        <input 
                            className='form-input' 
                            type="number" 
                            id="from" 
                            value={price.form}
                            onChange={e => setPrice(prev => ({ ...prev, from: e.target.value}))}
                        />
                    </div>
                    <div className='flex items-center gap-2'>
                        <label htmlFor='to'>To</label>
                        <input 
                            className='form-input' 
                            type="number" 
                            id="to" 
                            value={price.to}
                            onChange={e => setPrice(prev => ({ ...prev, to: e.target.value}))}

                        />
                    </div>
                </div>
            </div>
            }
        </div>}
    </div>
  )
}

export default memo(SearchItem)
