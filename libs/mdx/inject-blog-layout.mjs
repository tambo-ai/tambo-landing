import { visit } from 'unist-util-visit'

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

    // Transform the metadata export that Nextra created from YAML into getBlogPostMetadata(frontmatter)
    // so shared links get proper OG/twitter cards (title, description, image).
    const metadataExportIndex = tree.children.findIndex(
      (node) =>
        node.type === 'mdxjsEsm' &&
        node.data?.estree?.body?.[0]?.type === 'ExportNamedDeclaration' &&
        node.data.estree.body[0].declaration?.declarations?.[0]?.id?.name ===
          'metadata'
    )
    if (metadataExportIndex !== -1) {
      const metaNode = tree.children[metadataExportIndex]
      const exportDecl = metaNode.data.estree.body[0]
      const init = exportDecl.declaration.declarations[0].init
      // Wrap frontmatter object in getBlogPostMetadata(...)
      exportDecl.declaration.declarations[0].init = {
        type: 'CallExpression',
        callee: { type: 'Identifier', name: 'getBlogPostMetadata' },
        arguments: [init],
        optional: false,
      }
      // Prepend import for getBlogPostMetadata (must have data.estree for Nextra)
      tree.children.unshift({
        type: 'mdxjsEsm',
        data: {
          estree: {
            type: 'Program',
            sourceType: 'module',
            body: [
              {
                type: 'ImportDeclaration',
                specifiers: [
                  {
                    type: 'ImportSpecifier',
                    imported: { type: 'Identifier', name: 'getBlogPostMetadata' },
                    local: { type: 'Identifier', name: 'getBlogPostMetadata' },
                  },
                ],
                source: {
                  type: 'Literal',
                  value: '~/libs/blog/get-blog-post-metadata',
                },
              },
            ],
          },
        },
      })
    }

    // Inject the import statement at the beginning
    tree.children.unshift({
      type: 'mdxjsEsm',
      value:
        'import { BlogPostWithFrontmatter as BlogPost } from "~/components/blog/blog-post-wrapper";',
      data: {
        estree: {
          type: 'Program',
          sourceType: 'module',
          body: [
            {
              type: 'ImportDeclaration',
              specifiers: [
                {
                  type: 'ImportSpecifier',
                  imported: {
                    type: 'Identifier',
                    name: 'BlogPostWithFrontmatter',
                  },
                  local: { type: 'Identifier', name: 'BlogPost' },
                },
              ],
              source: {
                type: 'Literal',
                value: '~/components/blog/blog-post-wrapper',
              },
            },
          ],
        },
      },
    })

    // Inject the default export wrapper
    tree.children.push({
      type: 'mdxjsEsm',
      value: `export default function Layout(props) {
  return <BlogPost meta={typeof frontmatter === "undefined" ? {} : frontmatter}>{props.children}</BlogPost>;
}`,
      data: {
        estree: {
          type: 'Program',
          sourceType: 'module',
          body: [
            {
              type: 'ExportDefaultDeclaration',
              declaration: {
                type: 'FunctionDeclaration',
                id: { type: 'Identifier', name: 'Layout' },
                params: [{ type: 'Identifier', name: 'props' }],
                body: {
                  type: 'BlockStatement',
                  body: [
                    {
                      type: 'ReturnStatement',
                      argument: {
                        type: 'JSXElement',
                        openingElement: {
                          type: 'JSXOpeningElement',
                          name: { type: 'JSXIdentifier', name: 'BlogPost' },
                          attributes: [
                            {
                              type: 'JSXAttribute',
                              name: { type: 'JSXIdentifier', name: 'meta' },
                              value: {
                                type: 'JSXExpressionContainer',
                                expression: {
                                  type: 'Identifier',
                                  name: 'frontmatter',
                                },
                              },
                            },
                          ],
                          selfClosing: false,
                        },
                        closingElement: {
                          type: 'JSXClosingElement',
                          name: { type: 'JSXIdentifier', name: 'BlogPost' },
                        },
                        children: [
                          {
                            type: 'JSXExpressionContainer',
                            expression: {
                              type: 'MemberExpression',
                              object: { type: 'Identifier', name: 'props' },
                              property: {
                                type: 'Identifier',
                                name: 'children',
                              },
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            },
          ],
        },
      },
    })
  }
}
