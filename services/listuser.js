const randomEmail = () => {
    var text = "";
    var ranNum = Math.floor(Math.random() * 899) + 100;
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 15; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text + "_" + ranNum + "@10stchualang.com";
}
const randomName = () => {
    return (Math.random().toString(36).substring(7));
}
const randomAge = () => {
    return (Math.floor((Math.random() * 80) + 1));
}
let ListUser = []
for (i = 0; i < 1000; i++) {
    let user = {};
    user.name = randomName();
    user.age = randomAge();
    user.email = randomEmail();
    user.password = null;
    ListUser.push(user);
}
console.log("random", ListUser);
module.exports = { randomEmail, randomName, randomAge };