// ==UserScript==
// @name         YT Neuter - mute subscribe
// @namespace    yt-neuter
// @version      0.1.0
// @description  Remove contrasting colours in subscrube button
// @author       You
// @match        https://www.youtube.com/watch*
// @icon         https://www.youtube.com/favicon.ico
// @updateURL    https://raw.githubusercontent.com/mchangrh/yt-neuter/main/userscripts/mute-subscribe.user.js
// @downloadURL  https://raw.githubusercontent.com/mchangrh/yt-neuter/main/userscripts/mute-subscribe.user.js
// @grant        none
// ==/UserScript==

function replaceClass(selector, oldClass, newClass) {
    'use strict';
    const wfke = (selector, callback) => {
        var el = document.querySelector(selector);
        if (el) return callback();
        setTimeout(wfke, 100, selector, callback);
    }
    const addclass = () => {
        const nodes = document.querySelectorAll(selector);
        try {
            for (const node of nodes) {
                node.classList.remove(oldClass);
                node.classList.add(newClass);
            }
        } catch {}
    };
    wfke(selector, addclass)
}

replaceClass(".ytd-subscribe-button-renderer>button", "yt-spec-button-shape-next--filled", "yt-spec-button-shape-next--tonal")