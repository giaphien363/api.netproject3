import { urls, requests } from './configs'

export default {
  getBarChartMonth: async () => {
    return requests.get(`${urls.report}/bar-chart-bill`)
  },
  getBarChartDay: async (dateFilter) => {
    if (dateFilter) {
      return requests.get(`${urls.report}/bar-chart-bill/day`, { startDate: dateFilter })
    }
    return requests.get(`${urls.report}/bar-chart-bill/day`)
  },
  getNoSummary: async () => {
    return requests.get(`${urls.report}/square-chart`)
  },
}
