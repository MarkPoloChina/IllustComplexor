<template>
  <el-tabs
    tab-position="left"
    class="viewer-imgs"
    v-if="lnr.length != 0"
    v-model="currentKey"
  >
    <el-tab-pane
      :label="item.name"
      v-for="(item, index) in lnr"
      :key="index"
      lazy
      @contextmenu.prevent="handleRightClick"
    >
      <GridViewer
        @showInfo="getInfo"
        :list="item.list"
        @remove="handleRemove"
      ></GridViewer>
    </el-tab-pane>
  </el-tabs>
  <el-empty description="无插图" v-else />
  <info-viewer v-model="dialogVisible" :info="currentInfo.value"></info-viewer>
</template>
<script setup>
import InfoViewer from "./reusable/InfoViewer.vue";
import GridViewer from "./reusable/gridViewer.vue";
import { onMounted, reactive, ref } from "vue";
import { API } from "@/api/api";
import { ElMessage, ElMessageBox } from "element-plus";
import { ipcRenderer } from "electron";
const currentKey = ref("0");

const lnr = reactive([]);
const dialogVisible = ref(false);
const currentInfo = reactive({ value: null });
onMounted(() => {
  getData();
});
const getData = async () => {
  lnr.length = 0;
  const data = await API.getPolyWithIllust("lnr");
  data.forEach((item) => {
    lnr.push({
      id: item.id,
      name: item.parent ? `${item.parent}-${item.name}` : item.name,
      list: item.illusts,
    });
  });
};
// const handleSortChange = (item, value) => {
//   if (value.startsWith("bookCnt"))
//     item.list.sort((a, b) => {
//       return value.indexOf("Down") == -1
//         ? a.bookCnt - b.bookCnt
//         : b.bookCnt - a.bookCnt;
//     });
//   else if (value.startsWith("default"))
//     item.list.sort((a, b) => {
//       return value.indexOf("Down") == -1 ? a.pid - b.pid : b.pid - a.pid;
//     });
// };
const handleRightClick = (event) => {
  event.preventDefault();
  ipcRenderer.removeAllListeners("context:click");
  ipcRenderer.once("context:click", (event, item) => {
    switch (item) {
      case "详情":
        break;
      case "删除当前聚合":
        handleDeletePoly();
        break;
      default:
        break;
    }
  });
  ipcRenderer.send("context:popup", [
    { label: "详情" },
    { label: "删除当前聚合" },
  ]);
};
const getInfo = (obj) => {
  currentInfo.value = obj;
  if (currentInfo.value) dialogVisible.value = true;
};
const handleRemove = (obj) => {
  ElMessageBox.confirm("将从本聚合移除该图，确认？", "Warning", {
    confirmButtonText: "OK",
    cancelButtonText: "Cancel",
    type: "warning",
  })
    .then(() => {
      API.removePolyById(lnr[currentKey.value].id, [obj.id])
        .then(async (data) => {
          if (data.code == 200000) {
            ElMessage.success("移除成功");
            const data = await API.getPolyWithIllust("lnr");
            data.forEach((item) => {
              if (item.id == lnr[currentKey.value].id)
                lnr[currentKey.value].list = item.illusts;
            });
          }
        })
        .catch(() => {
          ElMessage.error("网络错误");
        });
    })
    .catch(() => {});
};
const handleDeletePoly = () => {
  ElMessageBox.confirm("将删除本聚合，确认？", "Warning", {
    confirmButtonText: "OK",
    cancelButtonText: "Cancel",
    type: "warning",
  })
    .then(() => {
      API.deletePoly(lnr[currentKey.value].id)
        .then((data) => {
          if (data.code == 200000) {
            ElMessage.success("删除成功");
            getData();
          }
        })
        .catch(() => {
          ElMessage.error("网络错误");
        });
    })
    .catch(() => {});
};
</script>
<style lang="scss" scoped>
.viewer-imgs {
  height: 100%;

  > :deep(.el-tabs__content) {
    height: 100%;
  }
}
</style>
