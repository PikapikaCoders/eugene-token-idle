/**
 * Change Element by ID
 */
function changeElement(id, context) {
    document.getElementById(id).innerHTML = context
}

/**
 * Get Element by ID
 */
function getElement(id) {
    return document.getElementById(id).innerHTML
}

/**
 * Add Class to Element
 */
function addClass(id, name) {
    document.getElementById(id).classList.add(name)
}

/**
 * Remove Class to Element
 */
function removeClass(id, name) {
    document.getElementById(id).classList.remove(name)
}

/**
 * Check if Element contains Class
 */
function checkClass(id, name) {
    document.getElementById(id).classList.contains(name)
}

/**
 * Format Decimal with EternalNotations
 */
function format(decimal) {
    if (decimal.gte(1e3) || decimal.lt(0.01)) {
        output = EternalNotations.Presets.Scientific.format(decimal)
    } else {
        if (decimal.toFixed(2) != decimal) output = decimal.toFixed(2)
        else output = decimal
    }
    return output
}

/**
 * Does a log using the ln(num)/ln(base) method. Never returns NaN.
 */
function lnLog(decimal, base) {
    return Decimal.ln(decimal).div(Decimal.ln(base))
}