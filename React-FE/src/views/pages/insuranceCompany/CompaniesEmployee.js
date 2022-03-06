import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { insuranceCompanyAPI } from 'src/apis'
import CustomLoaderSpinner from 'src/components/CustomLoaderSpinner'
import { SearchInput } from 'src/components/inputs'
import { Pagination } from 'src/components/misc'
import 'src/css/myStyle.css'
import { addToast } from 'src/redux/actions/toast'

const InsuranceCompanies = () => {
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState()

  const [companies, setCompanies] = useState([])

  const dispatch = useDispatch()

  useEffect(() => {
    getData(() => setLoading(false))
  }, [])

  const getData = async (onFinish) => {
    try {
      const res = await insuranceCompanyAPI.getAll({ pageNumber: 1 })
      saveData(res)
    } finally {
      if (onFinish) onFinish()
    }
  }

  const handlePageClick = async (event) => {
    const nextPage = event.selected + 1
    try {
      const res = await insuranceCompanyAPI.getAll({ pageNumber: nextPage })
      saveData(res)
    } catch (error) {
      dispatch(addToast({ message: error.response.data.detail, variant: 'danger' }))
    } finally {
      setLoading(false)
    }
  }

  const saveData = (res) => {
    const { totalPages, data } = res.data
    setCompanies(data)
    setTotalPages(totalPages)
  }

  const renderRows = (item, index) => (
    <CTableRow key={index}>
      <CTableDataCell role="button">
        <div className="text-primary text-start">{item.name}</div>
      </CTableDataCell>
      <CTableDataCell role="button" className="text-start">
        <div>{item.address}</div>
      </CTableDataCell>
      <CTableDataCell role="button">
        <div>{item.phone}</div>
      </CTableDataCell>
      <CTableDataCell role="button">
        <div>{item.url}</div>
      </CTableDataCell>
    </CTableRow>
  )

  if (loading) return <CustomLoaderSpinner loading={loading} />

  return (
    <>
      <div className="m-0 mb-3 row row-cols-lg-auto justify-content-end">
        <SearchInput
          searchAPI={insuranceCompanyAPI.getAll}
          searchParams={{ pageNumber: 1 }}
          saveData={saveData}
          itemType="company"
        />
      </div>
      {companies.length > 0 ? (
        <CTable color="light" align="middle" className="border text-center" hover responsive>
          <CTableHead color="dark">
            <CTableRow>
              <CTableHeaderCell scope="col">Name</CTableHeaderCell>
              <CTableHeaderCell scope="col">Address</CTableHeaderCell>
              <CTableHeaderCell scope="col">Phone</CTableHeaderCell>
              <CTableHeaderCell scope="col">Website</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>{companies.map(renderRows)}</CTableBody>
        </CTable>
      ) : (
        <div>No pending policies.</div>
      )}
      {totalPages > 0 && <Pagination pageCount={totalPages} onPageChange={handlePageClick} />}
    </>
  )
}

export default InsuranceCompanies
