<template>
  <div>
    <el-alert type="info" show-icon :closable="false">
      <template #title>
        用于导入元数据。一次只能导入一条元数据，且不含副本中的元数据。如果文件夹存在不在母本库中的图片,
        则不会导入。
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
          <el-form-item label="元数据字段">
            <el-select
              v-model="importOption.metaKey"
              placeholder="选择元数据字段"
            >
              <el-option
                v-for="item in [
                  {
                    value: 'author',
                    label: '作者',
                  },
                  {
                    value: 'link',
                    label: '链接',
                  },
                  {
                    value: 'object',
                    label: '对象（加入列表）',
                  },
                  {
                    value: 'limit',
                    label: '限制级',
                  },
                  {
                    value: 'star',
                    label: '收藏等级',
                  },
                  {
                    value: 'timestamp',
                    label: '时间戳',
                  },
                  {
                    value: 'bookCnt',
                    label: '收藏数量（自动导入）',
                  },
                ]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="元数据值"
            v-if="importOption.metaKey !== 'bookCnt'"
          >
            <el-date-picker
              v-if="importOption.metaKey == 'timestamp'"
              v-model="importOption.metaValue"
              value-format="YYYYMMDD"
              type="date"
              placeholder="Pick a day"
            />
            <el-input
              v-model="importOption.metaValue"
              v-else-if="importOption.metaKey !== 'bookCnt'"
            />
          </el-form-item>
        </el-form>
      </div>
      <div class="btn-block">
        <el-button
          @click="startUpdateMeta"
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
import { UpdateMeta } from "@/js/importer/Loader";
import { reactive, ref } from "vue";
const log = reactive({ message: "", list: [] });
const progress = ref(0);

const initTab = () => {
  importOption.paths = [""];
  importOption.metaKey = "";
  importOption.metaValue = "";
};
const importOption = reactive({
  paths: [""],
  metaKey: "",
  metaValue: "",
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
const startUpdateMeta = () => {
  progress.value = 0;
  if (!importOption.paths[0] || importOption.paths[0] == "") {
    ElMessage.error("路径非法");
    return;
  }
  if (
    importOption.metaKey == "" ||
    (importOption.metaKey != "bookCnt" && importOption.metaValue == "")
  ) {
    ElMessage.error("信息不完整");
    return;
  }
  if (importOption.metaKey == "bookCnt") {
    UpdateMeta.updateMetaFromDirectoryWithFilename(
      importOption.paths[0],
      importOption.metaKey,
      progress
    ).then((resp) => {
      if (resp.status === 200) {
        log.message = `${resp.message}${resp.data.length == 0 ? "" : ":"}`;
        log.list = resp.data;
      }
    });
  } else
    UpdateMeta.updateMetaFromDirectoryWithGiven(
      importOption.paths[0],
      importOption.metaKey,
      importOption.metaValue,
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
