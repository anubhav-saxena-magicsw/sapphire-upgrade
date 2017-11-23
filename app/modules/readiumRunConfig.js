'use strict';
var readiumRunConfig = angular.module('reader.readiumRunConfig', []);
readiumRunConfig.service('$readiumRunConfigService', function () {
    var $this = this;
    $this.path = (window.location && window.location.pathname) ? window.location.pathname : '';
    $this.path = $this.path.replace(/(.*)\/.*\.[x]?html$/, "$1");
    $this.path = $this.path.charAt($this.path.length - 1) == '/' ? $this.path.substr(0, $this.path.length - 1) : $this.path;
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
    };
    $this.urlParams = $this.getURLQueryParams();
    $this.httpServerTootFolder = function () {
        var root = window.location ? ( window.location.protocol + "//" + window.location.hostname + (window.location.port ? (':' + window.location.port) : '') + $this.path) : '';
        return root;
    }
});

readiumRunConfig.run(function ($readiumRunConfigService) {
        require.config({

        waitSeconds: 0,
        config: {
            'readium_js_viewer/ModuleConfig': {
                'mathJaxUrl': $readiumRunConfigService.httpServerTootFolder() + '/scripts/mathjax/MathJax.js',
                'fonts': [],
                'annotationCSSUrl': $readiumRunConfigService.httpServerTootFolder() + '/css/annotations.css',
                'jsLibRoot': $readiumRunConfigService.httpServerTootFolder() + '/scripts/zip/',
                'useSimpleLoader': true,
                'epubLibraryPath': $readiumRunConfigService.urlParams['epubs'] ? $readiumRunConfigService.urlParams['epubs'] : "content/epub_library.opds", // defaults to /content/epub_library.json relative to the application's root index.html
                'imagePathPrefix': undefined,
                'canHandleUrl': false,
                'canHandleDirectory': false,
                'workerUrl': undefined,
                'epubReadingSystemUrl': undefined
            }
        }
    });
});
