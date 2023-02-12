<template>
  <div class="config">
    <div class="title-block">远程基</div>
    <div class="form-block">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="id" label="ID" width="50" />
        <el-table-column label="类型" width="150">
          <template #default="scope">
            <el-select
              v-model="scope.row.type"
              placeholder="选择类型"
              :disabled="!scope.row.editing"
            >
              <el-option
                v-for="item in ['pixiv', 'mpihs', 'cos']"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="标识符" width="150">
          <template #default="scope">
            <span v-if="!scope.row.editing">{{ scope.row.name }}</span>
            <span v-else><el-input v-model="scope.row.name"></el-input></span>
          </template>
        </el-table-column>
        <el-table-column label="原图URL">
          <template #default="scope">
            <span v-if="!scope.row.editing">{{ scope.row.origin_url }}</span>
            <span v-else
              ><el-input v-model="scope.row.origin_url"></el-input
            ></span>
          </template>
        </el-table-column>
        <el-table-column label="缩略图URL">
          <template #default="scope">
            <span v-if="!scope.row.editing">{{ scope.row.thum_url }}</span>
            <span v-else
              ><el-input v-model="scope.row.thum_url"></el-input
            ></span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="80">
          <template #default="scope">
            <el-button
              link
              type="primary"
              size="small"
              v-if="!scope.row.editing"
              @click="scope.row.editing = true"
              >Edit</el-button
            >
            <el-button
              link
              type="primary"
              size="small"
              v-else
              @click="handleUpdateRemote(scope.row)"
              >Fin</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="btn-block">
      <el-button @click="addRow" type="success" :icon="Plus" circle></el-button>
      <el-button
        @click="revoke"
        type="danger"
        :icon="Remove"
        circle
      ></el-button>
    </div>
  </div>
</template>
<script setup>
import { API } from "@/api/api";
import { Plus, Remove } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { onMounted, ref } from "vue";

onMounted(() => {
  initForm();
});
const tableData = ref([]);
const initForm = async () => {
  tableData.value = await API.getRemoteBase();
};
const revoke = () => {
  tableData.value.length = 0;
  initForm();
};
const addRow = () => {
  tableData.value.push({
    id: null,
    name: "",
    origin_url: "",
    thum_url: "",
    type: "",
  });
};
const handleUpdateRemote = (row) => {
  API.coverRemoteBase(row)
    .then((data) => {
      if (data.code == 200000) {
        ElMessage.success("更改成功");
        row.editing = false;
      } else {
        ElMessage.error(data.msg);
      }
    })
    .catch(() => {
      ElMessage.error("网络错误");
    });
};
</script>
<style lang="scss" scoped>
.config {
  @include Flex-C;
  height: calc(100% - 20px);
  .title-block {
    padding: 10px 0 10px 0;
    font-size: 18px;
    color: $color-greengray-1;
  }
  .form-block {
    @include Flex-C-AC;
  }
  .btn-block {
    @include Flex-R-JC;
    margin-top: auto;
  }
}
</style>
