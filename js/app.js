if(typeof Build!=="undefined" && typeof WebView!=="undefined" && Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
   console.info("Build Set::",Build,WebView);
    WebView.setWebContentsDebuggingEnabled(true);
}
angular.module('AlphaOmega', ['ionic', 'AlphaOmega.controllers', 'AlphaOmega.services'])
.config(["$stateProvider","$urlRouterProvider","$httpProvider",config])
.run(["$ionicPlatform","$state",run]);

function config($stateProvider,$urlRouterProvider,$httpProvider) {
   $httpProvider.defaults.withCredentials = true;
   iyona.deb("config");
   $stateProvider
      .state('call', {url: "/call",abstract: true,templateUrl: "cera/layout-side.html",controller: 'AppCtrl'})
      .state('call.dash', {url: "/dash",views: {'principle': {templateUrl: 'cera/dashboard.html',controller: 'DashCtrl'}}/**/})
      .state('call.profile', {url: "/profile/{jesua}",views: {'principle': {templateUrl: 'cera/mensa/profile-details.html',controller: 'ProfileCtrl'}}/**/})
      .state('call.register', {url: "/register/{jesua}",views: {'principle': {templateUrl: 'cera/mensa/profile-registration.html',controller: 'ProfileCtrl'}}/**/})
      .state('call.profileList', {url: "/profileList/{jesua}",views: {'principle': {templateUrl: 'cera/mensa/profile-list.html',controller: 'ProfileListCtrl'}}/**/})
      .state('call.category', {url: "/category",views: {'principle': {templateUrl: 'cera/mensa/categories.html',controller: 'CategoriesCtrl'}}/**/})
      .state('call.articles', {url: "/articles/{jesua}/{search}",views: {'principle': {templateUrl: 'cera/mensa/articles.html',controller: 'ArticlesCtrl'}}/**/})
      .state('call.article', {url: "/article/{jesua}",views: {'principle': {templateUrl: 'cera/mensa/article-details.html',controller: 'ArticleDetailsCtrl'}}/**/})
      .state('call.articleList', {url: "/articleList/{jesua}",views: {'principle': {templateUrl: 'cera/mensa/articleList-logs.html',controller: 'articleListLogsCtrl'}}/**/})
      .state('call.checkout', {url: "/checkout",views: {'principle': {templateUrl: 'cera/mensa/checkout.html',controller: 'CheckoutCtrl'}}/**/})
      .state('call.test', {url: "/test",views: {'principle': {templateUrl: 'cera/mensa/article-details.html',controller: 'ArticleDetailsCtrl'}}/**/})
      .state('call.logviews', {url: "/logviews",views: {'principle': {templateUrl: 'cera/mensa/log-views.html',controller: 'logViewsCtrl'}}/**/});
   // if none of the above states are matched, use this as the fallback
   $urlRouterProvider.otherwise('/call/dash');

}

function run($ionicPlatform,$state) {
   ionic.Platform.isFullScreen = true;//also set the config.xml to fullscreen
   if(!impetroUser().operarius) {$state.go("call.dash");}/*less intensive redirect when not login*/

   $ionicPlatform.ready(function() {
      //@todo: set the phone grade and details captured.
      console.log("GRADE",ionic.Platform.grade,ionic.Platform.platforms,ionic.Platform.platform(),ionic.Platform.version(),ionic.Platform.device());
      if(window.cordova && window.cordova.plugins.Keyboard) { cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);}// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard for form inputs)
      if(window.StatusBar) {StatusBar.styleDefault();} // org.apache.cordova.statusbar required
   });
}
