//baseUrl主路径是相对路径(html页面)
//paths配置主路径下的文件位置
require.config({
    urlArgs:"v=20200509",
    baseUrl: js_path,
    paths: {
        "jQuery": "jquery",
        "jqueryui": "jquery-ui.min",
        "formvalidator":"formvalidator_regex",
        "layer": "layer/layer",
        "kind_editor": "kindeditor/kindeditor",
        "birthday":"birthday",
        "distpicker_data":"distpicker.data",
        "plupload":"plupload/lib/plupload.full.min",
        "HQUpload":"plupload/common",
        "jedate":"jedate/jedate.min",
        "webuploader":"webuploader/webuploader.min",
        "PICSUpload":"webuploader/upload_pictures",
        "tmpl":"jquery-tmpl/dist/jquery.tmpl.min",
        "gallery":"jquery.ad-gallery",
        "media":"jquery.media",
        "clicaptcha":"clicaptcha"
    },
    shim: {
        "formvalidator": ["jquery","formvalidator_core"],
        "formvalidator_core": ["jquery"],
        "layer": ["css!https://oss.hqgq.com/statics/js/layer/skin/default/layer.css"],
        "kind_editor": ["css!https://oss.hqgq.com/statics/js/kindeditor/themes/default/default.css"],
        "birthday":["jquery"],
        "distpicker":["jquery","distpicker_data"],
        "distpicker_data":["jquery"],
        "HQUpload":["css!https://oss.hqgq.com/statics/js/plupload/plupload.css"],
        "jedate":["css!"+js_path+"jedate/skin/jedate.css"],
        "PICSUpload":["webuploader","css!https://oss.hqgq.com/statics/js/webuploader/webuploader.css"],
        "tmpl" : ["jquery"],
        "gallery" : ["jquery"],
        "wordLimit":["jquery"],
        "clickMore":["jquery","tmpl"],
        "media":["jquery"],
        "clicaptcha":["jquery","css!"+css_path+"captcha.css"]
    },
    map: {
        '*':{
            'css': 'require-css/css.min'
        }
    },
    waitSeconds: 0
});

var common;
var t;
require(["jquery", "layer"], function ($,layer) {
    var isfollowStatus=true;
    var isLikeStatus=true;
    var isPuLikeStatus=true;
    var isCollectStatus=true;
    return common = {
        /*弹框登录*/
        loginPop:function(){
            layer.open({
                type: 2,
                title: '用户登录/注册',
                skin: 'layui-layer-rim',
                area: ["800px", "575px"],
                shadeClose: true,
                scrollbar:false,
                content: "/index.php?m=member&c=login&a=login_pop"
            });
        },
        /*检查是否登录*/
        check_login: function (callback, id) {
            $.post("/index.php?m=member&c=ajax&a=is_login", function (data) {
                if (data.error == 1) {
                    layer.open({
                        type: 2,
                        title: '用户登录',
                        skin: 'layui-layer-rim',
                        area: ["800px", "575px"],
                        shadeClose: true,
                        scrollbar:false,
                        content: "/index.php?m=member&c=login&a=login_pop",
                        success: function (layero) {
                            var box = $(".popup-login", layero.find("iframe")[0].contentWindow.document);
                            box.attr("id", id)
                        }
                    });
                    isfollowStatus = true;
                    isLikeStatus = true;
                    isPuLikeStatus = true;
                    isCollectStatus = true;
                } else {
                    callback()
                }
            }, "json");
        },
        /*页面初始化时判断是否登录*/
        check_login_Slience: function (callback, id) {
            $.post("/index.php?m=member&c=ajax&a=is_login", function (data) {
                if (data.error == 0) {
                    callback()
                }
            }, "json");
        },
        /*页面初始化时判断是否喜欢单曲，单谱*/
        checkLike:function(modelid,id,str){
            this.check_login_Slience(function(){
                $.ajax({
                    url:"/member/favorite/check.json",
                    type:"get",
                    data:{"modelid":modelid,"id":id},
                    success:function(data){
                        var ids=id.split(",");
                        for(var i=0;i<data.length;i++) {
                            if (data[i] == '0') {
                                $(".btn-like" + ids[i]).find(".icon-love").removeClass("active");
                                $(".btn-like" + ids[i]).removeClass("liked").attr("data-type", "add");
                            } else {
                                if (str) {
                                    $(".btn-like" + ids[i]).find("span").html(str)
                                }
                                $(".btn-like" + ids[i]).find(".icon-love").addClass("active");
                                $(".btn-like" + ids[i]).addClass("liked").attr("data-type", "cancel");
                            }
                        }
                    }
                })

            })
        },
        /*页面初始化时判断是否收藏，订阅，喜欢曲单，谱集*/
        checkCollect:function(modelid,id,str){
            this.check_login_Slience(function(){
                $.ajax({
                    url:"/member/favorite/check.json",
                    type:"get",
                    data:{"modelid":modelid,"id":id},
                    success:function(data){
                        var ids=id.split(",");
                        for(var i=0;i<data.length;i++) {
                            if (data[i] == '0') {
                                if (str == '喜欢') {
                                    $(".collect" + ids[i]).find(".icon-love").removeClass("active");
                                    $(".collect" + ids[i]).removeClass("liked");
                                } else if (str == '收藏') {
                                    $(".collect" + ids[i]).find(".icon-23").removeClass("active");
                                    $(".collect" + ids[i]).find("span").text("收藏");
                                    $(".collect" + ids[i]).removeClass("collected");
                                } else {
                                    $(".collect" + ids[i]).removeClass("dis").find(".subscribe_txt").html("+订阅");
                                }
                                $(".collect" + ids[i]).attr("data-type", "add")
                            } else {
                                if (str == '喜欢') {
                                    $(".collect" + ids[i]).find(".icon-love").addClass("active");
                                    $(".collect" + ids[i]).addClass("liked");
                                } else if (str == '收藏') {
                                    $(".collect" + ids[i]).find(".icon-23").addClass("active");
                                    $(".collect" + ids[i]).find("span").text("已收藏");
                                    $(".collect" + ids[i]).addClass("collected");
                                } else {
                                    $(".collect" + ids[i]).addClass("dis").find(".subscribe_txt").html("已订阅")
                                }
                                $(".collect" + ids[i]).attr("data-type", "cancel")
                            }
                        }
                    }
                })

            })
        },
        /*页面初始化时判断是否关注*/
        checkFollow:function(id){
            this.check_login_Slience(function(){
                $.ajax({
                    url:"/member/follow/check.json",
                    type:"get",
                    data:{"followid":id},
                    success:function(data){
                        var ids=id.split(",");
                        for(var i=0;i<data.length;i++) {
                            if (data[i] == 1) {
                                $(".follow" + ids[i]).attr("data-type", "cancel")
                                $(".follow" + ids[i]).find(".btn-follow").addClass("btn-follow-dis").html("已关注");
                                $(".follow" + ids[i]).find(".isfollow").html("取消关注");
                            } else {
                                $(".follow" + ids[i]).attr("data-type", "add")
                                $(".follow" + ids[i]).find(".btn-follow").removeClass("btn-follow-dis").html("+关注");
                                $(".follow" + ids[i]).find(".isfollow").html("+关注");
                            }
                        }
                    }
                })

            })
        },
        // 判断是否关注
        isFollow:function(followid,e){
            if(isfollowStatus) {
                isfollowStatus = false
                var self =this;
                this.check_login(function () {
                    if("add"==$(e).attr("data-type")){
                        self.follow(followid, e)
                    } else {
                        self.cancelfollow(followid, e)
                    }
                })
            }
        },
        /*关注*/
        follow: function (uid, e) {
            $.get("/member/follow/add.json", {followid: uid}, function (data) {
                if(data.error){
                    layer.msg(data.msg);
                }else{
                    if(e){
                        $(e).attr("data-type","cancel")
                        $(e).find(".btn-follow").addClass("btn-follow-dis").html("已关注");
                        $(e).find(".isfollow").html("取消关注");
                    }
                    layer.msg('关注成功');
                }
                isfollowStatus=true
            }, 'json');
        },
        /*取消关注*/
        cancelfollow: function (uid, e) {
            $.get("/member/follow/del.json", {followid: uid}, function (data) {
                if(data.error){
                    layer.msg(data.msg);
                }else{
                    if(e){
                        $(e).attr("data-type","add")
                        $(e).find(".btn-follow").removeClass("btn-follow-dis").html("+关注");
                        $(e).find(".isfollow").html("+关注");
                    }
                    layer.msg('取消关注');
                }
                isfollowStatus=true
            }, 'json');
        },
        /*关注：粉丝，关注同一个页面*/
        follow_zone: function (uid, e, num) {
            this.check_login(function () {
                $.get("/api/api/ajax_follow", {id: uid, follow: num}, function (data) {
                    if (data.error == 0) {
                        $(e).find(".btn-follow").addClass("btn-follow-dis").html("已关注");
                        layer.msg("关注成功");
                        setTimeout(function () {
                            window.location.reload();
                        }, 500)
                    } else if (data.error == 2) {
                        layer.msg("不能关注自己");
                    } else if (data.error == 3) {
                        layer.msg("关注账号不存在");
                    } else {
                        $(e).find(".btn-follow").removeClass("btn-follow-dis").html("+关注");
                        layer.msg("取消关注");
                        setTimeout(function () {
                            window.location.reload();
                        }, 500)
                    }
                }, 'json');
            })
        },
        // 判断订阅，收藏，喜欢曲单，谱集
        isCollect:function(modelid,id,e,type,url){
            if(isCollectStatus){
                var self=this;
                this.check_login(function(){
                    if("add"==$(e).attr("data-type")){
                        self.collect(modelid,id,e,type)
                    }else{
                        self.cancelCollect(modelid,id,e,type,url)
                    }

                })
            }
        },
        // 订阅，收藏，喜欢曲单，谱集
        collect:function(modelid,id,e,type){
                $.ajax({
                    url:"/member/favorite/add.json",
                    type:"get",
                    data:{"modelid":modelid,"id":id},
                    success:function(data){
                        if(data.error=="0"){
                            $(e).addClass("active")
                            if(type=='喜欢'){
                                layer.msg("成功喜欢")
                                $(e).find(".icon-love").addClass("active");
                                $(e).addClass("liked");
                            }else if(type=='订阅'){
                                layer.msg("成功订阅")
                                $(e).addClass("dis").find(".subscribe_txt").html("已订阅")
                            }else{
                                layer.msg("成功收藏")
                                $(e).find(".icon-23").addClass("active");
                                $(e).find("span").text("已收藏");
                                $(e).addClass("collected");
                            }
                            $(e).attr("data-type","cancel")
                        }else{
                            layer.msg(data.msg)
                        }
                        isCollectStatus=true
                    },error:function () {
                        isCollectStatus=true
                    }
                })
        },
        // 取消订阅，收藏，喜欢曲单，谱集
        cancelCollect:function(modelid,id,e,type,url){
                $.ajax({
                    url:"/member/favorite/del.json",
                    type:"get",
                    data:{"modelid":modelid,"id":id},
                    success:function(data){
                        if(data.error=="0"){
                            $(e).removeClass("active")
                            if(type=='喜欢'){
                                layer.msg("取消喜欢")
                                $(e).find(".icon-love").removeClass("active");
                                $(e).removeClass("liked");
                            }else if(type=='订阅'){
                                layer.msg("取消订阅")
                                $(e).removeClass("dis").find(".subscribe_txt").html("+订阅");
                            }else{
                                layer.msg("取消收藏")
                                $(e).find(".icon-23").removeClass("active");
                                $(e).find("span").text("收藏");
                                $(e).removeClass("collected");

                            }
                            if(url){
                                setTimeout(function(){
                                    location.href=url
                                },600);
                            }
                            $(e).attr("data-type","add")
                        }else{
                            layer.msg(data.msg)
                        }
                        isCollectStatus=true
                    },error:function () {
                        isCollectStatus = true
                    }
                })
        },
        /*点赞*/
        dianzan: function (commentid,id,e) {
            if($('.dzicon' + id).css("color")== "#ff7a84"){
                return false;
            }
            this.check_login(function () {
                var goodNum = parseInt($(e).find("span").html());
                $.getJSON('/index.php?m=comment&c=ajax&a=support&commentid='+commentid+'&id='+id, function (data) {
                    if (data.error == 0) {
                        layer.msg("点赞成功");
                        $('.dzicon' + id).css("color", "#ff7a84");
                        $(e).find("span").html(goodNum + 1);
                    } else {
                        layer.msg(data.msg);
                    }
                });
            })
        },
        // 判断单曲是否喜欢
        isMusicLike:function(listid,musicid,refresh,e){
            if(isLikeStatus){
                isLikeStatus=false
                var self=this;
                this.check_login(function(){
                    if("cancel"==$(e).attr("data-type")){
                        self.cancelMusiclLike(listid,musicid,e)
                    }else{
                        self.musicLike(listid,musicid,refresh,e)
                    }
                })
            }
        },
        /*喜欢单曲*/
        musicLike: function (listid,musicid,refresh,e) {
                $.post("/index.php?m=member&c=qudan&a=add_content&zhengquid="+musicid, {id:listid }, function (data) {
                    if(data.error==0){
                        if(refresh=='yes'){
                            layer.msg("成功加入");
                            setTimeout(function(){
                                parent.location.reload();
                            },1000);
                        }else{
                            layer.msg("成功喜欢");
                            $(e).find(".icon-love").addClass("active");
                            $(e).addClass("liked").attr("data-type","cancel");
                        }
                    }else{
                        layer.msg(data.msg)
                    }
                    isLikeStatus = true;
                }, 'json');
        },
        // 取消喜欢单曲
        cancelMusiclLike: function (listid,musicid,e) {
                $.post("/index.php?m=member&c=qudan&a=del_content", {'id':listid,'zhengquid':musicid}, function (data) {
                    if(data.error==0){
                        layer.msg("取消喜欢");
                        $(e).find(".icon-love").removeClass("active");
                        $(e).removeClass("liked").attr("data-type","add");
                    }else{
                        layer.msg(data.msg)
                    }
                    isLikeStatus = true;
                }, 'json');
        },
        // 判断单谱是否喜欢
        isPuLike:function(listid,musicid,refresh,e){
            if(isPuLikeStatus){
                isPuLikeStatus=false
                var self=this;
                this.check_login(function(){
                    if("cancel"==$(e).attr("data-type")){
                        self.cancelPuLike(listid,musicid,e)
                    }else{
                        self.puLike(listid,musicid,refresh,e)
                    }
                })
            }
        },
        // 喜欢单谱
        puLike:function(listid,musicid,refresh,e){
            $.ajax({
                url:"/index.php?m=member&c=pudan&a=add_content&qupuid="+musicid,
                type:"post",
                data:{'id':listid},
                success:function(data){
                    if(data.error==0){
                        if(refresh=='yes'){
                            layer.msg("成功加入");
                            setTimeout(function(){
                                parent.location.reload();
                            },1000);
                        }else{
                            layer.msg("成功喜欢");
                            $(e).find(".icon-love").addClass("active");
                            $(e).addClass("liked").attr("data-type","cancel");
                        }
                    }else{
                        layer.msg("已添加")
                    }
                    isPuLikeStatus=true
                },error:function(){
                    isPuLikeStatus=true
                }
            })
        },
        // 取消喜欢单谱
        cancelPuLike:function(listid,musicid,e){
            $.ajax({
                url:"/index.php?m=member&c=pudan&a=del_content",
                type:"get",
                data:{'id':listid,'qupuid':musicid},
                success:function(data){
                    if(data.error==0){
                        layer.msg("取消喜欢");
                        $(e).find(".icon-love").removeClass("active");
                        $(e).removeClass("liked").attr("data-type","add");
                    }else{
                        layer.msg(data.msg)
                    }
                    isPuLikeStatus=true
                },error:function(){
                    isPuLikeStatus=true
                }
            })
        },
        /*评论*/
        comment: function (commentid,e) {
            this.check_login(function () {
                //检查是否填写内容
                var comment_text = $("#comment_text").val();
                if (comment_text == "") {
                    layer.msg("请填写评论");
                    return false;
                }
                var url = '/index.php?m=comment&c=ajax&a=post&commentid='+commentid;
                $.post(url, {
                    content: comment_text
                }, function (data) {
                    if (data.error == 0) {
                        $(e).attr("disabled", "disabled");
                        layer.msg("评论成功");
                        setTimeout(function () {
                            window.location.reload();
                        }, 1000);
                    } else {
                        layer.msg(data.msg);
                    }
                }, 'json');
            })
        },
        /*回复*/
        answer: function (id,commentid, e) {
            this.check_login(function () {
                //回复点击事件
                var $form = $(e).parent().parent().next();
                if ($form.is(":hidden")) {
                    $(".answer_form").hide();
                    $form.show();
                } else {
                    $form.hide();
                }
                $(e).css({"font-weight": "bold", "color": "#333"});
                var $reply_btn = $(e).parent().parent().next().find(".replybtn");
                $reply_btn.click(function () {
                    var answer_text = $(".answer" + id + "_text").val();
                    if (answer_text == "") {
                        layer.msg("请填写回复");
                        return false;
                    }
                    $.post('/index.php?m=comment&c=ajax&a=post&commentid='+commentid+'&id='+id, {
                        content: answer_text
                    }, function (data) {
                        if (data.error == 1) {
                            layer.msg("回复失败");
                        } else {
                            $reply_btn.attr("disabled", "disabled");
                            layer.msg("回复成功");
                            setTimeout(function () {
                                window.location.reload();
                             }, 1000);
                        }
                    }, 'json');
                });
            })
        },
        deleteComment:function(id,e){
            layer.confirm('确定删除吗？', {
                title:"提示",
                btn: ['确定','取消'] //按钮
            }, function(){
                $.get("/api/comment/del.json?id="+id,function(data){
                    if(data.error==0){
                        layer.msg("删除成功");
                        setTimeout(function () {
                            window.location.reload();
                        }, 1000);
                    }else{
                        layer.msg(data.msg);
                    }
                },"json");
            })
        },
        /*分享*/
        doShare: function () {
            $('.share').hover(function () {
                $(this).css({width: '320px', 'font-size': '14px'}).find('.fenxiang').show();
            }, function () {
                $(this).find('.fenxiang').hide();
                $(this).css('width', '100px');
            });
        },
        /*加入曲集，谱集*/
        join: function (name, id) {
            this.check_login(function () {
                if(name=="pu"){
                    layer.open({
                        type: 2,
                        title: false,
                        skin: 'layui-layer-rim',
                        area: ["800px", "543px"],
                        shadeClose: true,
                        content: ["/index.php?m=member&c=pudan&a=add_content&qupuid="+id,"no"],
                        success:function(layero){
                            var box = $(".popup_list", layero.find("iframe")[0].contentWindow.document);
                            box.attr("id", id);
                        },
                        end: function () {
                            var ret = $(".layer-result");
                            var retVal = ret.val();
                            if (retVal == "like") {
                                ret.find(".btn-like" + id).addClass("liked");
                            }
                        }
                    });
                }else{
                    layer.open({
                        type: 2,
                        title: false,
                        skin: 'layui-layer-rim',
                        area: ["800px", "543px"],
                        shadeClose: true,
                        content: ["/index.php?m=member&c=qudan&a=add_content&zhengquid="+id,"no"],
                        success:function(layero){
                            var box = $(".popup_list", layero.find("iframe")[0].contentWindow.document);
                            box.attr("id", id);
                        },
                        end: function () {
                            var ret = $(".layer-result");
                            var retVal = ret.val();
                            if (retVal == "like") {
                                ret.find(".btn-like" + id).addClass("liked");
                            }
                        }
                    });

                }
            })
        },
        //个人中心-移除曲子
        delMusic:function(type,num){
            layer.confirm('确定删除这条曲子吗？', {
                title:"提示",
                btn: ['确定','取消'] //按钮
            }, function(){
                var url="/index.php?m=member&c=qudan&a=del_content"
                var data={id:type,zhengquid:num}
                $.getJSON(url,data, function(data){
                    if(data.error==0){
                        layer.msg("删除成功");
                        setTimeout(function(){
                            window.location.reload();
                        },600);
                    }
                });
            });
        },
        //个人中心-移除喜欢的视频
        delVideo:function (type,num){
            layer.confirm('确定移除这条视频吗？', {
                title:"提示",
                btn: ['确定','取消'] //按钮
            }, function(){
                $.getJSON("/member/favorite/del.json", {modelid:type,id:num}, function(data){
                    if(data.error==0){
                        layer.msg("删除成功");
                        setTimeout(function(){
                            history.back()
                        },600);
                    }
                });
            });
        },
        //个人中心-删除自己创建的
        del: function(type,num){
            layer.confirm('确定删除吗？', {
                title:"提示",
                btn: ['确定','取消'] //按钮
            }, function(){
                var url="/member/content/del.json"
                var data={catid:type,id:num}
                $.getJSON(url,data, function(data){
                    if(data.error==0){
                        layer.msg("删除成功");
                        setTimeout(function(){
                            window.location.reload();
                        },600);
                    }
                });
            });
        },
        //个人中心-移除曲谱
        delQupu:function(listid,musicid){
            layer.confirm('确定删除这条曲谱吗？', {
                title:"提示",
                btn: ['确定','取消'] //按钮
            }, function(){
                $.ajax({
                    url:"/index.php?m=member&c=pudan&a=del_content",
                    type:"get",
                    data:{'id':listid,'qupuid':musicid},
                    success:function(data){
                        if(data.error==0){
                            layer.msg("删除成功");
                            setTimeout(function(){
                                window.location.reload();
                            },1000);
                        }
                    }
                })
            });

        },
        /*跳转页面*/
        jump: function (e) {
            var go_to = $(e).data("id");
            this.check_login(function () {
                setTimeout(function () {
                    window.location.replace(go_to);
                }, 500)
            }, go_to)
        },
        /*确定奇偶行:*/
        setOdd: function (e) {
            var len = $(e).length;
            for (var i = 0; i < len; i++) {
                if (!(i % 2)) {
                    $(e).eq(i).addClass("odd");
                }
            }
        },
        /*确定长度：中文2字符，其他1字符*/
        getByteLen: function (val) {
            var len = 0;
            for (var i = 0; i < val.length; i++) {
                var a = val.charAt(i);
                if (a.match(/[^\x00-\xff]/ig)) {
                    len += 2;
                }
                else {
                    len += 1;
                }
            }
            return len;
        },
        /*钢琴谱难度*/
        showDifficulty: function (e, islist) {
            var data = $(e).data("difficulty");
            $(e).find(".current-rating").width(18 * data);
            if (!data) {
                $(e).find(".stars").hide();
                if (islist == "1") {
                    $(e).find(".starBox").text("--");
                } else {
                    $(e).find(".starBox .title").text("演奏难度：--");
                }
            }
        },
        /*删除*/
        doRemove: function (id, table_id, cname, ename) {
            layer.confirm('确定删除这条' + cname + '吗？', {
                title: "提示",
                btn: ['确定', '取消']
            }, function () {
                $.getJSON("/api/api/ajax_" + ename + "remove?" + ename + "_id=" + id + "&" + ename + "_album_id=" + table_id, function (data) {
                    if (data.error == 1) {
                        layer.msg("移除成功");
                        setTimeout(function () {
                            window.location.reload();
                        }, 500)
                    } else {
                        layer.msg("移除失败");
                    }
                });
            });
        },
        /*意见反馈*/
        feedback: function () {
            layer.open({
                type: 1,
                title: '意见反馈',
                skin: 'layui-layer-rim',
                area: ["800px", "543px"],
                shade: [0.5, '#000', true],
                shadeClose: true,
                content:'<div class="feedback-cnt">' +
                '    <div class="title">任何使用过程中的问题，欢迎反馈给我们</div>' +
                '    <div class="txt-wrap">' +
                '        <form method="post">' +
                '           <input type="hidden" name="clicaptcha_code" id="clicaptcha_code_feedback">'+
                '            <textarea class="cnt" placeholder="请输入反馈内容"></textarea>' +
                '            <textarea class="contact" placeholder="请留下联系方式（电话、QQ、邮箱）" maxlength="100"></textarea>' +
                '            <div class="operate-box">' +
                '                <input class="submit" type="button" value="发送意见"/>' +
                '                <input class="cancel" type="button" value="取消"/>' +
                '            </div>' +
                '        </form>' +
                '    </div>' +
                '</div>'
            })
        },
        format_time: function(timestamp, format){
            var d = new Date(timestamp * 1000);
            var year = d.getFullYear();
            var month = d.getMonth()+1;
            month = month < 10 ? '0' + month : month;
            var day = d.getDate();
            day = day < 10 ? '0' + day : day;
            var hour = d.getHours();
            hour = hour < 10 ? '0' + hour : hour;
            var minute = d.getMinutes();
            minute = minute < 10 ? '0' + minute : minute;
            var second = d.getSeconds();
            second = second < 10 ? '0' + second : second;
            return format.replace('Y', year).replace('m',month).replace('d',day).replace('H',hour).replace('i',minute).replace('s',second);
        },
        uploadData: function (array,num,property,id,modelid,uid){
            var url;
            array[0].num=num;
            array[0].property=property;
            localStorage.search=JSON.stringify(array);
            var addStr;
            addStr = num == "1" ? '':'&num='+num;
            if(id==''){
                if(undefined===uid){
                }else{
                    url='/music/player.html?modelid='+modelid+'&space_uid='+uid+'&property='+property+addStr
                }
            }else{
                if(undefined===modelid){
                    url='/music/player.html?id='+id+'&property='+property+addStr;
                }else{
                    url='/music/player.html?id='+id+'&modelid='+modelid+'&property='+property+addStr;
                }
            }
            window.open(url, 'player');
        },
        downCheckBuy: function(id,modelid){
            var modelids=new Array(id.length+1).join(modelid+",");
            $.ajax({
                type:"get",
                url:"/content/app.json?op=buycheckV2&q=json",
                data:{"modelid":modelids.substr(0, modelids.lastIndexOf(',')),"id":id.join(",")},
                dataType:"json",
                async:false,
                success:function(data){
                    if(data.error==0){
                        for(var i= 0;i<data.lists.length;i++){
                            if(data.lists[i]=='2'){
                                $('.j-operate'+id[i]).find('.download').attr({"data-purchase":"true","data-thumb":data.goodslists[0].thumb?data.goodslists[0].thumb:img_path+"video1.png","data-title":data.goodslists[i].title,"data-id":data.goodslists[i].id});
                            }else{
                                $('.j-operate'+id[i]).find('.download').attr("href",$('.j-operate'+id[i]).find('.download').attr("data-href"));
                                $('.j-operate'+id[i]).find('.download').removeAttr("data-href")
                            }
                        }
                    }else{
                        console.log(layer.msg);
                    }
                }
            });
        },
        /**发送验证码**/
        send_code: function(url,params,obj) {
            var time = 60;
            obj.disabled = true;
            $.post(url, params , function (data) {
                if (data.error == 0) {
                    nvcReset();
                    layer.msg("验证码已发送");
                    t = window.setInterval(function () {
                        time--;
                        if (time > 0) {
                            obj.value = time + '秒';
                            $(obj).removeClass("icon-button").addClass("icon-button-dis");
                        } else {
                            window.clearInterval(t);
                            obj.value = '获取验证码';
                            time = 60;
                            $(obj).removeClass("icon-button-dis").addClass("icon-button");
                            obj.disabled = false;
                        }
                    }, 1000);
                } else if (data.error == 15) {
                    nvcReset();
                    layer.msg("验证码已发送,一分钟后可重新发送");
                    obj.disabled = false;
                } else {
                    if(undefined == data.data || undefined == data.data.code){
                        nvcReset();
                        layer.msg(data.msg);
                        obj.disabled = false;
                    }else{
                        if (data.data.code == 400) {
                            layer.msg("请按住滑块，拖动到最右边");
                            //唤醒滑动验证
                            getNC().then(function () {
                                _nvc_nc.upLang('cn', {
                                    _startTEXT: "请按住滑块，拖动到最右边",
                                    _yesTEXT: "验证通过",
                                    _error300: "哎呀，出错了，点击<a href=\"javascript:__nc.reset()\">刷新</a>再来一次",
                                    _errorNetwork: "网络不给力，请<a href=\"javascript:__nc.reset()\">点击刷新</a>",
                                });
                                _nvc_nc.reset()
                            });
                        } else if (data.data.code == 600) {
                            //唤醒刮刮卡
                            getSC().then(function () {
                            })
                        } else if (data.data.code == 700) {
                            //唤醒问答验证码。由于问答验证码组件升级中，服务端暂时不会返回code为700的结果。您可以保留该部分的接入代码。
                            getLC();
                        } else if (data.data.code == 800 || data.data.code == 900) {
                            //直接拦截
                            nvcReset();
                            layer.msg("请稍后再试！")
                        }
                    }
                }
            });
        },
        /**获取cookie**/
       getCookie:function(name){
            var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");

            if(arr=document.cookie.match(reg))

                return unescape(arr[2]);
            else
                return null;
        },
        /**保存cookie**/
         saveCookie:function(name, value, options){
            options = options || {};
            if (value === null) {
                value = '';
                options.expires = -1;
            }
            var expires = '';
            if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
                var date;
                if (typeof options.expires == 'number') {
                    date = new Date();
                    date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
                } else {
                    date = options.expires;
                }
                expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
            }
            var path = options.path ? '; path=' + options.path : '';
            var domain = options.domain ? '; domain=' + options.domain : '';
            var secure = options.secure ? '; secure' : '';
            document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
        }
    }
});
