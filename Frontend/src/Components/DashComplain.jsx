import React from 'react'
import { Link } from 'react-router-dom'

export default function DashComplain() {
  return (
    <div className='p-4'>
        <div className='flex flex-wrap gap-3 mb-6'>
        <Link to='/dashboard?tab=complain'>
          <button className='p-2 text-white bg-indigo-700 hover:bg-indigo-800 rounded-3xl px-5 text-sm shadow-lg border-solid'>
            Customer Complaints
          </button>
        </Link>
        <Link to='/dashboard?tab=CollectorIssuesRecieved'>
          <button className='p-2 text-white  bg-indigo-700 hover:bg-indigo-800 rounded-3xl px-5 text-sm shadow-lg border-solid'>
            Collector Issues
          </button>
        </Link>
       
      </div>
    </div>
  )
}
