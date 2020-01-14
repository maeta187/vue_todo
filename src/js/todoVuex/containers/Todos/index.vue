<template lang="html">
  <app-wrapper>
    <app-navi />
    <app-register v-if="todoFilter !== 'completedTodos'" />
    <!-- <app-error-message/> -->
    <app-error-message
      v-if="errorMessage"
    />
    <template v-slot:todos>
      <app-list v-if="todos.length" :todos="todos" />
      <!-- <app-empty-message /> -->
      <app-empty-message
        v-else
      />
    </template>
  </app-wrapper>
</template>

<script>
import Wrapper from 'TodoVuexDir/components/Wrapper';
// Naviのコンポーネントをインポートする
import Navi from 'TodoVuexDir/components/Navi';
import { ErrorMessage, EmptyMessage } from 'TodoVuexDir/components/Message';
import Register from 'TodoVuexDir/components/Register';
import List from 'TodoVuexDir/components/List';

export default {
  // ここの名称とHTMLタグが紐づいている
  components: {
    appWrapper: Wrapper,
    appNavi: Navi,
    appErrorMessage: ErrorMessage,
    appEmptyMessage: EmptyMessage,
    appList: List,
    appRegister: Register,
  },
  computed: {
    todoFilter: function() {
      return this.$store.state.todoFilter;
    },
    todos: function() {
      if (this.todoFilter === 'allTodos') {
        return this.$store.state.todos;
      }
      return this.$store.getters[this.todoFilter];
    },
    // store内のerrorMessageと紐づいているのでプロパティの値が変わったときにこのメソッドが実行される
    errorMessage: function() {
      return this.$store.state.errorMessage;
    },
  },
  watch: {
    todos: function(todos) {
      // todosの配列の長さが無い(0)の時にifの処理に入っていく
      // mutations内の"setEmptyMessage"をdispatchで実行している
      if (!todos.length) this.$store.dispatch('setEmptyMessage', this.todoFilter);
    },
    $route: function(to) {
      this.$store.dispatch('setTodoFilter', to.name);
    },
  },
  created: function() {
    this.$store.dispatch('getTodos');
    this.$store.dispatch('setTodoFilter', this.$route.name);
  },
};
</script>
