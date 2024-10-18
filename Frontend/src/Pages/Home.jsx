import React from 'react'
import WasteForm from '../Components/WasteForm'
import WasteCollectorInterface from '../Components/DriverMap'

export default function Home() {
  return (
    <div>
      <WasteForm/>
      <div>
        driver map
        <div>
          <WasteCollectorInterface/>
        </div>
      </div>
    </div>
  )
}
