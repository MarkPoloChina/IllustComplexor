<template>
  <el-table
    :data="list"
    height="250"
    style="width: 100%"
    ref="table"
    :row-class-name="
      ({ row }) => {
        switch (row.status) {
          case 'ready':
            return 'success-row';
          case 'success':
            return 'success-row';
          case 'fault':
            return 'danger-row';
          case 'ignore':
            return 'danger-row';
          case 'conflict':
            return 'warning-row';
        }
      }
    "
    @selection-change="handleSelectionChange"
  >
    <el-table-column
      type="selection"
      width="55"
      :selectable="
        (row) => {
          return row.status == 'ready' || row.status == 'conflict';
        }
      "
    />

    <el-table-column prop="filename" label="文件名" width="350" />
    <el-table-column prop="status" label="状态" sortable width="100" />
    <el-table-column prop="message" label="说明" />
  </el-table>
</template>
<script setup>
import { ref } from "vue";

// eslint-disable-next-line no-undef
defineProps({
  list: Array,
  selected: Array,
});
const table = ref();
// eslint-disable-next-line no-undef
const emit = defineEmits(["update:selected"]);
const handleSelectionChange = (val) => {
  if (val) {
    let l = [];
    val.forEach((ele) => {
      l.push(ele.bid);
    });
    emit("update:selected", l);
  }
};
const clearSelection = () => {
  table.value.clearSelection();
};
// eslint-disable-next-line no-undef
defineExpose({ clearSelection });
</script>
<style lang="scss" scoped>
:deep(.warning-row) {
  --el-table-tr-bg-color: var(--el-color-warning-light-9);
}
:deep(.success-row) {
  --el-table-tr-bg-color: var(--el-color-success-light-9);
}
:deep(.danger-row) {
  --el-table-tr-bg-color: var(--el-color-danger-light-9);
}
</style>
