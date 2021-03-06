(function($) {
	"use strict"

	///////////////////////////
	// Preloader
	$(window).on('load', function() {

	});

	///////////////////////////
	// Scrollspy
	$('body').scrollspy({
		target: '#nav',
		offset: $(window).height() / 2
	});

	///////////////////////////
	// Smooth scroll
	$("#nav .main-nav a[href^='#']").on('click', function(e) {
		e.preventDefault();
		var hash = this.hash;
		$('html, body').animate({
			scrollTop: $(this.hash).offset().top
		}, 600);
	});

	$('#back-to-top').on('click', function(){
		$('body,html').animate({
			scrollTop: 0
		}, 600);
	});

	///////////////////////////
	// Btn nav collapse
	$('#nav .nav-collapse').on('click', function() {
		$('#nav').toggleClass('open');
	});

	///////////////////////////
	// Mobile dropdown
	$('.has-dropdown a').on('click', function() {
		$(this).parent().toggleClass('open-drop');
	});

	///////////////////////////
	// On Scroll
	$(window).on('scroll', function() {
		var wScroll = $(this).scrollTop();

		// Fixed nav
		wScroll > 1 ? $('#nav').addClass('fixed-nav') : $('#nav').removeClass('fixed-nav');

		// Back To Top Appear
		wScroll > 200 ? $('#back-to-top').fadeIn() : $('#back-to-top').fadeOut();

        // Search Appear
        wScroll > 200 ? $('#qr4code').fadeIn() : $('#qr4code').fadeOut();

        // Search Appear
        wScroll > 200 ? $('#search').fadeIn() : $('#search').fadeOut();
	});

	///////////////////////////
	// magnificPopup
	$('.work').magnificPopup({
		delegate: '.lightbox',
		type: 'image'
	});

	///////////////////////////
	// Owl Carousel
	$('#about-slider').owlCarousel({
		items:1,
		loop:true,
		margin:15,
		nav: true,
		navText : ['<i class="fa fa-angle-left"></i>','<i class="fa fa-angle-right"></i>'],
		dots : true,
		autoplay : true,
		animateOut: 'fadeOut'
	});

	$('#testimonial-slider').owlCarousel({
		loop:true,
		margin:15,
		dots : true,
		nav: false,
		autoplay : true,
		responsive:{
			0: {
				items:1
			},
			992:{
				items:2
			}
		}
	});

})(jQuery);

function search() {
    swal({
        title: '请输入关键字',  //标题
        input: 'text',
        showCancelButton: true,
        cancelButtonText:'取消',
        confirmButtonText: '确定',
        showLoaderOnConfirm: true,
        preConfirm: function(val) {  //功能执行前确认操作，支持function
            return new Promise(function(resolve, reject) {

                addCookie("search",val,1,"/");
                window.location.href = "/list"
                resolve();

                /*$.post('/reset',{email:email},function (res,status) {
                    if(res.code==1){
                        resolve();
                    }else{
                        reject(res.msg);
                    }
                });*/

            })
        },
        allowOutsideClick: true
    }).then(function(email) {

    });
}

function qr4code() {
    swal({
        title: '看风了风',
        text: '扫码进群获取更多分享资源信息',
        imageUrl: 'http://awesome.zooori.cn/pic/qr4code.jpg',
        imageWidth: 275,
        imageHeight: 335,
        animation: false
    })
}
