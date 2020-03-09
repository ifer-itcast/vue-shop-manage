<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 警告区域 -->
      <el-alert :closable="false" title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon></el-alert>
      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 选择商品分类的级联选择框 -->
          <el-cascader
            expand-trigger="hover"
            :options="catelist"
            :props="cateProps"
            v-model="selectedCateKeys"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tab 标签 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 添加动态参数面板 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled">添加参数</el-button>
        </el-tab-pane>
        <!-- 添加静态属性面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled">添加属性</el-button>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      catelist: [],
      // 级联选择框的配置对象
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 级联选择框双向绑定到的数组
      selectedCateKeys: [],
      // 被激活的页签的名称
      activeName: 'many'
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败')
      }
      // 获取商品分类成功
      this.catelist = res.data
    },
    // 级联选择框选中项变化会触发
    async handleChange() {
      if (this.selectedCateKeys.length !== 3) {
        // 证明选中的不是 3 级分类
        this.selectedCateKeys = []
        return false
      }
      // 选中的是 3 级分类
      // 根据所选分类的 ID，和当前所处的面板，获取对应的参数
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
        params: {
          sel: this.activeName
        }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数列表失败')
      }
      console.log(res.data)
    },
    // Tab 页签点击时触发
    handleTabClick() {
      console.log(this.activeName)
    }
  },
  computed: {
    // 如果按钮需要被禁用，则返回 true，否则返回 false
    isBtnDisabled() {
      if (this.selectedCateKeys.length !== 3) {
        return true
      } else {
        return false
      }
    },
    // 当前选中的 3 级分类的 ID
    cateId() {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2]
      }
      return null
    }
  }
}
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}
</style>
