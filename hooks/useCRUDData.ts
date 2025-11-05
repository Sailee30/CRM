import { useState, useEffect } from 'react'

export const INITIAL_CRUD_DATA = {
  contacts: [
    { id: 1, name: 'Alice Smith', email: 'alice@example.com', phone: '555-0101' },
    { id: 2, name: 'Bob Johnson', email: 'bob@example.com', phone: '555-0102' },
    { id: 3, name: 'Carol White', email: 'carol@example.com', phone: '555-0103' },
  ],
  sales: [
    { id: 101, product: 'Laptop', amount: 999, customer: 'Alice', date: '2025-01-15' },
    { id: 102, product: 'Phone', amount: 599, customer: 'Bob', date: '2025-01-16' },
  ],
}

export function useCRUDData() {
  const [data, setData] = useState(INITIAL_CRUD_DATA)
  const [changeCount, setChangeCount] = useState(0)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('crm_crud_demo')
      if (saved) setData(JSON.parse(saved))
    } catch (e) {
      console.error('Failed to load CRUD data:', e)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('crm_crud_demo', JSON.stringify(data))
  }, [data])

  return {
    data,
    changeCount,
    setData,
    setChangeCount,
  }
}