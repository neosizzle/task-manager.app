
// document.addEventListener("DOMContentLoaded" , (event)=>{
//     console.log(firebase.app())
    
// })


const googleLogin = ()=>{
    var provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth()
    .signInWithPopup(provider)
    .then((result) => {
        /** @type {firebase.auth.OAuthCredential} */
        var credential = result.credential;

        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = credential.accessToken;

        // The signed-in user info.
        var user = result.user;

        
        // set user into db
        //initialize cloud firestore
        var firestore = firebase.firestore()
        const docRef = firestore.doc(`users/${user.uid}`);

        //check if user exists
        docRef.get().then(async (snapshot)=>{

          //user exists in db
            if(snapshot.exists){
              return location.href = `../dashboard.html?userId=${user.uid}`
            }else{
              //user does not exist
              try{
                await docRef.set({
                  uid : user.uid,
                  email : user.email,
                  tasks :{
                    taskArray : []
                  }
                })
              }catch(error){
                var errorMessage = error.message;
          
                succDiv.setAttribute('hidden' , 'hidden')
                warningDiv.innerHTML = errorMessage
                warningDiv.removeAttribute('hidden')
      
                return
              }

            }
        })




        location.href = `../dashboard.html?userId=${user.uid}`


    }).catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        
        //show error message
        succDiv.setAttribute('hidden' , 'hidden')
          warningDiv.innerHTML = errorMessage
          warningDiv.removeAttribute('hidden')
    });
}


//use http://localhost:5000?fake=true
const facebookLogin = ()=>{

    var provider = new firebase.auth.FacebookAuthProvider();


firebase.auth()
.signInWithPopup(provider)
.then((result) => {
    /** @type {firebase.auth.OAuthCredential} */
    var credential = result.credential;

    // The signed-in user info.
    var user = result.user;

    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
    var accessToken = credential.accessToken;

     // set user into db
        //initialize cloud firestore
        var firestore = firebase.firestore()
        const docRef = firestore.doc(`users/${user.uid}`);

        //check if user exists
        docRef.get().then(async (snapshot)=>{

          //user exists in db
            if(snapshot.exists){
              location.href = `../dashboard.html?userId=${user.uid}`
              return
            }else{
              //user does not exist
              try{
                await docRef.set({
                  uid : user.uid,
                  email : user.email,
                  tasks : {
                    taskArray : []
                  }
                })
              }catch(error){
                var errorMessage = error.message;
          
                succDiv.setAttribute('hidden' , 'hidden')
                warningDiv.innerHTML = errorMessage
                warningDiv.removeAttribute('hidden')
      
                return
              }

            }
        })



    location.href = `../dashboard.html?userId=${user.uid}`
  })
  .catch((error) => {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;

    //show error message
    succDiv.setAttribute('hidden' , 'hidden')
    warningDiv.innerHTML = errorMessage
    warningDiv.removeAttribute('hidden')
  });
}


const emailLogin= ()=>{


//get email and password fields from index
let txtEmail = document.getElementById('email')
let txtPw = document.getElementById('password')


let email = txtEmail.value
let password = txtPw.value




firebase.auth().signInWithEmailAndPassword(email, password)
  .then((userCredential) => {
    // Signed in 
    var user = userCredential.user;
    location.href = `../dashboard.html?userId=${user.uid}`
    // ...
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;

    //make warning message visible
    let warningDiv = document.getElementById('warningMessage')
    warningDiv.innerHTML = errorMessage
    warningDiv.removeAttribute('hidden')
    // ..
  });
  
}