import { supabaseClient } from "./supabase.config.js";

let emailInput = document.getElementById("email");
let passwordInput = document.getElementById("pass");
let loginBtn = document.getElementById("signin");
let signupBtn = document.getElementById("signup");
let logoutBtn = document.getElementById("logout");
let todoList = document.getElementById("todo-list");
let inpText = document.getElementById("inp-text");
let addBtn = document.getElementById("add-todo");

//  Login Func
if (window.location.pathname.includes("index.html")) {
  // console.log('hello index');

  loginBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const emailValue = emailInput.value;
    const passwordValue = passwordInput.value;

    if (!emailValue || !passwordValue) {
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Please fill both fields",
      });
      return;
    }

    loginBtn.disabled = true;
    loginBtn.innerText = "Logging in...";

    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email: emailValue,
      password: passwordValue,
    });

    loginBtn.disabled = false;
    loginBtn.innerText = "Login";

    if (error) {
      console.error("Login Failed:", error.message);
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.message,
      });
      return;
    } else {
      await Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Login Successful!",
        timer: 1500,
        showConfirmButton: false,
      });
      window.location.href = "./dashboard.html";
    }
  });
}

// Signup Func
if (window.location.pathname.includes("signup.html")) {
  // console.log('hello signup');

  signupBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const emailValue = emailInput.value;
    const passwordValue = passwordInput.value;

    if (!emailValue || !passwordValue) {
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Please fill both fields",
      });
      return;
    }

    signupBtn.disabled = true;
    signupBtn.innerText = "Signing up...";

    const { data, error } = await supabaseClient.auth.signUp({
      email: emailValue,
      password: passwordValue,
    });

    signupBtn.disabled = false;
    signupBtn.innerText = "Sign Up";

    if (error) {
      console.error("Sign Up Failed:", error.message);
      Swal.fire({
        icon: "error",
        title: "Sign Up Failed",
        text: error.message,
      });
      return;
    } else {
      await Swal.fire({
        icon: "success",
        title: "Registered!",
        text: "Sign Up Successful!",
        timer: 1500,
        showConfirmButton: false,
      });
      window.location.href = "./dashboard.html";
    }
  });
}

if (window.location.pathname.includes("dashboard.html")) {
  // console.log('hello dashboard');

  //  Logout Fnc
  logoutBtn.addEventListener("click", async () => {
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
      console.error("Logout Failed:", error.message);
      Swal.fire({
        icon: "error",
        title: "Logout Failed",
        text: error.message,
      });
      return;
    } else {
      await Swal.fire({
        icon: "success",
        title: "Logged Out",
        text: "Logout Successful!",
        timer: 1500,
        showConfirmButton: false,
      });
      window.location.href = "./index.html";
    }
  });

  //  Render Func
  window.render = async function () {
    if (!todoList) {
      console.error("Todo List element not found in DOM");
      return;
    }
    todoList.innerHTML = "";

    const { data, error } = await supabaseClient
      .from("Todo")
      .select()
      .order("id", { ascending: false });

    if (error) {
      console.error("render Func:", error.message);
      return;
    }

    if (data) {
      data.forEach((todo) => {
        todoList.innerHTML += `
        <li id="todo-row-${todo.id}">
          <span class="todo-text">${todo.todo_value}</span> 
          <button onclick="del(${todo.id})">Del</button> 
          <button onclick="edit(${todo.id}, '${todo.todo_value}')">Edit</button>
        </li>`;
      });
    }
  };

  //  Add Func
  if (addBtn) {
    addBtn.addEventListener("click", async () => {
      if (!inpText.value.trim()) {
        Swal.fire({
          icon: "info",
          title: "Inavlid Inout!",
          text: "Your input field is blank!",
        });
        return;
      }

      addBtn.disabled = true;
      addBtn.innerText = "Adding...";

      const { error } = await supabaseClient
        .from("Todo")
        .insert({ todo_value: inpText.value })
        .select();

      if (error) {
        console.error("addBtn Func:", error.message);
        return;
      }

      inpText.value = "";
      render();

      addBtn.disabled = false;
      addBtn.innerText = "Add";
    });
  }

  //  Del Func
  window.del = async function (id) {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Your Todo will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No",
    });

    if (result.isConfirmed) {
      const { error } = await supabaseClient.from("Todo").delete().eq("id", id);

      if (error) {
        console.error("Delete failed:", error.message);
        Swal.fire("Error!", "Error in Del Func.", "error");
        return;
      }

      await Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Your Todo data has been deleted.",
        timer: 1000,
        showConfirmButton: false,
      });

      render();
    }
  };

  //  Edit Func
  window.edit = function (id, currentValue) {
    const row = document.getElementById(`todo-row-${id}`);

    row.innerHTML = `
    <input type="text" id="edit-inp-${id}" value="${currentValue}" style="padding: 2px 5px;" />
    <button onclick="updateTodo(${id})">Update</button>
    <button onclick="render()">Cancel</button>
  `;
  };

  //  Update Func
  window.updateTodo = async function (id) {
    const inputField = document.getElementById(`edit-inp-${id}`);
    const newValue = inputField.value.trim();

    if (!newValue) {
      Swal.fire({
        icon: "warning",
        title: "Pay Attention",
        text: "Input cannot be empty!",
      });
      return;
    }

    const { error } = await supabaseClient
      .from("Todo")
      .update({ todo_value: newValue })
      .eq("id", id);

    if (error) {
      console.error("Update failed:", error.message);
      Swal.fire("Error!", "Error in Update Func.", "error");
      return;
    }

    await Swal.fire({
      icon: "success",
      title: "Updated!",
      text: "Your Todo has been Updated.",
      timer: 1000,
      showConfirmButton: false,
    });

    render();
  };

  //  Clear All Func
  window.clearAll = async function () {
    const { error } = await supabaseClient.from("Todo").delete().gte("id", 0);

    if (error) {
      console.error("Clear All failed:", error.message);
      Swal.fire("Error!", "Error in clearAll Func.", "error");
      return;
    }

    await Swal.fire({
      icon: "success",
      title: "Cleared!",
      text: "All todos data got deleted.",
      timer: 1000,
      showConfirmButton: false,
    });

    render();
  };
}
