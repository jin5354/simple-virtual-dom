import parse, {ElementNode, TextNode, CommentNode} from '../node_modules/simp-html-parser/dist/index.js'

const $app = document.getElementById('app')

const template = `<ul class="list">
  <!-- test comment -->
  <li>item 1</li>
  <li>item 2</li>
</ul>`

const vdom = parse(template)[0]
console.log('vdom:', vdom)

// 使用递归构建真实 DOM
function createDOM(node) {
  let $node
  if(node instanceof ElementNode) {
    $node = document.createElement(node.tag)
    node.children.forEach(e => {
      $node.appendChild(createDOM(e))
    })
    node.attrs.forEach(attr => {
      $node.setAttribute(attr.name, attr.value)
    })
  }
  if(node instanceof TextNode) {
    $node = document.createTextNode(node.content)
  }
  if(node instanceof CommentNode) {
    $node = document.createComment(node.content)
  }
  return $node
}

let realDom = createDOM(vdom)

$app.appendChild(realDom)

// 根据 virtual DOM 更新真实 DOM
// 新增了节点，使用 appendChild(createDOM)
// 移除了节点，使用 removeChild(old)
// 更换了节点，使用 replaceChild(createDOM, old)
// 对于 children，递归进去

function updateElement($parent, newNode, oldNode, index = 0) {
  if(!oldNode) {
    $parent.appendChild(createDOM(newNode))
  }else if(!newNode) {
    $parent.removeChild($parent.childNodes[index])
  }else if(isChanged(newNode, oldNode)) {
    $parent.replaceChild(createDOM(newNode), $parent.childNodes[index])
  }else if(newNode instanceof ElementNode) {
    let len1 = newNode.children.length
    let len2 = oldNode.children.length
    for(let i = 0; i < len1 || i < len2; i++) {
      updateElement($parent.childNodes[index], newNode.children[i], oldNode.children[i], i)
    }
  }
}

// 判断 node 是否相同
function isChanged(node1, node2) {
  if(node1.constructor.name !== node2.constructor.name) {
    return true
  }else if(node1.constructor.name === 'ElementNode') {
    return node1.tag !== node2.tag
  }else if(node1.constructor.name === 'TextNode' || node1.constructor.name === 'CommentNode') {
    return node1.content !== node2.content
  }
}



const template2 = `<ul class="list">
  <!-- test comment -->
  <li>item 1</li>
  <li>item 3</li>
</ul><p></p>`

const vdom2 = parse(template2)[0]
console.log('vdom2:', vdom2)

setTimeout(() => {
  updateElement($app, vdom2, vdom)
}, 5000)