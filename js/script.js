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

var yAmount = 8 * window.innerHeight;

window.onbeforeunload = function(){
  window.scrollTo(0, yAmount);
}


var images;
var $window;
var $body;
var $firstTee;
var $vr;
var offsetY;
var maxScroll;
var offScroll;



$window = $( window );
$body = $('body');
images = new Array;
$firstTee = $( '#content img:first-child' );

if ( Modernizr.webgl ) {
	$vr = $('#vr');
} else  {
	$vr = $('#fake-vr');
}

preloadImages();


$('#loader .container').fadeIn(1000);


var windowHeight = window.screen.availHeight;

$('#video').css({
	'top': windowHeight / 2,
	'min-height': windowHeight
});

$('#overlay').css({
	'height': windowHeight
});

if( navigator.userAgent.match('CriOS') ) {

	var defaultPrevent=function(e){e.preventDefault();}
	document.body.parentElement.addEventListener("touchmove" , defaultPrevent);
	document.body.addEventListener("touchmove" , defaultPrevent);

}





// loader animation

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



// loader animation init

var level = 0;

var reference;

function loop() {

    reference = requestAnimFrame(loop);

    console.log('reference');

		tick++;
		clear();
		updatePoints();
		renderShape();
		level = level + .004;
};


loop();




$(window).on('load', fadeInContent);

$(window).load(function() {


	// first tee margin top

	$firstTee.css('margin-top', ( window.innerHeight - $firstTee.height() ) / 2 );

	// 'waves' bg animation

	var step = 1; // visible frame
	var targetStep = 1; // frame to animate to
	var totalFrames = 180;


	function animloop( offsetY, step, images ) {

		targetStep = Math.max( Math.round( offsetY / 10) , 1 );

		if(targetStep != step ) {
			step += ( targetStep - step ) / 10;
		}

		changeFrame(step, images);

	}


	function changeFrame( step, images ) {

		var thisStep = Math.round(step);

		if( images[thisStep] ) {
			$('#video').attr('src',images[thisStep].src);
		}
	}

  maxScroll = $body.height() - 2 * window.innerHeight;



	$window.on( 'scroll', function() {


		offsetY = window.scrollY;

		requestAnimFrame(function(){
			animloop( offsetY, step, images );
		});


    //  end of 'waves' bg animation

		if ( offsetY < maxScroll - window.innerHeight / 4 ) {
			if( scrollTrigger == true ){
				getUp();
			}
		}

		if ( offsetY >= maxScroll + window.innerHeight / 4 ) {
			if( scrollTrigger == false ){
				getDown();
			}
		}

	});


	// CTAs script

	$('#godeep').on( 'click', function (event) {
		event.preventDefault();
		$body.scrollTo( maxScroll + 2 * window.innerHeight, { duration: 5000 });
		$('#godeep').fadeOut(800);
	});

	$('#surface').on( 'click', function (event) {
		event.preventDefault();
		$body.scrollTo( 0, { duration: 4000 });
	});




	// tees transform animation

	var n,
			transform,
			rotate;

	var $images = $('#content img');

	$images.each( function(idx, el) {

		n = idx + 1;
		transform = Math.sin( n ) * Math.log( n ) * 21;
		rotate = Math.cos( n ) * Math.log( n ) * -6 - 1;

		$(el).css({
			'-webkit-transform': 'rotate('+rotate+'deg) translateX('+transform+'%)',
			'transform': 'rotate('+rotate+'deg) translateX('+transform+'%)'
		});

	});
});




var scrollTrigger = false;

function getUp() {
	scrollTrigger = false;
	$('#surface').fadeOut(800);
	$('#godeep').delay(800).fadeIn(800);
	$vr.animate({ opacity: 0 }, 800);
}

function getDown() {
	scrollTrigger = true;
	$body.scrollTo( maxScroll + 2 * window.innerHeight, { duration: 800 });
	$vr.animate({ opacity: 1 }, 1500);
	$('#surface').fadeIn(800);
	$('#godeep').fadeOut(800);
}

function fadeInContent() {
		$('#loader').delay(1000).fadeOut(2000);
		$('#content').delay(4000).animate({ opacity: 1 }, 1200);
		$('#godeep').delay(5200).fadeIn(2800);
    window.scrollTo(0, yAmount);
		$body.delay(1400).scrollTo( 0, { duration: 2500 }, initAutoSurface);

    console.log('fadeInContent');

    setTimeout( function(){ cancelAnimationFrame(reference) }, 3000 );
}

function pad(number, length) {
	var str = '' + number; while (str.length < length) { str = '0' + str; }
	return str;
}

function preloadImages() {
	var source;
	for (var i = 1; i <= 180; i++) {
		source = "frames/waves"+( pad(i, 3) )+".jpg";
		var $img = $('<img />', {
			'src': source
		});
		images[i] = { "src": source };

    $('.video-assets').append($img);
	}
}



function initAutoSurface() {
	$window.on('scroll', scrolled );
}


function scrolled() {

	clearTimeout( offScroll );

	offScroll = setTimeout( function() {


    if ( offsetY < maxScroll ) {

			$body.scrollTo( 0, { duration: Math.sqrt(offsetY) * 80 });

		}

	}, 1200 );
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