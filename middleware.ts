import auth from "next-auth/middleware";

export const middleware = auth;

export const config = {
  matcher: ["/dashboard/:path*", "/invoices/:path*", "/clients/:path*", "/timer/:path*"],
};
