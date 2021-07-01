var baseFusionAuthURL = 'http://localhost:9011';
var grantType = 'urn:ietf:params:oauth:grant-type:device_code';
var clientId = 'c6b9de0c-2f71-4019-920b-58bc2d4206fc';
var tokenEndpoint;
var expiresIn;
var intervalSeconds = 5;
var deviceCode;
var pollId;
var deviceAuthEndpoint;
var accessToken;

// retrieve the device_authorization_endpoint and token_endpoint
$(document).ready(function() {
	$.ajax({
		type: 'GET',
		url: baseFusionAuthURL + '/.well-known/openid-configuration',
		datatype: 'json',
		success: function(data) {
			deviceAuthEndpoint = data.device_authorization_endpoint;
			tokenEndpoint = data.token_endpoint;
		}
	});

	// Load saved values
	const config = JSON.parse(localStorage.getItem('config') || '{}');
	for (const key in config) {
		$("input[name='" + key + "'],textarea[name='" + key + "']").val(config[key]);
	}

	$("#connect-button").click(connectDevice);
	$("#reset-button").click(reset);
	$('input,textarea').on('keyup', function(e) {
		const target = $(e.target);
		const config = JSON.parse(localStorage.getItem('config') || '{}');
		config[target.attr('name')] = target.val();
		localStorage.setItem('config', JSON.stringify(config));
	});
});

// call the device_authorization_endpoint, display the verification_uri and user_code, then start polling /token endpoint
function connectDevice() {
	const idpId = $('input[name="identityProviderId"]').val();
	const idpToken = $('textarea[name="identityProviderToken"]').val();
	$.ajax({
		type: 'POST',
		url: deviceAuthEndpoint,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		data: {
			'client_id': clientId,
			'scope': 'offline_access idp-link:' + idpId + ':' + idpToken,
			'metaData.device.name': 'Demo TV app',
			'metaData.device.type': 'TV'
		},
		datatype: 'json',
		success: function(data) {
			expiresIn = data.expires_in;
			intervalSeconds = data.interval;
			deviceCode = data.device_code;

			// make user_code a little more readable
			let userCode = data.user_code;
			let ucLen = userCode.length / 2;
			userCode = userCode.substring(0,ucLen) + "-" + userCode.substring(ucLen);

			// Remove the schema to make it simpler on screen
			$("#device-url").text(data.verification_uri.replace("http://", "").replace("https://", ""));

			$("#user-code").text(userCode);
			$("#connect-device").hide();
			$("#sign-in").show();

			// generate a qr code from the verification_uri_complete
			$("#qrcode").empty();
			new QRCode(document.getElementById("qrcode"), {
			    text: data.verification_uri_complete,
			    width: 150,
			    height:150
			});
			$("#qrlink").attr("href", data.verification_uri_complete)
					        .attr("target", "_blank");

			pollForToken();
		},
		error: function(data) {
			$("#error-msg").show();
		}
	});
}

// poll the token endpoint, displaying success or error messages, and adjusting polling interval as appropriate
function pollForToken() {
	pollId = setInterval(function() {
		$.ajax({
			type: 'POST',
			url: tokenEndpoint,
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",
			data: {'device_code': deviceCode, 'grant_type': grantType, 'client_id': clientId},
			datatype: 'json',
			success: function(data) {
		  		clearInterval(pollId);
		  		// use the access_token
		  		accessToken = data.access_token;
		  		$("#sign-in").hide();
		  		$("#success-msg").show();
		  		$("#fa-tut").attr("src", $("#configured-url").val());
			},
			error: function(data) {
				let err = $.parseJSON(data.responseText);
				if (err.error == 'slow_down') {
					clearInterval(pollId);
					// spec says to add 5 seconds to all subsequent calls if this happens
					intervalSeconds += 5;
					pollForToken();
				} else if (err.error == 'authorization_pending') {
					// keep polling
				} else {
					// an invalid request occurred, nothing to do but to stop and let user try again
					clearInterval(pollId);
					$("#sign-in").hide();
					$("#connect-device").show();
					$("#error-msg").show();
				}
			}
		});
	}, intervalSeconds * 1000);
}

function reset() {
	$("#connect-device").show();
	$("#sign-in").hide();
	$("#success").hide();
	$("#fa-tut").hide();
	if (pollId) {
		clearInterval(pollId);
	}
}
