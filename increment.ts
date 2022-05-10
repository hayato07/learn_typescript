// .tsファイル自体はnode.jsで実行できない。
// .tsから.jsにコンパイルする
// tsc increment.ts で、increment.jsが生成される
// あとは node increment.js で実行
function increment(num: number) {
    return num + 1;
}

console.log(increment(999));
// console.log(increment("999")); // errorが表示される