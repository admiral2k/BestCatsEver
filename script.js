const likeButton = document.getElementById("like-btn")
const catImage = document.getElementById("cat-img")
const mainTextElement = document.getElementById("main-h1")
const initialMainText = mainTextElement.textContent.trim()
let likeCounter = 0


function likeOrUnlike() {
    if (likeButton.textContent.trim() == "Unlike!") {
        catImage.src = "https://i.ibb.co/1tRvtz37/a6192066-6d5d-44f5-b6d3-2e3eee4b4ad3.png"

        switch (likeCounter) {
            case 1:
                mainTextElement.textContent = "What do you mean \"UNLIKE\"?!"
                likeButton.textContent = "I made a mistake! Like again!"
                break;
            case 2:
                mainTextElement.textContent = "Second time? REALLY? I won't forgive you!"
                likeButton.textContent = "I swear it was a mistake again! Like! 1000 Likes!"
                break;
            case 3:
                mainTextElement.textContent = "How dare you..."
                likeButton.textContent = "Last Chance! Please... Like!"
                break;

            default:
                mainTextElement.textContent = "no."
                likeButton.textContent = "But... Please! Like!"
                break;
        }
    }
    else if (likeButton.textContent.trim() == "But... Please! Like!") {
        mainTextElement.textContent += "no."
    }
    else {
        likeCounter += 1;
        catImage.src = "https://i.ibb.co/PZGPtpGV/0fba47ba-6dc9-4ee6-bf62-8e0a26ffce65.png"
        likeButton.textContent = "Unlike!"
        mainTextElement.textContent = initialMainText
    }
}

likeButton.addEventListener("click", likeOrUnlike)