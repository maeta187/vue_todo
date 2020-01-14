import Vue from 'vue'; // vueモジュールをインポートしている
import VueRouter from 'vue-router'; //node_modulesのvue-routerをインポートしている

// import routes from 'TodoRouterDir/routes'; //rotes.jsをインポートしている
import routes from 'TodoVuexDir/routes';
import store from 'TodoVuexDir/store';
// import routes from 'VuexSample/routes';
// import store from 'VuexSample/store';

import '../scss/global.scss';　//importするsassファイルの読み込み

// import myApp from './first';
// import myApp from 'TodoDir'; //importするフォルダーを指定している(パスはwebpack.config.babelに書いてある)
// "index"はデフォルトドキュメントとして認識されるのでファイル名を省略できる
// import myApp from 'TodoRouterDir'; //TodoRouterDirに代入されたtodoRouterをインポートしている
import myApp from 'TodoVuexDir';
// import myApp from 'VuexSample';

Vue.use(VueRouter); //vueRoter(プラグイン)を使用する宣言を行なっている
// ●Vue.js全体に影響を与えるものがプラグイン()グローバルなプラグイン
const router = new VueRouter({ //ルーターインスタンスを作成してオプションを渡している
  routes, // `routes: routes` の短縮表記
  mode: 'history',
});
//●VueRouterの設定をしているだけ

// Vueインスタンスの作成
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(myApp),
  // myAppと言うHTMLの要素を作っている
  // render: h => h(myApp), は↓の書き方を短くしたもの
  // render: function (createElement) {
  // console.log(createElement(myApp))
  // return createElement(myApp)
  // }
  // // "function(createElement)"のcreateElementはデフォルトで用意されている引数
  // return createElement(myApp)はメソッドになっている
});