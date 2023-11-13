export const SET_TAGS_VIEW_LIST = (to: any) => {
  if (to.path === '/home' || to.meta.tab != 1) {
    return
  }
  let {
    path,
    meta: { title, icon },
  } = to
  to = { path, title, icon }
  let item: string | null = GET_TAGS_VIEW_LIST()
  if (item === '' || item == null) {
    item = JSON.stringify([to])
  } else {
    let array = JSON.parse(item)
    let pathList = array.map((i) => i.path)
    if (!pathList.includes(to.path)) {
      array.push(to)
    }
    item = JSON.stringify(array)
  }
  sessionStorage.setItem('tagsViewList', item)
  const customEvent = new Event('storageTagsChange')
  // 派发对象
  window.dispatchEvent(customEvent)
}
export const GET_TAGS_VIEW_LIST = () => {
  return sessionStorage.getItem('tagsViewList')
}

export const REMOVE_TAGS_VIEW_LIST = () => {
  return sessionStorage.removeItem('tagsViewList')
}

export const REMOVE_TAGS_VIEW_ITEM = (path: string) => {
  let item: string | null = GET_TAGS_VIEW_LIST()
  if (item === '' || item == null) {
    return ''
  } else {
    let array = JSON.parse(item)
    let pathList = array.filter((i) => i.path !== path)
    item = JSON.stringify(pathList)
  }
  return sessionStorage.setItem('tagsViewList', item)
}
