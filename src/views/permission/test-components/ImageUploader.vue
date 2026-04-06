<template>
  <div class="image-uploader">
    <div
      class="upload-zone"
      :class="{ 'drag-over': isDragOver }"
      @click="selectFile"
      @dragover.prevent="onDragOver"
      @dragleave.prevent="onDragLeave"
      @drop.prevent="onDrop"
    >
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        style="display: none"
        @change="onFileChange"
      >
      <div class="upload-zone-content">
        <i class="fas fa-cloud-upload-alt upload-icon" />
        <p class="upload-text">點擊或拖曳圖片到此上傳</p>
        <p class="upload-subtext">(支援 jpg, png，最大 {{ (maxFileSize / (1024*1024)).toFixed(1) }}MB)</p>
      </div>
    </div>

    <transition name="fade">
      <div v-if="imageUrl" class="cropper-wrapper">
        <div class="cropper-mask" />
        <vue-cropper
          ref="cropper"
          :src="imageUrl"
          :style="{ maxHeight: '400px', width: '100%' }"
          :aspect-ratio="aspectRatio"
          :auto-crop-area="1"
          :view-mode="1"
          :background="true"
          :responsive="true"
        />
        <div class="crop-controls">
          <el-button class="control-btn" icon="el-icon-refresh-right" @click="rotateRight" />
          <el-button class="control-btn" icon="el-icon-refresh-left" @click="rotateLeft" />
          <el-button class="control-btn primary" icon="el-icon-check" @click="doCrop">裁剪 & 上傳</el-button>
          <el-button class="control-btn" @click="cancelCrop">取消</el-button>
        </div>
      </div>
    </transition>

    <transition name="fade">
      <div v-if="croppedImageUrl" class="preview">
        <p class="preview-label">預覽裁剪結果：</p>
        <img :src="croppedImageUrl" alt="Cropped Preview" class="preview-img">
      </div>
    </transition>

    <div v-if="uploading" class="overlay-loading">
      <div class="spinner" />
      <p>上傳中...</p>
    </div>

    <div v-if="errorMsg" class="error">{{ errorMsg }}</div>
  </div>
</template>

<script>
import VueCropper from 'vue-cropperjs'
import 'cropperjs/dist/cropper.css'
// 如果你有 icon library，例如 FontAwesome，確保已載入

export default {
  name: 'ImageUploader',
  components: { VueCropper },
  props: {
    aspectRatio: {
      type: Number,
      default: 1
    },
    uploadUrl: {
      type: String,
      required: true
    },
    maxFileSize: {
      type: Number,
      default: 5 * 1024 * 1024
    }
  },
  data() {
    return {
      imageFile: null,
      imageUrl: null,
      croppedImageUrl: null,
      uploading: false,
      errorMsg: '',
      isDragOver: false
    }
  },
  methods: {
    selectFile() {
      this.$refs.fileInput.click()
    },
    onDragOver() {
      this.isDragOver = true
    },
    onDragLeave() {
      this.isDragOver = false
    },
    onDrop(e) {
      this.isDragOver = false
      const files = e.dataTransfer.files
      if (files && files[0]) {
        this.handleFile(files[0])
      }
    },
    onFileChange(e) {
      const file = e.target.files[0]
      if (file) {
        this.handleFile(file)
      }
    },
    handleFile(file) {
      this.errorMsg = ''
      if (file.size > this.maxFileSize) {
        this.errorMsg = `檔案大小不能超過 ${(this.maxFileSize / (1024 * 1024)).toFixed(1)}MB`
        return
      }
      if (!file.type.match(/^image\//)) {
        this.errorMsg = '僅支援圖片檔案'
        return
      }
      this.imageFile = file
      const reader = new FileReader()
      reader.onload = (evt) => {
        this.imageUrl = evt.target.result
      }
      reader.readAsDataURL(file)
    },
    rotateLeft() {
      this.$refs.cropper.rotate(-90)
    },
    rotateRight() {
      this.$refs.cropper.rotate(90)
    },
    doCrop() {
      const canvas = this.$refs.cropper.getCroppedCanvas({
        // 你可以设定输出尺寸如果需要
      })
      if (!canvas) {
        this.errorMsg = '裁剪失敗'
        return
      }
      this.croppedImageUrl = canvas.toDataURL(this.imageFile.type || 'image/png')
      canvas.toBlob((blob) => {
        this.uploadCropped(blob)
      }, this.imageFile.type || 'image/png')
    },
    cancelCrop() {
      this.imageUrl = null
      this.imageFile = null
      this.croppedImageUrl = null
      this.errorMsg = ''
    },
    uploadCropped(blob) {
      this.uploading = true
      this.errorMsg = ''
      const formData = new FormData()
      const filename = this.imageFile.name || `cropped_${Date.now()}.png`
      formData.append('file', blob, filename)
      this.$axios.post(this.uploadUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .then(response => {
          this.uploading = false
          this.$emit('uploaded', response.data)
        })
        .catch(err => {
          this.uploading = false
          this.errorMsg = '上傳失敗'
          console.error(err)
        })
    }
  }
}
</script>

<style scoped>
.image-uploader {
  position: relative;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  max-width: 500px;
  margin: auto;
  background-color: #fafafa;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.upload-zone {
  border: 2px dashed #bbb;
  border-radius: 8px;
  padding: 40px;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.3s, background-color 0.3s;
  background-color: #fff;
}

.upload-zone.drag-over {
  border-color: #409eff;
  background-color: #f0f8ff;
}

.upload-icon {
  font-size: 48px;
  color: #bbb;
}

.upload-text {
  margin-top: 10px;
  font-size: 16px;
  color: #666;
}

.upload-subtext {
  margin-top: 4px;
  font-size: 12px;
  color: #999;
}

.cropper-wrapper {
  margin-top: 20px;
  position: relative;
}

/* optional: 背景遮罩效果，让裁剪区域外略暗 */
/* .cropper-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.3);
  pointer-events: none;
} */

.crop-controls {
  margin-top: 12px;
  display: flex;
  justify-content: center;
  gap: 10px;
}

.control-btn {
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  background-color: #fff;
  color: #333;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}

.control-btn:hover {
  background-color: #f5f5f5;
}

.control-btn.primary {
  background-color: #409eff;
  color: white;
}

.control-btn.primary:hover {
  background-color: #66b1ff;
}

.preview {
  margin-top: 20px;
  text-align: center;
}

.preview-label {
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
}

.preview-img {
  max-width: 100%;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

.error {
  margin-top: 16px;
  color: #f56c6c;
  text-align: center;
}

.overlay-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255,255,255,0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}

.spinner {
  border: 4px solid #f3f3f3; /* Light grey */
  border-top: 4px solid #409eff; /* Blue */
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
