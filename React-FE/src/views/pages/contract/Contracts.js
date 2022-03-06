import {
  CButton,
  CTable,
  CTableHead,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CTableRow,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'

import { addToast } from 'src/redux/actions/toast'
import { toOldContractResponse } from 'src/utils'
import { contractAPI } from 'src/apis'
import { Pagination } from 'src/components/misc'
import CustomLoaderSpinner from 'src/components/CustomLoaderSpinner'
import 'src/css/myStyle.css'
import { SearchInput } from 'src/components/inputs'

const Contracts = () => {
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState()

  const [contracts, setContracts] = useState([])

  const history = useHistory()
  const dispatch = useDispatch()

  useEffect(() => {
    getData(() => setLoading(false))
  }, [])

  const getData = async (onFinish) => {
    try {
      const res = await contractAPI.getAll({ pageNumber: 1 })
      saveData(res)
    } finally {
      if (onFinish) onFinish()
    }
  }

  const handlePageClick = async (event) => {
    const nextPage = event.selected + 1
    try {
      const res = await contractAPI.getAll({ pageNumber: nextPage })
      saveData(res)
    } catch (error) {
      dispatch(addToast({ message: error.response.data.detail, variant: 'danger' }))
    } finally {
      setLoading(false)
    }
  }

  const saveData = (res) => {
    const { totalPages, data } = res.data
    setContracts(data.map(toOldContractResponse))
    setTotalPages(totalPages)
  }

  const viewDetails = (id) => {
    history.push(`contracts/${id}`)
  }

  const renderRows = (item, index) => (
    <CTableRow key={index}>
      <CTableDataCell role="button" onClick={() => viewDetails(item.employeeId)}>
        <div className="text-primary">{item.name}</div>
      </CTableDataCell>
      <CTableDataCell role="button" onClick={() => viewDetails(item.employeeId)}>
        <div>
          {item.employee.firstname} {item.employee.lastname}
        </div>
      </CTableDataCell>
      <CTableDataCell role="button" onClick={() => viewDetails(item.employeeId)}>
        <div>${item.totalAmount.toLocaleString()}</div>
      </CTableDataCell>
      <CTableDataCell role="button" onClick={() => viewDetails(item.employeeId)}>
        <div>{item.totalContractPolicy}</div>
      </CTableDataCell>
    </CTableRow>
  )

  if (loading) return <CustomLoaderSpinner loading={loading} />

  return (
    <>
      <div className="m-0 mb-3 row row-cols-lg-auto justify-content-end">
        <SearchInput
          searchAPI={contractAPI.getAll}
          searchParams={{ pageNumber: 1 }}
          saveData={saveData}
          itemType="contract"
        />
      </div>
      {contracts.length > 0 ? (
        <CTable color="light" align="middle" className="border text-center" hover responsive>
          <CTableHead color="dark">
            <CTableRow>
              <CTableHeaderCell scope="col">Name</CTableHeaderCell>
              <CTableHeaderCell scope="col">Employee</CTableHeaderCell>
              <CTableHeaderCell scope="col">Total amount</CTableHeaderCell>
              <CTableHeaderCell scope="col">No. of policies</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>{contracts.map(renderRows)}</CTableBody>
        </CTable>
      ) : (
        <div>No contracts.</div>
      )}
      {totalPages > 0 && <Pagination pageCount={totalPages} onPageChange={handlePageClick} />}
    </>
  )
}

export default Contracts
