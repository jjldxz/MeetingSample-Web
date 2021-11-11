let errorNo = 40000
function inc() {
  return ++errorNo
}

export const ErrorMsg = {
  WHITE_BOARD_DOM_ID_NONE: {
    No: inc(),
    msg: 'dom id不存在'
  },
  WHITE_BOARD_CANVAS_CONTAINER_INVALID: {
    No: inc(),
    msg: 'Canvas容器不存在'
  }
}
