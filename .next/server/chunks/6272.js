"use strict";
exports.id = 6272;
exports.ids = [6272];
exports.modules = {

/***/ 37829:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ components_DiskusiButtons)
});

// EXTERNAL MODULE: external "next/dist/compiled/react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(56786);
// EXTERNAL MODULE: external "next/dist/compiled/react"
var react_ = __webpack_require__(18038);
// EXTERNAL MODULE: ./node_modules/next/image.js
var next_image = __webpack_require__(52451);
var image_default = /*#__PURE__*/__webpack_require__.n(next_image);
// EXTERNAL MODULE: ./node_modules/next/font/google/target.css?{"path":"src\\utils\\fonts.js","import":"Source_Serif_4","arguments":[{"subsets":["latin"]}],"variableName":"sourceSerif4"}
var target_path_src_utils_fonts_js_import_Source_Serif_4_arguments_subsets_latin_variableName_sourceSerif4_ = __webpack_require__(57298);
var target_path_src_utils_fonts_js_import_Source_Serif_4_arguments_subsets_latin_variableName_sourceSerif4_default = /*#__PURE__*/__webpack_require__.n(target_path_src_utils_fonts_js_import_Source_Serif_4_arguments_subsets_latin_variableName_sourceSerif4_);
// EXTERNAL MODULE: ./src/utils/api.js
var api = __webpack_require__(11905);
;// CONCATENATED MODULE: ./src/modules/diskusi/repositories/diskusi.repository.js

const PostDiskusi = async (data)=>{
    const res = await (0,api/* PostDataWithToken */.J7)("/discussion-suggests", data);
    return res;
};
const GetDiskusi = async (query)=>{
    const res = await (0,api/* GetData */.eO)("/discussion-suggests" + query);
    return res;
};

;// CONCATENATED MODULE: ./src/modules/diskusi/usecases/diskusi.usecase.js

const PostDiskusiUsecase = async (data)=>{
    const discussion = await PostDiskusi(data);
    if (discussion.success) {
        return true;
    }
    return discussion;
};
const GetDiskusiUsecase = async (query)=>{
    const discussion = await GetDiskusi(query ?? "");
    if (discussion.success) {
        return {
            status: true,
            data: discussion.data
        };
    }
    return {
        status: false,
        message: discussion.message
    };
};

// EXTERNAL MODULE: ./node_modules/react-hook-form/dist/index.esm.mjs
var index_esm = __webpack_require__(66558);
// EXTERNAL MODULE: ./node_modules/@hookform/resolvers/yup/dist/yup.mjs + 1 modules
var yup = __webpack_require__(57086);
// EXTERNAL MODULE: ./node_modules/yup/index.js
var node_modules_yup = __webpack_require__(50298);
;// CONCATENATED MODULE: ./src/components/usulan/AddUsulan.js







const schema = node_modules_yup/* object */.Ry({
    topic: node_modules_yup/* string */.Z_().required("Full Name is required"),
    abstract: node_modules_yup/* string */.Z_().required("Full Name is required")
}).required();
const AddUsulan = ({ setActive })=>{
    const [alert, setAlert] = (0,react_.useState)({
        type: "",
        message: "",
        show: false
    });
    const { register, handleSubmit, setValue, formState: { errors } } = (0,index_esm/* useForm */.cI)({
        resolver: (0,yup/* yupResolver */.X)(schema)
    });
    const onSubmit = async (data)=>{
        const addUsulan = await PostDiskusiUsecase(data);
        if (addUsulan === true) {
            setAlert({
                type: "success",
                message: "Berhasil menambah diskusi",
                show: true
            });
            setTimeout(()=>{
                setAlert({
                    type: "",
                    message: "",
                    show: false
                });
            }, 4000);
        } else {
            setAlert({
                type: "error",
                message: addUsulan.message,
                show: true
            });
            setTimeout(()=>{
                setAlert({
                    type: "",
                    message: "",
                    show: false
                });
            }, 4000);
        }
    };
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
        className: "w-[85%] mx-auto",
        children: [
            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                className: "pb-5 flex items-center justify-between text-white",
                children: [
                    /*#__PURE__*/ jsx_runtime_.jsx("div", {
                        className: `font-normal text-base cursor-pointer hover:underline ${(target_path_src_utils_fonts_js_import_Source_Serif_4_arguments_subsets_latin_variableName_sourceSerif4_default()).className}`,
                        style: {
                            fontStyle: "italic"
                        },
                        onClick: ()=>{
                            setActive("daftar");
                        },
                        children: "daftar usulan topik"
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx("div", {
                        className: "font-semibold text-[30px] leading-[33px] text-white",
                        children: "USULKAN TOPIK DISKUSI"
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("form", {
                action: "",
                className: "space-y-3",
                onSubmit: handleSubmit(onSubmit),
                children: [
                    alert.show && /*#__PURE__*/ jsx_runtime_.jsx("div", {
                        className: `alert ${alert.type === "success" ? "alert-success" : "alert-error"}`,
                        children: /*#__PURE__*/ jsx_runtime_.jsx("small", {
                            className: "text-black italic",
                            children: /*#__PURE__*/ jsx_runtime_.jsx("strong", {
                                children: alert.message
                            })
                        })
                    }),
                    /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                        children: [
                            /*#__PURE__*/ jsx_runtime_.jsx("label", {
                                htmlFor: "",
                                className: `font-semibold text-[20px] leading-[24px] py-1 ${(target_path_src_utils_fonts_js_import_Source_Serif_4_arguments_subsets_latin_variableName_sourceSerif4_default()).className} text-white`,
                                children: "Topik Diskusi"
                            }),
                            /*#__PURE__*/ jsx_runtime_.jsx("input", {
                                type: "text",
                                className: "w-full rounded-sm px-2 py-1 focus:outline-none bg-white text-primary",
                                ...register("topic")
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                        children: [
                            /*#__PURE__*/ jsx_runtime_.jsx("label", {
                                htmlFor: "",
                                className: `font-semibold text-[20px] leading-[24px] py-1 ${(target_path_src_utils_fonts_js_import_Source_Serif_4_arguments_subsets_latin_variableName_sourceSerif4_default()).className} text-white`,
                                children: "Abstract Singkat"
                            }),
                            /*#__PURE__*/ jsx_runtime_.jsx("textarea", {
                                id: "",
                                className: "w-full rounded-sm px-2 py-1 focus:outline-none focus:shadow-sm bg-white text-primary",
                                rows: "5",
                                ...register("abstract")
                            })
                        ]
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx("div", {
                        className: "w-full text-center",
                        children: /*#__PURE__*/ jsx_runtime_.jsx("button", {
                            type: "submit",
                            className: "btn btn-sm py-1 px-5 rounded-full hover:opacity-80 bg-white text-primary",
                            children: "Kirim"
                        })
                    })
                ]
            })
        ]
    });
};
/* harmony default export */ const usulan_AddUsulan = (AddUsulan);

// EXTERNAL MODULE: ./node_modules/react-js-pagination/dist/Pagination.js
var Pagination = __webpack_require__(12597);
// EXTERNAL MODULE: ./node_modules/next/font/google/target.css?{"path":"src\\utils\\fonts.js","import":"Source_Serif_4","arguments":[{"subsets":["latin"],"style":"italic"}],"variableName":"sourceSerif4Italic"}
var target_path_src_utils_fonts_js_import_Source_Serif_4_arguments_subsets_latin_style_italic_variableName_sourceSerif4Italic_ = __webpack_require__(99917);
var target_path_src_utils_fonts_js_import_Source_Serif_4_arguments_subsets_latin_style_italic_variableName_sourceSerif4Italic_default = /*#__PURE__*/__webpack_require__.n(target_path_src_utils_fonts_js_import_Source_Serif_4_arguments_subsets_latin_style_italic_variableName_sourceSerif4Italic_);
;// CONCATENATED MODULE: ./src/components/usulan/ListUsulan.js





const ListUsulan = ({ setActive })=>{
    const [data, setData] = (0,react_.useState)();
    const [activePage, setActivePage] = (0,react_.useState)(1);
    const [searchTimeout, setSearchTimeout] = (0,react_.useState)(null);
    const handleSearchInputChange = (event)=>{
        const newSearchText = event.target.value;
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }
        const newTimeout = setTimeout(()=>{
            getData("?keyword=" + newSearchText);
        }, 500);
        setSearchTimeout(newTimeout);
    };
    const getData = async (query)=>{
        const getList = await GetDiskusiUsecase(query);
        if (getList.status) {
            setData(getList.data);
        } else {
            setData(null);
        }
    };
    (0,react_.useEffect)(()=>{
        getData("");
    }, []);
    (0,react_.useEffect)(()=>{
        return ()=>{
            if (searchTimeout) {
                clearTimeout(searchTimeout);
            }
        };
    }, [
        searchTimeout
    ]);
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
        className: "w-[85%] mx-auto",
        children: [
            /*#__PURE__*/ jsx_runtime_.jsx("p", {
                className: `font-normal text-start cursor-pointer hover:underline text-white ${(target_path_src_utils_fonts_js_import_Source_Serif_4_arguments_subsets_latin_style_italic_variableName_sourceSerif4Italic_default()).className}`,
                onClick: ()=>{
                    setActive("add");
                },
                children: "Kembali"
            }),
            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                className: "space-y-5",
                children: [
                    /*#__PURE__*/ jsx_runtime_.jsx("div", {
                        className: "font-semibold text-[30px] leading-[33px] text-white text-center pb-3",
                        children: "DAFTAR USULAN TOPIK"
                    }),
                    /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                        className: "relative flex items-center",
                        children: [
                            /*#__PURE__*/ jsx_runtime_.jsx("div", {
                                className: "absolute left-3",
                                children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)("svg", {
                                    width: "20",
                                    height: "20",
                                    viewBox: "0 0 28 28",
                                    fill: "none",
                                    xmlns: "http://www.w3.org/2000/svg",
                                    className: "cursor-pointer",
                                    children: [
                                        /*#__PURE__*/ jsx_runtime_.jsx("circle", {
                                            cx: "9.99996",
                                            cy: "9.99996",
                                            r: "8.49996",
                                            className: `stroke-primary`,
                                            strokeWidth: "3"
                                        }),
                                        /*#__PURE__*/ jsx_runtime_.jsx("path", {
                                            d: "M16 16L26.0002 26.4656",
                                            className: `stroke-primary`,
                                            strokeWidth: "3",
                                            strokeLinecap: "round"
                                        })
                                    ]
                                })
                            }),
                            /*#__PURE__*/ jsx_runtime_.jsx("input", {
                                type: "text",
                                className: "w-full focus:outline-none border-2 border-[rgba(255,255,255,0.8)] bg-[#B4BBC0] bg-opacity-90 rounded-full italic placeholder:text-primary pr-5 pl-10 py-2 text-primary",
                                placeholder: "topik yang sudah diusulkan",
                                onChange: (e)=>{
                                    handleSearchInputChange(e);
                                }
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                        className: "bg-white rounded-md p-2 text-primary",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("table", {
                                className: "table",
                                children: [
                                    /*#__PURE__*/ jsx_runtime_.jsx("thead", {
                                        children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)("tr", {
                                            children: [
                                                /*#__PURE__*/ jsx_runtime_.jsx("th", {
                                                    children: "NO"
                                                }),
                                                /*#__PURE__*/ jsx_runtime_.jsx("th", {
                                                    children: "TOPIK"
                                                }),
                                                /*#__PURE__*/ jsx_runtime_.jsx("th", {
                                                    children: "PROGRESS"
                                                })
                                            ]
                                        })
                                    }),
                                    /*#__PURE__*/ jsx_runtime_.jsx("tbody", {
                                        children: data?.data && data?.data.map((v, key)=>/*#__PURE__*/ (0,jsx_runtime_.jsxs)("tr", {
                                                children: [
                                                    /*#__PURE__*/ jsx_runtime_.jsx("td", {
                                                        children: key + 1
                                                    }),
                                                    /*#__PURE__*/ jsx_runtime_.jsx("td", {
                                                        children: v.topic
                                                    }),
                                                    /*#__PURE__*/ (0,jsx_runtime_.jsxs)("td", {
                                                        children: [
                                                            v.status === "Not Processed" && "Belum Diperoses",
                                                            v.status === "Processing" && "Sedang Diperoses",
                                                            v.status === "Accepted" && "Diterim",
                                                            v.status === "Cancelled" && "Ditolak"
                                                        ]
                                                    })
                                                ]
                                            }, key))
                                    })
                                ]
                            }),
                            /*#__PURE__*/ jsx_runtime_.jsx("div", {
                                className: "my-2",
                                children: data?.data && /*#__PURE__*/ jsx_runtime_.jsx(Pagination/* default */.Z, {
                                    activePage: activePage,
                                    innerClass: "join",
                                    linkClass: "join-item btn btn-sm hover:text-primary",
                                    activeLinkClass: "bg-primary_light text-white",
                                    itemsCountPerPage: data?.per_page,
                                    totalItemsCount: data?.total,
                                    pageRangeDisplayed: 5,
                                    onChange: (e)=>{
                                        setActivePage(e);
                                        getData("?page=" + e);
                                    }
                                })
                            }),
                            /*#__PURE__*/ jsx_runtime_.jsx("div", {})
                        ]
                    })
                ]
            })
        ]
    });
};
/* harmony default export */ const usulan_ListUsulan = (ListUsulan);

;// CONCATENATED MODULE: ./src/components/usulan/Usulan.js
/* __next_internal_client_entry_do_not_use__ default auto */ 



const Usulan = ()=>{
    const [pageActive, setPageActive] = (0,react_.useState)("add");
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
        className: 'flex w-full shadow-xl rounded-[15px] bg-[url("/images/bg-diskusi.png")] bg-no-repeat bg-cover py-10',
        children: [
            pageActive == "daftar" && /*#__PURE__*/ jsx_runtime_.jsx(usulan_ListUsulan, {
                setActive: (active)=>{
                    setPageActive(active);
                }
            }),
            pageActive == "add" && /*#__PURE__*/ jsx_runtime_.jsx(usulan_AddUsulan, {
                setActive: (active)=>{
                    setPageActive(active);
                }
            })
        ]
    });
};
/* harmony default export */ const usulan_Usulan = (Usulan);

// EXTERNAL MODULE: ./node_modules/next/link.js
var next_link = __webpack_require__(11440);
var link_default = /*#__PURE__*/__webpack_require__.n(next_link);
// EXTERNAL MODULE: ./node_modules/react-icons/io/index.esm.js
var io_index_esm = __webpack_require__(12772);
;// CONCATENATED MODULE: ./src/components/DiskusiButtons.js
/* __next_internal_client_entry_do_not_use__ default auto */ 





const DiskusiButtons = ({ type })=>{
    const [showAuth, setShowAuth] = (0,react_.useState)(false);
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)(jsx_runtime_.Fragment, {
        children: [
            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                className: `fixed z-20 top-3/4 max-w-[110px] md:max-w-[90px] w-full ${type === "diskusi" ? "right-0" : "right-6"}`,
                children: [
                    type === "diskusi" ? /*#__PURE__*/ (0,jsx_runtime_.jsxs)((link_default()), {
                        href: "/arsip",
                        className: "flex items-center",
                        children: [
                            /*#__PURE__*/ jsx_runtime_.jsx((image_default()), {
                                className: "object-contain mx-auto flex-1",
                                src: "/images/icons/arsip.svg",
                                alt: "Arsip Neraca Ruang",
                                width: 40,
                                height: 40
                            }),
                            /*#__PURE__*/ jsx_runtime_.jsx("p", {
                                className: `flex-1 text-primary mb-2`,
                                children: "Arsip"
                            })
                        ]
                    }) : /*#__PURE__*/ (0,jsx_runtime_.jsxs)((link_default()), {
                        href: "/diskusi",
                        className: "grid grid-cols-2 items-center",
                        children: [
                            /*#__PURE__*/ jsx_runtime_.jsx((image_default()), {
                                className: "object-contain mx-auto col-auto w-full",
                                src: "/images/icons/kembali.svg",
                                alt: "Arsip Neraca Ruang",
                                width: 40,
                                height: 40
                            }),
                            /*#__PURE__*/ jsx_runtime_.jsx("p", {
                                className: "col-span-1 text-primary mb-2",
                                children: "Kembali"
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                        className: "flex cursor-pointer items-center",
                        onClick: ()=>{
                            setShowAuth(true);
                        },
                        children: [
                            /*#__PURE__*/ jsx_runtime_.jsx((image_default()), {
                                className: "object-contain mx-auto flex-1",
                                src: "/images/icons/usul-topik.svg",
                                alt: "Usul Topik Neraca Ruang",
                                width: 40,
                                height: 40
                            }),
                            /*#__PURE__*/ jsx_runtime_.jsx("p", {
                                className: `flex-1 text-primary mb-2`,
                                children: "Usul"
                            })
                        ]
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                className: `${showAuth ? "fixed top-0 right-0 left-0 buttom-0 z-[9999]" : ""}`,
                children: [
                    /*#__PURE__*/ jsx_runtime_.jsx("div", {
                        className: `bg-white w-full fixed top-0 left-0 bottom-0 ${showAuth ? "bg-opacity-90" : "bg-opacity-0 h-0"} z-[999] transition-all duration-200 ease-in-out`,
                        onClick: ()=>{
                            setShowAuth(false);
                        }
                    }),
                    showAuth && /*#__PURE__*/ jsx_runtime_.jsx("div", {
                        className: `${showAuth ? "bg-opacity-90" : "bg-opacity-0 h-0"} transition-all duration-200 ease-in-out`,
                        children: /*#__PURE__*/ jsx_runtime_.jsx("div", {
                            className: "flex justify-center items-center min-h-screen",
                            children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                                className: "fixed mt-0 md:mt-1 z-[99999] w-[90%] md:w-[80%] lg:w-[60%]",
                                children: [
                                    /*#__PURE__*/ jsx_runtime_.jsx("div", {
                                        className: "absolute -right-5 -top-7 btn btn-circle bg-gray-100 shadow-md border-gray-200 border-opacity-50",
                                        onClick: ()=>{
                                            setShowAuth(false);
                                        },
                                        children: /*#__PURE__*/ jsx_runtime_.jsx(io_index_esm/* IoMdClose */.QAE, {
                                            className: "font-bold text-[30px] text-gray-600"
                                        })
                                    }),
                                    /*#__PURE__*/ jsx_runtime_.jsx(usulan_Usulan, {})
                                ]
                            })
                        })
                    })
                ]
            })
        ]
    });
};
/* harmony default export */ const components_DiskusiButtons = (DiskusiButtons);


/***/ }),

/***/ 20959:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ZP: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* unused harmony exports __esModule, $$typeof */
/* harmony import */ var next_dist_build_webpack_loaders_next_flight_loader_module_proxy__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(61363);

const proxy = (0,next_dist_build_webpack_loaders_next_flight_loader_module_proxy__WEBPACK_IMPORTED_MODULE_0__.createProxy)(String.raw`C:\xampp\htdocs\neracaruang_web\neraca-ruang-fe-main\src\components\DiskusiButtons.js`)

// Accessing the __esModule property and exporting $$typeof are required here.
// The __esModule getter forces the proxy target to create the default export
// and the $$typeof value is for rendering logic to determine if the module
// is a client boundary.
const { __esModule, $$typeof } = proxy;
const __default__ = proxy.default;


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__default__);

/***/ })

};
;