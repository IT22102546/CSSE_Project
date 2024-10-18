import React from 'react'
import { Link } from 'react-router-dom'

export default function DashResource() {
  return (
    <>
        <div className='flex flex-wrap gap-3 pt-5 pl-5'>
            <Link to='/addtruck'>
                <button className='p-2 text-white bg-green-600 hover:bg-green-700 rounded-3xl px-5 text-sm shadow-lg border-solid'>Add Truck</button>
            </Link>
            <Link to='/dashboard?tab=trucks'>
                <button className='p-2 text-white bg-green-600 hover:bg-green-700 rounded-3xl px-5 text-sm shadow-lg border-solid'>Available Trucks</button>
            </Link>
            <Link to='/dashboard?tab=resolvedIssue'>
                <button className='p-2 text-white bg-green-600 hover:bg-green-700 rounded-3xl px-5 text-sm shadow-lg border-solid'>Resolved Issues</button>
            </Link>

        </div>
    </>
  )
}
