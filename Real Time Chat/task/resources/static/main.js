const inputMsg = document.getElementById("input-msg")
const sendMsgBtn = document.getElementById("send-msg-btn")
const messages = document.getElementById("messages")
const sendUsernameBtn = document.getElementById("send-username-btn")
const inputUsername = document.getElementById("input-username")
const loginPage = document.getElementById("login-page")
const chatPage = document.getElementById("chat-page")
const users = document.getElementById("users")
const chatWith = document.getElementById("chat-with")
const publicChatBtn = document.getElementById("public-chat-btn")

let sockJS
let stompClient
let username

function appendMsg(sender, message, date) {
    const divMessage = document.createElement("div")
    const divSender = document.createElement("div")
    const divText = document.createElement("div")
    const divDate = document.createElement("div")

    divMessage.classList.add("message-container")
    divSender.classList.add("sender")
    divText.classList.add("message")
    divDate.classList.add("date")

    divMessage.appendChild(divSender)
    divMessage.appendChild(divText)
    divMessage.appendChild(divDate)

    divSender.textContent = sender
    divText.textContent = message
    divDate.textContent = date

    messages.appendChild(divMessage)

    divMessage.scrollIntoView({"behavior": "smooth"})
}

function onPublicMessageReceived(payload) {
    const response = JSON.parse(payload.body)

    if (chatWith.textContent === "Public chat") {
        appendMsg(response.sender, response.message, response.date)
    } else {
        const counter = publicChatBtn.getElementsByClassName("new-message-counter")[0]
        counter.textContent = 1 + parseInt(counter.textContent)
        counter.style.visibility = "visible"
    }
}

function onPrivateMessageReceived(payload) {
    const response = JSON.parse(payload.body)
    const messages = response.messages
    const messageType = response.messageType

    if (chatWith.textContent === messages[0].sender || chatWith.textContent === messages[0].sendTo) {
        for (let i in messages) {
            appendMsg(messages[i].sender, messages[i].message, messages[i].date)
        }
    } else {
        const userContainers = document.getElementsByClassName("user-container")
        for (let i in userContainers) {
            if (userContainers[i].getElementsByClassName("user")[0].textContent === messages[0].sender) {
                const counter = userContainers[i].getElementsByClassName("new-message-counter")[0]
                counter.style.visibility = "visible"
                counter.textContent = parseInt(counter.textContent) + messages.length
                break
            }
        }
    }

    if (messageType === "PRIVATE"){
        moveUserToTop(messages[0].sender)
    }
}

function addUserToUserList(user) {
    const divUserContainer = document.createElement("div")
    const divUser = document.createElement("div")
    const divNewMessageCounter = document.createElement("div")

    divUserContainer.classList.add("user-container")
    divUser.classList.add("user")
    divNewMessageCounter.classList.add("new-message-counter")

    divUser.textContent = user
    divNewMessageCounter.textContent = "0"
    divNewMessageCounter.style.visibility = "hidden"

    divUserContainer.appendChild(divUser)
    divUserContainer.appendChild(divNewMessageCounter)

    divUserContainer.onclick = () => {
        chatWith.textContent = user
        messages.replaceChildren()
        stompClient.send("/app/chat.send.private", {}, JSON.stringify({
            "sender": username,
            "sendTo": user,
            "messageType": "GET_ALL"
        }))

        divNewMessageCounter.textContent = "0"
        divNewMessageCounter.style.visibility = "hidden"
    }

    users.appendChild(divUserContainer)
}

function removeUserFromUserList(username) {
    const usersContainers = users.getElementsByClassName("user-container")
    for (const i in usersContainers) {
        if (usersContainers[i].getElementsByClassName("user")[0].textContent === username) {
            usersContainers[i].remove()
            break
        }
    }
}

function onUserEventReceived(payload) {
    const response = JSON.parse(payload.body)

    if (response.userEventType === "JOINED" && response.username !== username) {
        addUserToUserList(response.username)
    } else if (response.userEventType === "LEFT") {
        removeUserFromUserList(response.username)
    }
}

function onConnect() {
    stompClient.subscribe("/chat/public", onPublicMessageReceived)
    stompClient.subscribe("/user/" + username + "/private", onPrivateMessageReceived)
    stompClient.subscribe("/chat/user-event", onUserEventReceived)
    stompClient.send("/app/chat.register", {}, JSON.stringify({"username": username}))
}

function onError() {
    console.log("Something went wrong")
}

function sendMessage() {
    if (inputMsg.value) {
        if (chatWith.textContent === "Public chat") {
            stompClient.send("/app/chat.send", {}, JSON.stringify({
                "sender": username,
                "message": inputMsg.value,
                "date": new Date()
            }))
        } else {
            stompClient.send("/app/chat.send.private", {}, JSON.stringify({
                "sender": username,
                "message": inputMsg.value,
                "date": new Date(),
                "sendTo": chatWith.textContent,
                "messageType": "PRIVATE"
            }))
            moveUserToTop(chatWith.textContent)
        }
    }
}

function loadPublicMessages() {
    window.fetch("/public-messages")
        .then(response => response.json()
            .then(data => {
                for (let i in data) {
                    appendMsg(data[i].sender, data[i].message, data[i].date)
                }
            }))
}

function moveUserToTop(username) {
    const userContainers = users.getElementsByClassName("user-container")
    if (userContainers.length >= 2) {
        for (let i = 0; i < userContainers.length; i++) {
            if (userContainers[i].getElementsByClassName("user")[0].textContent === username) {
                users.prepend(userContainers[i])
            }
        }
    }
}

sendUsernameBtn.onclick = () => {
    username = inputUsername.value
    window.fetch("/users")
        .then(response => response.json()
            .then(data => {
                for (let i in data) {
                    if (username === data[i]) {
                        document.getElementById("login-error").style.visibility = "visible"
                        return
                    }
                }

                loginPage.classList.add("hidden")
                chatPage.classList.remove("hidden")

                for (let i in data) {
                    addUserToUserList(data[i])
                }

                loadPublicMessages()

                sockJS = new SockJS("/ws")
                stompClient = Stomp.over(sockJS)
                stompClient.connect({}, onConnect, onError);

                sendMsgBtn.onclick = () => {
                    sendMessage()
                    inputMsg.value = ""
                }
            }))
}

publicChatBtn.onclick = () => {
    messages.replaceChildren()
    loadPublicMessages()
    chatWith.textContent = "Public chat"
    publicChatBtn.getElementsByClassName("new-message-counter")[0].textContent = "0"
    publicChatBtn.getElementsByClassName("new-message-counter")[0].style.visibility = "hidden"
}

