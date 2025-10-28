const player = {
    tokens: new Decimal(0),
    money: new Decimal(0),
    
    scamming: true,
    ups: {
        _total: new Decimal(0),

        yield: new Decimal(0),
        speed: new Decimal(0),
        transFmla: new Decimal(0),
    }
}

function getOut() {
    addClass("getOutDiv", "hide");
    removeClass("mainDiv", "hide");
}

function scam() {
    if (!player.scamming) { return; }
    let gain = Decimal.pow(1.4, player.ups.yield);

    let speedUp = Decimal.pow(1.4, player.ups.speed);
    let timeout = Decimal.div(1e3, speedUp);

    if (timeout < 50) {
        timeout = 50;
        gain = gain.times(speedUp.div(20));
    }
    
    player.token = player.token.add(gain);
    setTimeout(scam, timeout);
}

function upgradeBuy(property) {
    let costMult;
    if (property != "transFmla") { costMult = 1.5; }
    else { costMult = 1.65; }

    let cost = Decimal.pow(costMult, player.ups._total).times(3);
    if (player.money.gte(cost)) {
        player.money = player.money.sub(cost);
        player.ups[property] = player.ups[property].add(1);
        player.ups._total = player.ups._total.add(1);
    } else {
        alert("Not enough money!");
    }
}

/*
Hi, I am a comment!
The foo and bar functions are only for reference.
*/

function foo() {
    console.log(`I am ran! You have ${format(player.tokens)} eugene tokens!!!`);
    return 0;
}

function bar(arg) {
    console.log(`Hey! I found this element for you: ${getElement("eugene")}!`);
    changeElement("eugene", arg);
    return 0;
}