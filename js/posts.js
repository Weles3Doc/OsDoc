var postsPromise = (function() {
    var savedPromise;
    return function() {
        return savedPromise ||
            (savedPromise = new Promise(function(res) {
                var rq = new XMLHttpRequest();
                rq.open("GET", baseUrl + "/posts.json", true);
                rq.onreadystatechange = function(e) {
                    if (rq.readyState != XMLHttpRequest.DONE) return;
                    res(JSON.parse(rq.responseText))
                }
                rq.send();
            }));
    }
})()