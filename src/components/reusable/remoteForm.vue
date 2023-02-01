<template>
  <div>
    <el-dialog v-model="dialogVisible" title="远程表单" width="60%">
      <el-form :model="baseInfo" label-width="100px" style="width: 100%">
        <el-form-item label="远程类型">
          <el-select
            v-model="baseInfo.remote_type"
            placeholder="选择或填写类型"
          >
            <el-option
              v-for="item in ['pixiv', 'mpihs', 'cos']"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="远程基">
          <el-select
            v-model="baseInfo.remote_base_id"
            placeholder="选择或填写类型"
          >
            <el-option
              v-for="item in remoteBaseList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-checkbox v-model="useFilename" label="远程末端使用文件名" />
        </el-form-item>
        <el-form-item label="远程末端" v-if="!useFilename">
          <el-input v-model="baseInfo.remote_endpoint" />
        </el-form-item>
        <el-form-item label="缩略图基">
          <el-select
            v-model="baseInfo.thum_base_id"
            placeholder="选择或填写类型"
          >
            <el-option
              v-for="item in remoteBaseList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-checkbox v-model="useFilenameThum" label="缩略图末端使用文件名" />
        </el-form-item>
        <el-form-item label="缩略图末端" v-if="!useFilenameThum">
          <el-input v-model="baseInfo.thum_endpoint" />
        </el-form-item>
        <el-form-item label="缩略图末端扩展名">
          <el-select v-model="thumExt" placeholder="选择扩展名">
            <el-option
              v-for="item in [
                { name: '与原文件一致', value: '' },
                { name: 'PNG', value: '.png' },
                { name: 'JPG', value: '.jpg' },
              ]"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="handleConfirm"> Confirm </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { API } from "@/api/api";
import { reactive, computed, ref, onMounted } from "vue";

const baseInfo = reactive({
  remote_type: null,
  remote_base_id: null,
  remote_endpoint: null,
  thum_base_id: null,
  thum_endpoint: null,
});
const remoteBaseList = ref([]);
const useFilename = ref(true);
const useFilenameThum = ref(true);
const thumExt = ref("");
// eslint-disable-next-line no-undef
const props = defineProps({
  modelValue: Boolean,
});
// eslint-disable-next-line no-undef
const emit = defineEmits(["update:modelValue", "confirm"]);
const dialogVisible = computed({
  get: () => {
    return props.modelValue;
  },
  set: (value) => {
    emit("update:modelValue", value);
  },
});
onMounted(() => {
  getRemoteBaseList();
});
const getRemoteBaseList = () => {
  API.getRemoteBase().then((data) => {
    remoteBaseList.value = data;
  });
};
const initForm = () => {
  baseInfo.remote_base_id = null;
  baseInfo.remote_endpoint = null;
  baseInfo.remote_type = null;
  baseInfo.thum_base_id = null;
  baseInfo.thum_endpoint = null;
};
const handleConfirm = () => {
  dialogVisible.value = false;
  emit("confirm", {
    data: {
      remote_info: {
        ...baseInfo,
      },
    },
    controller: thumExt.value,
  });
};
// eslint-disable-next-line no-undef
defineExpose({ initForm });
</script>
<style lang="scss" scoped></style>
