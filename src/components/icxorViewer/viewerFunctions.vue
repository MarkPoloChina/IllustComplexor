<template>
  <div class="viewer-func">
    <div class="viewer-controller">
      <el-radio-group
        v-model="viewerController.type"
        @change="viewerTypeChange"
      >
        <el-radio label="grid">网格</el-radio>
        <el-radio label="table">表格</el-radio>
        <el-radio label="focus">聚焦</el-radio>
      </el-radio-group>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="illustCount"
        :page-size="100"
        :pager-count="5"
        small
        hide-on-single-page
        @current-change="handlePageChange"
      />
    </div>
    <div class="viewer-function">
      <el-button-group>
        <el-button type="primary" :icon="ArrowLeftBold" size="small" />
        <el-button type="primary" :icon="ArrowRightBold" size="small" />
      </el-button-group>
      <!-- <el-button
        :icon="show ? ArrowLeftBold : ArrowRightBold"
        circle
        @click="show ^= true"
      /> -->
    </div>
  </div>
</template>
<script setup>
import { ArrowLeftBold, ArrowRightBold } from "@element-plus/icons-vue";
import { reactive } from "vue";

const viewerController = reactive({
  type: "table",
});
// eslint-disable-next-line no-undef
const emit = defineEmits(["pageChange", "viewerTypeChange"]);
// eslint-disable-next-line no-undef
defineProps({
  illustCount: Number,
});
const handlePageChange = (val) => {
  emit("pageChange", val);
};
const viewerTypeChange = (val) => {
  emit("viewerTypeChange", val);
};
</script>
<style lang="scss" scoped>
.viewer-func {
  width: 100%;
  .viewer-controller {
    width: 100%;
    margin-bottom: 10px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    :deep(.el-radio) {
      margin-right: 10px;
    }
  }
}
</style>
