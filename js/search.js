(function() {
    var sel = document.getElementById("search");
    var res = document.getElementById("search_result");
    if (sel && res) {
        var tid;
        function doSearch() {
            postsPromise().then(function(postsData) {
                if (tid != undefined) window.clearTimeout(tid);
                tid = window.setTimeout(function () {
                    res.classList.add("d-none");
                    var rxs = makeRXs(sel.value.trim())
                    var matches = [];
                    for (var i = 0; i < postsData.length; i++) {
                        var s0 = testRXs(rxs, postsData[i][0])
                        for (var j = 0; j < postsData[i][1].length; j++) {
                            var s1 = testRXs(rxs, postsData[i][1][j][0])
                            for (var k = 0; k < postsData[i][1][j][1].length; k++) {
                                var s2 = testRXs(rxs, postsData[i][1][j][1][k][0])
                                var score = s2.score * 2 + s1.score * 1.5 + s0.score;
                                if (!score) continue;
                                for (var m = 0; m < rxs.length; m++) {
                                    if (!s0.mtx[m] && !s1.mtx[m] && !s2.mtx[m]) {
                                        score = 0;
                                        break;
                                    }
                                }
                                if (!score) continue;
                                matches.push({
                                    score: score,
                                    sa: [s0, s1, s2],
                                    ta: [postsData[i][0], postsData[i][1][j][0], postsData[i][1][j][1][k][0]],
                                    u: postsData[i][1][j][1][k][1]
                                })
                            }
                        }
                    }
                    matches.sort(function (x, y) {
                        return y.sore - x.score || sc(x.ta[0], y.ta[0]) || sc(x.ta[1], y.ta[1]) || sc(x.ta[2], y.ta[2])
                    })
                    res.innerText = "";
                    if (!matches.length) return;
                    for (var m = 0; m < matches.length; m++) {
                        var del = document.createElement("div");
                        var ael = document.createElement("a");
                        ael.href = baseUrl + matches[m].u;
                        for (var i = 0; i < 3; i++) {
                            if (matches[m].ta[i] == undefined) continue;
                            var ptr = 0;
                            if (i) {
                                var sep = document.createElement("span")
                                sep.appendChild(document.createTextNode(" / "));
                                ael.appendChild(sep);
                            }
                            function mkSpan(end, c) {
                                if (end == undefined) end = matches[m].ta[i].length
                                if (ptr == end) return;
                                var sel = document.createElement("span")
                                sel.appendChild(document.createTextNode(matches[m].ta[i].substring(ptr, end)))
                                if (c) sel.className = c;
                                ael.appendChild(sel);
                                ptr = end;
                            }
                            for (var j = 0; j < matches[m].sa[i].poz.length; j++) {
                                mkSpan(matches[m].sa[i].poz[j][0])
                                mkSpan(matches[m].sa[i].poz[j][1], "doc-sel")
                            }
                            mkSpan()
                        }
                        del.appendChild(ael)
                        res.appendChild(del)
                    }
                    res.classList.remove("d-none");
                }, 500)                
            })
        }

        sel.addEventListener("input", doSearch)
        sel.disabled = false;
    }

    function sc(x1, x2) {
        x1 = x1.toUpperCase();
        x2 = x2.toUpperCase();
        return x1 > x2 ? 1 : x1 < x2 ? -1 : 0
    }

    function testRXs(rxs, inp) {
        var poz = [];
        var score = 0;
        var mtx = new Array(rxs.length)
        if (inp) {
            for (var i = 0; i < rxs.length; i++) {
                var rx = rxs[i];
                rx.lastIndex = 0;
                var match

                while ((match = rx.exec(inp)) !== null) {
                    mtx[i] = true;
                    var start = match.index
                    var end = start + match[0].length
                    for (var j = 0; j < poz.length; j++)
                        if (poz[j][0] >= start) break;
                    poz.splice(j, 0, [start, end])
                }
            }
            for (var i = 0; i < poz.length; i++) {
                while (i < poz.length - 1 && poz[i + 1][0] <= poz[i][1]) {
                    if (poz[i + 1][1] > poz[i][1]) poz[i][1] = poz[i + 1][1];
                    poz.splice(i + 1, 1);
                }
                score += poz[i][1] - poz[i][0];
            }
        }
        return {
            poz: poz,
            score: score,
            mtx: mtx
        }
    }

    function makeRXs(inp) {
        var pats = inp.split(" ");
        var rxs = []
        for (var i = 0; i < pats.length; i++) {
            try {
                var pat = pats[i].trim();
                if (!pat.length) continue;
                var rx = new RegExp(pat, "gi")
                rxs.push(rx);
            }
            catch (e) {
            }
        }
        return rxs;
    }
})()