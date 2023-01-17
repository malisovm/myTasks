import React from 'react'
import './Help.css'

export function Help() {
  return (
    <div id="helpContainer">
      <div id="helpHeader">What is this app all about?</div>
      <div className="help">
        This is a Kanban-style task board. You can create tasks and group them
        by types by drag'n'dropping them into columns. You can also highlight
        certain tasks by assigning colors to them (click/tap on a task and
        select "Change color" from the menu below).
      </div>
      <div className="help">
        You can also create new columns and rename them. To remove a column,
        click/tap on its header and a button will appear below.
      </div>
    </div>
  )
}
