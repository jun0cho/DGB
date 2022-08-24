var a = new Date('2022.08.27');

var b = new Date('2022.09.03');

var c = a.getTime() - b.getTime();

console.log(Math.abs(c / (1000*60*60*24))+1);