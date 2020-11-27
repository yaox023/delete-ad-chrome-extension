
function close_ele_by_selector(selector) {
    var ele = document.querySelector(selector);
    if (ele) {
        ele.style.display = "none";
    } else {
        // console.log("ele not exist: ", selector);
    }
}

function remove_ele_by_selector(selector) {
    var ele = document.querySelector(selector);
    if (ele) {
        ele.parentElement.removeChild(ele);
    }
}

function close_sogou_ad() {
    close_ele_by_selector(".top-nav");
    close_ele_by_selector(".user-box");
    close_ele_by_selector("#QRcode-footer");
    close_ele_by_selector(".top-bar");
    close_ele_by_selector("#right");
    close_ele_by_selector("#top_login");
    close_ele_by_selector("#s_footer");

    remove_ele_by_selector(".sponsored");
}

function close_baidu_ad() {
    close_ele_by_selector("#s_main");
    close_ele_by_selector("#s-top-left");
    close_ele_by_selector("#u1");
    close_ele_by_selector("#u");
    close_ele_by_selector("#content_right");
    close_ele_by_selector("#s-hotsearch-wrapper");
    close_ele_by_selector("#s_lm_wrap");
    close_ele_by_selector("#bottom_layer");
    close_ele_by_selector("#foot");
    close_ele_by_selector("#con-ar");

    let ele;
    for (let i = 1; i < 100; i++) {
        ele = document.querySelector(
            "#content_left > div:nth-child(" + i + ")"
        );
        if (ele !== null) {
            if (ele.innerText.match(/(广告|评价)$/) !== null) {
                ele.style.display = "none";
            }
        }
    }
}

function close_baidu_tieba_ad() {
    // 顶部按钮栏
    remove_ele_by_selector(".search_nav");
    remove_ele_by_selector(".j_search_nav");
    remove_ele_by_selector("#com_userbar");

    // 侧边栏  这个还是留着好看点
    // remove_ele_by_selector("#aside");

    // 去除内容广告，还是通过广告关键字
    var ul = document.getElementById("thread_list");
    if (ul) {
        Array.from(ul.children).forEach((li) => {
            ad_ele = li.querySelector(".label_text");
            if (ad_ele && ad_ele.innerText == "广告") {
                ul.removeChild(li);
            }
        });
    }
}

function close_baidu_zhidao_ad() {
    close_ele_by_selector(".aside");
    close_ele_by_selector("#userbar");
    close_ele_by_selector("#footer-help");
    close_ele_by_selector(".list-header");
}

function close_baidu_wenku_ad() {
    close_ele_by_selector(".zsj-topbar");
    close_ele_by_selector(".user-bar");
    close_ele_by_selector(".aside");
    close_ele_by_selector(".vip-card");
    close_ele_by_selector("#ft");

    var result = document.querySelector(".search-result");
    if (result) {
        Array.from(result.children).forEach((dl) => {
            if (dl.tagName == "DL") {
                ad_ele = dl.querySelector(".tag");
                if (ad_ele && ad_ele.innerText.search("广告") != -1) {
                    result.removeChild(dl);
                }
            }
        });
    }
}

function close_ad() {
    if (location.host.search("sogou") != -1) {
        close_sogou_ad();
        return;
    }

    if (location.host.search("tieba") != -1) {
        close_baidu_tieba_ad();
        return;
    }

    if (location.host.search("zhidao") != -1) {
        close_baidu_zhidao_ad();
        return;
    }
    if (location.host.search("wenku") != -1) {
        close_baidu_wenku_ad();
        return;
    }

    if (location.host.search("baidu") != -1) {
        close_baidu_ad();
    }
}

// 首次查询，获取状态，根据后端状态，决定是否查杀
chrome.runtime.sendMessage({}, function (response) {
    if (response.enabled) {
        close_ad();

        setInterval(() => {
            close_ad();
        }, 500);
    }
});

// 当收到后台状态变化的信息，刷新页面
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    sendResponse({ ok: "ok" });
    location.reload(true);
});
