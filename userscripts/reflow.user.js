// ==UserScript==
// @name         YouTube Grid Reflow
// @namespace    yt-neuter
// @version      0.6.6
// @description  Force YouTube grid to fit more elements per row
// @author       michael mchang.name
// @match        https://www.youtube.com/*
// @icon         https://www.youtube.com/favicon.ico
// @updateURL    https://raw.githubusercontent.com/mchangrh/yt-neuter/main/userscripts/reflow.user.js
// @downloadURL  https://raw.githubusercontent.com/mchangrh/yt-neuter/main/userscripts/reflow.user.js
// @require      https://neuter.mchang.xyz/require/wfke.js
// @run-at       document-idle
// @grant        GM_addStyle
// ==/UserScript==

const vidPerRow = 6;
const scale = false;

const isVisible = (elem) => elem.offsetWidth > 0 || elem.offsetHeight > 0;

// run until key elements
function ruke(selector, callback, parent) {
    var el = parent.querySelector(selector);
    if (el && isVisible(el) && el.childElementCount >= 5) return;
    callback(parent);
    setTimeout(ruke, 700, selector, callback, parent);
}

// dispatch reflow event to fill in empty spaces
const trigger_reflow = (parent) => parent.dispatchEvent(new Event('yt-rich-grid-reflow'));

function reflow() {
    // select browse-results-renderer (to increase maxwidth)
    const browseResultsRenderer = document.querySelector('ytd-two-column-browse-results-renderer');
    if (!browseResultsRenderer) return;
    // force results to fit as many per row
    GM_addStyle(`ytd-two-column-browse-results-renderer:not([page-subtype="channels"]):not([page-subtype="subscriptions"]) {
        width: 100% !important;
        max-width: 100% !important;
    }`)
    // target rich grid renderer
    const grids = document.querySelectorAll('ytd-rich-grid-renderer');

    // calculate # of elements per row
    const width = browseResultsRenderer.clientWidth;
    const elemPerRow = scale ? Math.floor(width / 240) : vidPerRow; // scale if enabled, else use constant
    /*
    grid-item: 320-360px
    grid-mini-item: 240-320px
    grid-slim-item: 220px
    */
    // const slimPerRow = Math.floor(width / 220);

    for (const grid of grids) {
        if (!isVisible(grid)) continue;
        // set elements per row on element
        grid.style.setProperty('--ytd-rich-grid-items-per-row', elemPerRow);
        grid.elementsPerRow = elemPerRow
        /* disable rich grid post, slim and game since they scale properly
        grid.style.setProperty('--ytd-rich-grid-posts-per-row', postPerRow);
        grid.postsPerRow = postPerRow;
        grid.style.setProperty('--ytd-rich-grid-slim-items-per-row', slimPerRow);
        grid.slimItemsPerRow = slimPerRow;
        grid.style.setProperty('--ytd-rich-grid-game-cards-per-row', gamePerRow);
        grid.gameCardsPerRow = gamePerRow;
        */
        // trigger reflow on delay
        setTimeout(trigger_reflow, 700, grid);
        // trigger reflow with ruke
        ruke("#contents.ytd-rich-grid-row", trigger_reflow, grid);
    }
}

// add delay so that previous grid will disappear
const delayReflow = () => setTimeout(reflow, 50);

document.addEventListener('yt-navigate-finish', delayReflow);
document.addEventListener('yt-guide-toggle', delayReflow);
window.onresize = delayReflow; // trigger reflow on resize
// add key listener to manually trigger reflow
document.addEventListener('keydown', (e) => {
    if (e.key == 'r') {
        console.log("[yt-neuter] Manually triggering reflow");
        reflow();
    }
});
wfke('.ytd-app', reflow);
