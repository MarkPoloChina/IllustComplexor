<template>
  <div class="container">
    <div>
      <div class="item-bottom">
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
                :key="item.type"
                :label="item.type"
                :value="item.type"
              />
            </el-select>
          </div>
          <div>
            <el-select
              v-model="values.value['poly.type']"
              placeholder="选择聚合类型"
              multiple
              @change="getPolyOptions"
            >
              <el-option
                v-for="item in options['poly.type']"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div v-if="values.value['poly.type'][0]">
            <el-cascader
              v-model="polyValue"
              :options="polyOptions"
              :props="{ multiple: true }"
              :show-all-levels="false"
              placeholder="选择聚合"
              @change="handlePolyChange"
            />
          </div>
          <div>
            <el-date-picker
              v-model="illustDateAdapter"
              value-format="YYYY-MM-DD"
              type="date"
              placeholder="选择入库时间"
            />
          </div>
          <div>
            <el-select
              v-model="values.value['illust.star']"
              placeholder="选择评级"
              multiple
            >
              <el-option
                v-for="item in 6"
                :key="item - 1"
                :label="`${item - 1}星`"
                :value="item - 1"
              />
            </el-select>
          </div>
        </div>
      </transition>
    </div>
    <div>
      <div class="item-bottom">
        <el-button :icon="MessageBox" circle @click="emit('openPolyDialog')" />
      </div>
      <div class="item-bottom">
        <el-button :icon="EditPen" circle @click="emit('openUpdateDialog')" />
      </div>
      <div>
        <el-button :icon="Download" circle />
      </div>
    </div>
  </div>
</template>
<script setup>
import { API } from "@/api/api";
import {
  ArrowLeftBold,
  ArrowRightBold,
  Download,
  EditPen,
  MessageBox,
} from "@element-plus/icons-vue";

import { onMounted, reactive, ref, watch, computed } from "vue";

const show = ref(false);
const values = reactive({
  value: {
    "illust.type": [],
    "poly.type": [],
    "poly.parent": [],
    "poly.name": [],
    "illust.date": [],
    "illust.star": [],
  },
});
const options = {
  "illust.type": [],
  "poly.type": [
    {
      value: "picolt",
      label: "Picolt",
    },
    {
      value: "lnr",
      label: "LNR",
    },
    {
      value: "author",
      label: "作者专题",
    },
  ],
};
const polyOptions = ref([]);
const polyValue = ref();
watch(values, (val) => {
  emit("filter-change", val.value);
});
onMounted(() => {
  getTypeOptions();
});
const illustDateAdapter = computed({
  get: () => {
    return values.value["illust.date"][0];
  },
  set: (value) => {
    if (value) values.value["illust.date"][0] = value;
    else values.value["illust.date"].length = 0;
  },
});
const getTypeOptions = async () => {
  const data = await API.getEnumSource();
  options["illust.type"] = data;
};
const getPolyOptions = async (val) => {
  polyOptions.value.length = 0;
  if (!val) return;
  for (const p of val) {
    const polies = await API.getPoly(p);
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
  }
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
const emit = defineEmits([
  "filter-change",
  "openPolyDialog",
  "openUpdateDialog",
]);
</script>
<style lang="scss" scoped>
.container {
  height: 100%;
  @include Flex-C-JSB;
}
.item-bottom {
  margin-bottom: 10px;
}
.filter {
  > div {
    margin-bottom: 10px;
  }
}
</style>
