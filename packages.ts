import type { PackageDefinition } from "@/types/package";

export const packages: PackageDefinition[] = [
  {
    id: "template-basic",
    name: "Template",
    price: 15000,
    description: "Nama + foto",
    features: ["Nama", "Foto"],
    allowText: false,
    allowMusic: false,
    allowCustomTheme: false,
    allowCustomLayout: false
  },
  {
    id: "template-text",
    name: "Template + Teks",
    price: 25000,
    description: "Nama + foto + teks",
    features: ["Nama", "Foto", "Custom text"],
    allowText: true,
    allowMusic: false,
    allowCustomTheme: false,
    allowCustomLayout: false
  },
  {
    id: "template-music",
    name: "Template + Music",
    price: 25000,
    description: "Nama + foto + request music",
    features: ["Nama", "Foto", "Request music"],
    allowText: false,
    allowMusic: true,
    allowCustomTheme: false,
    allowCustomLayout: false
  },
  {
    id: "paket-murah",
    name: "Paket Murah",
    price: 30000,
    description: "Template + nama + foto + teks + request music",
    features: ["Nama", "Foto", "Custom text", "Request music"],
    allowText: true,
    allowMusic: true,
    allowCustomTheme: false,
    allowCustomLayout: false
  },
  {
    id: "paket-effort",
    name: "Paket Effort",
    price: 99000,
    description: "Customize tema, teks, music, dan experience",
    features: ["Semua fitur template", "Custom theme", "Custom copy", "Custom music", "Layout/interaction adjustment"],
    allowText: true,
    allowMusic: true,
    allowCustomTheme: true,
    allowCustomLayout: true
  }
];
