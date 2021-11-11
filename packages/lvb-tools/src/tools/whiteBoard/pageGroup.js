import Canvas from './canvas'
import { PAGE_STATUS, PageGroupState } from './commonDef'

export default class PageGroup {
  constructor() {
    this._id = -1
    this._name = ''
    this._pages = []
    this._currentPageNo = 1
    this._course = []
    this._totalCnt = 0
    this._imgSrcW = 0
    this._imgSrcH = 0
    this._state = PageGroupState.New
    this._delete = false
  }

  get id() {
    return this._id
  }

  get name() {
    return this._name
  }

  get totalCnt() {
    return this._totalCnt
  }

  get imgW() {
    return this._imgSrcW
  }

  get imgH() {
    return this._imgSrcH
  }

  set isDelete(del) {
    this._delete = del
  }

  get isDelete() {
    return this._delete
  }

  // set isActive(active) {
  //     this._isActive = active;
  // }
  //
  // get isActive() {
  //     // const activeIdx = this._pages.findIndex(page => page.status === PAGE_STATUS.ACTIVE);
  //     // return activeIdx !== -1;
  //     return this._isActive;
  // }

  init(opts = {}) {
    this._id = opts.id
    if (opts.hasOwnProperty('name')) {
      this._name = opts.name
    }
    if (opts.hasOwnProperty('currentPageNo')) {
      this._currentPageNo = opts.currentPageNo
    }
    if (opts.hasOwnProperty('state')) {
      this._state = opts.state
    }
    if (opts.hasOwnProperty('delete')) {
      this._delete = opts.delete
    }
    const course = opts.hasOwnProperty('course') ? opts.course : []
    this.addPages(course)
    // for(let idx = 0; idx < this._course.length; idx++) {
    //     const course = this._course[idx];
    //     this.add({
    //         pageId: idx + 1,
    //         url: course.cos_path,
    //         status: idx === 0 ? PAGE_STATUS.ACTIVE : PAGE_STATUS.INACTIVE,
    //     });
    //     this._imgSrcW = course.width;
    //     this._imgSrcH = course.height;
    // }
    // this._totalCnt = this._pages.length;
  }

  set pageNo(no) {
    if (no >= 1 && no <= this.pageCnt) {
      this._currentPageNo = no
    }
  }

  get pageNo() {
    return this._currentPageNo
  }

  get pageCnt() {
    return this._pages.length
  }

  get currentPage() {
    return this._pages[this._currentPageNo - 1]
  }

  get course() {
    return this._course
  }

  get pages() {
    return this._pages
  }

  set course(course) {
    this._course = course.sort((a, b) => {
      let temp = a['file_name'].split('/')
      const aNo = parseInt(temp[temp.length - 1].split('.')[0])
      temp = b['file_name'].split('/')
      const bNo = parseInt(temp[temp.length - 1].split('.')[0])
      return aNo - bNo
    })
  }

  set state(state) {
    this._state = state
  }

  get state() {
    return this._state
  }

  addPages(courses) {
    this._course = courses
    for (let idx = 0; idx < this._course.length; idx++) {
      const course = courses[idx]
      this.add({
        pageId: idx + 1,
        url: course.cos_path,
        status: idx === 0 ? PAGE_STATUS.ACTIVE : PAGE_STATUS.INACTIVE
      })
      this._imgSrcW = course.width
      this._imgSrcH = course.height
    }
    this._totalCnt = this._pages.length
  }

  updateCanvasGroupInfo() {
    this.currentPage.canvas.updateCanvasGroupInfo(this._id, this.currentPage.id)
  }

  getPageNoByPageId(pageId) {
    const idx = this._pages.findIndex((item) => item.id === pageId)
    return idx === -1 ? idx : idx + 1
  }

  updatePage(opts = {}, idx = null) {
    if (idx && (idx <= 0 || idx > this.pageCnt)) {
      return
    }
    // this._totalCnt++;
    if (opts.status === PAGE_STATUS.DELETE) {
      this._pages = this._pages.filter((page) => page.id !== opts.pageId)
      return
    }
    idx = idx ? idx : this._pages.findIndex((page) => page.id === opts.pageId)
    if (idx !== -1) {
      this._pages[idx].status = opts.status
      if (opts.url && opts.url !== '') {
        this._pages[idx].imgUrl = opts.url
      }
      if (opts.data) {
        for (let item of opts.data) {
          item = JSON.parse(item)
          this._pages[idx].canvas.updateContainerInfo(item)
        }
      }
      if (opts.revokes) {
        for (let item of opts.revokes) {
          //let item = revokeData[i];
          let session = {}
          if (item.session) {
            for (let msgItem of item.session) {
              let drawingMsg = JSON.parse(msgItem)
              session[drawingMsg.id] = drawingMsg
            }
          }
          let revokeItem = {
            type: item.type,
            id: item.id,
            targetId: item.targetId,
            time: item.time,
            session: session
          }
          this._pages[idx].canvas.updateRevokeList(revokeItem)
        }
      }
    }
  }

  updatePageByPageId(opts = {}) {
    const page = this._pages.find((page) => page.id === opts.pageId)
    if (page) {
      page.canvas.updateContainerInfo(opts)
    }
  }

  add(opts = {}) {
    let idx = this._pages.findIndex((page) => page.id === opts.pageId)
    if (idx === -1) {
      let page = {
        id: opts.pageId ? opts.pageId : this._totalCnt + 1,
        groupName: this._name,
        groupId: this._id,
        imgUrl: opts.url ? opts.url : '',
        canvas: new Canvas()
      }
      this._pages.push(page)
      idx = this._pages.length - 1
      this._totalCnt = this._pages.length
    }
    this.updatePage(opts, idx)
  }

  update(opts = {}) {
    let idx = this._pages.findIndex((page) => page.id === opts.pageId)
    if (idx === -1) {
      let page = {
        id: opts.pageId ? opts.pageId : this._totalCnt + 1,
        groupName: this._name,
        groupId: this._id,
        imgUrl: opts.url ? opts.url : '',
        canvas: new Canvas()
      }
      this._pages.push(page)
      idx = this._pages.length - 1
      this._totalCnt = this._pages.length
    } else {
      idx = null
    }
    this.updatePage(opts, idx)
  }

  first() {
    // if (this._currentPageNo !== 1) {
    //     this._currentPageNo = 1;
    //     this.updateCanvasGroupInfo();
    //     this.currentPage.canvas.drawingCourse(this.currentPage.imgUrl);
    //     // this.drawCurrentPage();
    // }
    if (this._pages.length === 0) {
      return -1
    }
    const page = this._pages[0]
    return page.id
  }

  last() {
    // if (this._currentPageNo !== this.pageCnt) {
    //     this._currentPageNo = this.pageCnt;
    //     this.updateCanvasGroupInfo();
    //     this.currentPage.canvas.drawingCourse(this.currentPage.imgUrl);
    //     // this.drawCurrentPage();
    // }
    if (this._pages.length === 0) {
      return -1
    }
    const page = this._pages[this.pageCnt - 1]
    return page.id
  }

  next() {
    // if (this._currentPageNo !== this.pageCnt) {
    //     this._currentPageNo = this._currentPageNo + 1 > this.pageCnt ? this.pageCnt : this._currentPageNo + 1;
    //     this.updateCanvasGroupInfo();
    //     this.currentPage.canvas.drawingCourse(this.currentPage.imgUrl);
    //     // this.drawCurrentPage();
    // }
    if (this._pages.length === 0) {
      return -1
    }
    const pageNo =
      this._currentPageNo + 1 > this.pageCnt ? this.pageCnt : this._currentPageNo + 1
    const page = this._pages[pageNo - 1]
    return page.id
  }

  any(pageNo) {
    if (this._pages.length === 0) {
      return -1
    }
    if (pageNo < 1 || pageNo > this.pageCnt) {
      return -1
    }
    const page = this._pages[pageNo - 1]
    return page.id
  }

  previous() {
    // if (this._currentPageNo !== 1) {
    //     this._currentPageNo = this._currentPageNo - 1 < 1 ? 1 : this._currentPageNo - 1;
    //     this.updateCanvasGroupInfo();
    //     this.currentPage.canvas.drawingCourse(this.currentPage.imgUrl);
    //     // this.drawCurrentPage();
    // }
    if (this._pages.length === 0) {
      return -1
    }
    const pageNo = this._currentPageNo - 1 < 1 ? 1 : this._currentPageNo - 1
    const page = this._pages[pageNo - 1]
    return page.id
  }

  goTo(no) {
    if (this._currentPageNo !== no) {
      this._currentPageNo = no >= 1 && no <= this.pageCnt ? no : this._currentPageNo
      this.updateCanvasGroupInfo()
      // this.currentPage.canvas.drawingCourse(this.currentPage.imgUrl);
      this.drawCurrentPage()
    }
  }

  delete(no) {
    if (this.pageCnt === 1) {
      return
    }
    if (no >= 1 && no <= this.pageCnt) {
      const page = this._pages[no]
      this._pages.filter((item) => item.id === page.id)
    }
    this._currentPageNo = no > this.pageCnt ? this.pageCnt : no < 1 ? 1 : no
  }

  drawCurrentPage() {
    this.currentPage.canvas.drawingCourse(this.currentPage.imgUrl)
    this.currentPage.canvas.drawing()
  }

  drawAll() {
    const activeIdx = this._pages.findIndex((page) => page.status === PAGE_STATUS.ACTIVE)
    if (activeIdx !== -1) {
      // console.log(`drawAll -- ${this._pages[activeIdx]}`)
      this._currentPageNo = activeIdx + 1
      this.updateCanvasGroupInfo()
      this.drawCurrentPage()
    }
    return activeIdx !== -1
  }

  draw(msg) {
    if (msg) {
      this.currentPage.canvas.drawing(msg)
    } else {
      this.currentPage.canvas.draw()
    }
  }

  clearAll(msg) {
    this.currentPage.canvas.clearAll(msg)
  }

  getRevokeTargetId() {
    return this.currentPage.canvas.getRevokeTargetId()
  }

  clearAllByPageId(msg) {
    const page = this._pages.find((page) => page.id === msg.pageId)
    if (page) {
      page.canvas.clearAll(msg, false)
    }
  }
}
