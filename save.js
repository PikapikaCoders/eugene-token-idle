let utilsLoadInterval;
function utilsSave() {
    localStorage.setItem("eugeneTokenIdlePlayer", JSON.stringify(player));
}

const decimalArr = [
    "tokens", "money", "vel", "moneyTotal",
    "prestige", "prestigeTkn", "prestigeTknGain", "prestigeTknBest",
    "spirits", "essence",
]

const nestedDecimalArr = [
    ["ups", ["_total", "accel", "speed", "trans"]],
]

function utilsLoad(json) {
    setDefaultPlayer();

    if (json === null) { return; } 
    temp = JSON.parse(json);
    if (temp.autosave) { setInterval(utilsSave, 1000); }

    for (const str of decimalArr) { temp[str] = new Decimal(temp[str]) }

    for (const arr of nestedDecimalArr) {
        for (const str of arr[1]) { temp[arr[0]][str] = new Decimal(temp[arr[0]][str]) }
    }

    if (temp.autosave) { utilsLoadInterval = setInterval(utilsSave, 1000); }

    Object.assign(player, temp);

    if (player.scamming) { scam(true) }
}

function utilsAutosave() {
    player.autosave = !player.autosave;

    if (player.autosave) { utilsLoadInterval = setInterval(utilsSave, 1000); }
    else { clearInterval(utilsLoadInterval); }
}

function utilsDeleteSave() {
    const confirm = window.confirm("Are you sure you want to delete your save file?");
    if (!confirm) { return; }

    const confirm2 = window.confirm("Are you REALLY REALLY sure? THIS IS NOT A PRESTIGE!!!");
    if (!confirm2) { return; }

    if (player.autosave) { utilsAutosave(); }

    setDefaultPlayer();
    utilsSave();

    setTimeout(() => { window.location.reload(); }, 100);
}

function utilsExport() {
    prompt("Exported!", localStorage.getItem('eugeneTokenIdlePlayer'));
}

function utilsImport() {
    const json = window.prompt('Type in the exported string (in JSON format)');
    const confirm = window.confirm("Are you sure? It will replace your current save!");

    if (confirm) { utilsLoad(json) };
}

window.onload = () => { utilsLoad(localStorage.getItem("eugeneTokenIdlePlayer")); };