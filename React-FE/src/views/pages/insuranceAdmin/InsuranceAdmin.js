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
import { employeeAPI, insuranceAdminAPI, insuranceCompanyAPI } from 'src/apis'
import CreateOrEditInsuranceAdminModal from './components/CreateOrEditInsuranceAdminModal'
import { DeleteConfirmModal } from 'src/components/modals'
import { Pagination } from 'src/components/misc'
import CustomLoaderSpinner from 'src/components/CustomLoaderSpinner'
import 'src/css/myStyle.css'

const InsuranceAdmin = () => {
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState()

  const [detailsModalVisible, setDetailsModalVisible] = useState(false)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState()

  const [companies, setCompanies] = useState([])
  const [insuranceAdmin, setInsuranceAdmin] = useState([])

  const dispatch = useDispatch()

  useEffect(() => {
    getData(() => setLoading(false))
  }, [])

  const getData = async (onFinish) => {
    try {
      const res = await insuranceCompanyAPI.getAll()
      const resISA = await insuranceAdminAPI.getAll()

      setTimeout(async () => {
        const { totalPages, data } = await resISA.data
        await setCompanies(res.data.data)
        await setInsuranceAdmin(resISA.data)
        await setTotalPages(totalPages)
      }, 1000)
    } finally {
      if (onFinish) onFinish()
    }
  }

  const handlePageClick = async (event) => {
    const nextPage = event.selected + 1
    try {
      const res = await employeeAPI.getAll({ pageNumber: nextPage })
      const { totalPages, data } = res.data
      setCompanies(data)
      setTotalPages(totalPages)
    } catch (error) {
      dispatch(addToast({ message: error.response.data.detail, variant: 'danger' }))
    } finally {
      setLoading(false)
    }
  }

  const createEmployee = async (payload) => {
    console.log(payload)
    await insuranceAdminAPI.create(payload)
    const message = `Added new insurance admin: "${payload.username}".`
    dispatch(addToast({ message }))
    await getData()
    closeDetailsModal()
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

  const deleteEmployee = async () => {
    await insuranceAdminAPI.delete(selectedCompany.id)
    const message = `Employee "${selectedCompany.username}" deleted successfully.`
    dispatch(addToast({ message }))
    await getData()
    closeDeleteModal()
  }
  /* END DELETE */

  /* START CREATE OR EDIT */
  const openDetailsModal = (item) => {
    console.log('item ', item)
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

  const updateEmployee = async (id, payload) => {
    console.log(payload)
    await insuranceAdminAPI.update(id, payload)
    const message = `Changes saved successfully.`
    dispatch(addToast({ message }))
    await getData()
    closeDetailsModal()
  }
  /* END CREATE OR EDIT */

  const renderRows = (item, index) => (
    <CTableRow key={index}>
      <CTableDataCell role="button" onClick={() => openDetailsModal(item)}>
        <div className="text-primary text-start">{item.username}</div>
      </CTableDataCell>
      <CTableDataCell role="button" onClick={() => openDetailsModal(item)} className="text-start">
        <div>{item.role}</div>
      </CTableDataCell>
      <CTableDataCell role="button" onClick={() => openDetailsModal(item)}>
        <div>
          {companies.map((element) => {
            if (element.id == item.companyId) {
              return element.name
            }
          })}
        </div>
      </CTableDataCell>
      <CTableDataCell>
        <CIcon size="xl" icon={cilTrash} role="button" onClick={() => openDeleteModal(item)} />
      </CTableDataCell>
    </CTableRow>
  )

  if (loading) return <CustomLoaderSpinner loading={loading} />

  return (
    <>
      <CButton className="mb-3 " color="warning" onClick={() => openDetailsModal()}>
        Add Insurance Admin
      </CButton>
      {insuranceAdmin.length > 0 ? (
        <CTable color="light" align="middle" className="border text-center" hover responsive>
          <CTableHead color="dark">
            <CTableRow>
              <CTableHeaderCell scope="col">User Name</CTableHeaderCell>
              <CTableHeaderCell scope="col">Role</CTableHeaderCell>
              <CTableHeaderCell scope="col">Company Name</CTableHeaderCell>
              <CTableHeaderCell scope="col">Action</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>{insuranceAdmin.map(renderRows)}</CTableBody>
        </CTable>
      ) : (
        <div>No employee.</div>
      )}
      {totalPages > 0 && <Pagination pageCount={totalPages} onPageChange={handlePageClick} />}
      <CreateOrEditInsuranceAdminModal
        visible={detailsModalVisible}
        onClose={closeDetailsModal}
        onCreate={createEmployee}
        onUpdate={updateEmployee}
        company={selectedCompany}
        dscty={companies}
      />
      <DeleteConfirmModal
        visible={deleteModalVisible}
        onClose={closeDeleteModal}
        onDelete={deleteEmployee}
        itemType="company"
        itemName={selectedCompany && selectedCompany.name}
      />
    </>
  )
}

export default InsuranceAdmin
