export class TrieNode {
    constructor(){
        this.isEndOfWord = false
        this.children = new Array(26).fill(null)
    }
}