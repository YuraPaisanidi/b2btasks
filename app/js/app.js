'use strict';

document.addEventListener("DOMContentLoaded", function() {

	// ----------------------SLIDER-hero----------------------
		var mySwiper = new Swiper('.product__slider', {
			// slidesPerView: 1,
			// spaceBetween: 30,
			navigation: {
				nextEl: ".swiper-button-next",
				prevEl: ".swiper-button-prev",
			},
		});

	//----------------------SCROLL-----------------------
		const scrollTo = (scrollTo) => {
			let list = document.querySelector(scrollTo);
			list = '.' + list.classList[0]  + ' li a[href^="#"';
	
			document.querySelectorAll(list).forEach(link => {
	
				link.addEventListener('click', function(e) {
						e.preventDefault();
						const scrollMenu = document.querySelector(scrollTo);
	
						let href = this.getAttribute('href').substring(1);
	
						const scrollTarget = document.getElementById(href);
	
						// const topOffset = scrollMenu.offsetHeight;
						const topOffset = 70;
						const elementPosition = scrollTarget.getBoundingClientRect().top;
						const offsetPosition = elementPosition - topOffset;
	
						window.scrollBy({
								top: offsetPosition,
								behavior: 'smooth'
						});
	
						
						let button = document.querySelector('.hamburger'),
								nav = document.querySelector('.header__nav'),
								header = document.querySelector('.header');
	
						button.classList.remove('hamburger--active');
						nav.classList.remove('header__nav--active');
						header.classList.remove('header--menu');
				});
			});
		};
		// scrollTo('.header__nav');
	
	//----------------------FIXED-HEADER-----------------------
		const headerFixed = (headerFixed, headerActive) => {
			const header =  document.querySelector(headerFixed),
						active = headerActive.replace(/\./, '');
	
			window.addEventListener('scroll', function() {
				const top = pageYOffset;
				
				if (top >= 90) {
					header.classList.add(active);
				} else {
					header.classList.remove(active);
				}
	
			});
	
		};
		// headerFixed('.header', '.header--active');
	
	//----------------------HAMBURGER-----------------------
		const hamburger = (hamburgerButton, hamburgerNav, hamburgerHeader) => {
			const button = document.querySelector(hamburgerButton),
						nav = document.querySelector(hamburgerNav),
						header = document.querySelector(hamburgerHeader);
	
			button.addEventListener('click', (e) => {
				button.classList.toggle('hamburger--active');
				nav.classList.toggle('header__nav--active');
				header.classList.toggle('header--menu');
			});
	
		};
		hamburger('.hamburger', '.header__nav', '.header');
		
	//----------------------MODAL-----------------------
		const modals = (modalSelector) => {
			const	modal = document.querySelectorAll(modalSelector);

			if (modal) {
				let i = 1;

				modal.forEach(item => {
					const wrap = item.id;
					const link = document.querySelectorAll('.' + wrap);

					link.forEach(linkItem => {
						let close = item.querySelector('.close');
							if (linkItem) {
								linkItem.addEventListener('click', (e) => {
									if (e.target) {
										e.preventDefault();
									}
									item.classList.add('active');
								});
							}

							if (close) {
								close.addEventListener('click', () => {
									item.classList.remove('active');
								});
							}

						item.addEventListener('click', (e) => {
							if (e.target === item) {
								item.classList.remove('active');
							}
						});
					});
				});
			}

		};
		modals('.modal');

	//----------------------FORM-----------------------
		const forms = (formsSelector) => {
		const form = document.querySelectorAll(formsSelector);
		let i = 1;
		let img = 1;
		let lebel = 1;
		let prev = 1;

		form.forEach(item => {
			const elem = 'form--' + i++;
			item.classList.add(elem);

			let formId = item.id = (elem);
			let formParent = document.querySelector('#' + formId);

			formParent.addEventListener('submit', formSend);

			async function formSend(e) {
				e.preventDefault();

				let error = formValidate(item);

				let formData = new FormData(item);

				if (error === 0) {
					item.classList.add('_sending');
					let response = await fetch('sendmail.php', {
						method: 'POST',
						body: formData
					});

					if (response.ok) {
						let modalThanks = document.querySelector('#modal__thanks');
						formParent.parentNode.style.display = 'none';

						modalThanks.classList.add('active');
						item.reset();
						item.classList.remove('_sending');
					} else {
						alert('Ошибка при отправке');
						item.classList.remove('_sending');
					}

				}
			}

			function formValidate(item) {
				let error = 0;
				let formReq = formParent.querySelectorAll('._req');

				for (let index = 0; index < formReq.length; index++) {
					const input = formReq[index];
					// formRemoveError(input);

					if (input.classList.contains('_email')) {
						if(emailTest(input)) {
							formAddErrorEmail(input);
							error++;
						}
					} else if (input.getAttribute('type') === 'checkbox' && input.checked === false) {
						formAddErrorCheck(input);
						error++;
					} else {
						if (input.value === '') {
							formAddError(input);
							error++;
						}
					}
				}
				return error;
			}

			const formImgFile = formParent.querySelectorAll('.formImgFile');

			formImgFile.forEach(item => { 
				const elem = 'formImgFile--' + i++;

				let formId = item.id = (elem);
				let formParent = document.querySelector('#' + formId);

				const formImage = formParent.querySelector('.formImage');
				const formLebel = formParent.querySelector('.formLebel');
				const formPreview = formParent.querySelector('.formPreview');

				//картинка в форме
				let formImageNumber = 'formImage--' + img++;
				let formPreviewNumber = 'formPreview--' + prev++;
				
				formImage.id = (formImageNumber);
				formLebel.htmlFor = ('formImage--' + lebel++);
				formPreview.id = (formPreviewNumber);
				const formImageAdd = document.querySelector('#' + formImageNumber);

				// изменения в инпуте файл
				formImageAdd.addEventListener('change', () =>  {
					uploadFile(formImage.files[0]);
				});

				function uploadFile(file) {
			
					if (!['image/jpeg', 'image/png', 'image/gif', 'image/ico', 'application/pdf'].includes(file.type)) {
						alert('Только изображения');
						formImage.value = '';
						return;
					}
			
					if (file.size > 2 * 1024 * 1024) {
						alert('Размер менее 2 мб.');
						return;
					}
			
					var reader = new FileReader();
					reader.onload = function (e) {
						if(['application/pdf'].includes(file.type)) {
							formPreview.innerHTML = `Файл выбран`;
						}else{
							formPreview.innerHTML = `<img src="${e.target.result}" alt="Фото">`;
						}
						
					};
					reader.onerror = function (e) {
						alert('Ошибка');
					};
					reader.readAsDataURL(file);
				}
			})

			function formAddError(input) {
				let div = document.createElement('div');
				div.classList.add("form__error");
				div.innerHTML = "Введите данные в поле";

				input.parentElement.append(div);
				input.parentElement.classList.add('_error');
				input.classList.add('_error');
			}

			function formAddErrorEmail(input) {
				let div = document.createElement('div');
				div.classList.add("form__error");
				div.innerHTML = "Введите свою почту";

				input.parentElement.append(div);
				input.parentElement.classList.add('_error');
				input.classList.add('_error');
			}

			function formAddErrorCheck(input) {
				let div = document.createElement('div');
				div.classList.add("form__error");
				div.innerHTML = "Согласие на обработку персональных данных";

				input.parentElement.append(div);
				input.parentElement.classList.add('_error');
				input.classList.add('_error');
			}

			function emailTest(input) {
				return !/^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/. test(input.value);
			}

		});
		};
		forms('.form');


//---------------Credit card mask-------------

		window.onload = function () {
			const cardnumber = document.getElementById('cardNumber');
		
			let cctype = null;
		
			//Mask the Credit Card Number Input
			var cardnumber_mask = new IMask(cardnumber, {
				mask: [{
						mask: '0000 000000 00000',
						regex: '^3[47]\\d{0,13}',
						cardtype: 'american express'
					},
					{
						mask: '0000 0000 0000 0000',
						regex: '^(?:6011|65\\d{0,2}|64[4-9]\\d?)\\d{0,12}',
						cardtype: 'discover'
					},
					{
						mask: '0000 000000 0000',
						regex: '^3(?:0([0-5]|9)|[689]\\d?)\\d{0,11}',
						cardtype: 'diners'
					},
					{
						mask: '0000 0000 0000 0000',
						regex: '^(5[1-5]\\d{0,2}|22[2-9]\\d{0,1}|2[3-7]\\d{0,2})\\d{0,12}',
						cardtype: 'mastercard'
					},
					// {
					//     mask: '0000-0000-0000-0000',
					//     regex: '^(5019|4175|4571)\\d{0,12}',
					//     cardtype: 'dankort'
					// },
					// {
					//     mask: '0000-0000-0000-0000',
					//     regex: '^63[7-9]\\d{0,13}',
					//     cardtype: 'instapayment'
					// },
					{
						mask: '0000 000000 00000',
						regex: '^(?:2131|1800)\\d{0,11}',
						cardtype: 'jcb15'
					},
					{
						mask: '0000 0000 0000 0000',
						regex: '^(?:35\\d{0,2})\\d{0,12}',
						cardtype: 'jcb'
					},
					{
						mask: '0000 0000 0000 0000',
						regex: '^(?:5[0678]\\d{0,2}|6304|67\\d{0,2})\\d{0,12}',
						cardtype: 'maestro'
					},
					// {
					//     mask: '0000-0000-0000-0000',
					//     regex: '^220[0-4]\\d{0,12}',
					//     cardtype: 'mir'
					// },
					{
						mask: '0000 0000 0000 0000',
						regex: '^4\\d{0,15}',
						cardtype: 'visa'
					},
					{
						mask: '0000 0000 0000 0000',
						regex: '^62\\d{0,14}',
						cardtype: 'unionpay'
					},
					{
						mask: '0000 0000 0000 0000',
						cardtype: 'Unknown'
					}
				],
				dispatch: function (appended, dynamicMasked) {
					var number = (dynamicMasked.value + appended).replace(/\D/g, '');
		
					for (var i = 0; i < dynamicMasked.compiledMasks.length; i++) {
						let re = new RegExp(dynamicMasked.compiledMasks[i].regex);
						if (number.match(re) != null) {
							return dynamicMasked.compiledMasks[i];
						}
					}
				}
			});
		
		
		};

	});

//------------------Refill page steps---------------
const nextStep = () => {
	document.querySelector('.refill__step--1').classList.remove('active');
	document.querySelector('.refill__step--2').classList.add('active');
}

const getFinalLink = () => {
	let link = document.querySelector('input[type=radio]:checked').value;
	document.querySelector('#finalLink').href = link;
}

document.querySelector('#refillNextStep').addEventListener('click', nextStep);

