<template>
  <div>
    <el-alert type="info" show-icon :closable="false">
      <template #title> 导入Pixiv收藏。 </template>
    </el-alert>
    <!-- <el-steps :active="active" finish-status="success">
      <el-step title="Step 1" />
      <el-step title="Step 2" />
      <el-step title="Step 3" />
    </el-steps> -->
    <div class="import-area">
      <div class="title-block">导入选项</div>
      <div class="form-block">
        <el-form :model="importOption" label-width="100px" style="width: 100%">
          <el-form-item label="收藏类型">
            <el-radio-group v-model="importOption.type">
              <el-radio label="public">公开(Public)</el-radio>
              <el-radio label="private">不公开(Private)</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="入库时间">
            <el-date-picker
              v-model="importOption.illust.date"
              value-format="YYYY-MM-DD"
              type="date"
              placeholder="Pick a day"
            />
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="result-area">
      <div class="title-block">筛选器</div>
      <el-table
        v-loading="loading"
        :data="resultTable"
        height="300"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column
          prop="id"
          label="PID"
          width="100"
          show-overflow-tooltip
        />
        <el-table-column
          prop="page_count"
          label="总页数"
          width="100"
          show-overflow-tooltip
        />
        <el-table-column
          prop="user.name"
          label="作者"
          width="150"
          show-overflow-tooltip
        />
        <el-table-column prop="title" label="标题" show-overflow-tooltip />
      </el-table>
    </div>
    <div class="btn-area">
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
</template>
<script setup>
import { API } from "@/api/api";
import { Check, Download, Remove } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { reactive, ref } from "vue";

const resultTable = ref([]);
const selectedList = ref([]);
const loading = ref(false);
// const active = ref(0);
const initTab = () => {
  importOption.type = "public";
};
const importOption = reactive({
  type: "public",
  illust: {
    date: "",
  },
});
const startAction = () => {
  loading.value = true;
  API.getBookmark(importOption.type == "private")
    .then((data) => {
      loading.value = false;
      resultTable.value = data;
    })
    .catch(() => {
      loading.value = false;
      ElMessage.error("抓取出错");
    });
};
const handleUpload = () => {
  if (selectedList.value.length != 0 && importOption.illust.date != "") {
    const l = [];
    selectedList.value.forEach((ele) => {
      for (let i = 0; i < ele.page_count; i++) {
        l.push({
          pid: ele.pid,
          page: i,
          title: ele.title,
          ...importOption.illust,
        });
      }
    });
    API.newIllusts(l)
      .then((data) => {
        if (data.code != 200000) {
          ElMessage.error(data.msg);
        } else {
          selectedList.value.length = 0;
          resultTable.value.length = 0;
        }
      })
      .catch(() => {
        ElMessage.error("网络错误");
      });
  } else ElMessage.error("信息不完整");
};
const handleSelectionChange = (val) => {
  if (val) {
    selectedList.value.length = 0;
    val.forEach((ele) => {
      selectedList.value.push({
        pid: ele.id,
        page_count: ele.page_count,
        title: ele.title,
      });
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
.btn-area {
  margin-top: 20px;
  @include Flex-R-AC;
}
.title-block {
  padding: 10px 0 10px 0;
  font-size: 18px;
  color: $color-greengray-1;
}
</style>
