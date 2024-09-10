const todos_btn = document.querySelector(".todos");

todos_btn.addEventListener("click", async (event) => {
    event.preventDefault();

    try {
        const response = await axios.get('http://localhost:3000/todos', {
            headers: {
                token: localStorage.getItem("token")
            }
        });
        const { data, status } = response;
        if (status === 200) {
            alert("Redirecting to the todos page...");
            window.location.href = "./todos/todos.html";
        }
    } catch (error) {
        if (error.response) {
            if (error.response.status === 401) {
                alert("User is not signed in.")
            }
        }
    }
})