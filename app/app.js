'use strict';
angular.module('sapphire', [
    'ngRoute',
    'sapphire.wrapper'

]).run(function ($magicSettings) {
    require.config({
        waitSeconds: 0,
        config: {
            'readium_js_viewer/ModuleConfig': {
                'mathJaxUrl': $magicSettings.httpServerRootFolder()+'/scripts/mathjax/MathJax.js',
                'fonts': [],
                'annotationCSSUrl': $magicSettings.httpServerRootFolder()+'/css/annotations.css',
                'jsLibRoot': $magicSettings.httpServerRootFolder()+'/scripts/zip/',
                'useSimpleLoader': false,
                'epubLibraryPath': $magicSettings.setting.urlParams['epubs'] ? $magicSettings.setting.urlParams['epubs'] : "content/epub_library.opds", // defaults to /content/epub_library.json relative to the application's root index.html
                'imagePathPrefix': undefined,
                'canHandleUrl': false,
                'canHandleDirectory': false,
                'workerUrl': undefined,
                'epubReadingSystemUrl': undefined
            }
        }
    });
}).service('$magicSettings', function () {
    var $this = this;
    $this.setting = {
        path: '',
        origin: '',
        protocol: '',
        urlParams: ''

    };
    $this.getURLQueryParams = function () {
        var params = {};
        var query = window.location.search.split('%2F').join('/');
        if (query && query.length) {
            query = query.substring(1);
            var keyParams = query.split('&');
            for (var x = 0; x < keyParams.length; x++) {
                var keyVal = keyParams[x].split('=');
                if (keyVal.length > 1) {

                    params[keyVal[0]] = keyVal[1];
                }
            }
        }
        return params;
    }
    $this.httpServerRootFolder = function () {
        var root = window.location ? (window.location.protocol + "//" + window.location.hostname + (window.location.port ? (':' + window.location.port) : '') + $this.setting.path) : '';
        return root;
    }
    $this.getMagicSettings = function () {
        var path = (window.location && window.location.pathname) ? window.location.pathname : '';
        path = path.replace(/(.*)\/.*\.[x]?html$/, "$1");
        path = path.charAt(path.length - 1) == '/' ? path.substr(0, path.length - 1) : path;
        $this.setting.path = path;
        $this.setting.origin = window.location.origin;
        $this.setting.protocol = window.location.protocol;
        $this.setting.urlParams = $this.getURLQueryParams();
        return $this.setting;

    }

}).config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');
    $routeProvider.when('/', {
        template: "<app-container></app-container>",
        controller: 'wrapperCtrl'
    }).otherwise({redirectTo: '/'});
}]).directive('appContainer', function () {
    return {
        replace: true,
        template: "<div id='app-container'></div>",
        link: function (scope, element, attrs) {
        }
    };
}).controller('wrapperCtrl', ['$magicSettings',function ($magicSettings) {
    console.log($magicSettings.getMagicSettings())
}]);
