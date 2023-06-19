<template>
<!-- 包含主要内容的盒子 -->
  <div class="wrapper">
      <div class="container">
        <slot></slot>
      </div>
  </div>
</template>

<script>
  export default {
    name: "Wrapper",
  }
</script>

<style scoped>
  .wrapper {
    background-color: #f3f3f3;
    min-height: 705px;
  }

  .container {
    width: 1000px;
    /* 水平居中 */
    position: relative;
    right: 0;
    left: 0;
    margin-left: auto;
    margin-right: auto;

    padding: 10px 0;
  }
</style>