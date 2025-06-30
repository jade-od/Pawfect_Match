document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    fetch("data/pets.json")
        .then(response => response.json())
        .then(pets => {
            const pet = pets.find(p => p.id == id);
            if (!pet) {
                document.getElementById("petProfile").innerHTML = "<p>Pet not found.</p>";
                return;
            }
            document.getElementById("petProfile").innerHTML = `
                <div style="text-align:center;">
                    <img src="${pet.image}" alt="${pet.name}" style="width:300px; height:300px; border-radius:2em; margin-bottom:1em;">
                    <h2>${pet.name}</h2>
                    <p><strong>Birthdate:</strong> ${pet.birthdate}</p>
                    <p><strong>About:</strong> ${pet.description}</p>
                    <button id="likeBtn">❤️ Like</button>
                </div>
            `;
            // Like button functionality (save to localStorage for adopters)
            document.getElementById("likeBtn").onclick = function () {
                let liked = JSON.parse(localStorage.getItem("likedPets") || "[]");
                if (!liked.includes(pet.id)) liked.push(pet.id);
                localStorage.setItem("likedPets", JSON.stringify(liked));
                alert(`${pet.name} has been added to your favorites!`);
            };
        });
});
