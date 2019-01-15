(function( $ ) {
	jQuery.fn.magicSlidesBack = function(options) {

		var settings = $.extend( {
			'width'			: false,
			'height'		: false,
			'toolsPosition' : 'top',
			'useCustomCSS'	: false,
		}, options);
		var layers = []
		var layersHTML = "";
		var maxID = 1;
		var dragging = false;
		var resizing = false;
		var resizeShift = {"x":0,"y":0}
		var dragShift = {"x":0,"y":0}
		var currentActive = false;
		//поиск дочерних элементов
		$this = this
		this.children().each(function(index, el) {
			addLayer(el);
		});
		//Добавление тулбаров
		this
		.addClass('magicSlide')
		.append('<div class="elements">'+this.html()+'</div>')
		.append('<div class="toolbars"><select id="for_type"><option value="1">Текст</option><option value="2">Картинка</option><option value="3">Видео</option></select> -> <button id="append_element">Добавить элемент</button> <button title="Изменение размеров" class="tool-resize">Изменить размеры</button> <input id="for_text" type="text" /><label>Задержка(мс): <input type="text" id="for_delay" /></label> <label><select id="for_animation"><option value="none">Без анимации</option><option value="fade">Появление</option><option value="slideDown">Скольжение сверху</option><option value="slideUp">Скольжение снизу</option><option value="slideLeft">Скольжение слева</option><option value="slideRight">Скольжение справа</option></select></label> <label>Скорость анимации(мс): <input type="text" id="for_duration" /></label><button title="Посмотреть результат" class="tool-preview">Просмотр</button></div>')
		.append('<div class="layers"><div class="title">Элементы</div><ul>'+layersHTML+'</ul></div>').find(":not(.elements, .toolbars, .layers, .elements *, .toolbars *, .layers *)").remove();

		currentActive = this.find(".elements .slide-element").removeClass('--active').last().addClass('--active')
		if(currentActive.hasClass('--text'))
			$("#for_text").val($(currentActive).text())

		//Добавление событий на тулбар
		this
		.on("click","#append_element", function(){
			console.log($this.find("#for_type").val())
			var el;
			switch($this.find("#for_type").val()){
				case 1,'1':
					$this.find(".elements").append('<div class="slide-element --text" data-delay="0" data-duration="0" data-animation="none"></div>');
					el = $this.find('.elements .slide-element').removeClass('--active').removeClass('--resize').last().addClass('--active').text('Текстовый элемент');
				break;
				case 2,'2':
				break;
				case 3,'3':
				break;
			}
			$this.find(".elements .slide-element").find('.conner').remove();
			currentActive = el
			$("#for_text").val($(currentActive).text())
			addLayer(el);
		})
		.on("click",".toolbars .tool-preview", function(){
			$("#modal .content").html($this.find(".elements").html().replace("--active","")).addClass('magicSlide').magicSlidesFront().parent().addClass('show');
			$("#modal .close").click(function(){
				$("#modal").removeClass('show');
			});
		})
		.on("change","#for_animation", function(){
			$(currentActive).attr("data-animation",event.target.value);
		})
		.on("input","#for_duration",function(event){
			if(event.target.value.match(/[\D]/i)==null){
				$(currentActive).attr("data-duration",event.target.value);
			}else{
				event.target.value = 0;
				alert("Можно указывать только числа!");
			}

		})
		.on("input","#for_delay",function(event){
			console.log(event.target.value.match(/\D/i))
			if(event.target.value.match(/\D/i)==null){
				$(currentActive).attr("data-delay",event.target.value);
			}else{
				event.target.value = 0;
				alert("Можно указывать только числа!");
			}

		})
		.on("input","#for_text",function(event){
			if($(currentActive).hasClass('--text'))
				$(currentActive).text(event.target.value);
			$("#for_delay").val($(currentActive).attr("data-delay"));
			$("#for_duration").val($(currentActive).attr("data-duration"));
			$("#for_animation").val($(currentActive).attr("data-animation"));
		})
		.on("click",".toolbars .tool-resize",function(){
			if(!$(currentActive).hasClass('--resize')){
				$(currentActive).addClass('--resize').append('<div class="conner lt"></div><div class="conner rt"></div><div class="conner lb"></div><div class="conner rb"></div>');
			}else{
				$(currentActive).removeClass('--resize').find('.conner').remove();
			}
		});
		//Добавление событий на нажатие слоев
		this.on("click",".layers .layer", function(event){
			$(".elements .slide-element").removeClass('--active').removeClass('--resize').find('.conner').remove();
			currentActive = $("#"+$(event.target).attr("data-target")).addClass('--active');
			if($(currentActive).hasClass('--text'))
					$("#for_text").val($(currentActive).text());
			$("#for_delay").val($(currentActive).attr("data-delay"));
			$("#for_duration").val($(currentActive).attr("data-duration"));
			$("#for_animation").val($(currentActive).attr("data-animation"));
		})

		//Добавление событий для drag'n'drop
		this.find(".elements").on("mousedown",function(event) {
			console.log(event.target)
			if($(event.target).hasClass('slide-element') && $(event.target).hasClass('--active')){
				dragging = true;
				dragShift.x = event.pageX - $(".elements .slide-element.--active").position().left;
				dragShift.y = event.pageY - $(".elements .slide-element.--active").position().top;
			}
			else if($(event.target).hasClass('slide-element')){
				$(".elements .slide-element").removeClass('--active').removeClass('--resize').find('.conner').remove();
				currentActive = $(event.target).addClass('--active');
				if($(currentActive).hasClass('--text'))
					$("#for_text").val($(currentActive).text())
				$("#for_delay").val($(currentActive).attr("data-delay"));
				$("#for_duration").val($(currentActive).attr("data-duration"));
				$("#for_animation").val($(currentActive).attr("data-animation"));
			}else if($(event.target).hasClass("conner")){
				resizing = true;
				if($(event.target).hasClass('lt')){
					resizeShift.x = $(currentActive).offset().left + $(currentActive).width();
					resizeShift.y = $(currentActive).offset().top + $(currentActive).height();
				}else
				if($(event.target).hasClass('rt')){
					resizeShift.x = $(currentActive).offset().left;
					resizeShift.y = $(currentActive).offset().top + $(currentActive).height();
				}else
				if($(event.target).hasClass('lb')){
					resizeShift.x = $(currentActive).offset().left + $(currentActive).width();
					resizeShift.y = $(currentActive).offset().top;
				}else
				if($(event.target).hasClass('rb')){
					resizeShift.x = $(currentActive).offset().left;
					resizeShift.y = $(currentActive).offset().top;
				}
				console.log("Start resize");
			}
		}).on("mousemove",function(event) {
			if(dragging){
				var x = event.pageX - dragShift.x;
				var y = event.pageY - dragShift.y;
				$this.find(".slide-element.--active").css({'top':y+"px", 'left':x+"px"})
			}else
			if(resizing){
				if($(event.target).hasClass('lt')){
					w = resizeShift.x - event.pageX;
					h = resizeShift.y - event.pageY;
					t = event.pageY;
					l = event.pageX;
				}else
				if($(event.target).hasClass('rt')){
					w = event.pageX - resizeShift.x;
					h = resizeShift.y - event.pageY;
					t = event.pageY;
					l = resizeShift.x;
				}else
				if($(event.target).hasClass('lb')){
					w = resizeShift.x - event.pageX;
					h = event.pageY - resizeShift.y;
					t = resizeShift.y;
					l = event.pageX;
				}else
				if($(event.target).hasClass('rb')){
					w = event.pageX - resizeShift.x;
					h = event.pageY - resizeShift.y;
					t = resizeShift.y;
					l = resizeShift.x;
				} 
				$(currentActive).width(w).height(h).offset({"top":t,"left":l})
			}
		}).on("mouseup",function(event) {
			dragging = false;
			resizing = false;
		});

		function addLayer(el){
			console.log(el);
			var id = "el_"+maxID;
			var cl = $(el).attr("class").replace("--active","").replace("slide-element","");
			$(el).attr("id",id);
			layers.push({"id": id, "element" : $(el)});
			layersHTML += '<li><a class="layer" data-target="'+id+'">'+cl+'-'+$(el).text()+'</a></li>'
			$this.find(".layers ul").append('<li><a class="layer" data-target="'+id+'">'+cl+'-'+$(el).text()+'</a></li>')
			maxID++;
		}
	};
})(jQuery);