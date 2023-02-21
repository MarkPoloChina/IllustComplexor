<template>
  <div class="importer-main">
    <el-alert type="info" show-icon :closable="false" style="flex: none">
      <template #title>
        利用文件名创建Illust信息, 指向对应类型的Remote, 也可同时附加元数据。
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
          <el-form-item label="默认类型">
            <el-select
              v-model="importOption.addition.remote_base.name"
              filterable
              allow-create
              placeholder="选择或填写类型"
            >
              <el-option
                v-for="item in remoteBaseList"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="策略">
            <el-radio-group v-model="importOption.importPolicy">
              <el-radio label="add">增加</el-radio>
              <el-radio label="modify">更新</el-radio>
              <el-radio label="cover">覆盖</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-row :gutter="20" style="width: 100%">
              <el-col :span="6">
                <el-button @click="showDialog = true">附加元</el-button>
              </el-col>
              <el-col :span="12">
                <el-switch
                  v-model="importOption.acceptNormal"
                  active-text="全部图片"
                  inactive-text="仅Pixiv"
                />
              </el-col>
            </el-row>
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
    type="basic"
  ></MetaForm>
</template>
<script setup>
import { Check, Remove, Download } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { FilenameAdapter } from "@/js/util/filename";
import { reactive, ref, onMounted } from "vue";
import MetaForm from "../reusable/metaForm.vue";
import FilterTable from "./reusable/filterTable.vue";
import { API } from "@/api/api";
import { ipcRenderer } from "electron";
import { FileExplorer } from "@/js/util/file";
import { BatchDto } from "@/js/dto/batch";

const remoteBaseList = ref([]);
const log = reactive({ message: "", list: [] });
const showDialog = ref(false);
const metaForm = ref();
const table = ref();
const loading = ref(false);
const initTab = () => {
  importOption.importType = "directory";
  importOption.importPolicy = "add";
  importOption.autoKeys = [];
  importOption.paths = [];
  importOption.pathDir = "";
  importOption.acceptNormal = true;
  importOption.addition = {
    remote_base: {},
    meta: {},
  };
  log.list.length = 0;
  log.message = "";
  metaForm.value.initForm();
};
onMounted(() => {
  getRemoteBaseList();
});
const importOption = reactive({
  paths: [],
  pathDir: "",
  autoKeys: [],
  importType: "directory",
  importPolicy: "add",
  acceptNormal: true,
  addition: {
    remote_base: {},
    meta: {},
  },
});
const getRemoteBaseList = async () => {
  remoteBaseList.value = await API.getRemoteBase();
};
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
const startAction = async () => {
  if (
    (importOption.importType == "directory" && !importOption.pathDir) ||
    (importOption.importType == "files" && importOption.paths.length == 0)
  ) {
    ElMessage.error("路径非法");
    return;
  }
  ElMessage.info("开始收集信息");
  loading.value = true;
  const paths =
    importOption.importType == "directory"
      ? await FileExplorer.parseFilenamesFromDirectoryAsync(
          importOption.pathDir
        )
      : importOption.paths;
  const resp = await FilenameAdapter.getDtoList(
    paths,
    importOption.autoKeys,
    importOption.acceptNormal
  );
  ElMessage.info(`信息收集完成，共${resp.length}条数据`);
  loading.value = false;
  log.list = resp;
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
  ElMessageBox.confirm(
    `将${selectedList.length}个项目进行上传，确认？`,
    "Warning",
    {
      confirmButtonText: "OK",
      cancelButtonText: "Cancel",
      type: "warning",
    }
  )
    .then(async () => {
      loading.value = true;
      const dto = new BatchDto();
      selectedList.forEach((idx) => {
        dto.dtos.push({
          bid: idx,
          dto: {
            ...log.list[idx].dto,
          },
        });
      });
      dto.addition = { ...importOption.addition };
      if (importOption.importPolicy == "cover")
        dto.control.addIfNotFound = true;
      try {
        const data =
          importOption.importPolicy == "add"
            ? await API.newIllusts(dto)
            : await API.updateIllusts(dto);
        ElMessage.info("处理完成");
        data.forEach((item) => {
          log.list[item.bid].status = item.status;
          log.list[item.bid].message = item.message;
        });
        log.list.forEach((ele) => {
          ele.checked = false;
        });
        table.value.onReset();
      } catch (err) {
        console.log(err);
        ElMessage.error("网络错误");
      } finally {
        loading.value = false;
      }
    })
    .catch(() => {});
};
const updateInfo = ({ data, controller }) => {
  importOption.addition = { ...importOption.addition, ...data };
  if (controller) importOption.autoKeys = controller;
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
