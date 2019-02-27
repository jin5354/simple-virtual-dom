import parse from 'simp-html-parser'
import {updateElement} from '../src/index'

const $app = document.getElementById('app')

const template = `<ul class="list">
  <!-- test comment -->
  <li>item 1</li>
  <li>item 2</li>
</ul>`

const vdom = parse(template)[0]
console.log('vdom:', vdom)

updateElement($app, vdom)

const template2 = `<ul class="list" tag="new">
  <!-- test comment -->
  <li>item 1</li>
  <li>item 3</li>
</ul><p></p>`

const vdom2 = parse(template2)[0]
console.log('vdom2:', vdom2)

setTimeout(() => {
  updateElement($app, vdom2, vdom)
}, 5000)