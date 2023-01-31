<template>
  <div class="viewer-container">
    <div class="title">视图</div>
    <div class="main">
      <div class="col selector-col">
        <ViewerFilter
          @filter-change="handleFilterChange"
          @openPolyDialog="show.poly = true"
          @openUpdateDialog="show.update = true"
        ></ViewerFilter>
      </div>
      <div class="col main-and-func-col">
        <div class="main-row">
          <ViewerMain
            :list="illustList"
            ref="viewerMain"
            @select-change="currentSelected.value = $event"
          ></ViewerMain>
        </div>
        <div class="func-row">
          <ViewerFunctions
            :illust-count="illustCount"
            @page-change="
              viewerMain.handleResetScroll();
              getIllusts($event);
            "
            @viewer-type-change="viewerMain && viewerMain.handleSetType($event)"
            @focus-up="viewerMain.handleFocusIndexChange('up')"
            @focus-down="viewerMain.handleFocusIndexChange('down')"
          ></ViewerFunctions>
        </div>
      </div>
      <div class="col info-col">
        <ViewerInfo
          :info="currentSelected.value"
          @update:info="handleSingleIllustChange"
          @close="currentSelected.value = null"
        ></ViewerInfo>
      </div>
    </div>
    <MetaForm
      v-model="show.update"
      @confirm="handleUpdate"
      ref="metaForm"
      type="viewer"
    ></MetaForm>
    <PolyForm
      v-model="show.poly"
      @confirm="handlePoly"
      ref="polyForm"
      type="viewer"
    ></PolyForm>
  </div>
</template>
<script setup>
import { API } from "@/api/api";
import ViewerMain from "@/components/icxorViewer/viewerMain.vue";
import ViewerFilter from "@/components/icxorViewer/viewerFilter.vue";
import ViewerFunctions from "@/components/icxorViewer/viewerFunctions.vue";
import ViewerInfo from "@/components/icxorViewer/viewerInfo.vue";
import { onMounted, ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import MetaForm from "@/components/reusable/metaForm.vue";
import PolyForm from "@/components/reusable/polyForm.vue";

const show = reactive({
  poly: false,
  update: false,
});
const illustList = ref([]);
const illustCount = ref(1000);
const currentSelected = reactive({ value: null });
const viewerMain = ref();
const filter = reactive({
  filterObj: {},
});
onMounted(() => {
  getIllusts();
  getIllustsCount();
});
const getIllusts = async (page = 1, condition = {}) => {
  let list = await API.getIllusts(
    condition,
    100,
    (page - 1) * 100,
    "meta.pid",
    1
  );
  if (list) {
    illustList.value = list;
  }
  return list;
};
const getIllustsCount = async (condition = {}) => {
  let { count } = await API.getIllustsCount(condition);
  illustCount.value = parseInt(count);
  return count;
};
const handleFilterChange = (_filter) => {
  getIllusts(1, _filter);
  getIllustsCount(_filter);
  filter.filterObj = _filter;
};
const handleSingleIllustChange = (obj) => {
  API.updateIllustsById([obj])
    .then((data) => {
      if (data.code === 200000) {
        if (data.data[0].status == "success") {
          ElMessage.success("修改成功");
        } else {
          ElMessage.error(`修改失败：${data.data[0].message}`);
        }
      } else {
        ElMessage.error("服务器错误");
      }
    })
    .catch((err) => {
      ElMessage.error(`网络错误：${err}`);
    });
};
const handleUpdate = ({ data, controller }) => {
  if (!controller) {
    const idto = viewerMain.value.getSelections();
    if (idto.length == 0) ElMessage.error("项目为空");
    else {
      ElMessageBox.confirm(
        `将为${idto.length}个项目进行更新，确认？`,
        "Warning",
        {
          confirmButtonText: "OK",
          cancelButtonText: "Cancel",
          type: "warning",
        }
      )
        .then(() => {
          let dto = [];
          idto.forEach((ele) => {
            dto.push({
              id: ele.id,
              ...data,
            });
          });
          API.updateIllustsById(dto).then((data) => {
            if (data.code == 200000) {
              ElMessage.success("操作成功");
              getIllusts();
              getIllustsCount();
            }
          });
        })
        .catch(() => {});
    }
  } else {
    if (illustCount.value == 0) ElMessage.error("项目为空");
    else {
      ElMessageBox.confirm(
        `将为符合条件的${illustCount.value}个项目更新元，确认？`,
        "Warning",
        {
          confirmButtonText: "OK",
          cancelButtonText: "Cancel",
          type: "warning",
        }
      )
        .then(() => {
          API.updateIllustsByCondition(filter.filterObj, { ...data }).then(
            (data) => {
              if (data.code == 200000) {
                ElMessage.success("操作成功");
                getIllusts();
                getIllustsCount();
                filter.filterObj = {};
              }
            }
          );
        })
        .catch(() => {});
    }
  }
};
const handlePoly = ({ data, controller }) => {
  if (!controller) {
    const dto = viewerMain.value.getSelections();
    if (dto.length == 0) ElMessage.error("项目为空");
    else {
      ElMessageBox.confirm(
        `将为${dto.length}个项目创建或添加聚合，确认？`,
        "Warning",
        {
          confirmButtonText: "OK",
          cancelButtonText: "Cancel",
          type: "warning",
        }
      )
        .then(() => {
          API.addPolyById(data.type, data.parent, data.name, dto).then(
            (data) => {
              if (data.code == 200000) {
                ElMessage.success("操作成功");
                getIllusts();
                getIllustsCount();
              }
            }
          );
        })
        .catch(() => {});
    }
  } else {
    if (illustCount.value == 0) ElMessage.error("项目为空");
    else {
      ElMessageBox.confirm(
        `将为符合条件的${illustCount.value}个项目创建或添加聚合，确认？`,
        "Warning",
        {
          confirmButtonText: "OK",
          cancelButtonText: "Cancel",
          type: "warning",
        }
      )
        .then(() => {
          API.addPolyByCondition(
            data.type,
            data.parent,
            data.name,
            filter.filterObj
          ).then((data) => {
            if (data.code == 200000) {
              ElMessage.success("操作成功");
              getIllusts();
              getIllustsCount();
              filter.filterObj = {};
            }
          });
        })
        .catch(() => {});
    }
  }
};
</script>
<style lang="scss" scoped>
.viewer-container {
  @include Uni-Main-Container;
  overflow: auto;
  .title {
    @include Uni-Main-Title;
    flex: none;
  }
  .main {
    padding: 0;
    flex: auto;
    position: relative;
    display: flex;
    flex-direction: row;
    overflow: auto;
    .col {
      position: relative;
      padding: 10px 10px 10px 10px;
      margin: 0 3px 0 3px;
      border-radius: 8px;
      background-color: rgba(128, 128, 128, 0.15);
      height: calc(100% - 20px);
      &.selector-col {
        margin-left: 0;
        flex: none;
      }
      &.main-and-func-col {
        flex: auto;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: stretch;
        overflow: hidden;
        .main-row {
          flex: auto;
          overflow: hidden;
        }
        .func-row {
          align-self: center;
          flex: none;
          width: 100%;
        }
      }
      &.info-col {
        margin-right: 0;
        flex: none;
        padding: 0;
        height: 100%;
      }
    }
  }
}
</style>
