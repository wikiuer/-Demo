/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 中国传统五色体系
        'cn-red': '#C8102E', // 赤
        'cn-yellow': '#F6BE00', // 黄
        'cn-cyan': '#0F68A0', // 青
        'cn-white': '#F7F7F7', // 白
        'cn-black': '#1D1D1F', // 黑
        // 衍生色
        'cn-red-light': '#E63946',
        'cn-yellow-light': '#FFD700',
        'cn-cyan-light': '#1D84B5',
        'cn-brown': '#8B4513', // 木色
        'cn-gold': '#D4AF37', // 金色
      },
      fontFamily: {
        cn: ['"Noto Serif SC"', '"SimSun"', 'serif'],
      },
    },
  },
  plugins: [],
}
