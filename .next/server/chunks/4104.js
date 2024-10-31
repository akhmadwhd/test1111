"use strict";
exports.id = 4104;
exports.ids = [4104];
exports.modules = {

/***/ 27121:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   yX: () => (/* binding */ postRead)
/* harmony export */ });
/* unused harmony exports getDetailKabar, getKabar */
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(93258);

async function getDetailKabar(slug) {
    const data = axios.get(`${"https://staging.gerai.neracaruang.com/api"}/content/${slug}`).then((res)=>{
        return res.data;
    });
    return data;
}
async function getKabar() {
    const data = axios.get(`${"https://staging.gerai.neracaruang.com/api"}/content?type=kabar`).then((res)=>{
        return res.data;
    });
    return data;
}
function postRead(slug) {
    const data = axios__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z.post(`${"https://staging.gerai.neracaruang.com/api"}/content/${slug}/reads`).then((res)=>{
        return res.data;
    });
    return data;
}


/***/ }),

/***/ 74104:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* binding */ Card)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(56786);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(11440);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_link__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _components_ImageComponent__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(28903);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(18038);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _CommentPopUp__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(99526);
/* harmony import */ var _auth_AuthComponet__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(95447);
/* harmony import */ var react_icons_io__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(12772);
/* harmony import */ var _modules_auth_usecases_auth_usecase__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(37951);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(93258);
/* harmony import */ var next_share__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(12492);
/* harmony import */ var _utils_fonts__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(36479);
/* harmony import */ var _utils_fonts__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(_utils_fonts__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var react_youtube__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(87441);
/* harmony import */ var react_youtube__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(react_youtube__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var _app_kabar_api_Api__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(27121);













const opts = {
    height: "300",
    width: "100%",
    playerVars: {
        autoplay: -1
    }
};
var cElement = null;
function Card({ data, shadow, type, forMore, isRegional, noTag, noComment, fullSize, params }) {
    const [currentRoute, setCurrentRoute] = (0,react__WEBPACK_IMPORTED_MODULE_3__.useState)("");
    const [showComment, setShowComment] = (0,react__WEBPACK_IMPORTED_MODULE_3__.useState)(false);
    const [isLike, setIsLike] = (0,react__WEBPACK_IMPORTED_MODULE_3__.useState)(data?.likes);
    const [fast, setFast] = (0,react__WEBPACK_IMPORTED_MODULE_3__.useState)(false);
    const [token, setToken] = (0,react__WEBPACK_IMPORTED_MODULE_3__.useState)((0,_modules_auth_usecases_auth_usecase__WEBPACK_IMPORTED_MODULE_6__/* .CheckLogin */ .PG)());
    const [show, setShow] = (0,react__WEBPACK_IMPORTED_MODULE_3__.useState)(false);
    const [showAuth, setShowAuth] = (0,react__WEBPACK_IMPORTED_MODULE_3__.useState)(false);
    const currentLocation =  false ? 0 : "";
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
    let config = {
        headers: {
            Authorization: `Bearer ${token?.token}`
        }
    };
    const likeArticle = ()=>{
        if (type !== "arsip") {
            if (token == null) {
                return setShowAuth(true);
            }
            return axios__WEBPACK_IMPORTED_MODULE_7__/* ["default"] */ .Z.post(`${"https://staging.gerai.neracaruang.com/api"}/like`, {
                id: data?.id,
                type: type == "diskusi" ? "discussion" : "content"
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
        }
    };
    const [play, setPlay] = (0,react__WEBPACK_IMPORTED_MODULE_3__.useState)(true);
    const PlayVideo = (event)=>{
        (0,_app_kabar_api_Api__WEBPACK_IMPORTED_MODULE_8__/* .postRead */ .yX)(data.slug);
    };
    console.log(type == "searchVideo" ? isRegional : "");
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
        children: [
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                className: `flex flex-col w-full mx-auto h-full col-span-1 overflow-hidden bg-white ${fullSize ? "" : "max-w-screen-sm"} ${type === "album" ? "justify-between" : ""} ${shadow ?? "border drop-shadow-xl shadow-md"} rounded-lg dark:bg-white-800 ${isRegional ? "text-secondary" : "text-primary"}`,
                children: [
                    type == "video" || type === "searchVideo" ? /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((react_youtube__WEBPACK_IMPORTED_MODULE_9___default()), {
                            videoId: data?.video_url?.split("?v=")[1],
                            opts: opts,
                            onPlay: (event)=>PlayVideo(event)
                        })
                    }) : /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((next_link__WEBPACK_IMPORTED_MODULE_1___default()), {
                        href: type !== "video" && type !== "searchVideo" && type !== "searchInfografis" ? (params?.region || isRegional) && type !== "diskusi" ? "/" + (data.location?.type === "province" ? "provinsi" : data.location?.type === "city" ? "kota" : "nasional") + "/" + data?.location?.slug + "/" + (type === "searchInfografis" ? "info-grafis" : type) + "/" + data.slug : "/" + type + "/" + data?.slug : type === "searchInfografis" ? "info-grafis" : "",
                        scroll: type !== "video" && type !== "searchVideo",
                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                            className: `relative cursor-pointer ${type === "info-grafis" ? "order-3" : "order-1"}`,
                            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_ImageComponent__WEBPACK_IMPORTED_MODULE_2__["default"], {
                                src: "https://staging.gerai.neracaruang.com/" + (type !== "album" && type !== "searchInfografis" ? data?.image : data.medias[0].image == undefined ? "" : data.medias[0].image),
                                sizes: "100vw",
                                className: "object-cover w-full h-auto",
                                dummy: "/detail-kabar.png",
                                width: 0,
                                height: 0,
                                isPriority: true
                            })
                        })
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((next_link__WEBPACK_IMPORTED_MODULE_1___default()), {
                        href: type !== "video" && type !== "searchVideo" && type !== "searchInfografis" ? params?.region || isRegional ? "/" + (data.location?.type === "province" ? "provinsi" : data.location?.type === "city" ? "kota" : "nasional") + "/" + data?.location?.slug + "/" + (type === "searchInfografis" ? "info-grafis" : type) + "/" + data.slug : "/" + type + "/" + data?.slug : type === "searchVideo" ? "/video?content_slug=" + data.slug : "",
                        scroll: type !== "video" && type !== "searchVideo",
                        children: type !== "video" && !forMore && type !== "diskusi" && type !== "arsip" && /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                            className: `${type === "info-grafis" ? "order-1" : "order-2"}`,
                            children: [
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                    className: `px-3 md:h-16 flex items-center`,
                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("h5", {
                                        className: `cursor-pointer my-auto w-full text-lg py-2 md:py-0 md:text-2xl leading-6 font-semibold text-center md:line-clamp-2 ${isRegional ? "text-secondary" : "text-primary"}`,
                                        children: data.title
                                    })
                                }),
                                type !== "info-grafis" && type !== "searchVideo" && /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", {
                                    className: `text-xs text-center italic py-2 md:pt-0 ${type === "searchInfografis" ? "flex flex-col" : ""} ${isRegional ? "text-secondary" : "text-primary"}`,
                                    children: [
                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                            children: data ? data?.author ?? data?.writer?.name : "Jilal Mardhani"
                                        }),
                                        " ",
                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                            children: data ? data?.date ?? `${"("}${data?.publish_date}${")"}` : "(25/11/20,  12.00 WIB)"
                                        })
                                    ]
                                })
                            ]
                        })
                    }),
                    !forMore && /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
                        children: [
                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                className: `${type === "video" || type === "searchVideo" ? "flex flex-row md:grid md:grid-cols-7" : "flex flex-row md:flex-row"} ${type !== "diskusi" && type !== "arsip" ? "justify-between" : "justify-center pt-3"} items-center pl-2 pr-3 ${type === "info-grafis" ? "order-2" : "order-3"}`,
                                children: [
                                    type !== "diskusi" && type !== "arsip" && !noTag && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                        className: "ml-2 py-2 col-span-2",
                                        children: data.location && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((next_link__WEBPACK_IMPORTED_MODULE_1___default()), {
                                            href: "/" + (data.location?.type === "province" ? "provinsi" : data.location?.type === "city" ? "kota" : "nasional") + "/" + data?.location?.slug + "/" + (type === "searchVideo" ? "video" : type),
                                            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_ImageComponent__WEBPACK_IMPORTED_MODULE_2__["default"], {
                                                src: "https://staging.gerai.neracaruang.com/" + data?.location?.image,
                                                dummy: "/images/dummy/default-location.webp",
                                                className: "h-[40px] object-contain",
                                                width: 200,
                                                height: 40
                                            })
                                        })
                                    }),
                                    type === "video" || type === "info-grafis" || type === "diskusi" || type === "searchVideo" || type === "arsip" ? /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                        className: `flex ${type === "video" ? `flex-col w-[100%] ${data?.tags?.length > 0 ? "md:justify-center" : ""} ` : "flex-col"} col-span-3 ${data.tags?.length > 0 ? "mx-auto" : "order-3 justify-end"} ${type === "diskusi" || type === "arsip" ? "flex-col mt-2 h-[1.5em] pt-2" : "flex-row md:flex-row"} `,
                                        children: [
                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                                                className: `text-[10px] text-right italic pr-1  ${isRegional ? "text-secondary" : "text-primary"}`,
                                                children: data ? type === "diskusi" || type === "arsip" ? data?.moderator?.name + " | " + data?.co_moderator?.name : data?.writer?.name : "Jilal Mardhani"
                                            }),
                                            type === "searchVideo" || type === "video" || type === "info-grafis" ? /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                                                className: `text-[10px] text-right italic  ${isRegional ? "text-secondary" : "text-primary"}`,
                                                children: data ? data?.publish_date : "(25/11/20,  12.00 WIB)"
                                            }) : /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                                                className: `text-[10px] text-center italic  ${isRegional ? "text-secondary" : "text-primary"}`,
                                                children: data ? `(${data?.publish_date_start} - ${data?.publish_date_end})` : "(25/11/20,  12.00 WIB)"
                                            })
                                        ]
                                    }) : "",
                                    type !== "diskusi" && type !== "arsip" && !noTag && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                        className: `flex w-full gap-2 md:w-auto justify-end col-span-2 ${type === "video" || type === "info-grafis" ? "hidden" : ""} md:flex`,
                                        children: data?.tags?.map((tag, index)=>{
                                            return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                                className: "py-2 md:py-2",
                                                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((next_link__WEBPACK_IMPORTED_MODULE_1___default()), {
                                                    href: params?.region ? "/" + (data.location?.type === "province" ? "provinsi" : data.location?.type === "city" ? "kota" : "nasional") + "/" + data?.location?.slug + "/" + type + "/" + "tags" + "/" + tag.slug : "/" + (tag.subject === "otonomi daerah" ? "otonomi" : tag.subject) + "/" + tag.slug + "/" + (type === "searchVideo" ? "video" : type),
                                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_ImageComponent__WEBPACK_IMPORTED_MODULE_2__["default"], {
                                                        src: "https://staging.gerai.neracaruang.com/" + tag?.image,
                                                        width: 35,
                                                        height: 35,
                                                        alt: tag.title,
                                                        dummy: "/card/icon_ekonomi.svg"
                                                    })
                                                })
                                            }, type + "-tag-" + index);
                                        })
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                className: "order-4 mt-4",
                                children: [
                                    type !== "album" && !noTag && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                        className: `px-4 pt-0 text-sm text-tertiary text-justify ${type == "diskusi" ? (_utils_fonts__WEBPACK_IMPORTED_MODULE_10___default().className) : ""} ${type !== "video" ? "line-clamp-6 md:h-[120px]" : ""}`,
                                        dangerouslySetInnerHTML: {
                                            __html: type == "diskusi" || type == "arsip" ? data?.content : data?.summary
                                        }
                                    }),
                                    !noComment && /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
                                        children: [
                                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                                className: `flex justify-around gap-4 md:gap-1 items-center py-3 px-4 md:px-0 italic`,
                                                children: [
                                                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                                        className: `flex items-center justify-center text-xs ${isRegional ? "text-secondary" : "text-primary"}`,
                                                        children: [
                                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_ImageComponent__WEBPACK_IMPORTED_MODULE_2__["default"], {
                                                                src: isRegional ? "/card/icon_dibaca_regional.svg" : "/card/icon_dibaca.svg",
                                                                dummy: "/card/icon_dibaca.svg",
                                                                width: 32,
                                                                height: 32
                                                            }),
                                                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", {
                                                                className: "px-1",
                                                                children: [
                                                                    " ",
                                                                    formatNumber(data?.reads) ?? 0,
                                                                    " "
                                                                ]
                                                            }),
                                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                                                className: "hidden md:block",
                                                                children: type !== "video" ? "baca" : "ditonton"
                                                            })
                                                        ]
                                                    }),
                                                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                                        className: `flex items-center cursor-pointer justify-center text-xs ${isRegional ? "text-secondary" : "text-primary"}`,
                                                        onClick: ()=>likeArticle(),
                                                        children: [
                                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_ImageComponent__WEBPACK_IMPORTED_MODULE_2__["default"], {
                                                                src: isRegional ? "/card/icon_suka_regional.svg" : "/card/icon_suka.svg",
                                                                dummy: "/card/icon_suka.svg",
                                                                width: 32,
                                                                height: 32
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
                                                    type === "video" || type === "info-grafis" ? /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                                        className: `flex items-center cursor-pointer justify-center text-xs ${isRegional ? "text-secondary" : "text-primary"}`,
                                                        onClick: ()=>setShowComment(true),
                                                        children: [
                                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_ImageComponent__WEBPACK_IMPORTED_MODULE_2__["default"], {
                                                                src: isRegional ? "/card/icon_komentar_regional.svg" : "/card/icon_komentar.svg",
                                                                dummy: "/card/icon_komentar.svg",
                                                                width: 32,
                                                                height: 32
                                                            }),
                                                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", {
                                                                className: "px-1",
                                                                children: [
                                                                    " ",
                                                                    formatNumber(data?.total_comments) ?? 0,
                                                                    " "
                                                                ]
                                                            }),
                                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                                                className: "hidden md:block",
                                                                children: "komentar"
                                                            })
                                                        ]
                                                    }) : /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                                        className: `flex items-center justify-center text-xs ${isRegional ? "text-secondary" : "text-primary"}`,
                                                        children: [
                                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_ImageComponent__WEBPACK_IMPORTED_MODULE_2__["default"], {
                                                                src: isRegional ? "/card/icon_komentar_regional.svg" : "/card/icon_komentar.svg",
                                                                dummy: "/card/icon_komentar.svg",
                                                                width: 32,
                                                                height: 32
                                                            }),
                                                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", {
                                                                className: "px-1",
                                                                children: [
                                                                    " ",
                                                                    formatNumber(data?.total_comments) ?? 0,
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
                                                        className: "flex justify-center cursor-pointer",
                                                        "data-modal-target": "small-modal",
                                                        "data-modal-toggle": "small-modal",
                                                        onClick: ()=>setShow(true),
                                                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_ImageComponent__WEBPACK_IMPORTED_MODULE_2__["default"], {
                                                            src: isRegional ? "/card/icon_teruskan_regional.svg" : "/card/icon_teruskan.svg",
                                                            dummy: "/card/icon_teruskan.svg",
                                                            width: 32,
                                                            height: 32
                                                        })
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
                                            })
                                        ]
                                    })
                                ]
                            })
                        ]
                    })
                ]
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                id: "small-modal",
                tabIndex: "-1",
                className: `fixed top-1/3 md:left-1/3 z-50 ${show ? "show" : "hidden"} w-full p-4 overflow-x-hidden overflow-y-auto bottom-0 h-[calc(100%-1rem)] max-h-full`,
                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                    className: "relative w-full max-w-md max-h-full",
                    children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                        className: "relative bg-white rounded-lg shadow",
                        children: [
                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                className: "flex items-center justify-between p-5 rounded-t",
                                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("h3", {
                                    className: "text-xl font-medium text-primary",
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
                                className: "text-center p-6 text-center border-gray-200 rounded-b text-primary",
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
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                className: `bg-white w-full fixed top-0 left-0 bottom-0 ${showAuth ? "bg-opacity-90" : "bg-opacity-0 h-0"} z-[999] transition-all duration-200 ease-in-out`,
                onClick: ()=>{
                    setShowAuth(false);
                }
            }),
            showAuth && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                className: `${showAuth ? "bg-opacity-90" : "bg-opacity-0 h-0"} transition-all duration-200 ease-in-out`,
                children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                    className: `fixed md:px-10 z-[999] overflow-x-hidden overflow-y-auto bottom-0 right-[1px] px-5 left-100 md:left-[calc(50%-384px)] h-[calc(90%-1rem)] w-full max-w-screen-md`,
                    children: [
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                            className: "absolute -right-1 -top-1 cursor-pointer",
                            onClick: ()=>{
                                setShowAuth(false);
                            },
                            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(react_icons_io__WEBPACK_IMPORTED_MODULE_12__/* .IoMdClose */ .QAE, {
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
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_auth_AuthComponet__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .Z, {})
                    ]
                })
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                className: `bg-white w-full fixed top-0 left-0 bottom-0 ${showComment ? "bg-opacity-90" : "bg-opacity-0 h-0"} z-[997] transition-all duration-200 ease-in-out`,
                onClick: ()=>{
                    setShowComment(false);
                }
            }),
            showComment && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                className: `${showComment ? "bg-opacity-90" : "bg-opacity-0 h-0"} transition-all duration-200 ease-in-out grid justify-items-center`,
                children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                    className: `fixed z-50 z-[998] overflow-x-hidden max-h-screen md:w-6/12 bottom-0 w-full px-1 md:px-0`,
                    children: [
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                            className: "absolute right-1 top-1 cursor-pointer",
                            onClick: ()=>{
                                setShowComment(false);
                            },
                            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(react_icons_io__WEBPACK_IMPORTED_MODULE_12__/* .IoMdClose */ .QAE, {
                                className: "font-bold text-[25px] text-gray-600"
                            })
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_CommentPopUp__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .Z, {
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
}


/***/ }),

/***/ 99526:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* binding */ CommentPopUp)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(56786);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(18038);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _modules_auth_usecases_auth_usecase__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(37951);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(93258);
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(64731);
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _components_ImageComponent__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(28903);
/* harmony import */ var next_navigation__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(57114);
/* harmony import */ var next_navigation__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(next_navigation__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _auth_AuthComponet__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(95447);
/* harmony import */ var react_icons_io__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(12772);
/* harmony import */ var react_icons_im__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(30236);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(11440);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(next_link__WEBPACK_IMPORTED_MODULE_6__);
/* __next_internal_client_entry_do_not_use__ default auto */ 










function CommentPopUp(props) {
    const [data, setData] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([]);
    const [selectReply, setSelectReply] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([]);
    const [value, setValue] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)();
    const [loader, setLoader] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true);
    const [token, setToken] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)((0,_modules_auth_usecases_auth_usecase__WEBPACK_IMPORTED_MODULE_7__/* .CheckLogin */ .PG)());
    const [currentPage, setCurrentPage] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(1);
    const [lastPage, setLastPage] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(1);
    const [showAuth, setShowAuth] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const [show, setShow] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const [disableLike, setDisableLike] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const router = (0,next_navigation__WEBPACK_IMPORTED_MODULE_4__.useRouter)();
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
            return axios__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z.post(`${"https://staging.gerai.neracaruang.com/api"}/reply-comment/${props?.id}/${selectReply?.id}`, {
                comment: value
            }, config).then((res)=>{
                setValue("");
                setSelectReply([]);
                refreshComment();
                setCurrentPage(1);
            });
        }
        return axios__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z.post(`${"https://staging.gerai.neracaruang.com/api"}/post-comment/${props?.id}`, {
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
        axios__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z.post(`${"https://staging.gerai.neracaruang.com/api"}/like`, {
            id: id,
            type: "content_comment"
        }, config).then((res)=>refreshComment());
        setTimeout(()=>{
            setDisableLike(false);
        }, 4000);
    };
    const refreshComment = ()=>{
        axios__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z.get(`${"https://staging.gerai.neracaruang.com/api"}/get-comment/${props?.id}`).then((res)=>{
            setData(res?.data?.data?.data);
            setLastPage(res?.data?.data?.last_page);
        }).catch((e)=>console.log(e));
    };
    const loadMore = ()=>{
        axios__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z.get(`${"https://staging.gerai.neracaruang.com/api"}/get-comment/${props?.id}?page=${currentPage + 1}`).then((res)=>{
            let localData = data;
            localData = localData.concat(res?.data?.data?.data);
            setCurrentPage(currentPage + 1);
            setData(localData);
        }).catch((e)=>console.log(e));
    };
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{
        refreshComment();
    }, []);
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
        className: `md:px-8 pb-1 bg-white`,
        children: [
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                className: "flex items-center justify-start pt-3",
                children: [
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_ImageComponent__WEBPACK_IMPORTED_MODULE_3__["default"], {
                        src: `/card/icon_komentar${props.isRegional ? "_regional" : ""}.svg`,
                        dummy: "/card/icon_komentar.svg",
                        width: 32,
                        height: 32
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                        className: `inline text-sm font-bold pl-1 ${props.isRegional ? "text-secondary" : "text-primary"}`,
                        children: "KOMENTAR"
                    })
                ]
            }),
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                className: "px-2 py-3 bg-white border border-0 border-gray-200 text-start text-primary mb-5 overflow-y-auto",
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
                                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(react_icons_im__WEBPACK_IMPORTED_MODULE_9__/* .ImForward */ .W2d, {
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
                    show ? /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
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
                            onClick: ()=>setShow(!show),
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
                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(react_icons_io__WEBPACK_IMPORTED_MODULE_10__/* .IoMdClose */ .QAE, {
                                        className: "font-bold text-[30px] text-gray-600"
                                    })
                                }),
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                                    className: "text-sm pl-1 italic text-primary",
                                    children: "Silahkan login untuk memberi komentar, suka, atau balas komentar."
                                })
                            ]
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_auth_AuthComponet__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .Z, {})
                    ]
                })
            })
        ]
    });
}


/***/ })

};
;