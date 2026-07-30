"use strict";
import { auth } from "./firebase.js";
import {
addBranch,
getBranches
}
from "./firestore.js";
import {
onAuthStateChanged,
signOut
}
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
const welcomeText=document.getElementById("welcomeText");
const userEmail=document.getElementById("userEmail");
const topLogoutBtn=document.getElementById("topLogoutBtn");
const sideLogoutBtn=document.getElementById("sideLogoutBtn");
onAuthStateChanged(auth,(user)=>{
if(!user){
window.location.href="index.html";
return;
}
welcomeText.textContent="Welcome Admin";
userEmail.textContent=user.email;
});
async function logout(){
await signOut(auth);
window.location.replace("index.html");
}
topLogoutBtn.addEventListener("click",logout);
sideLogoutBtn.addEventListener("click",logout);
const manageBranches=document.getElementById("manageBranches");
const dashboardView=document.getElementById("dashboardView");
const branchView=document.getElementById("branchView");
const addSampleBranch=document.getElementById("addSampleBranch");
const branchTable=document.getElementById("branchTable");
const branchCount=document.getElementById("branchCount");
manageBranches.addEventListener("click",async(e)=>{
e.preventDefault();
dashboardView.classList.add("hidden");
branchView.classList.remove("hidden");
await loadBranches();
});
addSampleBranch.addEventListener("click",async()=>{
await addBranch({
branchId:"BR001",
branchName:"Main Branch",
phone:"9618572667",
address:"Main",
active:true,
createdAt:new Date()
});
await loadBranches();
});
async function loadBranches(){
const branches=await getBranches();
branchTable.innerHTML="";
branchCount.textContent=branches.length;
branches.forEach(branch=>{
branchTable.innerHTML+=`
<tr>
<td>${branch.branchId}</td>
<td>${branch.branchName}</td>
<td>${branch.phone}</td>
<td>${branch.active?"Active":"Inactive"}</td>
</tr>
`;
});

}
