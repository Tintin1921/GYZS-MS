<template>
  <div id="container">
    <div class="right-btn">
      <div
        class="turn-btn"
        :style="currentPage===1?'cursor: not-allowed;':''"
        @click="changePdfPage('pre')"
      >
        上一页
      </div>
      <div
        class="turn-btn"
        :style="currentPage===pageCount?'cursor: not-allowed;':''"
        @click="changePdfPage('next')"
      >
        下一页
      </div>
    </div>

    <div class="pdfArea">
      <!--      <pdf-->
      <!--        v-show="loadedRatio === 1"-->
      <!--        :src="pdfURL"-->
      <!--        :page="currentPage"-->
      <!--        style="display: inline-block;width:100%"-->
      <!--        @num-pages="pageCount=$event"-->
      <!--        @progress="loadedRatio = $event"-->
      <!--        @loaded="loadPdfHandler"-->
      <!--      />-->
      <div ref="playDocx" />
      <!--      <play-video :video-src="pdfURL" />-->
    </div>
  </div>
</template>

<script>

import pdf from 'vue-pdf'
// import demo from 'pptxgenjs'
// import XLSX from "xlsx";
import playVideo from '@/views/training-file/components/playVideo.vue'
import 'video.js/dist/video-js.css'
const docx = require('docx-preview')
window.JSZip = require('jszip')

export default {
  components: {
    pdf,
    playVideo
  },
  props: {
    pdfURL: String,
    getCurrentPage: Number
  },
  data() {
    return {
      excelData: [],
      currentPage: 0,
      pageCount: 0,
      loadedRatio: 0
    }
  },
  created() {
    console.log()
    const test = this.getUrlType(this.pdfURL)
    this.currentPage = this.getCurrentPage
  },
  mounted() {
    // this.readExcel()
    // this.readDocx()
  },
  methods: {
    // async loadExcel() {
    //   const response = await fetch(this.pdfURL)
    //   const file = await response.blob()
    //   const arrayBuffer = await file.arrayBuffer()
    //   const workbook = XLSX.read(arrayBuffer, { type: 'array' })
    //   const sheetName = workbook.SheetNames[0]
    //   const worksheet = workbook.Sheets[sheetName]
    //   this.excelData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
    // },
    async readDocx() {
      const response = await fetch(this.pdfURL)
      const blob = await response.blob()
      docx.renderAsync(blob, this.$refs.playDocx)
    },
    changePdfPage(val) {
      if (val === 'pre' && this.currentPage > 1) {
        // 切换后页面回到顶部
        this.currentPage--
      } else if (val === 'next' && this.currentPage < this.pageCount) {
        this.currentPage++
      } else if (val === 'first') {
        this.currentPage = 1
      } else if (val === 'last' && this.currentPage < this.pageCount) {
        this.currentPage = this.pageCount
      }
    },
    loadPdfHandler() {
      this.currentPage = 1
    }
  }
}
</script>

<style scoped>
#container {
  overflow: auto;
  height: 100%;
  width: 100%;
  display: flex;
  position: relative;
}

.right-btn {
  position: fixed;
  right: 15%;
  bottom: 15%;
  width: 1.2rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  z-index: 99;
}

.pdfArea {
  width: 70%;
  margin: 0 auto;
}

.turn-btn {
  background-color: #3888fa;
  opacity: 0.6;
  color: #ffffff;
  height: 70px;
  width: 70px;
  border-radius: 50%;
  margin: 5px 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.turn-btn:hover,
.turn-btn:hover {
  transition: 0.3s;
  opacity: 0.5;
  cursor: pointer;
}
</style>
