let data = 42;  //recognised as number type

// data = "42";

let a;

a = 42;
a = "d";    //as a in any type

let b: any

b = "b"
b = 2

let d: number | string

d = 3
d = "d"

interface ICar{
    color: string,
    model: string,
    topSpeed?: number
}

const Car1:ICar={
    color: 'blue',
    model: 'bmw'
}

const Car2:ICar={
    color: 'blue',
    model: 'bmw',
    topSpeed: 100
}

// const add = (x, y) => {
//     return x + y;
// }

const add = (x:any, y:any) => {
    return x + y;
}

const add1 = (x:number, y:number) => {
    return x + y;
}

const add2 = (x:number, y:number):number => {
    return x + y;
}

// const add3 = (x:number, y:number):number => {
//      x + y;
// }

const add4 = (x:number, y:number):void => {
    x + y;
}

const add5 = (x:number, y:number) => {
    x + y;
}

const add6 = (x:number, y:number):string => {
    return (x + y).toString();
}