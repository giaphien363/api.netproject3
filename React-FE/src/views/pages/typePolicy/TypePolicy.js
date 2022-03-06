import { cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CButton,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { policyTypeAPI } from 'src/apis'
import CustomLoaderSpinner from 'src/components/CustomLoaderSpinner'
import ModalTypePolicy from './components/ModalTypePolicy'
import { DeleteConfirmModal } from 'src/components/modals'
import 'src/css/myStyle.css'
import { addToast } from 'src/redux/actions/toast'

const TypePolicy = () => {
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState()

  const [detailsModalVisible, setDetailsModalVisible] = useState(false)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [selectedType, setSelectedType] = useState()

  const [policyTypes, setTypes] = useState([])

  const dispatch = useDispatch()

  useEffect(() => {
    getData(() => setLoading(false))
  }, [])

  const getData = async (onFinish) => {
    try {
      const res = await policyTypeAPI.getAll()
      setTypes(res.data)
      setTotalPages(totalPages)
    } finally {
      if (onFinish) onFinish()
    }
  }

  /* START DELETE */
  const openDeleteModal = (item) => {
    setDeleteModalVisible(true)
    setSelectedType(item)
  }

  const closeDeleteModal = () => {
    setDeleteModalVisible(false)
    setSelectedType()
  }

  const deleteType = async () => {
    await policyTypeAPI.deleteType(selectedType.id)
    const message = `Company "${selectedType.name}" deleted successfully.`
    dispatch(addToast({ message }))
    await getData()
    closeDeleteModal()
  }
  /* END DELETE */

  /* START CREATE OR EDIT */
  const openDetailsModal = (item) => {
    setSelectedType(item)
    setDetailsModalVisible(true)
  }

  const closeDetailsModal = () => {
    setSelectedType()
    setDetailsModalVisible(false)
  }

  const createType = async (payload) => {
    await policyTypeAPI.createOne(payload)
    const message = `Added new policy type: "${payload.name}".`
    dispatch(addToast({ message }))
    await getData()
    closeDetailsModal()
  }

  const updateType = async (id, payload) => {
    await policyTypeAPI.updateType(id, payload)
    const message = `Changes saved successfully.`
    dispatch(addToast({ message }))
    await getData()
    closeDetailsModal()
  }
  /* END CREATE OR EDIT */

  const renderRows = (item, index) => (
    <CTableRow key={index}>
      <CTableDataCell role="button" onClick={() => openDetailsModal(item)}>
        <div className="text-primary text-center">{index + 1}</div>
      </CTableDataCell>
      <CTableDataCell role="button" onClick={() => openDetailsModal(item)}>
        <div className="text-primary text-center">{item.name}</div>
      </CTableDataCell>
      <CTableDataCell role="button" onClick={() => openDetailsModal(item)} className="text-center">
        <div>{item.description}</div>
      </CTableDataCell>
      <CTableDataCell role="button" onClick={() => openDetailsModal(item)}>
        <div>{dayjs(new Date(item.createdAt)).format('YYYY/MM/DD HH:mm')}</div>
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
        Add Policy Type
      </CButton>
      {policyTypes.length > 0 ? (
        <CTable color="light" align="middle" className="border text-center" hover responsive>
          <CTableHead color="dark">
            <CTableRow>
              <CTableHeaderCell scope="col">#</CTableHeaderCell>
              <CTableHeaderCell scope="col">Name</CTableHeaderCell>
              <CTableHeaderCell scope="col">Description</CTableHeaderCell>
              <CTableHeaderCell scope="col">Created At</CTableHeaderCell>
              <CTableHeaderCell scope="col">Action</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>{policyTypes.map(renderRows)}</CTableBody>
        </CTable>
      ) : (
        <div>No policy type.</div>
      )}
      <ModalTypePolicy
        visible={detailsModalVisible}
        onClose={closeDetailsModal}
        onCreate={createType}
        onUpdate={updateType}
        item={selectedType}
      />
      <DeleteConfirmModal
        visible={deleteModalVisible}
        onClose={closeDeleteModal}
        onDelete={deleteType}
      />
    </>
  )
}

export default TypePolicy
