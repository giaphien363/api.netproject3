import React from 'react'
import { CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'
import PropTypes from 'prop-types'

export default function PolicyTableHeader({ hasActionColumn }) {
  return (
    <CTableHead color="dark">
      <CTableRow>
        <CTableHeaderCell scope="col">Name</CTableHeaderCell>
        <CTableHeaderCell scope="col">Description</CTableHeaderCell>
        <CTableHeaderCell scope="col">Provided by</CTableHeaderCell>
        <CTableHeaderCell scope="col">Type</CTableHeaderCell>
        <CTableHeaderCell scope="col">Coverage</CTableHeaderCell>
        <CTableHeaderCell scope="col">Duration</CTableHeaderCell>
        <CTableHeaderCell scope="col">Price</CTableHeaderCell>
        {hasActionColumn && <CTableHeaderCell scope="col">Action</CTableHeaderCell>}
      </CTableRow>
    </CTableHead>
  )
}

PolicyTableHeader.propTypes = {
  hasActionColumn: PropTypes.bool,
}
