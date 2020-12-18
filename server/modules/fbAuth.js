const { firebase, admin } = require('./fbConfig');

module.exports = (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer', '').trim()
    //var user = firebase.auth().currentUser;
    //if (user) {
        admin.auth().verifyIdToken(token)
        .then(function (decodedToken) {
          
                req.user = decodedToken
                return next()
           
        }).catch(function (error) {
            //Handle error
			res.send(error)
			res.send(token)
            //res.end()
        });
    //} else {
    //    console.log(token);
    //    console.log("There is no current user.");
    //}
};