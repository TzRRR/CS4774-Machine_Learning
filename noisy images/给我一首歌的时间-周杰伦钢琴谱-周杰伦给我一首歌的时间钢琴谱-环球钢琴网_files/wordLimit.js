(function(){
 var num=$(".story").attr("data-num");
 var content =$(".story-content").html();
 var content_txt=$(".story-content").text();
 var len=content_txt.length;
 var brief_content = content_txt.substr(0,num) + "..";
 if (len<=num) {
 $(".content-zk").hide();//如果长度不够num，隐藏展开
 } else {
 $(".content-zk").show();
 $(".story-content").html(brief_content);
 }
 $(".content-toggle").on("click",function(){
  var re=/(<p)(.*?)(>)/g;
  content=content.replace(re,"$1$3");
  var html="";
  if($(this).hasClass("content-zk")){
   html = num == 100 ? content_txt : content;
   $(".story-content").html(html);
   html = num == 100 ? '收起<i class="icon icon-arrow-left-empty-copy-copy-copy"></i>' : '收起';
   $(".content-toggle").removeClass("content-zk").addClass("content-sq").html(html);
  }else{
   $(".story-content").html(brief_content);
   html = num == 100 ? '展开<i class="icon icon-arrow-b"></i>' : '展开全部';
   $(".content-toggle").removeClass("content-sq").addClass("content-zk").html(html);
  }
 });
 })();