exports.id = 439;
exports.ids = [439];
exports.modules = {

/***/ 34597:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

Promise.resolve(/* import() eager */).then(__webpack_require__.t.bind(__webpack_require__, 31232, 23));
Promise.resolve(/* import() eager */).then(__webpack_require__.t.bind(__webpack_require__, 52987, 23));
Promise.resolve(/* import() eager */).then(__webpack_require__.t.bind(__webpack_require__, 50831, 23));
Promise.resolve(/* import() eager */).then(__webpack_require__.t.bind(__webpack_require__, 56926, 23));
Promise.resolve(/* import() eager */).then(__webpack_require__.t.bind(__webpack_require__, 44282, 23))

/***/ }),

/***/ 22735:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

Promise.resolve(/* import() eager */).then(__webpack_require__.t.bind(__webpack_require__, 50954, 23))

/***/ }),

/***/ 71324:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 66201));
Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 76904))

/***/ }),

/***/ 28903:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ImageComponent)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(56786);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var next_image__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(52451);
/* harmony import */ var next_image__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_image__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(18038);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);
/* __next_internal_client_entry_do_not_use__ default auto */ 


function ImageComponent({ src, dummy, className, width, height, isFill, alt, isPriority, sizes }) {
    const [errorImage, setErrorImage] = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(false);
    const onLoadImage = (image, dummy)=>{
        if (errorImage) {
            return dummy;
        }
        return image;
    };
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
        children: isFill ? /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((next_image__WEBPACK_IMPORTED_MODULE_1___default()), {
            src: onLoadImage(src, dummy),
            fill: isFill,
            priority: isPriority,
            className: "object-cover w-full h-auto",
            onError: (e)=>setErrorImage(e.target.src),
            sizes: sizes,
            alt: alt ? alt : "image"
        }) : /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((next_image__WEBPACK_IMPORTED_MODULE_1___default()), {
            src: onLoadImage(src, dummy),
            priority: isPriority,
            className: className,
            onError: (e)=>setErrorImage(e.target.src),
            width: width,
            height: height,
            sizes: sizes,
            alt: alt ? alt : "image"
        })
    });
}


/***/ }),

/***/ 95447:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  Z: () => (/* binding */ AuthComponet)
});

// EXTERNAL MODULE: external "next/dist/compiled/react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(56786);
// EXTERNAL MODULE: external "next/dist/compiled/react"
var react_ = __webpack_require__(18038);
// EXTERNAL MODULE: ./node_modules/react-hook-form/dist/index.esm.mjs
var index_esm = __webpack_require__(66558);
// EXTERNAL MODULE: ./node_modules/@hookform/resolvers/yup/dist/yup.mjs + 1 modules
var yup = __webpack_require__(57086);
// EXTERNAL MODULE: ./node_modules/yup/index.js
var node_modules_yup = __webpack_require__(50298);
// EXTERNAL MODULE: ./node_modules/next/image.js
var next_image = __webpack_require__(52451);
var image_default = /*#__PURE__*/__webpack_require__.n(next_image);
// EXTERNAL MODULE: ./src/modules/auth/usecases/auth.usecase.js
var auth_usecase = __webpack_require__(37951);
// EXTERNAL MODULE: ./node_modules/next/navigation.js
var navigation = __webpack_require__(57114);
// EXTERNAL MODULE: ./src/components/form/input.js + 2 modules
var input = __webpack_require__(97162);
;// CONCATENATED MODULE: ./src/components/auth/LoginPage.js
/* __next_internal_client_entry_do_not_use__ default auto */ 








const schema = node_modules_yup/* object */.Ry({
    email: node_modules_yup/* string */.Z_().required("Email is required"),
    password: node_modules_yup/* string */.Z_().required("Password is required").min(8, "Password length should be at least 8 characters")
}).required();
const LoginComponent = ({ ChangePage })=>{
    const { register, handleSubmit, formState: { errors } } = (0,index_esm/* useForm */.cI)({
        resolver: (0,yup/* yupResolver */.X)(schema)
    });
    const router = (0,navigation.useRouter)();
    const onSubmit = async (data)=>{
        const SubmitLogin = await (0,auth_usecase/* LoginUseCase */.ko)(data);
        if (SubmitLogin) {
            router.push("/profile");
        } else {
            alert("wrong email & password");
        }
    };
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
        className: "flex w-full flex-col md:flex-row z-[9999]",
        children: [
            /*#__PURE__*/ jsx_runtime_.jsx("div", {
                className: "flex items-center justify-center md:w-[40%] w-full py-3 md:py-0 md:rounded-l-[85px] md:rounded-tr-none rounded-t-[85px] bg-primary",
                children: /*#__PURE__*/ jsx_runtime_.jsx((image_default()), {
                    src: "/images/banner/login_banner.png",
                    width: 200,
                    height: 59,
                    alt: "banner login"
                })
            }),
            /*#__PURE__*/ jsx_runtime_.jsx("div", {
                className: "w-full md:w-[60%] pb-3",
                children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                    className: "flex flex-col items-center justify-center",
                    children: [
                        /*#__PURE__*/ jsx_runtime_.jsx("div", {
                            className: "w-[80%] flex flex-col items-center justify-center pt-14 pb-3 space-y-2",
                            children: /*#__PURE__*/ jsx_runtime_.jsx("h3", {
                                className: "font-extrabold text-[29px] leading-[39px] text-primary pb-5 shadow-text",
                                children: "Selamat Datang"
                            })
                        }),
                        /*#__PURE__*/ (0,jsx_runtime_.jsxs)("form", {
                            onSubmit: handleSubmit(onSubmit),
                            className: "w-[80%] space-y-2 flex flex-col items-center justify-center",
                            children: [
                                /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                                    className: "w-full",
                                    children: [
                                        /*#__PURE__*/ jsx_runtime_.jsx(input/* default */.Z, {
                                            type: "email",
                                            placeholder: "Email",
                                            className: `py-2`,
                                            register: register("email")
                                        }),
                                        /*#__PURE__*/ jsx_runtime_.jsx("div", {
                                            className: "text-[11px] leading-[13px] text-primary text-center pt-2",
                                            children: errors.email?.message
                                        })
                                    ]
                                }),
                                /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                                    className: "w-full",
                                    children: [
                                        /*#__PURE__*/ jsx_runtime_.jsx(input/* default */.Z, {
                                            type: "password",
                                            placeholder: "Kata Sandi",
                                            className: `py-2`,
                                            register: register("password")
                                        }),
                                        /*#__PURE__*/ jsx_runtime_.jsx("div", {
                                            className: "flex justify-end",
                                            children: /*#__PURE__*/ jsx_runtime_.jsx("div", {
                                                className: "text-blue-500 text-xs pr-5 pt-1 font-bold italic cursor-pointer",
                                                onClick: ()=>{
                                                    ChangePage("forgot");
                                                },
                                                children: "Forgot Password?"
                                            })
                                        }),
                                        /*#__PURE__*/ jsx_runtime_.jsx("div", {
                                            className: "text-[11px] leading-[13px] text-primary text-center pt-2",
                                            children: errors.password?.message
                                        })
                                    ]
                                }),
                                /*#__PURE__*/ jsx_runtime_.jsx("div", {
                                    children: /*#__PURE__*/ jsx_runtime_.jsx("div", {
                                        className: "flex flex-col items-center justify-center w-full",
                                        children: /*#__PURE__*/ jsx_runtime_.jsx(input/* default */.Z, {
                                            type: "submit",
                                            placeholder: "Login"
                                        })
                                    })
                                })
                            ]
                        }),
                        /*#__PURE__*/ jsx_runtime_.jsx("div", {
                            className: "py-2 text-sm font-normal text-tertiary_dark",
                            children: "Belum memiliki akun?"
                        }),
                        /*#__PURE__*/ jsx_runtime_.jsx("div", {
                            className: "text-sm font-bold text-blue-800 underline cursor-pointer hover:text-blue-600",
                            onClick: ()=>{
                                ChangePage("register");
                            },
                            children: "Daftar"
                        })
                    ]
                })
            })
        ]
    });
};
/* harmony default export */ const LoginPage = (LoginComponent);

;// CONCATENATED MODULE: ./src/components/auth/RegisterPage.js
/* __next_internal_client_entry_do_not_use__ default auto */ 








const RegisterPage_schema = node_modules_yup/* object */.Ry({
    name: node_modules_yup/* string */.Z_().required("Full Name is required"),
    email: node_modules_yup/* string */.Z_().required("Email is required"),
    dob: node_modules_yup/* string */.Z_().nullable(),
    province: node_modules_yup/* string */.Z_().nullable(),
    city: node_modules_yup/* string */.Z_().nullable(),
    postal_code: node_modules_yup/* string */.Z_().nullable(),
    phone: node_modules_yup/* string */.Z_(),
    password: node_modules_yup/* string */.Z_().required("Password is required").min(8, "Password length should be at least 8 characters"),
    passwordConfirmation: node_modules_yup/* string */.Z_().oneOf([
        node_modules_yup/* ref */.iH("password"),
        null
    ], "Passwords must match")
}).required();
const RegisterComponent = ({ ChangePage })=>{
    const [selectProv, setSelectProv] = (0,react_.useState)();
    const [errorMessage, setErrorMessage] = (0,react_.useState)();
    const router = (0,navigation.useRouter)();
    const { register, handleSubmit, setValue, formState: { errors } } = (0,index_esm/* useForm */.cI)({
        resolver: (0,yup/* yupResolver */.X)(RegisterPage_schema)
    });
    const onSubmit = async (data)=>{
        const SubmitLogin = await (0,auth_usecase/* RegisterUseCase */.IK)(data);
        if (SubmitLogin.status) {
            router.push("/profile");
        } else {
            setErrorMessage(SubmitLogin.message);
        }
    };
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
        className: "w-full z-[999]",
        children: [
            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                className: "flex flex-col items-center justify-center w-full py-3 bg-primary rounded-t-[85px]",
                children: [
                    /*#__PURE__*/ jsx_runtime_.jsx((image_default()), {
                        src: "/images/banner/login_banner.png",
                        width: 139,
                        height: 28,
                        alt: "banner"
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx("h3", {
                        className: "font-extrabold text-[24px] leading-[29px] text-whitept-1 shadow-text text-white",
                        children: "Register Akun"
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                className: "w-[70%] mx-auto py-5",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime_.jsxs)("form", {
                        className: "space-y-2 sm:space-y-4",
                        onSubmit: handleSubmit(onSubmit),
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                                className: "flex flex-col items-center",
                                children: [
                                    /*#__PURE__*/ jsx_runtime_.jsx(input/* default */.Z, {
                                        placeholder: "Nama Lengkap",
                                        type: "text",
                                        register: register("name")
                                    }),
                                    /*#__PURE__*/ jsx_runtime_.jsx("small", {
                                        className: "text-red-800 text-xs",
                                        children: errors?.name?.message ?? errorMessage?.name
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                                className: "flex flex-col items-center",
                                children: [
                                    /*#__PURE__*/ jsx_runtime_.jsx(input/* default */.Z, {
                                        placeholder: "Email",
                                        type: "email",
                                        register: register("email")
                                    }),
                                    /*#__PURE__*/ jsx_runtime_.jsx("span", {
                                        className: "text-primary text-[11px] leading-[14px] font-normal",
                                        children: "Periksa kembali alamat email yang digunakan"
                                    }),
                                    /*#__PURE__*/ jsx_runtime_.jsx("small", {
                                        className: "text-red-800 text-xs",
                                        children: errors?.email?.message ?? errorMessage?.email
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                                className: "flex flex-col items-center",
                                children: [
                                    /*#__PURE__*/ jsx_runtime_.jsx(input/* default */.Z, {
                                        placeholder: "Tanggal Lahir",
                                        type: "date_test",
                                        register: register("dob"),
                                        dateValue: (date)=>{
                                            setValue("dob", date);
                                        }
                                    }),
                                    /*#__PURE__*/ jsx_runtime_.jsx("small", {
                                        className: "text-red-800 text-xs",
                                        children: errors?.dob?.message ?? errorMessage?.dob
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                                className: "flex flex-wrap justify-between",
                                children: [
                                    /*#__PURE__*/ jsx_runtime_.jsx("div", {
                                        className: "flex flex-col w-full sm:w-[50%] mb-2 pr-0 sm:pr-1",
                                        children: /*#__PURE__*/ jsx_runtime_.jsx(input/* default */.Z, {
                                            placeholder: "Provinsi",
                                            type: "select-province",
                                            setValue: (id)=>{
                                                setValue("province", id);
                                                setSelectProv(id);
                                            }
                                        })
                                    }),
                                    /*#__PURE__*/ jsx_runtime_.jsx("div", {
                                        className: "flex flex-col w-full mb-2 sm:mb-4 sm:w-[50%] pl-0 sm:pl-1",
                                        children: /*#__PURE__*/ jsx_runtime_.jsx(input/* default */.Z, {
                                            placeholder: "Kab/Kota",
                                            type: "select-kab",
                                            setValue: (id)=>{
                                                setValue("city", id);
                                            },
                                            valueKab: selectProv
                                        })
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                                        className: "flex flex-col w-full mb-2 sm:mb-0 sm:w-[50%] pr-0 sm:pr-1",
                                        children: [
                                            /*#__PURE__*/ jsx_runtime_.jsx(input/* default */.Z, {
                                                placeholder: "Kode Pos",
                                                type: "text",
                                                register: register("postal_code")
                                            }),
                                            /*#__PURE__*/ jsx_runtime_.jsx("small", {
                                                className: "text-red-800 text-xs",
                                                children: errors?.postal_code?.message ?? errorMessage?.postal_code
                                            })
                                        ]
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                                        className: "flex flex-col items-center w-full sm:w-[50%] pl-0 sm:pl-1",
                                        children: [
                                            /*#__PURE__*/ jsx_runtime_.jsx(input/* default */.Z, {
                                                placeholder: "Telepon",
                                                type: "phone",
                                                register: register("phone")
                                            }),
                                            /*#__PURE__*/ jsx_runtime_.jsx("small", {
                                                className: "text-red-800 text-xs",
                                                children: errors?.phone?.message ?? errorMessage?.phone
                                            })
                                        ]
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                                className: "flex flex-col justify-between space-y-2 sm:space-y-0 space-x-0 sm:space-x-2 sm:flex-row",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                                        className: "flex flex-col items-center w-full sm:w-[50%]",
                                        children: [
                                            /*#__PURE__*/ jsx_runtime_.jsx(input/* default */.Z, {
                                                placeholder: "Kata Sandi",
                                                type: "password",
                                                register: register("password")
                                            }),
                                            /*#__PURE__*/ jsx_runtime_.jsx("small", {
                                                className: "text-red-800 text-xs",
                                                children: errors?.password?.message ?? errorMessage?.password
                                            })
                                        ]
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                                        className: "flex flex-col items-center w-full sm:w-[50%]",
                                        children: [
                                            /*#__PURE__*/ jsx_runtime_.jsx(input/* default */.Z, {
                                                placeholder: "Konfirmasi Kata Sandi",
                                                type: "password",
                                                register: register("passwordConfirmation")
                                            }),
                                            /*#__PURE__*/ jsx_runtime_.jsx("small", {
                                                className: "text-red-800 text-xs",
                                                children: errors?.passwordConfirmation?.message
                                            })
                                        ]
                                    })
                                ]
                            }),
                            /*#__PURE__*/ jsx_runtime_.jsx("div", {
                                className: "text-center py-2",
                                children: /*#__PURE__*/ jsx_runtime_.jsx(input/* default */.Z, {
                                    placeholder: "DAFTAR",
                                    type: "submit"
                                })
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                        className: "text-center",
                        children: [
                            /*#__PURE__*/ jsx_runtime_.jsx("span", {
                                className: "py-2 text-sm font-normal text-tertiary_dark",
                                children: "Sudah memiliki akun?"
                            }),
                            /*#__PURE__*/ jsx_runtime_.jsx("h3", {
                                className: "text-sm py-1 font-bold text-blue-800 underline cursor-pointer hover:text-blue-600",
                                onClick: ()=>{
                                    ChangePage("login");
                                },
                                children: "MASUK"
                            })
                        ]
                    })
                ]
            })
        ]
    });
};
/* harmony default export */ const RegisterPage = (RegisterComponent);

// EXTERNAL MODULE: ./src/modules/auth/repositories/auth.repository.js
var auth_repository = __webpack_require__(45917);
;// CONCATENATED MODULE: ./src/components/auth/ForgotPasswordPage.js
/* __next_internal_client_entry_do_not_use__ default auto */ 








const ForgotPasswordPage_schema = node_modules_yup/* object */.Ry({
    email: node_modules_yup/* string */.Z_().required("Email is required")
}).required();
const ForgotPasswordPage = ({ ChangePage })=>{
    const [disableBtn, useDisableBtn] = (0,react_.useState)(false);
    const { register, handleSubmit, formState: { errors } } = (0,index_esm/* useForm */.cI)({
        resolver: (0,yup/* yupResolver */.X)(ForgotPasswordPage_schema)
    });
    // state
    const [message, setMessage] = (0,react_.useState)({
        status: "",
        message: ""
    });
    const router = (0,navigation.useRouter)();
    const onSubmit = async (data)=>{
        useDisableBtn(true);
        const res = await (0,auth_repository/* ForgotPassword */.oP)(data);
        if (res.status) {
            useDisableBtn(false);
            setMessage({
                status: "success",
                message: res.message
            });
            setTimeout(()=>{
                setMessage({
                    status: "",
                    message: ""
                });
            }, 2000);
        } else {
            useDisableBtn(false);
            setMessage({
                status: "error",
                message: res.message
            });
            setTimeout(()=>{
                setMessage({
                    status: "",
                    message: ""
                });
            }, 2000);
        }
    // alert("forgot")
    };
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
        className: "flex w-full flex-col md:flex-row z-[9999]",
        children: [
            /*#__PURE__*/ jsx_runtime_.jsx("div", {
                className: "flex items-center justify-center md:w-[40%] w-full py-3 md:py-0 md:rounded-l-[85px] md:rounded-tr-none rounded-t-[85px] bg-primary",
                children: /*#__PURE__*/ jsx_runtime_.jsx((image_default()), {
                    src: "/images/banner/login_banner.png",
                    width: 200,
                    height: 59,
                    alt: "banner login"
                })
            }),
            /*#__PURE__*/ jsx_runtime_.jsx("div", {
                className: "w-full md:w-[60%] pb-3",
                children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                    className: "flex flex-col items-center justify-center",
                    children: [
                        /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                            className: "w-[80%] flex flex-col items-center justify-center pt-14 pb-3 space-y-2",
                            children: [
                                /*#__PURE__*/ jsx_runtime_.jsx("h3", {
                                    className: "font-extrabold text-[29px] leading-[39px] text-primary pb-5 shadow-text",
                                    children: "Selamat Datang"
                                }),
                                message.message != "" && /*#__PURE__*/ jsx_runtime_.jsx("div", {
                                    className: `alert ${message.status == "success" ? "alert-success" : "alert-error"} text-sm text-center flex justify-center`,
                                    children: message.status == "success" ? /*#__PURE__*/ (0,jsx_runtime_.jsxs)("span", {
                                        children: [
                                            /*#__PURE__*/ jsx_runtime_.jsx("strong", {
                                                children: "Berhasil!!"
                                            }),
                                            " Silahkan cek email anda."
                                        ]
                                    }) : /*#__PURE__*/ (0,jsx_runtime_.jsxs)("span", {
                                        children: [
                                            /*#__PURE__*/ jsx_runtime_.jsx("strong", {
                                                children: "Gagal!!"
                                            }),
                                            " ",
                                            message.message
                                        ]
                                    })
                                })
                            ]
                        }),
                        /*#__PURE__*/ (0,jsx_runtime_.jsxs)("form", {
                            onSubmit: handleSubmit(onSubmit),
                            className: "w-[80%] space-y-2 flex flex-col items-center justify-center",
                            children: [
                                /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                                    className: "w-full",
                                    children: [
                                        /*#__PURE__*/ jsx_runtime_.jsx(input/* default */.Z, {
                                            type: "email",
                                            placeholder: "Email",
                                            className: `py-2`,
                                            register: register("email")
                                        }),
                                        /*#__PURE__*/ jsx_runtime_.jsx("div", {
                                            className: "text-[11px] leading-[13px] text-primary text-center pt-2",
                                            children: errors.email?.message
                                        })
                                    ]
                                }),
                                /*#__PURE__*/ jsx_runtime_.jsx("div", {
                                    className: "flex flex-col items-center justify-center w-full",
                                    children: /*#__PURE__*/ jsx_runtime_.jsx(input/* default */.Z, {
                                        type: "submit",
                                        placeholder: "Forgot Password",
                                        value: "Forgot Password",
                                        disableBtn: disableBtn
                                    })
                                })
                            ]
                        }),
                        /*#__PURE__*/ jsx_runtime_.jsx("div", {
                            className: "pt-4 pb-1 text-sm font-bold text-blue-800 underline cursor-pointer hover:text-blue-600",
                            onClick: ()=>{
                                ChangePage("login");
                            },
                            children: "BACK TO LOGIN"
                        })
                    ]
                })
            })
        ]
    });
};
/* harmony default export */ const auth_ForgotPasswordPage = (ForgotPasswordPage);

;// CONCATENATED MODULE: ./src/components/auth/AuthComponet.js





const AuthComponent = ()=>{
    const [changePage, setChangePage] = (0,react_.useState)("login");
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
        className: "flex w-full bg-white shadow-xl rounded-[85px] border border-[rgba(110,110,112,0.41)] border-opacity-30",
        children: [
            changePage == "login" && /*#__PURE__*/ jsx_runtime_.jsx(LoginPage, {
                ChangePage: (status)=>{
                    setChangePage(status);
                }
            }),
            changePage == "register" && /*#__PURE__*/ jsx_runtime_.jsx(RegisterPage, {
                ChangePage: (status)=>{
                    setChangePage(status);
                }
            }),
            changePage == "forgot" && /*#__PURE__*/ jsx_runtime_.jsx(auth_ForgotPasswordPage, {
                ChangePage: (status)=>{
                    setChangePage(status);
                }
            })
        ]
    });
};
/* harmony default export */ const AuthComponet = (AuthComponent);


/***/ }),

/***/ 97162:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  Z: () => (/* binding */ input)
});

// EXTERNAL MODULE: external "next/dist/compiled/react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(56786);
// EXTERNAL MODULE: external "next/dist/compiled/react"
var react_ = __webpack_require__(18038);
// EXTERNAL MODULE: ./node_modules/moment/moment.js
var moment = __webpack_require__(64731);
var moment_default = /*#__PURE__*/__webpack_require__.n(moment);
// EXTERNAL MODULE: ./node_modules/next/image.js
var next_image = __webpack_require__(52451);
var image_default = /*#__PURE__*/__webpack_require__.n(next_image);
// EXTERNAL MODULE: ./node_modules/react-datepicker/dist/index.js
var dist = __webpack_require__(10145);
// EXTERNAL MODULE: ./node_modules/react-datepicker/dist/react-datepicker.css
var react_datepicker = __webpack_require__(82094);
// EXTERNAL MODULE: ./src/utils/api.js
var api = __webpack_require__(11905);
;// CONCATENATED MODULE: ./src/modules/location/repositories/location.repository.js

const Provinces = async ()=>{
    const res = await (0,api/* GetData */.eO)("/provinces");
    return res;
};
const Cities = async (id)=>{
    const res = await (0,api/* GetData */.eO)("/cities/" + id);
    return res;
};

;// CONCATENATED MODULE: ./src/modules/location/usecases/location.usecase.js

const GetProvinces = async ()=>{
    const res = await Provinces();
    if (res.success) {
        return res.data;
    }
    return null;
};
const CitiesUsecase = async (slug)=>{
    const res = await Cities(slug);
    if (res.success) {
        return res.data;
    }
    return null;
};

// EXTERNAL MODULE: ./node_modules/react-icons/fa6/index.esm.js
var index_esm = __webpack_require__(56082);
;// CONCATENATED MODULE: ./src/components/form/input.js








const Input = ({ type, placeholder, className, setValue, valueKab, selectProv, selectKab, register, dateValue, disableBtn })=>{
    const [startDate, setStartDate] = (0,react_.useState)(null);
    const [open, setOpen] = (0,react_.useState)(false);
    const [province, setProvince] = (0,react_.useState)(null);
    const [provinceData, setProvinceData] = (0,react_.useState)(null);
    const [openSelectProv, setOpenSelectProv] = (0,react_.useState)(false);
    const [selectprovince, setSelectProvince] = (0,react_.useState)(null);
    const [cityMap, setCity] = (0,react_.useState)(null);
    const [cityData, setCityData] = (0,react_.useState)(null);
    const [OpenSelectCity, setOpenSelectCity] = (0,react_.useState)(false);
    const [SelectCity, setSelectCity] = (0,react_.useState)(null);
    const search = (data, key, search)=>{
        const res = data.filter((item)=>item[key].toLowerCase().includes(search.toLowerCase()));
        if (key == "province_name") {
            if (search == "") {
                setProvince(data);
            } else {
                setProvince(res);
            }
        }
        if (key == "city_name") {
            if (search == "") {
                setCity(data);
            } else {
                setCity(res);
            }
        }
    };
    const GetProvince = async ()=>{
        const provinceData = await GetProvinces();
        if (provinceData) {
            setProvince(provinceData);
            setProvinceData(provinceData);
        }
    };
    function capitalizeFirstLetter(str) {
        const tolower = str.toLowerCase();
        return tolower.charAt(0).toUpperCase() + tolower.slice(1);
    }
    const GetKab = async (id)=>{
        if (id) {
            const CityData = await CitiesUsecase(id);
            if (CityData !== null) {
                setCity(CityData);
                setCityData(CityData);
            }
        }
    };
    (0,react_.useEffect)(()=>{
        if (type === "select-province") {
            GetProvince();
        }
        if (selectProv) {
            setSelectProvince(selectProv);
        }
        if (selectKab) {
            setSelectCity(selectKab);
        }
        if (valueKab) {
            setOpenSelectCity(false);
        }
        if (type === "date_test") {
            if (register.value) {
                setStartDate(register.value);
            }
        }
    }, [
        type,
        valueKab
    ]);
    switch(type){
        case "submit":
            return /*#__PURE__*/ jsx_runtime_.jsx("div", {
                children: /*#__PURE__*/ jsx_runtime_.jsx("input", {
                    type: "submit",
                    className: `btn-primary hover:shadow-[0px_4px_4px_0px_rgba(0,_0,_0,_0.25)] hover:bg-primary_light bg-primary rounded-full text-white text-sm leading-[12px] font-semibold py-3 px-5 cursor-pointer`,
                    value: placeholder,
                    disabled: disableBtn ?? false
                })
            });
            break;
        case "date_test":
            return /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                className: "w-full relative flex items-center",
                children: [
                    /*#__PURE__*/ jsx_runtime_.jsx(dist/* default */.ZP, {
                        className: `w-full py-1 bg-white focus:shadow-[0px_4px_4px_0px_rgba(0,_0,_0,_0.25)] border-[3px] border-primary rounded-full px-5 text-primary font-normal placeholder:text-primary placeholder:text-opacity-50 focus:outline-none ${className}`,
                        selected: startDate,
                        onChange: (date)=>{
                            setStartDate(date);
                            dateValue(moment_default()(date).format("yyyy-MM-DD"));
                        },
                        dateFormat: "dd-MM-yyyy",
                        showYearDropdown: true,
                        scrollableYearDropdown: true,
                        showMonthDropdown: true,
                        scrollableMonthYearDropdown: true,
                        dropdownMode: "select",
                        placeholderText: "Tanggal Lahir",
                        name: register.name
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx("div", {
                        className: "absolute right-5",
                        children: /*#__PURE__*/ jsx_runtime_.jsx((image_default()), {
                            src: "/icons/datepickerIcon.png",
                            width: 15,
                            height: 16,
                            alt: "icon datepicker"
                        })
                    })
                ]
            });
            break;
        case "date":
            return /*#__PURE__*/ jsx_runtime_.jsx("div", {
                className: "w-full",
                children: /*#__PURE__*/ jsx_runtime_.jsx("input", {
                    type: type,
                    className: `w-full py-1 bg-white focus:shadow-[0px_4px_4px_0px_rgba(0,_0,_0,_0.25)] border-[3px] border-primary rounded-full px-5 text-primary font-normal placeholder:text-primary placeholder:text-opacity-50 focus:outline-none ${className}`,
                    placeholder: placeholder,
                    ...register
                })
            });
            break;
        case "select-province":
            return /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                className: "relative",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                        type: "text",
                        className: `flex justify-between items-center capitalize w-full py-1 cursor-pointer bg-white focus:shadow-[0px_4px_4px_0px_rgba(0,_0,_0,_0.25)] border-[3px] border-primary rounded-full px-5 text-primary font-normal placeholder:text-primary placeholder:text-opacity-50 focus:outline-none ${className}`,
                        onClick: ()=>{
                            setOpenSelectProv(!openSelectProv);
                        },
                        children: [
                            selectprovince?.province_name ?? placeholder,
                            /*#__PURE__*/ jsx_runtime_.jsx("div", {
                                className: "absolute right-3",
                                children: openSelectProv ? /*#__PURE__*/ jsx_runtime_.jsx(index_esm/* FaAngleUp */.$Pg, {
                                    className: "text-base text-primary"
                                }) : /*#__PURE__*/ jsx_runtime_.jsx(index_esm/* FaAngleDown */.iUH, {
                                    className: "text-base text-primary"
                                })
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                        className: `z-[999] absolute mt-1 py-1 bg-white w-full shadow-md rounded-md border border-slate-500 border-opacity-40 ${openSelectProv === false ? "hidden" : "block"}`,
                        children: [
                            /*#__PURE__*/ jsx_runtime_.jsx("div", {
                                className: "relative",
                                children: /*#__PURE__*/ jsx_runtime_.jsx("input", {
                                    type: "text",
                                    className: "w-full focus:outline-none px-2 border-b border-tertiary_dark border-opacity-50 shadow-md pb-1 text-sm text-primary placeholder:text-primary placeholder:text-opacity-50",
                                    placeholder: "Cari Provinsi",
                                    onChange: (e)=>{
                                        search(provinceData, "province_name", e.target.value);
                                    }
                                })
                            }),
                            /*#__PURE__*/ jsx_runtime_.jsx("ul", {
                                className: "overflow-y-auto  h-32",
                                children: province != null && province.map((v, key)=>/*#__PURE__*/ jsx_runtime_.jsx("li", {
                                        className: "text-black text-base capitalize cursor-pointer px-2 py-1 hover:bg-primary_light hover:text-white",
                                        onClick: ()=>{
                                            setValue(v.slug);
                                            setSelectProvince({
                                                id: v.slug,
                                                province_name: v.province_name
                                            });
                                            setOpenSelectProv(false);
                                        },
                                        children: capitalizeFirstLetter(v.province_name)
                                    }, key))
                            })
                        ]
                    })
                ]
            });
            break;
        case "select-kab":
            return /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                className: "relative",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                        type: "text",
                        className: `flex justify-between items-center w-full py-1 cursor-pointer bg-white focus:shadow-[0px_4px_4px_0px_rgba(0,_0,_0,_0.25)] border-[3px] border-primary rounded-full px-5 text-primary font-normal placeholder:text-primary placeholder:text-opacity-50 focus:outline-none ${className}`,
                        onClick: ()=>{
                            setOpenSelectCity(!OpenSelectCity);
                            GetKab(valueKab);
                        },
                        children: [
                            SelectCity?.city_name ?? placeholder,
                            /*#__PURE__*/ jsx_runtime_.jsx("div", {
                                className: "absolute right-3",
                                children: OpenSelectCity ? /*#__PURE__*/ jsx_runtime_.jsx(index_esm/* FaAngleUp */.$Pg, {
                                    className: "text-base text-primary"
                                }) : /*#__PURE__*/ jsx_runtime_.jsx(index_esm/* FaAngleDown */.iUH, {
                                    className: "text-base text-primary"
                                })
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                        className: `absolute mt-1 py-1 bg-white w-full shadow-md rounded-md border border-slate-500 border-opacity-40 ${OpenSelectCity === false ? "hidden" : "block"}`,
                        children: [
                            /*#__PURE__*/ jsx_runtime_.jsx("div", {
                                className: "relative",
                                children: /*#__PURE__*/ jsx_runtime_.jsx("input", {
                                    type: "text",
                                    className: "w-full focus:outline-none px-2 border-b border-tertiary_dark border-opacity-50 shadow-md pb-1 text-sm text-primary placeholder:text-primary placeholder:text-opacity-50",
                                    placeholder: "Cari Kabupaten",
                                    onChange: (e)=>{
                                        search(cityData, "city_name", e.target.value);
                                        e.preventDefault();
                                    }
                                })
                            }),
                            /*#__PURE__*/ jsx_runtime_.jsx("ul", {
                                className: `overflow-y-auto h-32 `,
                                children: cityMap ? cityMap.map((v, key)=>/*#__PURE__*/ jsx_runtime_.jsx("li", {
                                        className: "text-black text-base cursor-pointer px-2 py-1 hover:bg-primary_light hover:text-white",
                                        onClick: ()=>{
                                            setValue(v.id);
                                            setSelectCity({
                                                id: v.id,
                                                city_name: v.city_name
                                            });
                                            setOpenSelectCity(false);
                                        },
                                        children: capitalizeFirstLetter(v.city_name)
                                    }, key)) : /*#__PURE__*/ jsx_runtime_.jsx("li", {
                                    className: "px-2 text-sm",
                                    children: "Please select province first"
                                })
                            })
                        ]
                    })
                ]
            });
            break;
        default:
            return /*#__PURE__*/ jsx_runtime_.jsx("div", {
                className: "w-full",
                children: /*#__PURE__*/ jsx_runtime_.jsx("input", {
                    type: type,
                    className: `w-full py-1 bg-white focus:shadow-[0px_4px_4px_0px_rgba(0,_0,_0,_0.25)] border-[3px] border-primary rounded-full px-5 text-primary font-normal placeholder:text-primary placeholder:text-opacity-50 focus:outline-none ${className}`,
                    placeholder: placeholder,
                    ...register
                })
            });
            break;
    }
};
/* harmony default export */ const input = (Input);


/***/ }),

/***/ 66201:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ FooterLayout)
});

// EXTERNAL MODULE: external "next/dist/compiled/react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(56786);
// EXTERNAL MODULE: external "next/dist/compiled/react"
var react_ = __webpack_require__(18038);
// EXTERNAL MODULE: ./node_modules/next/font/google/target.css?{"path":"src\\utils\\fonts.js","import":"Source_Serif_4","arguments":[{"subsets":["latin"]}],"variableName":"sourceSerif4"}
var target_path_src_utils_fonts_js_import_Source_Serif_4_arguments_subsets_latin_variableName_sourceSerif4_ = __webpack_require__(57298);
var target_path_src_utils_fonts_js_import_Source_Serif_4_arguments_subsets_latin_variableName_sourceSerif4_default = /*#__PURE__*/__webpack_require__.n(target_path_src_utils_fonts_js_import_Source_Serif_4_arguments_subsets_latin_variableName_sourceSerif4_);
// EXTERNAL MODULE: ./node_modules/next/font/google/target.css?{"path":"src\\utils\\fonts.js","import":"Plus_Jakarta_Sans","arguments":[{"subsets":["latin"]}],"variableName":"plusJakartaSans"}
var target_path_src_utils_fonts_js_import_Plus_Jakarta_Sans_arguments_subsets_latin_variableName_plusJakartaSans_ = __webpack_require__(36479);
var target_path_src_utils_fonts_js_import_Plus_Jakarta_Sans_arguments_subsets_latin_variableName_plusJakartaSans_default = /*#__PURE__*/__webpack_require__.n(target_path_src_utils_fonts_js_import_Plus_Jakarta_Sans_arguments_subsets_latin_variableName_plusJakartaSans_);
// EXTERNAL MODULE: ./node_modules/next/navigation.js
var navigation = __webpack_require__(57114);
// EXTERNAL MODULE: ./node_modules/keen-slider/react.js
var react = __webpack_require__(3322);
// EXTERNAL MODULE: ./node_modules/keen-slider/keen-slider.min.css
var keen_slider_min = __webpack_require__(95449);
// EXTERNAL MODULE: ./node_modules/react-icons/md/index.esm.js
var index_esm = __webpack_require__(7625);
// EXTERNAL MODULE: ./node_modules/next/link.js
var next_link = __webpack_require__(11440);
var link_default = /*#__PURE__*/__webpack_require__.n(next_link);
;// CONCATENATED MODULE: ./src/components/layouts/component/SlideFooter.js






const SlideFooter = ({ data })=>{
    const [currentSlide, setCurrentSlide] = (0,react_.useState)(0);
    const [loaded, setLoaded] = (0,react_.useState)(false);
    const [sliderRef, instanceRef] = (0,react/* useKeenSlider */.E)({
        initial: 0,
        loop: true,
        slideChanged (slider) {
            setCurrentSlide(slider.track.details.rel);
        },
        created () {
            setLoaded(true);
        }
    }, [
        (slider)=>{
            if (data.length > 1) {
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
                    }, 2000);
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
    return /*#__PURE__*/ jsx_runtime_.jsx("div", {
        className: `border-b-2 border-primary border-opacity-50 w-[85%] mx-auto ${data && "pb-8"}`,
        children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
            className: "",
            children: [
                /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                    className: "relative",
                    children: [
                        /*#__PURE__*/ jsx_runtime_.jsx("div", {
                            ref: sliderRef,
                            className: "keen-slider",
                            children: data.map((v, key)=>/*#__PURE__*/ jsx_runtime_.jsx((link_default()), {
                                    href: v.link ? v.link : "#",
                                    target: "_blank",
                                    passHref: true,
                                    children: /*#__PURE__*/ jsx_runtime_.jsx("div", {
                                        className: "keen-slider__slide w-full object-cover cursor-pointer",
                                        children: /*#__PURE__*/ jsx_runtime_.jsx("img", {
                                            src: "https://staging.gerai.neracaruang.com/" + "/" + v.image,
                                            className: "w-full max-h-[600px] object-cover"
                                        })
                                    }, key)
                                }, key))
                        }),
                        loaded && instanceRef.current && /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                            className: "",
                            children: [
                                /*#__PURE__*/ jsx_runtime_.jsx(Arrow, {
                                    left: true,
                                    onClick: (e)=>e.stopPropagation() || instanceRef.current?.prev(),
                                    disabled: currentSlide === 0
                                }),
                                /*#__PURE__*/ jsx_runtime_.jsx(Arrow, {
                                    onClick: (e)=>e.stopPropagation() || instanceRef.current?.next(),
                                    disabled: currentSlide === instanceRef.current.track.details.slides.length - 1
                                })
                            ]
                        })
                    ]
                }),
                loaded && instanceRef.current && /*#__PURE__*/ jsx_runtime_.jsx("div", {
                    className: "flex py-[10px] justify-center",
                    children: [
                        ...Array(instanceRef.current.track.details.slides.length).keys()
                    ].map((idx)=>{
                        return /*#__PURE__*/ jsx_runtime_.jsx("button", {
                            onClick: ()=>{
                                instanceRef.current?.moveToIdx(idx);
                            },
                            className: "dot" + (currentSlide === idx ? " active" : "")
                        }, idx);
                    })
                })
            ]
        })
    });
};
function Arrow(props) {
    const disabeld = props.disabled ? " opacity-50" : "";
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
        onClick: props.onClick,
        className: `absolute top-[50%] text-black ${props.left ? "left-0" : "left-auto right-[0px]"}`,
        children: [
            props.left && /*#__PURE__*/ jsx_runtime_.jsx(index_esm/* MdOutlineArrowBackIos */.oTp, {
                className: `${disabeld} text-white text-[40px] cursor-pointer bg-black bg-opacity-70`
            }),
            !props.left && /*#__PURE__*/ jsx_runtime_.jsx(index_esm/* MdOutlineArrowForwardIos */.Djl, {
                className: `${disabeld} text-white text-[40px] cursor-pointer bg-black bg-opacity-70`
            })
        ]
    });
}
/* harmony default export */ const component_SlideFooter = (SlideFooter);

// EXTERNAL MODULE: ./src/utils/api.js
var api = __webpack_require__(11905);
;// CONCATENATED MODULE: ./src/modules/content/repositories/content.repository.js

const GetContentBySlug = async ()=>{
    const res = await (0,api/* GetData */.eO)(`/content`);
    return res;
};
const GetContent = async (query)=>{
    const res = await (0,api/* GetData */.eO)("/content" + (query ?? ""));
    return res;
};
const content_repository_Tags = async ()=>{
    const res = await GetData("/tags");
    return res;
};

;// CONCATENATED MODULE: ./src/modules/content/usecases/content.usecase.js


const GetAdsByContent = async ()=>{
    const content = await GetContentBySlug();
    if (content?.ads) {
        return content?.ads;
    }
    return [];
};
const getAdsByQuery = async (query)=>{
    const content = await GetContent(query);
    if (content?.ads) {
        return content?.ads;
    }
    return [];
};
const dataTags = async ()=>{
    const tags = await Tags();
    if (tags.tags) {
        return tags?.tags;
    }
    return [];
};

// EXTERNAL MODULE: ./src/components/ImageComponent.js
var ImageComponent = __webpack_require__(28903);
;// CONCATENATED MODULE: ./src/components/layouts/FooterLayout.js
/* __next_internal_client_entry_do_not_use__ default auto */ 








function FooterLayout({ tags }) {
    const [DataAds, setDataAds] = (0,react_.useState)([]);
    const [socials, setSocial] = (0,react_.useState)([]);
    const searchParam = (0,navigation.useSearchParams)();
    const params = (0,navigation.useParams)();
    const getData = async (path)=>{
        const split = path.split("/");
        let dataContent;
        let qry = "qrt";
        if (Object.keys(params).length == 0) {
            dataContent = await GetAdsByContent();
        } else {
            const getRegion = params.region;
            const getSlug = params.slug;
            let query = "";
            if (Object.keys(params).length > 0 && params.region != undefined) {
                if (getRegion == "provinsi" && getSlug != null) {
                    query += `?province=${getSlug}`;
                } else if (getRegion == "kota" && getSlug != null) {
                    query += `?city=${getSlug}`;
                }
            }
            qry = qry + query;
            dataContent = await getAdsByQuery(query);
        }
        if (dataContent.length > 0) {
            setDataAds(dataContent);
        } else {
            setDataAds([]);
        }
    };
    const path = (0,navigation.usePathname)();
    const router = (0,navigation.useRouter)();
    let showFooter = false;
    const checkByUrl = ()=>{
        const split = path.split("/");
        if (split[1] != "profile" && split[1] != "auth") {
            // setUseLayout({
            //   navbar: true,
            //   footer: true
            // })
            showFooter = true;
        }
    };
    const search = (param)=>{
        let url = "";
        url += path !== "/" ? "/" : url += path;
        router.push("/umum/indonesia/all/tags/" + param);
    };
    checkByUrl();
    const getSocial = async ()=>{
        const get = await (0,api/* GetData */.eO)(`/social-medias?param=${params?.region == "provinsi" || params?.region == "kota" ? "hijau" : "biru"}`);
        setSocial(get?.data);
    };
    (0,react_.useEffect)(()=>{
        getData(path);
        getSocial();
    }, [
        path,
        searchParam
    ]);
    return /*#__PURE__*/ jsx_runtime_.jsx("div", {
        children: showFooter && /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
            className: "footer-bg",
            children: [
                path !== "/" && /*#__PURE__*/ jsx_runtime_.jsx("div", {
                    className: `pb-8 md:pt-24 ${!path.includes("diskusi") && !path.includes("pencarian") ? "mt-[50px]" : "mt-[100px]"}`
                }),
                /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                    className: "relative",
                    children: [
                        /*#__PURE__*/ jsx_runtime_.jsx("div", {
                            className: "pt-[50px] pb-[25px]",
                            children: DataAds.length > 1 ? /*#__PURE__*/ jsx_runtime_.jsx(component_SlideFooter, {
                                data: DataAds
                            }) : DataAds.length === 1 ? /*#__PURE__*/ jsx_runtime_.jsx("div", {
                                className: "border-b-2 border-primary border-opacity-50 w-[85%] mx-auto pb-8",
                                children: /*#__PURE__*/ jsx_runtime_.jsx((link_default()), {
                                    href: DataAds[0].link ? DataAds[0].link : "#",
                                    target: "_blank",
                                    passHref: true,
                                    children: /*#__PURE__*/ jsx_runtime_.jsx("img", {
                                        src: "https://staging.gerai.neracaruang.com/" + "/" + DataAds[0].image,
                                        alt: "",
                                        className: "w-full object-contain rounded-sm max-h-[600px] hover:drop-shadow-[0_5px_3px_rgba(0,0,0,0.2)] hover:scale-[1.02] cursor-pointer duration-300"
                                    })
                                })
                            }) : // <div className="border-b-2 border-primary border-opacity-50 w-[85%] mx-auto pb-8">
                            //   <img
                            //     src="/images/banner/banner_footer.png"
                            //     alt=""
                            //     className="w-full object-cover rounded-sm max-h-[600px] hover:drop-shadow-[0_5px_3px_rgba(0,0,0,0.2)] hover:scale-[1.02] cursor-pointer duration-300"
                            //     onClick={() => {
                            //       router.push("/");
                            //     }}
                            //   />
                            // </div>
                            /*#__PURE__*/ jsx_runtime_.jsx(jsx_runtime_.Fragment, {})
                        }),
                        /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                            className: `flex items-center flex-col w-[85%] mx-auto`,
                            children: [
                                /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                                    className: `w-full py-1 flex flex-wrap justify-between text-tertiary_dark ${(target_path_src_utils_fonts_js_import_Source_Serif_4_arguments_subsets_latin_variableName_sourceSerif4_default()).className}`,
                                    children: [
                                        /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                                            className: "lg:w-1/4 w-full",
                                            children: [
                                                /*#__PURE__*/ jsx_runtime_.jsx("h3", {
                                                    className: "uppercase text-base leading-[22px] font-bold py-3",
                                                    children: "Tokoh"
                                                }),
                                                /*#__PURE__*/ jsx_runtime_.jsx("ul", {
                                                    className: `flex flex-col flex-wrap w-full md:h-40 lg:h-60 text-[14px] leading-[20px] font-normal`,
                                                    children: tags?.tokoh && tags.tokoh.map((v, key)=>/*#__PURE__*/ jsx_runtime_.jsx("li", {
                                                            className: "cursor-pointer hover:underline hover:text-primary_light",
                                                            onClick: ()=>{
                                                                // router.push("umum/indonesia/all/tags/" + v.slug);
                                                                search(v.slug);
                                                            },
                                                            children: v.title
                                                        }, key))
                                                })
                                            ]
                                        }),
                                        /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                                            className: "w-full lg:w-1/3",
                                            children: [
                                                /*#__PURE__*/ jsx_runtime_.jsx("h3", {
                                                    className: "uppercase text-base leading-[22px] font-bold py-3",
                                                    children: "Topik"
                                                }),
                                                /*#__PURE__*/ jsx_runtime_.jsx("ul", {
                                                    className: "flex flex-col w-full flex-wrap md:h-40 lg:h-60 text-[14px] leading-[20px] font-normal",
                                                    children: tags?.topik && tags.topik.map((v, key)=>/*#__PURE__*/ jsx_runtime_.jsx("li", {
                                                            className: "cursor-pointer hover:underline hover:text-primary_light",
                                                            onClick: ()=>{
                                                                search(v.slug);
                                                            },
                                                            children: v.title
                                                        }, key))
                                                })
                                            ]
                                        }),
                                        /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                                            className: "lg:w-1/3 w-full",
                                            children: [
                                                /*#__PURE__*/ jsx_runtime_.jsx("h3", {
                                                    className: "uppercase text-base leading-[22px] font-bold py-3",
                                                    children: "Otonomi Daerah"
                                                }),
                                                /*#__PURE__*/ jsx_runtime_.jsx("ul", {
                                                    className: "flex flex-col flex-wrap text-[14px] md:h-40 lg:h-60 leading-[20px] font-normal",
                                                    children: tags?.otonomi_daerah && tags.otonomi_daerah.map((v, key)=>/*#__PURE__*/ jsx_runtime_.jsx("li", {
                                                            className: "cursor-pointer hover:underline hover:text-primary_light",
                                                            onClick: ()=>{
                                                                search(v.slug);
                                                            },
                                                            children: v.title
                                                        }, key))
                                                })
                                            ]
                                        })
                                    ]
                                }),
                                /*#__PURE__*/ jsx_runtime_.jsx("div", {
                                    className: "py-8 text-primary",
                                    children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                                        className: "flex flex-col items-center",
                                        children: [
                                            /*#__PURE__*/ jsx_runtime_.jsx("div", {
                                                className: "flex w-[80%] justify-around py-2",
                                                children: socials?.socials?.map((social, index)=>/*#__PURE__*/ jsx_runtime_.jsx("div", {
                                                        className: "rounded-full duration-300 hover:drop-shadow-[0_5px_3px_rgba(0,0,0,0.4)] hover:scale-110 cursor-pointer",
                                                        children: /*#__PURE__*/ jsx_runtime_.jsx((link_default()), {
                                                            href: social?.url,
                                                            target: "_blank",
                                                            passHref: true,
                                                            children: /*#__PURE__*/ jsx_runtime_.jsx(ImageComponent["default"], {
                                                                src: "https://staging.gerai.neracaruang.com/" + (social?.image),
                                                                width: 50,
                                                                height: 50,
                                                                alt: social?.title,
                                                                dummy: "/icons/profile.png"
                                                            })
                                                        })
                                                    }, "social" + index))
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                                                className: `${(target_path_src_utils_fonts_js_import_Plus_Jakarta_Sans_arguments_subsets_latin_variableName_plusJakartaSans_default()).className} text-center`,
                                                children: [
                                                    /*#__PURE__*/ jsx_runtime_.jsx((link_default()), {
                                                        href: "mailto:neracaruang@neracaruang.com",
                                                        target: "_blank",
                                                        passHref: true,
                                                        children: /*#__PURE__*/ jsx_runtime_.jsx("h3", {
                                                            className: `sm:text-[20px] sm:leading-[25px] text-[16px] duration-300 hover:scale-105 ${socials?.location ? "text-secondary" : "text-primary"}`,
                                                            children: "neracaruang@neracaruang.com"
                                                        })
                                                    }),
                                                    /*#__PURE__*/ jsx_runtime_.jsx("h3", {
                                                        className: `sm:text-[17px] sm:leading-[21px] ${socials?.location ? "text-secondary" : "text-primary"}`,
                                                        children: "Copyright \xa9PT. Semesta Teknologi Indonesia Lestari"
                                                    })
                                                ]
                                            })
                                        ]
                                    })
                                })
                            ]
                        })
                    ]
                })
            ]
        })
    });
}


/***/ }),

/***/ 76904:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ layouts_NavbarLayout)
});

// EXTERNAL MODULE: external "next/dist/compiled/react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(56786);
// EXTERNAL MODULE: external "next/dist/compiled/react"
var react_ = __webpack_require__(18038);
// EXTERNAL MODULE: ./node_modules/next/font/google/target.css?{"path":"src\\utils\\fonts.js","import":"Plus_Jakarta_Sans","arguments":[{"subsets":["latin"]}],"variableName":"plusJakartaSans"}
var target_path_src_utils_fonts_js_import_Plus_Jakarta_Sans_arguments_subsets_latin_variableName_plusJakartaSans_ = __webpack_require__(36479);
var target_path_src_utils_fonts_js_import_Plus_Jakarta_Sans_arguments_subsets_latin_variableName_plusJakartaSans_default = /*#__PURE__*/__webpack_require__.n(target_path_src_utils_fonts_js_import_Plus_Jakarta_Sans_arguments_subsets_latin_variableName_plusJakartaSans_);
// EXTERNAL MODULE: ./node_modules/next/link.js
var next_link = __webpack_require__(11440);
var link_default = /*#__PURE__*/__webpack_require__.n(next_link);
// EXTERNAL MODULE: ./node_modules/react-icons/hi/index.esm.js
var index_esm = __webpack_require__(62717);
// EXTERNAL MODULE: ./node_modules/react-icons/fa6/index.esm.js
var fa6_index_esm = __webpack_require__(56082);
// EXTERNAL MODULE: ./node_modules/next/navigation.js
var navigation = __webpack_require__(57114);
;// CONCATENATED MODULE: ./src/components/form/search.js
/* __next_internal_client_entry_do_not_use__ default auto */ 



async function getFilter() {
    const res = await fetch("https://staging.gerai.neracaruang.com/api" + "/tags", {
        next: {
            revalidate: 3600
        }
    });
    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }
    return res.json();
}
async function getProvince() {
    const res = await fetch("https://staging.gerai.neracaruang.com/api" + "/provinces", {
        next: {
            revalidate: 3600
        }
    });
    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }
    return res.json();
}
async function getCities(slug) {
    const res = await fetch("https://staging.gerai.neracaruang.com/api" + "/cities/" + slug);
    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }
    return res.json();
}
const SearchComponent = ({ setShowSearch, setIsRegionalSearch })=>{
    const [tokohOptions, setTokohOptions] = (0,react_.useState)([]);
    const [topikOptions, setTopikOptions] = (0,react_.useState)([]);
    const [otonomiOptions, setOtonomiOptions] = (0,react_.useState)([]);
    const [provinsiOptions, setProvinsiOptions] = (0,react_.useState)([]);
    const [kotaOptions, setKotaOptions] = (0,react_.useState)([]);
    const router = (0,navigation.useRouter)();
    const path = (0,navigation.usePathname)();
    const params = (0,navigation.useParams)();
    const [showTokoh, setShowTokoh] = (0,react_.useState)(false);
    const [showTopik, setShowTopik] = (0,react_.useState)(false);
    const [showOtonomi, setShowOtonomi] = (0,react_.useState)(false);
    const [showProvinsi, setShowProvinsi] = (0,react_.useState)(false);
    const [showKota, setShowKota] = (0,react_.useState)(false);
    const [vTokoh, setVTokoh] = (0,react_.useState)("");
    const [vTopik, setVTopik] = (0,react_.useState)("");
    const [vOtonomi, setVOtonomi] = (0,react_.useState)("");
    const [vProvinsi, setVProvinsi] = (0,react_.useState)("");
    const [vKota, setVKota] = (0,react_.useState)("");
    const [keyword, setKeyword] = (0,react_.useState)("");
    const searchParams = (0,navigation.useSearchParams)();
    (0,react_.useEffect)(()=>{
        async function fetchData() {
            const data = await getFilter();
            const dataProvince = await getProvince();
            const listTopik = data.tags.topik ?? [];
            const listTokoh = data.tags.tokoh ?? [];
            const listOtonomi = data.tags.otonomi_daerah ?? [];
            const listProvinsi = dataProvince.data ?? [];
            const listTags = params?.tags?.split("%2B") ?? [];
            const keywordSearch = params?.keyword;
            setKeyword(keywordSearch);
            setTopikOptions(listTopik);
            setTokohOptions(listTokoh);
            setOtonomiOptions(listOtonomi);
            setProvinsiOptions(listProvinsi);
            if (params.region == "provinsi") {
                initSelectProv(listProvinsi, params.slug);
            } else if (params.region == "kota") {
                const slugProv = searchParams.get("provinsi");
                initSelectProv(listProvinsi, slugProv);
            }
            listTags.forEach((v, k)=>{
                initSelectTokoh(listTokoh, v);
                initSelectTopik(listTopik, v);
                initSelectOtonomi(listOtonomi, v);
            });
        }
        fetchData();
    }, []);
    const initSelectProv = (list, slug)=>{
        list.forEach((v, k)=>{
            if (v.slug === slug) {
                selectProvince(v);
                setShowProvinsi(false);
            }
        });
    };
    const initSelectCity = (list, slug)=>{
        list.forEach((v, k)=>{
            if (v.slug == slug) setVKota(v);
        });
    };
    const initSelectTokoh = (list, slug)=>{
        list.forEach((v, k)=>{
            if (v.slug == slug) setVTokoh(v);
        });
    };
    const initSelectTopik = (list, slug)=>{
        list.forEach((v, k)=>{
            if (v.slug == slug) setVTopik(v);
        });
    };
    const initSelectOtonomi = (list, slug)=>{
        list.forEach((v, k)=>{
            if (v.slug == slug) setVOtonomi(v);
        });
    };
    const selectProvince = (selected)=>{
        setVProvinsi(selected);
        setShowProvinsi(!showProvinsi);
        getCities(selected.slug).then((res)=>{
            setKotaOptions(res.data);
            setVKota("");
            if (params.region == "kota") initSelectCity(res.data, params.slug);
        });
    };
    const search = ()=>{
        setIsRegionalSearch(false);
        let url = "";
        if (vKota) {
            setIsRegionalSearch(true);
            url += "/kota/" + vKota.slug;
        } else {
            if (vProvinsi) {
                setIsRegionalSearch(true);
                url += "/provinsi/" + vProvinsi.slug;
            } else {
                if (params.region) {
                    url += `/${params.region}/${params.slug}`;
                } else {
                    url += "/umum/indonesia";
                }
            }
        }
        url += path !== "/" && path !== "/profile" && path !== "/arsip" ? "/" : "/";
        // check last array in path
        const toArray = path.split("/");
        // if (path.includes('kabar'))
        if (path.includes("jurnal")) {
            url += "jurnal";
        } else if (path.includes("kabar")) {
            url += "kabar";
        } else if (path.includes("video")) {
            url += "video";
        } else if (path.includes("album")) {
            url += "album";
        } else if (path.includes("info-grafis")) {
            url += "info-grafis";
        } else {
            url += "all";
        }
        if (vTokoh || vTopik || vOtonomi) {
            url += "/tags/";
            if (vTokoh) {
                url += vTokoh.slug;
            }
            if (vTopik) {
                url += "%2B" + vTopik.slug;
            }
            if (vOtonomi) {
                url += "%2B" + vOtonomi.slug;
            }
        }
        if (keyword) {
            url += "/keyword/" + keyword;
        }
        setShowSearch(false);
        console.log(path);
        if (vKota) url += "?provinsi=" + vProvinsi.slug;
        router.push(url);
    };
    console.log(params.region, provinsiOptions);
    return /*#__PURE__*/ jsx_runtime_.jsx("div", {
        children: /*#__PURE__*/ jsx_runtime_.jsx("div", {
            className: "bg-white absolute w-full z-[9999] mx-auto shadow-lg py-6",
            children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                className: "relative flex flex-col w-[85%] mx-auto",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                        className: "flex items-center",
                        children: [
                            /*#__PURE__*/ jsx_runtime_.jsx("div", {
                                className: "absolute left-2 cursor-pointer hover:scale-110",
                                onClick: ()=>search(),
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
                                onKeyUp: (e)=>{
                                    e.keyCode === 13 && search();
                                },
                                onChange: (e)=>setKeyword(e.target.value),
                                value: keyword
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                        className: "flex flex-col",
                        children: [
                            /*#__PURE__*/ jsx_runtime_.jsx("div", {
                                className: "py-2 text-xs italic font-normal text-tertiary",
                                children: "Pencarian berdasarkan kategori"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                                className: "flex flex-wrap justify-center space-x-0 md:space-x-0 sm:justify-between md:justify-center xl:justify-between",
                                children: [
                                    /*#__PURE__*/ jsx_runtime_.jsx("div", {
                                        className: "mb-3",
                                        children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                                            className: "flex flex-col justify-between space-x-0 space-y-3 md:space-x-3 md:space-y-0 sm:flex-col md:flex-row",
                                            children: [
                                                /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                                                    className: "relative w-fit min-w-[172px] z-[50]",
                                                    children: [
                                                        /*#__PURE__*/ (0,jsx_runtime_.jsxs)("button", {
                                                            className: `z-[1] sticky bg-[#F5F5F5] rounded-lg text-xs font-bold flex items-center justify-between w-full shadow-search px-2 py-1 border-[3px] border-${params?.region === "umum" || params?.region === undefined ? "primary" : "secondary"} hover:border-${params?.region === "umum" || params?.region === undefined ? "primary" : "secondary"} text-tertiary hover:text-tertiary_dark`,
                                                            onClick: ()=>{
                                                                setShowTokoh(!showTokoh);
                                                            },
                                                            children: [
                                                                /*#__PURE__*/ jsx_runtime_.jsx("h3", {
                                                                    className: "uppercase",
                                                                    children: vTokoh ? vTokoh.title : "Tokoh"
                                                                }),
                                                                showTokoh ? /*#__PURE__*/ jsx_runtime_.jsx(fa6_index_esm/* FaAngleUp */.$Pg, {
                                                                    className: `text-base text-${params?.region === "umum" || params?.region === undefined ? "primary" : "secondary"}`
                                                                }) : /*#__PURE__*/ jsx_runtime_.jsx(fa6_index_esm/* FaAngleDown */.iUH, {
                                                                    className: `text-base text-${params?.region === "umum" || params?.region === undefined ? "primary" : "secondary"}`
                                                                })
                                                            ]
                                                        }),
                                                        /*#__PURE__*/ jsx_runtime_.jsx("ul", {
                                                            className: `flex-col absolute max-h-96 text-tertiary font-medium bg-[#F5F5F5] top-5 rounded-t-sm rounded-b-md shadow w-full py-2 pt-5 px-1 h-26 overflow-y-auto text-xs space-y-2 ${showTokoh ? "opacity-100" : "opacity-0 hidden"} transition-all duration-100 ease-in-out`,
                                                            children: tokohOptions.map((value, key)=>{
                                                                return /*#__PURE__*/ jsx_runtime_.jsx("li", {
                                                                    onClick: ()=>{
                                                                        setVTokoh(value);
                                                                        setShowTokoh(!showTokoh);
                                                                    },
                                                                    className: "p-1 px-2 rounded-md cursor-pointer hover:bg-zinc-600 hover:bg-opacity-25",
                                                                    children: value.title
                                                                }, "tokoh" + key);
                                                            })
                                                        })
                                                    ]
                                                }),
                                                /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                                                    className: "relative w-fit min-w-[172px] z-[40]",
                                                    children: [
                                                        /*#__PURE__*/ (0,jsx_runtime_.jsxs)("button", {
                                                            className: `z-[6] sticky bg-[#F5F5F5] rounded-lg text-xs font-bold flex items-center justify-between w-full shadow-search px-2 py-1 border-[3px] border-${params?.region === "umum" || params?.region === undefined ? "primary" : "secondary"} hover:border-${params?.region === "umum" || params?.region === undefined ? "primary" : "secondary"} text-tertiary hover:text-tertiary_dark`,
                                                            onClick: ()=>{
                                                                setShowTopik(!showTopik);
                                                            },
                                                            children: [
                                                                /*#__PURE__*/ jsx_runtime_.jsx("h3", {
                                                                    className: "uppercase",
                                                                    children: vTopik ? vTopik.title : "Topik"
                                                                }),
                                                                showTopik ? /*#__PURE__*/ jsx_runtime_.jsx(fa6_index_esm/* FaAngleUp */.$Pg, {
                                                                    className: `text-base text-${params?.region === "umum" || params?.region === undefined ? "primary" : "secondary"}`
                                                                }) : /*#__PURE__*/ jsx_runtime_.jsx(fa6_index_esm/* FaAngleDown */.iUH, {
                                                                    className: `text-base text-${params?.region === "umum" || params?.region === undefined ? "primary" : "secondary"}`
                                                                })
                                                            ]
                                                        }),
                                                        /*#__PURE__*/ jsx_runtime_.jsx("ul", {
                                                            className: `flex-col max-h-96 absolute text-tertiary font-medium bg-[#F5F5F5] top-5 rounded-t-sm rounded-b-md shadow w-full py-2 pt-5 px-1 max-h-26 overflow-y-auto text-xs space-y-2 ${showTopik ? "opacity-100" : "opacity-0 hidden"} transition-all duration-100 ease-in-out`,
                                                            children: topikOptions.map((value, key)=>{
                                                                return /*#__PURE__*/ jsx_runtime_.jsx("li", {
                                                                    onClick: ()=>{
                                                                        setVTopik(value);
                                                                        setShowTopik(!showTopik);
                                                                    },
                                                                    className: "p-1 px-2 rounded-md cursor-pointer hover:bg-zinc-600 hover:bg-opacity-25",
                                                                    children: value.title
                                                                }, "topik" + key);
                                                            })
                                                        })
                                                    ]
                                                }),
                                                /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                                                    className: "relative w-fit min-w-[172px] z-[30]",
                                                    children: [
                                                        /*#__PURE__*/ (0,jsx_runtime_.jsxs)("button", {
                                                            className: `z-[5] sticky bg-[#F5F5F5] rounded-lg text-xs font-bold flex items-center justify-between w-full shadow-search px-2 py-1 border-[3px] border-${params?.region === "umum" || params?.region === undefined ? "primary" : "secondary"} hover:border-${params?.region === "umum" || params?.region === undefined ? "primary" : "secondary"} text-tertiary hover:text-tertiary_dark`,
                                                            onClick: ()=>{
                                                                setShowOtonomi(!showOtonomi);
                                                            },
                                                            children: [
                                                                /*#__PURE__*/ jsx_runtime_.jsx("h3", {
                                                                    className: "uppercase",
                                                                    children: vOtonomi ? vOtonomi.title : "OTONOMI DAERAH"
                                                                }),
                                                                showOtonomi ? /*#__PURE__*/ jsx_runtime_.jsx(fa6_index_esm/* FaAngleUp */.$Pg, {
                                                                    className: `text-base text-${params?.region === "umum" || params?.region === undefined ? "primary" : "secondary"}`
                                                                }) : /*#__PURE__*/ jsx_runtime_.jsx(fa6_index_esm/* FaAngleDown */.iUH, {
                                                                    className: `text-base text-${params?.region === "umum" || params?.region === undefined ? "primary" : "secondary"}`
                                                                })
                                                            ]
                                                        }),
                                                        /*#__PURE__*/ jsx_runtime_.jsx("ul", {
                                                            className: `flex-col max-h-96 absolute text-tertiary font-medium bg-[#F5F5F5] top-5 rounded-t-sm rounded-b-md shadow w-full py-2 pt-5 px-1 max-h-26 overflow-y-auto text-xs space-y-2 ${showOtonomi ? "opacity-100" : "opacity-0 hidden"} transition-all duration-100 ease-in-out`,
                                                            children: otonomiOptions.map((value, key)=>{
                                                                return /*#__PURE__*/ jsx_runtime_.jsx("li", {
                                                                    onClick: ()=>{
                                                                        setVOtonomi(value);
                                                                        setShowOtonomi(!showOtonomi);
                                                                    },
                                                                    className: "p-1 px-2 rounded-md cursor-pointer hover:bg-zinc-600 hover:bg-opacity-25",
                                                                    children: value.title
                                                                }, "otonomi" + key);
                                                            })
                                                        })
                                                    ]
                                                })
                                            ]
                                        })
                                    }),
                                    /*#__PURE__*/ jsx_runtime_.jsx("div", {
                                        className: "flex-col",
                                        children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                                            className: "flex flex-col items-start justify-start space-x-0 space-y-3 md:justify-between md:space-y-0 md:space-x-3 sm:flex-col md:flex-row",
                                            children: [
                                                /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                                                    className: "relative w-fit min-w-[172px] z-[20]",
                                                    children: [
                                                        /*#__PURE__*/ (0,jsx_runtime_.jsxs)("button", {
                                                            className: " z-[5] sticky bg-[#F5F5F5] rounded-lg text-xs font-bold flex items-center justify-between w-full shadow-search px-2 py-1 border-[3px] border-secondary hover:border-secondary text-tertiary hover:text-tertiary_dark",
                                                            onClick: ()=>{
                                                                setShowProvinsi(!showProvinsi);
                                                            },
                                                            children: [
                                                                /*#__PURE__*/ jsx_runtime_.jsx("h3", {
                                                                    className: "uppercase",
                                                                    children: vProvinsi ? vProvinsi.province_name : "Provinsi"
                                                                }),
                                                                showProvinsi ? /*#__PURE__*/ jsx_runtime_.jsx(fa6_index_esm/* FaAngleUp */.$Pg, {
                                                                    className: "text-base text-secondary"
                                                                }) : /*#__PURE__*/ jsx_runtime_.jsx(fa6_index_esm/* FaAngleDown */.iUH, {
                                                                    className: "text-base text-secondary"
                                                                })
                                                            ]
                                                        }),
                                                        /*#__PURE__*/ jsx_runtime_.jsx("ul", {
                                                            className: `flex-col absolute flex max-h-96 text-tertiary font-medium bg-[#F5F5F5] top-5 rounded-t-sm rounded-b-md shadow w-full py-2 pt-5 px-1 h-26 overflow-y-auto text-xs space-y-2 ${showProvinsi ? "opacity-100" : "opacity-0 hidden"} transition-all duration-300 ease-in-out`,
                                                            children: provinsiOptions.map((value, key)=>{
                                                                return /*#__PURE__*/ jsx_runtime_.jsx("li", {
                                                                    onClick: ()=>selectProvince(value),
                                                                    className: "p-1 px-2 rounded-md cursor-pointer hover:bg-zinc-600 hover:bg-opacity-25",
                                                                    children: value.province_name
                                                                }, "provinsi" + key);
                                                            })
                                                        })
                                                    ]
                                                }),
                                                /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                                                    className: "relative w-fit min-w-[172px] z-[10]",
                                                    children: [
                                                        /*#__PURE__*/ (0,jsx_runtime_.jsxs)("button", {
                                                            className: " z-[5] sticky bg-[#F5F5F5] rounded-lg text-xs font-bold flex items-center justify-between w-full shadow-search px-2 py-1 border-[3px] border-secondary hover:border-secondary text-tertiary hover:text-tertiary_dark",
                                                            onClick: ()=>{
                                                                setShowKota(!showKota);
                                                            },
                                                            children: [
                                                                /*#__PURE__*/ jsx_runtime_.jsx("h3", {
                                                                    className: "uppercase",
                                                                    children: vKota ? vKota.city_name : "KOTA"
                                                                }),
                                                                showKota ? /*#__PURE__*/ jsx_runtime_.jsx(fa6_index_esm/* FaAngleUp */.$Pg, {
                                                                    className: "text-base text-secondary"
                                                                }) : /*#__PURE__*/ jsx_runtime_.jsx(fa6_index_esm/* FaAngleDown */.iUH, {
                                                                    className: "text-base text-secondary"
                                                                })
                                                            ]
                                                        }),
                                                        /*#__PURE__*/ jsx_runtime_.jsx("ul", {
                                                            className: `flex-col absolute text-tertiary max-h-96 font-medium bg-[#F5F5F5] top-5 rounded-t-sm rounded-b-md shadow w-full py-2 pt-5 px-1 max-h-26 overflow-y-auto text-xs space-y-2 ${showKota ? "opacity-100" : "opacity-0 hidden"} transition-all duration-100 ease-in-out`,
                                                            children: kotaOptions.length > 0 ? kotaOptions.map((value, key)=>{
                                                                return /*#__PURE__*/ jsx_runtime_.jsx("li", {
                                                                    onClick: ()=>{
                                                                        setVKota(value);
                                                                        setShowKota(!showKota);
                                                                    },
                                                                    className: "p-1 px-2 rounded-md cursor-pointer hover:bg-zinc-600 hover:bg-opacity-25",
                                                                    children: value.city_name
                                                                }, "kota" + key);
                                                            }) : /*#__PURE__*/ jsx_runtime_.jsx("li", {
                                                                children: "Silahkan pilih provinsi terlebih dahulu"
                                                            })
                                                        })
                                                    ]
                                                })
                                            ]
                                        })
                                    }),
                                    /*#__PURE__*/ jsx_runtime_.jsx("div", {
                                        className: "flex justify-center pt-6 pb-3 mx-auto w-full",
                                        children: /*#__PURE__*/ jsx_runtime_.jsx("button", {
                                            onClick: ()=>search(),
                                            className: "btn btn-sm border-transparent bg-[#FEC10870] hover:bg-[#FEC10870] hover:border-transparent px-6 py-2 text-xs font-bold rounded-full hover:shadow-[0px_4px_7px_0px_#00000040] hover:opacity-50",
                                            children: "Cari"
                                        })
                                    })
                                ]
                            })
                        ]
                    })
                ]
            })
        })
    });
};
/* harmony default export */ const search = (SearchComponent);

// EXTERNAL MODULE: ./src/components/auth/AuthComponet.js + 3 modules
var AuthComponet = __webpack_require__(95447);
// EXTERNAL MODULE: ./node_modules/react-icons/io/index.esm.js
var io_index_esm = __webpack_require__(12772);
// EXTERNAL MODULE: ./node_modules/next/image.js
var next_image = __webpack_require__(52451);
var image_default = /*#__PURE__*/__webpack_require__.n(next_image);
// EXTERNAL MODULE: ./src/modules/auth/usecases/auth.usecase.js
var auth_usecase = __webpack_require__(37951);
// EXTERNAL MODULE: ./src/utils/api.js
var api = __webpack_require__(11905);
;// CONCATENATED MODULE: ./src/components/layouts/NavbarLayout.js
/* __next_internal_client_entry_do_not_use__ default auto */ 












const NavbarLayout = ()=>{
    const params = (0,navigation.useParams)();
    const [isRegionalSearch, setIsRegionalSearch] = (0,react_.useState)(false);
    const [openNavbar, setOpenNavbar] = (0,react_.useState)(false);
    const [showSearch, setShowSearch] = (0,react_.useState)(false);
    const [showAuth, setShowAuth] = (0,react_.useState)(false);
    const [user, setUser] = (0,react_.useState)(null);
    const targetElementRef = (0,react_.useRef)();
    const buttonElementSearch = (0,react_.useRef)();
    const buttonElementSearch2 = (0,react_.useRef)();
    const path = (0,navigation.usePathname)();
    const router = (0,navigation.useRouter)();
    // const {userData} = useUser
    const handleOutsideClick = (event)=>{
        if (targetElementRef.current && !targetElementRef.current.contains(event.target)) {
            if (buttonElementSearch.current && !buttonElementSearch.current.contains(event.target) && buttonElementSearch2.current && !buttonElementSearch2.current.contains(event.target)) {
                setShowSearch(false);
            }
        }
    };
    const getUser = async ()=>{
        const userData = await (0,auth_usecase/* CheckLogin */.PG)();
        if (userData) {
            setUser(userData);
        } else {
            setUser(null);
        }
    };
    const handleResize = ()=>{
        if (window.innerWidth >= 768) {
            setOpenNavbar(false);
        }
    };
    (0,react_.useEffect)(()=>{
        // Tambahkan event listener saat komponen dimuat
        window.addEventListener("resize", handleResize);
        document.addEventListener("mousedown", handleOutsideClick);
        // Bersihkan event listener saat komponen dibongkar
        return ()=>{
            window.removeEventListener("resize", handleResize);
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);
    const searchParams = (0,navigation.useSearchParams)();
    const provinsi = searchParams.get("provinsi");
    const kota = searchParams.get("kota");
    (0,react_.useEffect)(()=>{
        setOpenNavbar(false);
        setShowSearch(false);
        setShowAuth(false);
        getUser();
        if (provinsi || kota || path.includes("/provinsi/") || path.includes("/kota/")) {
            setIsRegionalSearch(true);
        } else {
            setIsRegionalSearch(false);
        }
        return ()=>{
            setUser(null);
        };
    }, [
        path
    ]);
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
        className: "relative h-[72px] sm:h-[72px] md:h-[120px] lg:h-[72px]",
        children: [
            /*#__PURE__*/ jsx_runtime_.jsx("div", {
                className: "fixed w-full bg-white z-[997] shadow-md",
                children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                    className: "w-full md:w-[85%] mx-auto",
                    children: [
                        /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                            className: "flex items-center px-4 justify-between w-full py-3 sm:flex-row md:flex-col lg:flex-row",
                            children: [
                                /*#__PURE__*/ jsx_runtime_.jsx("div", {
                                    className: "cursor-pointer hover:scale-105 duration-500",
                                    children: /*#__PURE__*/ jsx_runtime_.jsx((link_default()), {
                                        href: "/",
                                        className: "flex items-center gap-2",
                                        children: /*#__PURE__*/ jsx_runtime_.jsx("div", {
                                            className: `flex flex-col md:items-center md:gap-2 md:flex-row font-semibold text-secondary text-base ${(target_path_src_utils_fonts_js_import_Plus_Jakarta_Sans_arguments_subsets_latin_variableName_plusJakartaSans_default()).className}`,
                                            children: /*#__PURE__*/ jsx_runtime_.jsx("div", {
                                                className: "flex items-center gap-2",
                                                children: /*#__PURE__*/ jsx_runtime_.jsx((image_default()), {
                                                    className: "object-contain mx-auto order-1 md:order-2",
                                                    src: "/images/icons/logo-biru.png",
                                                    alt: "Logo Necara Ruang",
                                                    width: 150,
                                                    height: 150
                                                })
                                            })
                                        })
                                    })
                                }),
                                /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                                    className: "flex items-center md:hidden",
                                    children: [
                                        /*#__PURE__*/ jsx_runtime_.jsx("button", {
                                            className: `text-2xl btn btn-square btn-ghost ${isRegionalSearch ? "text-secondary" : "text-primary"}`,
                                            onClick: ()=>{
                                                setShowSearch(false);
                                                setOpenNavbar(!openNavbar);
                                            },
                                            children: /*#__PURE__*/ jsx_runtime_.jsx(index_esm/* HiOutlineMenuAlt3 */.qnt, {})
                                        }),
                                        /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                                            className: "flex space-x-2",
                                            children: [
                                                /*#__PURE__*/ jsx_runtime_.jsx("div", {
                                                    ref: buttonElementSearch2,
                                                    className: "btn btn-sm btn-circle btn-ghost",
                                                    onClick: ()=>{
                                                        setShowSearch(!showSearch);
                                                        setShowAuth(false);
                                                        setOpenNavbar(false);
                                                    },
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
                                                                className: `${isRegionalSearch ? "stroke-secondary" : "stroke-primary"}`,
                                                                strokeWidth: "3"
                                                            }),
                                                            /*#__PURE__*/ jsx_runtime_.jsx("path", {
                                                                d: "M16 16L26.0002 26.4656",
                                                                className: `${isRegionalSearch ? "stroke-secondary" : "stroke-primary"}`,
                                                                strokeWidth: "3",
                                                                strokeLinecap: "round"
                                                            })
                                                        ]
                                                    })
                                                }),
                                                /*#__PURE__*/ jsx_runtime_.jsx("div", {
                                                    className: "btn btn-sm btn-circle btn-ghost",
                                                    onClick: ()=>{
                                                        if (user === null) {
                                                            (0,api/* ConnectLoginSSO */.ak)();
                                                        // setShowAuth(!showAuth);
                                                        // setShowSearch(false);
                                                        } else {
                                                            router.push("/profile");
                                                        }
                                                    },
                                                    children: user?.image ? /*#__PURE__*/ jsx_runtime_.jsx((image_default()), {
                                                        src: user?.image.includes("https") ? user?.image : "https://staging.gerai.neracaruang.com/" + "/" + user?.image,
                                                        width: 30,
                                                        height: 30,
                                                        className: "w-[30px] h-[30px] rounded-full object-cover",
                                                        alt: "profile"
                                                    }) : /*#__PURE__*/ (0,jsx_runtime_.jsxs)("svg", {
                                                        width: "24",
                                                        height: "24",
                                                        viewBox: "0 0 28 28",
                                                        fill: "none",
                                                        xmlns: "http://www.w3.org/2000/svg",
                                                        className: "cursor-pointer",
                                                        children: [
                                                            /*#__PURE__*/ jsx_runtime_.jsx("circle", {
                                                                cx: "14",
                                                                cy: "14",
                                                                r: "13",
                                                                strokeWidth: "2",
                                                                className: `${isRegionalSearch ? "stroke-secondary" : "stroke-primary"}`
                                                            }),
                                                            /*#__PURE__*/ jsx_runtime_.jsx("circle", {
                                                                cx: "14",
                                                                cy: "11",
                                                                r: "5",
                                                                className: `${isRegionalSearch ? "fill-secondary" : "fill-primary"}`
                                                            }),
                                                            /*#__PURE__*/ jsx_runtime_.jsx("ellipse", {
                                                                cx: "14",
                                                                cy: "22",
                                                                rx: "9",
                                                                ry: "5",
                                                                className: `${isRegionalSearch ? "fill-secondary" : "fill-primary"}`
                                                            })
                                                        ]
                                                    })
                                                })
                                            ]
                                        })
                                    ]
                                }),
                                /*#__PURE__*/ jsx_runtime_.jsx("div", {
                                    className: `md:block lg:w-[75%] xl:w-[70%] w-full ${openNavbar ? "block absolute w-full top-16 left-0 bg-white transition ease-in-out delay-150 z-[999] min-h-screen right-0" : "hidden"}`,
                                    children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)("ul", {
                                        className: `flex justify-between text-[16px] leading-5 ${isRegionalSearch ? "text-secondary" : "text-primary"} ${openNavbar ? "flex-col w-[85%] mx-auto items-baseline py-4" : "w-full items-center"}`,
                                        children: [
                                            /*#__PURE__*/ jsx_runtime_.jsx((link_default()), {
                                                href: `${isRegionalSearch && params.region && params.slug ? "/" + params.region + "/" + params.slug + "/kabar?provinsi=" + provinsi : isRegionalSearch && kota ? "/kota/" + kota : isRegionalSearch && provinsi ? "/provinsi/" + provinsi : "/kabar"}`,
                                                children: /*#__PURE__*/ jsx_runtime_.jsx("li", {
                                                    className: `cursor-pointer hover:text-primary_light font-bold btn ${path.includes("/kabar") ? "" : "btn-ghost"}`,
                                                    children: "Kabar"
                                                })
                                            }),
                                            /*#__PURE__*/ jsx_runtime_.jsx((link_default()), {
                                                href: `${isRegionalSearch && params.region && params.slug ? "/" + params.region + "/" + params.slug + "/jurnal?provinsi=" + provinsi : isRegionalSearch && kota ? "/kota/" + kota : isRegionalSearch && provinsi ? "/provinsi/" + provinsi : "/jurnal"}`,
                                                children: /*#__PURE__*/ jsx_runtime_.jsx("li", {
                                                    className: `cursor-pointer hover:text-primary_light font-bold btn ${path.includes("/jurnal") ? "" : "btn-ghost"}`,
                                                    children: "Jurnal"
                                                })
                                            }),
                                            /*#__PURE__*/ jsx_runtime_.jsx((link_default()), {
                                                href: `${isRegionalSearch && params.region && params.slug ? "/" + params.region + "/" + params.slug + "/info-grafis?provinsi=" + provinsi : isRegionalSearch && kota ? "/kota/" + kota : isRegionalSearch && provinsi ? "/provinsi/" + provinsi : "/info-grafis"}`,
                                                children: /*#__PURE__*/ jsx_runtime_.jsx("li", {
                                                    className: `cursor-pointer hover:text-primary_light font-bold btn ${path.includes("/info-grafis") ? "" : "btn-ghost"}`,
                                                    children: "Infografis"
                                                })
                                            }),
                                            /*#__PURE__*/ jsx_runtime_.jsx((link_default()), {
                                                href: `${isRegionalSearch && params.region && params.slug ? "/" + params.region + "/" + params.slug + "/video?provinsi=" + provinsi : isRegionalSearch && kota ? "/kota/" + kota : isRegionalSearch && provinsi ? "/provinsi/" + provinsi : "/video"}`,
                                                children: /*#__PURE__*/ jsx_runtime_.jsx("li", {
                                                    className: `cursor-pointer hover:text-primary_light font-bold btn ${path.includes("/video") ? "" : "btn-ghost"}`,
                                                    children: "Video"
                                                })
                                            }),
                                            /*#__PURE__*/ jsx_runtime_.jsx((link_default()), {
                                                href: `${isRegionalSearch && params.region && params.slug ? "/" + params.region + "/" + params.slug + "/album?provinsi=" + provinsi : isRegionalSearch && kota ? "/kota/" + kota : isRegionalSearch && provinsi ? "/provinsi/" + provinsi : "/album"}`,
                                                children: /*#__PURE__*/ jsx_runtime_.jsx("li", {
                                                    className: `cursor-pointer hover:text-primary_light font-bold btn ${path.includes("/album") ? "" : "btn-ghost"}`,
                                                    children: "Album Foto"
                                                })
                                            }),
                                            !isRegionalSearch && /*#__PURE__*/ jsx_runtime_.jsx((link_default()), {
                                                href: "/diskusi",
                                                children: /*#__PURE__*/ jsx_runtime_.jsx("li", {
                                                    className: `cursor-pointer hover:text-primary_light font-bold btn ${path.includes("/diskusi") ? "" : "btn-ghost"}`,
                                                    children: "Diskusi"
                                                })
                                            }),
                                            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("li", {
                                                className: "hidden space-x-2 md:flex",
                                                children: [
                                                    path !== "/diskusi" && /*#__PURE__*/ jsx_runtime_.jsx("div", {
                                                        ref: buttonElementSearch,
                                                        className: "btn btn-sm btn-circle btn-ghost",
                                                        onClick: ()=>{
                                                            setShowSearch(!showSearch);
                                                            setShowAuth(false);
                                                        },
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
                                                                    className: `${isRegionalSearch ? "stroke-secondary" : "stroke-primary"}`,
                                                                    strokeWidth: "3"
                                                                }),
                                                                /*#__PURE__*/ jsx_runtime_.jsx("path", {
                                                                    d: "M16 16L26.0002 26.4656",
                                                                    className: `${isRegionalSearch ? "stroke-secondary" : "stroke-primary"}`,
                                                                    strokeWidth: "3",
                                                                    strokeLinecap: "round"
                                                                })
                                                            ]
                                                        })
                                                    }),
                                                    /*#__PURE__*/ jsx_runtime_.jsx("div", {
                                                        className: "btn btn-sm btn-circle btn-ghost",
                                                        onClick: ()=>{
                                                            if (user === null) {
                                                                (0,api/* ConnectLoginSSO */.ak)();
                                                            // setShowAuth(!showAuth);
                                                            // setShowSearch(false);
                                                            } else {
                                                                router.push("/profile");
                                                            }
                                                        },
                                                        children: user?.image ? /*#__PURE__*/ jsx_runtime_.jsx((image_default()), {
                                                            src: user?.image.includes("https") ? user?.image : "https://staging.gerai.neracaruang.com/" + "/" + user?.image,
                                                            width: 30,
                                                            height: 30,
                                                            className: "w-[30px] h-[30px] rounded-full object-cover",
                                                            alt: "profile"
                                                        }) : /*#__PURE__*/ (0,jsx_runtime_.jsxs)("svg", {
                                                            width: "24",
                                                            height: "24",
                                                            viewBox: "0 0 28 28",
                                                            fill: "none",
                                                            xmlns: "http://www.w3.org/2000/svg",
                                                            className: "cursor-pointer",
                                                            children: [
                                                                /*#__PURE__*/ jsx_runtime_.jsx("circle", {
                                                                    cx: "14",
                                                                    cy: "14",
                                                                    r: "13",
                                                                    strokeWidth: "2",
                                                                    className: `${isRegionalSearch ? "stroke-secondary" : "stroke-primary"}`
                                                                }),
                                                                /*#__PURE__*/ jsx_runtime_.jsx("circle", {
                                                                    cx: "14",
                                                                    cy: "11",
                                                                    r: "5",
                                                                    className: `${isRegionalSearch ? "fill-secondary" : "fill-primary"}`
                                                                }),
                                                                /*#__PURE__*/ jsx_runtime_.jsx("ellipse", {
                                                                    cx: "14",
                                                                    cy: "22",
                                                                    rx: "9",
                                                                    ry: "5",
                                                                    className: `${isRegionalSearch ? "fill-secondary" : "fill-primary"}`
                                                                })
                                                            ]
                                                        })
                                                    })
                                                ]
                                            })
                                        ]
                                    })
                                })
                            ]
                        }),
                        showSearch && /*#__PURE__*/ jsx_runtime_.jsx("div", {
                            className: "w-full relative",
                            ref: targetElementRef,
                            children: /*#__PURE__*/ jsx_runtime_.jsx(search, {
                                setShowSearch: setShowSearch,
                                setIsRegionalSearch: setIsRegionalSearch
                            })
                        })
                    ]
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
                children: /*#__PURE__*/ jsx_runtime_.jsx("div", {
                    className: "flex justify-center items-center min-h-screen",
                    children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                        className: "fixed mt-0 md:mt-1 z-[999] w-[90%] md:w-[80%] lg:w-[60%]",
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
                            /*#__PURE__*/ jsx_runtime_.jsx(AuthComponet/* default */.Z, {})
                        ]
                    })
                })
            })
        ]
    });
};
/* harmony default export */ const layouts_NavbarLayout = (NavbarLayout);


/***/ }),

/***/ 45917:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CY: () => (/* binding */ UpdatePassword),
/* harmony export */   aX: () => (/* binding */ Register),
/* harmony export */   k0: () => (/* binding */ UpdateData),
/* harmony export */   m3: () => (/* binding */ Login),
/* harmony export */   oP: () => (/* binding */ ForgotPassword),
/* harmony export */   tq: () => (/* binding */ ResetPassword),
/* harmony export */   w2: () => (/* binding */ CheckUser)
/* harmony export */ });
/* harmony import */ var _utils_api__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11905);

const Login = async (data)=>{
    const res = await (0,_utils_api__WEBPACK_IMPORTED_MODULE_0__/* .PostData */ .Gz)("/login", data);
    return res;
};
const Register = async (data)=>{
    const res = await (0,_utils_api__WEBPACK_IMPORTED_MODULE_0__/* .PostData */ .Gz)("/register", data);
    return res;
};
const UpdateData = async (data)=>{
    const res = await (0,_utils_api__WEBPACK_IMPORTED_MODULE_0__/* .PostWithFormData */ .d1)("/update-profile", data);
    return res;
};
const UpdatePassword = async (data)=>{
    const res = await (0,_utils_api__WEBPACK_IMPORTED_MODULE_0__/* .PostDataWithToken */ .J7)("/update-password", data);
    return res;
};
const ForgotPassword = async (data)=>{
    const res = await (0,_utils_api__WEBPACK_IMPORTED_MODULE_0__/* .PostData */ .Gz)("/forgot-password", data);
    return res;
};
const ResetPassword = async (query, data)=>{
    const res = await (0,_utils_api__WEBPACK_IMPORTED_MODULE_0__/* .PostData */ .Gz)("/reset-password" + query, data);
    return res;
};
const CheckUser = async (token)=>{
    const res = await (0,_utils_api__WEBPACK_IMPORTED_MODULE_0__/* .GetDataWithToken */ .sP)("/check-user", token);
    return res;
};


/***/ }),

/***/ 37951:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   IK: () => (/* binding */ RegisterUseCase),
/* harmony export */   PG: () => (/* binding */ CheckLogin),
/* harmony export */   RD: () => (/* binding */ Logout),
/* harmony export */   fM: () => (/* binding */ ChangePasswordCase),
/* harmony export */   ko: () => (/* binding */ LoginUseCase),
/* harmony export */   tH: () => (/* binding */ CheckUserUsaCase)
/* harmony export */ });
/* harmony import */ var _utils_api__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(11905);
/* harmony import */ var _repositories_auth_repository__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(45917);


const LoginUseCase = async (data)=>{
    const LoginProses = await (0,_repositories_auth_repository__WEBPACK_IMPORTED_MODULE_0__/* .Login */ .m3)(data);
    if (LoginProses.status) {
        // set to localstorage
        const userData = await CheckUserUsaCase(LoginProses.token);
        if (userData) {
            localStorage.setItem("userData", JSON.stringify({
                token: LoginProses.token,
                ...userData
            }));
            return {
                token: LoginProses.token,
                ...userData
            };
        }
    }
    return false;
};
const RegisterUseCase = async (data)=>{
    const RegisterProses = await (0,_repositories_auth_repository__WEBPACK_IMPORTED_MODULE_0__/* .Register */ .aX)(data);
    if (RegisterProses.status) {
        const userData = await CheckUserUsaCase(RegisterProses.data.token);
        // set to localstorage
        if (userData !== null) {
            localStorage.setItem("userData", JSON.stringify({
                token: RegisterProses.data.token,
                ...userData
            }));
            return {
                data: {
                    token: RegisterProses.data.token,
                    ...userData
                },
                ...RegisterProses
            };
        }
    }
    return RegisterProses;
};
const CheckLogin = ()=>{
    if (typeof localStorage != "undefined") {
        const getItem = localStorage.getItem("userData");
        if (getItem !== undefined) {
            const userData = JSON.parse(getItem);
            if (userData) {
                return userData;
            }
        }
        return null;
    }
    return false;
};
const CheckUserUsaCase = async (token)=>{
    const user = await (0,_repositories_auth_repository__WEBPACK_IMPORTED_MODULE_0__/* .CheckUser */ .w2)(token);
    if (user.status) {
        return user.data;
    }
    return null;
};
const ChangePasswordCase = async (data)=>{
    const res = await (0,_repositories_auth_repository__WEBPACK_IMPORTED_MODULE_0__/* .UpdatePassword */ .CY)(data);
    if (!res) return null;
    return res;
};
const Logout = ()=>{
    localStorage.removeItem("userData");
    return (0,_utils_api__WEBPACK_IMPORTED_MODULE_1__/* .logoutSSO */ .JF)();
};


/***/ }),

/***/ 11905:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Gz: () => (/* binding */ PostData),
/* harmony export */   J7: () => (/* binding */ PostDataWithToken),
/* harmony export */   JF: () => (/* binding */ logoutSSO),
/* harmony export */   ak: () => (/* binding */ ConnectLoginSSO),
/* harmony export */   d1: () => (/* binding */ PostWithFormData),
/* harmony export */   eO: () => (/* binding */ GetData),
/* harmony export */   sP: () => (/* binding */ GetDataWithToken),
/* harmony export */   sU: () => (/* binding */ CallbackSSO)
/* harmony export */ });
const BASE_URL_API = "https://staging.gerai.neracaruang.com/api";
const BASE_URL_SSO = "https://sso.otonometer.neracaruang.com/";
const SSO_CLIENT_ID = "71";
const getToken = ()=>{
    if (typeof localStorage != "undefined") {
        const sessionUser = localStorage.getItem("userData");
        if (sessionUser !== undefined) {
            const GetData = JSON.parse(sessionUser) ?? "{}";
            return GetData.token;
        }
        return "";
    }
};
const GetData = async (url)=>{
    try {
        const response = await fetch(`${BASE_URL_API}${url}`, {
            method: "GET"
        });
        return response.json();
    } catch (e) {
        console.error("Error fetching data:", e);
        return e;
    }
};
const PostData = async (url, data)=>{
    try {
        const response = await fetch(`${BASE_URL_API}${url}`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        const resJson = await response.json();
        return resJson;
    } catch (e) {
        console.log("Error fetching data:", e);
        return e;
    }
};
const GetDataWithToken = async (url, token = "")=>{
    let tokenSession;
    if (token !== "") {
        tokenSession = token;
    } else {
        tokenSession = getToken();
    }
    try {
        const response = await fetch(`${BASE_URL_API}${url}`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${tokenSession}`
            }
        });
        const resJson = await response.json();
        return resJson;
    } catch (e) {
        console.error("Error fetching data:", e);
        return e;
    }
};
const PostDataWithToken = async (url, data)=>{
    const tokenSession = getToken();
    try {
        const response = await fetch(`${BASE_URL_API}${url}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${tokenSession}`
            },
            body: JSON.stringify(data)
        });
        return response.json();
    } catch (e) {
        console.error("Error fetching data:", e);
        return e;
    }
};
const PostWithFormData = async (url, body)=>{
    const tokenSession = getToken();
    const form_data = new FormData();
    for(const key in body){
        if (typeof body[key] === "object") {
            if (body[key] instanceof File) {
                form_data.append(key, body[key]);
            } else {
                if (body[key] !== null) {
                    for(let i = 0; i < body[key].length; i++){
                        form_data.append(key, body[key][i]);
                    }
                }
            }
        } else {
            form_data.append(key, body[key]);
        }
    }
    try {
        const response = await fetch(`${BASE_URL_API}${url}`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${tokenSession}`
            },
            body: form_data
        });
        return response.json();
    } catch (error) {}
};
const ConnectLoginSSO = async ()=>{
    window.location.href = `${BASE_URL_SSO}connect?id=${SSO_CLIENT_ID}`;
};
const CallbackSSO = async (data)=>{
    try {
        const response = await fetch(`${BASE_URL_SSO}oauth/token`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        const resJson = await response.json();
        return resJson;
    } catch (e) {
        const data = {
            "isError": true,
            "message": e.message
        };
        return data;
    }
};
const logoutSSO = ()=>{
    window.location.href = `${BASE_URL_SSO}logout`;
};


/***/ }),

/***/ 9898:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ RootLayout),
  metadata: () => (/* binding */ metadata)
});

// EXTERNAL MODULE: external "next/dist/compiled/react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(56786);
// EXTERNAL MODULE: ./node_modules/next/font/google/target.css?{"path":"src\\app\\layout.js","import":"Montserrat","arguments":[{"subsets":["latin"]}],"variableName":"montserrat"}
var target_path_src_app_layout_js_import_Montserrat_arguments_subsets_latin_variableName_montserrat_ = __webpack_require__(55733);
var target_path_src_app_layout_js_import_Montserrat_arguments_subsets_latin_variableName_montserrat_default = /*#__PURE__*/__webpack_require__.n(target_path_src_app_layout_js_import_Montserrat_arguments_subsets_latin_variableName_montserrat_);
// EXTERNAL MODULE: ./src/app/globals.css
var globals = __webpack_require__(5023);
// EXTERNAL MODULE: ./node_modules/next/dist/build/webpack/loaders/next-flight-loader/module-proxy.js
var module_proxy = __webpack_require__(61363);
;// CONCATENATED MODULE: ./src/components/layouts/NavbarLayout.js

const proxy = (0,module_proxy.createProxy)(String.raw`C:\xampp\htdocs\neracaruang_web\neraca-ruang-fe-main\src\components\layouts\NavbarLayout.js`)

// Accessing the __esModule property and exporting $$typeof are required here.
// The __esModule getter forces the proxy target to create the default export
// and the $$typeof value is for rendering logic to determine if the module
// is a client boundary.
const { __esModule, $$typeof } = proxy;
const __default__ = proxy.default;


/* harmony default export */ const NavbarLayout = (__default__);
;// CONCATENATED MODULE: ./src/components/layouts/FooterLayout.js

const FooterLayout_proxy = (0,module_proxy.createProxy)(String.raw`C:\xampp\htdocs\neracaruang_web\neraca-ruang-fe-main\src\components\layouts\FooterLayout.js`)

// Accessing the __esModule property and exporting $$typeof are required here.
// The __esModule getter forces the proxy target to create the default export
// and the $$typeof value is for rendering logic to determine if the module
// is a client boundary.
const { __esModule: FooterLayout_esModule, $$typeof: FooterLayout_$$typeof } = FooterLayout_proxy;
const FooterLayout_default_ = FooterLayout_proxy.default;


/* harmony default export */ const FooterLayout = (FooterLayout_default_);
;// CONCATENATED MODULE: ./src/components/layouts/Layouts.js



const Layouts = ({ children, tags })=>{
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
        children: [
            /*#__PURE__*/ jsx_runtime_.jsx(NavbarLayout, {}),
            /*#__PURE__*/ jsx_runtime_.jsx("div", {
                children: children
            }),
            /*#__PURE__*/ jsx_runtime_.jsx(FooterLayout, {
                tags: tags
            })
        ]
    });
};
/* harmony default export */ const layouts_Layouts = (Layouts);

;// CONCATENATED MODULE: ./src/utils/api.js
const BASE_URL_API = "https://staging.gerai.neracaruang.com/api";
const BASE_URL_SSO = (/* unused pure expression or super */ null && ("https://sso.otonometer.neracaruang.com/"));
const SSO_CLIENT_ID = (/* unused pure expression or super */ null && ("71"));
const getToken = ()=>{
    if (typeof localStorage != "undefined") {
        const sessionUser = localStorage.getItem("userData");
        if (sessionUser !== undefined) {
            const GetData = JSON.parse(sessionUser) ?? "{}";
            return GetData.token;
        }
        return "";
    }
};
const api_GetData = async (url)=>{
    try {
        const response = await fetch(`${BASE_URL_API}${url}`, {
            method: "GET"
        });
        return response.json();
    } catch (e) {
        console.error("Error fetching data:", e);
        return e;
    }
};
const PostData = async (url, data)=>{
    try {
        const response = await fetch(`${BASE_URL_API}${url}`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        const resJson = await response.json();
        return resJson;
    } catch (e) {
        console.log("Error fetching data:", e);
        return e;
    }
};
const GetDataWithToken = async (url, token = "")=>{
    let tokenSession;
    if (token !== "") {
        tokenSession = token;
    } else {
        tokenSession = getToken();
    }
    try {
        const response = await fetch(`${BASE_URL_API}${url}`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${tokenSession}`
            }
        });
        const resJson = await response.json();
        return resJson;
    } catch (e) {
        console.error("Error fetching data:", e);
        return e;
    }
};
const PostDataWithToken = async (url, data)=>{
    const tokenSession = getToken();
    try {
        const response = await fetch(`${BASE_URL_API}${url}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${tokenSession}`
            },
            body: JSON.stringify(data)
        });
        return response.json();
    } catch (e) {
        console.error("Error fetching data:", e);
        return e;
    }
};
const PostWithFormData = async (url, body)=>{
    const tokenSession = getToken();
    const form_data = new FormData();
    for(const key in body){
        if (typeof body[key] === "object") {
            if (body[key] instanceof File) {
                form_data.append(key, body[key]);
            } else {
                if (body[key] !== null) {
                    for(let i = 0; i < body[key].length; i++){
                        form_data.append(key, body[key][i]);
                    }
                }
            }
        } else {
            form_data.append(key, body[key]);
        }
    }
    try {
        const response = await fetch(`${BASE_URL_API}${url}`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${tokenSession}`
            },
            body: form_data
        });
        return response.json();
    } catch (error) {}
};
const ConnectLoginSSO = async ()=>{
    window.location.href = `${BASE_URL_SSO}connect?id=${SSO_CLIENT_ID}`;
};
const CallbackSSO = async (data)=>{
    try {
        const response = await fetch(`${BASE_URL_SSO}oauth/token`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        const resJson = await response.json();
        return resJson;
    } catch (e) {
        const data = {
            "isError": true,
            "message": e.message
        };
        return data;
    }
};
const logoutSSO = ()=>{
    window.location.href = `${BASE_URL_SSO}logout`;
};

;// CONCATENATED MODULE: ./src/modules/content/repositories/content.repository.js

const content_repository_GetContentBySlug = async ()=>{
    const res = await GetData(`/content`);
    return res;
};
const content_repository_GetContent = async (query)=>{
    const res = await GetData("/content" + (query ?? ""));
    return res;
};
const Tags = async ()=>{
    const res = await api_GetData("/tags");
    return res;
};

;// CONCATENATED MODULE: ./src/modules/content/usecases/content.usecase.js


const GetAdsByContent = async ()=>{
    const content = await GetContentBySlug();
    if (content?.ads) {
        return content?.ads;
    }
    return [];
};
const getAdsByQuery = async (query)=>{
    const content = await GetContent(query);
    if (content?.ads) {
        return content?.ads;
    }
    return [];
};
const dataTags = async ()=>{
    const tags = await Tags();
    if (tags.tags) {
        return tags?.tags;
    }
    return [];
};

;// CONCATENATED MODULE: ./src/app/layout.js





const metadata = {
    title: "Neraca Ruang",
    description: "Neraca Ruang website",
    openGraph: {
        images: [
            "/images/icons/logo.png"
        ]
    },
    twitter: {
        card: "summary_large_image",
        images: [
            "/images/icons/logo.png"
        ]
    }
};
async function getFilter(url) {
    const res = await fetch(url, {
        next: {
            revalidate: 3600
        }
    });
    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }
    return res.json();
}
async function getTags() {
    const getData = await dataTags();
    return getData;
}
;
async function RootLayout({ children }) {
    const tags = await getTags();
    return /*#__PURE__*/ jsx_runtime_.jsx("html", {
        lang: "en",
        children: /*#__PURE__*/ jsx_runtime_.jsx("body", {
            className: (target_path_src_app_layout_js_import_Montserrat_arguments_subsets_latin_variableName_montserrat_default()).className,
            children: /*#__PURE__*/ jsx_runtime_.jsx("div", {
                className: "",
                children: /*#__PURE__*/ jsx_runtime_.jsx(layouts_Layouts, {
                    tags: tags,
                    children: /*#__PURE__*/ jsx_runtime_.jsx("div", {
                        className: "overflow-x-hidden",
                        children: children
                    })
                })
            })
        })
    });
}


/***/ }),

/***/ 99106:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ NotFound)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(56786);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(25124);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_link__WEBPACK_IMPORTED_MODULE_1__);


function NotFound() {
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("section", {
        className: "bg-white",
        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
            className: "py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6",
            children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                className: "mx-auto max-w-screen-sm text-center",
                children: [
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("h1", {
                        className: "mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary dark:text-primary",
                        children: "404"
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                        className: "mb-4 text-3xl tracking-tight font-bold text-primary md:text-4xl",
                        children: "Something's missing."
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                        className: "mb-4 text-lg font-light text-gray-500 dark:text-gray-400",
                        children: "Sorry, we can't find that page. You'll find lots to explore on the home page. "
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("a", {
                        href: "/",
                        className: "inline-flex text-primary bg-primary-600 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4",
                        children: "Back to Homepage"
                    })
                ]
            })
        })
    });
}


/***/ }),

/***/ 73881:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var next_dist_lib_metadata_get_metadata_route__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(80085);
/* harmony import */ var next_dist_lib_metadata_get_metadata_route__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_lib_metadata_get_metadata_route__WEBPACK_IMPORTED_MODULE_0__);
  

  /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((props) => {
    const imageData = {"type":"image/x-icon","sizes":"any"}
    const imageUrl = (0,next_dist_lib_metadata_get_metadata_route__WEBPACK_IMPORTED_MODULE_0__.fillMetadataSegment)(".", props.params, "favicon.ico")

    return [{
      ...imageData,
      url: imageUrl + "",
    }]
  });

/***/ }),

/***/ 5023:
/***/ (() => {



/***/ })

};
;