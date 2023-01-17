export interface IDraggable {
  draggableId: string
  column: number
  key: string
  index: number
  text: string
  color: string
  currTaskGrid: ITaskType[]
  setCurrTaskGrid: (currTaskGrid: ITaskType[]) => void
}

export interface IDroppable {
  droppableId: string
  title: string
  column: number
  key: string
  bodyBgColor: string
  tasks: ITask[]
  currTaskGrid: ITaskType[]
  setCurrTaskGrid: (currTaskGrid: ITaskType[]) => void
}

export interface IContextMenu {
  currTaskGrid: ITaskType[]
  setCurrTaskGrid: (currTaskGrid: ITaskType[]) => void
  column: number
  draggableId: string
  clicked: boolean
  setClicked: (clicked: boolean) => void
  color: string
  setColor: (color: string) => void
  colorPicker: boolean
  showColorPicker: (colorPicker: boolean) => void
  height: number
}

export interface ITask {
  _id: string
  column: number
  row: number
  text: string
  color: string
  __v?: number
}

export interface ITaskType {
  _id: string
  column: number
  text: string
  __v?: number
  tasks: ITask[]
}
