
const emailSignup = () =>{

//initialize cloud firestore
var firestore = firebase.firestore()

//get email and password fields from index
let txtEmail = document.getElementById('email')
let txtPw = document.getElementById('password')


let email = txtEmail.value
let password = txtPw.value

//success and error message handling
let succDiv = document.getElementById('successMessage')
let warningDiv = document.getElementById('warningMessage')



firebase.auth().createUserWithEmailAndPassword(email, password)
  .then(async (userCredential) => {
    // user created
    var user = userCredential.user;

        //adds user in db
        const docRef = firestore.doc(`users/${user.uid}`);

        try{
          await docRef.set({
            uid : user.uid,
            email : email,
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
 
        //show success message
        warningDiv.setAttribute('hidden' , 'hidden')
        succDiv.innerHTML = "Sign up success!"
        succDiv.removeAttribute('hidden')



  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    
    succDiv.setAttribute('hidden' , 'hidden')
    warningDiv.innerHTML = errorMessage
    warningDiv.removeAttribute('hidden')
    

    // ..
  });

  

}