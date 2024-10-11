<script setup lang="ts">
const drawerVisible = ref(false)
onMounted(() => {
  // document.documentElement.classList.add('dark')
})
</script>
<template>
  <div id="site">
    <header class="appbar sticky- top-0 z-50">
      <div class="container flex items-center gap-4 p-2">
        <button @click="drawerVisible = !drawerVisible">
          <ui-icon name="menu" />
        </button>
        <h1 class="title">Playground</h1>
      </div>
    </header>
    <main class="flex">
      <ui-drawer class="w-64 bg-[color:var(--ui-panel-bg)]" v-model="drawerVisible">
        <nav>
          <ui-item icon="home" to="/">
            Home
          </ui-item>
          <ui-item icon="star" :to="{ name: 'basics' }">
            Basics
          </ui-item>
          <ui-item :to="{ name: 'server-driven' }">
            Server Driven
          </ui-item>
          <ui-accordion>
            <details name="menu">
              <summary>
                <ui-icon name="menu" />
                Menu 1
              </summary>
              <ui-item to="/menu/1">Menu 1</ui-item>

              <ui-accordion>
                <details name="submenu">
                  <summary>
                    <ui-item icon="menu">Menu 2</ui-item>
                  </summary>
                  <ui-item to="/menu/1">Menu 1</ui-item>
                  <ui-item to="/menu/2">Menu 2</ui-item>
                  <ui-item to="/menu/3">Menu 3</ui-item>
                </details>
              </ui-accordion>
              <ui-item to="/menu/3">Menu 3</ui-item>
            </details>
            <details name="menu">
              <summary>
                <ui-icon name="menu" />
                Menu 2
              </summary>
              <ui-item to="/menu/1">Menu 1</ui-item>
              <ui-item to="/menu/2">Menu 2</ui-item>
              <ui-item to="/menu/3">Menu 3</ui-item>
            </details>
          </ui-accordion>
          <ui-popover placement="bottom-right">
            <template #trigger="{ toggle }">
              <ui-item @click="toggle">
                <template #leading>
                  <ui-icon name="star" />
                </template>
                Favorites
              </ui-item>
            </template>
            <ui-segment list class="shadow-lg w-48">
              <ui-item to="/favorites/1">Favorite 1</ui-item>
              <ui-item to="/favorites/2">Favorite 2</ui-item>
              <ui-item to="/favorites/3">Favorite 3</ui-item>
            </ui-segment>
          </ui-popover>
          <ui-item :to="{ name: 'form' }" icon="dns">
            Form
          </ui-item>
        </nav>
      </ui-drawer>
      <nuxt-page />
    </main>
  </div>
</template>
<style lang="postcss">
body {
  @apply min-h-screen;
  background-color: var(--ui-background-color);
}

#site {
  @apply min-h-screen flex flex-col;

  >main {
    @apply flex-1;
  }
}

header.appbar {
  @apply bg-gray-900 text-white;
}
</style>