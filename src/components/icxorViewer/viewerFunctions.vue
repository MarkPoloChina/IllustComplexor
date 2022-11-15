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
      <el-button-group
        v-if="viewerController.type == 'focus'"
        style="margin-right: 5px"
      >
        <el-button
          type="primary"
          :icon="ArrowLeftBold"
          size="small"
          @click="emit('focusDown')"
        />
        <el-button
          type="primary"
          :icon="ArrowRightBold"
          size="small"
          @click="emit('focusUp')"
        />
      </el-button-group>
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
      <el-rate v-model="curStarNum" v-if="hasSelected" />
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
import { computed, reactive } from "vue";

const viewerController = reactive({
  type: "table",
});
const curStarNum = computed({
  get() {
    return props.curStar;
  },
  set(v) {
    emit("curStarChange", v);
  },
});
// eslint-disable-next-line no-undef
const emit = defineEmits([
  "pageChange",
  "viewerTypeChange",
  "curStarChange",
  "focusUp",
  "focusDown",
]);
// eslint-disable-next-line no-undef
const props = defineProps({
  illustCount: Number,
  curStar: Number,
  hasSelected: Boolean,
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
  .viewer-function {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
  }
}
</style>
