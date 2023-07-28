<script setup>
import { ref } from "vue";
import { Search } from "@element-plus/icons-vue";

const pid = ref("");
const page = ref(0);
const handleSearchByLink = (_pid, _page) => {
  pid.value = _pid;
  page.value = parseInt(_page);
};
// eslint-disable-next-line no-undef
defineExpose({ handleSearchByLink });
</script>
<template>
  <div>
    <div>
      <el-form label-width="80px" style="width: 100%" label-position="left">
        <el-form-item label="PID">
          <el-input v-model="pid" placeholder="Input PID" />
        </el-form-item>
        <el-form-item label="Page">
          <el-row style="width: 100%" justify="space-between">
            <el-col :span="12"
              ><el-input-number v-model="page" :min="0" />
            </el-col>
            <el-col :span="2">
              <el-button :icon="Search" type="primary"></el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<style lang="scss" scoped></style>
