/**
 * From TypeScriptの型演習
 * https://qiita.com/uhyo/items/e4f54ef3b87afdd65546
 */

// 1-1 OK
function isPositive1(num: number):boolean {
    return num >= 0;
}

// 使用例
isPositive1(3);

// エラー例
// isPositive('123');
// const numVar: number = isPositive(-5);

// 1-2 Good (typeとinterfaceの使い分けがいまいち)
type User = {
    name : string,
    age : number,
    private: boolean
};

// または
// interface User {
//     name: string;
//     age: number;
//     private: boolean;
// }

function showUserInfo(user: User) {
    // 省略
}

// 使用例
showUserInfo({
    name: 'John Smith',
    age: 16,
    private: false,
});

// エラー例
// showUserInfo({
//     name: 'Mary Sue',
//     private: false,
// });
// const usr: User = {
//     name: 'Gombe Nanashino',
//     age: 100,
// };


// 1-3 関数の型 NOT GOOD (知らなかった)

type IsPositiveFunc = (arg: number) => boolean;
const isPositive2: IsPositiveFunc = num => num >= 0;

// 使用例
isPositive2(5);

// エラー例
// isPositive2('foo');
// const res: number = isPositive2(123);


// 1-4 OK
// こちらでもOK
// function sumOfPos(arr: number[]):number {
function sumOfPos(arr: Array<number>):number {
    return arr.filter(num => num >= 0).reduce((acc, num) => acc + num, 0);
}
  
  // 使用例
  const sum: number = sumOfPos([1, 3, -2, 0]);
  
  // エラー例
//   sumOfPos(123, 456);
//   sumOfPos([123, "foobar"]);