import React from 'react'
import './Error.css'

export function Error(props: { error: string }) {
  return (
    <>
      <div id="sadFace">☹</div>
      <div className="errorDiv">AN ERROR HAS OCCURED :(</div>
      <div className="errorDiv">{props.error}</div>
    </>
  )
}
