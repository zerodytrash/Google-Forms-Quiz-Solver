// ==UserScript==
// @name         Google Forms Quiz Solver
// @namespace    https://zerody.one
// @version      0.2
// @description  This script tries to extract exact answer conditions from Google Forms and solve them
// @author       ZerodyOne (https://github.com/zerodytrash/)
// @match        https://docs.google.com/forms/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // skip form if already filled by url params
    if(location.href.indexOf("?entry.") > 0) return;

    var inputAreas = document.querySelectorAll("div[data-params]");
    var urlPrefillParams = new URLSearchParams();

    inputAreas.forEach((inputArea) => {
        try {

            var areaParams = inputArea.getAttribute("data-params");
            var decodedAreaParams = JSON.parse("[" + areaParams.substr(areaParams.indexOf("["), areaParams.length));
            var questionParams = decodedAreaParams[0][4][0];
            var questionEntryId = questionParams[0];
            var validationParams = questionParams[4];

            // if validation disabled
            if(validationParams.length === 0) return;

            var validationRule = validationParams[0];
            var valueToFill = null;

            // type: number && match: equal to
            if(validationRule[0] === 1 && validationRule[1] === 5) {
                valueToFill = validationRule[2][0];
            }

            // type: text && match: contains
            if(validationRule[0] === 2 && validationRule[1] === 100) {
                valueToFill = validationRule[2][0];
            }

            if(valueToFill !== null) urlPrefillParams.set("entry." + questionEntryId, valueToFill);

        } catch(ex) {
            console.error("Param decoding failed", ex, inputArea);
        }
    });

    if(Array.from(urlPrefillParams).length > 0) {
        if(confirm("Found " + Array.from(urlPrefillParams).length + " exact values in form validation. Prefill form?")) {
            location.search = urlPrefillParams;
        }
    }
})();
