<template>
  <div>
    <el-alert type="info" show-icon :closable="false">
      <template #title>
        用于导入聚合。如果文件不能匹配上基准数据, 则不会导入。
      </template>
    </el-alert>
    <div class="import-area">
      <div class="title-block">导入选项</div>
      <div class="form-block">
        <el-form :model="importOption" label-width="100px" style="width: 100%">
          <el-form-item label="路径">
            <el-button @click="getDirectory">选择文件夹</el-button>
            <el-input :modelValue="importOption.paths[0]" disabled />
          </el-form-item>
          <el-form-item label="副本分类">
            <el-select v-model="importOption.type" placeholder="选择副本分类">
              <el-option
                v-for="item in [
                  {
                    value: 'picolt',
                    label: 'PICOLT',
                  },
                  {
                    value: 'others',
                    label: '其他',
                  },
                ]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="PICOLT级" v-if="importOption.type=='picolt'">
            <el-select
              v-model="importOption.copy.copyLevel"
              placeholder="选择类型"
              @change="importOption.copy.copyNo = val == 'picolt-2' ? '' : 1"
            >
              <el-option
                v-for="item in [
                  {
                    value: 'picolt-1',
                    label: 'PICOLT-1',
                  },
                  {
                    value: 'picolt-2',
                    label: 'PICOLT-2',
                  },
                ]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="PICOLT卷" v-if="importOption.type=='picolt'">
            <el-input-number
              v-if="importOption.copy.copyLevel == 'picolt-1'"
              v-model="importOption.copy.copyNo"
              :min="1"
            />
            <el-input
              v-else-if="importOption.copy.copyLevel == 'picolt-2'"
              v-model="importOption.copy.copyNo"
              placeholder="输入PICOLT卷号"
            />
            <div v-else>请先确定PICOLT级</div>
          </el-form-item>
          <el-form-item label="Waifu2x">
            <el-select
              v-model="importOption.copy.waifu2x"
              placeholder="选择Waifu2x"
            >
              <el-option
                v-for="item in [
                  {
                    value: 'null',
                    label: '原始版本',
                  },
                  {
                    value: 'ncnn',
                    label: 'NCNN',
                  },
                  {
                    value: 'real',
                    label: 'RealGUN',
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
          @click="startImportPicolt"
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
import { AddCopy } from "@/js/importer/Loader";
import { reactive, ref } from "vue";
const remote = require("@electron/remote");

const log = reactive({ message: "", list: [] });
const progress = ref(0);

const initTab = () => {
  importOption.paths = [""];
  importOption.copy = {
    copyType: "",
    copyPath: "",
    copyLevel: "",
    copyNo: 1,
    waifu2x: "",
  };
  importOption.type = "";
};
const importOption = reactive({
  paths: [""],
  copy: {
    copyType: "",
    copyPath: "",
    copyLevel: "",
    copyNo: 1,
    waifu2x: "",
  },
  type: "",
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
// const getFile = async () => {
//   let _path = [];
//   _path = (
//     await remote.dialog.showOpenDialog({
//       properties: ["openFile", "multiSelections"],
//       filters: [{ name: "Images", extensions: ["jpg", "png", "gif"] }],
//     })
//   ).filePaths;
//   if (_path.length == 0) return;
//   else importOption.paths = _path;
// };
const startImportPicolt = () => {
  progress.value = 0;
  if (!importOption.paths[0] || importOption.paths[0] == "") {
    ElMessage.error("路径非法");
    return;
  }
  if (
    importOption.copy.copyLevel == "" ||
    importOption.copy.copyNo == "" ||
    importOption.copy.waifu2x == ""
  ) {
    ElMessage.error("信息不完整");
    return;
  }
  AddCopy.loadFromDirectory(
    importOption.paths[0],
    {
      copyType: "picolt",
      copyPath: importOption.paths[0],
      copyLevel: importOption.copy.copyLevel,
      copyNo: importOption.copy.copyNo,
      waifu2x: importOption.copy.waifu2x,
    },
    progress
  ).then((resp) => {
    if (resp.status === 200) {
      log.message = `${resp.message}${resp.data.length == 0 ? "" : ":"}`;
      log.list = resp.data;
    }
  });
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
