document.onreadystatechange = function() {
    if (document.readyState !== "complete") {
        document.querySelector("body").style.visibility = "hidden";
        document.querySelector("#loader").style.visibility = "visible";
        $('html, body').css({
            'overflow': 'hidden',
            'height': '100%'
        });
    } else {
        document.querySelector("#loader").style.display = "none";
        document.querySelector("body").style.visibility = "visible";
        $('html, body').css({
            'overflow': 'auto',
            'height': 'auto'
        });
    }
};