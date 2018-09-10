/**
* @Author: fiyc
* @Date : 2018-09-10 13:34
* @FileName : render.js
* @Description : 
    - 模板渲染以及数据脚本
*/

function init() {
    let listDOM = document.getElementById('list');
    let searchInput = document.getElementById('search-input');
    let data = [
        {
            title: "百度",
            url: "http://www.baidu.com",
            date: ""
        },
        {
            title: "google",
            url: "http://www.google.com",
            date: ""
        },
        {
            title: "淘宝",
            url: "http://www.taobao.com",
            date: ""
        },
        {
            title: "京东",
            url: "http://www.jd.com",
            date: ""
        }
    ];


    let itemListTemplate = function (title, url, date) {
        let listItem = `<div class="list-item">
            <a class="list-link" href="${url}">${title} <span class="date"> ${date}</span></a>
        </div>`;

        return listItem;
    }

    let render = function(lists){
        let content = "";
        lists.forEach(item => {
           content += itemListTemplate(item.title, item.url, item.date); 
        });

        listDOM.innerHTML= content;
    }

    render(data);

    searchInput.addEventListener('keyup', function(){
        let searchValue = searchInput.value;
        if(!searchValue){
            render(data);
            return;
        }

        let searchMappings = [];
        data.forEach(item => {
            if(item.title.indexOf(searchValue) >= 0){
                searchMappings.push(item);
            }
        });

        // if(searchMappings.length === 0){
        //     searchMappings = data;
        // }

        render(searchMappings);
    });
}

init();
