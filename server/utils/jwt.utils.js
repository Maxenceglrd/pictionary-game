const jwt = require('jsonwebtoken');

const JWT_SIGN_SECRET = "ia60fpBjWgfjJjXP7vtZ0od7p4Zj0iitGl97189OinYZJaPRjdFL2jxocDp3s494BAFBrihO9F5v4r0D1K9nZ";

module.exports = {
	generateTokenForUser: function(userData){
		return jwt.sign({
			userId: userData.id,
			userName: userData.name,
			isAdmin: userData.isAdmin
		},
		JWT_SIGN_SECRET,
		{
			expiresIn: '1h'
		}
		);
	},

	parseAuthorization: function(authorization){
		return (authorization != null) ? authorization.replace('Bearer ','') : null;
	},
	getUserId : function(authorization){
		var userId = -1;
		var token = module.exports.parseAuthorization(authorization);
		if (token != null){
			try {
				var jwtToken = jwt.verify(token, JWT_SIGN_SECRET);
				if (jwtToken != null){
					userId = jwtToken.userId;
				}

			} catch(err) {}
		}
		return userId;
	}
}
