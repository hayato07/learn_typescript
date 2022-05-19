/**
 * From TypeScriptの型演習
 * https://qiita.com/uhyo/items/e4f54ef3b87afdd65546
 */

// 1-1 OK
function isPositive1(num: number): boolean {
    return num >= 0;
}

// 使用例
isPositive1(3);

// エラー例
// isPositive('123');
// const numVar: number = isPositive(-5);

// 1-2 Good (typeとinterfaceの使い分けがいまいち)
type User = {
    name: string,
    age: number,
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
function sumOfPos(arr: Array<number>): number {
    return arr.filter(num => num >= 0).reduce((acc, num) => acc + num, 0);
}

// 使用例
const sum: number = sumOfPos([1, 3, -2, 0]);

// エラー例
//   sumOfPos(123, 456);
//   sumOfPos([123, "foobar"]);

// 2-1 ジェネリクス 

function myFilter<T>(arr: T[], predicate: (elm: T) => boolean) {
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

addEventListener("foobar", () => { });
addEventListener("event", () => { }, true);
addEventListener("event2", () => { }, {});
addEventListener("event3", () => { }, {
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

function giveId<T>(obj: T): T & { id: string } {
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


// 2-5
type UseStateUpdateArgument<T> = T | ((oldValue: T) => T);

declare function useState<T>(
    initialValue: T
): [T, (updateValue: UseStateUpdateArgument<T>) => void];

// 使用例
// number型のステートを宣言 (numStateはnumber型)
const [numState, setNumState] = useState(0);
// setNumStateは新しい値で呼び出せる
setNumState(3);
// setNumStateは古いステートを新しいステートに変換する関数を渡すこともできる
setNumState(state => state + 10);

// 型引数を明示することも可能
const [anotherState, setAnotherState] = useState<number | null>(null);
setAnotherState(100);

// エラー例
// 静的解析かしこ！！
// setNumState('foobar');

// 3-1 extends keyofもなかなか便利そう

// function mapFromArray<T, K extends keyof T>(arr: T[], key: K): Map<T[K], T> {
//     const result = new Map();
//     for (const obj of arr) {
//         result.set(obj[key], obj);
//     }

//     return result;
// }

// 使用例
// const data = [
//     { id: 1, name: "John Smith" },
//     { id: 2, name: "Mary Sue" },
//     { id: 100, name: "Taro Yamada" }
// ];
// const dataMap = mapFromArray(data, "id");
/*
dataMapは
Map {
  1 => { id: 1, name: 'John Smith' },
  2 => { id: 2, name: 'Mary Sue' },
  100 => { id: 100, name: 'Taro Yamada' }
}
というMapになる
*/

// エラー例
//   mapFromArray(data, "age");

// 3-2

type MyPartial<T> = {
    [K in keyof T]?: T[K]
};

// 使用例
/*
 * T1は { foo?: number; bar?: string; } となる
 */
type T1 = MyPartial<{
    foo: number;
    bar: string;
}>;
/*
 * T2は { hoge?: { piyo: number; } } となる
 */
type T2 = MyPartial<{
    hoge: {
        piyo: number;
    };
}>;

// 3-3

interface EventPayloads {
    start: {
        user: string;
    };
    stop: {
        user: string;
        after: number;
    };
    end: {};
}

class EventDischarger<E> {
    emit<Ev extends keyof E>(eventName: Ev, payload: E[Ev]) {
        // 省略
    }
}

// 使用例
const ed = new EventDischarger<EventPayloads>();
ed.emit("start", {
    user: "user1"
});
ed.emit("stop", {
    user: "user1",
    after: 3
});
ed.emit("end", {});

// エラー例
// ed.emit("start", {
//     user: "user2",
//     after: 0
// });
// ed.emit("stop", {
//     user: "user2"
// });
// ed.emit("foobar", {
//     foo: 123
// });

// 3-4

type Action =
    | {
        type: "increment";
        amount: number;
    }
    | {
        type: "decrement";
        amount: number;
    }
    | {
        type: "reset";
        value: number;
    };

const reducer = (state: number, action: Action) => {
    switch (action.type) {
        case "increment":
            return state + action.amount;
        case "decrement":
            return state - action.amount;
        case "reset":
            return action.value;
    }
};

// 使用例
reducer(100, {
    type: 'increment',
    amount: 10,
}) === 110;
reducer(100, {
    type: 'decrement',
    amount: 55,
}) === 45;
reducer(500, {
    type: 'reset',
    value: 0,
}) === 0;

// エラー例
//   reducer(0,{
//       type: 'increment',
//       value: 100,
//   });


// 3-5

// type Func<A, R> = (arg: A) => R;
type Func<A, R> = undefined extends A ? (arg?: A) => R : (arg: A) => R;


// 使用例
const f1: Func<number, number> = num => num + 10;
const v1: number = f1(10);

const f2: Func<undefined, number> = () => 0;
const v2: number = f2();
const v3: number = f2(undefined);

const f3: Func<number | undefined, number> = num => (num || 0) + 10;
const v4: number = f3(123);
const v5: number = f3();

// エラー例 なぜかうごく。。。
const v6: number = f1();


// 4-1
// extendsでobjectという制約をつける
// これが、 conditional type => T extends { foo: infer E }
// Tがfooプロパティを持つならば、そのプロパティの型をEとして取得する
function getFoo<T extends object>(
    obj: T
): T extends { foo: infer E } ? E : unknown {
    // return obj.foo;
    return (obj as any).foo;
}

// 使用例
// numはnumber型
const num = getFoo({
    foo: 123
});
// strはstring型
const str = getFoo({
    foo: "hoge",
    bar: 0
});
// unkはunknown型
const unk = getFoo({
    hoge: true
});

// エラー例
//   getFoo(123);
getFoo(null); // こっちはエラーにならない。。

// 4-2

function giveId2<T>(obj: T): Pick<T, Exclude<keyof T, "id">> & { id: string } {
    const id = "本当はランダムがいいけどここではただの文字列";
    return {
        ...obj,
        id
    };
}

// 使用例
/*
 * obj1の型は { foo: number; id: string } 型
 */
const obj1_2 = giveId2({ foo: 123 });
/*
 * obj2の型は { num : number; id: string } 型
 */
const obj2_2 = giveId2({
    num: 0,
    id: 100,
});
// obj2のidはstring型なので別の文字列を代入できる
obj2.id = '';

// 4-3 さっぱりわからん

interface EventPayloads {
    start: {
        user: string;
    };
    stop: {
        user: string;
        after: number;
    };
    end: {};
}

type Spread<Ev, EvOrig, E> = Ev extends keyof E
    ? EvOrig[] extends Ev[]
    ? E[Ev]
    : never
    : never;
class EventDischarger2<E> {
    emit<Ev extends keyof E>(eventName: Ev, payload: Spread<Ev, Ev, E>) {
        // 省略
    }
}

// 使用例
const ed2 = new EventDischarger2<EventPayloads>();
ed.emit("start", {
    user: "user1"
});
ed.emit("stop", {
    user: "user1",
    after: 3
});
ed.emit("end", {});

// エラー例
ed.emit<"start" | "stop">("stop", {
    user: "user1"
});

// 4-4 これは理解できた！

// 使用例

// 元のデータ
type PartiallyPartial<T, K extends keyof T> = Partial<Pick<T, K>> & Pick<T, Exclude<keyof T, K>>;

interface Data2 {
    foo: number;
    bar: string;
    baz: string;
}
/*
 * T1は { foo?: number; bar?: string; baz: string } 型
 */
type T12 = PartiallyPartial<Data2, "foo" | "bar">;


// 4-5 パズル感がでてきてる

type PartiallyPartial2<T, K extends keyof T> = Partial<Pick<T, K>> & Pick<T, Exclude<keyof T, K>>;

type AtLeastOne<T> = Spread2<T, keyof T>;
type Spread2<T, K extends keyof T> = K extends keyof T
    ? PartiallyPartial2<T, Exclude<keyof T, K>>
    : never;

// 使用例
interface Options {
    foo: number;
    bar: string;
    baz: boolean;
}
function test(options: AtLeastOne<Options>) {
    const { foo, bar, baz } = options;
    // 省略
}
test({
    foo: 123,
    bar: "bar"
});
test({
    baz: true
});

// エラー例
test({});


// 4-6

type Page =
    | {
        page: "top";
    }
    | {
        page: "mypage";
        userName: string;
    }
    | {
        page: "ranking";
        articles: string[];
    };

// 関数名までも型からもってこれるだと。。。
type PageGenerators = {
    [P in Page["page"]]: (page: Extract<Page, { page: P }>) => string
};

const pageGenerators: PageGenerators = {
    top: () => "<p>top page</p>",
    mypage: ({ userName }) => `<p>Hello, ${userName}!</p>`,
    ranking: ({ articles }) =>
        `<h1>ranking</h1>
         <ul>
        ${articles.map(name => `<li>${name}</li>`).join("")}</ul>`
};
const renderPage = (page: Page) => pageGenerators[page.page](page as any);

// 4-7 さっぱりわからなかった

type KeysOfType<Obj, Val> = {
    [K in keyof Obj]-?: Obj[K] extends Val ? K : never
}[keyof Obj];

// 使用例
type Data = {
    foo: string;
    bar: number;
    baz: boolean;

    hoge?: string;
    fuga: string;
    piyo?: number;
};

// "foo" | "fuga"
// ※ "hoge" は string | undefiendなので含まない
type StringKeys = KeysOfType<Data, string>;

function useNumber<Obj>(obj: Obj, key: KeysOfType<Obj, number>) {
    // ヒント: ここはanyを使わざるを得ない
    const num: number = (obj as any)[key];
    return num * 10;
}

declare const data: Data;

// これはOK
useNumber(data, "bar");
// これは型エラー
useNumber(data, "baz");

// 4-8
type PickUndefined<Obj> = {
    [K in keyof Obj]-?: undefined extends Obj[K] ? K : never
}[keyof Obj];

type MapToNever<Obj> = {
    [K in keyof Obj]: never
}

type OptionalKeys<Obj> = PickUndefined<MapToNever<Obj>>;

// 使用例
type Data4 = {
    foo: string;
    bar?: number;
    baz?: boolean;

    hoge: undefined;
    piyo?: undefined;
};

// "bar" | "baz" | "piyo"
type T = OptionalKeys<Data>;