// Fetch and display pets from pets.json
document.addEventListener("DOMContentLoaded", function () {
    fetch("data/pets.json")
        .then(response => response.json())
        .then(pets => {
            const petList = document.getElementById("petList");
            pets.forEach(pet => {
                const card = document.createElement("div");
                card.className = "pet-card";
                card.innerHTML = `
                    <img src="${pet.image}" alt="${pet.name}">
                    <h3>${pet.name}</h3>
                    <p>Birthdate: ${pet.birthdate}</p>
                    <p>${pet.description.split(".")[0]}.</p>
                `;
                card.onclick = () => {
                    window.location.href = `pet.html?id=${pet.id}`;
                };
                petList.appendChild(card);
            });
        });
});
