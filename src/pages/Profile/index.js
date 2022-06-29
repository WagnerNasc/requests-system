import { useState, useContext } from 'react';
import './profile.css';
import avatar from '../../assets/avatar.png';
import Header from '../../components/Header';
import Title from '../../components/Title';

import { FiUser, FiUpload } from 'react-icons/fi';
import { toast } from 'react-toastify';

import firebase from '../../services/firebaseConnection';
import { AuthContext } from '../../contexts/auth';

export default function Profile() {
    const { user, setUser, storageUser } = useContext(AuthContext);

    const [name, setName] = useState(user && user.name);
    const [jobTitle, setJobTitle] = useState(user && user.jobTitle);
    const [email, setEmail] = useState(user && user.email);

    const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl);
    const [imageAvatar, setImageAvatar] = useState(null);

    function handleFile(e) {
        // console.log(e.target.files[0]);

        if (e.target.files[0]) {
            const image = e.target.files[0];

            if(image.type === 'image/jpeg' || image.type === 'image/png') {
                setImageAvatar(image);
                setAvatarUrl(URL.createObjectURL(e.target.files[0]));
            } else {
                toast.warning('São permitadas apenas as extensões PNG ou JPEG.');
                setImageAvatar(null);
                return null;

            }
        }
    }

    async function handleUpload() {
        const currentUid = user.uid;

        const uploadTask = await firebase.storage()
        .ref(`images/${currentUid}/${imageAvatar.name}`)
        .put(imageAvatar)
        .then( async () => {
            toast.success('Foto enviada com sucesso!');

            await firebase.storage().ref(`images/${currentUid}`)
            .child(imageAvatar.name).getDownloadURL()
            .then( async(url) => {
                let urlPhoto = url;

                await firebase.firestore().collection('users')
                .doc(user.uid)
                .update({
                    avatarUrl: urlPhoto,
                    name: name
                })
                .then(() => {
                    let data = {
                        ...user,
                        avatarUrl: urlPhoto,
                        name: name
                    };
                    setUser(data);
                    storageUser(data);
                })
            })
        })
        .catch(err => {
            toast.error('Foto não foi enviada!' + err); // rever
        })
        console.log(uploadTask);
    }

    async function handleSave(e) {
        e.preventDefault();
        // console.log(typeof(name) + ' ' + name);
        
        if (imageAvatar === null && name !== '') {
            await firebase.firestore().collection('users')
            .doc(user.uid)
            .update({ name: name
            })
            .then(() => {
                let data = {
                    ...user,
                    name: name
                }
                setUser(data);
                storageUser(data);
                toast.success('O nome foi alterado para ' + data.name);
            })
            .catch((err) => {
                console.log('Ops ocorreu um erro ao alterar o nome!!') // Chamar o alertify
            })
        }
        else if (name !== '' && imageAvatar !== null) {
             handleUpload();
        }
    }
 
    return(
        <div>
            <Header/>
            <div className="content">
                <Title name="Meu perfil">
                    <FiUser size={25}/>
                </Title>

                <div className="container">
                    <form className="form-profile" onSubmit={handleSave}>
                        <label className="label-avatar">
                            <span>
                                <FiUpload color="#FFF" size={25}/>
                            </span>
                            <input type="file" accept='image/*' onChange={handleFile}/>
                            { avatarUrl === null ?
                                <img src={avatar} width='250' height='250' alt='Profile photo'/>
                                :
                                <img src={avatarUrl} width='250' height='250' alt='Profile photo'/>
                            }
                        </label>
                        <label>Nome</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)}/>

                        <label>E-mail</label>
                        <input type="email" value={email} disabled={true}/>

                        <label>Setor</label>
                        <input type="text" value={jobTitle} disabled={true}/>

                        <button type="submit">Salvar</button>

                    </form>
                </div>

                {/* <div className="container">
                    <button className="logout-btn">
                        Sair
                    </button>
                </div> */}

            </div>
        </div>
    )
}