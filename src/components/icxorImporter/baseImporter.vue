<template>
  <div>
    <el-alert type="info" show-icon :closable="false">
      <template #title>
        用于添加母本。请保证母本的唯一性和准确性, 如果已经有相同的id,
        则不会导入。
      </template>
    </el-alert>
    <div class="import-area">
      <div class="title-block">导入选项</div>
      <div class="form-block">
        <el-form :model="importOption" label-width="80px" style="width: 100%">
          <el-form-item label="导入类型" @change="importOption.paths = ['']">
            <el-radio-group v-model="importOption.importType">
              <el-radio label="directory">文件夹</el-radio>
              <el-radio label="files">文件</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="路径"
            v-if="importOption.importType == 'directory'"
          >
            <el-button @click="getDirectory">选择文件夹</el-button>
            <el-input :modelValue="importOption.paths[0]" disabled />
          </el-form-item>
          <el-form-item label="路径" v-else>
            <el-button @click="getFile">选择文件</el-button>
            <el-input :modelValue="importOption.paths.toString()" disabled />
          </el-form-item>
          <el-form-item label="类型">
            <el-select v-model="importOption.type" placeholder="选择类型">
              <el-option
                v-for="item in [
                  {
                    value: 'std',
                    label: '标准卷',
                  },
                  {
                    value: 'dep',
                    label: '离散卷',
                  },
                ]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="btn-block">
        <el-button
          @click="startImportBase"
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
import { remote } from "electron";
import { LoadBase } from "@/js/importer/Loader";
import { reactive, ref } from "vue";
const log = reactive({ message: "", list: [] });
const progress = ref(0);
const initTab = () => {
  importOption.type = "std";
  importOption.importType = "directory";
  importOption.paths = [""];
};
const importOption = reactive({
  paths: [""],
  importType: "directory",
  type: "std",
});
const getDirectory = async () => {
  let _path = "";
  _path = (
    await remote.dialog.showOpenDialog({
      properties: ["openDirectory"],
    })
  ).filePaths[0];
  if (!_path) return;
  else importOption.paths[0] = _path;
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
const startImportBase = () => {
  progress.value = 0;
  if (!importOption.paths[0] || importOption.paths[0] == "") {
    ElMessage.error("路径非法");
    return;
  }
  if (importOption.importType == "directory") {
    LoadBase.loadFromDirectory(
      importOption.paths[0],
      importOption.type,
      progress
    ).then((resp) => {
      if (resp.status === 200) {
        log.message = resp.message;
        log.list = [];
      }
    });
  } else if (importOption.importType == "files") {
    LoadBase.loadFromFiles(importOption.paths, importOption.type, progress)
      .then((resp) => {
        if (resp.status === 200) {
          log.message = resp.message;
          log.list = [];
        }
      })
      .catch((resp) => {
        log.message = resp.message;
      });
  }
};
</script>
<style lang="scss" scoped>
.import-area {
  .form-block {
    @include Flex-C-AC;
  }
  .btn-block {
    @include Flex-R-AC;
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
.title-block {
  padding: 10px 0 10px 0;
  font-size: 18px;
  color: $color-greengray-1;
}
</style>
