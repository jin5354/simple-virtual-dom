"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const simp_html_parser_1 = require("simp-html-parser");
// 使用递归构建真实 DOM
function createDOM(node) {
    let $node;
    if (node instanceof simp_html_parser_1.ElementNode) {
        $node = document.createElement(node.tag);
        node.children.forEach(e => {
            $node.appendChild(createDOM(e));
        });
        node.attrs.forEach(attr => {
            $node.setAttribute(attr.name, attr.value);
        });
    }
    if (node instanceof simp_html_parser_1.TextNode) {
        $node = document.createTextNode(node.content);
    }
    if (node instanceof simp_html_parser_1.CommentNode) {
        $node = document.createComment(node.content);
    }
    return $node;
}
exports.createDOM = createDOM;
// 根据 virtual DOM 更新真实 DOM
// 新增了节点，使用 appendChild(createDOM)
// 移除了节点，使用 removeChild(old)
// 更换了节点，使用 replaceChild(createDOM, old)
// 对于 children，递归进去
function updateElement($parent, newNode, oldNode, index = 0) {
    if (!oldNode) {
        $parent.appendChild(createDOM(newNode));
    }
    else if (!newNode) {
        $parent.removeChild($parent.childNodes[index]);
    }
    else if (isChangedNode(newNode, oldNode)) {
        $parent.replaceChild(createDOM(newNode), $parent.childNodes[index]);
    }
    else if (newNode instanceof simp_html_parser_1.ElementNode) {
        let len1 = newNode.children.length;
        let len2 = oldNode.children.length;
        for (let i = 0; i < len1 || i < len2; i++) {
            updateElement($parent.childNodes[index], newNode.children[i], oldNode.children[i], i);
        }
    }
}
exports.updateElement = updateElement;
// 判断 node 是否相同
function isChangedNode(node1, node2) {
    if (node1.constructor.name !== node2.constructor.name) {
        return true;
    }
    else if (node1.constructor.name === 'ElementNode') {
        return node1.tag !== node2.tag;
    }
    else if (node1.constructor.name === 'TextNode' || node1.constructor.name === 'CommentNode') {
        return node1.content !== node2.content;
    }
    return false;
}
exports.isChangedNode = isChangedNode;
