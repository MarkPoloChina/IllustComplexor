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
            :model-value="PathHelper.getBaseUrl()"
            placeholder="请输入路径"
            disabled
          />
        </el-form-item>
        <el-form-item label="IHS路径">
          <el-select
            v-model="configForm.localIHS"
            filterable
            allow-create
            placeholder="请输入路径"
            style="width: 100%"
          >
            <el-option
              v-for="item in configForm.localIHSOptions"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div class="title-block">偏好信息</div>
    <div class="form-block">
      <el-form :model="configForm" label-width="100px" style="width: 100%">
        <el-form-item label="优先IHS">
          <el-switch v-model="configForm.useIhsForPixiv" />
        </el-form-item>
      </el-form>
    </div>
    <div class="title-block">调试信息</div>
    <div class="form-block">
      <el-form :model="configForm" label-width="100px" style="width: 100%">
        <el-form-item label="本地API">
          <el-switch v-model="configForm.localApi" />
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
import { PathHelper } from "@/js/util/path";
import { ElMessage } from "element-plus";

const configForm = reactive({
  username: "",
  localIHS: "",
  localIHSOptions: [],
  useIhsForPixiv: false,
  localApi: false,
});
const store = useStore();
onMounted(() => {
  initForm();
});
const initForm = () => {
  configForm.username = store.state.username;
  configForm.localIHS = store.state.localIHS;
  configForm.useIhsForPixiv = store.state.useIhsForPixiv;
  configForm.localApi = store.state.localApi;
  configForm.localIHSOptions = store.state.localIHSOptions;
};
const commit = () => {
  if (!configForm.localIHSOptions.includes(configForm.localIHS)) {
    configForm.localIHSOptions.push(configForm.localIHS);
  }
  Object.keys(configForm).forEach((key) => {
    store.commit("reviseByKey", { key: key, value: configForm[key] });
  });
  ElMessage.success("修改成功");
};
const revoke = () => {
  initForm();
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
