import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { useDispatch } from 'react-redux'
import React, { useEffect, useState } from 'react'
import { addToast } from 'src/redux/actions/toast'
import { billAPI } from 'src/apis'
import CustomLoaderSpinner from 'src/components/CustomLoaderSpinner'
import { DateWithTimeTooltip, Pagination } from 'src/components/misc'
import dayjs from 'dayjs'
import 'src/css/myStyle.css'

const BillInsurance = () => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState()
  const [bills, setBills] = useState()

  useEffect(() => {
    getData(() => setLoading(false))
  }, [])

  const getData = async (onFinish) => {
    try {
      const res = await billAPI.getAllInsurance()
      const { totalPages, data } = res.data
      setTotalPages(totalPages)
      setBills(data)
    } finally {
      if (onFinish) onFinish()
    }
  }

  const handlePageClick = async (event) => {
    setLoading(true)
    const nextPage = event.selected + 1
    try {
      const res = await billAPI.getAllInsurance({ pageNumber: nextPage })
      setBills(res.data.data)
    } catch (error) {
      dispatch(addToast({ message: error.response.data.detail, variant: 'danger' }))
    } finally {
      setLoading(false)
    }
  }

  const renderRows = (item, index) => (
    <CTableRow key={index}>
      <CTableDataCell role="button">
        <div className="text-primary">{index + 1}</div>
      </CTableDataCell>
      <CTableDataCell role="button">
        <div>{item.employeeName}</div>
      </CTableDataCell>
      <CTableDataCell role="button">
        <div>${item.supportCost.toLocaleString()}</div>
      </CTableDataCell>
      <CTableDataCell role="button">
        <div>{item.claimReason}</div>
      </CTableDataCell>
      <CTableDataCell role="button">
        <div>{item.policyName}</div>
      </CTableDataCell>
      <CTableDataCell role="button">
        <div>{item.policySupport}%</div>
      </CTableDataCell>
      <CTableDataCell role="button">
        <DateWithTimeTooltip dateString={item.createAt} />
      </CTableDataCell>
    </CTableRow>
  )

  if (loading) return <CustomLoaderSpinner loading={loading} />

  return (
    <>
      {bills.length > 0 ? (
        <CTable color="light" align="middle" className="border text-center" hover responsive>
          <CTableHead color="dark">
            <CTableRow>
              <CTableHeaderCell scope="col">#</CTableHeaderCell>
              <CTableHeaderCell scope="col">Employee</CTableHeaderCell>
              <CTableHeaderCell scope="col">Support cost</CTableHeaderCell>
              <CTableHeaderCell scope="col">Reason</CTableHeaderCell>
              <CTableHeaderCell scope="col">Policy</CTableHeaderCell>
              <CTableHeaderCell scope="col">Percent support</CTableHeaderCell>
              <CTableHeaderCell scope="col">Create at</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>{bills.map(renderRows)}</CTableBody>
        </CTable>
      ) : (
        <div>No bills.</div>
      )}
      {!!totalPages && <Pagination pageCount={totalPages} onPageChange={handlePageClick} />}
    </>
  )
}

export default BillInsurance
