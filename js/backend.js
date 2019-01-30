(function( $ ) {
	jQuery.fn.magicSlidesBack = function(options) {

		var settings = $.extend( {
			'width'			: false,
			'height'		: false,
			'toolsPosition' : 'top',
			'useCustomCSS'	: false,
			'lang'			: 'en',
		}, options);
		var lang = {
			"ru":{
				"toolbar":"Панель инструментов",
				"text":"Текст",
				"image":"Картинка",
				"video":"Видео",
				"append_element":"Добавить элемент",
				"rezise":"Измененить размеры",
				"settings_text":"Настройки текста",
				"settings_image":"Настройки изображения",
				"settings_video":"Настройки видео",
				"align_left":"По левому краю",
				"align_center":"По центру",
				"align_right":"По правому краю",
				"black":"Черный",
				"white":"Белый",
				"red":"Красный",
				"green":"Зеленый",
				"blue":"Синий",
				"yellow":"Желтый",
				"img_src":"Ссылка на картинку",
				"delay":"Задержка(мс)",
				"no_animation":"Без анимации",
				"fade":"Появление",
				"slide_down":"Скольжение сверху",
				"slide_up":"Скольжение снизу",
				"slide_left":"Скольжение слева",
				"slide_right":"Скольжение справа",
				"animation_duration":"Скорость анимации(мс)",
				"preview":"Просмотр",
				"layers":"Элементы",
				"text_block":"Текстовый элемент",
				"align":"Выравнивание",
				"font_size":"Размер",
				"color":"Цвет",
			},
			"en":{
				"toolbar":"Toolbar",
				"text":"Text",
				"image":"Image",
				"video":"Video",
				"append_element":"Append block",
				"rezise":"Resize",
				"settings_text":"Text settings",
				"settings_image":"Image settings",
				"settings_video":"Video settings",
				"align_left":"Left side",
				"align_center":"Center",
				"align_right":"Right side",
				"black":"Black",
				"white":"White",
				"red":"Red",
				"green":"Green",
				"blue":"Blue",
				"yellow":"Yellow",
				"img_src":"Image source",
				"delay":"Delay(ms)",
				"no_animation":"Not animated",
				"fade":"Fade in",
				"slide_down":"Slide up to down",
				"slide_up":"Slide down to up",
				"slide_left":"Slide left to right",
				"slide_right":"Slide right to left",
				"animation_duration":"Animation duration(ms)",
				"preview":"Preview",
				"layers":"Blocks",
				"text_block":"Text block",
				"align":"Align",
				"font_size":"Size",
				"color":"Color",
			}
		}
		var layers = []
		var layersHTML = "";
		var maxID = 1;
		var dragging = false;
		var resizing = false;
		var resizeShift = {"x":0,"y":0}
		var resizingCorner = 0;
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
		.append('<div class="toolbars"></div>')
		.find(".toolbars")
		.append('<div class="toolbars__top">'+lang[settings.lang].toolbar+'<br><button id="toolbars_pos_left">⇤</button><button id="toolbars_pos_right">⇥</button><button id="toolbars_pos_top">⤒</button><button id="toolbars_pos_bottom">⤓</button></div>')
		.append('<select id="for_type"><option value="1">'+lang[settings.lang].text+'</option><option value="2">'+lang[settings.lang].image+'</option><option value="3">'+lang[settings.lang].video+'</option></select> -> ')
		.append('<button id="append_element">'+lang[settings.lang].append_element+'</button><br>')
		.append('<button class="tool-resize">'+lang[settings.lang].rezise+'</button><br>')
		.append('<div class="toolset --text">'+lang[settings.lang].settings_text+'<br></div>')
		.append('<div class="toolset --image">'+lang[settings.lang].settings_image+'<br></div>')
		.append('<div class="toolset --video">'+lang[settings.lang].settings_video+'<br></div>')
		// Добавление панели настроек текста
		.find('.toolset.--text')
		.append('Стили: <button id="set_bold"><b>B</b></button>')
		.append('<button id="set_italic"><i>I</i></button>')
		.append('<button id="set_underline"><u>U</u></button><br>')
		.append(lang[settings.lang].font_size+': <select id="for_textsize"></select><br>')
		.find("#for_textsize")
		.append('<option value="8">8 px</option>')
		.append('<option value="9">9 px</option>')
		.append('<option value="10">10 px</option>')
		.append('<option value="11">11 px</option>')
		.append('<option value="12">12 px</option>')
		.append('<option value="13">13 px</option>')
		.append('<option value="14">14 px</option>')
		.append('<option value="15">15 px</option>')
		.append('<option value="16">16 px</option>')
		.append('<option selected value="17">17 px</option>')
		.append('<option value="18">18 px</option>')
		.append('<option value="19">19 px</option>')
		.append('<option value="20">20 px</option>')
		.append('<option value="21">21 px</option>')
		.append('<option value="22">22 px</option>')
		.parent()
		.append(lang[settings.lang].align+': <select id="for_textalign"></select><br>')
		.find("#for_textalign")
		.append('<option value="left">'+lang[settings.lang].align_left+'</option>')
		.append('<option value="center">'+lang[settings.lang].align_center+'</option>')
		.append('<option value="right">'+lang[settings.lang].settings_right+'</option>')
		.parent()
		.append(lang[settings.lang].color+': <select id="for_textcolor"></select><br>')
		.find("#for_textcolor")
		.append('<option value="black">'+lang[settings.lang].black+'</option>')
		.append('<option value="white">'+lang[settings.lang].white+'</option>')
		.append('<option value="red">'+lang[settings.lang].red+'</option>')
		.append('<option value="green">'+lang[settings.lang].green+'</option>')
		.append('<option value="blue">'+lang[settings.lang].blue+'</option>')
		.append('<option value="yellow">'+lang[settings.lang].yellow+'</option>')
		.parent()
		.parent()
		// <-- Добавления панели настроек текста

		// Добавление панели настроек картинки
		.find('.toolset.--image')
		.append(lang[settings.lang].img_src+': <br><input type="text" value="" id="for_image_url"><br>')
		.parent()
		// <-- Добавления панели настроек картинки
		.append('<label>'+lang[settings.lang].delay+': <input type="text" id="for_delay" /></label><br>')
		.append('<select id="for_animation"></select><br>')
		.find("#for_animation")
		.append('<option value="none">'+lang[settings.lang].no_animation+'</option>')
		.append('<option value="fade">'+lang[settings.lang].fade+'</option>')
		.append('<option value="slideDown">'+lang[settings.lang].slide_down+'</option>')
		.append('<option value="slideUp">'+lang[settings.lang].slide_up+'</option>')
		.append('<option value="slideLeft">'+lang[settings.lang].slide_left+'</option>')
		.append('<option value="slideRight">'+lang[settings.lang].slide_right+'</option>')
		.parent()
		.append('<label>'+lang[settings.lang].animation_duration+': <input type="text" id="for_duration" /></label><br>')
		.append('<button class="tool-preview">'+lang[settings.lang].preview+'</button>')
		.parent()
		.append('<div class="layers"><div class="title">'+lang[settings.lang].layers+'</div><ul>'+layersHTML+'</ul></div>').find(":not(.elements, .toolbars, .layers, .elements *, .toolbars *, .layers *)").remove();

		currentActive = this.find(".elements .slide-element").removeClass('--active').last().addClass('--active')
		if(currentActive.hasClass('--text'))
			$("#for_text").val($(currentActive).text())

		//Добавление событий на тулбар
		this
		.on("click","#toolbars_pos_left", function(){
			$(".toolbars").removeClass("--pos_left --pos_right").addClass("--pos_left");
		})
		.on("click","#toolbars_pos_right", function(){
			$(".toolbars").removeClass("--pos_left --pos_right").addClass("--pos_right");
		})
		.on("click","#toolbars_pos_top", function(){
			$(".toolbars").removeClass("--pos_top --pos_bottom").addClass("--pos_top");
		})
		.on("click","#toolbars_pos_bottom", function(){
			$(".toolbars").removeClass("--pos_top --pos_bottom").addClass("--pos_bottom");
		})
		.on("change",".toolbars #for_type", function(event){
			$(".toolbars .toolset").hide();
			if($("#for_type").val()==1){
				$(".toolbars .toolset.--text").show();
			}else
			if($("#for_type").val()==2){
				$(".toolbars .toolset.--image").show();
			}else
			if($("#for_type").val()==3){
				$(".toolbars .toolset.--video").show();
			}
		})
		.on("click","#append_element", function(){
			console.log($this.find("#for_type").val())
			var el;
			$(".elements .slide-element.--active .text_bar").html($(".elements .slide-element.--active .text_bar textarea").val());
			switch($this.find("#for_type").val()){
				case 1,'1':
					$this.find(".elements").append('<div class="slide-element --text" data-delay="0" data-duration="0" data-animation="none"><div class="move_bar"></div><div class="text_bar"></div></div>');
					el = $this.find('.elements .slide-element').removeClass('--active').removeClass('--resize').last().addClass('--active').find(".text_bar").text(lang[settings.lang].text_block).parent();
				break;
				case 2,'2':
					$this.find(".elements").append('<div class="slide-element --image" data-delay="0" data-duration="0" data-animation="none"><div class="move_bar"></div><div class="image_bar"><img src="" /></div></div>');
					el = $this.find('.elements .slide-element').removeClass('--active').removeClass('--resize').last().addClass('--active').find(".image_bar img").attr("src",$("#for_image_url").val()).parent().parent();
				break;
				case 3,'3':
					$this.find(".elements").append('<div class="slide-element --image" data-delay="0" data-duration="0" data-animation="none"><div class="move_bar"></div><div class="image_bar"><img src="" /></div></div>');
					el = $this.find('.elements .slide-element').removeClass('--active').removeClass('--resize').last().addClass('--active').find(".image_bar img").attr("src",$("#for_image_url").val()).parent().parent();
				break;
			}
			$this.find(".elements .slide-element").find('.conner').remove();
			currentActive = el
			$("#for_text").val($(currentActive).text())
			addLayer(el);
		})
		.on("click",".toolbars #set_bold", function(){
			$(currentActive).find(".text_bar").toggleClass("--bold")
		})
		.on("click",".toolbars #set_italic", function(){
			$(currentActive).find(".text_bar").toggleClass("--italic")
		})
		.on("change",".toolbars #for_textsize", function(event){
			$(currentActive).find(".text_bar").removeClass("--fs8 --fs9 --fs10 --fs11 --fs12 --fs13 --fs14 --fs15 --fs16 --fs17 --fs18 --fs19 --fs20 --fs21 --fs22").addClass("--fs"+$(".toolbars #for_textsize").val());
			//Обновление размеров блока
			w = $(currentActive).find(".text_bar .sizer").width();
			h = $(currentActive).find(".text_bar .sizer").height();
			if(w<90)
				w = 90;
			if(h<50)
				h = 50;
			$(currentActive).width(w+30).height(h)
		})
		.on("change",".toolbars #for_textalign", function(event){
			$(currentActive).find(".text_bar").removeClass("--left --center --right").addClass("--"+$(".toolbars #for_textalign").val());
		})
		.on("click",".toolbars .tool-preview", function(){
			//Постобработка слайда
			$this.find(".elements .slide-element.--active .text_bar").html($this.find(".elements .slide-element.--active .text_bar textarea").val())
			$this.find(".elements .slide-element").removeClass('--active').removeClass('--resize').find('.conner').remove();
			$("#modal .content").html($this.find(".elements").html()).addClass('magicSlide').magicSlidesFront().parent().addClass('show');
			$("#modal .close").click(function(){
				$("#modal").removeClass('show');
			});
		})
		.on("change","#for_animation", function(){
			$(currentActive).attr("data-animation",event.target.value);
		})
		.on("change","#for_textcolor", function(){
			$(currentActive).find(".text_bar").removeClass("--red --green --white --black --blue --yellow").addClass("--"+$("#for_textcolor").val());
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
			$(".elements .slide-element.--active .text_bar").html($(".elements .slide-element.--active .text_bar textarea").val());
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
			console.log("Cur Active")
			console.log(event.target)
			if($(event.target).hasClass('move_bar') && $(event.target).parent().hasClass('--active')){
				dragging = true;
				dragShift.x = event.pageX - $(".elements .slide-element.--active").position().left;
				dragShift.y = event.pageY - $(".elements .slide-element.--active").position().top;
			}else if($(event.target).hasClass("text_bar") && $(event.target).parent().hasClass("--active")){
				ta = $("<textarea></textarea>").val($(event.target).text())
				$(ta).on("input",function(e){
					w = $(e.target).prev().html(e.target.value.replace(/\n/g,"<br/>&nbsp;")).width();
					h = $(e.target).prev().height();
					console.log("width: "+w+", height"+h)
					if(w<90)
						w = 90;
					if(h<50)
						h = 50;
					$(e.target).parent().parent().width(w+30).height(h)
				});
				sizer = $('<div class="sizer"></div>').html($(event.target).text())
				$(event.target).html("").append(sizer).append(ta);
			}else if($(event.target).hasClass("conner")){
				resizing = true;
				if($(event.target).hasClass('lt')){
					resizingCorner = 1;
					resizeShift.x = $(currentActive).offset().left + $(currentActive).width();
					resizeShift.y = $(currentActive).offset().top + $(currentActive).height();
				}else
				if($(event.target).hasClass('rt')){
					resizingCorner = 2;
					resizeShift.x = $(currentActive).offset().left;
					resizeShift.y = $(currentActive).offset().top + $(currentActive).height();
				}else
				if($(event.target).hasClass('lb')){
					resizingCorner = 3;
					resizeShift.x = $(currentActive).offset().left + $(currentActive).width();
					resizeShift.y = $(currentActive).offset().top;
				}else
				if($(event.target).hasClass('rb')){
					resizingCorner = 4;
					resizeShift.x = $(currentActive).offset().left;
					resizeShift.y = $(currentActive).offset().top;
				}
				console.log("Start resize");
			}
			else if($(event.target).hasClass('slide-element') || $(event.target).parent().hasClass('slide-element')){
				$(".elements .slide-element.--active .text_bar").html($(".elements .slide-element.--active .text_bar textarea").val());
				$(".elements .slide-element").removeClass('--active').removeClass('--resize').find('.conner').remove();
				currentActive = $(event.target).hasClass("slide-element'") ? $(event.target).addClass('--active') : $(event.target).parent().addClass('--active');
				if($(currentActive).hasClass('--text'))
					$("#for_text").val($(currentActive).text())
				$("#for_delay").val($(currentActive).attr("data-delay"));
				$("#for_duration").val($(currentActive).attr("data-duration"));
				$("#for_animation").val($(currentActive).attr("data-animation"));
			}
		}).on("mousemove",function(event) {
			if(dragging){
				var x = event.pageX - dragShift.x;
				var y = event.pageY - dragShift.y;
				$this.find(".slide-element.--active").css({'top':y+"px", 'left':x+"px"})
			}else
			if(resizing){
				if(resizingCorner==1){
					w = resizeShift.x - event.pageX;
					h = resizeShift.y - event.pageY;
					t = event.pageY;
					l = event.pageX;
				}else
				if(resizingCorner==2){
					w = event.pageX - resizeShift.x;
					h = resizeShift.y - event.pageY;
					t = event.pageY;
					l = resizeShift.x;
				}else
				if(resizingCorner==3){
					w = resizeShift.x - event.pageX;
					h = event.pageY - resizeShift.y;
					t = resizeShift.y;
					l = event.pageX;
				}else
				if(resizingCorner==4){
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
			resizingCorner = 0;
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