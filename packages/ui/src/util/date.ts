// reverts zero padded numeric to normal
interface ValueModifier {
  (value: string | number): string
}

const NonZeroPad: ValueModifier = (n) => '' + +n

// python flavored strftime format strings
const DATE_FORMAT: {
  [key: string]: [string, string | null, ...(string | object | ValueModifier)[]]
} = {
  '%a': ['weekday', 'short'],
  '%A': ['weekday', 'long'],
  '%w': ['weekday', 'numeric'], // XXX
  '%d': ['day', 'numeric'],
  '%-d': ['day', 'numeric', NonZeroPad], // XXX
  '%b': ['month', 'short'],
  '%m': ['month', '2-digit'],
  '%-m': ['month', '2-digit', NonZeroPad], // XXX
  '%B': ['month', 'long'],
  '%y': ['year', '2-digit'],
  '%-y': ['year', '2-digit', NonZeroPad], // XXX
  '%Y': ['year', 'numeric'],
  '%H': ['hour', '2-digit'],
  '%-H': ['hour', '2-digit', NonZeroPad], // XXX
  '%I': ['hour', '2-digit', {hour12: false}], // XXX
  '%-I': ['hour', 'numeric', {hour12: false}, NonZeroPad], // XXX
  '%p': ['dayPeriod', null, {hour12: true}], // XXX
  '%M': ['minute', '2-digit'],
  '%-M': ['minute', '2-digit', NonZeroPad], // XXX
  '%S': ['second', '2-digit'],
  '%-S': ['second', '2-digit', NonZeroPad], // XXX
  '%f': ['millisecond', 'numeric', {minimumIntegerDigits: 3}], // XXX
  '%z': ['timeZoneName', 'short'], // XXX
}

function formatDate(date: Date | string,
    format: string | Intl.DateTimeFormatOptions,
    locale?: string): string {
  if (typeof date === 'string') {
    date = new Date(Date.parse(date));
  }
  
  if (typeof format === 'string') {
    const traverse = (pattern: string): [string, Intl.DateTimeFormatOptions, ValueModifier] => {
      const definition = DATE_FORMAT[pattern] ?? ['not_found', null]
      const key = definition[0]
      const options = definition[1] ? {[key]: definition[1]} : {}
      let fn: ValueModifier = (item) => '' + item
      for (const item of definition) {
        if (typeof item === 'object') {
          Object.assign(options, item)
        }
        if (typeof item === 'function') {
          fn = item as ValueModifier
        }
      }
      return [key, options, fn]
    }  
    const option: Intl.DateTimeFormatOptions = {}
    const valueModifiers: {[key: string]: ValueModifier} = {}
    format = format.replace(/(%\-?[a-z])/gi, (_, p1) => {
      const [key, opt, fn] = traverse(p1)
      valueModifiers[key] = fn
      Object.assign(option, opt)
      return '${' + key + '}'
    })
    const formatter = Intl.DateTimeFormat(locale ?? 'default', option);
    const parts =  formatter.formatToParts(date)
    const flatten = Object.fromEntries(parts.map(({type, value}) => [type, valueModifiers[type](value)]))
    const raw = format.split(/\$\{(?!\d)[\wæøåÆØÅ]*\}/)
    const args = format.match(/[^{\}]+(?=})/g) || []
    return String.raw({ raw }, ...args.map(k => flatten[k]))
  }
  const formatter = Intl.DateTimeFormat(locale ?? 'default', format);
  return formatter.format(date);
}

console.log(formatDate(new Date(), '%Y년%m월%d일(%A) %H:%M:%S'));
