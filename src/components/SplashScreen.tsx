import { useEffect, useState } from "react";
import splashLogo from "@/assets/splash-logo.png";

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen = ({ onFinish }: SplashScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Después de 2.5s, inicia el fade-out
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isVisible) {
      // Espera a que termine la animación de fade-out (0.8s) antes de llamar onFinish
      const timer = setTimeout(() => {
        onFinish();
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onFinish]);

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-[hsl(var(--grun-primary-600))] transition-opacity duration-[800ms] ease-in-out ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <img
        src={splashLogo}
        alt="Grupo Grün Servicios Financieros"
        className="w-72 h-auto object-contain"
      />
    </div>
  );
};

export default SplashScreen;
