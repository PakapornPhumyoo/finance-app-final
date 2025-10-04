/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',        // ทุกไฟล์ใน app/
    './src/components/**/*.{js,ts,jsx,tsx}'  // ทุกไฟล์ใน components/
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
