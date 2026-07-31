"use strict";

import {
    collection,
    doc,
    setDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
const BRANCH_COLLECTION = "branches";

// Add Branch
export async function addBranch(branch) {

    await setDoc(
        doc(db, BRANCH_COLLECTION, branch.branchId),
        branch
    );

}

// Get Branches
export async function getBranches() {

    const snapshot = await getDocs(
        collection(db, BRANCH_COLLECTION)
    );

    return snapshot.docs.map(doc => doc.data());

}

export async function getNextBranchId(){

    const branches = await getBranches();

    let max = 0;

    branches.forEach(branch=>{

        const no=parseInt(
            branch.branchId.replace("BR","")
        );

        if(no>max) max=no;

    });

    return "BR"+String(max+1).padStart(3,"0");

}

// Update Branch
export async function updateBranch(branchId, data) {

    await updateDoc(
        doc(db, BRANCH_COLLECTION, branchId),
        data
    );

}

// Delete Branch
export async function deleteBranch(branchId) {

    await deleteDoc(
        doc(db, BRANCH_COLLECTION, branchId)
    );

}
const USER_COLLECTION="users";

export async function saveUser(user){

    await setDoc(
        doc(db,USER_COLLECTION,user.uid),
        user
    );

}

export async function getUser(uid){

    const snap=await getDoc(
        doc(db,USER_COLLECTION,uid)
    );

    if(!snap.exists()) return null;

    return snap.data();

}

export async function getEmployees(){

    const snapshot=await getDocs(
        collection(db,USER_COLLECTION)
    );

    return snapshot.docs.map(doc=>doc.data());

}