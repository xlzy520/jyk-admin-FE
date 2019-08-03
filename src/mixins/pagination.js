export default {
  data() {
    return {
      pageOption: {
        pageIndex: 1,
        pageSize: 20
      },
      total: 0
    }
  },
  methods: {
    pageChange(val) {
      this.pageOption.pageIndex = val
      this.fetchData()
    },
    sizeChange(val) {
      this.pageOption.pageSize = val
      this.fetchData()
    }
  }
}
