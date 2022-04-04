module.exports = {
  reactStrictMode: true,
  server: process.env.NODE_ENV == "development" ? "http://localhost:3000" : "https://dat-191.vercel.app"
}