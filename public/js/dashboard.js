

document.addEventListener("DOMContentLoaded" , (event)=>{
    //console.log(firebase.auth().currentUser)



//authentication check
firebase.auth().onAuthStateChanged(async (user) => {
    if (user) {
      // User is signed in.
      let name = user.displayName;
      let email = user.email;
      let photoUrl = user.photoURL;
      let emailVerified = user.emailVerified;
      let uid = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
                      // this value to authenticate with your backend server, if
                      // you have one. Use User.getToken() instead

      //set username on dashboard
      let displayName = document.getElementById('displayName');
      displayName.innerHTML = (name == null)? email : name


      //populate task data
      //initialize cloud firestore
      var firestore = firebase.firestore()

      //get tasks
      firestore.collection(`/users`).doc(`${uid}`).get().then((document)=>{

        var tasks = document.data().tasks


        tasks.taskArray.forEach((task)=>{
          initialPopulate(task.title , task.id, task.desc, task.date)
        })
      
      })
    

    

    } else {
      // No user is signed in.
      //redirect to home page
      window.location.replace("../index.html")
      
    }
  });

})

//initial data population
const initialPopulate = (taskTitle, taskId, taskDesc, taskDate)=>{
 

    //get parent
    const list = document.getElementById("taskList")

    //create new task card
    const card = document.createElement('div');
    card.classList = "item features-image сol-12 col-md-6 col-lg-3"
    card.setAttribute('id' , taskId);

      //task elements
      const content = `
        <div class="item-wrapper">
        <div class="item-img">
            <img src="assets/images/features1.jpg">
        </div>
        <div class="item-content">
            <h5 class="item-title mbr-fonts-style display-5" id = "taskTitle">${taskTitle}</h5>
            
            <p class="mbr-text mbr-fonts-style mt-3 display-7" id = "taskDesc">
                ${taskDesc}
            </p>

            <p class = "mbr-text mbr-fonts-style mt-3 display-7" id = "taskDate">${taskDate}</p>

        </div>
        <div class="mbr-section-btn item-footer mt-2" onclick = "populateInput(this)" data-toggle="modal" data-target="#editTaskModal">
            <a disabled class="btn btn-primary item-btn display-7">Edit
                </a>
        </div>
        <div class="mbr-section-btn item-footer mt-2"  onclick = "deleteTask(this)">
            <a disabled class="btn btn-danger item-btn display-7">Delete
                </a>
        </div>
      </div>


       `


      //append task to tasklist
      card.innerHTML = content
      list.appendChild(card)

}

//logout
const logout = ()=>{
  firebase.auth().signOut().then(() => {
    // Sign-out successful.
    window.location.replace("../index.html")

  }).catch((error) => {
    // An error happened.
    console.log(error)
  });
}


//add task
const addTask = () =>{

  //get parent
  const list = document.getElementById("taskList")

  //create new task
  const card = document.createElement('div');
  card.classList = "item features-image сol-12 col-md-6 col-lg-3"
  

  const date = document.getElementById("dateInput").value
  const title = document.getElementById("titleInput").value
  const desc = document.getElementById("descInput").value

  //create task in db

  taskId = generateTaskId()
  card.setAttribute('id' , taskId);

  //empty task check
  if(title == ''){
    alert("Title cant be empty")
    return
  }

  //task elements
  const content = `
  <div class="item-wrapper">
  <div class="item-img">
      <img src="assets/images/features1.jpg">
  </div>
  <div class="item-content">
      <h5 class="item-title mbr-fonts-style display-5" id = "taskTitle">${title}</h5>
      
      <p class="mbr-text mbr-fonts-style mt-3 display-7" id = "taskDesc">
          ${desc}
      </p>

      <p class = "mbr-text mbr-fonts-style mt-3 display-7" id = "taskDate">${date}</p>

  </div>
  <div class="mbr-section-btn item-footer mt-2" onclick = "populateInput(this)" data-toggle="modal" data-target="#editTaskModal">
      <a disabled class="btn btn-primary item-btn display-7">Edit
          </a>
  </div>
  <div class="mbr-section-btn item-footer mt-2"  onclick = "deleteTask(this)">
      <a disabled class="btn btn-danger item-btn display-7">Delete
          </a>
  </div>
</div>


  `

  //append task to tasklist
  card.innerHTML = content
  list.appendChild(card)


  //append task to db
  //initialize cloud firestore
  var firestore = firebase.firestore()

  //get id from url
  const urlParams = new URLSearchParams(window.location.search);
  const uid = urlParams.get('userId')


  //get old task array from db
  const docRef = firestore.doc(`users/${uid}`);
  //locate collection and append task
  firestore.collection(`/users`).doc(`${uid}`).get().then((document)=>{
        //create new task
        var newTask = {
          id : taskId,
          title,
          desc,
          date
    
        }

     var oldTask = document.data().tasks

     //push new task
     oldTask.taskArray.push(newTask)

      docRef.update({
      tasks : oldTask
    })
  
  })


  //clear input 
  document.getElementById("taskForm").reset()
}

//delete task
const deleteTask = (id) =>{
 const taskId = id.parentNode.parentNode.id

 //delete task in dom
 let taskDOM = document.getElementById(taskId)
 taskDOM.remove()

 //delete task in db
  //initialize cloud firestore
  var firestore = firebase.firestore()

  //get id from url
  const urlParams = new URLSearchParams(window.location.search);
  const uid = urlParams.get('userId')


    //get old task array from db
    const docRef = firestore.doc(`users/${uid}`);
    //locate collection and remove task
    firestore.collection(`/users`).doc(`${uid}`).get().then((document)=>{
  
       var oldTask = document.data().tasks
  
       //find task
      let task = document.data().tasks.taskArray.find((item)=>{
        return item.id == taskId  
      })
  

      //remove task
      oldTask.taskArray = oldTask.taskArray.filter((item)=>{
        return  JSON.stringify(item) !== JSON.stringify(task)
      })

      //update in db
      docRef.update({
        tasks : oldTask
      })

    
    })


}

//populate input for edit modaL
const populateInput = (id)=>{
  //get task
  const taskId = id.parentNode.parentNode.id


  //get edit fields
  const titleInputEdit = document.getElementById("titleInputEdit")
  const descInputEdit = document.getElementById("descInputEdit")
  const taskIdEdit = document.getElementById("taskIdEdit")

  //get data from db
  //initialize cloud firestore
  var firestore = firebase.firestore()

  //get uid from url
  const urlParams = new URLSearchParams(window.location.search);
  const uid = urlParams.get('userId')


   //locate collection and remove task
   firestore.collection(`/users`).doc(`${uid}`).get().then((document)=>{
 
      //find task
     let task = document.data().tasks.taskArray.find((item)=>{
       return item.id == taskId  
     })
     
     titleInputEdit.setAttribute("value" , task.title)
     descInputEdit.setAttribute("value" , task.desc)
     taskIdEdit.setAttribute("value"  , task.id)

   
   })



}

//edit task
const editTask = () =>{
  //get edit fields
  const titleInputEdit = document.getElementById("titleInputEdit").value
  const descInputEdit = document.getElementById("descInputEdit").value
  const dateInputEdit = document.getElementById("dateInputEdit").value.toString()
  const taskId = document.getElementById("taskIdEdit").value

  //edit stuff in db
    //initialize cloud firestore
    var firestore = firebase.firestore()

    //get id from url
    const urlParams = new URLSearchParams(window.location.search);
    const uid = urlParams.get('userId')
  
  
      //get old task array from db
      const docRef = firestore.doc(`users/${uid}`);
      //locate collection and remove task
      firestore.collection(`/users`).doc(`${uid}`).get().then((document)=>{
    
         var oldTask = document.data().tasks

        //find task
        oldTask.taskArray.forEach((item)=>{
          if(item.id == taskId){
            item.title = titleInputEdit
            item.desc = descInputEdit
            item.date = dateInputEdit
          }
        })
    
  
        //update in db
        docRef.update({
          tasks : oldTask
        }).then(()=>{
            //refresh page
       location.reload()
      })
        })
  
       



 

}

//generate random id
const generateTaskId = () => {
  return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10);
}