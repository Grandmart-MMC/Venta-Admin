"use client";
import React, { FC } from "react";
import { useRouter } from "next/navigation";

import { useForm, SubmitHandler } from "react-hook-form";
// import { zodResolver } from '@hookform/resolvers/zod';
// import * as z from 'zod';

import LoginIcon from "@/pages/login/icons/LoginIcon";
import MailIcon from "@/pages/login/icons/MailIcon";
import PasswordIcon from "@/pages/login/icons/PasswordIcon";
import Link from "next/link";
import LanguageSwitcher from "@/components/Switcher/LanguageSwitcher";
// import { useLogin } from '@/api/services/api';
import { LoginRequest } from "@/api/types/loginType";
import { useAuth } from "@/api/services/login";

interface LoginTranslations {
  title: string;
  heading: string;
  email: {
    label: string;
    placeholder: string;
  };
  password: {
    label: string;
    placeholder: string;
  };
  submit: string;
  success: string;
  error: string;
  email_required: string;
  email_invalid: string;
  password_required: string;
  password_invalid: string;
}

interface LoginPageProps {
  t: LoginTranslations;
}

const LoginPage: FC<LoginPageProps> = ({ t }) => {
  const { mutate, isPending } = useAuth();
  const router = useRouter();

  // const loginSchema = z.object({
  //   username: z.string()
  //     .min(1, t.email_required)
  //     .email(t.email_invalid),
  //   password: z.string()
  //     .min(1, t.password_required)
  //     .min(6, t.password_invalid || 'Password must be at least 6 characters')
  // });

  // type LoginFormData = z.infer<typeof loginSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>({
    // resolver: zodResolver(loginSchema)
  });

  const onSubmit: SubmitHandler<LoginRequest> = (data) => {
    mutate(data as LoginRequest, {
      onSuccess: () => {
        router.push("/statistics");
      },
    });
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      {/* Language Switcher */}
      <div className="flex items-center justify-end p-8">
        <LanguageSwitcher
          t={{ en: "English", ru: "Russian", az: "Azerbaijani" }}
        />
      </div>

      {/* Main Container */}
      <div className="container mx-auto flex flex-wrap items-center">
        {/* Left Side - Logo & Icon */}
        <div className="hidden w-full xl:block xl:w-1/2">
          <div className="px-26 py-17.5 text-center flex flex-col items-center justify-center">
            <Link
              className="mb-5.5 flex gap-4 items-center justify-center"
              href="/"
            >
              <h3 className="text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                {t?.title}
              </h3>
            </Link>
            <span className="mt-15 inline-block">
              <LoginIcon />
            </span>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
          <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
            <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
              {t?.heading}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Email Input */}
              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  {t?.email?.label}
                </label>
                <div className="relative">
                  <input
                    {...register("username")}
                    placeholder={t?.email?.placeholder}
                    className={`w-full rounded-lg border ${
                      errors.username ? "border-red-500" : "border-stroke"
                    } bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
                  />
                  <span className="absolute right-4 top-4">
                    <MailIcon />
                  </span>
                </div>
                {errors?.username && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors?.username?.message}
                  </p>
                )}
              </div>

              {/* Password Input */}
              <div className="mb-6">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  {t?.password?.label}
                </label>
                <div className="relative">
                  <input
                    type="password"
                    {...register("password")}
                    placeholder={t?.password.placeholder}
                    className={`w-full rounded-lg border ${
                      errors?.password ? "border-red-500" : "border-stroke"
                    } bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
                  />
                  <span className="absolute right-4 top-4">
                    <PasswordIcon />
                  </span>
                </div>
                {errors?.password && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors?.password?.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="mb-5">
                <button
                  type="submit"
                  disabled={isPending}
                  className={`w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90 ${
                    isPending ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isPending ? "Loading..." : t?.submit}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
