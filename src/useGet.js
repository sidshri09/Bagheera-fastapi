import { useState, useEffect } from 'react'
import paginate from './utils'
const getUrl = "https://fastapi-bagheera.herokuapp.com/users"

export const useGet = () => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])

  const getProducts = async () => {
    const response = await fetch(getUrl+'?limit=100',{
        "method": "GET",
        "headers": {
            "accept": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
        }
    });
    const data = await response.json()
    setData(paginate(data))
    setLoading(false)
  }

  useEffect(() => {
    getProducts()
  }, [])
  return { loading, data }
}
