$(function () {
    let URL = "http://localhost:8080/PerceptronLexicalAnalyzer1.0/process?method=ext&path=E%3a%5c%e7%a4%ba%e4%be%8b%e6%96%87%e6%a1%a3";
    let key_word_datas = readInfoFromDoc(URL); // 读取关键词信息

    let url="http://localhost:8080/convertToFileStream_war_exploded/Convert"; // 文档地址,此地址是一个servlet,返回的是文件流形式的pdf
    let content="李毅"; // 定位的段落
    // 创建文档列表
    createDocList(key_word_datas,url,content);

    //添加返回按钮
    let back_home = document.getElementById("backHome");
    back_home.addEventListener("click",backHome);





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
    /*
    *
    * @param:
    *  key_word_data:读取的关键词信息 type:Object
    *  url: 获取的pdf文件流形式的url ,type:String
    *  content:需要高亮的词  type:String
    *
    *
    * */
    function createDocList(key_word_datas,url,content) {
        let key_word_data = key_word_datas;
        let grid_container = document.getElementById("grid_container");
        let table = document.createElement("table");
        let thead = document.createElement("thead");
        let tbody = document.createElement("tbody");
        thead.innerHTML=`<th scope="col" title="President Number">#</th><th scope="col">文档列表</th>`;
        let count=1;
        for(doc in key_word_data){
            count++;
            let tr = document.createElement("tr");
            let keywords="";
            for(let i = 0 ;i<key_word_data[doc].keyword.length;i++){
                if(i==key_word_data[doc].keyword.length-1){
                    keywords+=key_word_data[doc].keyword[i].key;
                }else {
                    keywords+=key_word_data[doc].keyword[i].key+"、";
                }

            }
            tr.innerHTML = `<td><span style="font-weight: bold">${count}</span></td><td><span  class="doc_name"  style="font-weight: bold;">${doc}</span><br><br><span style="font-weight: bold">关键词：</span>${keywords}、</td>`;
            tbody.appendChild(tr);

        }
        table.appendChild(thead);
        table.appendChild(tbody);
        grid_container.appendChild(table);


        let doc_names = document.getElementsByClassName("doc_name");
        for(let i=0;i<doc_names.length;i++){
            doc_names[i].addEventListener("click",function (event) {
                // alert(event.currentTarget.innerText); // 获取当前文件名
                // 动态创建iframe,展示
                let iframe = document.createElement("iframe");
                iframe.style.width = "100%";
                iframe.style.height = "100%";
                iframe.src="./pdfjs-1.9.426-dist/web/viewer.html?pdf_url="+url+"&locationContent="+content;
                document.getElementById("pdfDoc_container").appendChild(iframe);

                document.getElementById("grid_container").style.display = "none";
                document.getElementById("pdf_view_container").style.display = "block";


                // 展示详细的key words
                for(doc in key_word_data){
                    if(event.currentTarget.innerText==doc){
                        // title for keywords
                        document.getElementById("keywords_title").innerHTML = `<span>关键词汇总</span>&nbsp;&nbsp;&nbsp;<span>数量：${key_word_data[doc].keyword.length}</span>
                        <div style="margin-right: 10px;float: right;line-height: 40px;font-size: 20px;color: white;" class="fa fa-plus" aria-hidden="true"></div>`;
                        let detail_keywords = document.getElementById("detail_keywords");
                        for(let i = 0;i<key_word_data[doc].keyword.length;i++){
                            console.log(key_word_data[doc].keyword);
                            let keyWord = key_word_data[doc].keyword[i].key;
                            let keyWord_button = document.createElement("button");
                            keyWord_button.classList.add("keyWord_button");// 添加类名
                            keyWord_button.innerText = keyWord;
                            detail_keywords.appendChild(keyWord_button);

                            keyWord_button.addEventListener("click",function () {
                                alert("确定要删除该关键词么");
                            })
                        }
                    }
                }

                //相关文档推荐
                // let relatedURL="";
                // let relatedDoc = readRealtedDoc(relatedURL);
                let relatedDoc;
                // 现在没有接口,先使用虚拟数据
                relatedDoc = [
                    "MA5800-X17 硬件安装指导 V1.0",
                    "接入网建设模式和场景 V1.0",
                    "超宽铜线解决方案-铜线接入架构与技术 V1.0",
                    "MSO接入解决方案 V1.0",
                    "什么是接入网 V1.0",
                    "FTTBC组网场景(EPON组网,无HGW,xDSL接入) 配置案例",
                    "SmartAX MA5800 V100R018C10 Virus Scan Report",
                    "(多媒体)VAN特性介绍 V1.0"
                ];
                for(let i = 0;i<relatedDoc.length;i++){
                    let div = document.createElement("div");
                    div.style.margin = "8px";
                    div.style.paddingLeft = "8px";
                    div.style.cursor = "pointer";
                    let pdf_icon = document.createElement("i");
                    pdf_icon.classList.add("fa");
                    pdf_icon.classList.add("fa-file-pdf-o");
                    pdf_icon.setAttribute("aria-hidden","true");
                    pdf_icon.style.color = "red";
                    // 文档名称
                    let span = document.createElement("span");
                    span.innerHTML = relatedDoc[i];
                    span.style.paddingLeft="8px";
                    div.appendChild(pdf_icon);
                    div.appendChild(span);
                    document.getElementById("related_document_list").appendChild(div);
                    div.addEventListener("click",function () {
                        alert("将展示此pdf");
                    })
                }
            })
        }
    }

    // 获取文档关键词数据
    function readInfoFromDoc(URL) {
        let key_word_data=null;
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
        if(key_word_data!=null){
            return key_word_data
        }else {
             alert("读取信息失败！")
        }
    }

    // 获取推荐文档列表
    function readRealtedDoc(URL) {
        let key_word_data=null;
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
        if(key_word_data!=null){
            return key_word_data
        }else {
            alert("读取信息失败！")
        }
    }

    //返回主页
    function backHome() {
        document.getElementById("grid_container").style.display = "block";
        document.getElementById("pdf_view_container").style.display = "none";
    }


});

