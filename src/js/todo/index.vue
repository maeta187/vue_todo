<template lang="html">
  <div class="todo__wrapper">
    <div class="todo__inner">
      <header class="header">
        <h1 class="header__title">やることリスト</h1>
      </header>
      <main class="main">
        <!-- submitされた時に実行される処理を書いている
        targetTodo.idがtrue(idがあれば)editTodoメソッド、false(idが無ければ)addTodoメソッドを実行する -->
        <!-- 意図しない画面変異を起こさない為に.preventを使う -->
        <form
          class="register"
          @submit.prevent="targetTodo.id ? editTodo() : addTodo()"
        >
          <div class="register__input">
            <p class="register__input__title">やることのタイトル</p>
            <!-- 登録ボタンを押した時に、targetTodo.titleの値を双方向バインディングしている
            (inputから変更された値をバインディングしてtargetTodo.titleの更新を行い、
            更新されたtargetTodo.titleをバインディングしてinputへ入れる) -->
            <input
              v-model="targetTodo.title"
              type="text"
              name="title"
              placeholder="ここにTODOのタイトルを記入してください"
              required
            >
          </div>
          <div class="register__input">
            <p class="register__input__title">やることの内容</p>
            <!-- targetTodo.detailの値を双方向バインディングしている -->
            <textarea
              v-model="targetTodo.detail"
              name="detail"
              rows="3"
              placeholder="ここにTODOの内容を記入してください。改行は半角スペースに変換されます。"
              required
            />
            </div>
            <div class="register__submit">
              <button class="register__submit__btn" type="submit" name="button">
                <!-- targetTodo.idの有無でボタンの表示名称を変更 -->
                <template v-if="targetTodo.id">
                  <span>変更する</span>
                </template>
                <template v-else>
                  <span>登録する</span>
                </template>
              </button>
            </div>
          </form>
          <!-- errorMessage内に値が代入されたらifの処理がされる -->
        <div v-if="errorMessage" class="error">
            <!-- "errorMessage"に代入された値を表示する -->
          <p class="error__text">{{ errorMessage }}</p>
        </div>
        <div class="todos">
          <!-- 配列の長さを取得できたら(0以上)v-ifの処理の中に入る -->
          <template v-if="todos.length">
            <ul class="todos__list">
              <!-- 完了になるとグレーアウトする -->
              <!-- v-for="todo in todos":dataのtodosプロパティの配列の数だけループさせて、todoへ代入している -->
              <!-- keyがないとtodosの中のデータが変更される度に全てのtodoが再描画れる為todoのidをkeyにする -->
              <!-- completedがtrueなら"is-completed"を付与falseなら"is-completed"を外す(v-bind) -->
              <li
                v-for="todo in todos"
                :key="todo.id"
                :class="todo.completed ? 'is-completed' : ''"
              >
                <div class="todos__inner">
                  <div class="todos__completed">
                    <!-- changeCompleted(todo)メソット:changeCompleted(todo)の"todo"が引数となっていて、対象のtodoを渡している -->
                    <button
                      class="todos__completed__btn"
                      type="button"
                      @click="changeCompleted(todo)"
                    >
                      <!-- completedがfalseなら未完了trueなら完了 -->
                      <template v-if="todo.completed">
                        <span>完了</span>
                      </template>
                      <template v-else>
                        <span>未完了</span>
                      </template>
                    </button>
                  </div>
                  <div class="todos__desc">
                    <!-- 登録したtodoのタイトルと詳細を表示している -->
                    <h2 class="todos__desc__title">{{ todo.title }}</h2>
                    <p class="todos__desc__detail">{{ todo.detail }}</p>
                  </div>
                  <div class="todos__btn">
                    <!-- クリックした時にshowEditorメソッドの実行 -->
                    <button
                      class="todos__btn__edit"
                      type="button"
                      @click="showEditor(todo)"
                    >
                      編集
                    </button>
                    <!-- クリックした時にdeleteTodoメソッドを実行 -->
                    <button
                      class="todos__btn__delete"
                      type="button"
                      @click="deleteTodo(todo.id)"
                    >
                      削除
                    </button>
                  </div>
                </div>
              </li>
            </ul>
          </template>
          <!-- todoの配列が空の時の処理を行なっている -->
          <template v-else>
            <p class="todos__empty">やることリストには何も登録されていません。</p>
          </template>
        </div>
      </main>
      <footer class="footer">
        <!-- <p>全項目数: 0</p> -->
        <!-- <p>完了済: 0</p>
        <p>未完了: 0</p> -->
        <!-- todosの配列の長さを取得 -->
        <p>全項目数: {{ todos.length }}</p>
        <!-- filterメソッドでtodo.completedの配列長さを取得 -->
        <p>完了済: {{ todos.filter(todo => todo.completed).length }}</p>
        <!--  ●!(論理否定演算子)があるのでtodo.completedの配列の長さ以外の値を取得している -->
        <p>未完了: {{ todos.filter(todo => !todo.completed).length }}</p>
      </footer>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
// Vue.prototype.$axios = axios;
export default {
  data() {
    return {
      todos: [],
      targetTodo: {
        id: null,
        title: '',
        detail: '',
        completed: false,
      },
      errorMessage: '',
    };
  },
  // vueインスタンスが作成された後に実行される
  created() {
    // ".then(({ data }) => {});"はapi通信が成功したときに引数の関数が実行されます
    axios.get('http://localhost:3000/api/todos/').then(({ data }) => {
      this.todos = data.todos.reverse();
    // ".catch((err) => {});"はapi通信が失敗したときにエラー内容が関数(.catch())の引数(err)に入っていき、実行される
    }).catch((err) => {
      this.showError(err);
      // err.response内に何か値が入っていた場合はifの処理に入っていく
      // if (err.response) {
      // err.response.data.messageの内容を"errorMessage"へ代入する
      // this.errorMessage = err.response.data.message;
      // } else {
      // this.errorMessage = 'ネットに接続がされていない、もしくはサーバーとの接続がされていません。ご確認ください。';
      // }
    });
  },
  methods: {
    initTargerTodo() {
      return {
        id: null,
        title: '',
        detail: '',
        completed: false,
      };
    },
    hideError() {
      this.errorMessage = '';
    },
    showError(err) {
      if(err.response) {
        this.errorMessage = err.response.data.message;
      } else {
        this.errorMessage = 'ネットに接続がされていない、もしくはサーバーとの接続がされていません。ご確認ください。';
      }
    },
    // addTodo(event) {
    // console.log('submit');
    // const { target } = event;
    // console.log('title => ', target.title.value);
    // console.log('detail => ', target.detail.value);
    // console.log(Object.assign({}, this.targetTodo));
    addTodo() {
      // 登録したtodoを”postTodo”のオブジェクトに代入している
      const postTodo = Object.assign({}, {
        // todoタイトル
        title: this.targetTodo.title,
        // todo内容
        detail: this.targetTodo.detail,
      });
      // console.log(Object.assign({}, this.targetTodo));
      axios.post('http://localhost:3000/api/todos/', postTodo).then(({ data }) => {
        // todos(配列)の先頭にdata(todo)を追加して新しい配列を返している
        this.todos.unshift(data);
        // ●data内の、targetTodoのtitleとdetailの値を空にしている(この処理をしないと、todoを登録した後に前回入力した値が残ってします為)
        this.targetTodo = this.initTargerTodo();
        // this.targetTodo = Object.assign({}, this.targetTodo, { title: '', detail: '' });
        // エラーが表示された後にTodoを追加すると、エラーを消す為の処理
        // this.errorMessage = '';
        this.hideError();
      }).catch((err) => {
        this.showError(err);
        // if (err.response) {
        // 入力項目に不備があるとここでエラーメッセージを表示する
        // ※入力フォームには"required"の記述があるのでそっちが優先される
        // this.errorMessage = err.response.data.message;
        // } else {
        // Apiサーバーを止めた時に表示されるエラー
        // this.errorMessage = 'ネットに接続がされていない、もしくはサーバーとの接続がされていません。ご確認ください。';
        // }
      });
    },
    // 未完了、完了ボタンが押されたら実行されるメソッド
    // todoが引数となっていて、todoを受け取っている
    changeCompleted(todo) {
      // タイトルと詳細が記入された状態で実行されたら中身を空にしている
      this.targetTodo = this.initTargerTodo();
      // this.targetTodo = {
      //   id: null,
      //   title: '',
      //   detail: '',
      //   completed: false,
      // };
      // console.log(Object.assign({}, todo));
      // todoをtargetTodoへ代入
      // changeCompleted(todo)で実行されたオブジェクトが入ってくる
      const targetTodo = Object.assign({}, todo);
      // ●patch既存データの上書き
      // patchメソッドを実行し対象のtodoのidを末尾に付与して識別している
      axios.patch(`http://localhost:3000/api/todos/${targetTodo.id}`, {
        // json内部の処理
        completed: !targetTodo.completed, // completedの値を反転(false,true)をしている
        // 通信が成功したときそのデータがdata引数に入ってくる
      }).then(({ data }) => {
        // todosの配列のデータを1つ取り出して比較している
        // ループ処理をした結果の配列を再度todos返している
        this.todos = this.todos.map((todoItem) => {
          // todoItem.idとtargetTodo.idが一致したオブジェクトを返している
          if (todoItem.id === targetTodo.id) return data;
          // console.log(todoItem);
          // 一致しなかったオブジェクトを返している
          return todoItem;
        });
        // this.errorMessage = '';
        this.hideError();
      }).catch((err) => {
        this.showError(err);
        // if (err.response) {
        //   this.errorMessage = err.response.data.message;
        // } else {
        //   this.errorMessage = 'ネットに接続されてない、もしくはサーバーとの接続がされていません。ご確認ください';
        // }
      });
    },
    // "showEditor(todo)"で編集対象のtodoが引き渡して、"todo"で受け取っている
    showEditor(todo) {
      // 編集対象の配列をtargetTodoへ代入して再レンダリングをしている
      this.targetTodo = Object.assign({}, todo);
      // console.log(this.targetTodo);
    },
    editTodo() {
      // 何も変更しなかった時の処理
      // data(管理状態)のtodosの配列から変更の対象になっているtodoの取り出し
      // findで繰り返し処理を行い、idで一致したオブジェクトを変数に代入している
      const targetTodo = this.todos.find(todo => todo.id === this.targetTodo.id);
      // 取り出したtodoのタイトルと詳細がtargetTodoのタイトルと詳細が同じであればtargetTodoを初期化して処理を処理を終了
      if (
        targetTodo.title === this.targetTodo.title
        && targetTodo.detail === this.targetTodo.detail
      ) {
        this.targetTodo = {
          id: null,
          title: '',
          detail: '',
          completed: false,
        };
        return;
      }
      // console.log(Object.assign({}, this.targetTodo));
      axios.patch(`http://localhost:3000/api/todos/${this.targetTodo.id}`, {
        // タイトルの更新
        title: this.targetTodo.title,
        // 詳細の更新
        detail: this.targetTodo.detail,
      }).then(({ data }) => {
        // todosの配列の中身を1つずつ取り出して新しい配列を返している
        this.todos = this.todos.map((todo) => {
          if (todo.id === this.targetTodo.id) return data;
          return todo;
        });
        this.targetTodo = {
          id: null,
          title: '',
          detail: '',
          completed: false,
        };
        // this.errorMessage = '';
        this.hideError();
      }).catch((err) => {
        this.showError(err);
        // if (err.response) {
        //   this.errorMessage = err.response.data.message;
        // } else {
        //   this.errorMessage = 'ネットに接続がされていない、もしくはサーバーとの接続がされていません。ご確認ください。';
        // }
      });
    },
    // "deleteTodo(todo.id)"でidを引き渡しているので、それを"id"で受け取っている
    deleteTodo(id) {
      this.targetTodo = {
        id: null,
        title: '',
        detail: '',
        completed: false,
      };
      // console.log(id);
      // axiosのdeleteメソッドを実行し、todoのidを付与(todoのidに対してDELETEリクエストを送っている)
      axios.delete(`http://localhost:3000/api/todos/${id}`).then(({ data }) => {
        // 削除後のtodoの配列が入っているオブジェクトが返ってくるので、data(状態管理)のtodosの中の配列を返ってきたオブジェクトの中のtodosに変えて、再レンダリングさせている
        // このままdata(管理状態)のtodosの配列に対して置き換えると順番が逆になってしまうので、reverseメソッドで直している
        // console.log(data.todos);
        this.todos = data.todos.reverse();
        // this.errorMessage = '';
        this.hideError();
        // console.log(this.todos);
      }).catch((err) => {
        this.showError(err);
        // if (err.response) {
        //   this.errorMessage = err.response.data.message;
        // } else {
        //   this.errorMessage = 'ネットに接続がされていない、もしくはサーバーとの接続がされていません。ご確認ください。';
        // }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.todo {
  &__wrapper {
    margin: 0 auto;
    padding: 20px 0;
    width: 700px;
    max-height: 100vh;
  }
  &__inner {
    position: relative;
    max-height: calc(100vh - 40px);
    border-radius: 10px;
    box-shadow: #aaa 0 0 20px 1px;
  }
}

.header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 20px 0;
  color: #fff;
  font-size: 16px;
  line-height: 1.2;
  text-align: center;
  border-radius: 10px 10px 0 0;
  background-color: #54b363;
}

.main {
  padding: 78px 0 56px;
  max-height: calc(100vh - 40px);
  overflow: scroll;
  border-radius: 10px;
  background-color: #fff;
}

.register {
  padding: 10px 20px;
  padding-bottom: 0;
  &__inner {
    width: 80%;
  }
  &__input {
    & + & {
      margin-top: 10px;
    }
    &__title {
      font-weight: bold;
      font-size: 14px;
    }
    input,
    textarea {
      padding: 10px;
      width: 100%;
      font-size: 14px;
      border: 1px solid #ddd;
    }
  }
  &__submit {
    margin-top: 10px;
    text-align: right;
    &__btn {
      padding: 10px 25px;
      color: #fff;
      font-size: 12px;
      border-radius: 7px;
      background-color: #54b363;
    }
  }
}

.error {
  padding: 0 20px;
  text-align: center;
  &__text {
    margin-top: 10px;
    padding: 5px;
    color: #f00;
    font-size: 14px;
    background-color: #efefef;
  }
}

.todos {
  margin-top: 20px;
  padding: 10px;
  &__empty {
    font-size: 14px;
    text-align: center;
  }
  &__list {
    & > li {
      padding: 15px 10px;
      border-top: 1px solid #ddd;
      transition: all 0.3s;
      &:first-child {
        border-top: none;
      }
      &.is-completed {
        color: #ccc;
        background-color: #f3f3f3;
        .todos__completed__btn {
          text-decoration: line-through;
          color: #ccc;
          border: 2px solid #eaeaea;
          background-color: #eaeaea;
        }
        .todos__desc__title,
        .todos__desc__detail {
          color: #ccc;
        }
      }
    }
  }
  &__inner {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }
  &__completed {
    width: 15%;
    min-width: 100px;
    &__btn {
      padding: 5px 10px;
      color: #ff1919;
      font-weight: bold;
      font-size: 12px;
      border-radius: 7px;
      border: 2px solid #ff1919;
      background-color: #fff;
      transition: all 0.3s;
    }
  }
  &__desc {
    width: 70%;
    min-width: 450px;
    &__title {
      color: #000;
      font-weight: bold;
      font-size: 16px;
      line-height: 1.2;
      transition: all 0.3s;
      input {
        padding: 5px 10px;
        width: 100%;
        color: #000;
        font-size: 16px;
        border: 1px solid #ddd;
        transition: all 0.3s;
      }
    }
    &__detail {
      margin-top: 5px;
      color: #777;
      font-size: 14px;
      line-height: 1.2;
      transition: all 0.3s;
      textarea {
        padding: 5px 10px;
        width: 100%;
        color: #000;
        font-size: 14px;
        border: 1px solid #ddd;
        transition: all 0.3s;
      }
    }
  }
  &__btn {
    width: 10%;
    min-width: 70px;
    text-align: center;
    &__edit,
    &__delete {
      padding: 5px 10px;
      border-radius: 7px;
      color: #fff;
      font-size: 12px;
    }
    &__edit {
      background-color: #07c4d7;
    }
    &__delete {
      margin-top: 5px;
      background-color: #ff1919;
    }
  }
}

.footer {
  display: flex;
  justify-content: space-around;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  font-size: 14px;
  line-height: 1.2;
  color: #555;
  border-radius: 0 0 10px 10px;
  background-color: #ddd;
}
</style>
