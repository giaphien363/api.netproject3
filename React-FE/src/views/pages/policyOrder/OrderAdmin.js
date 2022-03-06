import {
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
import { orderAPI } from 'src/apis'
import CustomLoaderSpinner from 'src/components/CustomLoaderSpinner'
import { Pagination } from 'src/components/misc'
import 'src/css/myStyle.css'
import { addToast } from 'src/redux/actions/toast'
import DetailOrderAdmin from './components/DetailOrderAdmin'
import { cilTrash, cilSettings } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import DeleteConfirmModal from './../../../components/modals/DeleteConfirmModal'
import UpdateStatus from './components/UpdateStatus'

const OrderEmployee = () => {
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState()
  const [itemDetail, setItemDetail] = useState(null)

  const [detailsModalVisible, setDetailsModalVisible] = useState(false)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [updateStatusModal, setUpdateStatusModal] = useState(false)

  const [orders, setOrders] = useState([])

  const dispatch = useDispatch()

  useEffect(() => {
    getData(() => setLoading(false))
  }, [])

  const getData = async (onFinish) => {
    try {
      const res = await orderAPI.getAll({ pageNumber: 1 })
      const { totalPages, data } = res.data
      setOrders(data)
      setTotalPages(totalPages)
    } finally {
      if (onFinish) onFinish()
    }
  }
  const openDetailsModal = (item) => {
    setItemDetail(item)
    setDetailsModalVisible(true)
  }

  const closeDetailsModal = () => {
    setItemDetail(null)
    setDetailsModalVisible(false)
  }

  const openUpdateStatusModal = (item) => {
    setItemDetail(item)
    setUpdateStatusModal(true)
  }
  const closeUpdateStatusModal = () => {
    setItemDetail(null)
    setUpdateStatusModal(false)
  }

  const handlePageClick = async (event) => {
    const nextPage = event.selected + 1
    try {
      const res = await orderAPI.getAll({ pageNumber: nextPage })
      const { totalPages, data } = res.data
      setOrders(data)
      setTotalPages(totalPages)
    } catch (error) {
      dispatch(addToast({ message: error.response.data.detail, variant: 'danger' }))
    } finally {
      setLoading(false)
    }
  }
  const OrderStatus = (statusId) => {
    switch (statusId) {
      case 2:
        return 'APPROVE'
      case 3:
        return 'REJECT'
      default:
        return 'PENDING'
    }
  }

  const openDeleteModal = (item) => {
    setItemDetail(item)
    setDeleteModalVisible(true)
  }
  const closeDeleteModal = () => {
    setDeleteModalVisible(false)
    setItemDetail(null)
  }

  const handleUpdateStatus = async (type) => {
    setLoading(true)
    try {
      await orderAPI.updateStatus(itemDetail.orderRes.id, type === 'approval' ? 2 : 3)
      getData(() => setLoading(false))
    } catch (err) {
      console.log(err)
    }
    setUpdateStatusModal(false)
    setItemDetail(null)
  }

  const deleteOrder = async () => {
    // call api
    try {
      await orderAPI.deleteOrder(itemDetail.orderRes.id)
      getData(() => setLoading(false))
    } catch (err) {
      console.log(err)
    }
    setDeleteModalVisible(false)
    setItemDetail(null)
  }

  const renderRows = (item, index) => (
    <CTableRow key={index}>
      <CTableDataCell role="button" onClick={() => openDetailsModal(item)}>
        <div className="text-primary text-center">{index + 1}</div>
      </CTableDataCell>
      <CTableDataCell role="button" onClick={() => openDetailsModal(item)}>
        <div className="text-primary text-center">
          {item.employeeRes.firstname + item.employeeRes.lastname}
        </div>
      </CTableDataCell>
      <CTableDataCell role="button" onClick={() => openDetailsModal(item)}>
        <div className="text-primary text-center">{item.policyRes.name}</div>
      </CTableDataCell>
      <CTableDataCell role="button" className="text-center" onClick={() => openDetailsModal(item)}>
        <div>{dayjs(new Date(item.orderRes.startDate)).format('YYYY/MM/DD HH:mm')}</div>
      </CTableDataCell>
      <CTableDataCell role="button" onClick={() => openDetailsModal(item)}>
        <div className={`custom-order-status-${item.orderRes.status}`}>
          {OrderStatus(item.orderRes.status)}
        </div>
      </CTableDataCell>
      <CTableDataCell role="button" onClick={() => openDetailsModal(item)}>
        <div>{dayjs(new Date(item.orderRes.createdAt)).format('YYYY/MM/DD HH:mm')}</div>
      </CTableDataCell>
      <CTableDataCell role="button">
        {item.orderRes.status === 1 && (
          <CIcon
            size="xl"
            icon={cilSettings}
            role="button"
            onClick={() => openUpdateStatusModal(item)}
          />
        )}
        <CIcon size="xl" icon={cilTrash} role="button" onClick={() => openDeleteModal(item)} />
      </CTableDataCell>
    </CTableRow>
  )

  if (loading) return <CustomLoaderSpinner loading={loading} />

  return (
    <>
      {orders.length > 0 ? (
        <CTable color="light" align="middle" className="border text-center" hover responsive>
          <CTableHead color="dark">
            <CTableRow>
              <CTableHeaderCell scope="col">#</CTableHeaderCell>
              <CTableHeaderCell scope="col">Employee Name</CTableHeaderCell>
              <CTableHeaderCell scope="col">Policy</CTableHeaderCell>
              <CTableHeaderCell scope="col">Start Date</CTableHeaderCell>
              <CTableHeaderCell scope="col">Status</CTableHeaderCell>
              <CTableHeaderCell scope="col">Created At</CTableHeaderCell>
              <CTableHeaderCell scope="col">Action</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>{orders.map(renderRows)}</CTableBody>
        </CTable>
      ) : (
        <div>No pending Orders.</div>
      )}
      {totalPages > 0 && <Pagination pageCount={totalPages} onPageChange={handlePageClick} />}
      {itemDetail && (
        <DetailOrderAdmin
          visible={detailsModalVisible}
          onClose={closeDetailsModal}
          item={itemDetail}
        />
      )}
      <DeleteConfirmModal
        visible={deleteModalVisible}
        onClose={closeDeleteModal}
        onDelete={deleteOrder}
      />
      {itemDetail && (
        <UpdateStatus
          visible={updateStatusModal}
          onClose={closeUpdateStatusModal}
          updateStatus={handleUpdateStatus}
        />
      )}
    </>
  )
}

export default OrderEmployee
