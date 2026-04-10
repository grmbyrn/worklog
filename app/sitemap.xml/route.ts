import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? process.env.NEXTAUTH_URL ?? 'http://localhost:3000';
  const routes = ['/', '/clients', '/invoices', '/dashboard', '/login', '/timer'];
  const urls = routes
    .map((p) => `<url><loc>${baseUrl}${p}</loc><changefreq>weekly</changefreq></url>`)
    .join('');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;

  return new NextResponse(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
}