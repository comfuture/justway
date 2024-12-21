<script setup lang="ts">
// import '@justway/ui/theme/foo.css';

const now = ref(new Date())
watchEffect(() => {
  const interval = globalThis?.setInterval(() => {
    now.value = new Date()
  }, 1000)
  onBeforeUnmount(() => globalThis?.clearInterval(interval))
})

onMounted(() => {
  // document.querySelector('html')?.classList.add('dark')
})
const buttonGroupValue = ref('2')
const toast = useToast()

const tagsCandidates = ref([
  'Apple',
  'Banana',
  'Cherry',
  'Date',
  'Elderberry',
  'Fig',
  'Grape',
  'Honeydew',
])
</script>
<template>
  <ui-content class="list">
    <ui-alert>This is an alert</ui-alert>
    <ui-alert class="success" dismissible>This is a success alert</ui-alert>
    <ui-toolbar>...</ui-toolbar>
    <nuxt-link :to="{ name: 'scaffold' }">Scaffold</nuxt-link>
    <ui-breadcrumb>
      <li><a href="/">Home</a></li>
      <li><a href="/about">About</a></li>
      <li aria-current="page">Current Page</li>
    </ui-breadcrumb>
    <ui-button class="fab">
      <ui-icon name="add" />
    </ui-button>

    <ui-row>
      <h2>Row</h2>
      <div>Row 2</div>
      <div>Row 3</div>
      <template #trailing>
        <ui-icon name="star" />
      </template>
    </ui-row>
    <ui-row tag="header" inner-tag="h1">
      <template #leading>
        <ui-icon name="home" />
      </template>
      Hello
    </ui-row>
    <ui-menubar>
      <ui-item href="#">Home</ui-item>
      <ui-item href="#">About</ui-item>
      <ui-item href="#">Contact</ui-item>
      <ui-menu>
        <template #label>
          Menu
        </template>
        <template #menu>
          <ui-item href="#">Item 1</ui-item>
          <ui-item href="#">Item 2</ui-item>
          <ui-menu>
            <template #label>
              Submenu
            </template>
            <template #menu>
              <ui-item href="#">Item 1</ui-item>
              <ui-item href="#">Item 2</ui-item>
            </template>
          </ui-menu>
          <ui-item href="#">Item 3</ui-item>
        </template>
      </ui-menu>
    </ui-menubar>
    <ui-segment>
      Segment without title
    </ui-segment>
    <fieldset class="ui content">
      <legend>Fieldset</legend>
      Content in Fieldset
    </fieldset>
    <ui-segment columns>
      <template #title>
        <h3 class="title">
          <ui-icon name="star" />
          Icons
        </h3>
      </template>
      <ui-icon name="home" />
      <ui-icon name="home" filled />
      <ui-icon name="star" filled class="text-yellow-500" />
    </ui-segment>

    <ui-segment list title="Buttons">

      <ui-content items>
        <ui-button>Button</ui-button>
        <ui-button class="primary">Primary</ui-button>
        <ui-button icon="home">Home</ui-button>
        <ui-button loading>Loading</ui-button>
        <ui-button class="bg-blue-500">Blue</ui-button>
      </ui-content>
      <div class="content columns">
        <ui-button class="success">Success</ui-button>
        <ui-button class="warning">Warning</ui-button>
        <ui-button class="danger">Danger</ui-button>
      </div>

      <ui-group v-model="buttonGroupValue">
        <ui-button value="1">One</ui-button>
        <ui-button value="2">Two</ui-button>
        <ui-button value="3">Three</ui-button>
      </ui-group>

      <ui-group>
        <ui-button class="success" value="1">One</ui-button>
        <ui-button class="success" value="2">Two</ui-button>
        <ui-button class="success" value="3">Three</ui-button>
      </ui-group>

      <ui-group>
        <ui-button value="1">One</ui-button>
        <ui-button value="2">Two</ui-button>
        <ui-button value="3">Three</ui-button>
      </ui-group>
      <ui-group>
        <ui-button class="outline">Outline button</ui-button>
        <ui-button class="outline primary">Outline button</ui-button>
      </ui-group>
    </ui-segment>

    <ui-segment columns title="Toast Messages">
      <ui-button @click="toast.info('Info Toast')">Info</ui-button>
      <ui-button @click="toast.success('Success Toast')">Success</ui-button>
      <ui-button @click="toast.error('Error Toast')">Error</ui-button>
      <ui-button @click="toast.warning('Warning Toast')">Warning</ui-button>
      <ui-button @click="toast.info('Hello, World!', { title: 'Greeting!' })">Custom</ui-button>
    </ui-segment>

    <ui-segment table title="Table">
      <ui-table>
        <tr>
          <td>Row 1, Cell 1</td>
          <td>Row 1, Cell 2</td>
          <td>Row 1, Cell 3</td>
        </tr>
        <tr>
          <td>Row 2, Cell 1</td>
          <td>Row 2, Cell 2</td>
          <td>
            <ui-input />
          </td>
        </tr>
      </ui-table>
    </ui-segment>
    <ui-segment title="Tabular Item" class="tabular">
      <ui-item>
        <template #leading>
          Hello
        </template>
        <h2>Hello</h2>
        <template #trailing>
          World
        </template>
      </ui-item>
      <ui-item>
        <template #leading>
          hahahahahahahaha
        </template>
        <h2>World</h2>
      </ui-item>
    </ui-segment>

    <div class="ui content responsible">
      <ui-segment title="Text" class="*">
        <p>Text content</p>
        <p>Text content</p>
      </ui-segment>
      <ui-segment title="Text" style="width: 300px">
        <p>Text content</p>
        <p>Text content</p>
      </ui-segment>
    </div>

    <ui-content class="responsible">
      <ui-segment title="Text" class="*">
        <p>Text content</p>
        <p>Text content</p>
      </ui-segment>
      <ui-segment title="Text" class="**">
        <p>Text content</p>
        <p>Text content</p>
      </ui-segment>
    </ui-content>

    <ui-segment list title="Items">
      <ui-item>
        <template #leading>
          <ui-icon name="home" />
        </template>
        <h2>Item 1</h2>
        <p class="description">Item description</p>
      </ui-item>
      <ui-item icon="favorite">
        <h2>Item 2</h2>
        <template #trailing>
          <small>10 items</small>
        </template>
      </ui-item>
      <ui-item tag="header">
        <template #leading>
          <ui-icon name="star" />
        </template>
        <h2>Header</h2>
        <p class="description">Header description</p>
      </ui-item>
    </ui-segment>

    <ui-segment list title="Date & Time">
      <ui-date :value="now" />
      <ui-date relative :value="new Date()" />
      <ui-config locale="es">
        <ui-date :value="new Date()" />
        <ui-date relative :value="new Date()" />
      </ui-config>
    </ui-segment>
    <ui-segment title="Modal">
      <ui-modal lazy title="Modal">
        <template #trigger="{ open }">
          <ui-button @click="open">Open Modal</ui-button>
        </template>
        Hello, World!
      </ui-modal>

      <ui-modal form title="Form Modal" @submit="console.log('submit')">
        <template #trigger="{ open }">
          <ui-button @click="open">Open Form Modal</ui-button>
        </template>
        <ui-input label="Name" />
        <ui-input label="Email" />
        <ui-input label="Password" type="password" />
        <ui-tags-input label="Tags" :candidates="tagsCandidates" />
        <template #actions="{ close, formId }">
          <ui-button @click="close">Cancel</ui-button>
          <ui-button type="submit" :form="formId" class="primary" @click="close">Submit</ui-button>
        </template>
      </ui-modal>
    </ui-segment>
    <ui-segment columns title="Popover">
      <ui-popover>
        <template #trigger="{ toggle }">
          <ui-button @click="toggle">Hello</ui-button>
        </template>
        <ui-segment class="shadow">
          Popover Content
        </ui-segment>
      </ui-popover>

      <ui-dropdown>
        <template #="{ toggle }">
          <ui-button @click="toggle">Menu</ui-button>
        </template>
        <template #menu>
          <ui-item href="#">Item 1</ui-item>
          <ui-item href="#">Item 2</ui-item>
          <ui-item href="#">Item 3</ui-item>
        </template>
      </ui-dropdown>

      |

      <ui-dropdown>
        <template #="{ toggle }">
          <span @click="toggle">Menu</span>
        </template>
        <template #menu>
          <ui-item href="#">Item 1</ui-item>
          <ui-item href="#">Item 2</ui-item>
          <ui-dropdown placement="right">
            <template #="{ toggle }">
              <ui-item @click="toggle">
                Item 3
                <template #trailing>
                  <ui-icon name="chevron_right" />
                </template>
              </ui-item>
            </template>
            <template #menu>
              <ui-item href="#">Subitem 1</ui-item>
              <ui-item href="#">Subitem 2</ui-item>
              <ui-item href="#">Subitem 3</ui-item>
            </template>
          </ui-dropdown>
        </template>
      </ui-dropdown>
      <ui-dropdown>
        <template #="{ toggle }">
          <span @click="toggle">Menu</span>
        </template>
        <template #menu>
          <ui-item href="#">Item 1</ui-item>
          <ui-item href="#">Item 2</ui-item>
          <ui-item href="#">Item 3</ui-item>
        </template>
      </ui-dropdown>
    </ui-segment>
    <ui-segment list title="Number">
      <ui-number value="1234" />
      <ui-number value="12345678" />
      <ui-number value="1234.5678" precision="2" />
      <ui-number value="1234" currency="USD" />
      <ui-number value="1234" currency="KRW" />
      <ui-number value="0.75" percent />
      <ui-number value="0.751234" percent precision="3" />
      <ui-number nullable />
      <ui-number nullable value="wrong number" />
      <ui-editable>
        <ui-number value="1234" />
        <ui-icon name="edit" />
      </ui-editable>
    </ui-segment>

    <ui-segment title="Group">
      <ui-group item-column-template="$label 1fr">
        <ui-item>
          <template #leading>
            <span data-group="label">Label 1</span>
          </template>
          Value
        </ui-item>
        <ui-item>
          <template #leading>
            <span data-group="label">A long long label</span>
          </template>
          Value
        </ui-item>
      </ui-group>
    </ui-segment>

    <ui-accordion segment name="acc-1">
      <ui-content title="Section 1" active>
        Content 1
      </ui-content>
      <ui-content title="Section 2">
        Content 2
      </ui-content>
    </ui-accordion>

    <ui-tabs segment>
      <template #tabs>
        <a href="#tab1" class="active">Tab 1</a>
        <a href="#tab2">Tab 2</a>
        <a href="#tab3">Tab 3</a>
        <a href="#tab3">Tab 4</a>
        <a href="#tab3">Tab 5</a>
        <a href="#tab3">Tab 6</a>
      </template>
      <section id="tab1">
        <p>Tab 1 content</p>
      </section>
      <section id="tab2">
        <p>Tab 2 content<br>with different height</p>
      </section>
      <section id="tab3">
        <p>Tab 3 content</p>
      </section>
      <ui-content title="Tab 7">
        Tab 7 content
      </ui-content>
    </ui-tabs>

    <ui-tabs segment>
      <template #tabs>
        <nuxt-link to="/">Home</nuxt-link>
        <nuxt-link :to="{ name: 'form' }">Form</nuxt-link>
      </template>
      ...
    </ui-tabs>

    <ui-tabs segment title="Standalone Tabs">
      <ui-content active title="Tab 1" class="my-2">
        Tab 1 content
      </ui-content>
      <ui-content title="Tab 2" class="my-2">
        Tab 2 content
      </ui-content>
      <ui-content title="Tab 3" class="my-2">
        Tab 3 content
      </ui-content>
    </ui-tabs>

    <ui-segment title="Search Palette">
      <ui-search-palette @select="console.log">
      </ui-search-palette>

      <ui-search-palette @select="console.log">
        <template #trigger="{ open }">
          <ui-button @click="open">Search</ui-button>
        </template>
      </ui-search-palette>
    </ui-segment>

    <ui-segment title="Calendar">
      <ui-calendar />
      <ui-calendar range />

      <ui-date-range-selector />
    </ui-segment>

    <ui-segment list title="Progress">
      <ui-progress />
      <ui-progress class="w-full" :value="50" />
      <ui-progress label="Progress" :value="75" />
    </ui-segment>

    <ui-pagination :total="100" :page="1" />
    <ui-popover open>
      Hello, world
    </ui-popover>
  </ui-content>
</template>
<style>
/* @import '@justway/ui/theme/foo.css'; */

:root {

  /* --ui-background-color: #fff; */
  /* .ui.segment>header,
  details.ui>summary {
    background-color: #f9f9f9;
    border-bottom: none;
  } */

  /* 
  --ui-border-radius: 0.75rem;

  .ui.button {
    padding: 0.5rem 1rem;
    border-radius: 99em;
  } */

  /* .ui.toast>.item {
    background-color: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(2px);
  } */

  /* .ui.tabs {
    >header.group {
      padding: 0.25rem 0.25rem 0 0.25rem;

      >* {
        margin-bottom: -1px;
      }

      .active {
        background-color: #fff;
        border: 1px solid #ddd;
        border-radius: 0.25rem 0.25rem 0 0;
        border-bottom-color: canvas;
      }
    }
  } */

  /* &.dark {

    .ui.segment>header,
    details.ui>summary {
      background-color: #333;
      color: #fff;
    }

    .ui.toast>.item {
      background-color: rgba(0, 0, 0, 0.7);
    }

  } */
}
</style>