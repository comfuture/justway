<template>
  <nav class="ui breadcrumb" aria-label="Breadcrumb">
    <ol>
      <li><a href="/">Home</a></li>
      <li><a href="/about">About</a></li>
      <li aria-current="page">Current Page</li>
    </ol>
  </nav>
</template>
<style>
nav.ui.breadcrumb {
  padding: 0.5rem 0;

  ol {
    margin: 0;
    padding-left: 0;
    list-style: none;

    li {
      display: inline;

      &+li::before {
        display: inline-block;
        margin: 0 0.5em;
        transform: rotate(15deg);
        border-right: 0.1em solid currentcolor;
        height: 0.8em;
        content: "";
      }
    }
  }

  [aria-current="page"] {
    font-weight: 700;
    text-decoration: none;
  }
}
</style>