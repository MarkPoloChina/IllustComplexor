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
      <el-table-column label="标题" :min-width="280" show-overflow-tooltip>
        <template #default="scope">
          {{
            scope.row.meta ? scope.row.meta.title : scope.row.remote_endpoint
          }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script setup>
import { onMounted, ref } from "vue";

const currentSelected = ref([]);
const currentRow = ref();
const table = ref();
// eslint-disable-next-line no-undef
defineProps({
  tableData: Array,
});
// eslint-disable-next-line no-undef
const emits = defineEmits(["select-change", "selects-change"]);
const resetScroll = () => {
  table.value.setScrollTop(0);
};
onMounted(() => {});
const handleSelectionChange = (val) => {
  currentSelected.value = val;
};
const handleCurrentChange = (val) => {
  currentRow.value = val;
  emits("select-change", val);
};
// eslint-disable-next-line no-undef
defineExpose({ resetScroll });
</script>
<style lang="scss" scoped>
.table-container {
  height: 100%;
  .table {
    border-radius: 5px;
  }
}
</style>
