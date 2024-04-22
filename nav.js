"use strict";

var isMobile = function () {

    var user = window.navigator.userAgent;

    // https://deviceatlas.com/blog/list-of-user-agent-strings
    // https://developers.whatismybrowser.com/useragents/explore/operating_platform/ipad/

    var mobileMatches = [
        'Mobile',
        'Android',
        'iPhone',
        'Windows Phone',
        'iPad'
    ];

    for (var i = 0; i < mobileMatches.length; i++) {
        // Old and newer iPads
        if (user.includes(mobileMatches[i]) || navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) {
            window.location.href = "https://render-static-fs.onrender.com/study_guide_notes_2023.html";
            alert("This demo isn't optimized for mobile touch support! Please visit me on a desktop!")
            break;
        }
    }
}

isMobile();