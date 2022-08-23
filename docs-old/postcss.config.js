module.exports = {
  // plugins: [
  //   require("postcss-import"),
  //   require("postcss-nested")({
  //     bubble: ["screen"],
  //   }),
  //   require("tailwindcss"),
  //   require("autoprefixer"),
  // ],
  plugins: {
    'postcss-import': {},
    'tailwindcss/nesting': {},
    'tailwindcss': {},
    'autoprefixer': {}
  }
};

