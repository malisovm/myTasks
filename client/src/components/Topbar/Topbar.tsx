import React from 'react'
import './Topbar.css'
import { Link } from 'react-router-dom'
import { isMobile } from 'react-device-detect'

export function Topbar(props: { currTaskGridWidth: string }) {
  return (
    <table
      id="topbarContainer"
      width={isMobile ? props.currTaskGridWidth : '100%'}
    >
      <tbody>
        <tr>
          <td>
            <Link to="/" id="logo">
              MyTasks
            </Link>
          </td>
          <td>
            <Link to="/help">&#63; Help</Link>
          </td>
          <td>
            <Link to="/bgColor">BG color</Link>
          </td>
          <td id="filler"></td>
        </tr>
      </tbody>
    </table>
  )
}
