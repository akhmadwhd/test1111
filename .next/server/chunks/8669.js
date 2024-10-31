exports.id = 8669;
exports.ids = [8669];
exports.modules = {

/***/ 18793:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 51352))

/***/ }),

/***/ 51352:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AuthProvider: () => (/* binding */ AuthProvider),
/* harmony export */   useAuth: () => (/* binding */ useAuth)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(56786);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _modules_auth_usecases_auth_usecase__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(37951);
/* harmony import */ var next_navigation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(57114);
/* harmony import */ var next_navigation__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_navigation__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(18038);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);
/* __next_internal_client_entry_do_not_use__ AuthProvider,useAuth auto */ 



const AuthContext = /*#__PURE__*/ (0,react__WEBPACK_IMPORTED_MODULE_2__.createContext)();
const AuthProvider = ({ children })=>{
    const router = (0,next_navigation__WEBPACK_IMPORTED_MODULE_1__.useRouter)();
    const [show, setShow] = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(false);
    const [userData, setUserData] = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(null);
    const setData = (data)=>{
        setUserData(data);
    };
    const AuthenticationAuth = async ()=>{
        const DataUser = await (0,_modules_auth_usecases_auth_usecase__WEBPACK_IMPORTED_MODULE_3__/* .CheckLogin */ .PG)();
        if (DataUser === null) {
            router.push("/");
        } else {
            setUserData(DataUser);
            setShow(true);
        }
    };
    (0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(()=>{
        AuthenticationAuth();
    }, []);
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(AuthContext.Provider, {
        value: {
            userData,
            setData
        },
        children: show && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
            children: children
        })
    });
};
const useAuth = ()=>{
    return (0,react__WEBPACK_IMPORTED_MODULE_2__.useContext)(AuthContext);
};


/***/ }),

/***/ 243:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ layout)
});

// EXTERNAL MODULE: external "next/dist/compiled/react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(56786);
// EXTERNAL MODULE: ./node_modules/next/dist/build/webpack/loaders/next-flight-loader/module-proxy.js
var module_proxy = __webpack_require__(61363);
;// CONCATENATED MODULE: ./src/components/contextAuth/AuthContext.js

const proxy = (0,module_proxy.createProxy)(String.raw`C:\xampp\htdocs\neracaruang_web\neraca-ruang-fe-main\src\components\contextAuth\AuthContext.js`)

// Accessing the __esModule property and exporting $$typeof are required here.
// The __esModule getter forces the proxy target to create the default export
// and the $$typeof value is for rendering logic to determine if the module
// is a client boundary.
const { __esModule, $$typeof } = proxy;
const __default__ = proxy.default;

const e0 = proxy["AuthProvider"];

const e1 = proxy["useAuth"];

// EXTERNAL MODULE: ./node_modules/next/dist/compiled/react/react.shared-subset.js
var react_shared_subset = __webpack_require__(62947);
;// CONCATENATED MODULE: ./src/app/profile/layout.js



const LayoutProfile = ({ children })=>{
    return /*#__PURE__*/ jsx_runtime_.jsx(e0, {
        children: /*#__PURE__*/ jsx_runtime_.jsx("div", {
            className: `relative min-h-[90vh] mx-auto overflow-hidden py-6 md:py-0 w-[90%] lg:w-[70%] flex justify-between items-center px-2`,
            children: children
        })
    });
};
/* harmony default export */ const layout = (LayoutProfile);


/***/ })

};
;