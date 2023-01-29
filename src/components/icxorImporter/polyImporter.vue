<template>
  <div>
    <el-alert type="info" show-icon :closable="false">
      <template #title>
        识别Pixiv规则的文件名, 匹配对应的PID和Page, 然后生成聚合。
      </template>
    </el-alert>
    <div class="import-area">
      <div class="title-block">导入选项</div>
      <div class="form-block">
        <el-form :model="importOption" label-width="100px" style="width: 100%">
          <el-form-item label="导入类型">
            <el-radio-group v-model="importOption.importType">
              <el-radio label="directory">文件夹</el-radio>
              <el-radio label="files">文件</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="路径"
            v-if="importOption.importType == 'directory'"
          >
            <el-row :gutter="20" style="width: 100%">
              <el-col :span="6"
                ><el-button @click="getDirectory">选择文件夹</el-button>
              </el-col>
              <el-col :span="18">
                <el-input :modelValue="importOption.pathDir" disabled />
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="路径" v-else>
            <el-row :gutter="20" style="width: 100%">
              <el-col :span="6">
                <el-button @click="getFile">选择文件</el-button>
              </el-col>
              <el-col :span="18">
                <el-input
                  :modelValue="importOption.paths.toString()"
                  disabled
                />
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item>
            <el-button @click="showDialog = true">聚合设置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="result-area">
      <div class="title-block">筛选器</div>
      <FilterTable
        ref="table"
        :list="log.list"
        v-model:selected="selectedList"
      ></FilterTable>
    </div>
    <div class="btn-block">
      <el-button
        @click="startAction"
        type="primary"
        :icon="Download"
        circle
      ></el-button>
      <el-button
        v-if="selectedList.length != 0"
        @click="handleUpload"
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
    <PolyForm
      v-model="showDialog"
      @confirm="updateInfo"
      ref="polyForm"
      type="pixiv"
    ></PolyForm>
  </div>
</template>
<script setup>
import { FilenameAdapter } from "@/js/util/filename";
import { Check, Remove, Download } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { reactive, ref } from "vue";
import FilterTable from "./reusable/filterTable.vue";
import { API } from "@/api/api";
import PolyForm from "../reusable/polyForm.vue";
const remote = require("@electron/remote");

const log = reactive({ message: "", list: [] });
const idto = ref([]);
const selectedList = ref([]);
const table = ref();
const polyForm = ref()
const showDialog = ref(false);

const initTab = () => {
  importOption.importType = "directory";
  importOption.paths = [];
  importOption.pathDir = "";
  log.list.length = 0;
  log.message = "";
  selectedList.value.length = 0;
  idto.value.length = 0;
  polyForm.value.initForm()
};
const importOption = reactive({
  paths: [""],
  pathDir: "",
  importType: "directory",
  poly: {},
});
const getDirectory = async () => {
  let _path = "";
  _path = (
    await remote.dialog.showOpenDialog({
      properties: ["openDirectory"],
    })
  ).filePaths[0];
  if (!_path) return;
  else importOption.pathDir = _path;
};
const getFile = async () => {
  let _path = [];
  _path = (
    await remote.dialog.showOpenDialog({
      properties: ["openFile", "multiSelections"],
      filters: [{ name: "Images", extensions: ["jpg", "png", "gif"] }],
    })
  ).filePaths;
  if (_path.length == 0) return;
  else importOption.paths = _path;
};
const startAction = async () => {
  if (
    (importOption.importType == "directory" && importOption.pathDir == "") ||
    (importOption.importType == "files" && importOption.paths.length == 0)
  ) {
    ElMessage.error("路径非法");
    return;
  }
  const paths =
    importOption.importType == "directory"
      ? FilenameAdapter.parseBaseFilenamesFromDirectory(importOption.pathDir)
      : importOption.paths;
  ElMessage.info("开始收集信息");
  const resp = await FilenameAdapter.getPixivDtoSet(paths);
  ElMessage.info(`信息收集完成，共${resp.dto.length}条有效数据`);
  log.list = resp.log;
  idto.value = resp.dto;
};
const handleUpload = () => {
  if (importOption.poly.name == "") {
    ElMessage.error("至少应当填写聚合名");
    return;
  }
  let dto = [];
  selectedList.value.forEach((ele) => {
    const i = idto.value.find((value) => {
      return value.bid == ele;
    });
    if (i) dto.push(i);
  });
  API.addPolyByMatch(
    importOption.poly.type,
    importOption.poly.parent,
    importOption.poly.name,
    dto
  ).then((data) => {
    if (data.code == 200000) {
      ElMessage.info("处理完成");
      data.data.forEach((item) => {
        const f = log.list.find((_item) => {
          return _item.bid == item.bid;
        });
        if (f) {
          f.status = item.status;
          f.message = item.message;
        }
      });
      selectedList.value.length = 0;
      table.value.clearSelection();
    }
  });
};
const updateInfo = ({ data }) => {
  importOption.poly = { ...importOption.poly, ...data };
};
</script>
<style lang="scss" scoped>
.import-area {
  padding: 0 10px 0 10px;
  .form-block {
    @include Flex-C-AC;
  }
}
.result-area {
  padding: 0 10px 0 10px;
  .warning-row {
    background-color: var(--el-color-warning-light-9);
  }
  .success-row {
    background-color: var(--el-color-success-light-9);
  }
}
.btn-block {
  margin-top: 20px;
  @include Flex-R-AC;
}
.title-block {
  padding: 10px 0 10px 0;
  font-size: 18px;
  color: $color-greengray-1;
}
</style>
