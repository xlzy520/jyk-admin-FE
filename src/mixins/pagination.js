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
      console.log(2);
      this.pageOption.pageIndex = val
      this.fetchData()
    },
    sizeChange(val) {
      console.log(3);
      this.pageOption.pageSize = val
      this.fetchData()
    }
  }
}
