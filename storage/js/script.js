
$(document).ready(function(){
	$('#translate-test-add').bind('click', function(){
		var key = $('#translate-test-add-key').val().trim();
		var value = $('#translate-test-add-value').val().trim();
		$('#translate-test-add-key').val('');
		$('#translate-test-add-value').val('');
		if(key && value && key.match(/^[\w\d\-\_]+$/ig)){
			var keyValue = {};
			keyValue[key] = value;
			keyValue = JSON.stringify(keyValue);
			keyValue = encodeURI(keyValue);
			var wrapperHidden = $('<input>').attr('type', 'hidden').val(keyValue);
			var wrapperVisible = $('<span></span>').text(key+' : '+value);
			var wrapperRemove = $('<input>').attr('type', 'button').css('margin-left', '12px').val(' - ').click(function(){
				$(this).parent().remove();
				return false;
			});
			var wrapper = $("<div></div>");
			$(wrapper).append(wrapperHidden);
			$(wrapper).append(wrapperVisible);
			$(wrapper).append(wrapperRemove);
			$('div#translate-test-data').append(wrapper);
		}
		return false;
	});
	$('form#translate-test').bind('submit', function(event){
		//event.preventDefault();
		var data = {};
		$('div#translate-test-data input[type=hidden]').each(function(index, input){
			var keyValue = $(input).val();
			keyValue = decodeURI(keyValue);
			keyValue = JSON.parse(keyValue);
			Object.assign(data, keyValue);
		});
		data = JSON.stringify(data);
		data = encodeURI(data);
		var sendData = $('<input>').attr('type', 'hidden').attr('name', 'data').val(data);
		$('form#translate-test').append(sendData);
		$('div#translate-test-data > div').remove();
		return true;
		//alert('submit:' + $( this ).serialize());
	});
});
