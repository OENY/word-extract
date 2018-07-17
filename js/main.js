$(function () {
    let URL = "http://localhost:8080/PerceptronLexicalAnalyzer1.0/process?method=ext&path=E%3a%5c%e7%a4%ba%e4%be%8b%e6%96%87%e6%a1%a3";
    let key_word_datas = readInfoFromDoc(URL); // 读取关键词信息

    let url="http://localhost:8080/convertToFileStream_war_exploded/Convert"; // 文档地址,此地址是一个servlet,返回的是文件流形式的pdf
    let content="李毅"; // 定位的段落
    // 创建文档列表
    createDocList(key_word_datas,url,content);

    addKeyWord();

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
                iframe.setAttribute("id","doc_iframe");
                iframe.style.height = "100%";
                iframe.src="./pdfjs-1.9.426-dist/web/viewer.html?pdf_url="+url+"&locationContent="+content;
                document.getElementById("pdfDoc_container").appendChild(iframe);

                document.getElementById("grid_container").style.display = "none";
                document.getElementById("pdf_view_container").style.display = "block";


                // 展示详细的key words
                for(doc in key_word_data){
                    if(event.currentTarget.innerText==doc){
                        // title for keywords
                        document.getElementsByClassName("key_words_count")[0].innerHTML =
                        `<span>关键词汇总</span>&nbsp;&nbsp;&nbsp;<span>数量：${key_word_data[doc].keyword.length}</span>`;
                        let detail_keywords = document.getElementById("detail_keywords_content");
                        for(let i = 0;i<key_word_data[doc].keyword.length;i++){
                            // console.log(key_word_data[doc].keyword);
                            let keyWord = key_word_data[doc].keyword[i].key;
                            let keyWord_button = document.createElement("div");
                            keyWord_button.classList.add("keyWord_button");// 添加类名
                            keyWord_button.innerText = keyWord;
                            detail_keywords.appendChild(keyWord_button);
                            // 给每个按钮添加close按钮
                            let close_button = document.createElement("span");
                            close_button.style.display = "none";
                            close_button.classList.add("close_keyWord_button");
                            close_button.classList.add("fa");
                            close_button.classList.add("fa-close");
                            keyWord_button.appendChild(close_button);

                            keyWord_button.onmouseover=function (event) { //该循环添加事件没有问题
                                // console.log(this.children[0]);
                                this.children[0].style.display="block";
                                event = event || window.event;
                                event.stopPropagation();
                            }
                            document.onmouseover =function () {
                                let close_buttons =document.getElementsByClassName("close_keyWord_button");
                                for(let i =0;i<close_buttons.length;i++){
                                    close_buttons[i].style.display = "none";
                                }
                            }
                        }

                        let close_buttons =document.getElementsByClassName("close_keyWord_button");
                        for(let i = 0;i<close_buttons.length;i++){
                            close_buttons[i].addEventListener("click",function () {
                                /*if(true){
                                    alert("删除成功");
                                }*/
                                // 应该时创建的弹窗有影响，否则不会不可以的
                                this.parentNode.style.display = "none";

                                //这里是否需要创建一个提示窗口，判断是否删除成功
                                // alert(this.parentNode.innerText);
                                 // commit_delete_word();
                                let delete_result=function commit_delete_word(url,keyword){
                                    //这里需要做一个ajax请求
                                    //需要通过url传入相应的参数，如：删除的词，和该文档路径+文档名
                                    /*$.ajax({
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
                                    });*/


                                    // return  delete_result

                                }

                                // true的话，说明是个alert框
                                 create_modal(true,"删除成功！",function () {
                                    this.parentNode.parentNode.parentNode.style.display = "none"; //这里时为了获得 modal_bc;
                                })
                                // 这里需要将上传结果，返回给后端

                                //如果上传修改成功，网页上也需要做相应的改变
                                // 如何判断ajax返回的结果

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

    //添加关键词到词库
    function addKeyWord() {
        let add_trigger_button = document.querySelector(".fa-plus");
        add_trigger_button.addEventListener("click",function () {


             // let pdfDoc_container = document.getElementById("pdfDoc_container");、
            let iframe = document.getElementById("doc_iframe");
            let x,y;
            iframe.contentWindow.onmousedown=function (event) {
                 x = event.pageX;
                 y = event.pageY;
             }
             iframe.contentWindow.onmouseup = function (event) {
                 let new_x = event.pageX;
                 let new_y = event.pageY;
                 if(x==new_x&&y==new_y){
                     //执行点击事件相应的操作
                 }else{
                     //执行选中的文字操作
                     let selected_word = getWord();
                     if(selected_word==""){ //
                         // 添加一个提示窗口
                         // alert("您没有选中需要添加的词");
                         create_modal(true,"您没有选中需要添加的词！",function () {
                             this.parentNode.parentNode.parentNode.style.display = "none"; //这里时为了获得 modal_bc;
                         })
                         return;
                     }
                     // 这里也可以对词的长度做一个限制，以防选中的文字过多
                     function add_commit(){ // 通过ajax将该关键词，添加到后台词库
                         // 返回一个请求结果，是否添加成功
                     }
                     alert(selected_word);
                     create_modal(false,`确定将关键词：<h3>${selected_word}</h3>添加到词库么`,function () {
                         add_commit();
                         // 想办法在 create_modal写一个返回结果
                         this.parentNode.parentNode.parentNode.style.display = "none"; //这里时为了获得 modal_bc;
                     })
                 }
             }

             // 添加一个提示窗口
             // alert("请在文档当中选择需要添加的词");
            create_modal(true,"请在文档当中选择需要添加的词",function () {
                this.parentNode.parentNode.parentNode.style.display = "none"; //这里时为了获得 modal_bc;
            })

        })

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

    //获取选中的文档内容
    function getWord() {
        let iframe = document.getElementById("doc_iframe");
        let selectedWord = iframe.contentWindow.getSelection();
        // let selectedWord = window.getSelection?window.getSelection():document.selection.createRange().text;
        return selectedWord
    }

    //创建alert弹窗或 confirm 弹窗
    /*
    * params:
    *       alert_or_confirm  type:true or false
    *       modal_content     type:String
    *       confirm_trigger_function  type:function
    *       注意：confirm_tirrger_function 里最后异步:必须关闭模态框
    *       因加上这段代码：
    *          this.parentNode.parentNode.parentNode.style.display = "none"; //这里时为了获得 modal_bc;
    *
    * */
    function create_modal(alert_or_confirm,modal_contents,confirm_trigger_function) {
        let modal_bg = document.createElement("div");
        let modal_container = document.createElement("div");

        let modal_title = document.createElement("div");
        let modal_content = document.createElement("div");
        let modal_footer = document.createElement("div");
        //设置id
        modal_bg.setAttribute("id","modal_bg");
        modal_container.setAttribute("id","modal_container");
        modal_title.setAttribute("id","modal_title");
        modal_content.setAttribute("id","modal_content");
        modal_footer.setAttribute("id","modal_footer");
        //设置样式
        modal_bg.style.cssText="z-index:5;" +
            "display:block;" +
            "background-color: rgba(0,0,0,0.4);" +
            "position:fixed;" +
            "top:0;" +
            "bottom:0;" +
            "right:0;" +
            "left:0;";
        modal_container.style.cssText="background-color:white;" +
            "width:500px;" +
            "height:300px;" +
            "margin:10% auto;";
        modal_title.style.cssText="color:white;" +
            "background-image: -webkit-linear-gradient(top, #0088cc, #0044cc);" +
            "width:100%;" +
            "height:50px;"+
            "line-height:50px;";
        modal_content.style.cssText="color:black;" +
            "text-align:center;" +
            "width:100%;" +
            "height:190px;" +
            "border-bottom:2px solid grey";
        modal_footer.style.cssText="padding:14px 15px 15px;" +
            "color:white;" +
            "width:100%;" +
            "height:60px;";


        modal_container.appendChild(modal_title);
        modal_container.appendChild(modal_content);
        modal_container.appendChild(modal_footer)
        modal_bg.appendChild(modal_container);
        //将整个模态框添加到body中
        document.body.appendChild(modal_bg);

        //给模态框添加相应的内容
        // modal_title.innerHTML="This is a modal title";
        modal_content.innerHTML = modal_contents;
        // modal_footer.innerHTML = "This is a modal footer";

        // 制作关闭按钮
        let close_button = document.createElement("span");
        close_button.innerHTML = "&times;";
        close_button.setAttribute("id","modal_close_button")
        close_button.style.cssText=" margin-right:8px;" +
            "line-height:50px;" +
            "color: white;" +
            "float: right;" +
            "font-size: 28px;" +
            "font-weight: bold;";
        // 这个close_button的效果切换不使用js
        // 改成使用 hover
        /*close_button.onmouseover=function(event){
            close_button.style.color = "black";
            event =event||window.event;
            event.stopPropagation();
        }*/
        // 这里的document函数对其他部分产生了影响，我暂时先取消
        // 以后考虑使用 hover，比较方便；写在css里即可
        /*document.onmouseover = function(){
            document.getElementById("modal_close_button").style.color = "#aaa";
        }*/
        close_button.addEventListener("click",function () {
            modal_bg.style.display = "none"
        })
        modal_title.appendChild(close_button);

        //制作确定按钮和取消按钮
        let confirm_button = document.createElement("div");
        let cancel_button  = document.createElement("div");
        confirm_button.style.cssText="border-radius:5px;" +
            "color:white;" +
            "text-align:center;" +
            "line-height:20px;" +
            "font-size:17px;" +
            "float:right;" +
            "background-image: -webkit-linear-gradient(top, #0088cc, #0044cc);" +
            "padding:5px;" +
            "margin-right:30px;";
        cancel_button.style.cssText="border-radius:5px;" +
            "color:white;" +
            "text-align:center;" +
            "line-height:20px;" +
            "font-size:17px;" +
            "float:right;" +
            "background-image: -webkit-linear-gradient(top, #0088cc, #0044cc);" +
            "padding:5px;" +
            "margin-right:30px;";
        confirm_button.innerHTML = "确定";
        cancel_button.innerHTML = "取消";
        if(alert_or_confirm){
            modal_footer.appendChild(confirm_button);
        }else {
            modal_footer.appendChild(confirm_button);
            modal_footer.appendChild(cancel_button);
        }

        //添加相应的事件
        cancel_button.addEventListener("click",function () {
            modal_bg.style.display = "none"
        });
        confirm_button.addEventListener("click",confirm_trigger_function);

    }

});

