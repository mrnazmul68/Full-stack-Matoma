import React, { useEffect, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useToast } from "./ToastProvider";

const viewContent = {
  register: {
    badge: "Sign Up",
    title: "Create your account",
    description: "Use your email and password to create a Matoma account.",
    submitLabel: "Send OTP",
  },
  verifyRegister: {
    badge: "Verify Email",
    title: "Enter your OTP",
    description:
      "We sent an OTP to your email. Enter it below within 2 minutes to complete your account creation.",
    submitLabel: "Complete Sign Up",
  },
  login: {
    badge: "Log In",
    title: "Welcome back",
    description: "Use your existing account details to continue to Matoma.",
    submitLabel: "Log In",
  },
  forgot: {
    badge: "Forgot Password",
    title: "Reset your password",
    description:
      "Enter your email and we will create a reset code for your account.",
    submitLabel: "Send Reset Code",
  },
  reset: {
    badge: "Reset Password",
    title: "Choose a new password",
    description:
      "Paste the reset code and set a new password for your account.",
    submitLabel: "Reset Password",
  },
};

const initialFormState = {
  fullName: "",
  email: "",
  password: "",
  rememberMe: true,
  registerCode: "",
  resetToken: "",
  newPassword: "",
  confirmPassword: "",
};

const PasswordField = ({
  value,
  onChange,
  placeholder,
  isVisible,
  onToggleVisibility,
}) => (
  <div className="relative">
    <input
      type={isVisible ? "text" : "password"}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required
      minLength={6}
      className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 pr-12 text-sm outline-none transition-colors duration-200 placeholder:text-slate-500 focus:border-[tomato]"
    />
    <button
      type="button"
      onClick={onToggleVisibility}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors duration-200 hover:text-[tomato]"
      aria-label={isVisible ? "Hide password" : "Show password"}
    >
      {isVisible ? <FiEyeOff size={18} /> : <FiEye size={18} />}
    </button>
  </div>
);

const AuthForm = ({
  initialMode = "register",
  onBack,
  onForgotPassword,
  onLogin,
  onRegister,
  onResetPassword,
  onVerifyRegistration,
}) => {
  const [mode, setMode] = useState(initialMode);
  const [formData, setFormData] = useState(initialFormState);
  const [feedback, setFeedback] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const toast = useToast();

  const content = viewContent[mode];

  useEffect(() => {
    setMode(initialMode);
    setFeedback(null);
    setShowPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  }, [initialMode]);

  const setView = (nextMode) => {
    setMode(nextMode);
    setFeedback(null);
    setShowPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  const handleChange = (field, value) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleResendVerificationCode = async () => {
    setFeedback(null);
    setIsSubmitting(true);

    try {
      const response = await onRegister(formData);
      const successMessage =
        response?.message ||
        "A new OTP has been sent to your email.";

      setFormData((current) => ({
        ...current,
        email: response?.email || current.email,
        registerCode: "",
      }));
      setFeedback({
        type: "success",
        message: successMessage,
      });
      toast.success(successMessage);
    } catch (error) {
      const errorFeedback = {
        type: "error",
        message: error.message || "Unable to resend the OTP.",
      };
      setFeedback(errorFeedback);
      toast.error(errorFeedback.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFeedback(null);

    if (mode === "reset" && formData.newPassword !== formData.confirmPassword) {
      const errorFeedback = {
        type: "error",
        message: "The new password and confirmation password do not match.",
      };
      setFeedback(errorFeedback);
      toast.error(errorFeedback.message);
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === "register") {
        const response = await onRegister(formData);
        const successMessage =
          response?.message ||
          "An OTP has been sent to your email.";

        setFormData((current) => ({
          ...current,
          email: response?.email || current.email,
          registerCode: "",
        }));
        setFeedback({
          type: "success",
          message: successMessage,
        });
        toast.success(successMessage);
        setMode("verifyRegister");
      } else if (mode === "verifyRegister") {
        await onVerifyRegistration({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword || formData.password,
          code: formData.registerCode,
          rememberMe: formData.rememberMe,
        });
      } else if (mode === "login") {
        await onLogin(formData);
      } else if (mode === "forgot") {
        const response = await onForgotPassword({ email: formData.email });
        const resetToken = response?.resetToken || "";

        setFormData((current) => ({
          ...current,
          resetToken,
          newPassword: "",
          confirmPassword: "",
        }));
        setFeedback({
          type: "success",
          message: resetToken
            ? `${response.message} The reset code has been filled in for you below.`
            : response.message,
        });
        toast.success(response.message);
        setShowNewPassword(false);
        setShowConfirmPassword(false);

        if (resetToken) {
          setMode("reset");
        }
      } else if (mode === "reset") {
        await onResetPassword({
          token: formData.resetToken,
          newPassword: formData.newPassword,
          rememberMe: formData.rememberMe,
        });
      }
    } catch (error) {
      const errorFeedback = {
        type: "error",
        message: error.message || "Something went wrong. Please try again.",
      };
      setFeedback(errorFeedback);
      toast.error(errorFeedback.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-10 text-white sm:py-14">
      <div className="mx-auto w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_16px_40px_rgba(255,99,71,0.18)] sm:p-8">
        <div className="mb-6 space-y-3 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[tomato]">
            {content.badge}
          </p>
          <h2 className="text-[clamp(1.75rem,5vw,2rem)] font-bold">{content.title}</h2>
          <p className="text-sm leading-7 text-slate-300">
            {content.description}
          </p>
          {mode === "verifyRegister" && (
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
              OTP sent to {formData.email}
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <>
              <input
                type="text"
                value={formData.fullName}
                onChange={(event) => handleChange("fullName", event.target.value)}
                placeholder="Full name"
                required
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition-colors duration-200 placeholder:text-slate-500 focus:border-[tomato]"
              />

              <input
                type="email"
                value={formData.email}
                onChange={(event) => handleChange("email", event.target.value)}
                placeholder="Email address"
                required
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition-colors duration-200 placeholder:text-slate-500 focus:border-[tomato]"
              />

              <PasswordField
                value={formData.password}
                onChange={(event) => handleChange("password", event.target.value)}
                placeholder="Password"
                isVisible={showPassword}
                onToggleVisibility={() => setShowPassword((current) => !current)}
              />
            </>
          )}

          {mode === "verifyRegister" && (
            <>
              <input
                type="email"
                value={formData.email}
                readOnly
                className="w-full cursor-not-allowed rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-slate-300 outline-none"
              />
              <input
                type="text"
                value={formData.registerCode}
                onChange={(event) => handleChange("registerCode", event.target.value)}
                placeholder="Enter OTP"
                required
                inputMode="numeric"
                autoComplete="one-time-code"
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition-colors duration-200 placeholder:text-slate-500 focus:border-[tomato]"
              />
            </>
          )}

          {mode !== "reset" && mode !== "register" && mode !== "verifyRegister" && (
            <input
              type="email"
              value={formData.email}
              onChange={(event) => handleChange("email", event.target.value)}
              placeholder="Email address"
              required
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition-colors duration-200 placeholder:text-slate-500 focus:border-[tomato]"
            />
          )}

          {(mode === "login") && (
            <PasswordField
              value={formData.password}
              onChange={(event) => handleChange("password", event.target.value)}
              placeholder="Password"
              isVisible={showPassword}
              onToggleVisibility={() => setShowPassword((current) => !current)}
            />
          )}

          {mode === "reset" && (
            <>
              <input
                type="text"
                value={formData.resetToken}
                onChange={(event) => handleChange("resetToken", event.target.value)}
                placeholder="Reset code"
                required
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition-colors duration-200 placeholder:text-slate-500 focus:border-[tomato]"
              />
              <PasswordField
                value={formData.newPassword}
                onChange={(event) => handleChange("newPassword", event.target.value)}
                placeholder="New password"
                isVisible={showNewPassword}
                onToggleVisibility={() => setShowNewPassword((current) => !current)}
              />
              <PasswordField
                value={formData.confirmPassword}
                onChange={(event) =>
                  handleChange("confirmPassword", event.target.value)
                }
                placeholder="Confirm new password"
                isVisible={showConfirmPassword}
                onToggleVisibility={() =>
                  setShowConfirmPassword((current) => !current)
                }
              />
            </>
          )}

          {(mode === "register" ||
            mode === "verifyRegister" ||
            mode === "login" ||
            mode === "reset") && (
            <div className="flex flex-col items-start justify-between gap-3 text-sm text-slate-300 sm:flex-row sm:items-center">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(event) =>
                    handleChange("rememberMe", event.target.checked)
                  }
                  className="accent-[tomato]"
                />
                Remember me
              </label>
              {mode === "login" && (
                <button
                  type="button"
                  onClick={() => setView("forgot")}
                  className="text-[tomato] transition-colors duration-200 hover:text-white"
                >
                  Forgot password?
                </button>
              )}
              {mode === "verifyRegister" && (
                <button
                  type="button"
                  onClick={handleResendVerificationCode}
                  disabled={isSubmitting}
                  className="text-[tomato] transition-colors duration-200 hover:text-white disabled:cursor-not-allowed disabled:opacity-70"
                >
                  Resend OTP
                </button>
              )}
            </div>
          )}

          {feedback && (
            <div
              className={`rounded-2xl border px-4 py-3 text-sm ${
                feedback.type === "error"
                  ? "border-red-500/40 bg-red-500/10 text-red-300"
                  : "border-green-500/40 bg-green-500/10 text-green-200"
              }`}
            >
              {feedback.message}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-[tomato] px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Please wait..." : content.submitLabel}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-slate-300">
          {mode === "register" && (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setView("login")}
                className="font-semibold text-[tomato] transition-colors duration-200 hover:text-white"
              >
                Log in here
              </button>
            </>
          )}
          {mode === "verifyRegister" && (
            <>
              Need to change your details?{" "}
              <button
                type="button"
                onClick={() => setView("register")}
                className="font-semibold text-[tomato] transition-colors duration-200 hover:text-white"
              >
                Go back to sign up
              </button>
            </>
          )}
          {mode === "login" && (
            <>
              Need a new account?{" "}
              <button
                type="button"
                onClick={() => setView("register")}
                className="font-semibold text-[tomato] transition-colors duration-200 hover:text-white"
              >
                Sign up here
              </button>
            </>
          )}
          {(mode === "forgot" || mode === "reset") && (
            <>
              Remembered your password?{" "}
              <button
                type="button"
                onClick={() => setView("login")}
                className="font-semibold text-[tomato] transition-colors duration-200 hover:text-white"
              >
                Go back to login
              </button>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={onBack}
          className="mt-4 w-full rounded-full border border-white/10 px-6 py-3 text-sm font-semibold text-slate-200 transition-colors duration-200 hover:border-[tomato] hover:text-[tomato]"
        >
          Back to Home
        </button>
      </div>
    </section>
  );
};

export default AuthForm;
