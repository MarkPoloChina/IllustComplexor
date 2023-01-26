<template>
  <div>
    <el-alert type="info" show-icon :closable="false">
      <template #title>
        从时间线中导出符合条件的插图到指定文件夹，但是不会自动定义副本。
      </template>
    </el-alert>
    <div class="export-area">
      <div class="title-block">导出选项</div>
      <div class="form-block">
        <el-form :model="exportOption" label-width="100px" style="width: 100%">
          <el-form-item label="筛选时间源">
            <el-select
              v-model="exportOption.source"
              placeholder="选择数据源来自何时间线"
            >
              <el-option
                v-for="item in sourceEnum"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="筛选评级">
            <el-select
              v-model="exportOption.star"
              placeholder="选择指定的评级，可多选"
              multiple
            >
              <el-option
                v-for="item in [
                  { value: 'empty', label: '未指定' },
                  { value: '1', label: '1星' },
                  { value: '2', label: '2星' },
                  { value: '3', label: '3星' },
                  { value: '4', label: '4星' },
                  { value: '5', label: '5星' },
                ]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="导出到">
            <el-button @click="getDirectory">选择文件夹</el-button>
            <el-input :modelValue="exportOption.paths[0]" disabled />
          </el-form-item>
          <el-form-item label="命名风格">
            <el-radio-group v-model="exportOption.nameStyle">
              <el-radio label="std">Pixiv Web STD</el-radio>
              <el-radio label="pxder">Pxder</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <div class="btn-block">
        <el-button
          @click="startExport"
          type="success"
          :icon="Check"
          circle
        ></el-button>
        <el-button
          @click="initTab"
          type="danger"
          :icon="Remove"
          circle
        ></el-button>
      </div>
    </div>
    <div class="result-area">
      <div class="title-block">结果</div>
      <el-progress
        style="margin: 0 0 10px 0"
        :text-inside="true"
        :stroke-width="20"
        :percentage="progress == -1 ? 100 : progress"
        :status="
          progress == -1 ? 'exception' : progress == 100 ? 'success' : ''
        "
      />
      <div>{{ log.message }}</div>
      <el-table
        :data="log.list"
        height="250"
        style="width: 100%"
        :row-class-name="
          ({ row }) => {
            if (row.status == 'ignore') return 'warning-row';
            else return 'success-row';
          }
        "
      >
        <el-table-column prop="filename" label="文件名" width="350" />
        <el-table-column prop="status" label="状态" width="100" />
        <el-table-column prop="reason" label="原因" />
      </el-table>
    </div>
  </div>
</template>
<script setup>
import { Check, Remove } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { onMounted, reactive, ref } from "vue";

const remote = require("@electron/remote");

const log = reactive({ message: "", list: [] });
const progress = ref(0);
const initTab = () => {
  exportOption.paths = [""];
  exportOption.source = "";
  exportOption.star = [];
  exportOption.nameStyle = "";
};
const exportOption = reactive({
  paths: [""],
  source: "",
  star: [],
  nameStyle: "",
});
const getDirectory = async () => {
  let _path = "";
  _path = (
    await remote.dialog.showOpenDialog({
      properties: ["openDirectory"],
    })
  ).filePaths[0];
  if (!_path) return;
  else exportOption.paths[0] = _path;
};
const sourceEnum = reactive([]);
const timeline = reactive([]);
const startExport = () => {
  if (
    !exportOption.paths[0] ||
    exportOption.paths[0] == "" ||
    exportOption.nameStyle == "" ||
    exportOption.star.length == 0
  ) {
    ElMessage.error("路径非法或参数缺失");
    return;
  }
  let urls = [];
  timeline.forEach((item) => {
    if (item.time == exportOption.source) {
      item.list.forEach((_item) => {
        if (
          (exportOption.star.findIndex((item) => {
            return item == "empty";
          }) != -1 &&
            !_item.star) ||
          exportOption.star.findIndex((item) => {
            return item == _item.star;
          }) != -1
        ) {
          urls.push(_item.url);
        }
      });
    }
  });
  // FileTransfer.copyFilesTo(
  //   urls,
  //   exportOption.paths[0],
  //   exportOption.nameStyle,
  //   progress
  // )
  //   .then((resp) => {
  //     if (resp.status === 200) {
  //       log.message = resp.message;
  //       log.list = [];
  //     }
  //   })
  //   .catch((resp) => {
  //     log.message = resp.message;
  //   });
};
const loadSourceFromTimeline = () => {
  // let list = FilesEnum.getTimelineEnum();
  // list
  //   .sort((a, b) => {
  //     return b.time - a.time;
  //   })
  //   .forEach((item) => {
  //     timeline.push({ ...item });
  //     sourceEnum.push({ value: item.time, label: item.time });
  //   });
};
onMounted(() => {
  loadSourceFromTimeline();
});
</script>
<style lang="scss" scoped>
.export-area {
  .form-block {
    @include Flex-C-AC;
  }
  .btn-block {
    @include Flex-R-AC;
  }
}
.result-area {
  padding: 0 10px 0 10px;
  :deep(.warning-row) {
    background-color: var(--el-color-warning-light-9);
  }
  :deep(.success-row) {
    background-color: var(--el-color-success-light-9);
  }
}
.title-block {
  padding: 10px 0 10px 0;
  font-size: 18px;
  color: $color-greengray-1;
}
</style>
