"use strict";
exports.id = 9357;
exports.ids = [9357];
exports.modules = {

/***/ 89357:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(56786);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var next_image__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(52451);
/* harmony import */ var next_image__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_image__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(18038);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var next_navigation__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(57114);
/* harmony import */ var next_navigation__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(next_navigation__WEBPACK_IMPORTED_MODULE_3__);
/* __next_internal_client_entry_do_not_use__ default auto */ 



const Search = ({})=>{
    const path = (0,next_navigation__WEBPACK_IMPORTED_MODULE_3__.usePathname)();
    const router = (0,next_navigation__WEBPACK_IMPORTED_MODULE_3__.useRouter)();
    const searchParams = (0,next_navigation__WEBPACK_IMPORTED_MODULE_3__.useSearchParams)();
    const paramKeyword = searchParams.get("cari");
    const [keyword, setKeyword] = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)("");
    function search() {
        const currentRoute = path.split("/");
        let url = "/";
        if (currentRoute[1] === "pencarian") {
            url += currentRoute[1] + "/?";
        } else {
            url += currentRoute[1] + "/pencarian?";
        }
        url += "cari=" + keyword;
        router.push(url);
    }
    (0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(()=>{
        setKeyword(paramKeyword);
    }, []);
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
        className: "relative p-4 mx-4 rounded-full bg-[#F5F5F5] pl-10 pr-3 py-1 shadow-search px-5 focus:outline-none font-normal text-xs italic leading-[14px] text-black",
        children: [
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((next_image__WEBPACK_IMPORTED_MODULE_1___default()), {
                className: "absolute left-3 top-3 cursor-pointer duration-500 hover:scale-125",
                width: 20,
                height: 20,
                src: "/images/icons/search.png",
                alt: "",
                onClick: ()=>search()
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("input", {
                type: "text",
                className: "w-full h-8 bg-[#F5F5F5]",
                placeholder: paramKeyword ? paramKeyword : "Topik Diskusi / Moderator",
                onKeyUp: (e)=>{
                    e.keyCode === 13 && search();
                },
                onChange: (e)=>setKeyword(e.target.value)
            })
        ]
    });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Search);


/***/ })

};
;