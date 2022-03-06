import React from 'react'
import ReactPaginate from 'react-paginate'
import PropTypes from 'prop-types'

export default function Pagination({ pageCount, onPageChange }) {
  return (
    <ReactPaginate
      pageCount={pageCount}
      onPageChange={onPageChange}
      pageRangeDisplayed={2}
      renderOnZeroPageCount={null}
      previousLabel="&laquo;"
      nextLabel="&raquo;"
      className="pagination justify-content-center my-3"
      pageClassName="page-item"
      pageLinkClassName="page-link"
      activeClassName="active"
      breakLabel="..."
      breakClassName="page-item"
      breakLinkClassName="page-link"
      nextClassName="page-item"
      previousClassName="page-item"
      previousLinkClassName="page-link"
      nextLinkClassName="page-link"
    />
  )
}

Pagination.propTypes = {
  pageCount: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
}
