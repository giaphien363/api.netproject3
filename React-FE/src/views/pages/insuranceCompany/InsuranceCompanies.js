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
import CIcon from '@coreui/icons-react'
import { cilTrash } from '@coreui/icons'
import { useDispatch } from 'react-redux'

import { addToast } from 'src/redux/actions/toast'
import { insuranceCompanyAPI } from 'src/apis'
import CreateOrEditCompanyModal from './components/CreateOrEditCompanyModal'
import { DeleteConfirmModal } from 'src/components/modals'
import { SearchInput } from 'src/components/inputs'
import { Pagination } from 'src/components/misc'
import CustomLoaderSpinner from 'src/components/CustomLoaderSpinner'
import 'src/css/myStyle.css'

const InsuranceCompanies = () => {
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState()

  const [detailsModalVisible, setDetailsModalVisible] = useState(false)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState()

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

  /* START DELETE */
  const openDeleteModal = (item) => {
    setDeleteModalVisible(true)
    setSelectedCompany(item)
  }

  const closeDeleteModal = () => {
    setDeleteModalVisible(false)
    setSelectedCompany()
  }

  const deleteCompany = async () => {
    await insuranceCompanyAPI.delete(selectedCompany.id)
    const message = `Company "${selectedCompany.name}" deleted successfully.`
    dispatch(addToast({ message }))
    await getData()
    closeDeleteModal()
  }
  /* END DELETE */

  /* START CREATE OR EDIT */
  const openDetailsModal = (item) => {
    setDetailsModalVisible(true)
    setSelectedCompany(item)
  }

  const closeDetailsModal = () => {
    setDetailsModalVisible(false)
    setSelectedCompany()
  }

  const createCompany = async (payload) => {
    await insuranceCompanyAPI.create(payload)
    const message = `Added new company: "${payload.name}".`
    dispatch(addToast({ message }))
    await getData()
    closeDetailsModal()
  }

  const updateCompany = async (id, payload) => {
    await insuranceCompanyAPI.update(id, payload)
    const message = `Changes saved successfully.`
    dispatch(addToast({ message }))
    await getData()
    closeDetailsModal()
  }
  /* END CREATE OR EDIT */

  const saveData = (res) => {
    const { totalPages, data } = res.data
    setCompanies(data)
    setTotalPages(totalPages)
  }

  const renderRows = (item, index) => (
    <CTableRow key={index}>
      <CTableDataCell role="button" onClick={() => openDetailsModal(item)}>
        <div className="text-primary text-start">{item.name}</div>
      </CTableDataCell>
      <CTableDataCell role="button" onClick={() => openDetailsModal(item)} className="text-start">
        <div>{item.address}</div>
      </CTableDataCell>
      <CTableDataCell role="button" onClick={() => openDetailsModal(item)}>
        <div>{item.phone}</div>
      </CTableDataCell>
      <CTableDataCell role="button" onClick={() => openDetailsModal(item)}>
        <div>{item.url}</div>
      </CTableDataCell>
      <CTableDataCell>
        <CIcon size="xl" icon={cilTrash} role="button" onClick={() => openDeleteModal(item)} />
      </CTableDataCell>
    </CTableRow>
  )

  if (loading) return <CustomLoaderSpinner loading={loading} />

  return (
    <>
      <div className="m-0 mb-3 row row-cols-lg-auto justify-content-between">
        <CButton color="warning" onClick={() => openDetailsModal()}>
          Add Company
        </CButton>
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
              <CTableHeaderCell scope="col">Action</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>{companies.map(renderRows)}</CTableBody>
        </CTable>
      ) : (
        <div>No companies.</div>
      )}
      {totalPages > 0 && <Pagination pageCount={totalPages} onPageChange={handlePageClick} />}
      <CreateOrEditCompanyModal
        visible={detailsModalVisible}
        onClose={closeDetailsModal}
        onCreate={createCompany}
        onUpdate={updateCompany}
        company={selectedCompany}
      />
      <DeleteConfirmModal
        visible={deleteModalVisible}
        onClose={closeDeleteModal}
        onDelete={deleteCompany}
        itemType="company"
        itemName={selectedCompany && selectedCompany.name}
      />
    </>
  )
}

export default InsuranceCompanies
