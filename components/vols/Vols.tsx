"use client"

import { Button, Input, Select, SelectItem, Spinner } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import { setupFirebase } from '../firebaseConfig/firebaseConfig'
import { ref, set, get, update, remove, child, getDatabase } from "firebase/database"

type Props = {}

function Vols({ }: Props) {

    const database = setupFirebase()

    const [flyDisplay, setflyDisplay] = useState<any>()
    const [toggleDb, settoggleDb] = useState<boolean>(false)
    const [isLoading, setisLoading] = useState<boolean>(true)
    const [flyToggled, setflyToggled] = useState<string>("")
    const [inputDeparture, setinputDeparture] = useState<string>("")
    const [inputArrival, setinputArrival] = useState<string>("")
    const [cityDisplay, setCityDisplay] = useState<any>()

    const [departure, setdeparture] = useState<string>("")
    const [arrival, setarrival] = useState<string>("")


    const createFly = (departure: string, arrival: string) => {

        let departureCity: { id: string, name: string } | undefined = undefined
        let arrivalCity: { id: string, name: string } | undefined = undefined

        if (arrival === departure) {
            alert("same city not allowed")
            return
        }

        get(ref(database, 'city/' + departure))
            .then(snapshot => {
                departureCity = snapshot.val()
                if (departureCity) {
                    get(ref(database, 'city/' + arrival))
                        .then(snapshot => {
                            arrivalCity = snapshot.val()
                            if (arrivalCity) {
                                set(ref(database, 'fly/' + crypto.randomUUID()), {
                                    id: crypto.randomUUID(),
                                    departure: departureCity,
                                    arrival: arrivalCity
                                })
                                    .then(() => settoggleDb(!toggleDb))
                                    .catch((error: string) => console.log(error))
                            }
                        })
                        .catch((error: string) => console.log(error))
                }
            })
            .catch((error: string) => console.log(error))
    }

    const updatefly = (id: string, departureCityUUID: string, arrivalCityUUID: string) => {
        console.log("updateFly")

        if (!departureCityUUID) {
            alert('departure is undefined')
            return
        }
        if (!arrivalCityUUID) {
            alert('arrival is undefined')
            return
        }

        let departureCity: { id: string, name: string } | undefined = undefined
        let arrivalCity: { id: string, name: string } | undefined = undefined

        get(ref(database, 'city/' + departure))
            .then(snapshot => {
                departureCity = snapshot.val()
                if (departureCity) {
                    console.log(departureCity.id)
                    update(ref(database, 'fly/' + id + '/departure' ), {
                        id: departureCity.id,
                        name: departureCity.name
                    }).then(() => {
                        get(ref(database, 'city/' + arrival))
                            .then(snapshot => {
                                arrivalCity = snapshot.val()
                                if (arrivalCity) {
                                    console.log(arrivalCity)
                                    update(ref(database, 'fly/' + id + '/arrival' ), {
                                        id: arrivalCity.id,
                                        name: arrivalCity.name
                                    })
                                        .then(() => settoggleDb(!toggleDb))
                                        .catch((error: string) => console.log(error))
                                }
                            })
                    })

                }
            })

    }

    const deletfly = (id: string) => {
        console.log("deletefly")

        if (!id) {
            alert('fly is undefined')
            return
        }

        // recup la base city ayant le nom de la ville rentrée
        get(ref(database, 'fly/' + id))
            .then(snapshot => {
                // si l'objet n'existe pas dans la bdd alors alerte
                if (!(snapshot.exists())) {
                    alert('fly does not exist !')

                    // sinon créé l'entrée avec le nom renseigné dans l'input et un randomUUID
                } else {
                    remove(ref(database, 'fly/' + id))

                        // relance le composant pour qu'il soit mis à jour en temps réel
                        .then(() => settoggleDb(!toggleDb))

                        //en cas d'erreur verifier la console
                        .catch((error) => console.log(error))
                }
            })
            .catch(error => console.log(error))
    }

    useEffect(() => {

        get(ref(database, 'fly'))
            .then(snapshot => setflyDisplay(snapshot.val()))
            .catch(error => console.log(error))
            .finally(() => setisLoading(false))

        get(ref(database, 'city'))
            .then(snapshot => setCityDisplay(snapshot.val()))
            .catch(error => console.log(error))
            .finally(() => setisLoading(false))


    }, [database, toggleDb])


    return (
        <section className='w-full border-2 flex gap-8 p-8 z-10 bg-black/80 backdrop-blur-xl rounded-lg'>

            <div className="w-full h-96 flex items-center gap-4">
                <div className='w-1/3 h-full border-2 flex flex-col items-center rounded-lg p-4' >
                    <h2 className='font-bold text-2xl'>
                        Créer un vol
                    </h2>

                    <form action="" className='w-full flex flex-col items-center justify-center gap-4 mt-12'>
                        <Select
                            onChange={(e) => { setdeparture(e.target.value) }}
                            fullWidth
                            label="ville de départ">
                            {cityDisplay ? Object.keys(cityDisplay).map(key => ({ uuid: key, ...cityDisplay[key] })).map((item, i) => (
                                <SelectItem key={item.uuid} className='text-black'>
                                    {item.name}
                                </SelectItem>))
                                :
                                <SelectItem key={"fallback"}>
                                    no city
                                </SelectItem>}

                        </Select>
                        <Select
                            onChange={(e) => { setarrival(e.target.value) }}
                            fullWidth
                            label="ville de d'arrivée">
                            {cityDisplay ? Object.keys(cityDisplay).map(key => ({ uuid: key, ...cityDisplay[key] })).map((item, i) => (
                                <SelectItem key={item.uuid} className='text-black'>
                                    {item.name}
                                </SelectItem>))
                                :
                                <SelectItem key={"fallback"}>
                                    no city
                                </SelectItem>}
                        </Select>
                        <Button fullWidth isDisabled={(!departure || !arrival)} onClick={() => { createFly(departure, arrival) }}>Créer un vol</Button>
                    </form>
                </div>

                <div className=' flex-grow h-full border-2 flex flex-col items-center rounded-lg p-4'>
                    <h2 className=' font-bold text-2xl capitalize'>
                        tous les vols
                    </h2>
                    <ul className={` h-full flex flex-col w-full gap-2 ${flyDisplay ? "justify-start" : "justify-center"} `}>
                        {flyDisplay ? Object.keys(flyDisplay).map(key => ({ uuid: key, ...flyDisplay[key] })).map((item, i) => (
                            <li key={i} className="w-full p-4 border-2 rounded-lg capitalize flex justify-between relative" >
                                {item.departure.name + " - " + item.arrival.name}
                                <br />
                                {item.uuid}
                                <div className="flex items-center gap-4">
                                    {(flyToggled === item.uuid) ?
                                        <div className="flex items-center gap-4 ">
                                            <Button variant="ghost" className="text-white" onClick={() => { setflyToggled(""), setinputDeparture(""), setinputArrival("") }}>
                                                reset
                                            </Button>
                                            <Button color="success" isDisabled={!inputDeparture || !inputArrival} onClick={() => { updatefly(item.uuid, inputDeparture, inputArrival), setflyToggled("") }}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                                </svg>
                                            </Button>
                                        </div>

                                        :
                                        <Button onClick={() => setflyToggled(item.uuid)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                                            </svg>
                                        </Button>}

                                    {!(flyToggled === item.uuid) && <Button color="danger" onClick={() => deletfly(item.uuid)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                        </svg>
                                    </Button>}

                                </div>
                                <div className={`absolute w-3/4 h-full bg-white/30 backdrop-blur-xl px-4 top-0 left-0 rounded-l-md ${flyToggled === item.uuid ? "flex" : "hidden"}  items-center gap-4`}>
                                    <Select
                                        onChange={(e) => { setinputDeparture(e.target.value) }}
                                        fullWidth
                                        label="ville de départ">
                                        {cityDisplay ? Object.keys(cityDisplay).map(key => ({ uuid: key, ...cityDisplay[key] })).map((item, i) => (
                                            <SelectItem key={item.uuid} className='text-black'>
                                                {item.name}
                                            </SelectItem>))
                                            :
                                            <SelectItem key={"fallback"}>
                                                no city
                                            </SelectItem>}

                                    </Select>
                                    <Select
                                        onChange={(e) => { setinputArrival(e.target.value) }}
                                        fullWidth
                                        label="ville de d'arrivée">
                                        {cityDisplay ? Object.keys(cityDisplay).map(key => ({ uuid: key, ...cityDisplay[key] })).map((item, i) => (
                                            <SelectItem key={item.uuid} className='text-black'>
                                                {item.name}
                                            </SelectItem>))
                                            :
                                            <SelectItem key={"fallback"}>
                                                no city
                                            </SelectItem>}
                                    </Select>

                                </div>

                            </li>
                        ))
                            : isLoading ?
                                <Spinner />
                                :
                                <p className="flex items-center justify-center">
                                    aucun vol
                                </p>
                        }
                    </ul>
                </div>
            </div>
        </section>
    )
}

export default Vols