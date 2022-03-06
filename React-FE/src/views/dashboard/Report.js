import { CButton, CButtonGroup, CCard, CCardBody, CCol, CRow } from '@coreui/react'
import { CChartBar } from '@coreui/react-chartjs'
import { getStyle } from '@coreui/utils'
import React, { lazy, useEffect, useState } from 'react'
import DatePicker, { CalendarContainer } from 'react-datepicker'
import { reportAPI } from 'src/apis'
import CustomLoaderSpinner from 'src/components/CustomLoaderSpinner'
import PropTypes from 'prop-types'
import dayjs from 'dayjs'

import 'react-datepicker/dist/react-datepicker.css'

const WidgetsDropdown = lazy(() => import('../widgets/WidgetsDropdown.js'))

const Dashboard = () => {
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('Month')
  const [dataSquare, setDataSquare] = useState()
  const [barMonth, setBarMonth] = useState()
  const [valueDatePicker, setDatePicker] = useState(new Date())

  useEffect(() => {
    getBillMonth()
    getSummarySquare()
  }, [])

  const getBillMonth = async () => {
    try {
      const res = await reportAPI.getBarChartMonth()
      setBarMonth(res.data)
    } catch (error) {
      console.log('error\n', error)
    } finally {
      setLoading(false)
    }
  }
  const getBillDay = async (filter) => {
    try {
      const res = await reportAPI.getBarChartDay(filter ? filter : null)
      setBarMonth(res.data)
    } catch (error) {
      console.log('error\n', error)
    } finally {
      setLoading(false)
    }
  }
  const getSummarySquare = async () => {
    try {
      const res = await reportAPI.getNoSummary()
      setDataSquare(res.data)
    } catch (error) {
      console.log('error\n', error)
    } finally {
      setLoading(false)
    }
  }

  const changeFilter = (event) => {
    var value = event.target.innerText
    setFilter(value)
    if (value === 'Month') {
      getBillMonth()
    } else if (value === 'Day') {
      // call api get day default
      getBillDay()
    }
  }

  const handleSelect = (value) => {
    // console.log(new Date(value))
    setDatePicker(value)
    // call api get day bar with filter
    getBillDay(dayjs(value).format('YYYY-MM-DD'))
  }

  const MyContainer = ({ className, children }) => {
    return (
      <div style={{ padding: '16px', background: '#216ba5', color: '#fff' }}>
        <CalendarContainer className={className}>
          <div style={{ background: '#f0f0f0' }}>What is your favorite day?</div>
          <div style={{ position: 'relative' }}>{children}</div>
        </CalendarContainer>
      </div>
    )
  }
  MyContainer.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
  }

  return (
    <>
      <CustomLoaderSpinner loading={loading} />
      {dataSquare && <WidgetsDropdown inputData={dataSquare} />}
      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={5}>
              <h4 id="traffic" className="card-title mb-0">
                Bills
              </h4>
              <div className="small text-medium-emphasis">
                {dayjs(new Date()).format('YYYY/MM/DD')}
              </div>
            </CCol>
            <CCol sm={7} className="d-none d-md-block">
              <div className="d-flex justify-content-end">
                {filter === 'Day' && (
                  <DatePicker
                    dateFormat="dd/MM/yyyy"
                    selected={valueDatePicker}
                    onChange={handleSelect}
                    placeholderText="Select a date between today and 7 days in the future"
                    calendarContainer={MyContainer}
                  />
                )}

                <CButtonGroup className="float-end me-3">
                  {['Day', 'Month'].map((value) => (
                    <CButton
                      color="outline-secondary"
                      key={value}
                      className="mx-0"
                      active={value === filter}
                      onClick={changeFilter}
                    >
                      {value}
                    </CButton>
                  ))}
                </CButtonGroup>
              </div>
            </CCol>
          </CRow>
          {barMonth && (
            <CChartBar
              style={{ height: '300px', marginTop: '40px' }}
              data={{
                labels: barMonth.dateTimeResponse,
                datasets: [
                  {
                    label: 'Total support',
                    backgroundColor: [
                      'rgba(255, 99, 132, 0.2)',
                      'rgba(255, 159, 64, 0.2)',
                      'rgba(255, 205, 86, 0.2)',
                      'rgba(75, 192, 192, 0.2)',
                      'rgba(54, 162, 235, 0.2)',
                      'rgba(153, 102, 255, 0.2)',
                      'rgba(201, 203, 207, 0.2)',
                    ],
                    borderColor: [
                      'rgb(255, 99, 132)',
                      'rgb(255, 159, 64)',
                      'rgb(255, 205, 86)',
                      'rgb(75, 192, 192)',
                      'rgb(54, 162, 235)',
                      'rgb(153, 102, 255)',
                      'rgb(201, 203, 207)',
                    ],
                    borderWidth: 1,
                    pointHoverBackgroundColor: getStyle('--cui-info'),
                    data: barMonth.dataResponse,
                    fill: true,
                  },
                ],
              }}
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: true,
                  },
                },
                scales: {
                  x: {
                    grid: {
                      drawOnChartArea: true,
                    },
                  },
                  y: {
                    ticks: {
                      beginAtZero: true,
                      maxTicksLimit: 5,
                      stepSize: Math.ceil(250 / 5),
                      max: 250,
                    },
                  },
                },
                elements: {
                  line: {
                    tension: 0.4,
                  },
                  point: {
                    radius: 0,
                    hitRadius: 10,
                    hoverRadius: 4,
                    hoverBorderWidth: 3,
                  },
                },
              }}
            />
          )}
        </CCardBody>
      </CCard>
    </>
  )
}

export default Dashboard
