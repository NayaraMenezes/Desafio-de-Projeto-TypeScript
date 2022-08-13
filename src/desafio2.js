"use strict";
var Job;
(function (Job) {
    Job[Job["Engenheiro"] = 0] = "Engenheiro";
    Job[Job["Padeiro"] = 1] = "Padeiro";
})(Job || (Job = {}));
let person1 = {
    name: 'maria',
    age: 29,
    profession: Job.Engenheiro
};
let pessoa2 = {
    name: 'roberto',
    age: 19,
    profession: Job.Padeiro
};
let person3 = {
    name: 'laura',
    age: 32,
    profession: Job.Engenheiro
};
let person4 = {
    name: "carlos",
    age: 19,
    profession: Job.Padeiro
};
