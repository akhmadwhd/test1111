"use strict";
(() => {
var exports = {};
exports.id = 7155;
exports.ids = [7155];
exports.modules = {

/***/ 14021:
/***/ ((module) => {

module.exports = import("next/dist/compiled/@vercel/og/index.node.js");;

/***/ }),

/***/ 22037:
/***/ ((module) => {

module.exports = require("os");

/***/ }),

/***/ 62822:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  headerHooks: () => (/* binding */ headerHooks),
  originalPathname: () => (/* binding */ originalPathname),
  requestAsyncStorage: () => (/* binding */ requestAsyncStorage),
  routeModule: () => (/* binding */ routeModule),
  serverHooks: () => (/* binding */ serverHooks),
  staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage),
  staticGenerationBailout: () => (/* binding */ staticGenerationBailout)
});

// NAMESPACE OBJECT: ./node_modules/next/dist/build/webpack/loaders/next-metadata-route-loader.js?page=%2Ffavicon.ico%2Froute&isDynamic=0!./src/app/favicon.ico?__next_metadata_route__
var favicon_next_metadata_route_namespaceObject = {};
__webpack_require__.r(favicon_next_metadata_route_namespaceObject);
__webpack_require__.d(favicon_next_metadata_route_namespaceObject, {
  GET: () => (GET),
  dynamic: () => (dynamic)
});

// EXTERNAL MODULE: ./node_modules/next/dist/server/node-polyfill-headers.js
var node_polyfill_headers = __webpack_require__(42394);
// EXTERNAL MODULE: ./node_modules/next/dist/server/future/route-modules/app-route/module.js
var app_route_module = __webpack_require__(69692);
var module_default = /*#__PURE__*/__webpack_require__.n(app_route_module);
// EXTERNAL MODULE: ./node_modules/next/server.js
var server = __webpack_require__(20514);
;// CONCATENATED MODULE: ./node_modules/next/dist/build/webpack/loaders/next-metadata-route-loader.js?page=%2Ffavicon.ico%2Froute&isDynamic=0!./src/app/favicon.ico?__next_metadata_route__


const contentType = "image/x-icon"
const buffer = Buffer.from("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", 'base64'
  )

function GET() {
  return new server.NextResponse(buffer, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': "public, max-age=0, must-revalidate",
    },
  })
}

const dynamic = 'force-static'

;// CONCATENATED MODULE: ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?page=%2Ffavicon.ico%2Froute&name=app%2Ffavicon.ico%2Froute&pagePath=private-next-app-dir%2Ffavicon.ico&appDir=C%3A%5Cxampp%5Chtdocs%5Cneracaruang_web%5Cneraca-ruang-fe-main%5Csrc%5Capp&appPaths=%2Ffavicon.ico&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!

    

    

    

    const options = {"definition":{"kind":"APP_ROUTE","page":"/favicon.ico/route","pathname":"/favicon.ico","filename":"favicon","bundlePath":"app/favicon.ico/route"},"resolvedPagePath":"next-metadata-route-loader?page=%2Ffavicon.ico%2Froute&isDynamic=0!C:\\xampp\\htdocs\\neracaruang_web\\neraca-ruang-fe-main\\src\\app\\favicon.ico?__next_metadata_route__","nextConfigOutput":""}
    const routeModule = new (module_default())({
      ...options,
      userland: favicon_next_metadata_route_namespaceObject,
    })

    // Pull out the exports that we need to expose from the module. This should
    // be eliminated when we've moved the other routes to the new format. These
    // are used to hook into the route.
    const {
      requestAsyncStorage,
      staticGenerationAsyncStorage,
      serverHooks,
      headerHooks,
      staticGenerationBailout
    } = routeModule

    const originalPathname = "/favicon.ico/route"

    

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [2697,4937,4218], () => (__webpack_exec__(62822)));
module.exports = __webpack_exports__;

})();