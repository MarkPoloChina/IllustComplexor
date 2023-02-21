<template>
  <div class="importer-main">
    <el-alert type="info" show-icon :closable="false" style="flex: none">
      <template #title>
        识别Pixiv规则的文件名, 匹配对应的PID和Page,
        或者仅尝试匹配末端，然后生成聚合。
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
            <el-row :gutter="20" style="width: 100%">
              <el-col :span="6"
                ><el-button @click="showDialog = true">聚合设置</el-button>
              </el-col>
              <el-col :span="12">
                <el-switch
                  v-model="importOption.isTryAny"
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
import { ElMessage, ElMessageBox } from "element-plus";
import { reactive, ref } from "vue";
import FilterTable from "./reusable/filterTable.vue";
import { API } from "@/api/api";
import PolyForm from "../reusable/polyForm.vue";
import { ipcRenderer } from "electron";
import { FileExplorer } from "@/js/util/file";
import { BatchDto } from "@/js/dto/batch";

const log = reactive({ message: "", list: [] });
const table = ref();
const polyForm = ref();
const showDialog = ref(false);
const loading = ref(false);
const initTab = () => {
  importOption.importType = "directory";
  importOption.paths = [];
  importOption.pathDir = "";
  importOption.isTryAny = false;
  log.list.length = 0;
  log.message = "";
  polyForm.value.initForm();
};
const importOption = reactive({
  paths: [""],
  pathDir: "",
  importType: "directory",
  isTryAny: false,
  poly: {},
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
    [],
    importOption.isTryAny
  );
  ElMessage.info(`信息收集完成，共${resp.length}条数据`);
  loading.value = false;
  log.list = resp;
};
const handleUpload = () => {
  if (!importOption.poly.name) {
    ElMessage.error("至少应当填写聚合名");
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
    `将${selectedList.length}个项目进行聚合，确认？`,
    "Warning",
    {
      confirmButtonText: "OK",
      cancelButtonText: "Cancel",
      type: "warning",
    }
  )
    .then(() => {
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
      dto.polyBase = { ...importOption.poly };
      API.addPoly(dto)
        .then((data) => {
          ElMessage.info("处理完成");
          data.forEach((item) => {
            log.list[item.bid].status = item.status;
            log.list[item.bid].message = item.message;
          });
          log.list.forEach((ele) => {
            ele.checked = false;
          });
          table.value.onReset();
        })
        .catch((err) => {
          ElMessage.error(`错误: ${err}`);
        })
        .finally(() => {
          loading.value = false;
        });
    })
    .catch(() => {});
};
const updateInfo = ({ data }) => {
  importOption.poly = { ...importOption.poly, ...data };
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
