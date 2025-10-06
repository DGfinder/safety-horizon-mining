export { auth as middleware } from '@/auth'

export const config = {
  matcher: ['/lms/:path*', '/api/attempts/:path*'],
}
