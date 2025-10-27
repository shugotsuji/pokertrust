/** @type {import('next').NextConfig} */
const nextConfig = {
  output: undefined, // ← 'export' が入っていたら削除 or undefined にする
  experimental: {
    turbo: {
      rules: {}, // Turbopackで問題起きないように初期化
    },
  },
};

module.exports = nextConfig;