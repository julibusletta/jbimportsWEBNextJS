'use client';

import { signIn } from "next-auth/react";
import { FaGoogle, FaFacebookF } from "react-icons/fa";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8" style={{ paddingTop: '100px' }}>
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight leading-tight">
            Registrate para poder continuar con tu compra!
          </h2>
          <p className="mt-4 text-[11px] text-gray-400 font-bold uppercase tracking-[0.2em]">
            Ingresá a tu cuenta para gestionar tus pedidos
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <button
            onClick={() => signIn("google", { callbackUrl: "/mi-cuenta" })}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all cursor-pointer"
          >
            <FaGoogle className="text-red-500 text-lg" />
            Continuar con Google
          </button>

          <button
            onClick={() => signIn("facebook", { callbackUrl: "/mi-cuenta" })}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-transparent rounded-xl shadow-sm bg-[#1877F2] text-sm font-bold text-white hover:bg-[#166fe5] transition-all cursor-pointer"
          >
            <FaFacebookF className="text-lg" />
            Continuar con Facebook
          </button>
        </div>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-400 uppercase tracking-widest text-[10px] font-bold">O también</span>
          </div>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Correo electrónico o usuario"
            id="email"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
          />
          <input
            type="password"
            placeholder="Contraseña"
            id="password"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
          />
          <button
            onClick={() => {
              const email = (document.getElementById('email') as HTMLInputElement).value;
              const password = (document.getElementById('password') as HTMLInputElement).value;
              signIn("credentials", { email, password, callbackUrl: "/mi-cuenta" });
            }}
            className="w-full py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-gray-900 hover:bg-black transition-all cursor-pointer"
          >
            Siguiente
          </button>
        </div>

        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            ¿No tenés cuenta?
            <Link href="/auth/register" className="ml-1 text-blue-600 font-bold hover:underline">
              Crear cuenta
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
