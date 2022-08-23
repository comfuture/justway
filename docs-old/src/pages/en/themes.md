---
title: Themes
description: How to theme
layout: ../../layouts/MainLayout.astro
---

기본테마는 다음과 같습니다.
기본테마를 임포트 하고 몇몇 속성을 덮어쓰기 하거나 처음부터 새로운 테마를 기술하세요

```css
:root {
  --ui-primary-color: #6419E6;
  --ui-secondary-color: #D926A9;
  --ui-accent-color: #1FB2A6;
  --ui-natural-color: #191D24;
  --ui-link-color: #aaf;
  --ui-default-padding: 0.5rem;
  --ui-radius: 0.25rem;
  --ui-hover-brightness: 1.2;
  --ui-backdrop-blur: blur(3px);
  --ui-dialog-bg: white;
}
```

Vue Simple UI 의 대부분의 컴포넌트는 color, size 와 같은 색상 또는 텍스트 스타일링을 위한 속성을 제공하지 않습니다. 제한된 색상이나 규격화된 글 스타일에 묶이지 않도록 하기 위함입니다. 제공되는 기본 스타일을 커스터마이징 하기 위해서는 우리가 이미 익숙하게 다룰 수 있는 CSS 를 활용할 수 있습니다.


> 예) 모든 컴포넌트의 프라이머리 버튼의 배경색을 일괄 변경하려면 프로젝트에 다음과 같은 css 를 추가할 수 있습니다.

```css
:root {
  --ui-primary-color: #34568B;
}
```

또는 특정 영역안의 버튼들에 대해 직접 variation을 추가할 수 있습니다

```css
header.main .hero button.ui,
header.main .hero .button.ui {
  background-color: #34568B;
}
```

만약 tailwindcss 를 사용하는 프로젝트라면 더욱 간단해집니다.

```css
/* 오렌지색 pill button 스타일 */
button.ui.orange,
.ui.orange.button {
  @apply bg-yellow-600 text-white rounded-full;
}
```

단 하나의 버튼에 한해 스타일을 변경하고자 한다면 직접 class 또는 style 속성을 지정하면 됩니다.

```html
<button class="ui bg-green-600 text-xl">큰 녹색 버튼</button>
```

참 쉽죠?

더욱 편리한 점은, 스타일 덧쓰기를 위한 정의를 여러분이 좋아하는 익숙한 방법으로 기술할 수 있다는 점입니다. `sass`, `less`, `postcss` 등 원하는 css processor 를 사용해보세요.


원한다면 css 대신 자바스크립트 코드를 통해 테마를 동적으로 바꿀 수도 있습니다.

```js
const root = document.documentElement
root.style.setProperty('--ui-primary-color', '#eee')
root.style.setProperty('--ui-primary-bg', 'darkblue')
```

<script>
function changeTheme(name, value) {
  const root = document.documentElement
  root.style.setProperty(`--ui-${name}-color`, value)
}
</script>

<button class="ui" onclick="changeTheme('natural', '#ddd')">#ddd 테마 변경</button>
<button class="ui" onclick="changeTheme('natural', '#f00')">#f00 테마 변경</button>
