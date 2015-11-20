window.requestAnimFrame = (function(){ // reduce CPU consumption, improve performance and make this possible
  return  window.requestAnimationFrame       ||
		  window.webkitRequestAnimationFrame ||
		  window.mozRequestAnimationFrame    ||
		  window.oRequestAnimationFrame      ||
		  window.msRequestAnimationFrame     ||
		  function( callback ){
			window.setTimeout(callback, 1000 / 60);
		  };
})();



$(document).ready(function() {


		// 'waves' bg animation


		$('.wrapper').fadeIn(2000);
		$('.loading-text').fadeOut(1000);



	// CTAs script


	var maxScroll = $('#content').height() - $(window).height() + 1100;

	console.log('document.height=', $('#content').height());


	$('#godeep').delay(1000).animate({ opacity: 1 }, 1200);

	$('#godeep').on( 'click', function () {
		event.preventDefault();
		$('#rotate').scrollTo( maxScroll, { duration: 5000 }).css('pointer-events', 'none');
		console.log( 'docH =', $(document).height() );
		console.log( 'winH =', $(window).height() );
		console.log( 'maxS =', maxScroll );
		$('iframe').delay(4000).animate({ opacity: 1 }, 1200);
		$('#surface').delay(6000).fadeIn(800);
		$(this).fadeOut(800);
	});

	$('#surface').on( 'click', function () {
		event.preventDefault();
		$('#rotate').scrollTo( 0, { duration: 4000 }).css('pointer-events', 'auto');
		$('iframe').animate({ opacity: 0 },  800);
		$(this).fadeOut(800);
		$('#godeep').delay(4000).fadeIn(800);
	});


});


$(window).load(function() {



	$('#rotate').scroll(function() {


		var step = 1; // visible frame
		var targetStep = 1; // frame to animate to
		var images = new Array; // stores all of the frames for quick access
		var totalFrames = 180;


		for(i = 1; i <= totalFrames; i++) { // loop for each image in sequence
			images[i] =  new Image(); // add image object to array
			images[i].src = "frames/waves"+( pad(i, 3) )+".jpg"; // set the source of the image object
		}

		function pad(number, length) { // pad numbers with leading zeros for JPEG sequence file names
			var str = '' + number; while (str.length < length) { str = '0' + str; } return str;
		}

		function getYOffset() {
			contScroll = $('#content').offset();
			return -contScroll.top;
		}

		animloop();


		function animloop(){ // the smoothest animation loop possible
		  requestAnimFrame(animloop);
		  targetStep = Math.max( Math.round( getYOffset() / 108 ) , 1 ); // what frame to animate to
		  if(targetStep != step ) { step += (targetStep - step) / 10; } // increment the step until we arrive at the target step
		  changeFrame();
		}

		function changeFrame() {
			var thisStep = Math.round(step); // calculate the frame number
			if(images.length > 0 && images[thisStep]) { // if the image exists in the array
				if(images[thisStep].complete) { // if the image is downloaded and ready
					$('#video').attr('src',images[thisStep].src); // change the source of our placeholder image
				}
			}
		}

	});



	// tees scrolling animation
1

	var rotate = Math.sin(( contScroll.top + 218 ) / 800) * 20;
	var left = ( Math.cos(( contScroll.top ) / 800) * 10 ) - 15;

	if ( contScroll.top >= - $(window).height() - 300 ) {
		var mrgnLeft = ( $(window).height() + contScroll.top - 10 ) / - 100 ;
	} else {
		var mrgnLeft = 0;
	}


	$(this).css( '-webkit-transform', 'rotate('+rotate+'deg)' );
	$(this).css( 'transform', 'rotate('+rotate+'deg)' );
	$(this).css( 'left', left+'%' );
	$(this).css( 'margin-left', mrgnLeft+'%' );

	console.log( mrgnLeft );
	console.log( 'contScroll.top =', contScroll.top );
	console.log( maxScroll );



});



// scroll-to plugin


$.fn.scrollTo = function( target, options, callback ){
  if(typeof options == 'function' && arguments.length == 2){ callback = options; options = target; }
  var settings = $.extend({
    scrollTarget  : target,
    easing        : 'swing'
  }, options);
  return this.each(function(){
    var scrollPane = $(this);
    var scrollTarget = (typeof settings.scrollTarget == "number") ? settings.scrollTarget : $(settings.scrollTarget);
    var scrollY = (typeof scrollTarget == "number") ? scrollTarget : scrollTarget.offset().top + scrollPane.scrollTop() - parseInt(settings.offsetTop);
    scrollPane.animate({scrollTop : scrollY }, parseInt(settings.duration), settings.easing, function(){
      if (typeof callback == 'function') { callback.call(this); }
    });
  });
}