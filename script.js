const likeButton = document.getElementById("like-btn")
const catImage = document.getElementById("cat-img")
const mainTextElement = document.getElementById("main-h1")
const initialMainText = mainTextElement.textContent.trim()
const orderPizzaButton = document.getElementById("order-pizza-btn")
let likeCounter = 0


function likeOrUnlike() {
    if (likeButton.textContent.trim() == "Unlike!") {
        catImage.src = "devil-cat.png"

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
            case 4:
                mainTextElement.textContent = "You won't be able to order pizza now. I think it's a fair price to pay for my suffering."
                orderPizzaButton.remove()
                likeButton.textContent = "Okay... Like!"
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
        catImage.src = "kind-cat.png"
        likeButton.textContent = "Unlike!"
        mainTextElement.textContent = initialMainText
    }
}

likeButton.addEventListener("click", likeOrUnlike)