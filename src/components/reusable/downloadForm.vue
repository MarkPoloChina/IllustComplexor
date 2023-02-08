<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      title="下载表单"
      width="80%"
      @close="handleClose"
    >
      <el-form :model="downloadOption" label-width="100px" style="width: 100%">
        <el-form-item label="路径">
          <el-row :gutter="20" style="width: 100%">
            <el-col :span="6"
              ><el-button @click="getDirectory">选择文件夹</el-button>
            </el-col>
            <el-col :span="18">
              <el-input :modelValue="downloadOption.pathDir" disabled />
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <el-progress
        style="width: 100%; margin-bottom: 10px"
        :text-inside="true"
        :stroke-width="24"
        :percentage="progress"
        :status="progress == 100 ? 'success' : ''"
      />
      <el-table
        ref="table"
        :data="writableList"
        :height="300"
        style="width: 100%"
        class="fliter-table"
      >
        <el-table-column
          prop="id"
          label="PID"
          width="100"
          show-overflow-tooltip
        />
        <el-table-column
          prop="type"
          label="类型"
          width="100"
          show-overflow-tooltip
        />
        <el-table-column
          prop="meta.pid"
          label="PID"
          width="100"
          show-overflow-tooltip
        />
        <el-table-column label="标题/末端" show-overflow-tooltip>
          <template #default="scope">
            {{
              scope.row.meta ? scope.row.meta.title : scope.row.remote_endpoint
            }}
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">Cancel</el-button>
          <el-button type="primary" @click="handleDownload">
            Confirm
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { ElMessage } from "element-plus";
import { reactive, computed, ref } from "vue";
import { APIProxy } from "@/api/api";
import { UrlGenerator } from "@/js/util/path";
import { FileTransfer } from "@/js/util/file";
import { FilenameResolver } from "@/js/util/filename";
const remote = require("@electron/remote");

const downloadOption = reactive({
  pathDir: "",
});
const downloadCnt = ref(0);
const getDirectory = async () => {
  let _path = "";
  _path = (
    await remote.dialog.showOpenDialog({
      properties: ["openDirectory"],
    })
  ).filePaths[0];
  if (!_path) return;
  else downloadOption.pathDir = _path;
};
// eslint-disable-next-line no-undef
const props = defineProps({
  modelValue: Boolean,
  downloadList: Array,
});
// eslint-disable-next-line no-undef
const emit = defineEmits(["update:modelValue"]);
const dialogVisible = computed({
  get: () => {
    return props.modelValue;
  },
  set: (value) => {
    emit("update:modelValue", value);
  },
});
const writableList = computed({
  get: () => {
    return props.downloadList;
  },
  set: () => {},
});
const progress = computed(() => {
  return (downloadCnt.value / writableList.value.length) * 100;
});
const handleDownload = () => {
  if (writableList.value.length == 0) {
    ElMessage.error("未选定数据");
    return;
  }
  if (!downloadOption.pathDir) {
    ElMessage.error("路径非法");
    return;
  }
  downloadCnt.value = 0;
  for (const obj of writableList.value) {
    APIProxy.getLocalBlob(UrlGenerator.getBlobOriginUrl(obj)).then(
      ({ data, ext }) => {
        FileTransfer.saveArrayBufferTo(
          data,
          obj.type == "pixiv"
            ? FilenameResolver.generatePixivWebFilename(
                obj.meta.pid,
                obj.meta.page,
                ext
              )
            : obj.remote_endpoint,
          downloadOption.pathDir
        )
          .then(() => {})
          .catch((err) => {
            ElMessage.error(`第${downloadCnt.value}文件下载失败`);
            console.log(err);
          })
          .finally(() => {
            downloadCnt.value++;
          });
      }
    );
  }
};
const handleClose = () => {
  downloadCnt.value = 0;
  downloadOption.pathDir = "";
  dialogVisible.value = false;
};
</script>
<style lang="scss" scoped></style>
