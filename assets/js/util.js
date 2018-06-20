(function($) {

	/**

	 * @return {jQuery} jQuery object.
	 */
	$.fn.navList = function() {

		var	$this = $(this);
			$a = $this.find('a'),
			b = [];

		$a.each(function() {

			var	$this = $(this),
				indent = Math.max(0, $this.parents('li').length - 1),
				href = $this.attr('href'),
				target = $this.attr('target');

			b.push(
				'<a ' +
					'class="link depth-' + indent + '"' +
					( (typeof target !== 'undefined' && target != '') ? ' target="' + target + '"' : '') +
					( (typeof href !== 'undefined' && href != '') ? ' href="' + href + '"' : '') +
				'>' +
					'<span class="indent-' + indent + '"></span>' +
					$this.text() +
				'</a>'
			);

		});

		return b.join('');

	};

	/**
	 * Panel-ify an element.
	 * @param {object} userConfig User config.
	 * @return {jQuery} jQuery object.
	 */
	$.fn.panel = function(userConfig) {

			if (this.length == 0)
				return $this;

			if (this.length > 1) {

				for (var i=0; i < this.length; i++)
					$(this[i]).panel(userConfig);

				return $this;

			}

		// Vars.
			var	$this = $(this),
				$body = $('body'),
				$window = $(window),
				id = $this.attr('id'),
				config;


				if (typeof config.target != 'jQuery')
					config.target = $(config.target);

		// Panel.

			// Methods.
				$this._hide = function(event) {


					// 이미 패널이 숨겨져 있을 경우
						if (!config.target.hasClass(config.visibleClass))
							return;


					// 이벤트가 진행됐을 경우 취소
						if (event) {

							event.preventDefault();
							event.stopPropagation();

						}

					// 숨김
						config.target.removeClass(config.visibleClass);

					// 그림 숨기기.
						window.setTimeout(function() {

							// 스크롤 리셋.
								if (config.resetScroll)
									$this.scrollTop(0);

							// 폼 리셋.
								if (config.resetForms)
									$this.find('form').each(function() {
										this.reset();
									});

						}, config.delay);

				};

			// css 설정
				$this
					.css('-ms-overflow-style', '-ms-autohiding-scrollbar')
					.css('-webkit-overflow-scrolling', 'touch');

			// 클릭이벤트(숨김).
				if (config.hideOnClick) {

					$this.find('a')
						.css('-webkit-tap-highlight-color', 'rgba(0,0,0,0)');

					$this
						.on('click', 'a', function(event) {

							var $a = $(this),
								href = $a.attr('href'),
								target = $a.attr('target');

							if (!href || href == '#' || href == '' || href == '#' + id)
								return;

							// 이벤트 취소.
								event.preventDefault();
								event.stopPropagation();

							// 패널 숨김(모바일).
								$this._hide();

							// 리다이렉트 하이퍼링크.
								window.setTimeout(function() {

									if (target == '_blank')
										window.open(href);
									else
										window.location.href = href;

								}, config.delay + 10);

						});

				}

			// 터치 발생시 처리.
				$this.on('touchstart', function(event) {

					$this.touchPosX = event.originalEvent.touches[0].pageX;
					$this.touchPosY = event.originalEvent.touches[0].pageY;

				})

				$this.on('touchmove', function(event) {

					if ($this.touchPosX === null
					||	$this.touchPosY === null)
						return;

					var	diffX = $this.touchPosX - event.originalEvent.touches[0].pageX,
						diffY = $this.touchPosY - event.originalEvent.touches[0].pageY,
						th = $this.outerHeight(),
						ts = ($this.get(0).scrollHeight - $this.scrollTop());


						if (config.hideOnSwipe) {

							var result = false,
								boundary = 20,
								delta = 50;

							switch (config.side) {

								case 'left':
									result = (diffY < boundary && diffY > (-1 * boundary)) && (diffX > delta);
									break;

								case 'right':
									result = (diffY < boundary && diffY > (-1 * boundary)) && (diffX < (-1 * delta));
									break;

								case 'top':
									result = (diffX < boundary && diffX > (-1 * boundary)) && (diffY > delta);
									break;

								case 'bottom':
									result = (diffX < boundary && diffX > (-1 * boundary)) && (diffY < (-1 * delta));
									break;

								default:
									break;

							}

							if (result) {

								$this.touchPosX = null;
								$this.touchPosY = null;
								$this._hide();

								return false;

							}

						}

					// 스크롤이 너무 상하단으로 가지 않도록 방지.
						if (($this.scrollTop() < 0 && diffY < 0)
						|| (ts > (th - 2) && ts < (th + 2) && diffY > 0)) {

							event.preventDefault();
							event.stopPropagation();

						}

				});

			//페널 내부의 특정 이벤트 꼬임 방지
				$this.on('click touchend touchstart touchmove', function(event) {
					event.stopPropagation();
				});

			// 메뉴 버튼 클릭시 패널 숨기기
				$this.on('click', 'a[href="#' + id + '"]', function(event) {

					event.preventDefault();
					event.stopPropagation();

					config.target.removeClass(config.visibleClass);

				});

		// Body.

			// 컨텐츠 클릭시 패널 숨기기.
				$body.on('click touchend', function(event) {
					$this._hide(event);
				});


				$body.on('click', 'a[href="#' + id + '"]', function(event) {

					event.preventDefault();
					event.stopPropagation();

					config.target.toggleClass(config.visibleClass);

				});

		// Window.

			// ESC 누르면 패널 숨기기
				if (config.hideOnEscape)
					$window.on('keydown', function(event) {

						if (event.keyCode == 27)
							$this._hide(event);

					});

		return $this;

	};

	/**
	 * @return {jQuery} jQuery object.
	 */
	$.fn.placeholder = function() {
			if (typeof (document.createElement('input')).placeholder != 'undefined')
				return $(this);


			if (this.length == 0)
				return $this;


			if (this.length > 1) {

				for (var i=0; i < this.length; i++)
					$(this[i]).placeholder();

				return $this;

			}

		// Vars.
			var $this = $(this);


			// 모바일 패널 이벤트 처리
				$this
					.on('submit', function() {

						$this.find('input[type=text],input[type=password],textarea')
							.each(function(event) {

								var i = $(this);

								if (i.attr('name').match(/-polyfill-field$/))
									i.attr('name', '');

								if (i.val() == i.attr('placeholder')) {

									i.removeClass('polyfill-placeholder');
									i.val('');

								}

							});

					})
					.on('reset', function(event) {

						event.preventDefault();

						$this.find('select')
							.val($('option:first').val());

						$this.find('input,textarea')
							.each(function() {

								var i = $(this),
									x;

								i.removeClass('polyfill-placeholder');

								switch (this.type) {

									case 'submit':
									case 'reset':
										break;

									case 'password':
										i.val(i.attr('defaultValue'));

										x = i.parent().find('input[name=' + i.attr('name') + '-polyfill-field]');

										if (i.val() == '') {
											i.hide();
											x.show();
										}
										else {
											i.show();
											x.hide();
										}

										break;

									case 'checkbox':
									case 'radio':
										i.attr('checked', i.attr('defaultValue'));
										break;

									case 'text':
									case 'textarea':
										i.val(i.attr('defaultValue'));

										if (i.val() == '') {
											i.addClass('polyfill-placeholder');
											i.val(i.attr('placeholder'));
										}

										break;

									default:
										i.val(i.attr('defaultValue'));
										break;

								}
							});

					});

			return $this;

		};

	/**
	 * 각 부모 요소의 첫 번째 위치로 이동
	 * @param {jQuery} $elements 이동할 요소
	 * @param {bool} condition 맞을경우 맨위로, 아니면 복귀.
	 */
	$.prioritize = function($elements, condition) {

		var key = '__prioritize';

		//
			if (typeof $elements != 'jQuery')
				$elements = $($elements);

		//
			$elements.each(function() {

				var	$e = $(this), $p,
					$parent = $e.parent();

				//
					if ($parent.length == 0)
						return;

				//패널 미이동시 이동
					if (!$e.data(key)) {


							if (!condition)
								return;

						// 패널 위치 포인터 가져옴
							$p = $e.prev();

							// 아무것도 온 정보가 없을경우 0으로 복귀
								if ($p.length == 0)
									return;

						// 상위로 이동
							$e.prependTo($parent);

						// 요소가 이동된걸로 포인터에 표기
							$e.data(key, $p);

					}

				//이미 이동됐을 경우
					else {


							if (condition)
								return;

						$p = $e.data(key);

						// 원래 위치로 이동
							$e.insertAfter($p);

						// 마킹 제거
							$e.removeData(key);

					}

			});

	};

})(jQuery);
