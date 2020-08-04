(function () {
    var posts = document.getElementById("posts");
    function e(t, cls, att, cldf) {
        var el = document.createElement(t);
        el.className = cls;
        for (var n in att) {
            el.setAttribute(n, att[n]);
        }
        var cld = cldf ? cldf() : []
        for (var i = 0; i < cld.length; i++) {
            el.appendChild(cld[i]);
        }
        return el;
    }

    function t(txt) {
        return document.createTextNode(txt);
    }
    if (posts) {
        postsPromise().then(function (postsData) {
            posts.appendChild(
                e("div", "container", {}, function () {
                    return [e("div", "row", {}, function () {
                        var cat0 = []
                        for (var i = 0; i < postsData.length; i++) {
                            cat0.push(
                                e("div", "col-12 col-md-6", {}, function () {
                                    return [
                                        e("h4", "", {}, function () {
                                            return [
                                                t(postsData[i][0])
                                            ]
                                        }),
                                        e("ul", "", {}, function () {
                                            var cat1 = [];
                                            for (var j = 0; j < postsData[i][1].length; j++) {
                                                cat1.push(
                                                    e("li", "", {}, function () {
                                                        return [
                                                            e("a", "", { "href": baseUrl + postsData[i][1][j][1] }, function () {
                                                                return [
                                                                    t(postsData[i][1][j][0])
                                                                ]
                                                            })
                                                        ]
                                                    })
                                                )
                                            }
                                            return cat1;
                                        })
                                    ]
                                })
                            )
                        }
                        return cat0
                    })]
                })
            );
        });
    }
})()
