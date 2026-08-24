export const env = {
  databaseUrl: process.env.DATABASE_URL,
  directUrl: process.env.DIRECT_URL,
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ""
};

export const integrationsReady = {
  prisma: Boolean(env.databaseUrl),
  migrations: Boolean(env.directUrl),
  supabaseProject: Boolean(env.supabaseUrl),
  cloudinary: Boolean(env.cloudinaryCloudName && env.cloudinaryApiKey && env.cloudinaryApiSecret)
};
