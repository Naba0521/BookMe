module.exports = {
    theme: {
        extend: {
            keyframes: {
                shine: {
                    '0%': { 'background-position': '100%' },
                    '100%': { 'background-position': '-100%' },
                },
            },
            animation: {
                shine: 'shine 5s linear infinite',
            },
        },
    },
    plugins: [],
};
module.exports = {
    content: [
      "./app/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
      // өөрийн path-уудаа нэмээрэй
    ],
    plugins: [
      require('tailwind-scrollbar-hide'), // <-- энэ мөрийг нэм
    ],
  };