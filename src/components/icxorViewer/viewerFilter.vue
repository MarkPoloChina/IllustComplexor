<template>
  <div>
    <div class="toggle-btn">
      <el-button
        :icon="show ? ArrowLeftBold : ArrowRightBold"
        circle
        @click="show ^= true"
      />
    </div>
    <transition name="el-zoom-in-center">
      <div v-if="show">
        <el-select v-model="value" class="m-2" placeholder="选择类型">
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
    </transition>
  </div>
</template>
<script setup>
import { ArrowLeftBold, ArrowRightBold } from "@element-plus/icons-vue";

import { ref, watch } from "vue";

const value = ref("");
const show = ref(true);
const typeOptions = [
  {
    value: "pixiv",
    label: "Pixiv",
  },
];
// eslint-disable-next-line no-undef
const emit = defineEmits(["resize"]);
watch(show, () => {
  emit("resize");
});
</script>
<style lang="scss" scoped>
.toggle-btn {
  margin-bottom: 10px;
}
</style>
