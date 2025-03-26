import type { MarkdownEnv } from 'vitepress'

const scriptLangTsRE = /<\s*script[^>]*\blang=['"]ts['"][^>]*/
const scriptRE = /<\/script>/
const scriptSetupRE = /<\s*script[^>]*\bsetup\b[^>]*/
const scriptClientRE = /<\s*script[^>]*\bclient\b[^>]*/

export function injectImportStatement(
  env: MarkdownEnv,
  name: string | undefined,
  path: string,
) {
  const registerStatement = name
    ? `import ${name} from '${path}'`.trim()
    : `import '${path}'`.trim()
  if (!env.sfcBlocks)
    throw new Error('env.sfcBlocks is undefined')
  if (!env.sfcBlocks?.scripts)
    env.sfcBlocks.scripts = []
  for (const script of env.sfcBlocks.scripts) {
    if (script.content.includes(registerStatement))
      return
  }

  const tags = env.sfcBlocks.scripts

  const isUsingTS = tags.findIndex(tag => scriptLangTsRE.test(tag.content)) > -1

  const setupScriptIndex = tags?.findIndex((tag) => {
    return (
      scriptRE.test(tag.content)
      && scriptSetupRE.test(tag.content)
      && !scriptClientRE.test(tag.content)
    )
  })
  const isUsingSetup = setupScriptIndex > -1

  if (isUsingSetup) {
    const tagSrc = tags[setupScriptIndex]
    const content = tagSrc.content.replace(
      scriptRE,
      `${registerStatement}\n</script>`,
    )
    tags[setupScriptIndex].content = content
  }
  else {
    tags.unshift({
      content: `\n
      <script ${isUsingTS ? 'lang="ts"' : ''} setup>
        ${registerStatement}
      </script>`,
    } as any)
  }
}

export function injectScriptStatement(
  env: MarkdownEnv,
  code: string,
) {
  if (!env.sfcBlocks)
    throw new Error('env.sfcBlocks is undefined')

  if (!env.sfcBlocks?.scripts)
    env.sfcBlocks.scripts = []
  const tags = env.sfcBlocks.scripts

  const isUsingTS = tags.findIndex(tag => scriptLangTsRE.test(tag.content)) > -1

  const setupScriptIndex = tags?.findIndex((tag) => {
    return (
      scriptRE.test(tag.content)
      && scriptSetupRE.test(tag.content)
      && !scriptClientRE.test(tag.content)
    )
  })
  const isUsingSetup = setupScriptIndex > -1

  if (isUsingSetup) {
    const tagSrc = tags[setupScriptIndex]
    const content = tagSrc.content.replace(
      scriptRE,
      `${code}\n</script>`,
    )
    tags[setupScriptIndex].content = content
  }
  else {
    tags.unshift({
      content: `\n
    <script ${isUsingTS ? 'lang="ts"' : ''} setup>
      ${code}
    </script>`,
    } as any)
  }
}

export function injectIframeStatement(
  env: MarkdownEnv,
  name: string,
  path: string,
) {
  injectImportStatement(env, name, `${path}?raw`)
  injectScriptStatement(env, `
      const html${name}ref = ref()
      const isEnd${name} = ref(false)
      onMounted(async () => {
        await nextTick()
        const iframe = html${name}ref.value.querySelector('iframe');
        const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
        const styles = document.head.querySelectorAll('style');
        const styleLinks = document.head.querySelectorAll('link[as="style"]');
        const fontLinks = document.head.querySelectorAll('link[as="font"]');
        const styleString = Array.from(styles).map((style) => \`<style replace="true">\${style.innerText}</style>\`).join('\\n');
        const styleLinkString = Array.from(styleLinks).map((link) => link.outerHTML).join('\\n');
        const fontLinkString = Array.from(fontLinks).map((link) => link.outerHTML).join('\\n');
        iframeDocument.write(\`
          <!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              \${styleString}
              <style>
                body {
                  min-height: 0;
                }
              </style>
            </head>
            <body>
              \${${name}}
            </body>
          </html>
        \`)
        iframeDocument.close();
        function synchronous() {
          if (isEnd${name}.value) return;
          iframe.style.height = iframeDocument.body.scrollHeight + 'px';
          iframeDocument.documentElement.className = document.documentElement.className;
          requestAnimationFrame(synchronous);
        }
        synchronous();
      })
      onUnmounted(() => isEnd${name}.value = true)
    `.trim())
}
