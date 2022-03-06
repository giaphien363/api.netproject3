import moment from 'moment'

export default {
  capitalize: (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
  },
  sortAlphabetically: (a, b) => {
    const nameA = a.name.toLowerCase(),
      nameB = b.name.toLowerCase()
    if (nameA < nameB)
      // sort string ascending
      return -1
    if (nameA > nameB) return 1
    return 0 //default return value (no sorting)
  },
  getDateTimeObject: (dateString) => {
    const [dateStr, timeStr] = dateString.split('T')
    const date = moment(dateStr, 'YYYY-MM-DD').format('DD/MM/YYYY')
    const time = moment(timeStr, 'hh:mm:ss').format('hh:mm A')

    return { date, time }
  },
}
