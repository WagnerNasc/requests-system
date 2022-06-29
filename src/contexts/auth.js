import { useState, createContext, useEffect } from "react";
import firebase from "../services/firebaseConnection";
import { toast } from 'react-toastify';

export const AuthContext = createContext({});

function AuthProvider({ children }) {
    const [ user, setUser ] = useState();
    const [ loadingAuth, setLoadingAuth ] = useState(false);
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
        
        function loadStorage() {
            const storageUser = localStorage.getItem('UserSystem');

            if(storageUser) {
                setUser(JSON.parse(storageUser));
                setLoading(false);
            }
    
            setLoading(false);
        }

        loadStorage();
    }, [])

    // Login usuário
    async function signIn(email, password) {
        setLoadingAuth(true);

        await firebase.auth().signInWithEmailAndPassword(email, password)
        .then( async ( value )=> {
            let uid = value.user.uid;

            const userProfile = await firebase.firestore().collection('users')
            .doc(uid).get();

            let data = {
                uid: uid,
                name: userProfile.data().name,
                jobTitle: userProfile.data().jobTitle,
                avatarUrl: userProfile.data().avatarUrl,
                email: value.user.email
            }

            setUser(data);
            storageUser(data);
            setLoadingAuth(false);
            toast.success('Bem-vindo(a) de volta ' + data.name);

        })
        .catch(err => {
            console.log(err);
            setLoadingAuth(false);
            toast.error('Algo deu errado no seu acesso!');
        })
    }

    // Cadastro de novo usuário
    async function signUp(email, password, name) {
        setLoadingAuth(true);
        await firebase.auth().createUserWithEmailAndPassword(email, password)
        .then( async (value) => {
            let uid = value.user.uid ;
            /* cadastra no database */
            await firebase.firestore().collection('users')
            .doc(uid)
            .set({
                name: name,
                jobTitle: 'Samer',
                avatarUrl: null,
            })
            .then(() => {
                let data = {
                    uid: uid,
                    name: name,
                    jobTitle: 'Samer',
                    avatarUrl: null
                };

                setUser(data);
                storageUser(data);
                setLoadingAuth(false);
                toast.success('Bem-vindo(a) ' + data.name);
            })

        })
        .catch((error) => {
            console.log(`Ocorreu um erro! \n ${error.message}`);
            setLoadingAuth(false);
            toast.error('Ops... algo deu errado no seu cadastro!');
        })
    }

    /* Pega o usuário do LocalStorage e converte para string */
    async function storageUser(data) {
        localStorage.setItem('UserSystem', JSON.stringify(data));
    }

    /* Logout */

    async function signOut() {
        firebase.auth().signOut();
        localStorage.removeItem('UserSystem');
        setUser(null);
    }


    return(
        <AuthContext.Provider   
            value= {{
                signed: !!user, // converte user para booleano
                user, 
                loading, 
                signUp,
                signOut,
                signIn,
                loadingAuth,
                setUser,
                storageUser
            }} 
        >

            {children}

        </AuthContext.Provider>
    )
}

export default AuthProvider;

/* !!user converte para booleano e retorna false para vazio e true para preenchido */