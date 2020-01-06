import Vue from 'vue';  // vueモジュールをインポートしている
// import VueRouter from 'vue-router';

// import routes from 'TodoRouterDir/routes';
// import routes from 'TodoVuexDir/routes';
// import store from 'TodoVuexDir/store';
// import routes from 'VuexSample/routes';
// import store from 'VuexSample/store';

import '../scss/global.scss';　//importするsassファイルの読み込み

// import myApp from './first';
import myApp from 'TodoDir';  //importするフォルダーを指定している(パスはwebpack.config.babelに書いてある)
// "index"はデフォルトドキュメントとして認識されるのでファイル名を省略できる
// import myApp from 'TodoRouterDir';
// import myApp from 'TodoVuexDir';
// import myApp from 'VuexSample';

// Vue.use(VueRouter);
// const router = new VueRouter({
//   routes,
//   mode: 'history',
// });

// Vueインスタンスの作成
new Vue({
  el: '#app',
  // router,
  // store,
  render: h => h(myApp),
  // myAppと言うHTMLの要素を作っている
  // render: h => h(myApp), は↓の書き方を短くしたもの
  // render: function (createElement) {
  //   console.log(createElement(myApp))
  //   return createElement(myApp)
  // }
  // // "function(createElement)"のcreateElementはデフォルトで用意されている引数
  //   return createElement(myApp)はメソッドになっている
});
// console.log(myApp);
// console.dir(myApp);
