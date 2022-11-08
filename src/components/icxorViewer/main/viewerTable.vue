<template>
  <div class="table-container">
    <el-table
      :data="tableData"
      height="100%"
      class="table"
      ref="table"
      :flexible="true"
      highlight-current-row
      @current-change="handleCurrentChange"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="type" label="类型" :min-width="80" />
      <el-table-column prop="meta.pid" label="PID" :min-width="120" />
      <el-table-column prop="meta.page" label="页号" :min-width="50" />
      <el-table-column
        prop="meta.title"
        label="标题"
        :min-width="280"
        show-overflow-tooltip
      />
    </el-table>
  </div>
</template>
<script setup>
import { onMounted, ref, watch } from "vue";

const currentSelected = ref([]);
const currentRow = ref();
const table = ref();
// eslint-disable-next-line no-undef
const props = defineProps({
  tableData: Array,
});
watch(
  props.tableData,
  () => {
    console.log("jj");
    table.value.setScrollTop(0);
  },
  { deep: true }
);
onMounted(() => {});
const handleSelectionChange = (val) => {
  currentSelected.value = val;
};
const handleCurrentChange = (val) => {
  currentRow.value = val;
};
</script>
<style lang="scss" scoped>
.table-container {
  height: 100%;
  .table {
    border-radius: 5px;
  }
}
</style>
