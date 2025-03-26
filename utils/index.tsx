import axios from 'axios'

export const fetcher = (url: string) => axios.get(url).then((res) => res.data)

export const formatDate = (timestamp: string) => {
  const date = new Date(timestamp)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
