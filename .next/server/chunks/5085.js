"use strict";
exports.id = 5085;
exports.ids = [5085];
exports.modules = {

/***/ 98512:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Comment)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(56786);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(18038);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _modules_auth_usecases_auth_usecase__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(37951);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(93258);
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(64731);
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var next_navigation__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(57114);
/* harmony import */ var next_navigation__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(next_navigation__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _auth_AuthComponet__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(95447);
/* harmony import */ var react_icons_io__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(12772);
/* harmony import */ var react_icons_im__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(30236);
/* __next_internal_client_entry_do_not_use__ default auto */ 








function Comment(props) {
    const [data, setData] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([]);
    const [selectReply, setSelectReply] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([]);
    const [value, setValue] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)();
    const [loader, setLoader] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true);
    const [token, setToken] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)((0,_modules_auth_usecases_auth_usecase__WEBPACK_IMPORTED_MODULE_5__/* .CheckLogin */ .PG)());
    const [currentPage, setCurrentPage] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(1);
    const [lastPage, setLastPage] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(1);
    const [showAuth, setShowAuth] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const [show, setShow] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const [disableLike, setDisableLike] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const router = (0,next_navigation__WEBPACK_IMPORTED_MODULE_3__.useRouter)();
    let config = {
        headers: {
            Authorization: `Bearer ${token?.token}`
        }
    };
    const submit = async ()=>{
        if (token == null) {
            return setShowAuth(true);
        }
        if (selectReply?.id) {
            return axios__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .Z.post(`${"https://staging.gerai.neracaruang.com/api"}/reply-comment/${props?.id}/${selectReply?.id}`, {
                comment: value
            }, config).then((res)=>{
                setValue("");
                setSelectReply([]);
                refreshComment();
                setCurrentPage(1);
            });
        }
        return axios__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .Z.post(`${"https://staging.gerai.neracaruang.com/api"}/post-comment/${props?.id}`, {
            comment: value
        }, config).then((res)=>{
            setValue("");
            refreshComment();
            setCurrentPage(1);
        });
    };
    const postLike = (id)=>{
        setDisableLike(true);
        if (token == null) {
            return setShowAuth(true);
        }
        axios__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .Z.post(`${"https://staging.gerai.neracaruang.com/api"}/like`, {
            id: id,
            type: "content_comment"
        }, config).then((res)=>refreshComment());
        setTimeout(()=>{
            setDisableLike(false);
        }, 4000);
    };
    const refreshComment = ()=>{
        axios__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .Z.get(`${"https://staging.gerai.neracaruang.com/api"}/get-comment/${props?.id}`).then((res)=>{
            setData(res?.data?.data?.data);
            setLastPage(res?.data?.data?.last_page);
        }).catch((e)=>console.log(e));
    };
    const loadMore = ()=>{
        axios__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .Z.get(`${"https://staging.gerai.neracaruang.com/api"}/get-comment/${props?.id}?page=${currentPage + 1}`).then((res)=>{
            let localData = data;
            localData = localData.concat(res?.data?.data?.data);
            setCurrentPage(currentPage + 1);
            setData(localData);
        }).catch((e)=>console.log(e));
    };
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{
        refreshComment();
    }, []);
    console.log(data);
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
        className: `px-3 md:px-8 pb-1`,
        children: [
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                className: `md:px-8 py-3 bg-white border border-0 border-gray-200 text-start shadow shadow-inner text-primary mb-5 ${props.isRegional ? "text-secondary" : "text-primary"}`,
                children: [
                    data?.length > 0 && data?.map((cm, index)=>{
                        return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                            children: [
                                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                    className: "py-2",
                                    children: [
                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                                            className: `inline text-xs font-semibold ${props.isRegional ? "text-secondary" : "text-primary"}`,
                                            children: cm?.user?.name
                                        }),
                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                                            className: "inline text-[10px] pl-1 italic text-secondary",
                                            children: moment__WEBPACK_IMPORTED_MODULE_2___default()(cm?.created_at).format("DD/MM/YY hh:mm") + " WIB"
                                        }),
                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                                            className: "text-xs font-normal italic text-tertiary",
                                            children: cm?.comment
                                        }),
                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("ul", {
                                            className: "list-disc",
                                            children: [
                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("li", {
                                                    className: `inline text-[11px] cursor-pointer hover:font-semibold ${props.isRegional ? "text-secondary" : "text-primary"}`,
                                                    onClick: ()=>props?.arsip ? "" : postLike(cm?.id),
                                                    children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", {
                                                        className: "disabled:opacity-50",
                                                        disabled: disableLike,
                                                        children: [
                                                            "• ",
                                                            cm?.likes,
                                                            " Suka"
                                                        ]
                                                    })
                                                }),
                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("li", {
                                                    className: `inline text-[11px] pl-3 cursor-pointer hover:font-semibold ${props.isRegional ? "text-secondary" : "text-primary"}`,
                                                    onClick: ()=>props?.arsip ? "" : setSelectReply(cm),
                                                    children: "• Balas"
                                                })
                                            ]
                                        })
                                    ]
                                }),
                                cm?.replies.length > 0 && cm.replies.map((rep, index)=>{
                                    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                        className: "pl-12",
                                        children: [
                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                                                className: `inline text-xs font-semibold ${props.isRegional ? "text-secondary" : "text-primary"}`,
                                                children: rep?.user?.name
                                            }),
                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                                                className: "inline text-[10px] pl-1 italic text-secondary",
                                                children: moment__WEBPACK_IMPORTED_MODULE_2___default()(rep?.created_at).format("DD/MM/YY hh:mm") + " WIB"
                                            }),
                                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                                className: "flex gap-2",
                                                children: [
                                                    rep.reply_to && /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", {
                                                        className: "text-xs flex gap-1",
                                                        children: [
                                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(react_icons_im__WEBPACK_IMPORTED_MODULE_7__/* .ImForward */ .W2d, {
                                                                className: "font-bold text-gray-600"
                                                            }),
                                                            " ",
                                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                                                className: "font-semibold text-secondary",
                                                                children: rep.reply_to?.user.name
                                                            })
                                                        ]
                                                    }),
                                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                                                        className: "text-xs font-normal italic text-tertiary",
                                                        children: rep?.comment
                                                    })
                                                ]
                                            }),
                                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("ul", {
                                                className: "list-disc",
                                                children: [
                                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("li", {
                                                        className: `inline text-[11px] cursor-pointer hover:font-semibold ${props.isRegional ? "text-secondary" : "text-primary"}`,
                                                        onClick: ()=>props?.arsip ? "" : postLike(rep.id),
                                                        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", {
                                                            className: "disabled:opacity-50",
                                                            disabled: disableLike,
                                                            children: [
                                                                "• ",
                                                                rep?.likes,
                                                                " Suka"
                                                            ]
                                                        })
                                                    }),
                                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("li", {
                                                        className: `inline text-[11px] pl-3 cursor-pointer hover:font-semibold ${props.isRegional ? "text-secondary" : "text-primary"}`,
                                                        onClick: ()=>props?.arsip ? "" : setSelectReply(rep),
                                                        children: "• Balas"
                                                    })
                                                ]
                                            })
                                        ]
                                    }, "reply" + index);
                                })
                            ]
                        }, "comment" + index);
                    }),
                    lastPage != currentPage ? /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                        className: "text-center",
                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("button", {
                            className: `rounded-full hover:shadow-[0px_4px_4px_0px_rgba(0,_0,_0,_0.25)] hover:bg-green-600 ${props.isRegional ? "bg-secondary" : "bg-primary"} rounded-full text-white text-sm leading-[12px] font-semibold py-3 px-5 cursor-pointer`,
                            onClick: ()=>loadMore(),
                            children: "Load more"
                        })
                    }) : "",
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                        className: `${selectReply.length === 0 ? "hidden" : "block"}`,
                        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                            href: "#",
                            className: `p-4 bg-white rounded-lg shadow`,
                            children: [
                                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", {
                                    className: "text-sm pl-1 italic text-secondary",
                                    children: [
                                        "Balas : ",
                                        selectReply?.user?.name
                                    ]
                                }),
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                                    className: "text-sm pl-1 pt-2 italic text-secondary",
                                    children: selectReply?.comment
                                })
                            ]
                        })
                    }),
                    props.showComment ? /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
                        children: [
                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                className: "pt-4",
                                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("textarea", {
                                    id: "message",
                                    rows: "4",
                                    type: "text",
                                    value: value,
                                    onChange: (e)=>setValue(e.target.value),
                                    className: `bg-white border ${props.isRegional ? "border-secondary" : "border-primary"} text-sm rounded-lg block w-full p-2.5`,
                                    placeholder: "Komentar",
                                    required: true
                                })
                            }),
                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                className: "text-right pt-2",
                                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("input", {
                                    type: "submit",
                                    onClick: ()=>submit(),
                                    className: `hover:shadow-[0px_4px_4px_0px_rgba(0,_0,_0,_0.25)] ${props.isRegional ? "bg-secondary" : "bg-primary"} rounded-full text-white text-sm leading-[12px] font-semibold py-3 px-5 cursor-pointer`
                                })
                            })
                        ]
                    }) : /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                        className: `text-center pt-5 ${props?.arsip ? "hidden" : ""}`,
                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("button", {
                            className: `rounded-full hover:shadow-[0px_4px_4px_0px_rgba(0,_0,_0,_0.25)] ${props.isRegional ? "bg-secondary" : "bg-primary"} rounded-full text-white text-sm leading-[12px] font-semibold py-3 px-5 cursor-pointer`,
                            onClick: ()=>props.showPropsComment(!props.showComment),
                            children: "Ketuk untuk berkomentar"
                        })
                    })
                ]
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                className: `bg-white w-full fixed top-0 left-0 bottom-0 ${showAuth ? "bg-opacity-90" : "bg-opacity-0 h-0"} z-[999] transition-all duration-200 ease-in-out`,
                onClick: ()=>{
                    setShowAuth(false);
                }
            }),
            showAuth && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                className: `${showAuth ? "bg-opacity-90" : "bg-opacity-0 h-0"} transition-all duration-200 ease-in-out`,
                children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                    className: `fixed md:px-10 z-[999] overflow-x-hidden overflow-y-auto bottom-0 px-4 left-[calc(0%)]  md:left-[calc(50%-384px)] h-[calc(90%-1rem)] w-full max-w-screen-md`,
                    children: [
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                            className: "absolute -right-1 -top-1 cursor-pointer",
                            onClick: ()=>{
                                setShowAuth(false);
                            },
                            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(react_icons_io__WEBPACK_IMPORTED_MODULE_8__/* .IoMdClose */ .QAE, {
                                className: "font-bold text-[25px] text-gray-600"
                            })
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                            href: "#",
                            className: `mb-4 py-1 bg-white rounded-lg shadow`,
                            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                                className: "text-sm pl-1 italic text-primary",
                                children: "Silahkan login untuk memberi komentar, suka, atau balas komentar."
                            })
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_auth_AuthComponet__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .Z, {})
                    ]
                })
            })
        ]
    });
}


/***/ }),

/***/ 90532:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CountLike)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(56786);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var next_image__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(52451);
/* harmony import */ var next_image__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_image__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(18038);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(93258);
/* harmony import */ var next_navigation__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(57114);
/* harmony import */ var next_navigation__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(next_navigation__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _auth_AuthComponet__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(95447);
/* harmony import */ var react_icons_io__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(12772);
/* harmony import */ var _CommentPopUp__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(99526);
/* harmony import */ var _modules_auth_usecases_auth_usecase__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(37951);
/* harmony import */ var next_share__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(12492);
/* harmony import */ var _ImageComponent__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(28903);
/* harmony import */ var _Comment__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(98512);
/* harmony import */ var _LiveChat__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(43324);
/* __next_internal_client_entry_do_not_use__ default auto */ 












function CountLike({ read, like, comment, id, type = false, isRegional, showingComment, data, initData, channelValue, eventValue, arsip }) {
    const [show, setShow] = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(false);
    const [token, setToken] = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)((0,_modules_auth_usecases_auth_usecase__WEBPACK_IMPORTED_MODULE_9__/* .CheckLogin */ .PG)());
    const [isLike, setIsLike] = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(like);
    const [showAuth, setShowAuth] = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(false);
    const [fast, setFast] = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(false);
    const [showComment, setShowComment] = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(false);
    let config = {
        headers: {
            Authorization: `Bearer ${token?.token}`
        }
    };
    console.log(like);
    const showPropsComment = ()=>{
        setShowComment(!showComment);
    };
    const currentLocation = window.location.href;
    const likeArticle = ()=>{
        if (token == null) {
            return setShowAuth(true);
        }
        return axios__WEBPACK_IMPORTED_MODULE_10__/* ["default"] */ .Z.post(`${"https://staging.gerai.neracaruang.com/api"}/like`, {
            id: id,
            type: type == false ? "content" : "discussion"
        }, config).then((res)=>{
            if (res?.data?.data?.is_liked) {
                setFast(false);
                return setIsLike(isLike + 1);
            } else {
                setFast(false);
                return setIsLike(isLike - 1);
            }
        }).catch((s)=>{
            setFast(true);
        });
    };
    const current = (0,next_navigation__WEBPACK_IMPORTED_MODULE_3__.usePathname)();
    const SI_SYMBOL = [
        "",
        "k",
        "M",
        "G",
        "T",
        "P",
        "E"
    ];
    const formatNumber = (number)=>{
        // what tier? (determines SI symbol)
        var tier = Math.log10(Math.abs(number)) / 3 | 0;
        // if zero, we don't need a suffix
        if (tier == 0) return number;
        // get suffix and determine scale
        var suffix = SI_SYMBOL[tier];
        var scale = Math.pow(10, tier * 3);
        // scale the number
        var scaled = number / scale;
        // format number and add suffix
        return scaled.toFixed(1) + suffix;
    };
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
        children: [
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                className: "flex justify-around text-primary pb-6 pt-8 flex-col md:flex-row gap-4",
                children: [
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                        id: "small-modal",
                        tabIndex: "-1",
                        className: `fixed top-1/3 md:left-[30%] z-50 ${show ? "show" : "hidden"} w-full p-4 overflow-x-hidden overflow-y-auto bottom-0`,
                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                            className: "relative w-full max-w-md max-h-full",
                            children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                className: "relative bg-white rounded-lg shadow",
                                children: [
                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                        className: "flex items-center justify-between p-5 rounded-t",
                                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("h3", {
                                            className: "text-xl font-medium",
                                            children: "Share ke :"
                                        })
                                    }),
                                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                        className: "p-3 space-y-3",
                                        children: [
                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                                className: "pl-3 inline",
                                                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(next_share__WEBPACK_IMPORTED_MODULE_11__/* .EmailShareButton */ .cG, {
                                                    url: currentLocation,
                                                    quote: currentLocation,
                                                    body: currentLocation,
                                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(next_share__WEBPACK_IMPORTED_MODULE_11__/* .EmailIcon */ .LQ, {
                                                        size: 32,
                                                        round: true
                                                    })
                                                })
                                            }),
                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                                className: "pl-3 inline",
                                                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(next_share__WEBPACK_IMPORTED_MODULE_11__/* .FacebookShareButton */ .Dk, {
                                                    url: currentLocation,
                                                    quote: currentLocation,
                                                    hashtag: "#neracaruang",
                                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(next_share__WEBPACK_IMPORTED_MODULE_11__/* .FacebookIcon */ .Vq, {
                                                        size: 32,
                                                        round: true
                                                    })
                                                })
                                            }),
                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                                className: "pl-3 inline",
                                                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(next_share__WEBPACK_IMPORTED_MODULE_11__/* .WhatsappShareButton */ .N0, {
                                                    url: currentLocation,
                                                    title: currentLocation,
                                                    separator: "",
                                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(next_share__WEBPACK_IMPORTED_MODULE_11__/* .WhatsappIcon */ .ud, {
                                                        size: 32,
                                                        round: true
                                                    })
                                                })
                                            }),
                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                                className: "pl-3 inline",
                                                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(next_share__WEBPACK_IMPORTED_MODULE_11__/* .TwitterShareButton */ .B, {
                                                    url: currentLocation,
                                                    title: "",
                                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(next_share__WEBPACK_IMPORTED_MODULE_11__/* .TwitterIcon */ .Zm, {
                                                        size: 32,
                                                        round: true
                                                    })
                                                })
                                            }),
                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                                className: "pl-3 inline",
                                                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(next_share__WEBPACK_IMPORTED_MODULE_11__/* .LinkedinShareButton */ .r2, {
                                                    url: currentLocation,
                                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(next_share__WEBPACK_IMPORTED_MODULE_11__/* .LinkedinIcon */ .pA, {
                                                        size: 32,
                                                        round: true
                                                    })
                                                })
                                            })
                                        ]
                                    }),
                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                        className: "text-center p-6 text-center border-gray-200 rounded-b",
                                        onClick: ()=>setShow(false),
                                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("button", {
                                            "data-modal-hide": "small-modal",
                                            type: "button",
                                            className: "bg-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center",
                                            children: "Tutup"
                                        })
                                    })
                                ]
                            })
                        })
                    }),
                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                        className: "flex justify-around space-x-4 md:gap-1 items-center py-3 px-4 md:px-0",
                        children: [
                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                className: `flex items-center italic justify-center text-xs ${isRegional ? "text-secondary" : "text-primary"}`,
                                children: [
                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_ImageComponent__WEBPACK_IMPORTED_MODULE_6__["default"], {
                                        src: isRegional ? "/card/icon_dibaca_regional.svg" : "/card/icon_dibaca.svg",
                                        dummy: "/card/icon_dibaca.svg",
                                        width: 32,
                                        height: 32
                                    }),
                                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", {
                                        className: "px-1",
                                        children: [
                                            " ",
                                            formatNumber(read) ?? 0,
                                            " "
                                        ]
                                    }),
                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                        className: "hidden md:block",
                                        children: "baca"
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                className: `flex items-center italic justify-center text-xs ${isRegional ? "text-secondary" : "text-primary"}`,
                                children: [
                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                        className: "inline cursor-pointer",
                                        onClick: ()=>arsip ? "" : likeArticle(),
                                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_ImageComponent__WEBPACK_IMPORTED_MODULE_6__["default"], {
                                            src: isRegional ? "/card/icon_suka_regional.svg" : "/card/icon_suka.svg",
                                            dummy: "/card/icon_suka.svg",
                                            width: 32,
                                            height: 32
                                        })
                                    }),
                                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", {
                                        className: "px-1",
                                        children: [
                                            " ",
                                            formatNumber(isLike) ?? 0,
                                            " "
                                        ]
                                    }),
                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                        className: "hidden md:block",
                                        children: "suka"
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                className: `flex items-center italic justify-center text-xs ${isRegional ? "text-secondary" : "text-primary"}`,
                                onClick: ()=>{
                                    showingComment ? showingComment() : showPropsComment();
                                },
                                children: [
                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_ImageComponent__WEBPACK_IMPORTED_MODULE_6__["default"], {
                                        src: isRegional ? "/card/icon_komentar_regional.svg" : "/card/icon_komentar.svg",
                                        dummy: "/card/icon_komentar.svg",
                                        width: 32,
                                        height: 32
                                    }),
                                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", {
                                        className: "px-1",
                                        children: [
                                            " ",
                                            formatNumber(comment) ?? 0,
                                            " "
                                        ]
                                    }),
                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                        className: "hidden md:block",
                                        children: "komentar"
                                    })
                                ]
                            }),
                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                className: "flex justify-center",
                                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                    className: "flex cursor-pointer",
                                    "data-modal-target": "small-modal",
                                    "data-modal-toggle": "small-modal",
                                    onClick: ()=>setShow(true),
                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_ImageComponent__WEBPACK_IMPORTED_MODULE_6__["default"], {
                                        src: isRegional ? "/card/icon_teruskan_regional.svg" : "/card/icon_teruskan.svg",
                                        dummy: "/card/icon_teruskan.svg",
                                        width: 32,
                                        height: 32
                                    })
                                })
                            })
                        ]
                    })
                ]
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                className: `${fast ? "block flex justify-center pb-3" : "hidden"}`,
                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                    className: `p-4 bg-white rounded-lg shadow max-w-sm `,
                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                        className: "text-sm italic text-secondary",
                        children: "Klik terlalu cepat"
                    })
                })
            }),
            !showingComment && !type && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_Comment__WEBPACK_IMPORTED_MODULE_7__["default"], {
                id: id,
                showPropsComment: showPropsComment,
                showComment: showComment,
                isRegional: isRegional
            }),
            type && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_LiveChat__WEBPACK_IMPORTED_MODULE_8__["default"], {
                showPropsComment: showPropsComment,
                showComment: showComment,
                channelValue: channelValue,
                eventValue: eventValue,
                initData: initData,
                arsip: arsip
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                className: `bg-white w-full fixed top-0 left-0 bottom-0 ${showAuth ? "bg-opacity-90" : "bg-opacity-0 h-0"} z-[999] transition-all duration-200 ease-in-out`,
                onClick: ()=>{
                    setShowAuth(false);
                }
            }),
            showAuth && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                className: `${showAuth ? "bg-opacity-90 px-3 md:px-8 pb-1" : "bg-opacity-0 h-0"} transition-all duration-200 ease-in-out`,
                children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                    className: `fixed md:px-10 z-[999] overflow-x-hidden overflow-y-auto bottom-0 left-[calc(50%-384px)] h-[calc(90%-1rem)] w-full max-w-screen-md`,
                    children: [
                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                            href: "#",
                            className: `mb-4 py-1 bg-white rounded-lg shadow relative pt-6 md:pt-0`,
                            children: [
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                    className: "absolute right-0 -top-1 cursor-pointer",
                                    onClick: ()=>{
                                        setShowAuth(false);
                                    },
                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(react_icons_io__WEBPACK_IMPORTED_MODULE_12__/* .IoMdClose */ .QAE, {
                                        className: "font-bold text-[30px] text-gray-600"
                                    })
                                }),
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                                    className: "text-sm pl-1 italic text-primary",
                                    children: "Silahkan login untuk memberi komentar, suka, atau balas komentar."
                                })
                            ]
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_auth_AuthComponet__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .Z, {})
                    ]
                })
            })
        ]
    });
}


/***/ }),

/***/ 35085:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ ListCard)
});

// EXTERNAL MODULE: external "next/dist/compiled/react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(56786);
// EXTERNAL MODULE: external "next/dist/compiled/react"
var react_ = __webpack_require__(18038);
;// CONCATENATED MODULE: ./src/components/Sort.js
/* __next_internal_client_entry_do_not_use__ default auto */ 

function Sort({ showPopular }) {
    const [active, setActive] = (0,react_.useState)(false);
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
        className: "max-w-max w-max md:w-full bg-secondary rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] flex justify-center",
        children: [
            /*#__PURE__*/ jsx_runtime_.jsx("button", {
                className: `rounded-full p-2 px-5 font-semibold ${active ? "bg-primary text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]" : "bg-transparent text-[#FFFFFF80]"}`,
                onClick: ()=>{
                    setActive(true);
                    showPopular(true);
                },
                children: "Terpopuler"
            }),
            /*#__PURE__*/ jsx_runtime_.jsx("button", {
                className: `rounded-full p-2 px-5 font-semibold ${!active ? "bg-primary text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]" : "bg-transparent text-[#FFFFFF80]"}`,
                onClick: ()=>{
                    setActive(false);
                    showPopular(false);
                },
                children: "Terbaru"
            })
        ]
    });
}

// EXTERNAL MODULE: ./src/components/Card.js
var Card = __webpack_require__(74104);
// EXTERNAL MODULE: ./node_modules/next/navigation.js
var navigation = __webpack_require__(57114);
// EXTERNAL MODULE: ./node_modules/next/link.js
var next_link = __webpack_require__(11440);
var link_default = /*#__PURE__*/__webpack_require__.n(next_link);
// EXTERNAL MODULE: ./src/components/ImageComponent.js
var ImageComponent = __webpack_require__(28903);
// EXTERNAL MODULE: ./node_modules/keen-slider/react.js
var react = __webpack_require__(3322);
// EXTERNAL MODULE: ./node_modules/keen-slider/keen-slider.min.css
var keen_slider_min = __webpack_require__(95449);
// EXTERNAL MODULE: ./node_modules/react-icons/md/index.esm.js
var index_esm = __webpack_require__(7625);
;// CONCATENATED MODULE: ./src/components/infografis/SlideFoto.js
/* __next_internal_client_entry_do_not_use__ default auto */ 





const SlideFoto = ({ data, isRegional, type, showingPopUp })=>{
    const [currentSlide, setCurrentSlide] = (0,react_.useState)(0);
    const [loaded, setLoaded] = (0,react_.useState)(false);
    const [popImage, setPopImage] = (0,react_.useState)(false);
    const [srcImage, setSrcImage] = (0,react_.useState)();
    const [more, setMore] = (0,react_.useState)(data.length > 1 ? true : false);
    const [sliderRef, instanceRef] = (0,react/* useKeenSlider */.E)({
        initial: 0,
        loop: data?.length > 1 ? true : false,
        slideChanged (slider) {
            setCurrentSlide(slider.track.details.rel);
        },
        created () {
            if (data.length > 0) {
                setLoaded(true);
            }
        }
    }, [
        (slider)=>{
            if (data.length > 0) {
                let timeout;
                let mouseOver = false;
                function clearNextTimeout() {
                    clearTimeout(timeout);
                }
                function nextTimeout() {
                    clearTimeout(timeout);
                    if (mouseOver) return;
                    timeout = setTimeout(()=>{
                        slider.next();
                    }, 6000);
                }
                slider.on("created", ()=>{
                    slider.container.addEventListener("mouseover", ()=>{
                        mouseOver = true;
                        clearNextTimeout();
                    });
                    slider.container.addEventListener("mouseout", ()=>{
                        mouseOver = false;
                        nextTimeout();
                    });
                    nextTimeout();
                });
                slider.on("dragStarted", clearNextTimeout);
                slider.on("animationEnded", nextTimeout);
                slider.on("updated", nextTimeout);
            }
        }
    ]);
    return /*#__PURE__*/ jsx_runtime_.jsx(jsx_runtime_.Fragment, {
        children: /*#__PURE__*/ jsx_runtime_.jsx("div", {
            className: `${type == "info-grafis" ? "flex flex-col items-center" : "md:px-4 bg-white border border-gray-200 rounded-3xl shadow drop-shadow-md flex flex-col items-center"}`,
            children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                className: `pt-5 w-full ${data.length === 0 ? "pb-8" : ""}`,
                children: [
                    /*#__PURE__*/ jsx_runtime_.jsx("div", {
                        className: "px-2 md:px-0",
                        children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                            className: "relative",
                            children: [
                                /*#__PURE__*/ jsx_runtime_.jsx("div", {
                                    ref: sliderRef,
                                    className: "keen-slider",
                                    children: data.length > 0 ? data.map((v, key)=>/*#__PURE__*/ jsx_runtime_.jsx("div", {
                                            className: "keen-slider__slide w-full object-fill cursor-pointer",
                                            onClick: ()=>{
                                                showingPopUp("https://staging.gerai.neracaruang.com/" + "/" + v.image, key);
                                            },
                                            children: /*#__PURE__*/ jsx_runtime_.jsx(ImageComponent["default"], {
                                                src: "https://staging.gerai.neracaruang.com/" + "/" + v.image,
                                                sizes: "100vw",
                                                className: "w-screen object-cover h-auto",
                                                width: 0,
                                                height: 0,
                                                dummy: "/detail-kabar.png"
                                            })
                                        }, key)) : /*#__PURE__*/ jsx_runtime_.jsx("div", {
                                        className: "keen-slider__slide w-full object-fill cursor-pointer",
                                        children: /*#__PURE__*/ jsx_runtime_.jsx("img", {
                                            src: "/images/banner/banner_footer.png",
                                            className: "w-full object-cover"
                                        })
                                    })
                                }),
                                loaded && more && instanceRef.current && /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                                    className: "",
                                    children: [
                                        /*#__PURE__*/ jsx_runtime_.jsx(Arrow, {
                                            left: true,
                                            onClick: (e)=>e.stopPropagation() || instanceRef.current?.prev(),
                                            disabled: currentSlide === 0,
                                            isRegional: isRegional
                                        }),
                                        /*#__PURE__*/ jsx_runtime_.jsx(Arrow, {
                                            onClick: (e)=>e.stopPropagation() || instanceRef.current?.next(),
                                            disabled: currentSlide === instanceRef.current.track.details.slides.length - 1,
                                            isRegional: isRegional
                                        })
                                    ]
                                })
                            ]
                        })
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx("div", {
                        className: "p-4 text-secondary",
                        children: data[currentSlide]?.summary
                    })
                ]
            })
        })
    });
};
function Arrow(props) {
    const disabeld = props.disabled ? " opacity-50" : "";
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
        onClick: props.onClick,
        className: `absolute top-[50%] text-black bg-white bg-opacity-40 ${props.left ? "left-0" : "left-auto right-[0px]"}`,
        children: [
            props.left && /*#__PURE__*/ jsx_runtime_.jsx(index_esm/* MdOutlineArrowBackIos */.oTp, {
                className: `${disabeld} ${props.isRegional ? "text-secondary" : "text-primary"} text-[40px] cursor-pointer bg-opacity-70`
            }),
            !props.left && /*#__PURE__*/ jsx_runtime_.jsx(index_esm/* MdOutlineArrowForwardIos */.Djl, {
                className: `${disabeld} ${props.isRegional ? "text-secondary" : "text-primary"} text-[40px] cursor-pointer bg-opacity-70`
            })
        ]
    });
}
/* harmony default export */ const infografis_SlideFoto = (SlideFoto);

// EXTERNAL MODULE: ./node_modules/next/font/google/target.css?{"path":"src\\utils\\fonts.js","import":"Plus_Jakarta_Sans","arguments":[{"subsets":["latin"]}],"variableName":"plusJakartaSans"}
var target_path_src_utils_fonts_js_import_Plus_Jakarta_Sans_arguments_subsets_latin_variableName_plusJakartaSans_ = __webpack_require__(36479);
var target_path_src_utils_fonts_js_import_Plus_Jakarta_Sans_arguments_subsets_latin_variableName_plusJakartaSans_default = /*#__PURE__*/__webpack_require__.n(target_path_src_utils_fonts_js_import_Plus_Jakarta_Sans_arguments_subsets_latin_variableName_plusJakartaSans_);
;// CONCATENATED MODULE: ./src/components/Content.js


function Content({ content, diskusi }) {
    return /*#__PURE__*/ jsx_runtime_.jsx("div", {
        className: `text-tertiary text-sm space-y-4 px-3 md:px-0 ${diskusi ? (target_path_src_utils_fonts_js_import_Plus_Jakarta_Sans_arguments_subsets_latin_variableName_plusJakartaSans_default()).className : ""}`,
        dangerouslySetInnerHTML: {
            __html: content
        }
    });
}

// EXTERNAL MODULE: ./src/components/CountLike.js
var CountLike = __webpack_require__(90532);
// EXTERNAL MODULE: ./node_modules/next/font/google/target.css?{"path":"src\\utils\\fonts.js","import":"Source_Serif_4","arguments":[{"subsets":["latin"],"style":"italic"}],"variableName":"sourceSerif4Italic"}
var target_path_src_utils_fonts_js_import_Source_Serif_4_arguments_subsets_latin_style_italic_variableName_sourceSerif4Italic_ = __webpack_require__(99917);
var target_path_src_utils_fonts_js_import_Source_Serif_4_arguments_subsets_latin_style_italic_variableName_sourceSerif4Italic_default = /*#__PURE__*/__webpack_require__.n(target_path_src_utils_fonts_js_import_Source_Serif_4_arguments_subsets_latin_style_italic_variableName_sourceSerif4Italic_);
// EXTERNAL MODULE: ./node_modules/react-icons/io/index.esm.js
var io_index_esm = __webpack_require__(12772);
// EXTERNAL MODULE: ./node_modules/react-inner-image-zoom/lib/index.js
var lib = __webpack_require__(93975);
// EXTERNAL MODULE: ./src/components/CommentPopUp.js
var CommentPopUp = __webpack_require__(99526);
// EXTERNAL MODULE: ./src/app/kabar/api/Api.js
var Api = __webpack_require__(27121);
// EXTERNAL MODULE: ./node_modules/yet-another-react-lightbox/dist/index.js
var dist = __webpack_require__(25671);
// EXTERNAL MODULE: ./node_modules/yet-another-react-lightbox/dist/plugins/captions/index.js
var captions = __webpack_require__(88828);
// EXTERNAL MODULE: ./node_modules/yet-another-react-lightbox/dist/styles.css
var styles = __webpack_require__(85236);
// EXTERNAL MODULE: ./node_modules/yet-another-react-lightbox/dist/plugins/captions/captions.css
var captions_captions = __webpack_require__(71065);
// EXTERNAL MODULE: ./node_modules/yet-another-react-lightbox/dist/plugins/zoom/index.js
var zoom = __webpack_require__(27838);
;// CONCATENATED MODULE: ./src/components/infografis/slide.js












//lightbox





const Slide = ({ data, isRegional, type })=>{
    const [popImage, setPopImage] = (0,react_.useState)(false);
    const [srcImage, setSrcImage] = (0,react_.useState)();
    const [showComment, setShowComment] = (0,react_.useState)(false);
    const [index, setIndex] = (0,react_.useState)(-1);
    const showingPopUp = (param, index)=>{
        (0,Api/* postRead */.yX)(data.slug);
        setPopImage(true);
        setSrcImage(param);
        setIndex(index);
    };
    const showingComment = ()=>{
        setShowComment(true);
    };
    //lightbox
    const captionsRef = (0,react_.useRef)(null);
    const [showToggle, setShowToggle] = (0,react_.useState)(true);
    const [descriptionMaxLines, setDescriptionMaxLines] = (0,react_.useState)(0);
    const [descriptionTextAlign, setDescriptionTextAlign] = (0,react_.useState)("center");
    const breakpoints = [
        4320,
        2160,
        1080,
        640,
        384,
        256,
        128
    ];
    const imageLink = (image)=>`${"https://staging.gerai.neracaruang.com/"}/${image}`;
    const listPhotos = data.medias;
    const slides = listPhotos.map((photo)=>{
        const width = 900;
        const height = 700;
        return {
            src: imageLink(photo.image),
            width,
            height,
            description: (photo?.summary ?? "") + "\n" + (photo?.documented_by ?? ""),
            srcSet: breakpoints.map((breakpoint)=>{
                const breakpointHeight = Math.round(height / width * breakpoint);
                return {
                    src: imageLink(photo.image),
                    width: breakpoint,
                    height: breakpointHeight
                };
            })
        };
    });
    const hideCaption = ()=>{
        setTimeout(()=>{
            if (window.innerWidth >= 768) {
                setShowToggle(true);
                captionsRef.current?.hide();
            } else {
                setShowToggle(false);
            }
        }, 10);
    };
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)(jsx_runtime_.Fragment, {
        children: [
            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                className: "max-w-screen-sm mx-auto text-center border rounded-box py-4 drop-shadow-lg shadow-lg",
                children: [
                    /*#__PURE__*/ jsx_runtime_.jsx("div", {
                        className: "",
                        children: /*#__PURE__*/ jsx_runtime_.jsx("h1", {
                            className: `font-semibold px-4 text-3xl ${isRegional ? "text-secondary" : "text-primary"}`,
                            children: data.title
                        })
                    }),
                    /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                        className: `flex flex-row md:flex-col md:grid md:grid-cols-7 justify-between px-4 items-center`,
                        children: [
                            /*#__PURE__*/ jsx_runtime_.jsx("div", {
                                className: "col-span-2",
                                children: /*#__PURE__*/ jsx_runtime_.jsx("div", {
                                    className: "py-5",
                                    children: /*#__PURE__*/ jsx_runtime_.jsx((link_default()), {
                                        href: "/" + (data.location?.type === "province" ? "provinsi" : data.location?.type === "city" ? "kota" : "nasional") + "/" + data?.location?.slug + "/" + type,
                                        children: /*#__PURE__*/ jsx_runtime_.jsx(ImageComponent["default"], {
                                            src: "https://staging.gerai.neracaruang.com/" + data?.location?.image,
                                            className: "mx-auto w-full h-[48px] object-contain",
                                            dummy: "/images/dummy/default-location.webp",
                                            width: 177,
                                            height: 48
                                        })
                                    })
                                })
                            }),
                            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                                className: `text-sm col-span-3 ${data.tags?.length > 0 ? "mx-auto" : "order-3 justify-end"} ${isRegional ? "text-secondary" : "text-primary"} ${(target_path_src_utils_fonts_js_import_Source_Serif_4_arguments_subsets_latin_style_italic_variableName_sourceSerif4Italic_default()).className} italic py-5`,
                                children: [
                                    /*#__PURE__*/ jsx_runtime_.jsx("p", {
                                        className: `${data.tags?.length === 0 ? "text-right" : "text-right md:text-center"} `,
                                        children: data.writer?.name
                                    }),
                                    " ",
                                    /*#__PURE__*/ jsx_runtime_.jsx("p", {
                                        className: "text-right",
                                        children: "(" + data.publish_date + ")"
                                    })
                                ]
                            }),
                            /*#__PURE__*/ jsx_runtime_.jsx("div", {
                                className: "flex w-full col-span-2 gap-2 md:w-auto justify-center md:justify-end hidden md:flex",
                                children: data.tags?.map((tag)=>{
                                    return /*#__PURE__*/ jsx_runtime_.jsx("div", {
                                        className: "py-2",
                                        children: /*#__PURE__*/ jsx_runtime_.jsx((link_default()), {
                                            href: "/" + (tag.subject === "otonomi daerah" ? "otonomi" : tag.subject) + "/" + tag.slug + "/" + type,
                                            children: /*#__PURE__*/ jsx_runtime_.jsx(ImageComponent["default"], {
                                                src: "https://staging.gerai.neracaruang.com/" + tag?.image,
                                                width: 35,
                                                height: 35,
                                                alt: "",
                                                dummy: "/card/icon_ekonomi.svg"
                                            })
                                        })
                                    });
                                })
                            })
                        ]
                    }),
                    data && /*#__PURE__*/ (0,jsx_runtime_.jsxs)(jsx_runtime_.Fragment, {
                        children: [
                            data.medias.length > 0 ? /*#__PURE__*/ jsx_runtime_.jsx(infografis_SlideFoto, {
                                data: data.medias,
                                isRegional: isRegional,
                                type: type,
                                showingPopUp: showingPopUp
                            }) : /*#__PURE__*/ (0,jsx_runtime_.jsxs)(jsx_runtime_.Fragment, {
                                children: [
                                    /*#__PURE__*/ jsx_runtime_.jsx(ImageComponent["default"], {
                                        src: "https://staging.gerai.neracaruang.com/" + "/" + data.medias[0].image,
                                        sizes: "100vw",
                                        className: "w-screen object-cover h-auto ",
                                        width: 0,
                                        height: 0,
                                        dummy: "/detail-kabar.png"
                                    }),
                                    /*#__PURE__*/ jsx_runtime_.jsx("div", {
                                        className: "px-4 py-3",
                                        children: /*#__PURE__*/ jsx_runtime_.jsx(Content, {
                                            content: data.medias[0].summary
                                        })
                                    })
                                ]
                            }),
                            /*#__PURE__*/ jsx_runtime_.jsx(CountLike["default"], {
                                read: data.reads ?? 0,
                                like: data.likes ?? 0,
                                comment: data.total_comments ?? 0,
                                id: data.id,
                                data: data,
                                showingComment: showingComment,
                                isRegional: isRegional
                            })
                        ]
                    })
                ]
            }),
            popImage && // <div
            //   className={`bg-black  ${
            //     popImage ? "bg-opacity-90" : "bg-opacity-0 h-0"
            //   } z-[998] transition-all duration-200 ease-in-out fixed top-0 left-0 w-full h-full  flex justify-center items-center`}
            //   onClick={() => {
            //     setPopImage(false);
            //   }}
            // >
            //   <div
            //     className={`fixed z-10 overflow-x-hidden overflow-y-hidden w-full md:max-w-screen-lg`}
            //     onClick={(e) => {
            //       e.stopPropagation();
            //     }}
            //   >
            //     <div
            //       id="cls-img"
            //       className="absolute right-1 bg-black cursor-pointer z-[998]"
            //       onClick={() => {
            //         setPopImage(false);
            //       }}
            //     >
            //       <IoMdClose className="font-bold text-[25px] z-[999] text-white" />
            //     </div>
            //     <InnerImageZoom
            //       width={"100%"}
            //       // height={500}
            //       src={srcImage}
            //       fullscreenOnMobile={true}
            //       moveType="drag"
            //       hideCloseButton="true"
            //     />
            //   </div>
            // </div>
            /*#__PURE__*/ jsx_runtime_.jsx(dist/* default */.ZP, {
                index: index,
                slides: slides,
                open: index >= 0,
                close: ()=>setIndex(-1),
                captions: {
                    ref: captionsRef,
                    showToggle,
                    descriptionTextAlign,
                    descriptionMaxLines
                },
                on: {
                    open: hideCaption()
                },
                plugins: [
                    zoom/* default */.Z,
                    captions/* default */.Z
                ],
                toolbar: {
                    buttons: [
                        "zoom",
                        "close"
                    ]
                },
                render: {
                    iconCaptionsHidden: ()=>/*#__PURE__*/ jsx_runtime_.jsx("div", {
                            className: "wrapper-btn-caption flex justify-end",
                            children: /*#__PURE__*/ jsx_runtime_.jsx("button", {
                                type: "button",
                                className: "yarl__button-custom",
                                children: "Deskripsi"
                            }, "my-button")
                        }),
                    iconCaptionsVisible: ()=>/*#__PURE__*/ jsx_runtime_.jsx("div", {
                            className: "wrapper-btn-caption flex justify-end",
                            children: /*#__PURE__*/ jsx_runtime_.jsx("button", {
                                type: "button",
                                className: "yarl__button_custom-close-caption",
                                children: "Tutup"
                            }, "my-button")
                        })
                }
            }),
            /*#__PURE__*/ jsx_runtime_.jsx("div", {
                className: `bg-white w-full fixed top-0 left-0 bottom-0 ${showComment ? "bg-opacity-90" : "bg-opacity-0 h-0"} z-[997] transition-all duration-200 ease-in-out`,
                onClick: ()=>{
                    setShowComment(false);
                }
            }),
            showComment && /*#__PURE__*/ jsx_runtime_.jsx("div", {
                className: `${showComment ? "bg-opacity-90" : "bg-opacity-0 h-0"} transition-all duration-200 ease-in-out grid justify-items-center`,
                children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                    className: `fixed z-50 z-[998] overflow-x-hidden max-h-screen md:w-full bottom-0 w-full px-1 md:px-0 max-w-screen-sm mx-auto`,
                    children: [
                        /*#__PURE__*/ jsx_runtime_.jsx("div", {
                            className: "absolute right-1 top-1 cursor-pointer",
                            onClick: ()=>{
                                setShowComment(false);
                            },
                            children: /*#__PURE__*/ jsx_runtime_.jsx(io_index_esm/* IoMdClose */.QAE, {
                                className: "font-bold text-[25px] text-gray-600"
                            })
                        }),
                        /*#__PURE__*/ jsx_runtime_.jsx(CommentPopUp/* default */.Z, {
                            id: data?.id,
                            data: data,
                            type: type,
                            isRegional: isRegional
                        })
                    ]
                })
            })
        ]
    });
};
/* harmony default export */ const slide = (Slide);

;// CONCATENATED MODULE: ./src/components/ListCard.js
/* __next_internal_client_entry_do_not_use__ default auto */ 







async function getFilter(url) {
    const res = await fetch(url, {
        cache: "no-store"
    });
    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }
    return res.json();
}
function ListCard({ initData, isGrid, location, showMoreButton, type, forMore, textOther, isRegional, noSort, isDetail, noSearchDiskusi }) {
    const searchParams = (0,navigation.useSearchParams)();
    const params = (0,navigation.useParams)();
    // const params.region === "tokoh" = searchParams.get("params.region === "tokoh"");
    const topik = searchParams.get("topik");
    const otonomi = searchParams.get("otonomi");
    const provinsi = searchParams.get("provinsi");
    const kota = searchParams.get("kota");
    const [data, setData] = (0,react_.useState)([]);
    const [currentPage, setCurrentPage] = (0,react_.useState)(2);
    const [hasNextPage, setHasNextPage] = (0,react_.useState)(true);
    const [isPopular, setIsPopular] = (0,react_.useState)(true);
    const [keyword, setKeyword] = (0,react_.useState)();
    (0,react_.useEffect)(()=>{
        setData(initData);
        setCurrentPage(2);
        setHasNextPage(true);
    }, [
        initData
    ]);
    async function fetchData(url, loadMore) {
        const result = await getFilter(url);
        if (result.contents?.next_page_url || result.data?.next_page_url) {
            setHasNextPage(true);
        } else {
            setCurrentPage(1);
            setHasNextPage(false);
        }
        if (loadMore) {
            let localData = data;
            if (type === "diskusi" || type === "arsip") {
                localData = localData.concat(result.data.data);
            } else {
                let newData;
                if (result.contents) {
                    newData = result.contents.data;
                } else {
                    newData = result.data;
                }
                localData = localData.concat(newData);
            }
            setData(localData);
        } else {
            if (type === "diskusi" || type === "arsip") {
                setData(result.data.data);
            } else {
                let newData;
                if (result.contents) {
                    newData = result.contents.data;
                } else {
                    newData = result.data;
                }
                setData(newData);
            }
        }
    }
    async function loadMore() {
        let url;
        setCurrentPage(currentPage + 1);
        if (isDetail) {
            url = forMore;
        } else {
            if (type === "diskusi") {
                url = "https://staging.gerai.neracaruang.com/api" + "/discussions?" + "page=" + currentPage;
            } else if (type === "arsip") {
                url = "https://staging.gerai.neracaruang.com/api" + "/discussion-archives?" + "page=" + currentPage;
            } else {
                url = "https://staging.gerai.neracaruang.com/api" + "/content?type=" + (type === "album" ? "album-foto" : type) + "&page=" + currentPage;
            }
            if (isPopular) {
                url += "&sort_popular=1";
            }
            if (params.region === "tokoh" || params.region === "topik" || params.region === "otonomi") {
                url += "&with_tags=1";
                if (params.region === "topik") {
                    url += "&tags[]=" + params.slug;
                }
                if (params.region === "tokoh") {
                    url += "&tags[]=" + params.slug;
                }
                if (params.region === "otonomi") {
                    url += "&tags[]=" + params.slug;
                }
            }
            if (params.region === "kota") {
                url += "&city=" + params.slug;
            }
            if (params.region === "provinsi") {
                url += "&province=" + params.slug;
            }
            if (params.region === "nasional") {
                url += "&city=" + params.slug;
            }
        }
        console.log(params, url);
        fetchData(url, true);
    }
    async function showPopular(status) {
        let url;
        if (type === "diskusi") {
            url = "https://staging.gerai.neracaruang.com/api" + "/discussions?page=1";
        } else if (type === "arsip") {
            url = "https://staging.gerai.neracaruang.com/api" + "/discussion-archives?page=1";
        } else {
            url = "https://staging.gerai.neracaruang.com/api" + "/content?type=" + (type === "album" ? "album-foto" : type);
        }
        setIsPopular(status);
        setCurrentPage(2);
        if (status) {
            url += "&sort_popular=1";
        }
        if (params.region === "kota") {
            url += "&city=" + params.slug;
        }
        if (params.region === "provinsi") {
            url += "&province=" + params.slug;
        }
        if (params.region === "nasional") {
            url += "&city=" + params.slug;
        }
        if (params.region === "tokoh" || topik || otonomi) {
            url += "&with_tags=1";
            if (topik) {
                url += "&tags[]=" + topik;
            }
            if (params.region === "tokoh") {
                url += "&tags[]=" + params.region === "tokoh";
            }
            if (otonomi) {
                url += "&tags[]=" + otonomi;
            }
        }
        if (kota) {
            url += "&city=" + kota;
        }
        if (provinsi) {
            url += "&province=" + provinsi;
        }
        fetchData(url, false);
    }
    const getSearch = async ()=>{
        let url = "https://staging.gerai.neracaruang.com/api" + "/discussions?keyword=" + keyword;
        const result = await getFilter(url);
        setData(result.data.data);
    };
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
        children: [
            /*#__PURE__*/ jsx_runtime_.jsx("div", {
                className: `flex mb-3 ${showMoreButton ? "justify-between" : "justify-center"}`,
                children: !noSort && /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                    className: "text-center",
                    children: [
                        location && /*#__PURE__*/ jsx_runtime_.jsx("div", {
                            className: "py-5 ml-9",
                            children: /*#__PURE__*/ jsx_runtime_.jsx(ImageComponent["default"], {
                                src: "https://staging.gerai.neracaruang.com/" + location,
                                className: "mx-auto",
                                dummy: "/images/dummy/default-location.webp",
                                width: 280,
                                height: 58,
                                alt: "icon provinsi"
                            })
                        }),
                        /*#__PURE__*/ jsx_runtime_.jsx("div", {
                            className: `pb-4 md:flex flex justify-center ${params?.region || params?.city ? "pt-5" : ""}`,
                            children: /*#__PURE__*/ jsx_runtime_.jsx(Sort, {
                                showPopular: showPopular
                            })
                        })
                    ]
                })
            }),
            type == "diskusi" && !noSearchDiskusi && /*#__PURE__*/ jsx_runtime_.jsx("div", {
                className: "relative flex flex-col w-100 mx-auto",
                children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                    className: "flex items-center pb-5",
                    children: [
                        /*#__PURE__*/ jsx_runtime_.jsx("div", {
                            className: "absolute left-2 cursor-pointer hover:scale-110",
                            children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)("svg", {
                                width: "12",
                                height: "12",
                                viewBox: "0 0 12 12",
                                fill: "none",
                                xmlns: "http://www.w3.org/2000/svg",
                                children: [
                                    /*#__PURE__*/ jsx_runtime_.jsx("circle", {
                                        cx: "4.5",
                                        cy: "4.5",
                                        r: "4",
                                        stroke: "#6E6E70"
                                    }),
                                    /*#__PURE__*/ jsx_runtime_.jsx("path", {
                                        d: "M11 11C11.1952 11.1953 11.5118 11.1953 11.7071 11C11.9023 10.8048 11.9023 10.4882 11.7071 10.2929L11 11ZM6.99996 7.00004L11 11L11.7071 10.2929L7.70707 6.29293L6.99996 7.00004Z",
                                        fill: "#6E6E70"
                                    })
                                ]
                            })
                        }),
                        /*#__PURE__*/ jsx_runtime_.jsx("input", {
                            type: "text",
                            className: "w-full rounded-full bg-[#F5F5F5] pl-6 pr-3 py-1 shadow-search px-5 focus:outline-none font-normal text-xs italic leading-[14px] text-black",
                            placeholder: "pencarian",
                            onKeyUp: (e)=>getSearch(),
                            onChange: (e)=>setKeyword(e.target.value)
                        })
                    ]
                })
            }),
            data && data.length > 0 ? /*#__PURE__*/ jsx_runtime_.jsx("div", {
                className: `max-w-screen-lg w-full gap-4 md:gap-8 mx-auto ${isGrid ? "flex flex-col md:grid md:grid-cols-2" : "flex flex-col"}`,
                children: data.map((value, key)=>{
                    return /*#__PURE__*/ jsx_runtime_.jsx("div", {
                        className: "w-full relative md:col-span-1 mx-auto",
                        children: type === "info-grafis" ? /*#__PURE__*/ jsx_runtime_.jsx(slide, {
                            type: type,
                            data: value,
                            isRegional: isRegional
                        }) : /*#__PURE__*/ jsx_runtime_.jsx(Card/* default */.Z, {
                            data: value,
                            isGrid: isGrid,
                            type: type,
                            isRegional: isRegional,
                            params: params
                        })
                    }, type + "-card" + key);
                })
            }) : /*#__PURE__*/ (0,jsx_runtime_.jsxs)("p", {
                className: `font-bold italic text-center ${isRegional ? "text-secondary" : "text-primary"}`,
                children: [
                    "Tidak ada ",
                    type,
                    "."
                ]
            }),
            forMore && hasNextPage && /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                className: "mt-8 pt-4 absolute left-0 overflow-y-hidden h-fit w-full bg-gray-100",
                style: {
                    boxShadow: "0 -9px 10px -9px #333"
                },
                children: [
                    /*#__PURE__*/ (0,jsx_runtime_.jsxs)("p", {
                        className: "z-10 relative font-semibold mb-4 text-center w-full italic text-tertiary capitalize cursor-pointer",
                        onClick: ()=>loadMore(),
                        children: [
                            textOther,
                            " Berikutnya..."
                        ]
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx("div", {
                        className: "max-w-screen-lg mx-auto",
                        children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                            className: `gap-8 px-8 mx-auto ${isGrid ? "grid md:grid-cols-2" : ""}`,
                            children: [
                                /*#__PURE__*/ jsx_runtime_.jsx("div", {
                                    className: "bg-gray-500 h-52 w-full rounded-lg"
                                }),
                                isGrid && /*#__PURE__*/ jsx_runtime_.jsx("div", {
                                    className: "invisible md:visible",
                                    children: /*#__PURE__*/ jsx_runtime_.jsx("div", {
                                        className: "bg-gray-500 h-52 w-full rounded-lg"
                                    })
                                })
                            ]
                        })
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx("div", {
                        className: "absolute bottom-0 h-full w-full",
                        style: {
                            background: "linear-gradient(0deg, rgba(0, 79, 130, 0.04), rgba(0, 79, 130, 0.04)), linear-gradient(360deg, #F8FAFC 18.86%, rgba(217, 217, 217, 0.4) 56%, rgba(217, 217, 217, 0) 83.76%), linear-gradient(0deg, rgba(255, 251, 251, 0.8) 38.29%, rgba(245, 245, 245, 0.336) 118.38%)"
                        }
                    })
                ]
            })
        ]
    });
}


/***/ }),

/***/ 43324:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ LiveChat)
});

// EXTERNAL MODULE: external "next/dist/compiled/react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(56786);
// EXTERNAL MODULE: external "next/dist/compiled/react"
var react_ = __webpack_require__(18038);
// EXTERNAL MODULE: ./src/modules/auth/usecases/auth.usecase.js
var auth_usecase = __webpack_require__(37951);
// EXTERNAL MODULE: ./node_modules/pusher-js/dist/node/pusher.js
var node_pusher = __webpack_require__(72068);
var pusher_default = /*#__PURE__*/__webpack_require__.n(node_pusher);
// EXTERNAL MODULE: ./node_modules/axios/lib/axios.js + 46 modules
var lib_axios = __webpack_require__(93258);
// EXTERNAL MODULE: ./node_modules/moment/moment.js
var moment = __webpack_require__(64731);
var moment_default = /*#__PURE__*/__webpack_require__.n(moment);
// EXTERNAL MODULE: ./node_modules/react-icons/io/index.esm.js
var index_esm = __webpack_require__(12772);
// EXTERNAL MODULE: ./node_modules/react-icons/im/index.esm.js
var im_index_esm = __webpack_require__(30236);
// EXTERNAL MODULE: ./src/components/auth/AuthComponet.js + 3 modules
var AuthComponet = __webpack_require__(95447);
;// CONCATENATED MODULE: ./src/app/diskusi/api/Api.js

function getDetailDiskusi(slug) {
    const data = fetch(`${"https://staging.gerai.neracaruang.com/api"}/discussions/${slug}`, {
        cache: "no-store"
    }).then((res)=>res.json()).then((req)=>{
        return req.data;
    });
    return data;
}
function getDiskusi() {
    const data = axios.get(`${"https://staging.gerai.neracaruang.com/api"}/discussions`).then((res)=>{
        return res.data;
    });
    return data;
}
function postRead(slug) {
    const data = axios.post(`${"https://staging.gerai.neracaruang.com/api"}/discussion-read/${slug}`).then((res)=>{
        return res.data;
    });
    return data;
}

;// CONCATENATED MODULE: ./src/components/LiveChat.js
/* __next_internal_client_entry_do_not_use__ default auto */ 









function LiveChat({ channelValue, eventValue, initData, showPropsComment, showComment, arsip }) {
    const [totalComments, setTotalComments] = (0,react_.useState)([]);
    const [selectReply, setSelectReply] = (0,react_.useState)();
    const [value, setValue] = (0,react_.useState)();
    const [token, setToken] = (0,react_.useState)((0,auth_usecase/* CheckLogin */.PG)());
    const [showAuth, setShowAuth] = (0,react_.useState)(false);
    const messageEndRef = (0,react_.useRef)(null);
    const messageStartRef = (0,react_.useRef)(null);
    const [show, setShow] = (0,react_.useState)(false);
    let config = {
        headers: {
            Authorization: `Bearer ${token?.token}`
        }
    };
    (0,react_.useEffect)(()=>{
        if (initData.comments.data.length > 0) {
            setTotalComments(initData.comments.data);
        }
        if (channelValue && eventValue) {
            var pusher = new (pusher_default())("9f91236be940c66eddef", {
                cluster: "ap1"
            });
            var channel = pusher.subscribe(channelValue);
            channel.bind(eventValue, function(data) {
                // console.log(data.data)
                setTotalComments((prev)=>[
                        ...prev,
                        data.data
                    ]);
            });
            return ()=>{
                pusher.unsubscribe(channelValue);
            };
        }
    }, []);
    const submit = async ()=>{
        if (token == null) {
            return setShowAuth(true);
        }
        if (selectReply) {
            return lib_axios/* default */.Z.post(`${"https://staging.gerai.neracaruang.com/api"}/discussion/reply/${initData?.id}/${selectReply?.id}`, {
                comment: value
            }, config).then((res)=>{
                setValue("");
                setSelectReply();
            });
        }
        return lib_axios/* default */.Z.post(`${"https://staging.gerai.neracaruang.com/api"}/discussion/comment/${initData?.id}`, {
            comment: value
        }, config).then((res)=>{
            setValue("");
        });
    };
    const scrollTobottom = ()=>{
        messageEndRef.current?.scrollIntoView({
            behavior: "smooth"
        });
        setTimeout(()=>{
            messageStartRef.current?.scrollIntoView({
                behavior: "smooth"
            });
        }, 1000);
    };
    const refreshComment = async ()=>{
        const result = await getDetailDiskusi(initData.slug);
        setTotalComments(result.comments.data);
        console.log(result);
    };
    (0,react_.useEffect)(()=>{
        scrollTobottom();
    }, [
        totalComments
    ]);
    const postLike = (id)=>{
        if (token?.token == null) {
            return setShowAuth(true);
        }
        lib_axios/* default */.Z.post(`${"https://staging.gerai.neracaruang.com/api"}/like`, {
            id: id,
            type: "discussion_comment"
        }, config).then((res)=>{
            refreshComment();
        }).catch((er)=>{
            refreshComment();
        });
    };
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
        className: "px-3 md:px-8 py-3 bg-white border border-0 border-gray-200 text-start shadow shadow-inner text-primary mb-5",
        ref: messageStartRef,
        children: [
            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                className: "flex flex-col text-start max-h-96 flex-grow overflow-y-auto gap-4",
                children: [
                    totalComments.map((message, index)=>/*#__PURE__*/ jsx_runtime_.jsx("div", {
                            children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                                className: "py-2",
                                children: [
                                    /*#__PURE__*/ jsx_runtime_.jsx("p", {
                                        className: "inline text-xs font-semibold",
                                        children: message?.user?.name
                                    }),
                                    /*#__PURE__*/ jsx_runtime_.jsx("p", {
                                        className: "inline text-[10px] pl-1 italic text-secondary",
                                        children: moment_default()(message?.created_at).format("DD/MM/YY hh:mm") + " WIB"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                                        className: "flex gap-2",
                                        children: [
                                            message.reply_to && /*#__PURE__*/ (0,jsx_runtime_.jsxs)("p", {
                                                className: "text-xs flex gap-1",
                                                children: [
                                                    /*#__PURE__*/ jsx_runtime_.jsx(im_index_esm/* ImForward */.W2d, {
                                                        className: "font-bold text-gray-600"
                                                    }),
                                                    " ",
                                                    /*#__PURE__*/ jsx_runtime_.jsx("span", {
                                                        className: "font-semibold text-tertiary",
                                                        children: message.reply_to?.user?.name
                                                    })
                                                ]
                                            }),
                                            /*#__PURE__*/ jsx_runtime_.jsx("p", {
                                                className: "text-xs font-normal italic text-tertiary",
                                                children: message?.comments
                                            })
                                        ]
                                    }),
                                    !arsip ? /*#__PURE__*/ (0,jsx_runtime_.jsxs)("ul", {
                                        className: "list-disc",
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("li", {
                                                className: "inline text-[11px] cursor-pointer",
                                                onClick: ()=>postLike(message?.id),
                                                children: [
                                                    "• ",
                                                    message?.likes,
                                                    " Suka"
                                                ]
                                            }),
                                            /*#__PURE__*/ jsx_runtime_.jsx("li", {
                                                className: "inline text-[11px] pl-3 cursor-pointer",
                                                onClick: ()=>setSelectReply(message),
                                                children: "• Balas"
                                            })
                                        ]
                                    }) : /*#__PURE__*/ jsx_runtime_.jsx("ul", {
                                        className: "list-disc",
                                        children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)("li", {
                                            className: "inline text-[11px] text-tertiary",
                                            children: [
                                                "• ",
                                                message?.likes,
                                                " Suka"
                                            ]
                                        })
                                    })
                                ]
                            })
                        }, index)),
                    /*#__PURE__*/ jsx_runtime_.jsx("div", {
                        ref: messageEndRef
                    })
                ]
            }),
            /*#__PURE__*/ jsx_runtime_.jsx("div", {
                className: `${selectReply ? "block" : "hidden"}`,
                children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                    href: "#",
                    className: `p-4 bg-white rounded-lg shadow`,
                    children: [
                        /*#__PURE__*/ (0,jsx_runtime_.jsxs)("p", {
                            className: "text-sm pl-1 italic text-secondary",
                            children: [
                                "Balas : ",
                                selectReply?.user?.name
                            ]
                        }),
                        /*#__PURE__*/ jsx_runtime_.jsx("p", {
                            className: "text-sm pl-1 pt-2 italic ",
                            children: selectReply?.comments
                        })
                    ]
                })
            }),
            showComment ? /*#__PURE__*/ (0,jsx_runtime_.jsxs)(jsx_runtime_.Fragment, {
                children: [
                    /*#__PURE__*/ jsx_runtime_.jsx("div", {
                        className: "pt-4",
                        children: /*#__PURE__*/ jsx_runtime_.jsx("textarea", {
                            id: "message",
                            rows: "4",
                            type: "text",
                            value: value,
                            onChange: (e)=>setValue(e.target.value),
                            className: "bg-white border border-primary text-sm rounded-lg block w-full p-2.5",
                            placeholder: "Komentar",
                            required: true
                        })
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx("div", {
                        className: "text-right pt-2",
                        children: /*#__PURE__*/ jsx_runtime_.jsx("input", {
                            type: "submit",
                            onClick: ()=>submit(),
                            className: `btn-primary hover:shadow-[0px_4px_4px_0px_rgba(0,_0,_0,_0.25)] hover:bg-primary_light bg-primary rounded-full text-white text-sm leading-[12px] font-semibold py-3 px-5 cursor-pointer`
                        })
                    })
                ]
            }) : /*#__PURE__*/ jsx_runtime_.jsx("div", {
                className: `text-center pt-5 `,
                children: /*#__PURE__*/ jsx_runtime_.jsx("button", {
                    className: `rounded-full btn-primary hover:shadow-[0px_4px_4px_0px_rgba(0,_0,_0,_0.25)] hover:bg-primary_light bg-primary rounded-full text-white text-sm leading-[12px] font-semibold py-3 px-5 cursor-pointer ${arsip ? "hidden" : ""}`,
                    onClick: ()=>showPropsComment(!showComment),
                    children: "Ketuk untuk berkomentar"
                })
            }),
            /*#__PURE__*/ jsx_runtime_.jsx("div", {
                className: `bg-white w-full fixed top-0 left-0 bottom-0 ${showAuth ? "bg-opacity-90" : "bg-opacity-0 h-0"} z-[999] transition-all duration-200 ease-in-out`,
                onClick: ()=>{
                    setShowAuth(false);
                }
            }),
            showAuth && /*#__PURE__*/ jsx_runtime_.jsx("div", {
                className: `${showAuth ? "bg-opacity-90" : "bg-opacity-0 h-0"} transition-all duration-200 ease-in-out`,
                children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                    className: `fixed md:px-10 z-[999] overflow-x-hidden overflow-y-auto bottom-0 left-[calc(50%-384px)] h-[calc(90%-1rem)] w-full max-w-screen-md`,
                    children: [
                        /*#__PURE__*/ jsx_runtime_.jsx("div", {
                            className: "absolute -right-1 -top-1 cursor-pointer",
                            onClick: ()=>{
                                setShowAuth(false);
                            },
                            children: /*#__PURE__*/ jsx_runtime_.jsx(index_esm/* IoMdClose */.QAE, {
                                className: "font-bold text-[30px] text-gray-600"
                            })
                        }),
                        /*#__PURE__*/ jsx_runtime_.jsx("div", {
                            href: "#",
                            className: `mb-4 py-1 bg-white rounded-lg shadow text-center`,
                            children: /*#__PURE__*/ jsx_runtime_.jsx("p", {
                                className: "text-sm pl-1 italic text-primary",
                                children: "Silahkan login untuk memberi komentar, suka, atau balas komentar."
                            })
                        }),
                        /*#__PURE__*/ jsx_runtime_.jsx(AuthComponet/* default */.Z, {})
                    ]
                })
            })
        ]
    });
}


/***/ })

};
;