import React, { useState, useRef, useEffect } from 'react'
import './TaskGrid.css'
import { Column } from '../Column/Column'
//import { savedTasks, savedTaskTypes } from './mockData'
import { DragDropContext, DropResult } from '@hello-pangea/dnd'
import { ITaskType } from '../../interfaces'
import axios from 'axios'

export function TaskGrid(props: {
  bodyBgColor: string
  savedData: ITaskType[]
  setCurrTaskGridWidth: (taskGridWidth: string) => void
}) {
  const [currTaskGrid, setCurrTaskGrid] = useState(props.savedData)
  const taskGridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    props.setCurrTaskGridWidth(`${taskGridRef.current!.offsetWidth + 200}px`)
  }, [currTaskGrid])

  return (
    <div id="taskGridContainer" ref={taskGridRef}>
      <div id="taskGrid" className="float-left">
        <DragDropContext
          onDragEnd={(result) =>
            dragEndHandler(result, currTaskGrid, setCurrTaskGrid)
          }
        >
          {currTaskGrid.map((column, index) => {
            return (
              <Column
                droppableId={column._id}
                key={column._id}
                column={column.column}
                title={column.text}
                bodyBgColor={props.bodyBgColor}
                tasks={column.tasks}
                currTaskGrid={currTaskGrid}
                setCurrTaskGrid={setCurrTaskGrid}
              />
            )
          })}
        </DragDropContext>
      </div>

      <button
        className="add addTaskType"
        onClick={() => {
          const newTaskGrid: ITaskType[] = [...currTaskGrid]
          const newColumn: ITaskType = {
            _id: String(Math.random()).substring(1).replace(/\./g, ''),
            column: newTaskGrid.length + 1,
            text: '',
            tasks: [],
          }
          axios
            .post(
              '/tasktypes',
              { column: newColumn.column },
              { headers: { id: newColumn._id } }
            )
            .then((response) => console.log(response.data))
          newTaskGrid.push(newColumn)
          setCurrTaskGrid(newTaskGrid)
        }}
      >
        + Add task type
      </button>
    </div>
  )
}

const dragEndHandler = (
  result: DropResult,
  currTaskGrid: ITaskType[],
  setCurrTaskGrid: (currTaskGrid: ITaskType[]) => void
) => {
  if (!result.destination) return
  const newTaskGrid = [...currTaskGrid]
  const { source, destination } = result
  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = newTaskGrid.find(
      ({ _id }) => _id === source.droppableId
    )
    const destColumn = newTaskGrid.find(
      ({ _id }) => _id === destination.droppableId
    )
    if (sourceColumn && destColumn) {
      const sourceTasks = [...sourceColumn.tasks]
      const destTasks = [...destColumn.tasks]
      const [removedTask] = sourceTasks.splice(source.index - 1, 1)
      destTasks.splice(destination.index - 1, 0, removedTask)
      sourceTasks.forEach((task) => {
        task.row = sourceTasks.indexOf(task) + 1
        task.column = newTaskGrid.indexOf(sourceColumn) + 1
        axios
          .put(
            '/tasks',
            { column: task.column, row: task.row },
            { headers: { id: task._id } }
          )
          .then((response) => console.log(response.data))
      })
      destTasks.forEach((task) => {
        task.row = destTasks.indexOf(task) + 1
        task.column = newTaskGrid.indexOf(destColumn) + 1
        axios
          .put(
            '/tasks',
            { column: task.column, row: task.row },
            { headers: { id: task._id } }
          )
          .then((response) => console.log(response.data))
      })
      sourceColumn.tasks = sourceTasks
      destColumn.tasks = destTasks
    }
  } else {
    const column = newTaskGrid.find(({ _id }) => _id === source.droppableId)
    if (column) {
      const tasks = [...column.tasks]
      const [removedTask] = tasks.splice(source.index - 1, 1)
      tasks.splice(destination.index - 1, 0, removedTask)
      tasks.forEach((task) => {
        task.row = tasks.indexOf(task) + 1
        axios
          .put('/tasks', { row: task.row }, { headers: { id: task._id } })
          .then((response) => console.log(response.data))
      })
      column.tasks = tasks
    }
  }
  setCurrTaskGrid(newTaskGrid)
}
