import { describe, it, expect } from 'vitest'
import { getFieldDefintions } from "../src/runtime/util/form";
import { type JSONSchema4 } from 'json-schema';

describe('getFieldDefintions', () => {
  it('should return correct field definitions in simple schema', () => {
    const schema: JSONSchema4 = {
      type: 'object',
      properties: {
        name: { type: 'string', title: 'Name' },
        age: { type: 'number', title: 'Age' },
      }
    }
    const fields = getFieldDefintions(schema)
    expect(fields[0].name).toEqual('name')
    expect(fields[0].type).toEqual('text')
    expect(fields[0].component).toEqual('input')
    expect(fields[0].label).toEqual('Name')
    expect(fields[1].name).toEqual('age')
    expect(fields[1].type).toEqual('number')
    expect(fields[1].component).toEqual('input')
    expect(fields[1].label).toEqual('Age')
  })

  it('should return correct field definitions in schema with enum', () => {
    const schema: JSONSchema4 = {
      type: 'object',
      properties: {
        pet: { type: 'string', enum: ['cat', 'dog'], title: 'Pet' },
      }
    }
    const fields = getFieldDefintions(schema)
    expect(fields[0].component).toEqual('select')
    expect(fields[0].options).toEqual([
      { value: 'cat', label: 'cat' },
      { value: 'dog', label: 'dog' },
    ])
  })

  it('should correspond to the ui definition', () => {
    const schema: JSONSchema4 = {
      type: 'object',
      properties: {
        pet: { type: 'string', enum: ['cat', 'dog'], title: 'Pet', 'ui': { 'type': 'radio' } },
      }
    }
    const fields = getFieldDefintions(schema)
    expect(fields[0].component).toEqual('input')
    expect(fields[0].type).toEqual('radio')
    expect(fields[0].options).toEqual([
      { value: 'cat', label: 'cat' },
      { value: 'dog', label: 'dog' },
    ])
  })

  it('should return correct field definitions in schema with oneOf', () => {
    const schema: JSONSchema4 = {
      type: 'object',
      properties: {
        pet: { type: 'string', oneOf: [{ const: 'cat' }, { const: 'dog' }], title: 'Pet' },
      }
    }
    const fields = getFieldDefintions(schema)
    expect(fields[0].component).toEqual('input')
    expect(fields[0].type).toEqual('radio')
    expect(fields[0].options).toEqual([
      { value: 'cat', label: 'cat' },
      { value: 'dog', label: 'dog' },
    ])
  })

  it('should return correct field definitions in schema anyOf of types', () => {
    const schema: JSONSchema4 = {
      type: 'object',
      properties: {
        age: { anyOf: [{ type: 'number' }, { type: 'null' }], title: 'Age' },
      }
    }
    const fields = getFieldDefintions(schema)
    expect(fields[0].component).toEqual('input')
    expect(fields[0].type).toEqual('number')
    expect(fields[0].required).toEqual(false)
  })

  it('should return correct field definitions in schema with array of enum', () => {
    const schema: JSONSchema4 = {
      type: 'object',
      properties: {
        pets: {
          type: 'array',
          items: {
            type: 'string',
            enum: ['cat', 'dog'],
          },
          title: 'Pets',
        },
      }
    }
    const fields = getFieldDefintions(schema)
    expect(fields[0].component).toEqual('input')
    expect(fields[0].type).toEqual('checkbox')
    expect(fields[0].options).toEqual([
      { value: 'cat', label: 'cat' },
      { value: 'dog', label: 'dog' },
    ])
  })
})
