<template>
  <div class="home-container">
    <div class="title">导入</div>
    <el-tabs class="tabs" v-model="currentTab">
      <el-tab-pane label="母本/初始化" name="base">
        <el-alert type="info" show-icon :closable="false">
          <template #title>
            用于添加母本。请保证母本的唯一性和准确性, 如果已经有相同的id,
            则不会导入。
          </template>
        </el-alert>
        <div class="import-area">
          <div class="title-block">导入选项</div>
          <div class="form-block">
            <el-form
              :model="importOption"
              label-width="80px"
              style="width: 100%"
            >
              <el-form-item
                label="导入类型"
                @change="importOption.paths = ['']"
              >
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
                <el-input
                  :modelValue="importOption.paths.toString()"
                  disabled
                />
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
            <el-button
              @click="startImport"
              type="success"
              :icon="Check"
              circle
            ></el-button>
          </div>
        </div>
        <div class="result-area">
          <div class="title-block">结果</div>
          <el-progress
            :percentage="progress == -1 ? 100 : progress"
            :status="
              progress == -1 ? 'exception' : progress == 100 ? 'success' : ''
            "
          />
          <div v-for="(log, index) in logs.value" :key="index">{{ log }}</div>
          <el-button @click="test">测试</el-button>
        </div>
        <!-- <el-button @click="test2">test2</el-button> -->
      </el-tab-pane>
      <el-tab-pane label="副本" name="copy">Config</el-tab-pane>
      <el-tab-pane label="元数据" name="meta">Role</el-tab-pane>
      <el-tab-pane label="PICOLT卷" name="picolt">Task</el-tab-pane>
    </el-tabs>
  </div>
</template>
<script setup>
import { Check } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { remote } from "electron";
import { LoadBase } from "@/js/importer/LoadBase";
import { reactive, ref } from "vue";
const logs = reactive({ value: [] });
const progress = ref(0);
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
const startImport = () => {
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
        logs.value.push(resp.message);
      }
    });
  } else if (importOption.importType == "files") {
    LoadBase.loadFromFiles(importOption.paths, importOption.type, progress)
      .then((resp) => {
        if (resp.status === 200) {
          logs.value.push(resp.message);
        }
      })
      .catch((resp) => {
        logs.value.push(resp.message);
      });
  }
};
const currentTab = ref("base");
const test = () => {
  LoadBase.test();
};
</script>
<style lang="scss" scoped>
.home-container {
  width: calc(100% - 20px);
  height: calc(100% - 10px);
  padding: 10px 10px 0 10px;
  @include Flex-C-CT;
  .title {
    padding: 10px;
    font-size: 24px;
    font-weight: bold;
    color: $color-greengray-1;
  }
  .tabs {
    padding: 0 10px 0 10px;
    .el-tabs__item.is-active {
      color: $color-stdblue-1;
    }
    .title-block {
      padding: 10px 0 10px 0;
      font-size: 18px;
      color: $color-greengray-1;
    }
    .form-block {
      @include Flex-C-AC;
    }
  }
}
</style>
