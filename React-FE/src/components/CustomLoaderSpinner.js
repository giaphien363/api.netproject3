import React from 'react'
import '../css/customLoaderSpinner.css'
import { PropTypes } from 'prop-types'
import '../css/myStyle.css'

const CustomLoaderSpinner = ({ loading }) => {
  return (
    <div id="myStyleLoaderSpinner" style={loading ? { display: '' } : { display: 'none' }}>
      <div className="lds-spinner">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  )
}

CustomLoaderSpinner.propTypes = {
  loading: PropTypes.bool,
}

export default CustomLoaderSpinner
