/**
 * Security headers configuration and utilities for Ticha AI.
 * Implements defenses against XSS, clickjacking, MIME sniffing, and unauthorized frame embedding.
 */

export const securityHeaders = [
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(self), geolocation=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://apis.google.com https://accounts.google.com https://*.supabase.co https://cdn.jsdelivr.net",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: blob: https://i.ytimg.com https://*.ytimg.com https://*.googleusercontent.com https://*.supabase.co https://images.unsplash.com",
      "font-src 'self' data: https://fonts.gstatic.com",
      "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://accounts.google.com https://*.supabase.co",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://generativelanguage.googleapis.com https://api.groq.com https://api.elevenlabs.io wss://api.elevenlabs.io https://www.googleapis.com https://www.youtube.com",
      "media-src 'self' blob: data: https://*.supabase.co https://api.elevenlabs.io",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
    ].join("; "),
  },
];
