<template>
  <div class="importer-main">
    <el-alert type="info" show-icon :closable="false" style="flex: none">
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
    :disableChangeAuto="log.list.length != 0"
    ref="metaForm"
    type="pixiv"
  ></MetaForm>
</template>
<script setup>
import { Check, Remove, Download } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { FilenameAdapter } from "@/js/util/filename";
import { reactive, ref } from "vue";
import { API } from "@/api/api";
import MetaForm from "../reusable/metaForm.vue";
import FilterTable from "./reusable/filterTable.vue";
import { ipcRenderer } from "electron";

const log = reactive({ message: "", list: [] });
const showDialog = ref(false);
const autoKeys = ref([]);
const metaForm = ref();
const table = ref();
const loading = ref(false);
const initTab = () => {
  importOption.importType = "directory";
  importOption.importPolicy = "add";
  importOption.paths = [];
  importOption.pathDir = "";
  importOption.addition = { meta: {} };
  log.list.length = 0;
  log.message = "";
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
  _path = await ipcRenderer.invoke("dialog:openDirectory");
  if (!_path) return;
  else importOption.pathDir = _path;
};
const getFile = async () => {
  let _path = [];
  _path = await ipcRenderer.invoke("dialog:openFile");
  if (!_path) return;
  else importOption.paths = _path;
};
const startAction = () => {
  if (
    (importOption.importType == "directory" && !importOption.pathDir) ||
    (importOption.importType == "files" && importOption.paths.length == 0)
  ) {
    ElMessage.error("路径非法");
    return;
  }
  ElMessage.info("开始收集信息");
  loading.value = true;
  const process = async (paths) => {
    const resp = await FilenameAdapter.getPixivDtoList(paths, autoKeys.value);
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
const checkIfNoConflict = (selectedList) => {
  for (let idx of selectedList) {
    if (
      log.list[idx].status == "conflict" &&
      selectedList.includes(log.list[idx].compareId)
    )
      return false;
  }
  return true;
};
const handleUpload = () => {
  let selectedList = [];
  log.list.forEach((ele) => {
    if (ele.checked) selectedList.push(ele.oriIdx);
  });
  if (selectedList.length == 0) {
    ElMessage.error("未选择任何数据");
    return;
  }
  if (!checkIfNoConflict(selectedList)) {
    ElMessage.error("尚有冲突未解决");
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
      loading.value = true;
      let dto = [];
      selectedList.forEach((idx) => {
        dto.push({
          bid: idx,
          type: "pixiv",
          ...importOption.addition,
          meta: { ...importOption.addition.meta, ...log.list[idx].dto.meta },
        });
      });
      if (importOption.importPolicy == "add") {
        API.newIllusts(dto)
          .then((data) => {
            finAction(data);
          })
          .catch(() => {
            ElMessage.error("网络错误");
          })
          .finally(() => {
            loading.value = false;
          });
      } else {
        API.updateIllustsByMatch(dto, importOption.importPolicy)
          .then((data) => {
            finAction(data);
          })
          .catch(() => {
            ElMessage.error("网络错误");
          })
          .finally(() => {
            loading.value = false;
          });
      }
    })
    .catch(() => {});
  const finAction = (data) => {
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
  };
};
const updateInfo = ({ data, controller }) => {
  importOption.addition = { ...importOption.addition, ...data };
  autoKeys.value.push(...controller);
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
