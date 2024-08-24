export type DateLike = string | number | Date

export type FormatDateOption = {
  locale?: string
  time?: boolean | 'auto'
  month?: boolean
  relative?: boolean
}

export type Duration = {
  days?: number
  hours?: number
  minutes?: number
  seconds?: number
  milliseconds?: number
}

/** convert duration to milliseconds */
const durationToMilliseconds = (duration: Duration) => {
  return (duration.days ?? 0) * 24 * 60 * 60 * 1000 +
    (duration.hours ?? 0) * 60 * 60 * 1000 +
    (duration.minutes ?? 0) * 60 * 1000 +
    (duration.seconds ?? 0) * 1000 +
    (duration.milliseconds ?? 0);
}

/** add duration to date */
export const addDate = (date: DateLike, duration: Duration) => {
  return new Date().setTime(new Date(date).getTime() + durationToMilliseconds(duration))
}

export function isValidDateLike(v: any): v is DateLike {
  const date = new Date(v)
  return !isNaN(date.getTime())
}

export const isInvalid = (date: Date) => isNaN(date.getTime())

const defaultOption: FormatDateOption = {
  locale: 'en-US', // navigator.language ?? navigator.languages[0] ?? 
  time: false,
  relative: false
}

/**
 * Parses the given date to Date object.
 * if time nor timezone is not given, it will be parsed as browser local time.
 * if date is falsy nor invalid, returns new Date()
 */
export const parseDate = (date: DateLike) => {
  if (date instanceof Date) {
    return date
  }
  if (typeof date === 'number') {
    return new Date(date)
  }
  const isYMD = /^\d{4}-\d{2}-\d{2}$/.test(date)
  const isYM = /^\d{4}-\d{2}$/.test(date)
  if (isYMD || isYM) {
    return new Date(date)
  }
}

/**
 * formats the given date to YYYY-MM-DD
 */
export const formatYMD = (date: DateLike) => {
  date = new Date(date ?? '')
  if (isInvalid(date)) {
    return 'Invalid Date'
  }
  return date.toISOString().slice(0, 10)
}

/**
 * formats the given date to YYYY-MM
 */
export const formatYM = (date: DateLike) => {
  date = new Date(date ?? '')
  if (isInvalid(date)) {
    return 'Invalid Date'
  }
  return date.toISOString().slice(0, 7)
}

export const formatDate = (date: DateLike, option: FormatDateOption = defaultOption) => {
  date = new Date(date ?? '')
  if (isInvalid(date)) {
    return 'Invalid Date'
  }

  const timeOptions = {}

  if (option.time === 'auto') {
    if (Date.now() < date.getTime() + 86400000) {
      Object.assign(timeOptions, {
        hour: '2-digit',
        minute: '2-digit',
      })
    }
  } else if (option.month) {

  } else if (option.time) {
    Object.assign(timeOptions, {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // in the future
  if (Date.now() < date.getTime()) {
    const formatter = new Intl.DateTimeFormat(option.locale ?? 'ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...timeOptions
    })
    return formatter.format(date)
  }
  if (option.relative) {
    const formatter = new Intl.RelativeTimeFormat(option.locale ?? 'ko-KR', {
      style: 'narrow'
    })
    // if date is within 1 minute
    if (Date.now() - date.getTime() < 60 * 1000) {
      return formatter.format(-0, 'minutes')
    }
    // if date is within 24 hours
    if (Date.now() - date.getTime() < 24 * 60 * 60 * 1000) {
      return formatter.format(Math.floor((date.getTime() - Date.now()) / 1000 / 60 / 60), 'hours')
    }
    // if date is within 7 days
    if (Date.now() - date.getTime() < 7 * 24 * 60 * 60 * 1000) {
      return formatter.format(Math.floor((date.getTime() - Date.now()) / 1000 / 60 / 60 / 24), 'days')
    }
  }
  // if same year
  if (date.getFullYear() === new Date().getFullYear()) {
    // format related to now
    const formatter = new Intl.DateTimeFormat(option.locale ?? 'ko-KR', {
      month: 'long',
      day: 'numeric',
      ...timeOptions
    })
    return formatter.format(date)
  }
  // else
  const formatter = new Intl.DateTimeFormat(option.locale ?? 'ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...timeOptions
  })
  return formatter.format(date)
}