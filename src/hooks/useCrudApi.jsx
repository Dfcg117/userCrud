import { useState } from 'react'
import axios from 'axios'

function useCrudApi() {

  const [data, setData] = useState([])
  const [pending, setPending] = useState(false)
  const [error, setError] = useState(null)

  const request = async ({ url, method = 'GET', body = null, id = null }) => {
    setPending(true)
    setError(null)

    try {
      console.log('Sending request to:', url)
      console.log('Request body:', body)

      if (body && body.birthday && !/^\d{4}-\d{2}-\d{2}$/.test(body.birthday)) {
        throw new Error('Birthday must be in the format YYYY-MM-DD')
      }

      const res = await axios({
        url,
        method,
        data: method !== 'GET' ? body : null
      })

      console.log('Response:', res)

      switch (method) {
        case 'POST':
          setData((prev) => [...prev, res.data])
          break
        case 'PUT':
        case 'PATCH':
          setData((prev) => prev.map(i => i.id === res.data.id ? res.data : i))
          break
        case 'DELETE':
          setData((prev) => prev.filter(i => i.id !== id))
          break
        default:
          setData(res.data.results)
      }

    } catch (error) {
      console.error('Error occurred:', error)
      setError(error.message)
    } finally {
      setPending(false)
    }
  }

  return { data, pending, error, request }
}

export default useCrudApi
