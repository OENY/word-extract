$(function () {
    let URL = "http://192.168.9.63:8089/PerceptronLexicalAnalyzer/process?method=ext&path=H%3a%5cWord_localtion%5c%e6%96%87%e6%a1%a3%5ctest";
    let key_word_data=null;
// 获取关键词
    $.ajax({
        url:URL,
        type:'post',
        dataType:'json',
        success:function (response) {
            key_word_data = response
            // console.log(response);
        },
        error:function (error) {
            // alert("获取数据失败")
        },
        async:false,
        timeout:100000,
    });
    console.log(key_word_data);
// 根据请求的数据动态创建表格
    /*
    * <table>
    *     <thead>
    *         <tr>
    *             <th></th>   // 几个th对应几个td
    *         </tr>
    *     </thead>
    *     <tbody>
    *         <tr>
    *             <td></td>
    *         </tr>
    *     </tbody>
    * </table>
    *
    *
    *
    * */

    let grid_container = document.getElementById("grid_container");
    let table = document.createElement("table");
    let thead = document.createElement("thead");
    let tbody = document.createElement("tbody");
    thead.innerHTML=`<th scope="col" title="President Number">#</th><th scope="col">文档列表</th>`;
    let count=1;
    for(doc in key_word_data){
        let tr = document.createElement("tr");
        let keywords = key_word_data[doc].keyword.replace(/[#]/g,"、");
        tr.innerHTML = `<td><span style="font-weight: bold">${count++}</span></td><td><span  class="doc_name"  style="font-weight: bold;">${doc}</span><br><br><span style="font-weight: bold">关键词：</span>${keywords}</td>`;
        tbody.appendChild(tr);

    }
    table.appendChild(thead);
    table.appendChild(tbody);
    grid_container.appendChild(table);


    let doc_names = document.getElementsByClassName("doc_name");
    for(let i=0;i<doc_names.length;i++){
        doc_names[i].addEventListener("click",function (event) {
             // alert(event.currentTarget.innerHTML);
            // 动态创建pdf
            let url="http://localhost:8080/Convert"; // 文档地址,此地址是一个servlet,返回的是文件流形式的pdf
            let content="综上所述，犯罪嫌疑人李毅、张昌以非法占有他人财物为目的"; // 定位的段落
            let iframe = document.createElement("iframe");
            iframe.style.width = "100%";
            iframe.style.height = "100%";
            iframe.src="./pdfjs-1.9.426-dist/web/viewer.html?pdf_url="+url+"&locationContent="+content;
            document.getElementById("pdfDoc_container").appendChild(iframe);

            document.getElementById("grid_container").style.display = "none";
            document.getElementById("pdfDoc_container").style.display = "block";

        })
    }



});

