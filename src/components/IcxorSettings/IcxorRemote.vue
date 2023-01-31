<template>
  <div class="config">
    <div class="title-block">远程基</div>
    <div class="form-block"></div>
    <div class="btn-block">
      <el-button
        @click="commit"
        type="success"
        :icon="Check"
        circle
      ></el-button>
      <el-button
        @click="revoke"
        type="danger"
        :icon="Remove"
        circle
      ></el-button>
    </div>
  </div>
</template>
<script setup>
import { Check, Remove } from "@element-plus/icons-vue";
import { onMounted } from "vue";

onMounted(() => {
  initForm();
});
const initForm = () => {};
const commit = () => {};
const revoke = () => {
  initForm();
};
</script>
<style lang="scss" scoped>
.config {
  @include Flex-C;
  height: calc(100% - 20px);
  .title-block {
    padding: 10px 0 10px 0;
    font-size: 18px;
    color: $color-greengray-1;
  }
  .form-block {
    @include Flex-C-AC;
  }
  .btn-block {
    @include Flex-R-JC;
    margin-top: auto;
  }
}
</style>
