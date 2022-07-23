<template>
  <el-dialog
    :model-value="modelValue"
    title="详细信息"
    width="50%"
    :before-close="() => emit('update:modelValue', false)"
  >
    <el-descriptions :column="3" border>
      <template #extra>
        <!-- <el-button type="primary">Operation</el-button> -->
      </template>
      <el-descriptions-item>
        <template #label> PID </template>
        {{ info.sid }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label> 标题 </template>
        {{ info.title }}
      </el-descriptions-item>
    </el-descriptions>
    <!-- <template #footer>
      <span class="dialog-footer">
        <el-button @click="emit('update:modelValue', false)">Cancel</el-button>
        <el-button type="primary" @click="emit('update:modelValue', false)"
          >Confirm</el-button
        >
      </span>
    </template> -->
  </el-dialog>
</template>
<script setup>
import { defineProps, defineEmits } from "vue";
defineProps({
  modelValue: Boolean,
  info: Object,
});
const emit = defineEmits(["update:modelValue"]);
</script>
<style lang="scss" scoped></style>
