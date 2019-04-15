import {
  parseInput,
  wrapInput,
  removeDoctype,
  removeAttrs,
  camelize,
  applyCompat,
} from './tools'

export const svgsonSync = function svgsonSync(
  input,
  { transformNode = node => node, compat = false, camelcase = false } = {}
) {
  const wrap = input => {
    const cleanInput = removeDoctype(input)
    return wrapInput(cleanInput)
  }

  const unwrap = res => {
    return res.name === 'root' ? res.children : res
  }

  const applyFilters = input => {
    const applyTransformNode = node => {
      const children = compat ? node.childs : node.children
      return node.name === 'root'
        ? children.map(applyTransformNode)
        : {
          ...transformNode(node),
          ...(children && children.length > 0
            ? {
              [compat ? 'childs' : 'children']: children.map(
                applyTransformNode
              ),
            }
            : {}),
        }
    }
    let n
    n = removeAttrs(input)
    if (compat) {
      n = applyCompat(n)
    }
    n = applyTransformNode(n)
    if (camelcase || compat) {
      n = camelize(n)
    }
    return n
  }

  return unwrap(applyFilters(parseInput(wrap(input))))
}

export default function svgson(...args) {
  return new Promise((resolve, reject) => {
    try {
      const res = svgsonSync(...args)
      resolve(res)
    } catch (e) {
      reject(e)
    }
  })
}
