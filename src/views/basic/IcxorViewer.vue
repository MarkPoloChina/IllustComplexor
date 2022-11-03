<template>
  <div class="viewer-container">
    <div class="title">视图</div>
  </div>
</template>
<script setup></script>
<style lang="scss" scoped>
.viewer-container {
  @include Uni-Main-Container;
  .title {
    @include Uni-Main-Title;
  }
  .tabs {
    padding: 0 10px 0 10px;
    height: 100%;
    position: relative;
    :deep(.el-tab-pane) {
      height: 100%;
    }
    :deep(.el-tabs__content) {
      height: calc(100% - 50px);
    }
  }
}
</style>
