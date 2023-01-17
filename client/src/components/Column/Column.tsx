import React from 'react'
import './Column.css'
import { Droppable } from '@hello-pangea/dnd'
import { IDroppable, ITask, ITaskType } from '../../interfaces'
import { Task } from '../Task/Task'
// @ts-ignore
import { LightenDarkenColor } from 'lighten-darken-color'
import axios from 'axios'

export function Column(props: IDroppable) {
  var bgColorOnDrag = LightenDarkenColor(props.bodyBgColor, 30)

  return (
    <Droppable droppableId={props.droppableId}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          style={{
            backgroundColor: snapshot.isDraggingOver
              ? bgColorOnDrag
              : props.bodyBgColor,
            gridColumn: props.column,
          }}
          {...provided.droppableProps}
          className="column"
        >
          <span className="columnTitleContainer">
            <input
              defaultValue={props.title}
              placeholder="Enter task type"
              className="columnHeader"
              onChange={(event) => {
                axios
                  .put(
                    '/tasktypes',
                    { text: event.currentTarget.value },
                    {
                      headers: { id: props.droppableId },
                    }
                  )
                  .then((response) => console.log(response.data))
              }}
            ></input>

            <button
              className="deleteColumnButton"
              onClick={() => {
                const newTaskGrid: ITaskType[] = [...props.currTaskGrid]
                const column: ITaskType = newTaskGrid[props.column - 1]
                column.tasks.forEach((task) => {
                  axios
                    .delete('/tasks', {
                      headers: { id: task._id },
                    })
                    .then((response) => console.log(response.data))
                })
                axios
                  .delete('/tasktypes', {
                    headers: { id: props.droppableId },
                  })
                  .then((response) => console.log(response.data))
                newTaskGrid.splice(props.column - 1, 1)
                newTaskGrid.forEach((column) => {
                  column.column = newTaskGrid.indexOf(column) + 1
                  axios
                    .put(
                      '/tasktypes',
                      { column: column.column },
                      {
                        headers: { id: column._id },
                      }
                    )
                    .then((response) => console.log(response.data))
                  column.tasks.forEach((task) => {
                    axios.put(
                      '/tasks',
                      { column: column.column },
                      { headers: { id: task._id } }
                    )
                  })
                })
                props.setCurrTaskGrid(newTaskGrid)
              }}
            >
              Delete task type
            </button>
          </span>

          {props.tasks.map((task) => {
            return (
              <Task
                draggableId={task._id}
                column={props.column}
                key={task._id}
                index={task.row}
                text={task.text}
                color={task.color}
                currTaskGrid={props.currTaskGrid}
                setCurrTaskGrid={props.setCurrTaskGrid}
              />
            )
          })}

          {provided.placeholder}

          <div>
            <button
              className="add"
              onClick={() => {
                const newTaskGrid: ITaskType[] = [...props.currTaskGrid]
                const column: ITaskType = newTaskGrid[props.column - 1]
                const newTask: ITask = {
                  _id: String(Math.random()).substring(1).replace(/\./g, ''),
                  column: props.column,
                  row: column.tasks.length + 1,
                  text: '',
                  color: '#ffffff',
                }
                axios
                  .post(
                    '/tasks',
                    { column: newTask.column, row: newTask.row },
                    { headers: { id: newTask._id } }
                  )
                  .then((response) => console.log(response.data))
                props.setCurrTaskGrid(newTaskGrid)
                column.tasks.push(newTask)
              }}
            >
              + Add task
            </button>
          </div>
        </div>
      )}
    </Droppable>
  )
}
