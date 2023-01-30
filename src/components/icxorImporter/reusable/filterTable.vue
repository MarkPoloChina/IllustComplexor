<template>
  <el-auto-resizer style="height: 350px">
    <template #default="{ height, width }">
      <el-table-v2
        :columns="columns"
        :data="writableList"
        :height="height"
        :width="width"
        :sort-by="sortState"
        :row-class="
          ({ rowIndex }) => {
            switch (writableList[rowIndex].status) {
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
              default:
                return '';
            }
          }
        "
        @column-sort="onSort"
      >
        <template #overlay v-if="loading">
          <div
            class="el-loading-mask"
            style="display: flex; align-items: center; justify-content: center"
          >
            <el-icon
              class="is-loading"
              color="var(--el-color-primary)"
              :size="26"
            >
              <loading-icon />
            </el-icon>
          </div>
        </template>
      </el-table-v2>
    </template>
  </el-auto-resizer>
</template>
<script setup>
import { Loading as LoadingIcon } from "@element-plus/icons-vue";
import { ref, computed } from "vue";
import { ElCheckbox, TableV2SortOrder } from "element-plus";

// eslint-disable-next-line no-undef
const props = defineProps({
  loading: Boolean,
  list: Array,
  selected: Array,
});
const writableList = computed({
  get: () => {
    let l = [];
    l.push(...props.list);
    return l;
  },
  set: () => {},
});
const selections = ref([]);
// eslint-disable-next-line no-undef
const emit = defineEmits(["update:selected"]);
const handleSelectionChange = () => {
  emit("update:selected", selections.value);
};
const clearSelection = () => {
  writableList.value.forEach((log) => {
    log.checked = false;
  });
  selections.value.length = 0;
};

const SelectionCell = ({ value, intermediate = false, onChange, disabled }) => {
  return (
    <ElCheckbox
      onChange={onChange}
      modelValue={value}
      indeterminate={intermediate}
      disabled={disabled}
    />
  );
};

const columns = [
  {
    key: "selection",
    width: 50,
    cellRenderer: ({ rowData }) => {
      const onChange = (value) => {
        if (rowData.status == "ready" || rowData.status == "conflict") {
          if (value) selections.value.push(rowData.oriIdx);
          else
            selections.value.splice(
              selections.value.indexOf(rowData.oriIdx),
              1
            );
          rowData.checked = value;
          handleSelectionChange();
        }
      };
      return (
        <SelectionCell
          value={rowData.checked}
          onChange={onChange}
          disabled={rowData.status != "ready" && rowData.status != "conflict"}
        />
      );
    },

    headerCellRenderer: () => {
      const onChange = (value) => {
        selections.value.length = 0;
        writableList.value.forEach((log) => {
          if (log.status == "ready" || log.status == "conflict") {
            log.checked = value;
            if (value) selections.value.push(log.oriIdx);
          }
        });
        handleSelectionChange();
      };
      const allSelected = writableList.value.every((row) => row.checked);
      const containsChecked = writableList.value.some((row) => row.checked);

      return (
        <SelectionCell
          value={allSelected}
          intermediate={containsChecked && !allSelected}
          onChange={onChange}
        />
      );
    },
  },
  {
    key: "filename",
    title: "文件名",
    width: 350,
    dataKey: "filename",
  },
  {
    key: "status",
    title: "状态",
    width: 100,
    dataKey: "status",
    sortable: true,
  },
  {
    key: "message",
    title: "说明",
    width: 500,
    dataKey: "message",
  },
];
const sortState = ref({
  key: "status",
  order: TableV2SortOrder.ASC,
});
const onSort = (sortBy) => {
  writableList.value.sort((a, b) => {
    return sortBy.order == TableV2SortOrder.ASC
      ? a[sortBy.key].localeCompare(b[sortBy.key])
      : b[sortBy.key].localeCompare(a[sortBy.key]);
  });
  sortState.value = sortBy;
};
// eslint-disable-next-line no-undef
defineExpose({ clearSelection });
</script>
<style lang="scss" scoped>
:deep(.warning-row) {
  background-color: var(--el-color-warning-light-9);
}
:deep(.success-row) {
  background-color: var(--el-color-success-light-9);
}
:deep(.danger-row) {
  background-color: var(--el-color-danger-light-9);
}
</style>
