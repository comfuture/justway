<template>
  <section class="flex-1 container flex flex-col gap-2 p-2">
    <ui-foo />
    <ui-segment list title="list">
      <div class="box">
        content list has a flex column layout
      </div>
      <div class="box">
        content list has a flex column layout
      </div>
    </ui-segment>

    <ui-segment columns title="columns">
      <div class="box">
        content columns has a flex row layout
      </div>
      <div class="box">
        content columns has a flex row layout
      </div>
    </ui-segment>

    <ui-segment responsible title="responsible">
      <div class="box">
        responsible content has a flex row layout
      </div>
      <div class="box">
        but will change to column layout on small screens
      </div>
    </ui-segment>

    <ui-segment class="tabular" title="Properties">
      <ui-property label="Name">
        John Doe
      </ui-property>
      <ui-property label="Age">
        19
      </ui-property>
      <ui-property label="Bio">
        <!-- Lorem ipsum dolor sit amet -->
        <ui-input />
      </ui-property>
    </ui-segment>
  </section>
</template>
<style scoped>
.example {
  @apply border border-gray-500 rounded p-4;
}

.box {
  @apply bg-gray-100 border border-gray-500 rounded p-4;
}
</style>