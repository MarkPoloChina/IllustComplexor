<template>
  <div class="table-container">
    <el-table
      :data="tableData"
      height="100%"
      class="table"
      ref="table"
      :flexible="true"
      highlight-current-row
      v-loading="loading"
      @current-change="handleCurrentChange"
      @select="handleSelect"
      @select-all="handleSelectAll"
      @row-contextmenu="handleContextDeteched"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="remote_base.name" label="类型" :min-width="80" />
      <el-table-column prop="meta.pid" label="PID" :min-width="120" />
      <el-table-column prop="meta.page" label="页号" :min-width="50" />
      <el-table-column label="标题/末端" :min-width="280" show-overflow-tooltip>
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
import { watch, ref } from "vue";

const table = ref();
// eslint-disable-next-line no-undef
const props = defineProps({
  tableData: Array,
  loading: Boolean,
  currentSelected: Object,
});
// eslint-disable-next-line no-undef
const emits = defineEmits(["select-change", "popup-context"]);
watch(
  () => props.tableData,
  (val) => {
    val.forEach((ele) => {
      table.value.toggleRowSelection(ele, !!ele.checked);
    });
  },
  {
    deep: true,
    immediate: true,
  }
);
watch(
  () => props.tableData,
  () => {
    table.value.setScrollTop(0);
  },
  {
    deep: false,
  }
);
watch(
  () => props.currentSelected,
  (val) => {
    if (!val) return;
    table.value.setCurrentRow(val);
  },
  {
    deep: false,
  }
);
const handleCurrentChange = (val) => {
  emits("select-change", val);
};
const handleContextDeteched = (row) => {
  emits("popup-context", row);
};
const handleSelect = (selection, row) => {
  row.checked = selection.length != 0;
};
const handleSelectAll = (selection) => {
  props.tableData.forEach((item) => {
    item.checked = selection.length != 0;
  });
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
