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
    const rawPath = file.path ?? file.history?.[0] ?? ''
    const filePath = String(rawPath).replaceAll('\\', '/')
    if (!filePath.includes('/blog/posts/')) {
      return
    }

    // Check if the file already has a layout export (to avoid double-wrapping)
    // Use AST-based detection instead of string matching for robustness
    let hasBlogPostWrapperImport = false
    let hasDefaultExport = false
    let hasLayoutExport = false
    visit(tree, 'mdxjsEsm', (node) => {
      // Check the estree AST structure for export default declarations
      if (node.data?.estree?.body) {
        for (const statement of node.data.estree.body) {
          if (
            statement.type === 'ImportDeclaration' &&
            statement.source?.type === 'Literal' &&
            statement.source.value === '~/components/blog/blog-post-wrapper'
          ) {
            hasBlogPostWrapperImport = true
          }

          if (statement.type === 'ExportDefaultDeclaration') {
            hasDefaultExport = true

            if (
              statement.declaration?.type === 'FunctionDeclaration' &&
              statement.declaration.id?.type === 'Identifier' &&
              statement.declaration.id.name === 'Layout'
            ) {
              hasLayoutExport = true
            }

            if (
              statement.declaration?.type === 'Identifier' &&
              statement.declaration.name === 'Layout'
            ) {
              hasLayoutExport = true
            }
          }
        }
      }
    })

    // If the file already has a layout, don't inject
    if (hasBlogPostWrapperImport || hasLayoutExport) {
      return
    }

    if (hasDefaultExport) {
      return
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
  const meta =
    typeof frontmatter === 'object' && frontmatter ? frontmatter : {};
  return <BlogPost meta={meta}>{props.children}</BlogPost>;
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
                      type: 'VariableDeclaration',
                      kind: 'const',
                      declarations: [
                        {
                          type: 'VariableDeclarator',
                          id: { type: 'Identifier', name: 'meta' },
                          init: {
                            type: 'ConditionalExpression',
                            test: {
                              type: 'LogicalExpression',
                              operator: '&&',
                              left: {
                                type: 'BinaryExpression',
                                operator: '===',
                                left: {
                                  type: 'UnaryExpression',
                                  operator: 'typeof',
                                  prefix: true,
                                  argument: {
                                    type: 'Identifier',
                                    name: 'frontmatter',
                                  },
                                },
                                right: { type: 'Literal', value: 'object' },
                              },
                              right: {
                                type: 'Identifier',
                                name: 'frontmatter',
                              },
                            },
                            consequent: {
                              type: 'Identifier',
                              name: 'frontmatter',
                            },
                            alternate: {
                              type: 'ObjectExpression',
                              properties: [],
                            },
                          },
                        },
                      ],
                    },
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
                                  name: 'meta',
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
