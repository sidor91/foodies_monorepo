import { useId, useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-hot-toast";

import { register, refreshUser } from "../../../redux/auth/authOps";

import css from "./RegisterForm.module.css";

const initialValues = {
  name: "",
  email: "",
  password: "",
};

const FeedbackSchema = Yup.object().shape({
  name: Yup.string().min(3, "too short").max(100, "too long").required(),
  email: Yup.string().email("must be a valid email").required(),
  password: Yup.string().min(6, "must be at least 6 characters").required(),
});

const RegisterForm = ({ isRegister, onRegister, onLogin, onRegisterSuccess }) => {
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);

  const nameFieldId = useId();
  const emailFieldId = useId();
  const passwordFieldId = useId();

  useEffect(() => {
    if (!isRegister) {
      return;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onRegister();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isRegister, onRegister]);

  const handleSubmit = async (values, actions) => {
    try {
      await dispatch(register(values)).unwrap();
      await dispatch(refreshUser());

      actions.resetForm();
      onRegisterSuccess?.();
      onRegister();
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <div className={`${css.modal__overlay} ${isRegister ? css.is__open : ""}`}>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={FeedbackSchema}
      >
        {({ values, isSubmitting }) => (
          <Form className={css.modal}>
            <p className="uppercase text-[2.8rem] leading-[125%] tracking-[-0.02em] font-extrabold tablet:text-[3.2rem]">
              Sign Up
            </p>

            <button
              type="button"
              className="absolute top-[1.6rem] right-[1.6rem] text-accent text-[1.2rem] leading-[150%] 
              tracking-[-0.02em] tablet:top-8 tablet:right-8"
              onClick={onRegister}
              aria-label="Close Modal"
            >
              <svg className="w-[2.4rem] h-[2.4rem] fill-none stroke-accent">
                <use href="/icons.svg#icon-close" />
              </svg>
            </button>

            <div className="w-full flex flex-col gap-[1.4rem]">
              <div className="flex flex-col items-start w-full gap-[0.6rem]">
                <div className={`${css.field__box} ${values.name ? css.has__value : ""}`}>
                  <Field
                    className={css.form__field}
                    type="text"
                    name="name"
                    id={nameFieldId}
                    placeholder="Name*"
                    autoComplete="name"
                  />
                </div>
                <ErrorMessage
                  name="name"
                  component="span"
                  className="text-error text-[1.2rem] leading-[120%] tracking-[-0.02em] font-normal pl-[1.4rem]"
                />
              </div>

              <div className="flex flex-col items-start w-full gap-[0.6rem]">
                <div className={`${css.field__box} ${values.email ? css.has__value : ""}`}>
                  <Field
                    className={css.form__field}
                    type="email"
                    name="email"
                    id={emailFieldId}
                    placeholder="Email*"
                    autoComplete="email"
                  />
                </div>
                <ErrorMessage
                  name="email"
                  component="span"
                  className="text-error text-[1.2rem] leading-[120%] tracking-[-0.02em] font-normal pl-[1.4rem]"
                />
              </div>

              <div className="flex flex-col items-start w-full gap-[0.6rem]">
                <div className={`${css.field__box} ${values.password ? css.has__value : ""}`}>
                  <Field
                    className={css.form__field}
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id={passwordFieldId}
                    placeholder="Password*"
                    autoComplete="new-password"
                  />

                  <button
                    type="button"
                    className="absolute right-[1.4rem] top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    <svg className="w-[1.8rem] h-[1.8rem] fill-none stroke-text">
                      <use
                        href={showPassword ? "/icons.svg#icon-eye-on" : "/icons.svg#icon-eye-off"}
                      />
                    </svg>
                  </button>
                </div>
                <ErrorMessage
                  name="password"
                  component="span"
                  className="text-error text-[1.2rem] leading-[120%] tracking-[-0.02em] font-normal pl-[1.4rem]"
                />
              </div>
            </div>

            <div className="w-full flex flex-col gap-[1.6rem]">
              <button
                type="submit"
                disabled={
                  !values.name.trim() ||
                  !values.email.trim() ||
                  !values.password.trim() ||
                  isSubmitting
                }
                className="btn btn__primary w-full p-[1.4rem] tablet:pt-[1.6rem] tablet:pb-[1.6rem]"
                aria-label="Submit SignIn"
              >
                Create
              </button>
              <div className="flex items-center justify-center gap-[0.4rem]">
                <p className="text-secondary text-[1.2rem] leading-[150%] tracking-[-0.02em] font-medium">
                  I already have an account?
                </p>
                <button
                  type="button"
                  className="text-accent text-[1.2rem] leading-[150%] tracking-[-0.02em] hover:underline"
                  onClick={onLogin}
                  aria-label="Open SignIn"
                >
                  Sign in
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default RegisterForm;
