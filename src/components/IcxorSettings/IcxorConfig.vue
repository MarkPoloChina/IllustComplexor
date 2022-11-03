<template>
  <div class="config">
    <div class="title-block">用户信息</div>
    <div class="form-block">
      <el-form :model="configForm" label-width="100px" style="width: 100%">
        <el-form-item label="用户名">
          <el-input v-model="configForm.username" placeholder="请输入用户名" />
        </el-form-item>
      </el-form>
    </div>
    <div class="title-block">存储信息</div>
    <div class="form-block">
      <el-form :model="configForm" label-width="100px" style="width: 100%">
        <el-form-item label="本地路径">
          <el-input
            v-model="configForm.path"
            placeholder="请输入路径"
            disabled
          />
        </el-form-item>
      </el-form>
    </div>
    <div class="btn-block">
      <el-button
        @click="commit"
        type="success"
        :icon="Check"
        circle
      ></el-button>
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
import { Check, Remove } from "@element-plus/icons-vue";
import { useStore } from "vuex";
import { onMounted, reactive } from "vue";

const configForm = reactive({ username: "", path: "" });
const store = useStore();
onMounted(() => {
  initForm();
});
const initForm = () => {
  configForm.username = store.state.username;
  configForm.path = store.state.basePath;
};
const commit = () => {
  store.commit("reviseUsername", configForm.username);
  store.commit("saveToDB");
};
const revoke = () => {
  initForm();
};
</script>
<style lang="scss" scoped>
.config {
  @include Flex-C-CT;
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
    @include Flex-R-AC;
    margin-top: auto;
  }
}
</style>
