<template>
  <div class="home-container">
    <div class="title">主页</div>
  </div>
</template>
<script setup></script>
<style lang="scss" scoped>
.home-container {
  width: calc(100% - 20px);
  height: calc(100% - 10px);
  padding: 10px 10px 0 10px;
  overflow: hidden;
  @include Flex-C-CT;
  .title {
    padding: 10px;
    font-size: 24px;
    font-weight: bold;
    color: $color-greengray-1;
  }
}
</style>
