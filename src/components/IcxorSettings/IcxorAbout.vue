<template>
  <el-scrollbar height="calc(100% - 80px)">
    <div class="about">
      <el-image :src="url" class="home-img" style="width: 200px"></el-image>
      <div class="home-title">Illust Complexor</div>
      <div class="home-title-2">Powered by MPSTO</div>
      <div class="version">Ver. Beta {{ packageJson.version }}</div>
      <div class="about-info">
        <div class="title">Staff</div>
        <div class="info">
          Designed by
          <el-link
            type="primary"
            href=""
            @click="linkClick('https://github.com/MarkPoloChina')"
            style="
              vertical-align: baseline;
              --el-link-text-color: #2e89c0;
              --el-link-hover-text-color: #5dabdc;
            "
            >Mark Polo</el-link
          >
        </div>
        <div class="title">Thanks</div>
        <div class="info">
          <div>
            The Image "Cat with Vue Logo" Created by
            <el-link
              type="primary"
              href=""
              @click="linkClick('https://github.com/RockRockWhite')"
              style="
                vertical-align: baseline;
                --el-link-text-color: #ff840c;
                --el-link-hover-text-color: #ffa40c;
              "
              >RockRockWhite</el-link
            >
          </div>
          <div style="margin-top: 5px">
            The Origin of Image "Cat with Vue Logo" Illusted by
            <el-link
              style="vertical-align: baseline"
              type="info"
              href=""
              @click="linkClick('https://www.pixiv.net/users/3036679')"
              >甘城なつき</el-link
            >
            in
            <el-link
              style="vertical-align: baseline"
              type="info"
              href=""
              @click="linkClick('https://www.pixiv.net/artworks/87790894')"
              >Pixiv</el-link
            >
          </div>
          <div style="margin-top: 5px">
            Speical Thanks to Dr.Lai for the Project
            <el-link
              style="vertical-align: baseline"
              type="info"
              href=""
              @click="linkClick('https://github.com/Creator-SN/IKFBIKFB')"
              >IKFB</el-link
            >
          </div>
          <div style="margin-top: 5px">
            Speical Thanks to <span style="color: #cc696b">Seven</span>
          </div>
        </div>
        <div class="title">LICENSE</div>
        <div class="info">
          <div>Illust Complexor is licensed under the GNU GPL v3.0.</div>
          <br />
          <div class="single-info">
            <svg
              viewBox="0 0 128 128"
              width="25"
              height="25"
              style="margin-right: 5px"
            >
              <path
                fill="#42b883"
                d="M78.8,10L64,35.4L49.2,10H0l64,110l64-110C128,10,78.8,10,78.8,10z"
                data-v-904800b4=""
              ></path>
              <path
                fill="#35495e"
                d="M78.8,10L64,35.4L49.2,10H25.6L64,76l38.4-66H78.8z"
                data-v-904800b4=""
              ></path>
            </svg>
            <div>Vue.js - The MIT License</div>
          </div>
          <div class="single-info">
            <img
              src="https://element-plus.gitee.io/images/element-plus-logo.svg"
              style="height: 25px; margin-right: 5px"
            />Element Plus - The MIT License
          </div>
          <div class="single-info">
            <img
              src="https://www.electronjs.org/assets/img/logo.svg"
              style="height: 25px; margin-right: 5px"
            />Electron - The MIT License
          </div>
        </div>
        <div class="title">Visit more</div>
        <div class="info">
          <div>
            <el-link
              type="info"
              href=""
              @click="
                linkClick('https://github.com/MarkPoloChina/IllustComplexor')
              "
              >Project in Github</el-link
            >
          </div>
          <div>
            <el-link
              type="primary"
              href=""
              @click="linkClick('https://markpolo.cn/')"
              style="
                --el-link-text-color: #2e89c0;
                --el-link-hover-text-color: #5dabdc;
              "
              >Website</el-link
            >
          </div>
        </div>
        <div class="cpr">© Copyright MarkPolo Studio, all rights reserved.</div>
      </div>
    </div>
  </el-scrollbar>
</template>
<script setup>
import packageJson from "../../../package.json";
import { shell } from "electron";
import url from "@/assets/logo.png";
const linkClick = (url) => {
  shell.openExternal(url);
};
</script>
<style lang="scss" scoped>
.about {
  @include Flex-C-AC;
  .home-img {
    width: 40%;
    margin-bottom: 20px;
  }
  .home-title {
    font-size: 40px;
    font-weight: bolder;
  }
  .home-title-2 {
    font-size: 25px;
  }
  .version {
    font-size: 20px;
    border: 1px solid black;
    border-radius: 5px;
    padding: 2px 5px 2px 5px;
  }
  .about-info {
    text-align: center;
    .info {
      :deep(.el-link) {
        font-size: 16px;
      }
      .single-info {
        @include Flex-RCT;
      }
    }
    .title {
      font-size: 22px;
      margin: 20px 0 10px 0;
    }
    .cpr {
      margin-top: 35px;
    }
  }
}
</style>
