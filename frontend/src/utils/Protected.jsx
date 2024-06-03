import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Protected(props) {
    const { Component } = props
    const navigate = useNavigate()
    useEffect(() => {
        if (!localStorage.getItem('userToken')) {
            navigate('/')
        }
    }, [])
    return (
        <div><Component /></div>
    )
}

export default Protected