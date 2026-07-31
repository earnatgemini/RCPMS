"use strict";

import { auth } from "./firebase.js";

import {

signInWithEmailAndPassword

}

from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", login);

async function login(e){

e.preventDefault();

const email=document.getElementById("email").value.trim();

const password=document.getElementById("password").value;

try{

await signInWithEmailAndPassword(auth,email,password);

alert("Login Success");

window.location.replace("dashboard.html");

}

catch(error){

alert(error.message);

}

}