import React from "react"

export default function PersonComponent({ctx}) {

    const { vertex, surface, toolkit } = ctx

    function getImage() {
        return `/avatars/${vertex.data.img}`
    }

    return <>
            <img src={getImage()} alt={vertex.data.name}/>
        <div>
            <strong>{vertex.data.name}</strong>
            <span>{vertex.data.title}</span>
        </div>
    </>

}
