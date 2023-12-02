const addItem = async(e) => {
    e.preventDefault();
    const form = document.getElementById("add-item-form");
    const formData = new FormData(form);
    formData.append("materials", getMaterials());

    let response;
    if(form.ENTITY_NODE.value == -1) {
        formData.delete("_id");
        response = await fetch("/api/item", {
            method: "POST",
            body: formData
        });
    }

    if(response.status != 200) {
        console.log("error");
        return;
    }

    document.querySelector(".form-class").classList.add("transparent");
    showItem();
};

const getMaterials = () => {
    const inputs = document.querySelectorAll("#item-boxes input");
    let materials = [];
    inputs.forEach((input) => {
        materials.push(input.value);
    });
    return materials;
}

const editItem = async(e) => {
    e.preventDefault();
    const form = document.getElementById("edit-item-form");
    const formData = new FormData(form);
    formData.append("materials", getEditMaterials());

    let response;
    response = await fetch(`/api/item/${form.ENTITY_NODE.value}`, {
        method:"PUT",
        body: formData
    });

    if(response.status != 200) {
        console.log("error");
        return;
    }
    const item = await response.json();

    document.querySelector(".form-class").classList.add("transparent");
    showItem();
    editMaterials(item);
};

const getEditMaterials = () => {
    const inputs = document.querySelectorAll("#edit-item-boxes input");
    let materials = [];
    inputs.forEach((input)=> {
        materials.push(input.value);
    });
    return materials;
}

const getItem = async () => {
    try {
        return(await fetch("api/item/")).json();
    } catch (error) {
        console.log("error");
    }
}

const showItem = async () => {
    console.log("showItem");
    let item = await getItem();
    console.log(item);
    let shop = document.getElementById("shop");
    shop.innerHTML = "";
    item.forEach((item) => {
        const section = document.createElement("section");
        shop.append(section);

        const a = document.createElement("a");
        a.href = "#";
        section.append(a);

        const h4 = document.createElement("h4");
        h4.innerHTML = item.name;
        a.append(h4);
        a.onclick = () => {
            editMaterials(item);
            populateEditForm(item);
        }
    });
}

const editMaterials = async (item) => {
    const details = document.getElementById("item-details");
    details.innerHTML = "";
    const h5 = document.createElement("h5");
    details.append(h5);
    const p = document.createElement("p");
    details.append(p);
    h5.innerHTML = item.description;
    p.innerHTML = "Materials: " + item.materials;
}

const addItemBoxes = (e) => {
    e.preventDefault();
    const itemBoxes = document.getElementById("item-boxes");
    const input = document.createElement("input");
    input.type = "text";
    itemBoxes.append(input);
};

const editItemBoxes = (e) => {
    e.preventDefault();
    const itemBoxes = document.getElementById("edit-item-boxes");
    const input = document.createElement("input");
    input.type = "text";
    itemBoxes.append(input);
};

const populateEditForm = (item) => {
    const form = document.getElementById("edit-item-form");
    form._id.value = item._id;
    form.name.value = item.name;
    form.description.value = item.description;

    populateItems(item.materials);
    document.getElementById("deete-item-link").onclick = async () => {
        populateEditForm(item);
        let response = await fetch(`/api/item/${form._id.value}`, {
            method: "DELETE"
        });
        if(response.status != 200) {
            return;
        }
        resetForm();
        showItem();
    };
};

const populateItems = (materials) => {
    const section = document.getElementById("edit-item-boxes");
    section.innerHTML = "";
    materials.forEach((material) => {
        const input = document.createElement("input");
        input.type = "text";
        input.value = material;
        section.append(input);
    });
};

const resetForm = () => {
    const form = document.getElementById("edit-item-form");
    form.reset();
    form._id = "-1";
    document.getElementById("edit-item-boxes").innerHTML = "";
};






window.onload = () => {
    document.getElementById("add-item-link").onclick = addItemBoxes;
    document.getElementById("edit-item-link").onclick = editItemBoxes;
    showItem();
    document.getElementById("add-item-form").onsubmit = addItem;
    document.getElementById("edit-item-form").onsubmit = editItem;
}