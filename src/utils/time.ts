import dayjs from 'dayjs'

export const getTimeAdverbial = (): string => {
  const hours = new Date().getHours()
  if (hours <= 6) {
    return '凌晨'
  } else if (6 < hours && hours <= 9) {
    return '早上'
  } else if (9 < hours && hours <= 12) {
    return '上午'
  } else if (12 < hours && hours <= 14) {
    return '中午'
  } else if (14 < hours && hours <= 18) {
    return '下午'
  } else {
    return '晚上'
  }
}

export const dateFormat = (time): string => {
  return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
}

export const parseDate = (time,format): string => {
  return dayjs(time).format(format)
}
