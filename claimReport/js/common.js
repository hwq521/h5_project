$(function() {

    $(".top_menu").click(function() {

        $(".top-menu-box").slideDown();
        $("<div class='mark-menu'></div>").appendTo("body");

        $(".mark-menu").click(function() {
            $(this).remove();
            $(".top-menu-box").slideUp();
        })

    })








    //下滑加载触发条件	
    var winHeight = window.innerHeight //$(window).height();
    var topHeight = $(".trx_header").height() + $(".s_cp_tab").height() + $(".s_cp_choice").height(); //根据实际页面计算需要滚动的内容高度
    $('.cp_box').height(winHeight - topHeight - 2)
    $('.cp_box').scroll(function() {
        view = $(this).height(); //可见高度
        content = $(this).get(0).scrollHeight; //内容高度
        scrollTop = $(this).scrollTop(); //滚动高度
        if (content - view <= scrollTop + 1) {
            //alert("加载更多")
        }
    });

    setTimeout(function() {
        var winHeight = window.innerHeight //$(window).height();
        var topHeight = $(".trx_header").height() + $(".s_cp_tab").height() + $(".s_cp_choice").height(); //根据实际页面计算需要滚动的内容高度
        $('.cp_box').height(winHeight - topHeight - 2)
        console.log('setTimeout', winHeight, '.cp-box高度:' + `(${winHeight} - ${topHeight} - 2)`)
    }, 500)

    //滚动
    $.fn.textScroll = function() {
        var p = $(this),
            c = p.children(),
            speed = 3000; //值越大速度越小
        var cw = c.width(),
            pw = p.width();
        var t = (cw / 100) * speed;
        var f = null,
            t1 = 0;

        function ani(tm) {
            counttime();
            c.animate({
                left: -cw
            }, tm, "linear", function() {
                c.css({
                    left: pw
                });
                clearInterval(f);
                t1 = 0;
                t = ((cw + pw) / 100) * speed;
                ani(t);
            });
        }

        function counttime() {
            f = setInterval(function() {
                t1 += 10;
            }, 10);
        }
        p.on({
            mouseenter: function() {
                c.stop(false, false);
                clearInterval(f);
                console.log(t1);
            },
            mouseleave: function() {
                ani(t - t1);
                console.log(t1);
            }
        });
        ani(t);
    }

})