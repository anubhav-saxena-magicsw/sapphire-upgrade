var readerReadium = angular.module('readium',[]);
readerReadium.factory('$readium',function($q,$rootScope){
    $readium = this;

    $readium.Instance = null;
    $readium.initOptions = {};
    $readium.LoadedIframes = [];
    $readium.pageChangeData = null;
    $readium.LoadedSpineItems = [];
    $readium.tempLoadedIframes = [];
    $readium.pageSpineMapping = {};
    $readium.productSearchXml = null;
    $readium.searchExists = false;
    $readium.searchLoadComplete = false;
    var deferSearch = $q.defer();
    $readium.contentLoadPromise = $q.defer();
    var ReadiumCore = null;

    $readium.Flags = {
        initComplete : false,
        bookOpened : false,
        contentLoaded: false,
        renderingAnnotations: false,
        authoringModeActive: false,
        assessmentRenderingMode: false,
        isBackApp: false,
        highlightSmil: true,
        isReaderOfflineEnable: false,
        drawingToolModeActive: false,
        fabricConfigurationDone : false,
        maskCanvasModeActive: false,
        bookPublishStatus : false,
        isContentLoading: true,
        tapNoteModeActive : false,
        searchModeActive : false,
        gotoModeActive : false,
        helpModeActive: false,
        audioRecorderPlayerActive  : false,
        audioRecorderSubmissionActive : false,
        holdArrowNavigation : false
    };

    $rootScope.$on("epubBookLoaded", function(event, data) {
        $readium.searchExists = data.bookDefaults.searchXml;
        $readium.productSearchXml = {product: {page: data.bookDefaults.page}};
        $readium.searchLoadComplete = true;
        $readium.reflowableProp = $readium.Instance.reader.isReflowable();
        deferSearch.resolve();
    });
    $rootScope.$on ( 'ContentDocumentLoadStart', function ( event, data ) {
        $readium.contentLoadPromise = null;
        $readium.contentLoadPromise = $q.defer();
        //console.log("---->",data);
        if ( data ) {

            if ( typeof data.href !== 'undefined' ) {

                if ( _.findWhere ( $readium.contentModel.pageChangeData.paginationInfo.openPages,
                        { href: data.href } ) ) {
                    $readium.Flags.isContentLoading = false;
                } else {
                    $readium.Flags.isContentLoading = true;

                }

            } else if ( typeof data.idref !== 'undefined' ) {

                if ( _.findWhere ( $readium.contentModel.pageChangeData.paginationInfo.openPages,
                        { idref: data.idref } ) ) {
                    $readium.Flags.isContentLoading = false;
                } else {
                    $readium.Flags.isContentLoading = true;

                }

            } else if ( typeof data.navigation !== 'undefined' ) {
                $readium.Flags.isContentLoading = true;
            } else {
                $readium.Flags.isContentLoading = false;

            }

        }

    });

    $interval(function () {
        if ( $readium.Flags.isContentLoading ) {
            $readium.contentLoadPromise.notify('Loading...');
        } else {
            $readium.contentLoadPromise.resolve('Loaded');
        }
    }, 100);

    $readium.package = {
        document : null,
        metadata : null,
        manifest : null,
        contentPath : "",
        tocList : null,
        mediaOverlay: null
    };
});