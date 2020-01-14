import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    todos: [],
    todoFilter: '',
    targetTodo: {
      id: null,
      title: '',
      detail: '',
      completed: '',
    },
    // 初期値で文字が入っていたので空にした
    errorMessage: '',
    emptyMessage: '',
  },
  // 読み取り専用
  getters: {
    completedTodos: state => state.todos.filter(todo => todo.completed),
    incompleteTodos: state => state.todos.filter(todo => !todo.completed),
    completedTodosLength: (state, getters) => getters.completedTodos.length,
    incompleteTodosLength: (state, getters) => getters.incompleteTodos.length,
  },
  // コンポーネントでstateの中の値を変えるとdataの追跡がし難くなる。
  // mutationsの中でしかstateの値を変えられないようにする
  // 第2引数にはcommitから引き渡された値が入ってくる
  mutations: {
    setTodoFilter(state, routeName) {
      state.todoFilter = routeName;
    },
    setEmptyMessage(state, routeName) {
      if (routeName === 'completedTodos') {
        this.state.emptyMessage = '完了済みのやることリストはありません。';
      } else if (routeName === 'incompleteTodos') {
        this.state.emptyMessage = '未完了のやることリストはありません。';
      } else {
        this.state.emptyMessage = 'やることリストには何も登録されていません。';
      }
    },
    initTargetTodo(state) {
      state.targetTodo = {
        id: null,
        title: '',
        detail: '',
        completed: false,
      };
    },
    hideError(state) {
      state.errorMessage = '';
    },
    showError(state, payload) {
      if (payload) {
        // 修正前は変数の"errorMessage"に代入していたのでstate内の"errorMessage"へ代入するように修正
        // const errorMessage = payload.data;
        state.errorMessage = payload.data;
      } else {
        state.errorMessage = 'ネットに接続がされていない、もしくはサーバーとの接続がされていません。ご確認ください。';
      }
    },
    updateTargetTodo(state, { name, value }) {
      state.targetTodo[name] = value;
    },
    getTodos(state, payload) {
      state.todos = payload.reverse();
    },
    addTodo(state, payload) {
      // console.log('addtest');
      state.todos.unshift(payload);
    },
    showEditor(state, payload) {
      state.targetTodo = Object.assign({}, payload);
    },
    editTodo(state, payload) {
      state.todos = state.todos.map((todoItem) => {
        if (todoItem.id === payload.data.id) return payload.data;
        return todoItem;
      });
    },
  },
  // dispatchでactions内のメソッドを実行する
  actions: {
    setTodoFilter({ commit }, routeName) {
      commit('setTodoFilter', routeName);
    },
    setEmptyMessage({ commit }, routeName) {
      commit('setEmptyMessage', routeName);
    },
    updateTargetTodo({ commit }, { name, value }) {
      commit('updateTargetTodo', { name, value });
    },
    getTodos({ commit }) {
      axios.get('http://localhost:3000/api/todos/').then(({ data }) => {
        commit('getTodos', data.todos);
        // TOdo一覧が取得できた時にmutations内のhideErrorを実行
        commit('hideError');
      }).catch((err) => {
        commit('showError', err.response);
      });
    },
    addTodo({ commit, state }) {
      // state内の"targetTodo.title"または"targetTodo.detail"の値が空の時にifの処理に入る
      if (!state.targetTodo.title || !state.targetTodo.detail) {
        // mutations内のshowErrorメソッドを実行して値を渡す為にcommitでメソッド呼び出しを行い、値を引き渡す
        commit({
          type: 'showError',
          data: 'タイトルと内容はどちらも必須項目です。',
        });
        return;
      }
      const postTodo = Object.assign({}, {
        title: state.targetTodo.title,
        detail: state.targetTodo.detail,
      });
      axios.post('http://localhost:3000/api/todos/', postTodo).then(({ data }) => {
        commit('addTodo', data);
        // Todoを登録した時にmutations内のhideErrorを実行
        commit('hideError');
      }).catch((err) => {
        commit('showError', err.response);
      });
      commit('initTargetTodo');
    },
    changeCompleted({ commit }, todo) {
      const targetTodo = Object.assign({}, todo);
      axios.patch(`http://localhost:3000/api/todos/${targetTodo.id}`, {
        completed: !targetTodo.completed,
      }).then(({ data }) => {
        commit('editTodo', {
          data,
        });
        // 完了、未完了の表示を切り替えた時にmutations内のhideErrorを実行
        commit('hideError');
      }).catch((err) => {
        commit('showError', err.response);
      });
      commit('initTargetTodo');
    },
    showEditor({ commit }, todo) {
      commit('showEditor', todo);
      // commit('hideError');
    },
    editTodo({ commit, state }) {
      const targetTodo = state.todos.find(todo => todo.id === state.targetTodo.id);
      if (
        targetTodo.title === state.targetTodo.title
        && targetTodo.detail === state.targetTodo.detail
      ) {
        commit('initTargetTodo');
        return;
      }
      axios.patch(`http://localhost:3000/api/todos/${state.targetTodo.id}`, {
        title: state.targetTodo.title,
        detail: state.targetTodo.detail,
      }).then(({ data }) => {
        // commit('editTodo', data);
        commit('editTodo', {
          data,
        });
        // Todoを編集した時にmutations内のhideErrorを実行
        commit('hideError');
      }).catch((err) => {
        commit('showError', err.response);
      });
      commit('initTargetTodo');
    },
    maeta() {

    },
    // 非同期処理が終わってからPromiseを返す
    deleteTodo({ commit }, todoId) {
      // returnでPromiseオブジェクトを返している
      return new Promise((resolve) => {
        // Promiseオブジェクトが返ってきたらthenの処理に入り、返り値がdataに入る
        axios.delete(`http://localhost:3000/api/todos/${todoId.id}`).then(() => {
          // オブジェクト
          // 処理
          // deleteが成功した時にactionのgetTodoメソッドを実行
          // commit修正する
          // this.dispatch('getTodos');
          // Todoを削除した時にmutations内のhideErrorを実行
          commit('hideError');
          // resolveを実行して
          resolve();
        }).catch((err) => {
          // 処理
          // deleteが失敗した時にエラー内容を表示
          // 必要があれば処理
          // タイトルと詳細に入力されている値を初期化する
          commit('showError', err.response);
        });
        commit('initTargetTodo');
      });
    },
  },
});

export default store;
