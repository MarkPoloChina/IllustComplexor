<template>
  <div>
    <el-dialog v-model="dialogVisible" title="IT表单" width="60%">
      <el-form :model="baseInfo" label-width="100px" style="width: 100%">
        <el-form-item label="入库时间">
          <el-date-picker
            v-model="baseInfo.date"
            value-format="YYYY-MM-DD"
            type="date"
            placeholder="Pick a day"
          />
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
import { ElMessage } from "element-plus";
import { reactive, computed } from "vue";

const baseInfo = reactive({
  date: null,
});
// eslint-disable-next-line no-undef
const props = defineProps({
  modelValue: Boolean,
  disableChangeAuto: Boolean,
  type: String,
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
const initForm = () => {
  baseInfo.date = null;
};
const handleConfirm = () => {
  if (!baseInfo.date) {
    ElMessage.error("必须为IT赋时间");
    return;
  }
  dialogVisible.value = false;
  emit("confirm", {
    data: { ...baseInfo },
    controller: null,
  });
};
// eslint-disable-next-line no-undef
defineExpose({ initForm });
</script>
<style lang="scss" scoped></style>
