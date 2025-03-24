import { runAsWorker } from 'synckit'

let eslint
let promise

runAsWorker(async (code, lang = 'vue') => {
  try {
    const eslint = await importEslint()
    const [{ output }] = await eslint.lintText(code, {
      filePath: `index.${lang}`,
    })
    return encodeURIComponent(output)
  }
  catch {
    return encodeURIComponent(code)
  }
})

async function importEslint() {
  if (eslint)
    return eslint
  if (promise)
    return promise
  return promise = import('eslint')
    .then(({ ESLint }) => eslint = new ESLint({ fix: true }))
    .catch(() => null)
}

importEslint()
