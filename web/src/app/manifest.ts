import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Rumbo — Transporte en Tiempo Real",
    short_name: "Rumbo",
    description: "Ubicación de buses en tiempo real para Costa Rica",
    start_url: "/pasajero",
    display: "standalone",
    background_color: "#f9f9fc",
    theme_color: "#6e00c7",
    orientation: "portrait",
    icons: [
      { src: "/favicon.ico", sizes: "any", type: "image/x-icon" },
    ],
    categories: ["navigation", "travel", "utilities"],
  };
}
