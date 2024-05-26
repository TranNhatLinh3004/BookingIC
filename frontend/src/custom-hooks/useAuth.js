import React, { useEffect, useState } from "react";

import { onAuthStateChanged } from "firebase/auth";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../src/firebase.config";
//
import { toast } from "react-toastify";

function useAuth(props) {
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        console.log(user);
      } else {
        setCurrentUser(null);
      }
    });
  });

  return { currentUser };
}

export default useAuth;
