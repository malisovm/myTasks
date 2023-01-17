import React from 'react'
import './ContextMenu.css'
import { ITaskType, IContextMenu } from '../../interfaces'
import { HexColorPicker } from 'react-colorful'
import axios from 'axios'

export function ContextMenu(props: IContextMenu) {
  return (
    <div
      id="contextMenu"
      style={{ display: props.clicked ? 'block' : 'none', top: props.height }}
    >
      <>
        <div
          className="menuItem"
          onClick={(event) => {
            const newTaskGrid: ITaskType[] = [...props.currTaskGrid]
            const column: ITaskType = newTaskGrid[props.column - 1]
            const taskToRemove = column.tasks.find(
              ({ _id }) => _id === props.draggableId
            )
            if (taskToRemove) {
              props.setClicked(false)
              column.tasks.splice(column.tasks.indexOf(taskToRemove), 1)
            }
            column.tasks.forEach((task) => {
              task.row = column.tasks.indexOf(task) + 1
            })
            axios
              .delete('/tasks', {
                headers: { id: props.draggableId },
              })
              .then((response) => console.log(response.data))
            props.setCurrTaskGrid(newTaskGrid)
          }}
        >
          Delete
        </div>
        
        <button
          className="menuItem"
          onClick={(event) => {
            if (!props.colorPicker) props.showColorPicker(true)
            else props.showColorPicker(false)
          }}
        >
          Change color
        </button>
        {props.colorPicker && (
          <HexColorPicker
            color={props.color}
            onChange={(event) => {
              props.setColor(event)
              const newTaskGrid: ITaskType[] = [...props.currTaskGrid]
              const column: ITaskType = newTaskGrid[props.column - 1]
              const taskToChangeColor = column.tasks.find(
                ({ _id }) => _id === props.draggableId
              )
              if (taskToChangeColor) {
                taskToChangeColor.color = event
                axios
                  .put(
                    '/tasks',
                    { color: taskToChangeColor.color },
                    { headers: { id: taskToChangeColor._id } }
                  )
                  .then((response) => console.log(response.data))
              }
              props.setCurrTaskGrid(newTaskGrid)
            }}
          />
        )}
      </>
    </div>
  )
}
