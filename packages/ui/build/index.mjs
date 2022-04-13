import fs from 'fs/promises'
import glob from 'glob'
import postcss from 'postcss'
import postcssImport from 'postcss-import';
import postcssNested from 'postcss-nested'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import postcssJs from 'postcss-js'

glob("src/style/**/*.css", { debug: true }, async (error, files) => {

  if (error) {
    console.error(error);
    process.exit(-1);
  }

  // remove old dist dir
  await fs.rm('dist', { recursive: true, force: true })

  // prepare dist dir
  await Promise.all([
    fs.mkdir('dist/css/theme', { recursive: true }),
    fs.mkdir('dist/jss/theme', { recursive: true })
  ])

  // transform postcss sources into css and jss
  const transformer = postcss([postcssImport, postcssNested, tailwindcss, autoprefixer])
  for (const file of files) {
    fs.open(file)
      .then(f => f.readFile())
      .then(b => transformer.process(b, { from: file }))
      .then(({ css, root }) => [css, postcssJs.objectify(root)])
      .then(([css, jss]) => {
        console.log(`processing ${file} ...`)
        fs.writeFile(file.replace(/(^src\/style)/, 'dist/css'), css)
        fs.writeFile(file.replace(/^src\/style\/(.*)\.css$/, (match, $1) => `dist/jss/${$1}.js`), `export default ${JSON.stringify(jss)}`)
      })
  }
})