<script setup lang="ts">
const demoSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      title: 'Name',
      description: 'Please enter your name',
    },
    email: {
      type: 'string',
      format: 'email',
      title: 'Email',
    },
    password: {
      type: 'string',
      format: 'password',
      title: 'Password',
    },
    title: {
      type: 'string',
      title: 'Title',
      enum: ['Mr', 'Mrs', 'Ms', 'Dr'],
    },
    titles: {
      type: 'array',
      title: 'Titles',
      items: {
        type: 'string',
        enum: ['Mr', 'Mrs', 'Ms', 'Dr'],
      },
    },
    job: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          title: 'Title',
        },
        company: {
          type: 'string',
          title: 'Company',
        },
      },
    },
  },
  required: ['name', 'email', 'password'],
};

const basicModel = ref({
  name: 'John Doe',
  email: 'example@example.com',
  title: 'Mr',
  titles: [],
})

const complexSchema = {
  "$defs": {
    "FooBar": {
      "properties": {
        "count": {
          "title": "Count",
          "type": "integer"
        },
        "size": {
          "anyOf": [
            {
              "type": "number"
            },
            {
              "type": "null"
            }
          ],
          "default": null,
          "title": "Size"
        }
      },
      "required": [
        "count"
      ],
      "title": "FooBar",
      "type": "object"
    },
    "Gender": {
      "enum": [
        "male",
        "female",
        "other",
        "not_given"
      ],
      "title": "Gender",
      "type": "string"
    }
  },
  "description": "This is the description of the main model",
  "properties": {
    "foo_bar": {
      "$ref": "#/$defs/FooBar"
    },
    "Gender": {
      "anyOf": [
        {
          "$ref": "#/$defs/Gender"
        },
        {
          "type": "null"
        }
      ],
      "default": null
    },
    "snap": {
      "default": 42,
      "description": "this is the value of snap",
      "exclusiveMaximum": 50,
      "exclusiveMinimum": 30,
      "title": "The Snap",
      "type": "integer"
    }
  },
  "required": [
    "foo_bar"
  ],
  "title": "Main",
  "type": "object"
}
</script>
<template>
  <section class="flex-1 container flex flex-col gap-2 p-2">
    <ui-segment title="Basic">
      <ui-form :schema="demoSchema" v-model="basicModel" />
    </ui-segment>

    <ui-segment title="Complex">
      <ui-form :schema="complexSchema" />
    </ui-segment>

    <ui-segment title="Tabular Form">
      <ui-form class="tabular">
        <ui-input label="Name" />
        <ui-input label="Email" />
        <ui-input label="Password">
          <template #description>
            Password must be at least 8 characters long
          </template>
        </ui-input>
      </ui-form>
    </ui-segment>
  </section>
</template>