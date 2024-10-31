"use strict";
exports.id = 8660;
exports.ids = [8660];
exports.modules = {

/***/ 28660:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AlbumSlider: () => (/* binding */ AlbumSlider),
/* harmony export */   InfografisSlider: () => (/* binding */ InfografisSlider),
/* harmony export */   KabarSlider: () => (/* binding */ KabarSlider),
/* harmony export */   SearchInfografisSlider: () => (/* binding */ SearchInfografisSlider),
/* harmony export */   SearchSlider: () => (/* binding */ SearchSlider),
/* harmony export */   VideoSlider: () => (/* binding */ VideoSlider)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(56786);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var next_image__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(52451);
/* harmony import */ var next_image__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_image__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(11440);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_link__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var keen_slider_keen_slider_min_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(95449);
/* harmony import */ var keen_slider_keen_slider_min_css__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(keen_slider_keen_slider_min_css__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var keen_slider_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(3322);
/* harmony import */ var _utils_fonts__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(57298);
/* harmony import */ var _utils_fonts__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_utils_fonts__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(18038);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _Card__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(74104);
/* __next_internal_client_entry_do_not_use__ KabarSlider,VideoSlider,InfografisSlider,AlbumSlider,SearchSlider,SearchInfografisSlider auto */ 







function KabarSlider({ data }) {
    const [currentSlide, setCurrentSlide] = (0,react__WEBPACK_IMPORTED_MODULE_5__.useState)(0);
    const [sliderRef] = (0,keen_slider_react__WEBPACK_IMPORTED_MODULE_4__/* .useKeenSlider */ .E)({
        slideChanged (slider) {
            setCurrentSlide(slider.track.details.rel);
        },
        mode: "snap",
        slides: {
            perView: 1
        },
        breakpoints: {
            "(min-width: 768px)": {
                slides: {
                    origin: "center",
                    perView: data.length > 1 ? 2 : 1,
                    spacing: 15
                }
            }
        },
        loop: true
    });
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
        ref: sliderRef,
        className: "keen-slider w-screen",
        children: data.map((value, key)=>{
            return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                className: "relative keen-slider__slide",
                children: [
                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                        className: `relative h-[calc(100vw*0.5)] md:h-[calc(60vw*0.5)] lg:h-[calc(50vw*0.5)] duration-300 ${currentSlide !== key ? "opacity-40" : ""}`,
                        children: [
                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((next_image__WEBPACK_IMPORTED_MODULE_1___default()), {
                                fill: true,
                                className: "w-full object-cover",
                                alt: value.title,
                                src: "https://staging.gerai.neracaruang.com/" + value.image
                            }),
                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                className: "w-full px-4 absolute bottom-12 md:bottom-14 text-white text-center",
                                children: [
                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                                        className: `font-bold text-sm md:text-lg drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] ${(_utils_fonts__WEBPACK_IMPORTED_MODULE_7___default().className)}`,
                                        children: value.title
                                    }),
                                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", {
                                        className: "italic text-xs md:text-sm drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]",
                                        children: [
                                            value.writer.name,
                                            ", ",
                                            value.publish_date
                                        ]
                                    })
                                ]
                            })
                        ]
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((next_link__WEBPACK_IMPORTED_MODULE_2___default()), {
                        href: `/kabar/${value.slug}`,
                        className: "absolute bottom-2 md:bottom-4 w-full text-center",
                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("button", {
                            className: "rounded-full text-primary text-sm italic mt-2 py-2 px-8 font-semibold bg-blue-50",
                            children: "Baca"
                        })
                    })
                ]
            }, "kabar" + key);
        })
    });
}
function VideoSlider({ data }) {
    const [currentSlide, setCurrentSlide] = (0,react__WEBPACK_IMPORTED_MODULE_5__.useState)(0);
    const [sliderRef] = (0,keen_slider_react__WEBPACK_IMPORTED_MODULE_4__/* .useKeenSlider */ .E)({
        slideChanged (slider) {
            setCurrentSlide(slider.track.details.rel);
        },
        mode: "snap",
        slides: {
            perView: 1
        },
        breakpoints: {
            "(min-width: 768px)": {
                slides: {
                    origin: "center",
                    perView: data.length > 1 ? 2 : 1,
                    spacing: 15
                }
            }
        },
        loop: true
    });
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
        ref: sliderRef,
        className: "keen-slider w-screen",
        children: data.map((value, key)=>{
            return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                className: "relative keen-slider__slide",
                children: [
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                        className: `relative h-[calc(100vw*0.5)] md:h-[calc(60vw*0.5)] lg:h-[calc(50vw*0.5)] duration-300 ${currentSlide !== key ? "opacity-40" : ""}`,
                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((next_image__WEBPACK_IMPORTED_MODULE_1___default()), {
                            fill: true,
                            className: "w-full object-cover",
                            alt: value.title,
                            src: "https://staging.gerai.neracaruang.com/" + value.image
                        })
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((next_link__WEBPACK_IMPORTED_MODULE_2___default()), {
                        href: "/video?content_slug=" + value.slug,
                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("button", {
                            className: "absolute px-6 py-2 mt-2 text-sm italic font-semibold rounded-full bottom-4 left-8 md:left-4 text-secondary bg-green-50",
                            children: "Tonton"
                        })
                    })
                ]
            }, "kabar" + key);
        })
    });
}
// export function VideoSlider({ data }) {
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const [sliderRef] = useKeenSlider({
//     slideChanged(slider) {
//       setCurrentSlide(slider.track.details.rel);
//     },
//     mode: "snap",
//     slides: {
//       perView: 1,
//     },
//     breakpoints: {
//       "(min-width: 768px)": {
//         slides: {
//           origin: "center",
//           perView: data.length > 1 ? 2 : 1,
//           spacing: 15,
//         },
//       },
//     },
//     loop: true,
//   });
//   return (
//     <div
//       ref={sliderRef}
//       className={`keen-slider ${
//         data.length > 1 ? "w-screen" : "w-full max-w-screen-md mx-auto"
//       }`}
//     >
//       {data.map((value, key) => {
//         return (
//           <div
//             className={`relative keen-slider__slide md:rounded-badge duration-300 ${
//               currentSlide !== key ? "opacity-40" : ""
//             }`}
//             key={"vid" + key}
//           >
//             <ImageComponent
//               src={process.env.NEXT_PUBLIC_STAGING_URL + value.image}
//               sizes="100vw"
//               className={"h-full w-full object-cover"}
//               dummy={"/detail-kabar.png"}
//               alt={value.slug}
//               width={0}
//               height={0}
//             />
//             <Link href={"/video/" + value.slug}>
//               <button className="absolute px-6 py-2 mt-2 text-sm italic font-semibold rounded-full bottom-4 left-8 md:left-4 text-secondary bg-green-50">
//                 Tonton
//               </button>
//             </Link>
//           </div>
//         );
//       })}
//     </div>
//   );
// }
function InfografisSlider({ data }) {
    const [currentSlide, setCurrentSlide] = (0,react__WEBPACK_IMPORTED_MODULE_5__.useState)(0);
    const [loaded, setLoaded] = (0,react__WEBPACK_IMPORTED_MODULE_5__.useState)(false);
    const [sliderRef, instanceRef] = (0,keen_slider_react__WEBPACK_IMPORTED_MODULE_4__/* .useKeenSlider */ .E)({
        slides: {
            perView: 1
        },
        slideChanged (slider) {
            setCurrentSlide(slider.track.details.rel);
        },
        created () {
            setLoaded(true);
        }
    });
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
            className: "rounded-box border-2 border-gray-300 w-screen md:w-full lg:max-w-[50vw] p-2 md:p-4 mx-auto",
            children: [
                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                    ref: sliderRef,
                    className: "keen-slider",
                    children: data.map((value, key)=>{
                        return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                            className: `keen-slider__slide w-full relative pb-2`,
                            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((next_link__WEBPACK_IMPORTED_MODULE_2___default()), {
                                href: "/info-grafis",
                                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((next_image__WEBPACK_IMPORTED_MODULE_1___default()), {
                                    width: 711,
                                    height: 365,
                                    className: "w-screen md:w-full object-cover",
                                    alt: value.title,
                                    src: "https://staging.gerai.neracaruang.com/" + value.medias[0].image
                                })
                            })
                        }, "info" + key);
                    })
                }),
                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                    className: "flex items-center justify-between w-full",
                    children: [
                        loaded && instanceRef.current && /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                            className: "flex flex-1 gap-4",
                            children: [
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("button", {
                                    onClick: (e)=>e.stopPropagation() || instanceRef.current?.prev(),
                                    className: "disabled:opacity-30",
                                    disabled: currentSlide === 0,
                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                        className: "",
                                        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("svg", {
                                            width: "46",
                                            height: "46",
                                            viewBox: "0 0 46 46",
                                            fill: "none",
                                            xmlns: "http://www.w3.org/2000/svg",
                                            children: [
                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("g", {
                                                    filter: "url(#filter0_i_0_1)",
                                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("circle", {
                                                        cx: "23",
                                                        cy: "23",
                                                        r: "23",
                                                        fill: "#D9D9D9"
                                                    })
                                                }),
                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("g", {
                                                    filter: "url(#filter1_d_0_1)",
                                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("path", {
                                                        d: "M11.9393 22.9393C11.3536 23.5251 11.3536 24.4749 11.9393 25.0607L21.4853 34.6066C22.0711 35.1924 23.0208 35.1924 23.6066 34.6066C24.1924 34.0208 24.1924 33.0711 23.6066 32.4853L15.1213 24L23.6066 15.5147C24.1924 14.9289 24.1924 13.9792 23.6066 13.3934C23.0208 12.8076 22.0711 12.8076 21.4853 13.3934L11.9393 22.9393ZM32 25.5C32.8284 25.5 33.5 24.8284 33.5 24C33.5 23.1716 32.8284 22.5 32 22.5L32 25.5ZM13 25.5L32 25.5L32 22.5L13 22.5L13 25.5Z",
                                                        fill: "black"
                                                    })
                                                }),
                                                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("defs", {
                                                    children: [
                                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("filter", {
                                                            id: "filter0_i_0_1",
                                                            x: "0",
                                                            y: "0",
                                                            width: "46",
                                                            height: "50",
                                                            filterUnits: "userSpaceOnUse",
                                                            colorInterpolationFilters: "sRGB",
                                                            children: [
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("feFlood", {
                                                                    floodOpacity: "0",
                                                                    result: "BackgroundImageFix"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("feBlend", {
                                                                    mode: "normal",
                                                                    in: "SourceGraphic",
                                                                    in2: "BackgroundImageFix",
                                                                    result: "shape"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("feColorMatrix", {
                                                                    in: "SourceAlpha",
                                                                    type: "matrix",
                                                                    values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0",
                                                                    result: "hardAlpha"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("feOffset", {
                                                                    dy: "4"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("feGaussianBlur", {
                                                                    stdDeviation: "2"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("feComposite", {
                                                                    in2: "hardAlpha",
                                                                    operator: "arithmetic",
                                                                    k2: "-1",
                                                                    k3: "1"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("feColorMatrix", {
                                                                    type: "matrix",
                                                                    values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("feBlend", {
                                                                    mode: "normal",
                                                                    in2: "shape",
                                                                    result: "effect1_innerShadow_0_1"
                                                                })
                                                            ]
                                                        }),
                                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("filter", {
                                                            id: "filter1_d_0_1",
                                                            x: "7.5",
                                                            y: "12.9541",
                                                            width: "30",
                                                            height: "30.0918",
                                                            filterUnits: "userSpaceOnUse",
                                                            colorInterpolationFilters: "sRGB",
                                                            children: [
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("feFlood", {
                                                                    floodOpacity: "0",
                                                                    result: "BackgroundImageFix"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("feColorMatrix", {
                                                                    in: "SourceAlpha",
                                                                    type: "matrix",
                                                                    values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0",
                                                                    result: "hardAlpha"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("feOffset", {
                                                                    dy: "4"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("feGaussianBlur", {
                                                                    stdDeviation: "2"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("feComposite", {
                                                                    in2: "hardAlpha",
                                                                    operator: "out"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("feColorMatrix", {
                                                                    type: "matrix",
                                                                    values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("feBlend", {
                                                                    mode: "normal",
                                                                    in2: "BackgroundImageFix",
                                                                    result: "effect1_dropShadow_0_1"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("feBlend", {
                                                                    mode: "normal",
                                                                    in: "SourceGraphic",
                                                                    in2: "effect1_dropShadow_0_1",
                                                                    result: "shape"
                                                                })
                                                            ]
                                                        })
                                                    ]
                                                })
                                            ]
                                        })
                                    })
                                }),
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("button", {
                                    onClick: (e)=>e.stopPropagation() || instanceRef.current?.next(),
                                    className: "disabled:opacity-30",
                                    disabled: currentSlide === instanceRef.current.track.details.slides.length - 1,
                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                        className: "",
                                        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("svg", {
                                            width: "46",
                                            height: "46",
                                            viewBox: "0 0 46 46",
                                            fill: "none",
                                            xmlns: "http://www.w3.org/2000/svg",
                                            children: [
                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("g", {
                                                    filter: "url(#filter0_i_0_1)",
                                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("circle", {
                                                        cx: "23",
                                                        cy: "23",
                                                        r: "23",
                                                        fill: "#D9D9D9"
                                                    })
                                                }),
                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("g", {
                                                    filter: "url(#filter1_d_0_1)",
                                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("path", {
                                                        d: "M13 22.5C12.1716 22.5 11.5 23.1716 11.5 24C11.5 24.8284 12.1716 25.5 13 25.5L13 22.5ZM33.0607 25.0607C33.6464 24.4749 33.6464 23.5251 33.0607 22.9393L23.5147 13.3934C22.9289 12.8076 21.9792 12.8076 21.3934 13.3934C20.8076 13.9792 20.8076 14.9289 21.3934 15.5147L29.8787 24L21.3934 32.4853C20.8076 33.0711 20.8076 34.0208 21.3934 34.6066C21.9792 35.1924 22.9289 35.1924 23.5147 34.6066L33.0607 25.0607ZM13 25.5L32 25.5L32 22.5L13 22.5L13 25.5Z",
                                                        fill: "black"
                                                    })
                                                }),
                                                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("defs", {
                                                    children: [
                                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("filter", {
                                                            id: "filter0_i_0_1",
                                                            x: "0",
                                                            y: "0",
                                                            width: "46",
                                                            height: "50",
                                                            filterUnits: "userSpaceOnUse",
                                                            colorInterpolationFilters: "sRGB",
                                                            children: [
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("feFlood", {
                                                                    floodOpacity: "0",
                                                                    result: "BackgroundImageFix"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("feBlend", {
                                                                    mode: "normal",
                                                                    in: "SourceGraphic",
                                                                    in2: "BackgroundImageFix",
                                                                    result: "shape"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("feColorMatrix", {
                                                                    in: "SourceAlpha",
                                                                    type: "matrix",
                                                                    values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0",
                                                                    result: "hardAlpha"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("feOffset", {
                                                                    dy: "4"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("feGaussianBlur", {
                                                                    stdDeviation: "2"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("feComposite", {
                                                                    in2: "hardAlpha",
                                                                    operator: "arithmetic",
                                                                    k2: "-1",
                                                                    k3: "1"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("feColorMatrix", {
                                                                    type: "matrix",
                                                                    values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("feBlend", {
                                                                    mode: "normal",
                                                                    in2: "shape",
                                                                    result: "effect1_innerShadow_0_1"
                                                                })
                                                            ]
                                                        }),
                                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("filter", {
                                                            id: "filter1_d_0_1",
                                                            x: "7.5",
                                                            y: "12.9541",
                                                            width: "30",
                                                            height: "30.0918",
                                                            filterUnits: "userSpaceOnUse",
                                                            colorInterpolationFilters: "sRGB",
                                                            children: [
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("feFlood", {
                                                                    floodOpacity: "0",
                                                                    result: "BackgroundImageFix"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("feColorMatrix", {
                                                                    in: "SourceAlpha",
                                                                    type: "matrix",
                                                                    values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0",
                                                                    result: "hardAlpha"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("feOffset", {
                                                                    dy: "4"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("feGaussianBlur", {
                                                                    stdDeviation: "2"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("feComposite", {
                                                                    in2: "hardAlpha",
                                                                    operator: "out"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("feColorMatrix", {
                                                                    type: "matrix",
                                                                    values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("feBlend", {
                                                                    mode: "normal",
                                                                    in2: "BackgroundImageFix",
                                                                    result: "effect1_dropShadow_0_1"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("feBlend", {
                                                                    mode: "normal",
                                                                    in: "SourceGraphic",
                                                                    in2: "effect1_dropShadow_0_1",
                                                                    result: "shape"
                                                                })
                                                            ]
                                                        })
                                                    ]
                                                })
                                            ]
                                        })
                                    })
                                })
                            ]
                        }),
                        loaded && instanceRef.current && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                            className: "hidden md:flex flex-1 gap-2 text-center justify-center",
                            children: [
                                ...Array(instanceRef.current.track.details.slides.length).keys()
                            ].map((idx)=>{
                                return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("button", {
                                    onClick: ()=>{
                                        instanceRef.current?.moveToIdx(idx);
                                    },
                                    className: `bg-primary w-4 h-4 rounded-full hover:drop-shadow-none hover:opacity-100 ${currentSlide === idx ? "opacity-100" : "opacity-50 drop-shadow-[0_5px_3px_rgba(0,0,0,0.4)]"}`
                                }, idx);
                            })
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                            className: "flex-1 text-center md:text-right",
                            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((next_link__WEBPACK_IMPORTED_MODULE_2___default()), {
                                href: "/info-grafis",
                                className: "block md:inline rounded-full text-primary text-xs italic p-4 font-semibold bg-gray-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]",
                                children: "Infografis Lainnya"
                            })
                        })
                    ]
                })
            ]
        })
    });
}
function AlbumSlider({ data }) {
    const [currentSlide, setCurrentSlide] = (0,react__WEBPACK_IMPORTED_MODULE_5__.useState)(0);
    const [loaded, setLoaded] = (0,react__WEBPACK_IMPORTED_MODULE_5__.useState)(false);
    const [sliderRef, instanceRef] = (0,keen_slider_react__WEBPACK_IMPORTED_MODULE_4__/* .useKeenSlider */ .E)({
        slides: {
            perView: 1
        },
        slideChanged (slider) {
            setCurrentSlide(slider.track.details.rel);
        },
        created () {
            setLoaded(true);
        }
    });
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
            className: "w-screen lg:max-w-[50vw] mx-auto",
            children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                ref: sliderRef,
                className: "md:rounded-box keen-slider relative",
                children: [
                    data.map((value, key)=>{
                        return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                            id: "foto" + key,
                            className: `keen-slider__slide w-full relative bg-black`,
                            children: [
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((next_image__WEBPACK_IMPORTED_MODULE_1___default()), {
                                    width: 711,
                                    height: 365,
                                    className: "w-screen opacity-50 md:w-full object-cover",
                                    alt: value.link,
                                    src: "https://staging.gerai.neracaruang.com/" + value.medias[0].image
                                }),
                                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                    className: "absolute w-full text-center text-white bottom-2 md:bottom-16",
                                    children: [
                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                                            className: `font-bold md:text-4xl ${(_utils_fonts__WEBPACK_IMPORTED_MODULE_7___default().className)}`,
                                            children: value.title
                                        }),
                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", {
                                            className: "italic text-xs md:text-sm mb-3",
                                            children: [
                                                value.writer.name,
                                                ", ",
                                                value.publish_date
                                            ]
                                        }),
                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((next_link__WEBPACK_IMPORTED_MODULE_2___default()), {
                                            href: "/album/" + value.slug,
                                            className: "rounded-full text-primary text-sm italic mt-2 py-2 px-4 invisible md:visible font-semibold bg-blue-50",
                                            children: "Lihat Detail"
                                        })
                                    ]
                                })
                            ]
                        }, "foto" + key);
                    }),
                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                        className: "absolute bottom-2 rounded-badge flex items-center justify-between w-full px-4",
                        children: [
                            loaded && instanceRef.current && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                className: "hidden md:flex flex-1 gap-4",
                                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("button", {
                                    onClick: (e)=>e.stopPropagation() || instanceRef.current?.prev(),
                                    className: "disabled:opacity-30",
                                    disabled: currentSlide === 0,
                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                        className: "",
                                        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("svg", {
                                            width: "46",
                                            height: "46",
                                            viewBox: "0 0 46 46",
                                            fill: "none",
                                            xmlns: "http://www.w3.org/2000/svg",
                                            children: [
                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("g", {
                                                    filter: "url(#filter0_i_0_1)",
                                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("circle", {
                                                        cx: "23",
                                                        cy: "23",
                                                        r: "23",
                                                        fill: "#D9D9D9"
                                                    })
                                                }),
                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("g", {
                                                    filter: "url(#filter1_d_0_1)",
                                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("path", {
                                                        d: "M11.9393 22.9393C11.3536 23.5251 11.3536 24.4749 11.9393 25.0607L21.4853 34.6066C22.0711 35.1924 23.0208 35.1924 23.6066 34.6066C24.1924 34.0208 24.1924 33.0711 23.6066 32.4853L15.1213 24L23.6066 15.5147C24.1924 14.9289 24.1924 13.9792 23.6066 13.3934C23.0208 12.8076 22.0711 12.8076 21.4853 13.3934L11.9393 22.9393ZM32 25.5C32.8284 25.5 33.5 24.8284 33.5 24C33.5 23.1716 32.8284 22.5 32 22.5L32 25.5ZM13 25.5L32 25.5L32 22.5L13 22.5L13 25.5Z",
                                                        fill: "black"
                                                    })
                                                }),
                                                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("defs", {
                                                    children: [
                                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("filter", {
                                                            id: "filter0_i_0_1",
                                                            x: "0",
                                                            y: "0",
                                                            width: "46",
                                                            height: "50",
                                                            filterUnits: "userSpaceOnUse",
                                                            colorInterpolationFilters: "sRGB",
                                                            children: [
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("feFlood", {
                                                                    floodOpacity: "0",
                                                                    result: "BackgroundImageFix"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("feBlend", {
                                                                    mode: "normal",
                                                                    in: "SourceGraphic",
                                                                    in2: "BackgroundImageFix",
                                                                    result: "shape"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("feColorMatrix", {
                                                                    in: "SourceAlpha",
                                                                    type: "matrix",
                                                                    values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0",
                                                                    result: "hardAlpha"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("feOffset", {
                                                                    dy: "4"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("feGaussianBlur", {
                                                                    stdDeviation: "2"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("feComposite", {
                                                                    in2: "hardAlpha",
                                                                    operator: "arithmetic",
                                                                    k2: "-1",
                                                                    k3: "1"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("feColorMatrix", {
                                                                    type: "matrix",
                                                                    values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("feBlend", {
                                                                    mode: "normal",
                                                                    in2: "shape",
                                                                    result: "effect1_innerShadow_0_1"
                                                                })
                                                            ]
                                                        }),
                                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("filter", {
                                                            id: "filter1_d_0_1",
                                                            x: "7.5",
                                                            y: "12.9541",
                                                            width: "30",
                                                            height: "30.0918",
                                                            filterUnits: "userSpaceOnUse",
                                                            colorInterpolationFilters: "sRGB",
                                                            children: [
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("feFlood", {
                                                                    floodOpacity: "0",
                                                                    result: "BackgroundImageFix"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("feColorMatrix", {
                                                                    in: "SourceAlpha",
                                                                    type: "matrix",
                                                                    values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0",
                                                                    result: "hardAlpha"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("feOffset", {
                                                                    dy: "4"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("feGaussianBlur", {
                                                                    stdDeviation: "2"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("feComposite", {
                                                                    in2: "hardAlpha",
                                                                    operator: "out"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("feColorMatrix", {
                                                                    type: "matrix",
                                                                    values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("feBlend", {
                                                                    mode: "normal",
                                                                    in2: "BackgroundImageFix",
                                                                    result: "effect1_dropShadow_0_1"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("feBlend", {
                                                                    mode: "normal",
                                                                    in: "SourceGraphic",
                                                                    in2: "effect1_dropShadow_0_1",
                                                                    result: "shape"
                                                                })
                                                            ]
                                                        })
                                                    ]
                                                })
                                            ]
                                        })
                                    })
                                })
                            }),
                            loaded && instanceRef.current && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                className: "flex flex-1 gap-2 text-center justify-center",
                                children: [
                                    ...Array(instanceRef.current.track.details.slides.length).keys()
                                ].map((idx)=>{
                                    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("button", {
                                        onClick: ()=>{
                                            instanceRef.current?.moveToIdx(idx);
                                        },
                                        className: `bg-primary w-4 h-4 rounded-full hover:drop-shadow-none hover:opacity-100 ${currentSlide === idx ? "opacity-100" : "opacity-50 drop-shadow-[0_5px_3px_rgba(0,0,0,0.4)]"}`
                                    }, idx);
                                })
                            }),
                            loaded && instanceRef.current && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                className: "hidden md:flex flex-1 justify-end",
                                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("button", {
                                    onClick: (e)=>e.stopPropagation() || instanceRef.current?.next(),
                                    className: "disabled:opacity-30",
                                    disabled: currentSlide === instanceRef.current.track.details.slides.length - 1,
                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                        className: "",
                                        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("svg", {
                                            width: "46",
                                            height: "46",
                                            viewBox: "0 0 46 46",
                                            fill: "none",
                                            xmlns: "http://www.w3.org/2000/svg",
                                            children: [
                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("g", {
                                                    filter: "url(#filter0_i_0_1)",
                                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("circle", {
                                                        cx: "23",
                                                        cy: "23",
                                                        r: "23",
                                                        fill: "#D9D9D9"
                                                    })
                                                }),
                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("g", {
                                                    filter: "url(#filter1_d_0_1)",
                                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("path", {
                                                        d: "M13 22.5C12.1716 22.5 11.5 23.1716 11.5 24C11.5 24.8284 12.1716 25.5 13 25.5L13 22.5ZM33.0607 25.0607C33.6464 24.4749 33.6464 23.5251 33.0607 22.9393L23.5147 13.3934C22.9289 12.8076 21.9792 12.8076 21.3934 13.3934C20.8076 13.9792 20.8076 14.9289 21.3934 15.5147L29.8787 24L21.3934 32.4853C20.8076 33.0711 20.8076 34.0208 21.3934 34.6066C21.9792 35.1924 22.9289 35.1924 23.5147 34.6066L33.0607 25.0607ZM13 25.5L32 25.5L32 22.5L13 22.5L13 25.5Z",
                                                        fill: "black"
                                                    })
                                                }),
                                                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("defs", {
                                                    children: [
                                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("filter", {
                                                            id: "filter0_i_0_1",
                                                            x: "0",
                                                            y: "0",
                                                            width: "46",
                                                            height: "50",
                                                            filterUnits: "userSpaceOnUse",
                                                            colorInterpolationFilters: "sRGB",
                                                            children: [
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("feFlood", {
                                                                    floodOpacity: "0",
                                                                    result: "BackgroundImageFix"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("feBlend", {
                                                                    mode: "normal",
                                                                    in: "SourceGraphic",
                                                                    in2: "BackgroundImageFix",
                                                                    result: "shape"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("feColorMatrix", {
                                                                    in: "SourceAlpha",
                                                                    type: "matrix",
                                                                    values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0",
                                                                    result: "hardAlpha"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("feOffset", {
                                                                    dy: "4"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("feGaussianBlur", {
                                                                    stdDeviation: "2"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("feComposite", {
                                                                    in2: "hardAlpha",
                                                                    operator: "arithmetic",
                                                                    k2: "-1",
                                                                    k3: "1"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("feColorMatrix", {
                                                                    type: "matrix",
                                                                    values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("feBlend", {
                                                                    mode: "normal",
                                                                    in2: "shape",
                                                                    result: "effect1_innerShadow_0_1"
                                                                })
                                                            ]
                                                        }),
                                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("filter", {
                                                            id: "filter1_d_0_1",
                                                            x: "7.5",
                                                            y: "12.9541",
                                                            width: "30",
                                                            height: "30.0918",
                                                            filterUnits: "userSpaceOnUse",
                                                            colorInterpolationFilters: "sRGB",
                                                            children: [
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("feFlood", {
                                                                    floodOpacity: "0",
                                                                    result: "BackgroundImageFix"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("feColorMatrix", {
                                                                    in: "SourceAlpha",
                                                                    type: "matrix",
                                                                    values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0",
                                                                    result: "hardAlpha"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("feOffset", {
                                                                    dy: "4"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("feGaussianBlur", {
                                                                    stdDeviation: "2"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("feComposite", {
                                                                    in2: "hardAlpha",
                                                                    operator: "out"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("feColorMatrix", {
                                                                    type: "matrix",
                                                                    values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("feBlend", {
                                                                    mode: "normal",
                                                                    in2: "BackgroundImageFix",
                                                                    result: "effect1_dropShadow_0_1"
                                                                }),
                                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("feBlend", {
                                                                    mode: "normal",
                                                                    in: "SourceGraphic",
                                                                    in2: "effect1_dropShadow_0_1",
                                                                    result: "shape"
                                                                })
                                                            ]
                                                        })
                                                    ]
                                                })
                                            ]
                                        })
                                    })
                                })
                            })
                        ]
                    })
                ]
            })
        })
    });
}
// export function SearchSlider({ data, isRegional, type, url }) {
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const [loaded, setLoaded] = useState(false);
//   const [sliderRef, instanceRef] = useKeenSlider({
//     slides: {
//       perView: 1,
//     },
//     breakpoints: {
//       "(min-width: 768px)": {
//         slides: {
//           perView: data.length > 1 ? 2 : 1,
//         },
//       },
//     },
//     slideChanged(slider) {
//       setCurrentSlide(slider.track.details.rel);
//     },
//     created() {
//       setLoaded(true);
//     },
//   });
//   type == "jurnal" ? type + 'ada jurnal': 'jurnal not found'
//   return (
//     <>
//       <div className="w-full mx-auto">
//         <div ref={sliderRef} className="keen-slider !static">
//           {data.map((value, key) => {
//             return (
//               <div
//                 key={type + key}
//                 className={`keen-slider__slide w-full md:px-2 pb-4`}
//               >
//                 <Card
//                   data={value}
//                   isGrid={true}
//                   type={type}
//                   isRegional={isRegional}
//                 />
//               </div>
//             );
//           })}
//           <div className="absolute bottom-1/2 left-0 rounded-badge flex items-center justify-between w-full">
//             {loaded && instanceRef.current && (
//               <div className="flex flex-1 gap-4">
//                 <Link href={url ?? ''}>
//                   <span>
//                     <Image
//                       src={`/images/icons/arrow${isRegional ? '-green-left' : ''}.png`}
//                       className={`${isRegional ? '' : 'rotate-180'}`}
//                       width={50}
//                       height={50}
//                     />
//                   </span>
//                 </Link>
//               </div>
//             )}
//             {loaded && instanceRef.current && (
//               <div className="flex flex-1 justify-end">
//                 <Link href={url ?? ''}>
//                   <span>
//                     <Image
//                       src={`/images/icons/arrow${isRegional ? '-green-left' : '-left'}.png`}
//                       className="rotate-180"
//                       width={50}
//                       height={50}
//                     />
//                   </span>
//                 </Link>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
function SearchSlider({ data, isRegional, type, url }) {
    console.log(data.length);
    const [currentSlide, setCurrentSlide] = (0,react__WEBPACK_IMPORTED_MODULE_5__.useState)(0);
    const [loaded, setLoaded] = (0,react__WEBPACK_IMPORTED_MODULE_5__.useState)(false);
    const [sliderRef, instanceRef] = (0,keen_slider_react__WEBPACK_IMPORTED_MODULE_4__/* .useKeenSlider */ .E)({
        initial: 0,
        breakpoints: {
            "(min-width: 768px)": {
                slides: {
                    perView: data.length > 1 ? 2 : 1
                }
            }
        },
        slideChanged (slider) {
            setCurrentSlide(slider.track.details.rel);
        },
        created () {
            setLoaded(true);
        }
    });
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
            className: "w-full mx-auto",
            children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                ref: sliderRef,
                className: "keen-slider !static",
                children: [
                    data.map((value, key)=>{
                        return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                            className: `keen-slider__slide w-full md:px-2 pb-4`,
                            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_Card__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .Z, {
                                data: value,
                                isGrid: true,
                                type: type,
                                isRegional: isRegional
                            })
                        }, type + key);
                    }),
                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                        className: "absolute bottom-1/2 left-0 rounded-badge flex items-center justify-between w-full",
                        children: [
                            loaded && instanceRef.current && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                className: "flex flex-1 gap-4",
                                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                    onClick: (e)=>e.stopPropagation() || instanceRef.current?.prev(),
                                    disabled: currentSlide === 0,
                                    className: "cursor-pointer",
                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((next_image__WEBPACK_IMPORTED_MODULE_1___default()), {
                                        src: `/images/icons/arrow${isRegional ? "-green-left" : ""}.png`,
                                        className: `${isRegional ? "" : "rotate-180"}`,
                                        width: 50,
                                        height: 50
                                    })
                                })
                            }),
                            loaded && instanceRef.current && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                className: "flex flex-1 justify-end",
                                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                    onClick: (e)=>e.stopPropagation() || instanceRef.current?.next(),
                                    disabled: currentSlide === instanceRef.current.track.details.slides.length - 1,
                                    className: "cursor-pointer",
                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((next_image__WEBPACK_IMPORTED_MODULE_1___default()), {
                                        src: `/images/icons/arrow${isRegional ? "-green-left" : "-left"}.png`,
                                        className: "rotate-180",
                                        width: 50,
                                        height: 50
                                    })
                                })
                            })
                        ]
                    })
                ]
            })
        })
    });
}
function SearchInfografisSlider({ data, isRegional, type, shadow, noTag, noComment, fullSize, isGrid, redirectTo }) {
    const [currentSlide, setCurrentSlide] = (0,react__WEBPACK_IMPORTED_MODULE_5__.useState)(0);
    const [loaded, setLoaded] = (0,react__WEBPACK_IMPORTED_MODULE_5__.useState)(false);
    const [sliderRef, instanceRef] = (0,keen_slider_react__WEBPACK_IMPORTED_MODULE_4__/* .useKeenSlider */ .E)({
        slides: {
            perView: 1
        },
        slideChanged (slider) {
            setCurrentSlide(slider.track.details.rel);
        },
        created () {
            setLoaded(true);
        }
    });
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
            className: `w-screen max-w-screen-sm mx-auto`,
            children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                ref: sliderRef,
                className: "md:rounded-box keen-slider border-2 shadow-md relative",
                children: [
                    data.map((value, key)=>{
                        return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                            className: `keen-slider__slide w-full pb-14 z-20`,
                            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_Card__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .Z, {
                                data: value,
                                redirectTo: redirectTo,
                                fullSize: fullSize,
                                isGrid: isGrid,
                                type: type,
                                shadow: shadow,
                                noTag: noTag,
                                noComment: noComment,
                                isRegional: isRegional
                            })
                        }, type + key);
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                        className: "absolute z-20 bottom-4 left-0 rounded-badge flex items-center justify-between w-full",
                        children: loaded && instanceRef.current && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                            className: "flex flex-1 gap-2 text-center justify-center",
                            children: [
                                ...Array(instanceRef.current.track.details.slides.length).keys()
                            ].map((idx)=>{
                                return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("button", {
                                    onClick: ()=>{
                                        instanceRef.current?.moveToIdx(idx);
                                    },
                                    className: `w-4 h-4 rounded-full hover:drop-shadow-none hover:opacity-100 ${isRegional ? "bg-secondary" : "bg-primary"} ${currentSlide === idx ? "opacity-100" : "opacity-50 drop-shadow-[0_5px_3px_rgba(0,0,0,0.4)]"}`
                                }, idx);
                            })
                        })
                    })
                ]
            })
        })
    });
}


/***/ })

};
;