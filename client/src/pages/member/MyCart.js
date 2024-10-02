import React from 'react'
import withBaseComponent from '../../hocs/withBaseComponent'

const MyCart = (props) => {
  console.log(props)
  return (
    <div>
        <div onClick={() => props.navigate('/')}>MyCart</div>
    </div>
  )
}

export default withBaseComponent(MyCart)
