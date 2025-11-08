// src/components/Trie.js
export class TrieNode {
  constructor() {
    this.children = {};
    this.isEndOfWord = false;
  }
}

export class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  // ✅ Insert word into Trie
  _insert(word) {
    let node = this.root;
    for (let char of word) {
      if (!node.children[char]) {
        node.children[char] = new TrieNode();
      }
      node = node.children[char];
    }
    node.isEndOfWord = true;
  }

  // ✅ Search full word
  _searchWord(word) {
    let node = this.root;
    for (let char of word) {
      if (!node.children[char]) return false;
      node = node.children[char];
    }
    return node.isEndOfWord;
  }

  // ✅ Get suggestions based on prefix
  _getWordsWithPrefix(prefix) {
    let node = this.root;
    for (let char of prefix) {
      if (!node.children[char]) return [];
      node = node.children[char];
    }

    const results = [];
    this._collectWords(node, prefix, results);
    return results;
  }

  _collectWords(node, prefix, results) {
    if (node.isEndOfWord) results.push(prefix);
    for (let char in node.children) {
      this._collectWords(node.children[char], prefix + char, results);
    }
  }

  // ✅ Optional: check char-by-char existence
  _searchCharByChar(word) {
    let node = this.root;
    const result = [];
    for (let char of word) {
      if (node.children[char]) {
        node = node.children[char];
        result.push({ char, exists: true });
      } else {
        result.push({ char, exists: false });
      }
    }
    return result;
  }
}
