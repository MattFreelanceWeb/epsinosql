'use client'

import Villes from "@/components/villes/villes";
import Vols from "@/components/vols/Vols";
import { Button, ButtonGroup } from "@nextui-org/react";

import BG from "@/assets/images/moscow-3227572_1280.jpg"
import Image from "next/image";
import { useState } from "react";


export default function Home() {

  const [view, setView] = useState('ville')

  return (
    <main className="flex h-screen w-screen flex-col items-center justify-between p-24 gap-4 relative">
      <Image src={BG} alt="" className="absolute w-full h-full object-cover z-0" />
      <h1 className="text-4xl font-bold z-10 ">IHM management de vols</h1>
      <p className="z-10">EPSI NoSQL TP - Matteo Campus</p>
      <ButtonGroup>
        <Button onClick={() => { setView('vols') }}>vols</Button>
        <Button onClick={() => { setView('ville') }}>Villes</Button>
      </ButtonGroup>
      {view === 'ville' ? <Villes /> : <Vols />}


    </main>
  );
}
