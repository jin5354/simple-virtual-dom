import parse, {ElementNode, TextNode, CommentNode} from '../node_modules/simp-html-parser/dist/index.js'

const $app = document.getElementById('app')

const template = `<ul class="list">
  <!-- test comment -->
  <li>item 1</li>
  <li>item 2</li>
</ul><p></p>`

const vdom = parse(template)
console.log('vdom:', vdom)

// 使用递归构建真实 DOM
function render(nodes) {
  let result = document.createDocumentFragment()
  nodes.forEach(node => {
    if(node instanceof ElementNode) {
      let $node = document.createElement(node.tag)
      if(node.children.length) {
        $node.appendChild(render(node.children))
      }
      node.attrs.forEach(attr => {
        $node.setAttribute(attr.name, attr.value)
      })
      result.appendChild($node)
    }
    if(node instanceof TextNode) {
      let $node = document.createTextNode(node.content)
      result.appendChild($node)
    }
    if(node instanceof CommentNode) {
      let $node = document.createComment(node.content)
      result.appendChild($node)
    }
  })
  return result
}

let realDom = render(vdom)

$app.appendChild(realDom)

// 根据 virtual DOM 更新真实 DOM
// 新增了节点，使用 appendChild(createElement)
// 移除了节点，使用 removeChild(old)
// 更换了节点，使用 replaceChild(createElement, old)
// 对于 children，递归进去

function updateElement($parent, newNode, oldNode) {

}

