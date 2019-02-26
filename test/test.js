import parse, {ElementNode, TextNode, CommentNode} from '../node_modules/simp-html-parser/dist/index.js'
import {createDOM, updateElement} from '../src/index'

const $app = document.getElementById('app')

const template = `<ul class="list">
  <!-- test comment -->
  <li>item 1</li>
  <li>item 2</li>
</ul>`

const vdom = parse(template)[0]
console.log('vdom:', vdom)

let realDom = createDOM(vdom)

$app.appendChild(realDom)

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