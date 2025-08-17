"use client";

import { Button } from "@repo/ui/button";
import axios from "axios";
import { ArrowRight, Check, Eye, EyeOff, PenTool } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BACKEND_URL } from "../config";
import { ArrowDoodle } from "../doodleIcons/ArrowDoodle";
import { WavyLinesDoodle } from "../doodleIcons/WavyLinesDoodle";
import { ScribbleDoodle } from "../doodleIcons/ScribbleDoodle";
import { ZigzagDoodle } from "../doodleIcons/ZigzagDoodle";

export function AuthPage({ isSignin }: { isSignin: boolean }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const response = await axios.post(
      `${BACKEND_URL}/${isSignin ? "signin" : "signup"}`,
      {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      }
    );
    if (response) {
      alert(JSON.stringify(response.data.message));
    }
    if (isSignin) {
      const token = response.data.token;
      localStorage.setItem("token", token);

      router.push("dashboard");
    } else {
      router.push("/signin");
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const passwordsMatch =
    formData.password &&
    formData.confirmPassword &&
    formData.password === formData.confirmPassword;

  return (
    <div className="min-h-screen bg-white font-inter flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-16 left-12 w-28 h-8 opacity-60 transform -rotate-12">
          <ArrowDoodle />
        </div>
        <div className="absolute top-24 right-16 w-36 h-24 opacity-50 transform rotate-12">
          <WavyLinesDoodle />
        </div>
        <div className="absolute bottom-32 left-8 w-20 h-16 opacity-60 transform -rotate-6">
          <ScribbleDoodle className="w-28" />
        </div>
        <div className="absolute top-1/2 right-8 w-12 h-32 opacity-50 transform rotate-6">
          <ZigzagDoodle />
        </div>
      </div>

      <div className="w-full max-w-md relative">
        <button
          className="mb-8 text-gray-600 hover:text-gray-900 transition-colors font-medium flex items-center gap-2"
          onClick={() => {
            router.back();
          }}
        >
          ← Back to home
        </button>

        <div className="bg-gray-50 border-2 border-gray-900 p-8 transform -rotate-1 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="bg-white border-2 border-gray-900 p-8 transform rotate-1">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 border-2 border-gray-900 rounded-full bg-green-100 flex items-center justify-center transform -rotate-3">
                  <PenTool size={24} />
                </div>
              </div>
              <h1 className="text-3xl font-caveat font-bold text-gray-900 mb-2">
                {isSignin ? "Welcome back!" : "Join Sketchflow!"}
              </h1>
              <p className="text-gray-600 font-light">
                {isSignin
                  ? "Sign in to continue sketching"
                  : "Create your account and start sketching"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isSignin && (
                <div>
                  <label
                    htmlFor="name"
                    className="block font-medium text-gray-700 mb-2 font-inter text-lg"
                  >
                    Full name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-900 focus:outline-none focus:ring-0 focus:border-green-500 transition-colors transform hover:translate-x-0.5 hover:translate-y-0.5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                    placeholder="Your awesome name"
                    required
                  />
                </div>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="block  font-medium text-gray-700 mb-2 font-inter text-lg"
                >
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-900 focus:outline-none focus:ring-0 focus:border-green-500 transition-colors transform hover:translate-x-0.5 hover:translate-y-0.5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block font-medium text-gray-700 mb-2 font-inter text-lg"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    className="w-full px-4 py-3 pr-12 border-2 border-gray-900 focus:outline-none focus:ring-0 focus:border-green-500 transition-colors transform hover:translate-x-0.5 hover:translate-y-0.5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block font-medium text-gray-700 mb-2 font-inter text-lg"
                >
                  Confirm password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                    className={`w-full px-4 py-3 pr-12 border-2 border-gray-900 focus:outline-none focus:ring-0 transition-colors transform hover:translate-x-0.5 hover:translate-y-0.5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${
                      formData.confirmPassword &&
                      (passwordsMatch
                        ? "focus:border-green-500"
                        : "focus:border-red-500")
                    }`}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                  {formData.confirmPassword && (
                    <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                      {passwordsMatch ? (
                        <Check size={20} className="text-green-500" />
                      ) : (
                        <span className="text-red-500 text-sm">✗</span>
                      )}
                    </div>
                  )}
                </div>
                {formData.confirmPassword && !passwordsMatch && (
                  <p className="text-red-500 text-sm mt-1 font-light">
                    Passwords do not match
                  </p>
                )}
              </div>

              <Button type="submit" isLoading={isLoading} className="w-full">
                {isSignin ? "Sign In" : "Create Account"}
              </Button>
            </form>

            <div className="my-8 flex items-center">
              <div className="flex-1 border-t-2 border-gray-300"></div>
              <span className="px-4 text-gray-500 font-caveat">or</span>
              <div className="flex-1 border-t-2 border-gray-300"></div>
            </div>

            <div className="text-center">
              <p className="text-gray-600 font-light">
                Already have an account?{" "}
                <Link href={`${isSignin ? "/signup" : "/signin"}`}>
                  <button className="text-blue-600 hover:text-blue-800 font-medium underline">
                    {`${isSignin ? "Sign Up" : "Sign In"} here`}
                  </button>
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <div className="inline-block bg-pink-100 border-2 border-gray-900 px-4 py-2 transform -rotate-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-sm font-caveat font-bold text-gray-900">
              Let's create something amazing! 🎨
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
