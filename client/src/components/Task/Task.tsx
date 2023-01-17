import React, { useState, useRef, useEffect } from 'react'
import './Task.css'
import { IDraggable, ITask, ITaskType } from '../../interfaces'
import { Draggable } from '@hello-pangea/dnd'
import { ContextMenu } from '../ContextMenu/ContextMenu'
import axios from 'axios'

export function Task(props: IDraggable) {
  const [clicked, setClicked] = useState(false)
  const [color, setColor] = useState(props.color)
  const taskRef = useRef<HTMLDivElement>(null)
  const [colorPicker, showColorPicker] = useState(false)
  const [currHeight, setCurrHeight] = useState<Number>(0)

  useEffect(() => {
    const checkIfClickedOutside = (event: MouseEvent) => {
      if (
        clicked &&
        taskRef.current &&
        !taskRef.current.contains(event.target as Node)
      ) {
        taskRef.current.getElementsByTagName('textarea')[0].blur()
        setClicked(false)
        showColorPicker(false)
        taskRef.current.style.zIndex = '0'
      }
    }
    document.addEventListener('mousedown', checkIfClickedOutside)
    return () => {
      document.removeEventListener('mousedown', checkIfClickedOutside)
    }
  }, [clicked])

  return (
    <Draggable draggableId={props.draggableId} index={props.index}>
      {(provided, snapshot) => (
        <div id="taskContainer" ref={taskRef} onClick={() => {}}>
          <div
            onClick={(event) => setClicked(true)}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <div className="task" style={{ backgroundColor: color }}>
              {clicked ? (
                <textarea
                  className="textarea"
                  style={{ backgroundColor: 'inherit' }}
                  spellCheck={false}
                  autoFocus
                  defaultValue={props.text}
                  onFocus={(event) => {
                    event.currentTarget.style.height =
                      event.target.scrollHeight - 1 + 'px'
                    setCurrHeight(event.target.scrollHeight)
                    const end = event.currentTarget.value.length
                    event.target.setSelectionRange(end, end) // set cursor to the end of text
                    if (taskRef.current) {
                      taskRef.current.style.zIndex = '10000'
                    }
                  }}
                  onChange={(event) => {
                    event.currentTarget.style.height = '1px'
                    event.currentTarget.style.height =
                      event.currentTarget.scrollHeight + 'px'
                    setCurrHeight(event.currentTarget.scrollHeight)
                  }}
                  onBlur={(event) => {
                    const newTaskGrid: ITaskType[] = [...props.currTaskGrid]
                    const column: ITaskType = newTaskGrid[props.column - 1]
                    const task: ITask = column.tasks[props.index - 1]
                    task.text = event.currentTarget.value.trim()
                    axios
                      .put(
                        '/tasks',
                        { text: task.text },
                        { headers: { id: task._id } }
                      )
                      .then((response) => console.log(response.data))
                    props.setCurrTaskGrid(newTaskGrid)
                  }}
                ></textarea>
              ) : (
                <div className="textarea">{props.text}</div>
              )}
            </div>
          </div>
          <ContextMenu
            currTaskGrid={props.currTaskGrid}
            setCurrTaskGrid={props.setCurrTaskGrid}
            column={props.column}
            draggableId={props.draggableId}
            clicked={clicked}
            setClicked={setClicked}
            color={color}
            setColor={setColor}
            colorPicker={colorPicker}
            showColorPicker={showColorPicker}
            //@ts-ignore
            height={currHeight + 26}
          ></ContextMenu>
        </div>
      )}
    </Draggable>
  )
}
