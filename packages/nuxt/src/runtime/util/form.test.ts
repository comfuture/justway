import { describe, it, expect } from 'vitest'
import { getFieldDefintions, FormField } from "../src/runtime/util/form";
import { type JSONSchema4 } from 'json-schema';

describe('FormField', () => {
  it('should renders a text input', () => {
    const prop = { type: 'string' }
    const def = getFieldDefintions(prop)
    const field = new FormField(def)
    expect(field.type).toEqual('input')
  })
})