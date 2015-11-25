window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
		  window.webkitRequestAnimationFrame ||
		  window.mozRequestAnimationFrame    ||
		  window.oRequestAnimationFrame      ||
		  window.msRequestAnimationFrame     ||
		  function( callback ){
			window.setTimeout(callback, 1000 / 60);
		  };
})();

var images;
var $wrapper;
var offsetY;
var maxScroll;
var offScroll;
var winRatio;

var a, q, x, y, w, h;



$(document).ready(function() {

	images = new Array;
	$wrapper = $('.wrapper');


	// $('#loader').fadeIn(1000);
	$('#loader .container').fadeIn(1000);

	preloadImages();



	// loader

	var c = document.getElementById('c'),
	    ctx = c.getContext('2d'),
	    cw = c.width = window.innerWidth,
	    ch = c.height = window.innerHeight,
	    points = [],
	    tick = 0,
	    level = .1,
	    opt = {
	      count: 12,
	      range: {
	        x: 20,
	        y: 80
	      },
	      duration: {
	        min: 20,
	        max: 40
	      },
	      level: 0.2,
	      curved: true
	    },
	    rand = function(min, max){
	        return Math.floor( (Math.random() * (max - min + 1) ) + min);
	    },
	    ease = function (t, b, c, d) {
	      if ((t/=d/2) < 1) return c/2*t*t + b;
	      return -c/2 * ((--t)*(t-2) - 1) + b;
	    };

	ctx.lineJoin = 'round';

	var Point = function(config){
	  this.anchorX = config.x;
	  this.anchorY = config.y;
	  this.x = config.x;
	  this.y = config.y;
	  this.setTarget();
	};

	Point.prototype.setTarget = function(){
	  this.initialX = this.x;
	  this.initialY = this.y;
	  this.targetX = this.anchorX + rand(0, opt.range.x * 2) - opt.range.x;
	  this.targetY = this.anchorY + rand(0, opt.range.y * 2) - opt.range.y;
	  this.tick = 0;
	  this.duration = rand(opt.duration.min, opt.duration.max);
	}

	Point.prototype.update = function(){
	  var dx = this.targetX - this.x;
	  var dy = this.targetY - this.y;
	  var dist = Math.sqrt(dx * dx + dy * dy);

	  if(Math.abs(dist) <= 0){
	    this.setTarget();
	  } else {
	    var t = this.tick;
	    var b = this.initialY;
	    var c = this.targetY - this.initialY;
	    var d = this.duration;
	    this.y = ease(t, b, c, d);

	    b = this.initialX;
	    c = this.targetX - this.initialX;
	    d = this.duration;
	    this.x = ease(t, b, c, d);

	    this.tick++;
	  }
	};

	Point.prototype.render = function(){
	  ctx.beginPath();
	  ctx.arc(this.x, this.y, 3, 0, Math.PI * 2, false);
	  // ctx.fillStyle = '#034268';
	  ctx.fill();
	};


	var updatePoints = function(){
		var i = points.length;
		while(i--){
			points[i].update();
		}
	  var i = opt.count + 2;
		var spacing = (cw + (opt.range.x * 2)) / (opt.count-1);
		while(i--){
		  points.push(new Point({
		    x: (spacing * (i - 1)) - opt.range.x,
		    y: ch - (ch * level)
		  }));
		}
	};


	var renderShape = function(){
	  ctx.beginPath();
	  var pointCount = points.length;
	  ctx.moveTo(points[0].x, points[0].y);
	  var i;
	  for (i = 0; i < pointCount - 1; i++) {
	    var c = (points[i].x + points[i + 1].x) / 2;
	    var d = (points[i].y + points[i + 1].y) / 2;
	    ctx.quadraticCurveTo(points[i].x, points[i].y, c, d);
	  }
	  ctx.lineTo(-opt.range.x - opt.thickness, ch + opt.thickness);
	  ctx.lineTo(cw + opt.range.x + opt.thickness, ch + opt.thickness);
	  ctx.closePath();
	  ctx.fillStyle = '#034268';
	  ctx.fill();
	};


	var clear = function(){
	  ctx.clearRect(0, 0, cw, ch);
	};


	var level = 0;


	function loop() {

		if(level < 1.9) {
			window.requestAnimFrame(loop, c);
			tick++;
			clear();
			updatePoints();
			renderShape();

			// console.log(level);

			// console.log('tally', tally);

			level = level + .004;
		}

		if(level >= 1) {
			loader.call();
		}

	};

	// loop( loader );
	loader();

});



$(window).load(function() {


	// 'waves' bg animation

	var step = 1; // visible frame
	var targetStep = 1; // frame to animate to
	var totalFrames = 180;


	function animloop( offsetY, step, images ) {

		targetStep = Math.max( Math.round( offsetY / 10) , 1 );

		if(targetStep != step ) {
			step += ( targetStep - step ) / 20;
		}

		changeFrame(step, images);
	}


	function changeFrame( step, images ) {

		var thisStep = Math.round(step);

		if( images[thisStep] ) {
			$('#video').attr('src',images[thisStep].src);
		}
	}

  // maxScroll = $('#content').height() - $(window).height();
  maxScroll = $(window).height() * 10;

	var scrollTrigger = false;

	winRatio = $(window).width() / $(window).height();

	$('#fakeContent').css( 'height', $(window).height() * 10 );







	$wrapper.on( 'scroll', function() {

		offsetY = -( $('#content').offset().top );

		requestAnimFrame(function(){
			animloop( offsetY, step, images );
		});

		// console.log( 'maxScroll =', maxScroll );
		// console.log( 'offsetY =', offsetY );

		if ( offsetY < maxScroll ) {

			if( scrollTrigger == true ){
				scrollTrigger = false;
				console.log( 'scrollTrigger =', scrollTrigger );
				$('#surface').fadeOut(800);
				$('#godeep').delay(800).fadeIn(800);
				console.log('<');
			}

		}

		if ( offsetY >= maxScroll ) {

			if( scrollTrigger == false ){
				scrollTrigger = true;
				console.log( 'scrollTrigger =', scrollTrigger );

				$(this).scrollTo( maxScroll + 2 * $(window).height(), { duration: 800 });
				$('#vr').animate({ opacity: 1 }, 1500);
				$('#surface').fadeIn(800);
				$('#godeep').fadeOut(800);
				console.log('>=');
			}
		}


		// tees scrolling animation

		$images.each( function(idx, el) {

			a = images_positions[idx].a;
			q = images_positions[idx].q;
			w = images_positions[idx].w;
			h = images_positions[idx].h;


			if ( q > 0 ) {
				y = ( offsetY ) % window.innerHeight - window.innerHeight / 2 - h / 2;
			} else {
				y = ( offsetY ) % window.innerHeight * -1 + window.innerHeight / 2 - h / 2;
			}

			x = y * a - w / 2;


			// if ( q > 0 ) {
   //      yt = ( offsetY ) % window.innerHeight - window.innerHeight / 2;
   //    } else {
   //      yt = ( offsetY ) % window.innerHeight * -1 + window.innerHeight / 2;
   //    }

   //    xt = ( y ) * a;

   //    y = yt - h / 2;

   //    x = xt - w / 2;


			// n = idx + 1;

			// rotate = ( Math.atan( a, q ) * 180 / Math.PI + 360) % 360;
			rotate = 0;
			var styles = {
				'-webkit-transform': 'translateX('+ x + 'px) translateY('+ y + 'px) rotate('+ rotate +'deg)',
				'transform': 'translateX('+ x + 'px) translateY('+ y + 'px) rotate('+ rotate +'deg)'
			};
			$(el).css(styles);

	    console.log( 'a =', a );
	    console.log( 'q =', q );
	    console.log( 'Math.atan( x, y ) =', Math.atan( x, y ) );
	    console.log( 'rotate =', rotate );

		});

	});


	var $images = $('#content img');
	var images_positions = [];

	$images.each( function(idx, el) {

		images_positions[idx] = {
			"a": ( Math.random() * 2 - 1 ),
			"q": ( Math.random() * 2 - 1 ),
			"w": $(this).width(),
			"h": $(this).height()
		};

	});




	// CTAs script

	$('#godeep').on( 'click', function (event) {
		event.preventDefault();
		$wrapper.scrollTo( maxScroll + 2 * $(window).height(), { duration: 5000 });
		$('#godeep').fadeOut(800);
	});

	$('#surface').on( 'click', function (event) {
		event.preventDefault();
		$wrapper.scrollTo( 0, { duration: 4000 });
		$('#vr').animate({ opacity: 0 }, 800);
	});



});



var loaded = false;

function loader() {
	if( loaded == false ){
		$('#loader').delay(1000).fadeOut(2000);
		$('#content').delay(4000).animate({ opacity: 1 }, 1500);
		$('#godeep').delay(5000).fadeIn(800);
		// $wrapper.scrollTo( 8 * $(window).height(), { duration: 0 });
		// $wrapper.delay(1000).scrollTo( 0, { duration: 2800 }, initAutoSurface);
	}
	loaded = true;
}

function pad(number, length) {
	var str = '' + number; while (str.length < length) { str = '0' + str; }
	return str;
}

function preloadImages() {
	var source;
	// tally = 180;

	for (var i = 1; i <= 180; i++) {
		source = "frames/waves"+( pad(i, 3) )+".jpg";

		var $img = $('<img />', {
			'src': source
		});

		images[i] = { "src": source };
	}

}


function initAutoSurface() {
	$wrapper.on('scroll', scrolled );
}


function scrolled() {

	clearTimeout( offScroll );

	offScroll = setTimeout( function() {

		console.log( 'scrolled' );

    if ( offsetY < maxScroll ) {

			$wrapper.scrollTo( 0, { duration: Math.sqrt(offsetY) * 80 });

		}

	}, 800 );
}




// ScrollTo plugin

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