import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User, LockKeyhole, ArrowLeft } from "lucide-react";
import PasswordInput from "@/components/PasswordInput";
import grupoGrunLogo from "@/assets/grupo-grun-logo.png";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast("Corrige la contraseña o nombre de usuario", {
          icon: "❓",
          style: {
            background: "hsl(var(--grun-neutral-100))",
            color: "hsl(var(--grun-neutral-700))",
            border: "1px solid hsl(var(--grun-neutral-200))",
          },
        });
        return;
      }

      toast.success("Inicio de sesión exitoso");
      navigate("/dashboard");
    } catch (error: any) {
      toast("Corrige la contraseña o nombre de usuario", {
        icon: "❓",
        style: {
          background: "hsl(var(--grun-neutral-100))",
          color: "hsl(var(--grun-neutral-700))",
          border: "1px solid hsl(var(--grun-neutral-200))",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast("Por favor ingresa tu correo electrónico", {
        icon: "❓",
        style: {
          background: "hsl(var(--grun-neutral-100))",
          color: "hsl(var(--grun-neutral-700))",
          border: "1px solid hsl(var(--grun-neutral-200))",
        },
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast.success("Te hemos enviado un enlace para restablecer tu contraseña");
      setShowForgotPassword(false);
    } catch (error: any) {
      toast("Error al enviar el enlace", {
        icon: "❓",
        style: {
          background: "hsl(var(--grun-neutral-100))",
          color: "hsl(var(--grun-neutral-700))",
          border: "1px solid hsl(var(--grun-neutral-200))",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (showForgotPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 md:p-4">
        <div className="w-full max-w-[24rem] bg-white rounded-2xl shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_20px_40px_rgba(0,0,0,0.15),0_10px_20px_rgba(0,0,0,0.1),0_4px_8px_rgba(0,0,0,0.08)] border border-black/10 p-12 md:p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
          <div className="absolute -top-px left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-sm"></div>
          
          <div className="text-center mb-8">
            <img 
              src={grupoGrunLogo} 
              alt="Grupo Grün Servicios Financieros" 
              className="h-28 w-auto max-w-full mx-auto object-contain"
            />
          </div>

          <div className="mb-6 text-center">
            <h2 className="text-xl font-semibold text-[hsl(var(--grun-neutral-700))] mb-2">
              Olvidé mi contraseña
            </h2>
            <p className="text-sm text-[hsl(var(--grun-neutral-500))]">
              Ingresá tu e-mail y te enviaremos un link para cambiar tu contraseña.
            </p>
          </div>

          <form onSubmit={handleForgotPassword} className="space-y-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-[hsl(var(--grun-primary-600))]">
                <User className="w-4 h-4" />
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 px-4 text-base border-2 border-[hsl(var(--grun-neutral-200))] rounded-xl bg-[hsl(var(--grun-neutral-50))] transition-all focus:outline-none focus:border-[hsl(var(--grun-primary-600))] focus:shadow-[inset_0_2px_4px_rgba(0,0,0,0.06),0_0_0_3px_rgba(5,150,105,0.1),0_4px_6px_rgba(0,0,0,0.1)] focus:-translate-y-px placeholder:text-[hsl(var(--grun-neutral-400))]"
                disabled={isLoading}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-br from-[hsl(var(--grun-primary-600))] to-[hsl(var(--grun-primary-700))] text-white border-none rounded-xl text-base font-medium cursor-pointer shadow-[0_10px_15px_-3px_rgba(0,0,0,0.15),0_4px_6px_-2px_rgba(0,0,0,0.1)] transition-all hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.2),0_10px_10px_-5px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Procesando...
                </span>
              ) : (
                "Enviar enlace"
              )}
            </button>

            <button
              type="button"
              onClick={() => setShowForgotPassword(false)}
              className="w-full text-sm text-[hsl(var(--grun-neutral-500))] underline hover:text-[hsl(var(--grun-primary-600))] transition-colors inline-flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al inicio de sesión
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8 md:p-4">
      <div className="w-full max-w-[24rem] bg-white rounded-2xl shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_20px_40px_rgba(0,0,0,0.15),0_10px_20px_rgba(0,0,0,0.1),0_4px_8px_rgba(0,0,0,0.08)] border border-black/10 p-12 md:p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
        <div className="absolute -top-px left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-sm"></div>
        
        <div className="text-center mb-8">
          <img 
            src={grupoGrunLogo} 
            alt="Grupo Grün Servicios Financieros" 
            className="h-28 w-auto max-w-full mx-auto object-contain"
          />
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-[hsl(var(--grun-primary-600))]">
              <User className="w-4 h-4" />
              Usuario
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 px-4 text-base border-2 border-[hsl(var(--grun-neutral-200))] rounded-xl bg-[hsl(var(--grun-neutral-50))] transition-all focus:outline-none focus:border-[hsl(var(--grun-primary-600))] focus:shadow-[inset_0_2px_4px_rgba(0,0,0,0.06),0_0_0_3px_rgba(5,150,105,0.1),0_4px_6px_rgba(0,0,0,0.1)] focus:-translate-y-px placeholder:text-[hsl(var(--grun-neutral-400))]"
              placeholder="Administrador"
              disabled={isLoading}
              required
            />
          </div>

          <PasswordInput
            value={password}
            onChange={setPassword}
            disabled={isLoading}
            required
          />

          <div className="text-center -mt-2">
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-sm text-[hsl(var(--grun-neutral-500))] underline hover:text-[hsl(var(--grun-primary-600))] transition-colors inline-flex items-center gap-1.5"
            >
              <LockKeyhole className="w-4 h-4" />
              Olvidé mi contraseña
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-gradient-to-br from-[hsl(var(--grun-primary-600))] to-[hsl(var(--grun-primary-700))] text-white border-none rounded-xl text-base font-medium cursor-pointer shadow-[0_10px_15px_-3px_rgba(0,0,0,0.15),0_4px_6px_-2px_rgba(0,0,0,0.1)] transition-all hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.2),0_10px_10px_-5px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Ingresando...
              </span>
            ) : (
              "Ingresar"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
