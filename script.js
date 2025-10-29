const player = {
    tokens: new Decimal(0),
    money: new Decimal(0),
    
    scamming: false,
    scamTimeouted: false,
    scamTimeout: 5000,
    ups: {
        _total: new Decimal(0),

        yield: new Decimal(0),
        speed: new Decimal(0),
        trans: new Decimal(0),
    }
}

function getOut() {
    addClass("getOutDiv", "hide");
    removeClass("mainDiv", "hide");
}

var scamTimeoutID;
function scam() {
    if (player.scamTimeouted) { return; }
    
    let speedUp = Decimal.pow(1.4, player.ups.speed);
    let timeout = Decimal.div(1e3, speedUp);
    
    if (timeout < 50) {
        timeout = 50;
        timeoutMult = gain.times(speedUp.div(20));
    }

    scamTimeoutID = setInterval(() => {
        if (!player.scamming) { player.scamming = true; }

        let gain = Decimal.pow(1.4, player.ups.yield);
        player.tokens = player.tokens.add(gain);

    }, timeout)
}

function scamFinish() {
    let transMult = Decimal.pow(1.4, player.ups.trans);
    let gain = player.tokens.div(20).pow(0.5).times(2).times(transMult);

    clearTimeout(scamTimeoutID);

    player.tokens = new Decimal(0);
    player.money = player.money.add(gain);
    player.scamTimeouted = true;
    setTimeout(() => { player.scamTimeouted = false; }, player.scamTimeout);
}

function upgradeBuy(property, amount) {
    let costMult;
    if (property != "trans") { costMult = 1.5; }
    else { costMult = 1.65; }

    while (amount == 0) {
        let cost = Decimal.pow(costMult, player.ups._total).times(3);
        if (player.money.gte(cost)) {
            player.money = player.money.sub(cost);
            player.ups[property] = player.ups[property].add(1);
            player.ups._total = player.ups._total.add(1);
        } else { return; }
    }

    for (let i=0; i<amount; i++) {
        let cost = Decimal.pow(costMult, player.ups._total).times(3);
        if (player.money.gte(cost)) {
            player.money = player.money.sub(cost);
            player.ups[property] = player.ups[property].add(1);
            player.ups._total = player.ups._total.add(1);
        } else { return; }
    }
}

setInterval(update, 1);
function update() {
    changeElement("yieldupamount", `Bought: ${player.ups.yield}`);
    changeElement("speedupamount", `Bought: ${player.ups.speed}`);
    changeElement("transupamount", `Bought: ${player.ups.trans}`);

    let costCheap = Decimal.pow(1.5, player.ups._total).times(3);
    let costLessCheap = Decimal.pow(1.65, player.ups._total).times(3);

    changeElement("yieldCost", `Cost: ${format(costCheap)} money`);
    changeElement("speedCost", `Cost: ${format(costCheap)} money`);
    changeElement("transCost", `Cost: ${format(costLessCheap)} money`);

    changeElement("amount", `You have ${format(player.tokens)} eugene tokens & ${format(player.money)} money`);
    changeElement("scam", `SCAM (Cooldown: ${player.scamTimeouted})`);
}