<template>
  <el-form v-bind="$attr">
    <el-form-item v-for="item in rows" :key="item.label" :label="item.label">
      <template v-if="col.component" slot-scope="scope">
        <component :is="col.component" v-bind="getComponentBind(scope, col)" />
      </template>
    </el-form-item>
  </el-form>
</template>

<script>
  const defaultComponent = function() {
    return {
      functional: true,
      render(h, { props: { row, col }, _v: text }) {
        const { formatter } = col
        const v = formatter && formatter(row, col) || row[col.prop] || ''
        return text && text(v) || v
      }
    }
  }
  export default {
    name: 'XlForm',
    props: {
      rowsData: {
        require: true,
        type: Array
      }
    },
    data() {
      return {
        rows: []
      }
    },
    mounted() {
      this.rows = this.tableColumns.filter(v => !v.hidden).map(col => {
        const temp = defaultComponent()
        if (col.render) {
          temp.render = col.render
        }
        // 显示索引号，只能允许有type=index一个属性
        if (col.type === 'index') {
          return { ...col }
        }
        return {
          ...col,
          component: temp
        }
      })
    },
    methods: {
      getComponentBind({ row, column, $index }, col) {
        return { row, col, column, $index }
      }
    },
  }
</script>

<style scoped>

</style>
