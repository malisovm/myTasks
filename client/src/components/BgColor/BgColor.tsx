import axios from 'axios'
import React from 'react'
import { HexColorPicker } from 'react-colorful'

export function BgColor(props: {
  bodyBgColor: string
  setBodyBgColor: (bodyBgColor: string) => void
}) {
  return (
    <div
      style={{
        display: 'grid',
        marginTop: '25px',
        height: '250px',
        marginLeft: '25px',
      }}
    >
      <div style={{ fontWeight: 'bold' }}>Select app background color:</div>
      <HexColorPicker
        id="bgColorPicker"
        color={props.bodyBgColor}
        onChange={(event) => {
          axios
            .put(
              '/globalVars',
              { value: event },
              { headers: { id: 'bodyColor' } }
            )
            .then((response) => console.log(response.data))
          props.setBodyBgColor(event)
        }}
      />
    </div>
  )
}
