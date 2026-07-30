"use strict";

import { db } from "./firebase.js";

import {
    collection,
    doc,
    setDoc,
    getDocs,
    updateDoc,
    deleteDoc
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