// Declare Variables
let body = document.querySelector("body"),
    addTache = document.querySelector(".addTache"),
    taches = document.querySelector(".taches"),
    operation = document.querySelector(".operation"),
    mainOperation = document.querySelector(".mainOperation");

// ------------------Add Dark Mode--------------------
let darkModeToggleIcone = document.querySelector(".title .iconeDark"),
    iconeDark = document.querySelector(".title .iconeDark"),
    backHome = document.querySelector(".backhome");

let tableElementDM = [body , addTache , taches , operation , mainOperation]; // Element Add Him Dark Mode

const activeDarkMode = () => {
    tableElementDM.forEach(element => {
        element.classList.toggle("dark");
        if(element == body) element.classList.toggle("darkmain");
    });
    const changeIcons = () => {
        iconeDark.classList.toggle("fa-moon");
        iconeDark.classList.toggle("fa-sun");
        backHome.classList.toggle("backhomeDrk");
    }
    changeIcons();
}

darkModeToggleIcone.addEventListener('click' , () => {
    activeDarkMode();
    setTimeout(() => {
        if(body.classList.contains("darkmain")) localStorage.setItem("dark" , true);
        else localStorage.setItem("dark" , false);
        saveData();
    }, 100);
})
// ---------------------End----------------------------

// ---------------------Generate Id--------------------
const generateId = () => {
    let id = Date.now();
    return id
}
// ---------------------End----------------------------

// ---------------------add tache----------------------
let addTacheIcone = document.querySelector(".addTacheIcone"),
    descTacheInput = document.querySelector(".descTacheInput");

let tachesTable = [];

let Tache = {
    description: "",
    id: null,
    completed: false
} 

const createTacheElement = (desc , completed , taches , id) => {
        // id Unique 
        let idTache = id;
        // tache
        let tache = document.createElement("div");
        tache.classList.add("tache" , "animate__animated");
        tache.setAttribute("data-id" , idTache);
        // check parent
        let check = document.createElement("i");
        check.classList.add("check");
        if(completed) check.classList.add("completed");
        // check icone
        let checkIcone = document.createElement("i");
        checkIcone.classList.add("fas" , "fa-check");
        // append child
        check.appendChild(checkIcone);
        // desception tache
        let descTache = document.createElement("p");
        descTache.textContent = desc;
        if(completed) descTache.classList.add("completed");
        // delete icone
        let deleteIcone = document.createElement("i");
        deleteIcone.classList.add("fas" , "fa-times" , "delete");
        // append child
        tache.appendChild(check);
        tache.appendChild(descTache);
        tache.appendChild(deleteIcone);
        // append child in tache Container
        taches.appendChild(tache);
} 

const createTache = (desc , completed , taches , id) => {
    createTacheElement(desc , completed , taches , id);
    // add tache in the table taches
    let idTache = generateId() || id;
    Tache.description = descTacheInput.value;
    Tache.id = idTache;
    tachesTable.push(Tache);
}

const addTacheFun = () => {
    if(descTacheInput.value){
        createTache(descTacheInput.value , Tache.completed , taches , generateId());
        descTacheInput.focus();
        Tache = {
            description: "",
            completed: false
        }
        descTacheInput.value = null;
        calcCountItems();
    }
    saveData();
}

// Event click to add tache Operation
addTacheIcone.addEventListener('click' , () => addTacheFun())
document.addEventListener('keypress' , (event) => { if(event.charCode == 13) addTacheFun() });
// ----------------------end---------------------------

// ----------------------Completed & Delete(Element & Data)---------------------------

const completedTacheData = (id , remove) => {
    let currentElement = tachesTable.filter((element) => { return element.id == id });
    let index = tachesTable.indexOf(currentElement[0]);
    if(remove) tachesTable.splice(index , 1);
    else tachesTable[index].completed = !tachesTable[index].completed;
    saveData();
}

taches.addEventListener('click' , (event) => {
    if(event.target.classList[0] == "check"){
        event.target.classList.toggle("completed");
        event.target.parentElement.children[1].classList.toggle("completed");
        let idTache = event.target.parentElement.getAttribute("data-id");
        event.target.parentElement.classList.add("animate__flash");
        setTimeout(() => {
            event.target.parentElement.classList.remove("animate__flash");
        }, 1000);
        completedTacheData(idTache , false);
    }
    else if(event.target.classList[2] == "delete"){
        event.target.parentElement.classList.add("animate__fadeOutRightBig");
        let idTache = event.target.parentElement.getAttribute("data-id");
        completedTacheData(idTache , true);
        setTimeout(() => {
            taches.removeChild(event.target.parentElement);
            calcCountItems();
        }, 500);
    }
});
// ----------------------end----------------------------------------------------------

// ---------------------Save data--------------------

let mainOperationRoles = document.querySelectorAll(".mainOperation span");

const filterBy = (taches , completed , noCompleted) => {
    taches.forEach(element => {
        if(element.children[0].classList.contains("completed")) element.style.display = completed;
        else element.style.display = noCompleted;
    });
}

const filterTodos = () => {
    mainOperationRoles.forEach((role) => {
        role.addEventListener("click" , () => {
            activeFilter(role);
            let taches = document.querySelectorAll(".taches .tache");
            switch(role.getAttribute("data-role")){
                case "all":
                    taches.forEach(element => element.style.display = "flex")
                    break;
                case "active":
                    filterBy(taches , "none" , "flex");
                    break;
                case "completed":
                    filterBy(taches , "flex" , "none");
                    break;
            }
        })
    })
}
filterTodos();
// ---------------------End--------------------------

// ---------------------verife active filter---------
const activeFilter = (element) => {
    mainOperationRoles.forEach(element => {
        element.classList.remove("active");
    });
    element.classList.add("active");
}
// ---------------------End--------------------------

// ---------------------Clear All--------------------
const clearCompletedFun = () => {
    let tache = document.querySelectorAll(".taches .tache");
    tache.forEach(element => {
        if(element.children[0].classList.contains("completed")){
            let id = element.getAttribute("data-id");
            completedTacheData(id , true);
            taches.removeChild(element);
        }
    });
    calcCountItems();
    saveData();
}
let clearCompleted = document.querySelector(".clearCompleted");
clearCompleted.addEventListener('click' , clearCompletedFun);
// ---------------------End--------------------------

// ---------------------count items------------------
const calcCountItems = () => {
    let taches = document.querySelectorAll(".taches .tache").length;
    let countItems = document.querySelector(".countItems");
    countItems.textContent = `${taches} items left`;
}
calcCountItems();
// ---------------------End--------------------------

// ---------------------Save and reseve data--------------------
const saveData = () => {
    localStorage.setItem("taches" , JSON.stringify(tachesTable));
}
// ---------------------End------------------------------------

// -------------get data from Local storage----------
try{
    tachesTable = [...JSON.parse(localStorage.getItem("taches"))];
    let darkModeStatus = localStorage.getItem("dark");
    if(darkModeStatus == "true") activeDarkMode();
}catch{}
// ---------------------End--------------------------

// -------------create element storage---------------
let storageTache = {
    id: null,
    description: null,
    completed: null
}

const createElementStorage = () => {
    tachesTable.forEach(element => {
        storageTache = element;
        createTacheElement(storageTache.description , storageTache.completed , taches , storageTache.id);
        calcCountItems();
    })
}
onload = () => createElementStorage();
// ---------------------End--------------------------