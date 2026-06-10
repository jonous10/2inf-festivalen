"use client";

import React from "react";

type Props = {
  foredragId: number | string;
  onSuccessRedirect?: string;
  variant?: "register" | "unregister";
  disabled?: boolean;
};

export function ForedragActionButton({
  foredragId,
  onSuccessRedirect = "/festival/elever",
  variant = "register",
  disabled = false,
}: Props) {
  const label = variant === "register" ? "Meld på" : "Meld av";

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    if (disabled) return;

    try {
      const res = await fetch(`/api/foredrag/${variant}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ foredrag_id: foredragId }),
      });
      const data = await res.json();
      if (data?.redirect) {
        window.location.href = data.redirect;
        return;
      }
      if (!res.ok) {
        alert(data?.error || "Noe gikk galt");
        return;
      }
      // fallback
      window.location.href = onSuccessRedirect;
    } catch (err) {
      console.error(err);
      alert("Feil ved kommunikasjon med serveren");
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-lg font-semibold transition-all ${
        variant === "register"
          ? "bg-blue-600 text-white hover:bg-blue-700"
          : "bg-red-600 text-white hover:bg-red-700"
      } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
    >
      {label}
    </button>
  );
}

export default ForedragActionButton;
