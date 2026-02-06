import { Parser } from 'acorn'
import jsx from 'acorn-jsx'
import { visit } from 'unist-util-visit'

const AcornParser = Parser.extend(jsx())

function parseEsm(value) {
  return AcornParser.parse(value, {
    ecmaVersion: 'latest',
    sourceType: 'module',
  })
}

function getBlogSlugFromPath(filePath) {
  const slugMatch = filePath.match(/\/blog\/posts\/([^/]+)\//)
  if (!slugMatch) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        '[remarkInjectBlogLayout] Could not derive slug from',
        filePath
      )
    }
    return undefined
  }

  return slugMatch[1]
}

/**
 * A remark plugin that automatically injects blog post layout wrapper
 * into all MDX files under /blog/posts/.
 *
 * This plugin:
 * 1. Detects if a file is a blog post (based on file path)
 * 2. Checks if it already has a layout export (to avoid double-wrapping)
 * 3. Adds an import for BlogPostWithFrontmatter
 * 4. Wraps the MDX content in a default export Layout component
 * 5. Passes frontmatter data (exported by remark-mdx-frontmatter) to the layout
 *
 * This eliminates the need to manually add import/export statements
 * in each blog post MDX file.
 */
export function remarkInjectBlogLayout() {
  return (tree, file) => {
    // Only apply this plugin to blog post files
    // Normalize path separators for cross-platform compatibility
    const filePath = (file.history[0] ?? '').replaceAll('\\', '/')
    if (!filePath.includes('/blog/posts/')) {
      return
    }

    const slug = getBlogSlugFromPath(filePath)

    // Check if the file already has a layout export (to avoid double-wrapping)
    // Use AST-based detection instead of string matching for robustness
    let hasLayoutExport = false
    visit(tree, 'mdxjsEsm', (node) => {
      // Check the estree AST structure for export default declarations
      if (node.data?.estree?.body) {
        for (const statement of node.data.estree.body) {
          if (statement.type === 'ExportDefaultDeclaration') {
            hasLayoutExport = true
            break
          }
        }
      }
    })

    // If the file already has a layout, don't inject
    if (hasLayoutExport) {
      return
    }

    // Inject the import statement at the beginning
    const importValue =
      'import { BlogPostWithFrontmatter as BlogPost } from "~/components/blog/blog-post-wrapper";'
    tree.children.unshift({
      type: 'mdxjsEsm',
      value: importValue,
      data: {
        estree: parseEsm(importValue),
      },
    })

    const slugAttr = slug ? ` slug=${JSON.stringify(slug)}` : ''

    // Inject the default export wrapper
    const wrapperValue = `export default function Layout(props) {
  return <BlogPost${slugAttr} meta={typeof frontmatter === "undefined" ? {} : frontmatter}>{props.children}</BlogPost>;
}`
    tree.children.push({
      type: 'mdxjsEsm',
      value: wrapperValue,
      data: {
        estree: parseEsm(wrapperValue),
      },
    })
  }
}
