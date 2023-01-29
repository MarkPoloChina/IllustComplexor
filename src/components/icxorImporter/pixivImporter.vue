<template>
  <div>
    <el-alert type="info" show-icon :closable="false">
      <template #title>
        识别Pixiv规则的文件名, 匹配对应的PID和Page,
        然后导入或更新对应Illust。同时注入标题等元数据, 也可附加元数据。
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
          <el-form-item label="策略">
            <el-radio-group v-model="importOption.importPolicy">
              <el-radio label="add">增加</el-radio>
              <el-radio label="modify">更新</el-radio>
              <el-radio label="cover">覆盖</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button @click="showDialog = true">附加元</el-button>
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
  </div>
  <MetaForm
    v-model="showDialog"
    @confirm="updateInfo"
    :disableChangeAuto="log.list.length != 0"
    ref="metaForm"
    type="pixiv"
  ></MetaForm>
</template>
<script setup>
import { Check, Remove, Download } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { FilenameAdapter } from "@/js/util/filename";
import { reactive, ref } from "vue";
import { API } from "@/api/api";
import MetaForm from "../reusable/metaForm.vue";
import FilterTable from "./reusable/filterTable.vue";

const remote = require("@electron/remote");
const log = reactive({ message: "", list: [] });
const idto = ref([]);
const selectedList = ref([]);
const showDialog = ref(false);
const autoKeys = ref([]);
const metaForm = ref();
const table = ref();
const initTab = () => {
  importOption.importType = "directory";
  importOption.importPolicy = "add";
  importOption.paths = [];
  importOption.pathDir = "";
  importOption.addition = { meta: {} };
  log.list.length = 0;
  log.message = "";
  selectedList.value.length = 0;
  idto.value.length = 0;
  autoKeys.value.length = 0;
  metaForm.value.initForm();
};
const importOption = reactive({
  paths: [],
  pathDir: "",
  importType: "directory",
  importPolicy: "add",
  addition: { meta: {} },
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
  const resp = await FilenameAdapter.getPixivDtoList(paths, autoKeys.value);
  ElMessage.info(`信息收集完成，共${resp.dto.length}条有效数据`);
  log.list = resp.log;
  idto.value = resp.dto;
};
const checkIfNoConflict = () => {
  for (let idx of selectedList.value) {
    const ti = log.list.findIndex((value) => {
      return value.bid == idx;
    });
    if (
      ti !== -1 &&
      log.list[ti].status == "conflict" &&
      selectedList.value.findIndex((value) => {
        return value == log.list[ti].compareBid;
      }) != -1
    )
      return false;
  }
  return true;
};
const handleUpload = () => {
  if (!checkIfNoConflict()) {
    ElMessage.error("尚有冲突未解决");
    return;
  }
  let dto = [];
  selectedList.value.forEach((ele) => {
    const i = idto.value.find((value) => {
      return value.bid == ele;
    });
    if (i)
      dto.push({
        bid: i.bid,
        type: "pixiv",
        ...importOption.addition,
        meta: { ...importOption.addition.meta, ...i.meta },
      });
  });
  const finAction = (data) => {
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
  };
  switch (importOption.importPolicy) {
    case "add":
      API.newIllusts(dto).then((data) => {
        finAction(data);
      });
      break;
    case "modify":
      API.updateIllustsByMatch(dto).then((data) => {
        finAction(data);
      });
      break;
    case "cover":
      API.coverIllustsByMatch(dto).then((data) => {
        finAction(data);
      });
      break;
    default:
      break;
  }
};
const updateInfo = ({ data, controller }) => {
  importOption.addition = { ...importOption.addition, ...data };
  autoKeys.value.push(...controller);
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
