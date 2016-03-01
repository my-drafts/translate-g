
$(document).ready(function(){
	$('#translate-test-add').bind('click', function(){
		var key = $('#translate-test-add-key').val().trim(), value = $('#translate-test-add-value').val().trim(), o = {};
		$('#translate-test-add-key').val('');
		$('#translate-test-add-value').val('');
		if(key && value && key.match(/^[\w\d\-\_]+$/ig)){
			o[key] = value;
			var html = '<div>' +
				'<input type="hidden" value="'+encodeURI(JSON.stringify(o))+'" />' +
				'<span>'+key+' : '+value+'</span>&nbsp;' +
				'<input type="button" value=" - " onclick="$(this).parent().remove();">' +
				'</div>';
			$('div#translate-test-data').append(html);
		}
		return false;
	});
	$('form#translate-test').bind('submit', function(event){
		//event.preventDefault();
		var data = {};
		$('div#translate-test-data input[type=hidden]').each(function(i, e){
			Object.assign(data, JSON.parse(decodeURI($(e).val())));
		});
		$('form#translate-test').append('<input type="hidden" name="data" value="'+encodeURI(JSON.stringify(data))+'" />');
		//alert('submit:' + $( this ).serialize());
		//$('form#translate-test > input[type=hidden]').remove();
		return true;
	});
});
