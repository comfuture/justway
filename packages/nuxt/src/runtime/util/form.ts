import { defineComponent, h, type VNode, type PropType } from 'vue'
import type { JSONSchema4, JSONSchema4Type } from "json-schema"

export type IsAny<T> = unknown extends T ? ([keyof T] extends [never] ? false : true) : false
type ExcludeArrayKeys<T> = T extends ArrayLike<any> ? Exclude<keyof T, keyof any[]> : keyof T

type PathImpl<T, Key extends keyof T> = Key extends string
  ? IsAny<T[Key]> extends true
  ? never
  : T[Key] extends Record<string, any>
  ?
  | `${Key}.${PathImpl<T[Key], ExcludeArrayKeys<T[Key]>> & string}`
  | `${Key}.${ExcludeArrayKeys<T[Key]> & string}`
  : never
  : never

type PathImpl2<T> = PathImpl<T, keyof T> | keyof T

export type Path<T> = keyof T extends string
  ? PathImpl2<T> extends infer P
  ? P extends string | keyof T
  ? P
  : keyof T
  : keyof T
  : never

export type Choose<
  T extends Record<string | number, any>,
  K extends Path<T>
> = K extends `${infer U}.${infer Rest}`
  ? Rest extends Path<T[U]>
  ? Choose<T[U], Rest>
  : never
  : T[K]

const inputTypes = ['text', 'number', 'password', 'email', 'tel', 'url',
  'checkbox', 'radio', 'date', 'time', 'datetime-local',
  'file', 'color', 'range', 'hidden'] as const
export type InputType = typeof inputTypes[number] | typeof inputTypes[number][]

type InputComponent = 'input' | 'select' | 'textarea' | 'fieldset' | ReturnType<typeof defineComponent>

/** Definition for rendering the input field */
export type FieldDefinition = {
  name: string
  type: InputType
  component: InputComponent
  label?: string
  description?: string
  placeholder?: string
  required?: boolean
  options?: string[] | { value: string, label: string }[]
  initialValue?: any
  fields?: FieldDefinition[]
  [key: string]: any  // Allow any other properties
}

interface GetFieldDefinitionOption {
  prefix?: string
}

function isBoolean(value: any): value is boolean {
  return typeof value === 'boolean'
}

function isArray(value: any): value is any[] {
  return Array.isArray(value)
}

/**
  * 
  */
/**
 * Get definitions from a JSON schema.
 * The field definition can be used to render a form field(s).
 * 
 * @param schema - The JSON schema object.
 * @param option - The options for retrieving field definitions.
 * @returns An array of field definitions.
 */
export function getFieldDefintions(schema: JSONSchema4, option: GetFieldDefinitionOption = {}): FieldDefinition[] {
  return Object.keys(schema.properties ?? {}).map((key) => {
    const prop = schema.properties?.[key] ?? {};
    const field: FieldDefinition = {
      name: key ?? getFieldName(prop, option),
      type: getFieldType(prop),
      label: getFieldLabel(prop),
      description: prop.description,
      component: getFieldComponent(prop),
      options: getFieldOptions(prop),
      required: getFieldRequired(key, schema),
      initialValue: prop.default,
    }
    if (prop.type === 'object') {
      field.component = 'fieldset'
      field.fields = getFieldDefintions(prop, { ...option, prefix: field.name })
    }
    return field
  })
}

/** Get the definition name from the schema */
function getFieldName(schema: JSONSchema4, option: GetFieldDefinitionOption = {}): string {
  let fieldName = (schema.title ?? '').toLowerCase().replace(/[^a-z0-9]/g, '_')
  let prefixSanitized = option.prefix?.replace(/[^a-z0-9]/g, '_')
  if (schema.type === 'array') {
    fieldName = fieldName.replace(/s$/, '') + '[]'
  }
  if (prefixSanitized) {
    return `${prefixSanitized}.${schema.fieldName}`
  }
  return fieldName;
}

function getFieldLabel(schema: JSONSchema4): string {
  return schema.title ?? ''
}

function flattenSchema(schema: JSONSchema4, prop: string): string {
  // age: { anyOf: [{ type: 'number' }, { type: 'null' }], title: 'Age' }, => 'number'
  // foo: { anyOf: [{ type: 'number' }, { type: 'string' }], title: 'Foo' }, => 'string'

  const typePriority = ['string', 'number', 'integer', 'boolean', 'null']
  if (schema.anyOf) {
    [...schema.anyOf].sort((a, b) => {
      const aIndex = typePriority.indexOf(a.type as string)
      const bIndex = typePriority.indexOf(b.type as string)
      return aIndex - bIndex
    })
    return schema.anyOf[0].type as string
  }
}

/** Guess the input type from the schema */
function getFieldType(prop: JSONSchema4): InputType {
  if (!prop.type) {
    // try anyOf
    if (prop.anyOf) {
      return flattenSchema(prop, 'type') as InputType
    }
    // try oneOf
    if (prop.oneOf) {
      return 'radio'
    }
  }

  // Covers json-schema built-in schemas
  // https://json-schema.org/understanding-json-schema/reference/string#built-in-formats
  if (prop.type === 'string') {
    if (prop.ui?.type === 'radio') { // XXX
      return 'radio'
    }
    // known formats
    const textFormats = ['password', 'date', 'time', 'datetime-local', 'email', 'tel', 'url', 'color']
    if (textFormats.includes(prop.format ?? '')) {
      return prop.format as InputType
    }
    if (prop.format == 'idn-email') {
      return 'email'
    }
    if (['uri', 'uri-reference', 'iri', 'iri-reference'].includes(prop.format ?? '')) {
      return 'url'
    }
    if (prop.oneOf) {
      return 'radio'
    }
    return 'text'
  } else if (prop.type === 'number' || prop.type === 'integer') {
    return 'number'
  } else if (prop.type === 'boolean') {
    return 'checkbox'
  } else if (prop.type === 'array') {
    // TODO: should implement array of objects with `prop.properties`
    return 'checkbox'
  } else if (prop.type === 'object') {
    return 'text' // XXX: is not cared for now
  }
  return 'text'
}

function getFieldComponent(prop: JSONSchema4): InputComponent {
  if (prop.type === 'object') {
    return 'fieldset'
  } else if (prop.type === 'string') {
    if (prop.ui?.type === 'radio') { // XXX
      return 'input'
    }
    if (prop.enum) {
      return 'select'
    }
    if (prop.format === 'textarea') {
      return 'textarea'
    }
  } else if (prop.ui?.type) {
    if (prop.ui.type === 'radio') { // XXX
      return 'input'
    }
    // if additional ui properties are defined and it's a component is provided
    return prop.ui.component as InputComponent
  }
  return 'input'
}

function getFieldOptions(prop: JSONSchema4): string[] | { value: string, label: string }[] | undefined {
  if (prop.enum) {
    if (prop.enum.every((value) => typeof value === 'string')) {
      return prop.enum.map((value: string) => ({ value, label: value }))
    } else if (prop.enum.every((value) => typeof value === 'object' && 'const' in value)) {
      return prop.enum.map((value: JSONSchema4) => ({ value: value.const as string, label: value.label ?? value.const as string }))
    }
  } else if (prop.oneOf) {
    return prop.oneOf.map((value: JSONSchema4Type) => {
      if (typeof value === 'object' && 'const' in value) {
        return { value: value.const as string, label: value.const as string }
      }
      return { value: value as string, label: value as string }
    })
  } else if (prop.anyOf) {
    return prop.anyOf.map((value: JSONSchema4Type) => {
      if (typeof value === 'object' && 'const' in value) {
        return { value: value.const as string, label: value.const as string }
      }
      return { value: value as string, label: value as string }
    })
  } else if (prop.items) {
    if (!isArray(prop.items) && prop.items.enum) {
      return prop.items.enum.map((value: string) => ({ value, label: value }))
    }
  }
  return undefined
}

function getFieldRequired(key: string, schema: JSONSchema4): boolean {
  const prop = schema.properties[key]
  if (prop?.required) {
    return true
  }
  // if required field is defined and it's type is boolean, then it's required
  if (prop.required === true) {
    return true
  }
  // if anyOf type is null, then it's not required
  if (prop?.anyOf) {
    let isRequired = prop.anyOf.some((p) => p.required === true)
    if (prop?.anyOf.some((p) => p.type === 'null')) {
      return false
    }
    return isRequired
  }
  return isBoolean(schema.required) ? schema.required : schema.required?.includes(key)
}
