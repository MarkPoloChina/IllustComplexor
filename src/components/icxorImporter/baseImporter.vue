<template>
  <div>
    <el-alert type="info" show-icon :closable="false">
      <template #title>
        用于导入Illust。对于标准卷的Pixiv类型, 将在导入时检查文件名,
        匹配时同时导入元。已经有相同的id的元时不会导入。
        <br />
        对于标准卷的其他类型, 仅导入基准。
        <br />
        对于离散卷, 在导入基准后还将进行本地映射。
      </template>
    </el-alert>
    <div class="import-area">
      <div class="title-block">导入选项</div>
      <div class="form-block">
        <el-form :model="importOption" label-width="100px" style="width: 100%">
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
            <el-select
              v-model="importOption.info.type"
              placeholder="选择类型"
              filterable
              allow-create
            >
              <el-option
                v-for="item in [
                  {
                    value: 'pixiv',
                    label: '标准卷:pixiv',
                  },
                  {
                    value: 'dep',
                    label: '默认离散卷',
                  },
                ]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="入库时间">
            <el-date-picker
              v-model="importOption.info.date"
              value-format="YYYY-MM-DD"
              type="date"
              placeholder="Pick a day"
            />
          </el-form-item>
          <el-form-item label="评级">
            <el-rate v-model="importOption.info.star" />
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
import { RemoteLoader } from "@/js/importer/Loader";
import { reactive, ref } from "vue";
import { API } from "@/api/api";

const remote = require("@electron/remote");
const log = reactive({ message: "", list: [] });
const progress = ref(0);
const initTab = () => {
  importOption.info.type = "pixiv";
  importOption.importType = "directory";
  importOption.paths = [""];
  importOption.info.date = null;
  importOption.info.star = null;
};
const importOption = reactive({
  paths: [""],
  importType: "directory",
  info: {
    type: "pixiv",
    date: null,
    star: null,
  },
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
const startImportBase = async () => {
  progress.value = 0;
  if (!importOption.paths[0] || importOption.paths[0] == "") {
    ElMessage.error("路径非法");
    return;
  }
  if (
    importOption.importType == "directory" &&
    importOption.info.type == "pixiv"
  ) {
    ElMessage.info("开始收集信息");
    const resp = await RemoteLoader.getPixivLoaderDtoListFromDirectory(
      importOption.paths[0],
      importOption.info,
      progress
    );
    ElMessage.info(`信息收集完成，共${resp.dto.length}条有效数据`);
    log.list = resp.log;
    API.newIllusts(resp.dto);
  } else if (
    importOption.importType == "files" &&
    importOption.info.type == "pixiv"
  ) {
    ElMessage.info("开始收集信息");
    const resp = await RemoteLoader.getPixivLoaderDtoListFromFiles(
      importOption.paths,
      importOption.info,
      progress
    );
    log;
    ElMessage.info(`信息收集完成，共${resp.dto.length}条有效数据`);
    log.list = resp.log;
    API.newIllusts(resp.dto).then(data=>{
      if (data.code==200000)
      {
        ElMessage.info('上传完成');
        data.passedList.forEach((bid)=>{
          log.list.find((item)=>{return item.bid==bid}).status = 'passed'
        })
      }
    });
  }
};
</script>
<style lang="scss" scoped>
.import-area {
  padding: 0 10px 0 10px;
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
