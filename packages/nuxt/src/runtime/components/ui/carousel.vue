<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, provide } from "vue";

const props = withDefaults(defineProps<{
  /** The interval between each slide (in milliseconds) */
  interval: number;
}>(), {
  interval: 5000,
});


provide('container', 'ui-carousel');

let scroller: NodeJS.Timeout;
const container = ref<HTMLElement>();
const activeIndex = ref(0);

/** Slide to the given index */
const slideTo = (index: number) => {
  if (container.value) {
    if (index < container.value.children.length) {
      const targetElement = container.value.children[index] as HTMLElement;
      container.value.scrollTo({
        left: targetElement.offsetLeft,
        behavior: 'smooth',
      });
      activeIndex.value = index;
    } else {
      container.value.scrollTo({
        left: 0,
        behavior: 'smooth',
      });
      activeIndex.value = 0;
    }
  }
};
const slideToNext = () => slideTo(activeIndex.value + 1);

/** Pause the carousel */
const pause = () => {
  clearInterval(scroller);
};

/** Resume the carousel */
const resume = () => {
  scroller = setInterval(slideToNext, props.interval);
};

/** Update the active index based on the scroll position */
const updateActiveIndex = () => {
  if (container.value) {
    const currentIndex = Array.from(container.value!.children).findIndex(
      (el, index) => (el as HTMLElement).offsetLeft <= container.value!.scrollLeft &&
        container.value!.scrollLeft < (container.value!.children[index + 1] as HTMLElement)?.offsetLeft
    );
    if (currentIndex !== -1) {
      activeIndex.value = currentIndex;
    }
  }
};

onMounted(() => {
  if (container.value) {
    container.value.addEventListener('scroll', updateActiveIndex);
    resume();
  }
});
onBeforeUnmount(() => {
  clearInterval(scroller);
  if (container.value) {
    container.value.removeEventListener('scroll', updateActiveIndex);
  }
});

defineExpose({ pause, resume, slideTo });
</script>
<template>
  <section class="ui carousel" aria-roledescription="carousel">
    <slot />
  </section>
</template>
<style>
.ui.carousel {
  width: 100%;
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;

  >* {
    scroll-snap-align: center;
    background-size: cover;
  }
}
</style>