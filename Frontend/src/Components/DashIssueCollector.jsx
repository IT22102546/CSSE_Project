import { Button } from 'flowbite-react'
import React from 'react'
import { Link } from 'react-router-dom'

export default function DashIssueCollector() {
  return (
    // <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
    // <div className="p-4 rounded-lg bg-gradient-to-r from-red-500 to-red-800 text-white">
    //   <div className="flex items-center mb-2">
    //     <span className="inline-block w-2 h-2 bg-red-300 rounded-full mr-2"></span>
    //     <span className="text-sm">Update</span>
    //   </div>
    //   <p className="text-xs mb-1">Feb 12th 2024</p>
    //   <p className="text-lg font-semibold mb-2">Sales revenue increased <span className="text-yellow-300">40%</span> in 1 week</p>
    //   <a href="#" className="text-xs underline hover:text-yellow-300">See Statistics &rarr;</a>
    // </div>
  
    // <div className="p-4 rounded-lg bg-gradient-to-r from-red-500 to-red-800 text-white">
    //   <div className="flex items-center mb-2">
    //     <span className="inline-block w-2 h-2 bg-red-300 rounded-full mr-2"></span>
    //     <span className="text-sm">Update</span>
    //   </div>
    //   <p className="text-xs mb-1">Feb 13th 2024</p>
    //   <p className="text-lg font-semibold mb-2">Customer engagement rose <span className="text-yellow-300">25%</span> in 3 days</p>
    //   <a href="#" className="text-xs underline hover:text-yellow-300">See Details &rarr;</a>
    // </div>
  
    // <div className="p-4 rounded-lg bg-gradient-to-r from-red-500 to-red-800 text-white">
    //   <div className="flex items-center mb-2">
    //     <span className="inline-block w-2 h-2 bg-red-300 rounded-full mr-2"></span>
    //     <span className="text-sm">Update</span>
    //   </div>
    //   <p className="text-xs mb-1">Feb 14th 2024</p>
    //   <p className="text-lg font-semibold mb-2">New subscribers grew by <span className="text-yellow-300">15%</span> in 2 weeks</p>
    //   <a href="#" className="text-xs underline hover:text-yellow-300">View Insights &rarr;</a>
    // </div>
    // </div>
    <>
        <div className='flex flex-wrap gap-3 pt-5 pl-5'>
            <Link to='/dashboard?tab=submittIssue'>
                <button className='p-2 text-white bg-green-600 hover:bg-green-700 rounded-3xl px-5 text-sm shadow-lg border-solid'>Submit Issue</button>
            </Link>
            <Link to='/dashboard?tab=submittedIssue'>
                <button className='p-2 text-white bg-green-600 hover:bg-green-700 rounded-3xl px-5 text-sm shadow-lg border-solid'>Reported Issues</button>
            </Link>
            <Link to='/dashboard?tab=resolvedIssue'>
                <button className='p-2 text-white bg-green-600 hover:bg-green-700 rounded-3xl px-5 text-sm shadow-lg border-solid'>Resolved Issues</button>
            </Link>

        </div>
    </>
  
  )
}
