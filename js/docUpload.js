import $ from '../lib/lib-js/jquery-3.3.1.min.js'

let filePath = "temp"; // 这里的话需要分单个文件或者是所有文件的文件夹，到时页面会提供批量和单个
let URL = `http://localhost:8080/PerceptronLexicalAnalyzer/process?method=seg&patch=${filePath}`;

//这里如何使用promise
$.ajax({
    url:URL,
    type:'POST',
    dataType:'json',
    success:function (result) {
        console.log(result);
    },
    error:function (error) {
        alert(`上传文件失败,请重新上传:${error}`)
    },
    //timeout:3000,  这里可以选择设置时间限制
    async:true // true的话，则所有请求均为异步请求
});