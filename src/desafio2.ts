enum Job {
    Engenheiro,
    Padeiro
}

type person = {
    name: string,
    age: number,
    profession: Job
}

let person1: person = {
    name: 'maria',
    age: 29,
    profession: Job.Engenheiro
};

let pessoa2: person = {
    name: 'roberto',
    age: 19,
    profession: Job.Padeiro
};

let person3: person = {
    name: 'laura',
    age: 32,
    profession: Job.Engenheiro
};

let person4: person = {
    name: "carlos",
    age: 19,
    profession: Job.Padeiro
}
