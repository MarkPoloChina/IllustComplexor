<template>
  <el-auto-resizer>
    <template #default="{ height, width }">
      <el-table-v2
        :columns="columns"
        :data="writableList"
        :height="height"
        :width="width"
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
        <template #empty>
          <el-empty :image-size="120" />
        </template>
      </el-table-v2>
    </template>
  </el-auto-resizer>
</template>
<script setup>
import { Loading as LoadingIcon, Filter } from "@element-plus/icons-vue";
import { ref, computed, reactive } from "vue";
import { ElCheckbox, ElButton, ElIcon, ElPopover } from "element-plus";

// eslint-disable-next-line no-undef
const props = defineProps({
  loading: Boolean,
  list: Array,
  selected: Array,
});
const writableList = computed({
  get: () => {
    let l = [];
    let f = [];
    Object.keys(shouldFilter).forEach((key) => {
      if (shouldFilter[key]) f.push(key);
    });
    props.list.forEach((ele) => {
      if (f.includes(ele.status)) l.push(ele);
    });
    return l;
  },
  set: () => {},
});
const shouldFilter = reactive({
  ready: true,
  conflict: true,
  ignore: true,
  success: true,
  fault: true,
});

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
          rowData.checked = value;
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
        writableList.value.forEach((log) => {
          if (log.status == "ready" || log.status == "conflict") {
            log.checked = value;
          }
        });
      };
      const allSelected =
        writableList.value.every((row) => row.checked) &&
        writableList.value.length != 0;
      const containsChecked = writableList.value.some((row) => row.checked);
      const isDisabled = writableList.value.length == 0;

      return (
        <SelectionCell
          value={allSelected}
          intermediate={containsChecked && !allSelected}
          onChange={onChange}
          disabled={isDisabled}
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
    headerCellRenderer: (props) => {
      return (
        <div style="display:flex;align-items:center;justify-content:center;">
          <span style="margin-right:0.5rem;font-size:0.75rem;line-height:1rem;">
            {props.column.title}
          </span>
          <ElPopover ref={popoverRef} trigger="click" {...{ width: 150 }}>
            {{
              default: () => (
                <div class="filter-wrapper">
                  <div class="filter-group">
                    <ElCheckbox v-model={shouldFilter.ready}>Ready</ElCheckbox>
                    <ElCheckbox v-model={shouldFilter.conflict}>
                      Conflict
                    </ElCheckbox>
                    <ElCheckbox v-model={shouldFilter.ignore}>
                      Ignore
                    </ElCheckbox>
                    <ElCheckbox v-model={shouldFilter.success}>
                      Success
                    </ElCheckbox>
                    <ElCheckbox v-model={shouldFilter.fault}>Fault</ElCheckbox>
                  </div>
                  <div style="border-top: 1px solid #4C4D4F;margin: 12px -12px -12px;padding: 0 12px;display: flex;justify-content: center;">
                    <ElButton text onClick={onReset}>
                      Reset
                    </ElButton>
                  </div>
                </div>
              ),
              reference: () => (
                <ElIcon style="cursor:pointer;">
                  <Filter />
                </ElIcon>
              ),
            }}
          </ElPopover>
        </div>
      );
    },
  },
  {
    key: "message",
    title: "说明",
    width: 500,
    dataKey: "message",
  },
];
const popoverRef = ref();

const onReset = () => {
  Object.keys(shouldFilter).forEach((key) => {
    shouldFilter[key] = true;
  });
};

// eslint-disable-next-line no-undef
defineExpose({ onReset });
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
