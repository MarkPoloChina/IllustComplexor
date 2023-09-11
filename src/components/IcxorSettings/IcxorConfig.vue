<template>
  <div class="config">
    <div class="form-container">
      <el-scrollbar style="width: 100%">
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
              <span>{{ PathHelper.getBaseUrl() }}</span>
            </el-form-item>
            <el-form-item label="缓存大小">
              <span>{{ cacheSize ?? "正在计算中" }}</span>
              <el-button
                type="danger"
                size="small"
                style="margin-left: 20px"
                @click="clearCache"
                >清空</el-button
              >
            </el-form-item>
          </el-form>
        </div>
        <div class="title-block">访图控制</div>
        <div class="form-block">
          <el-form :model="configForm" label-width="100px" style="width: 100%">
            <el-form-item label="IHS模式">
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
            <el-form-item label="Pixiv优先IHS">
              <el-switch v-model="configForm.useIhsForPixiv" />
            </el-form-item>
            <el-form-item label="Pixiv模式">
              <el-switch
                v-model="configForm.useLocalPixiv"
                active-text="本地"
                inactive-text="API代理"
              />
            </el-form-item>
            <el-form-item label="COS路径">
              <el-input v-model="configForm.cos" placeholder="请输入路径" />
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
import { onMounted, reactive, ref } from "vue";
import { PathHelper } from "@/js/util/path";
import { ElMessage, ElMessageBox } from "element-plus";
import { ipcRenderer } from "electron";

const configForm = reactive({
  username: "",
  localIHS: "",
  remoteIHS: "",
  useIhsForPixiv: false,
  api: "",
  apiOptions: [],
  useLocal: false,
  useLocalPixiv: false,
  cos: "",
});
const store = useStore();
onMounted(() => {
  initForm();
  getCacheSize();
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
const cacheSize = ref(null);
const getCacheSize = async () => {
  const size = await ipcRenderer.invoke("app:getCacheSize");
  const formatBytes = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(k)));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };
  cacheSize.value = formatBytes(size);
};
const clearCache = () => {
  ElMessageBox.confirm("将清空全部缓存，确认？", "Warning", {
    confirmButtonText: "OK",
    cancelButtonText: "Cancel",
    type: "warning",
  })
    .then(async () => {
      try {
        await ipcRenderer.invoke("app:clearCache");
        ElMessage.success("缓存已清空");
      } catch (error) {
        ElMessage.error("缓存清空失败");
      } finally {
        getCacheSize();
      }
    })
    .catch(() => {});
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
