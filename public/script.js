async function displayDrinks(){
    let response = await fetch('api/drinks/');
    let drinksJSON = await response.json();
    let drinksDiv = document.getElementById('drink-list');
    drinksDiv.innerHTML = '';

    for(i in drinksJSON){
        let drink = drinksJSON[i];
        drinksDiv.append(getDrinkItem(drink));
    }
}

function getDrinkItem(drink){
    let drinkSection = document.createElement('section');
    drinkSection.classList.add('drink');
    let aDrink = document.createElement('a');
    aDrink.setAttribute('drink-id', drink.id);
    aDrink.href = '#';
    aDrink.onclick = showDrinkInfo;
    let h2Elem = document.createElement('h2');
    h2Elem.textContent = drink.name;
    aDrink.append(h2Elem);
    drinkSection.append(aDrink);

    return drinkSection;
}

async function showDrinkInfo(){
    let id = this.getAttribute('drink-id');
    let response = await fetch(`/api/drinks/${id}`);

    if(response.status != 200){
        //Error time(display in DOM)
        return;
    }

    let drink = await response.json();
    document.getElementById("drink-id").textContent = drink.id;
    document.getElementById('txt-name').value = drink.name;
    document.getElementById('txt-description').value = drink.description;
    document.getElementById('txt-carbonated').value = drink.carbonated;
}

async function addDrink(){
    let name = document.getElementById("txt-add-name").value;
    let description = document.getElementById("txt-add-description").value;
    let carbonated = document.getElementById("txt-add-carbonated").value;

    let drink = {"name":name, "description":description, "carbonated":carbonated};

    let response = await fetch('/api/drinks',{
        method:`POST`,
        headers:{
            "content-Type":"application/json;charset=utf-8",
        },
        body:JSON.stringify(drink)
    });

    if(response.status != 200){
        console.log("Error posting data");
        return;
    }

    let result = await response.json();
    console.log(drink);
    displayDrinks();
}

async function editDrink(){
    let drinkId = document.getElementById("drink-id").textContent;
    let name = document.getElementById("txt-name").value;
    let description = document.getElementById("txt-description").value;
    let carbonated = document.getElementById("txt-carbonated").value;
    let drink = {"name":name, "description":description, "carbonated":carbonated};

    let response = await fetch(`/api/drinks/${drinkId}`,{
        method: "PUT",
        headers:{
            "content-Type":"application/json;charset=utf-8",
        },
        body: JSON.stringify(drink)
    });

    if(response.status != 200){
        console.log("Error updating recipe");
        return;
    }

    let result = await response.json();
    displayDrinks();
}

async function deleteDrink(){
    let drinkId = document.getElementById("drink-id").textContent;

    let response = await fetch(`/api/drinks/${drinkId}`,{
        method:"DELETE",
        headers:{
            "content-Type":"application/json;charset=utf-8",
        },
    });

    if(response.status != 200){
        console.log("Error deleting");
        return;
    }

    let result = await response.json();
    displayDrinks();
}

window.onload = function(){
    this.displayDrinks();

    let addBtn = document.getElementById("btn-add-drink");
    addBtn.onclick = addDrink;
    let editBtn = document.getElementById("btn-edit-drink");
    editBtn.onclick = editDrink;
    let deleteBtn = document.getElementById("btn-delete-drink");
    deleteBtn.onclick = deleteDrink;
}