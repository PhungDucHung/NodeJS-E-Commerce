import React,{useEffect, useState, useCallback} from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { Breadcrumb, Product, SearchItem } from '../../components'
import { apiGetProducts } from '../../apis'
import Masonry from 'react-masonry-css'


const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1
};


const Products = () => {
  const [products, setProducts] = useState(null)
  const [activeClick, setActiveClick] = useState(null)
  const [params] = useSearchParams()
  console.log(params.entries())

  const fetchProductsByCategory = async(queries) => {
    const response = await apiGetProducts(queries)
    if (response.success) setProducts(response.products)
  }

  const { category } = useParams()

  useEffect(() => {
    let param = []
    for(let i of params.entries()) param.push(i)
    const queries = {}
    let priceQuery = {}
    for (let i of params) queries[i[0]] = i[1]
    if(queries.to && queries.from ){
        priceQuery = { $and: [
          {price:{gte: queries.from }},
          {price:{lte: queries.to }}
        ] 
      }
      delete queries.price
    }

    if(queries.from) queries.price = {gte: queries.from}
    if(queries.to) queries.price = {lte: queries.to}
    delete queries.to
    delete queries.from
    const q = {...priceQuery, ...queries}
    fetchProductsByCategory({...priceQuery, ...queries})
  },[params])

  const changeActiveFilter = useCallback((name) =>{
      if(activeClick === name) setActiveClick(null)
      else setActiveClick(name)
  },[activeClick])

  return (
    <div className='w-full uppercase'>
          <div className='h-[81px] flex justify-center items-center bg-gray-100'>
            <div className='w-main'>
              <h3 className='font-semibold uppercase'>{category}</h3>
              <Breadcrumb category={category} />
            </div>
          </div>

          <div className='w-main border p-3 text-gray-500 flex justify-between mt-8 m-auto'>
                <div className='w-4/5 flex-auto flex flex-col gap-3'>
                <span className='font-semibold text-sm'>Filter by</span>
                    <div className='flex items-center gap-4'>
                        <SearchItem
                          name='price'
                          activeClick={activeClick}
                          changeActiveFilter={changeActiveFilter}
                          type='input'
                        />
                        <SearchItem
                          name='color'
                          activeClick={activeClick}
                          changeActiveFilter={changeActiveFilter}
                        />
                    </div>
                </div>
                <div className="w-1/5">
                    Sort by
                </div>
            </div>
            <div className='mt-8 w-main m-auto'>
                <Masonry
                  breakpointCols={breakpointColumnsObj}
                  className="my-masonry-grid flex mx-[-10px]"
                  columnClassName="my-masonry-grid_column">
                  {products?.map(el => (
                      <Product
                        key={el._id}
                        pid={el.id}
                        productData={el}
                        normal = {true}
                  />
                  ))}
                </Masonry>
            </div>
            <div className='w-full h-[500px]'></div>
    </div>
  )
}

export default Products
