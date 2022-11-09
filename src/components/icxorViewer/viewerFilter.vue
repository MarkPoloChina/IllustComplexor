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
      <div class="filter" v-if="show">
        <div>
          <el-select
            v-model="values.value['illust.type']"
            placeholder="选择类型"
            multiple
          >
            <el-option
              v-for="item in options['illust.type']"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div>
          <el-select
            v-model="values.value['poly.type']"
            placeholder="选择聚合类型"
            multiple
          >
            <el-option
              v-for="item in options['poly.type']"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div v-if="values.value['poly.type'] == 'picolt'">
          <el-cascader
            v-model="polyValue"
            :options="polyOptions"
            :props="polyProps"
            :show-all-levels="false"
            placeholder="选择聚合"
            @change="handlePolyChange"
          />
        </div>
      </div>
    </transition>
  </div>
</template>
<script setup>
import { API } from "@/api/api";
import { ArrowLeftBold, ArrowRightBold } from "@element-plus/icons-vue";

import { onMounted, reactive, ref, watch } from "vue";

const show = ref(true);
const values = reactive({
  value: {
    "illust.type": [],
    "poly.type": [],
    "poly.parent": [],
    "poly.name": [],
  },
});
const options = {
  "illust.type": [
    {
      value: "pixiv",
      label: "Pixiv",
    },
  ],
  "poly.type": [
    {
      value: "picolt",
      label: "Picolt",
    },
  ],
};
const polyOptions = ref([]);
const polyProps = { multiple: true };
const polyValue = ref();
watch(values, (val) => {
  emit("filter-change", val.value);
});
onMounted(() => {
  getPolyOptions();
});
const poly = reactive({ value: null });
const getPolyOptions = async () => {
  const polies = await API.getPicolt();
  poly.value = polies;
  polies.forEach((poly) => {
    let index = polyOptions.value.findIndex((val) => {
      return val.value == poly.parent;
    });
    if (index == -1) {
      polyOptions.value.push({
        value: poly.parent,
        label: poly.parent,
        children: [],
      });
      index = polyOptions.value.length - 1;
    }
    polyOptions.value[index].children.push({
      value: poly.name,
      label: poly.name,
    });
  });
};
const handlePolyChange = (val) => {
  values.value["poly.parent"] = [];
  values.value["poly.name"] = [];
  val.forEach((item) => {
    if (!values.value["poly.parent"].find((val) => val == item[0]))
      values.value["poly.parent"].push(item[0]);
    if (item[1] && !values.value["poly.name"].find((val) => val == item[1]))
      values.value["poly.name"].push(item[1]);
  });
};
// eslint-disable-next-line no-undef
const emit = defineEmits(["filter-change"]);
</script>
<style lang="scss" scoped>
.toggle-btn {
  margin-bottom: 10px;
}
.filter {
  > div {
    margin-bottom: 10px;
  }
}
</style>
