"use strict";
exports.id = 2305;
exports.ids = [2305];
exports.modules = {

/***/ 12285:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(56786);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(18038);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var keen_slider_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3322);
/* harmony import */ var keen_slider_keen_slider_min_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(95449);
/* harmony import */ var keen_slider_keen_slider_min_css__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(keen_slider_keen_slider_min_css__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var react_icons_md__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(7625);
/* harmony import */ var _ImageComponent__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(28903);
/* harmony import */ var yet_another_react_lightbox__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(25671);
/* harmony import */ var yet_another_react_lightbox_plugins_captions__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(88828);
/* harmony import */ var yet_another_react_lightbox_styles_css__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(85236);
/* harmony import */ var yet_another_react_lightbox_styles_css__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(yet_another_react_lightbox_styles_css__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var yet_another_react_lightbox_plugins_captions_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(71065);
/* harmony import */ var yet_another_react_lightbox_plugins_captions_css__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(yet_another_react_lightbox_plugins_captions_css__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var yet_another_react_lightbox_plugins_zoom__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(27838);
/* __next_internal_client_entry_do_not_use__ default auto */ 





// import { IoMdClose } from "react-icons/io";
// import AuthComponent from "./auth/AuthComponet";
// import InnerImageZoom from 'react-inner-image-zoom';
// import 'react-inner-image-zoom/lib/InnerImageZoom/styles.css'
//lightbox





const SlideFoto = ({ data, isRegional, type })=>{
    const [currentSlide, setCurrentSlide] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(0);
    const [loaded, setLoaded] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const [popImage, setPopImage] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const [srcImage, setSrcImage] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)();
    const [more, setMore] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(data.length > 1 ? true : false);
    const [index, setIndex] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(-1);
    const [sliderRef, instanceRef] = (0,keen_slider_react__WEBPACK_IMPORTED_MODULE_2__/* .useKeenSlider */ .E)({
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
    console.log(data);
    //lightbox
    const captionsRef = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null);
    const [showToggle, setShowToggle] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true);
    const [descriptionMaxLines, setDescriptionMaxLines] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(0);
    const [descriptionTextAlign, setDescriptionTextAlign] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)("center");
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
    const listPhotos = data;
    const slides = listPhotos.map((photo)=>{
        const width = 900;
        const height = 700;
        return {
            src: imageLink(photo?.image),
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
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
        children: [
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                className: `${type == "info-grafis" ? "flex flex-col items-center" : "md:px-4 bg-white border border-gray-200 rounded-3xl shadow drop-shadow-md flex flex-col items-center"}`,
                children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                    className: `pt-5 w-full ${data.length === 0 ? "pb-8" : ""}`,
                    children: [
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                            className: "px-2 md:px-0",
                            children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                className: "relative",
                                children: [
                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                        ref: sliderRef,
                                        className: "keen-slider",
                                        children: data.length > 0 ? data.map((v, key)=>/*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                                className: "keen-slider__slide w-full object-fill cursor-pointer",
                                                onClick: ()=>{
                                                    setPopImage(true);
                                                    setSrcImage("https://staging.gerai.neracaruang.com/" + "/" + v.image);
                                                    setIndex(key);
                                                },
                                                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_ImageComponent__WEBPACK_IMPORTED_MODULE_4__["default"], {
                                                    src: "https://staging.gerai.neracaruang.com/" + "/" + v.image,
                                                    sizes: "100vw",
                                                    className: "w-screen object-cover h-auto",
                                                    width: 0,
                                                    height: 0,
                                                    dummy: "/detail-kabar.png"
                                                })
                                            }, key)) : /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                            className: "keen-slider__slide w-full object-fill cursor-pointer",
                                            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("img", {
                                                src: "/images/banner/banner_footer.png",
                                                className: "w-full object-cover"
                                            })
                                        })
                                    }),
                                    loaded && more && instanceRef.current && /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                        className: "",
                                        children: [
                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(Arrow, {
                                                left: true,
                                                onClick: (e)=>e.stopPropagation() || instanceRef.current?.prev(),
                                                disabled: currentSlide === 0,
                                                isRegional: isRegional
                                            }),
                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(Arrow, {
                                                onClick: (e)=>e.stopPropagation() || instanceRef.current?.next(),
                                                disabled: currentSlide === instanceRef.current.track.details.slides.length - 1,
                                                isRegional: isRegional
                                            })
                                        ]
                                    })
                                ]
                            })
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                            className: "p-4 text-secondary",
                            children: data[currentSlide]?.summary
                        })
                    ]
                })
            }),
            popImage && // <div
            //   className={`bg-black  ${
            //     popImage ? "bg-opacity-90" : "bg-opacity-0 h-0"
            //   } z-[998] transition-all duration-200 ease-in-out fixed top-0 left-0 w-full h-full  flex justify-center items-center`}
            //   onClick={() => {
            //     setPopImage(false);
            //   }}
            // >
            //   {/* <div
            //     className={`fixed md:px-10 z-[998] overflow-x-hidden overflow-y-hidden bottom-10 md:left-[calc(41%-384px)] left-0 h-[70%] md:h-[calc(90%-1rem)] 2xl:md:h-[calc(83%-1rem)] w-full md:max-w-screen-lg 2xl:left-[calc(33%-384px)] 2xl:max-w-screen-3xl`}
            //   > */}
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
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(yet_another_react_lightbox__WEBPACK_IMPORTED_MODULE_7__/* ["default"] */ .ZP, {
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
                    yet_another_react_lightbox_plugins_zoom__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z,
                    yet_another_react_lightbox_plugins_captions__WEBPACK_IMPORTED_MODULE_9__/* ["default"] */ .Z
                ],
                toolbar: {
                    buttons: [
                        "zoom",
                        "close"
                    ]
                },
                render: {
                    iconCaptionsHidden: ()=>/*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                            className: "wrapper-btn-caption flex justify-end",
                            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("button", {
                                type: "button",
                                className: "yarl__button-custom",
                                children: "Deskripsi"
                            }, "my-button")
                        }),
                    iconCaptionsVisible: ()=>/*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                            className: "wrapper-btn-caption flex justify-end",
                            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("button", {
                                type: "button",
                                className: "yarl__button_custom-close-caption",
                                children: "Tutup"
                            }, "my-button")
                        })
                }
            })
        ]
    });
};
function Arrow(props) {
    const disabeld = props.disabled ? " opacity-50" : "";
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
        onClick: props.onClick,
        className: `absolute top-[50%] text-black bg-white bg-opacity-40 ${props.left ? "left-0" : "left-auto right-[0px]"}`,
        children: [
            props.left && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(react_icons_md__WEBPACK_IMPORTED_MODULE_10__/* .MdOutlineArrowBackIos */ .oTp, {
                className: `${disabeld} ${props.isRegional ? "text-secondary" : "text-primary"} text-[40px] cursor-pointer bg-opacity-70`
            }),
            !props.left && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(react_icons_md__WEBPACK_IMPORTED_MODULE_10__/* .MdOutlineArrowForwardIos */ .Djl, {
                className: `${disabeld} ${props.isRegional ? "text-secondary" : "text-primary"} text-[40px] cursor-pointer bg-opacity-70`
            })
        ]
    });
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SlideFoto);


/***/ }),

/***/ 37800:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ZP: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* unused harmony exports __esModule, $$typeof */
/* harmony import */ var next_dist_build_webpack_loaders_next_flight_loader_module_proxy__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(61363);

const proxy = (0,next_dist_build_webpack_loaders_next_flight_loader_module_proxy__WEBPACK_IMPORTED_MODULE_0__.createProxy)(String.raw`C:\xampp\htdocs\neracaruang_web\neraca-ruang-fe-main\src\components\SlideFoto.js`)

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