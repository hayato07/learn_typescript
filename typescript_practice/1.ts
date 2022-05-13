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

// 2-1 ジェネリクス 

function myFilter<T>(arr: T[], predicate: (elm:T) => boolean) {
    const result = [];
    for (const elm of arr) {
      if (predicate(elm)) {
        result.push(elm);
      }
    }
    return result;
  }
  
  // 使用例
  const res = myFilter([1, 2, 3, 4, 5], num => num % 2 === 0);
  const res2 = myFilter(['foo', 'hoge', 'bar'], str => str.length >= 4);
  
  // エラー例
//   myFilter([1, 2, 3, 4, 5], str => str.length >= 4);

// 2-2 OK ユニオン型便利そう！！

type Speed = 'slow' | 'medium' | 'fast';

function getSpeed(speed: Speed): number {
  switch (speed) {
    case "slow":
      return 10;
    case "medium":
      return 50;
    case "fast":
      return 200;
  }
}

// 使用例
const slowSpeed = getSpeed("slow");
const mediumSpeed = getSpeed("medium");
const fastSpeed = getSpeed("fast");

// エラー例
// getSpeed("veryfast");

// 2-3 NOT GOOD 全然わからんかった

// 自分の回答
// declare var addEventListener:(s:string, func:object, bool:boolean?);

interface AddEventListnerOptionsObject {
    capture?: boolean;
    once?: boolean;
    passive?: boolean;
}

// declareはTypeScriptに特有の構文であり、関数や変数の型を中身なしに宣言できる構文です。
declare function addEventListener(
    type: string,
    handler: () => {},
    options?: boolean | AddEventListnerOptionsObject
)

// 使用例

addEventListener("foobar", () => {});
addEventListener("event", () => {}, true);
addEventListener("event2", () => {}, {});
addEventListener("event3", () => {}, {
  capture: true,
  once: false
});

// エラー例
// addEventListener("foobar", () => {}, "string");
// addEventListener("hoge", () => {}, {
//   capture: true,
//   once: false,
//   excess: true
// });

// 2-4 なんとなく理解が進んでいる<T>が結構便利な印象だけど、使いみちを考えてやらないといけないかも

function giveId<T>(obj:T): T & {id: string} {
    const id = "本当はランダムがいいけどここではただの文字列";
    return {
      ...obj,
      id
    };
  }
  
  // 使用例
  const obj1: {
    id: string;
    foo: number;
  } = giveId({ foo: 123 });
  const obj2: {
    id: string;
    num: number;
    hoge: boolean;
  } = giveId({
    num: 0,
    hoge: true
  });
  
  // エラー例
//   const obj3: {
//     id: string;
//     piyo: string;
//   } = giveId({
//     foo: "bar"
//   });
