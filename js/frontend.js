(function( $ ) {
	jQuery.fn.magicSlidesFront = function(options) {
		var settings = $.extend( {
			'responsive'	: true,
			'destroyAfter'	: true,
			'useCustomCSS'	: false,
		}, options);

		var queue = [];
		this.children().css({opacity:0}).each(function(i,el){
			elDelay = $(el).attr("data-delay") ? $(el).attr("data-delay") : 0;
			elDuration = $(el).attr("data-duration") ? $(el).attr("data-duration") : 0;
			/* Создание очереди */
			if(elDelay>0){
				queue.push({"t":"d","dur":elDelay});
			}
			queue.push({"t":"a","dur":elDuration,"obj":el});
			/* /Создание очереди */
		});
		console.log(queue);
		var next = true;
		for(i=0;i<queue.length;i++){
			var qEl = queue[i];

		}
		var processed = false;
		var interval = setInterval(function(){
			if(!processed){
				processed = true;
				var qEl = queue.shift();
				console.log(qEl);
				if(!qEl){
					clearInterval(interval);
				}else{
					if(qEl.t=="d"){
						setTimeout(()=>{processed = false;},qEl.dur);
					}else
					if(qEl.t=="a"){
						var aObj = false
						switch($(qEl.obj).attr("data-animation")){
							case "fade":
							aObj = {opacity:1};
							break;
							case "slideDown":
							elY = $(qEl.obj).offset().top;
							aObj = {top:elY};
							$(qEl.obj).css({top:"-100%",opacity:1});
							break;
							case "slideUp":
							elY = $(qEl.obj).offset().top;
							aObj = {top:elY};
							$(qEl.obj).css({top:"100%",opacity:1});
							break;
							case "slideLeft":
							elX = $(qEl.obj).offset().left;
							aObj = {left:elX};
							$(qEl.obj).css({left:"-100%",opacity:1});
							break;
							case "slideRight":
							elX = $(qEl.obj).offset().left;
							aObj = {left:elX};
							$(qEl.obj).css({left:"100%",opacity:1});
							break;
							default:
							aObj = {opacity:1};
							break;
						}
						$(qEl.obj).animate(aObj,parseInt(qEl.dur),function(){processed = false;});
					}
				}

			}else{
				console.log("in proccess");
			}
		},50);
		return this;
	}

})(jQuery);