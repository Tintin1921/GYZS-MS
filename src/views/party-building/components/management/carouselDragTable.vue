<template>
  <div class="container">
    <el-table ref="dragTable" :data="carouselItems" row-key="id" border fit highlight-current-row :height="height" style="width: 100%">
      <el-table-column label="排序" align="center" width="55px">
        <template slot-scope="{}">
          <svg-icon class="drag-handler" icon-class="drag" />
        </template>
      </el-table-column>
      <el-table-column label="标题" prop="title" align="center">
        <template slot-scope="{row}">
          <a class="blueButton" @click="handleEditorArticle(row, 'read')">{{ row.carouselTitle }}</a>
        </template>
      </el-table-column>
      <el-table-column label="类型" prop="articleCategoryName" align="center" width="150px" />
      <el-table-column label="栏目" prop="articleColumnName" align="center" width="150px" />
      <el-table-column label="发布人" prop="articleAuthorName" align="center" width="150px" />
      <el-table-column label="状态" align="center" width="150px">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isAble"
            active-text="启用"
            inactive-text="禁用"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="320px">
        <template slot-scope="{row}">
          <el-button
            type="success"
            size="mini"
            @click="handleEditorArticle(row, 'editor')"
          >
            编辑内容
          </el-button>
          <el-button
            type="success"
            size="mini"
            @click="handleOpenCarouselEditor(row)"
          >
            编辑图片
          </el-button>
          <el-button
            type="danger"
            size="mini"
            @click="handleRemoveCarouselItem(row)"
          >
            移除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button
      v-show="visibleCarouselFilter"
      type="primary"
      style="margin-top: 10px"
      @click="handleAddCarouselItem"
    >
      添加新轮播
    </el-button>

    <el-dialog
      :key="componentObj.key"
      :title="componentObj.title"
      :visible.sync="dialogDisplay"
      :destroy-on-close="true"
    >
      <tempContextEditor v-if="componentObj.name === 'tempContextEditor'" :articles="articles" :columns="columns" :category="category" />
      <pageRead v-if="componentObj.name === 'pageRead'" :article-data="articleData" />
    </el-dialog>
  </div>
</template>

<script>
import Sortable from 'sortablejs'
import {deleteCarousel, getCarousel, getContext, getEditContext} from '@/api/partyBuilding'
import pageRead from '@/views/party-building/components/partyBuilding/pageRead.vue'
import tempContextEditor from '@/views/party-building/components/management/tempContextEditor.vue'
import { generateID } from '@/utils/generateID'

export default {
  components: { tempContextEditor, pageRead },
  props: {
    visibleCarouselFilter: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      height: '30vh',
      sortable: null,
      dialogDisplay: false,
      columns: [],
      category: [],
      articles: {},
      articleData: {},
      // 轮播图展示数据
      carouselItems: [],
      componentObj: {
        key: '',
        title: '',
        name: ''
      }
    }
  },
  watch: {
    visibleCarouselFilter: {
      handler(val) {
        val ? this.height = '26vh' : this.height = '30vh'
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      getCarousel().then(res => {
        const { data } = res
        this.carouselItems = data
      })
      this.$nextTick(() => {
        this.setSort()
      })
    },
    setSort() {
      const el = this.$refs.dragTable.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
      this.sortable = Sortable.create(el, {
        ghostClass: 'sortable-ghost',
        setData: function(dataTransfer) {
          dataTransfer.setData('Text', '')
        },
        onEnd: evt => {
          const targetRow = this.carouselItems.splice(evt.oldIndex, 1)[0]
          this.carouselItems.splice(evt.newIndex, 0, targetRow)
        }
      })
    },
    async handleEditorArticle(row, e) {
      this.loading = true
      const { articleId, articleColumnId, articleCategoryId } = row
      if (e === 'read') {
        await getContext(articleId).then(res => {
          const { data } = res
          this.articleData = data
          this.loading = false
          this.setComponentObj('预览文章', 'pageRead')
        })
      } else {
        await getEditContext(articleId).then(res => {
          const { data } = res
          this.articles = {
            ...data,
            columnId: articleColumnId,
            categoryId: articleCategoryId
          }
          this.setComponentObj('编辑文章', 'tempContextEditor')
        })
      }
    },
    handleOpenCarouselEditor() {
      console.log('ok')
    },
    handleAddCarouselItem() {
      this.$emit('setComponentObj', '添加轮播', 'addCarouselItem', '70')
    },
    handleRemoveCarouselItem(row) {
      this.$confirm('确认移除该条吗？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const { carouselId } = row
        deleteCarousel(carouselId).then(() => {
          this.$message.success('删除成功')
        })
      }).catch(() => {
        this.$message.error('用户取消操作')
      })
    },
    // 对于dialog的动态使用
    setComponentObj(title, name) {
      this.componentObj.title = title
      this.componentObj.name = name
      // this.componentObj.width = width + '%'
      this.componentObj.key = generateID()
      this.dialogDisplay = true
    }
  }
}
</script>

<style scoped>
.container {
  height: 30vh;
}

.drag-handler{
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.blueButton {
  color: #409eff;
}

.blueButton:hover {
  color: #82b4e7;
}
</style>
