"use client"

import { ref, set, get, update, remove, child, getDatabase } from "firebase/database"
import { Button, Input, Spinner } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import { setupFirebase } from "../firebaseConfig/firebaseConfig"

type Props = {}



function Villes({ }: Props) {

    const database = setupFirebase()

    const [city, setCity] = useState<string>()
    const [cityDisplay, setCityDisplay] = useState<any>()
    const [toggleDb, settoggleDb] = useState<boolean>(false)
    const [isLoading, setisLoading] = useState<boolean>(true)
    const [cityToggled, setcityToggled] = useState<string>()
    const [inputValue, setinputValue] = useState<string>("")


    // controllers


    //create
    const createCity = () => {

        if (!city) {
            alert('city is undefined')
            return
        }

        if (city && city.length <= 2) {
            alert('city string is not long enaugh')
            return
        }
        // recup la base city ayant le nom de la ville rentré 
        get(ref(database, 'city/'))
            .then(snapshot => {
                
                const json: any = snapshot.toJSON()

                let isVariableInData = false;

                if (json) {
                    for (const key in json) {
                        
                        if (json[key].name === city) {
                            isVariableInData = true;
                            break;
                        }
                    }
                }

                // si l'objet existe déjà dans la bdd alors alerte
                if (isVariableInData) {

                    alert('city already exist')

                    // sinon créé l'entrée avec le nom renseigné dans l'input et un randomUUID
                } else {
                    set(ref(database, 'city/' + crypto.randomUUID()), {
                        id: crypto.randomUUID(),
                        name: city
                    })

                        // relance le composant pour qu'il soit mis à jour en temps réel
                        .then(() => settoggleDb(!toggleDb))

                        // en cas d'erreur verifier la console
                        .catch((error) => console.log(error))
                }
            })
            .catch(error => console.log(error))
    }

    //delete
    const deletCity = (id: string) => {

        if (!id) {
            alert('city is undefined')
            return
        }

        // recup la base city ayant le nom de la ville rentrée
        get(ref(database, 'city/' + id))
            .then(snapshot => {
                // si l'objet n'existe pas dans la bdd alors alerte
                if (!(snapshot.exists())) {
                    alert('city does not exist !')

                    // sinon créé l'entrée avec le nom renseigné dans l'input et un randomUUID
                } else {
                    remove(ref(database, 'city/' + id))

                        // relance le composant pour qu'il soit mis à jour en temps réel
                        .then(() => settoggleDb(!toggleDb))

                        //en cas d'erreur verifier la console
                        .catch((error) => console.log(error))
                }
            })
            .catch(error => console.log(error))
    }

    //update
    const updateCity = (id: string, value: string) => {

        if (!value) {
            alert('value is undefined')
            return
        }

        if (value && value.length <= 2) {
            alert('value string is not long enaugh')
            return
        }
        // recup la base city ayant le nom de la ville rentrée
        get(ref(database, 'city/' + id))
            .then(snapshot => {
                // si l'objet n'existe pas dans la bdd alors alerte
                if (!(snapshot.exists())) {
                    alert('city does not exist !')

                    // sinon update l'entrée avec le nom renseigné dans l'input 
                } else {
                    update(ref(database, 'city/' + id), {
                        name:value
                    })

                        // relance le composant pour qu'il soit mis à jour en temps réel
                        .then(() => settoggleDb(!toggleDb))

                        //en cas d'erreur verifier la console
                        .catch((error) => console.log(error))
                }
            })
            .catch(error => console.log(error))
    }

    //read
    useEffect(() => {

        get(ref(database, 'city'))
            .then(snapshot => setCityDisplay(snapshot.val()))
            .catch(error => console.log(error))
            .finally(() => setisLoading(false))

    }, [database, toggleDb])


    // vu
    return (
        <section className='w-full border-2 flex gap-8 p-8 z-10 bg-black/80 backdrop-blur-xl rounded-lg'>

            <div className="w-full h-96 flex items-center gap-4">
                <div className='w-1/3 h-full border-2 flex flex-col items-center rounded-lg p-4' >
                    <h2 className='font-bold text-2xl'>
                        Créer une ville
                    </h2>

                    <form action="" className='w-full flex flex-col items-center justify-center gap-4 mt-12'>
                        <Input type='text' label={"Nom de la ville"} value={city} onChange={(e) => { setCity(e.target.value) }} />
                        <Button fullWidth onClick={() => { createCity(), setCity("") }}>Créer la Ville</Button>
                    </form>
                </div>

                <div className=' flex-grow h-full border-2 flex flex-col items-center rounded-lg p-4'>
                    <h2 className=' font-bold text-2xl capitalize'>
                        toutes les villes
                    </h2>
                    <ul className={` h-full flex flex-col w-full gap-2 ${cityDisplay ? "justify-start" : "justify-center"} `}>
                        {cityDisplay ? Object.keys(cityDisplay).map(key => ({ uuid: key, ...cityDisplay[key] })).map((item, i) => (
                            <li key={i} className="w-full p-4 border-2 rounded-lg capitalize flex justify-between relative" >
                                {item.name}
                                <div className="flex items-center gap-4">
                                    {(cityToggled === item.name) ?
                                        <div className="flex items-center gap-4 ">
                                            <Button variant="ghost" className="text-white" onClick={() => { setcityToggled(""), setinputValue("") }}>
                                                reset
                                            </Button>
                                            <Button color="success" onClick={() => { updateCity(item.uuid, inputValue), setcityToggled("") }}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                                </svg>
                                            </Button>
                                        </div>

                                        :
                                        <Button onClick={() => setcityToggled(item.name)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                                            </svg>
                                        </Button>}

                                    {!(cityToggled === item.name) && <Button color="danger" onClick={() => deletCity(item.uuid)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                        </svg>
                                    </Button>}

                                </div>
                                <Input type="text" value={inputValue} onChange={(e) => { setinputValue(e.target.value) }} className={`absolute w-3/4 ${cityToggled === item.name ? "flex" : "hidden"}`} />
                            </li>
                        ))
                            : isLoading ?
                                <Spinner />
                                :
                                <p className="flex items-center justify-center">aucune ville</p>
                        }
                    </ul>
                </div>
            </div>
        </section>
    )
}

export default Villes