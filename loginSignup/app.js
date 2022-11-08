const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");
const body = document.querySelector('body')


sign_up_btn.addEventListener("click", () => {
    container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
    container.classList.remove("sign-up-mode");
});

body.addEventListener("keyup",()=>{
    if (event.key === "Enter") {
        document.getElementById("myForm").submit();
    }
})

body.addEventListener("keyup",()=>{
    if (event.key === "Enter") {
        document.getElementById("myForm_1").submit();
    }
})