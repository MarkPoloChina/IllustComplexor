<template>
  <div class="importer-main">
    <el-alert type="info" show-icon :closable="false" style="flex: none">
      <template #title>
        利用文件名人工创建Illust信息, 指向对应的Remote, 或者上传图片,
        也可附加元数据。
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
          <el-form-item label="基类型">
            <el-select
              v-model="importOption.addition.type"
              filterable
              allow-create
              placeholder="选择或填写类型"
            >
              <el-option
                v-for="item in typeEnum"
                :key="item.type"
                :label="item.type"
                :value="item.type"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button @click="showDialog2 = true">远程指向</el-button>
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
        :loading="loading"
        class="fliter-table"
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
    ref="metaForm"
    type="other"
  ></MetaForm>
  <RemoteForm
    v-model="showDialog2"
    @confirm="updateInfo"
    ref="remoteForm"
  ></RemoteForm>
</template>
<script setup>
import { Check, Remove, Download } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { FilenameAdapter } from "@/js/util/filename";
import { reactive, ref, onMounted } from "vue";
import MetaForm from "../reusable/metaForm.vue";
import RemoteForm from "../reusable/remoteForm.vue";
import FilterTable from "./reusable/filterTable.vue";
import { API } from "@/api/api";

const remote = require("@electron/remote");
const typeEnum = ref([]);
const log = reactive({ message: "", list: [] });
const showDialog = ref(false);
const showDialog2 = ref(false);
const metaForm = ref();
const remoteForm = ref();
const table = ref();
const loading = ref(false);
const initTab = () => {
  importOption.importType = "directory";
  importOption.paths = [];
  importOption.pathDir = "";
  importOption.addition = { type: "" };
  log.list.length = 0;
  log.message = "";
  metaForm.value.initForm();
  remoteForm.value.initForm();
};
onMounted(() => {
  getEnumType();
});
const importOption = reactive({
  paths: [],
  pathDir: "",
  importType: "directory",
  addition: { type: "" },
});
const getEnumType = async () => {
  const data = await API.getEnumSource();
  typeEnum.value = data;
};
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
  ElMessage.info("开始收集信息");
  loading.value = true;
  const process = async (paths) => {
    const resp = await FilenameAdapter.getOtherDtoSet(paths);
    ElMessage.info(`信息收集完成，共${resp.length}条数据`);
    loading.value = false;
    log.list = resp;
  };
  if (importOption.importType == "directory") {
    FilenameAdapter.parseBaseFilenamesFromDirectoryAsync(
      importOption.pathDir
    ).then((paths) => {
      process(paths);
    });
  } else process(importOption.paths);
};
const handleUpload = () => {
  if (!importOption.addition.type || importOption.addition.type == "") {
    ElMessage.error("必须选择或填写类型");
    return;
  }
  let selectedList = [];
  log.list.forEach((ele) => {
    if (ele.checked) selectedList.push(ele.oriIdx);
  });
  if (selectedList.length == 0) {
    ElMessage.error("未选择任何数据");
    return;
  }
  ElMessageBox.confirm(
    `将${selectedList.length}个项目进行上传，确认？`,
    "Warning",
    {
      confirmButtonText: "OK",
      cancelButtonText: "Cancel",
      type: "warning",
    }
  )
    .then(() => {
      let dto = [];
      selectedList.forEach((idx) => {
        dto.push({
          bid: idx,
          ...importOption.addition,
          remote_info: {
            ...importOption.addition.remote_info,
            ...log.list[idx].dto.remote_info,
          },
        });
      });
      API.newIllusts(dto).then((data) => {
        if (data.code == 200000) {
          ElMessage.info("处理完成");
          data.data.forEach((item) => {
            log.list[item.bid].status = item.status;
            log.list[item.bid].message = item.message;
          });
          log.list.forEach((ele) => {
            ele.checked = false;
          });
          table.value.onReset();
        }
      });
    })
    .catch(() => {});
};
const updateInfo = ({ data }) => {
  importOption.addition = { ...importOption.addition, ...data };
};
</script>
<style lang="scss" scoped>
.importer-main {
  height: 100%;
  @include Flex-C;
}
.import-area {
  padding: 0 10px 0 10px;
  flex: none;
  .form-block {
    @include Flex-C-AC;
  }
}
.result-area {
  padding: 0 10px 0 10px;
  flex: auto;
  overflow: hidden;
  .fliter-table {
    height: calc(100% - 45px) !important;
    width: 100%;
  }
}
.btn-block {
  margin: 10px 0 5px 0;
  flex: none;
  @include Flex-R-JC;
  .el-button + .el-button {
    margin-left: 30px;
  }
}
.title-block {
  padding: 10px 0 10px 0;
  font-size: 18px;
  color: $color-greengray-1;
}
</style>
