module.exports = {
  reactStrictMode: true,
  server: process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://dat-191.vercel.app",
  bucket: process.env.NODE_ENV === "development" ? "heqed_house_dev" : "heqed_house_prod"
}