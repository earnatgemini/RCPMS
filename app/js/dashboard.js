"use strict";

import { auth } from "./firebase.js";
import {
    addBranch,
    getBranches,
    deleteBranch,
    getEmployees
    } from "./firestore.js";
import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

// DOM Elements - Auth & Topbar
const userEmail = document.getElementById("userEmail");
const topLogoutBtn = document.getElementById("topLogoutBtn");
const sideLogoutBtn = document.getElementById("sideLogoutBtn");

// DOM Elements - Menus & Views
const dashboardMenu = document.getElementById("dashboardMenu");
const branchesMenu = document.getElementById("branchesMenu");
const dashboardView = document.getElementById("dashboardView");
const branchView = document.getElementById("branchView");

// DOM Elements - Branch Management
const branchForm = document.getElementById("branchForm");
const branchId = document.getElementById("branchId"); // Hidden input
const branchName = document.getElementById("branchName");
const branchPhone = document.getElementById("branchPhone");
const branchAddress = document.getElementById("branchAddress");
const branchTable = document.getElementById("branchTable");
const branchCount = document.getElementById("branchCount");

const manageEmployees=document.getElementById("manageEmployees");
const employeeView=document.getElementById("employeeView");
const employeeTable=document.getElementById("employeeTable");
const backEmployee=document.getElementById("backEmployee");

// 1. Check Auth State
onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "index.html";
        return;
    }
    // HTML లో userEmail ఉంటేనే ఇది రన్ అవుతుంది (Null error రాదు)
    if (userEmail) {
        userEmail.textContent = user.email;
    }
});

// 2. Logout Function
async function logout() {
    await signOut(auth);
    window.location.replace("index.html");
}

if (topLogoutBtn) topLogoutBtn.addEventListener("click", logout);
if (sideLogoutBtn) sideLogoutBtn.addEventListener("click", logout);

// 3. Menu Navigation (Dashboard & Branches)
if (dashboardMenu) {
    dashboardMenu.addEventListener("click", (e) => {
        e.preventDefault();
        branchView.classList.add("hidden");
        dashboardView.classList.remove("hidden");
    });
}

if (branchesMenu) {
    branchesMenu.addEventListener("click", async (e) => {
        e.preventDefault();
        dashboardView.classList.add("hidden");
        branchView.classList.remove("hidden");
        await loadBranches();
    });
}

// 4. Save or Update Branch (Auto Create ID & Update logic)
if (branchForm) {
    branchForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        let currentId = branchId.value;

        if (currentId === "") {
            // New Branch - ID Auto Create (BR002, BR003...)
            currentId = await getNextBranchId();
            await addBranch({
                branchId: currentId,
                branchName: branchName.value,
                phone: branchPhone.value,
                address: branchAddress.value,
                active: true,
                createdAt: new Date()
            });
        } else {
            // Edit Button క్లిక్ చేసినప్పుడు - Update అవుతుంది
            await updateBranch(currentId, {
                branchName: branchName.value,
                phone: branchPhone.value,
                address: branchAddress.value
            });
        }

        // ఫార్మ్ క్లియర్ చేసి టేబుల్ రిఫ్రెష్ చేయడం
        branchForm.reset();
        branchId.value = ""; 
        await loadBranches();
    });
}

// 5. Load Branches & Update Count
async function loadBranches() {
    const branches = await getBranches();
    
    if (branchTable) branchTable.innerHTML = "";
    
    // Branch Count ఆటోమేటిక్ గా అప్డేట్ అవుతుంది
    if (branchCount) branchCount.textContent = branches.length; 

    branches.forEach(branch => {
        if (branchTable) {
            branchTable.innerHTML += `
            <tr>
                <td>${branch.branchId}</td>
                <td>${branch.branchName}</td>
                <td>${branch.phone}</td>
                <td>
                    <button onclick="editBranch('${branch.branchId}')" style="cursor:pointer; margin-right:5px; padding:3px 8px;">Edit</button>
                    <button onclick="removeBranch('${branch.branchId}')" style="cursor:pointer; padding:3px 8px; color:white; background-color:red; border:none; border-radius:3px;">Delete</button>
                </td>
            </tr>
            `;
        }
    });
}

// 6. Global Functions for Edit & Delete
window.editBranch = async (id) => {
    const branches = await getBranches();
    const b = branches.find(x => x.branchId === id);
    if (b) {
        // ఫార్మ్ లోకి డేటా వస్తుంది
        branchId.value = b.branchId; 
        branchName.value = b.branchName;
        branchPhone.value = b.phone;
        branchAddress.value = b.address;
        
        // స్క్రోల్ పైకి వెళ్లడానికి 
        branchForm.scrollIntoView({ behavior: "smooth" });
    }
};

window.removeBranch = async (id) => {
    // కన్ఫర్మ్ చేసి డిలీట్ చేస్తుంది
    if (confirm(`Are you sure you want to delete branch ${id}?`)) {
        await deleteBranch(id);
        await loadBranches(); // డిలీట్ అయ్యాక కౌంట్ & టేబుల్ అప్డేట్
    }
};
manageEmployees.addEventListener("click",async(e)=>{

    e.preventDefault();
    
    dashboardView.classList.add("hidden");
    
    branchView.classList.add("hidden");
    
    employeeView.classList.remove("hidden");
    
    await loadEmployees();
    
    });
    
    backEmployee.addEventListener("click",()=>{
    
    employeeView.classList.add("hidden");
    
    dashboardView.classList.remove("hidden");
    
    });
    
    async function loadEmployees(){
    
    const employees=await getEmployees();
    
    employeeTable.innerHTML="";
    
    employees.forEach(emp=>{
    
    employeeTable.innerHTML+=`
    
    <tr>
    
    <td>${emp.name}</td>
    
    <td>${emp.role}</td>
    
    <td>${emp.branchId}</td>
    
    <td>${emp.active?"Active":"Inactive"}</td>
    
    </tr>
    
    `;
    
    });
    
    }