"use strict";

// isAPI request validation function
function isAPI(req) {
    return req.originalUrl.indexOf('/apiv') === 0;
  }


// parseBoolena from string function
function parseBoolean (string) {
    var bool;
    switch ( string.toLowerCase() ) {
        case "true": return true;
        case "false": return false;
        default: return undefined;
    }
} 