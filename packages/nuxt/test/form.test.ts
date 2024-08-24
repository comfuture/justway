import { describe, it, expect } from 'vitest'
import { getFieldDefintions } from "../src/runtime/util/form";
import { type JSONSchema4 } from 'json-schema';
import UIFormField from '../src/runtime/components/form-field.vue';

describe('FormField', () => {
  it.skip('should renders a text input', () => {
    const prop: JSONSchema4 = {
      type: 'object',
      properties: { name: { type: 'string', title: 'Name' } }
    }
    const def = getFieldDefintions(prop)
    const rendered = UIFormField({ def })
    console.log(rendered)
    expect(rendered.type).toEqual('input')
  })
})