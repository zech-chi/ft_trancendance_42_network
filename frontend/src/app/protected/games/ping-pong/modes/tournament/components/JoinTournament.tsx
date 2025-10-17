"use client";

import PingPongCanvas from "../../../components/PongCanvas";
import { useSettings } from "../../../context/settings/SettingsContext";
import React, { use, useState } from "react";
import { useLoggedUserId } from "@/context/UserIdContext";
import { useLoggedUserName } from "@/context/LoggedUserNameContext";


export default function JoinTournament() {
    const { loggedUserId } = useLoggedUserId();
    const { loggedUserName } = useLoggedUserName();
    const { settings } = useSettings();
    const [ t_name, t_setName ] = useState("");
    const [ t_number_of_players, t_setNumberOfPlayers ] = useState(4);   // default to 4 players ( 4 or 8 )
    const [ t_isPrivate, t_setIsPrivate ] = useState(false); // default to public ( public or private )
    const [ t_nakeName, t_setNakeName ] = useState("");


    return (
        <>
           welcome to join tournament page
        </>
    )
}