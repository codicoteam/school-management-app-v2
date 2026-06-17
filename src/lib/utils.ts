import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function openWhatsApp(phone: string, message: string = "") {
  const cleanPhone = phone.replace(/\D/g, "");
  const url = `https://wa.me/${cleanPhone}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
  window.open(url, "_blank");
}
