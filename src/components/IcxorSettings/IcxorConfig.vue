<template>
  <div class="config">
    <div class="form-container">
      <el-scrollbar style="width: 100%;">
        <div class="title-block">用户</div>
        <div class="form-block">
          <el-form :model="configForm" label-width="100px" style="width: 100%">
            <el-form-item label="用户名">
              <el-input
                v-model="configForm.username"
                placeholder="请输入用户名"
              />
            </el-form-item>
          </el-form>
        </div>
        <div class="title-block">本地存储</div>
        <div class="form-block">
          <el-form :model="configForm" label-width="100px" style="width: 100%">
            <el-form-item label="本地路径">
              <el-input
                :model-value="PathHelper.getBaseUrl()"
                placeholder="请输入路径"
                disabled
              />
            </el-form-item>
          </el-form>
        </div>
        <div class="title-block">访图控制</div>
        <div class="form-block">
          <el-form :model="configForm" label-width="100px" style="width: 100%">
            <el-form-item label="公网 / 内网">
              <el-switch
                v-model="configForm.useLocal"
                active-text="内网"
                inactive-text="公网"
              />
            </el-form-item>
            <el-form-item label="公网IHS路径">
              <el-input
                v-model="configForm.remoteIHS"
                placeholder="请输入路径"
              />
            </el-form-item>
            <el-form-item label="内网IHS路径">
              <el-input
                v-model="configForm.localIHS"
                placeholder="请输入路径"
              />
            </el-form-item>
            <el-form-item label="COS路径">
              <el-input v-model="configForm.cos" placeholder="请输入路径" />
            </el-form-item>
            <el-form-item label="Pixiv优先IHS">
              <el-switch v-model="configForm.useIhsForPixiv" />
            </el-form-item>
          </el-form>
        </div>
        <div class="title-block">API</div>
        <div class="form-block">
          <el-form :model="configForm" label-width="100px" style="width: 100%">
            <el-form-item label="API路径">
              <el-select
                v-model="configForm.api"
                filterable
                allow-create
                placeholder="请输入路径"
                style="width: 100%"
              >
                <el-option
                  v-for="item in configForm.apiOptions"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </el-scrollbar>
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
  remoteIHS: "",
  useIhsForPixiv: false,
  api: "",
  apiOptions: [],
  useLocal: false,
  cos: "",
});
const store = useStore();
onMounted(() => {
  initForm();
});
const initForm = () => {
  Object.keys(configForm).forEach((key) => {
    configForm[key] = store.state[key];
  });
};
const commit = () => {
  if (!configForm.apiOptions.includes(configForm.api)) {
    configForm.apiOptions.push(configForm.api);
  }
  Object.keys(configForm).forEach((key) => {
    store.commit("reviseByKey", { key: key, value: configForm[key] });
  });
  ElMessage.success("修改成功,重载后生效");
};
const revoke = () => {
  initForm();
};
</script>
<style lang="scss" scoped>
.config {
  @include Flex-C;
  height: 100%;
  .form-container {
    @include Flex-C-AC;
    overflow: hidden;
    flex: auto;
    .title-block {
      padding: 10px 0 10px 0;
      font-size: 18px;
      color: $color-greengray-1;
    }
    .form-block {
      @include Flex-C-AC;
    }
  }
  .btn-block {
    @include Flex-R-JC;
    flex: none;
    margin: 20px 0 10px 0;
  }
}
</style>
