<template lang="html">
  <p class="empty">{{ emptyMessage }}</p>
</template>

<script>
export default {
  computed: {
    // emptyMessage: function() {
    emptyMessage() {
      // index.js内のstateオブジェクトの中にあるemptyMessageの値を取得している
      // emptyMessageメソッドが実行された時にsetEmptyMessageメソッドを実行してemptyMessageを表示させる
      return this.$store.state.emptyMessage;
    },
  },
};
</script>

<style lang="scss" scoped>
.empty {
  font-size: 14px;
  text-align: center;
}
</style>
