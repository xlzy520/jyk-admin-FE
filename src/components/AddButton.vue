<template>
  <div class="add-button" @click="add">
    <i class="el-icon-plus" />
  </div>
</template>

<script>
export default {
  name: 'AddButton',
  methods: {
    add() {
      this.$emit('add')
    }
  }
}
</script>

<style scoped>
.add-button{
  position: fixed;
  right: 40px;
  bottom: 60px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #2d8cf0;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 22px;
  cursor: pointer;
  z-index: 3000;
}
</style>
