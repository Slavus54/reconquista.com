import React, {useState, useMemo, useContext, lazy} from 'react'
import ReactMapGL, {Marker} from 'react-map-gl'
import {useMutation} from '@apollo/client'
import {RAID_TYPES, RAID_ROLES, DAYS_LIMIT, SEARCH_PERCENT, VIEW_CONFIG, token} from '../../env/env'
import Centum from 'centum.js'
import {Datus, time_format_max_border} from 'datus.js'
import {gain} from '../../store/localstorage'
import {Context} from '../../context/WebProvider'
import MapPicker from '../UI/MapPicker'
import FormPagination from '../UI/FormPagination'
import CounterView from '../UI/CounterView'
import {ModernAlert} from '../UI/ModernAlert'
import {createRaidM} from '../../graphql/pages/RaidPageQueries'
import {CollectionPropsType, TownType} from '../../types/types'

const CreateRaid: React.FC<CollectionPropsType> = ({params: {id}}) => {
    const datus = new Datus()
    
    const {context} = useContext<any>(Context)
    const [view, setView] = useState(VIEW_CONFIG)
    const [towns] = useState<TownType[]>(gain())
    const [timer, setTimer] = useState<number>(time_format_max_border / 2)
    const [dates] = useState<string[]>(datus.dates('day', DAYS_LIMIT))
    const [isStartCords, setIsStartCords] = useState<boolean>(true)
    const [idx, setIdx] = useState<number>(0)

    const [state, setState] = useState({
        title: '', 
        category: RAID_TYPES[0], 
        region: towns[0].title, 
        cords: towns[0].cords,
        dots: [],
        dateUp: dates[0], 
        time: '', 
        role: RAID_ROLES[0]
    })

    const centum = new Centum()

    const {title, category, region, cords, dots, dateUp, time, role} = state

    const [createRaid] = useMutation(createRaidM, {
        optimisticResponse: true,
        onCompleted(data) {
            ModernAlert(data.createRaid)
        }
    })

    useMemo(() => {
        if (region !== '') {
            let result = towns.find(el => centum.search(el.title, region, SEARCH_PERCENT, true)) 
    
            if (result !== undefined) {
                setState({...state, region: result.title, cords: result.cords})
            }           
        }
    }, [region])

    useMemo(() => {
        setView({...view, latitude: cords.lat, longitude: cords.long, zoom: 16})
    }, [cords])

    useMemo(() => {
        if (dots.length > 0) {
            let latest = dots[dots.length - 1]
        
            setView({...view, latitude: latest.lat, longitude: latest.long, zoom: 16})
        }
    }, [dots])

    useMemo(() => {
        setState({...state, time: datus.time(timer)})
    }, [timer])

    const onSetRoute = e => {
        let result = centum.mapboxCords(e)

        if (isStartCords) {
            setState({...state, cords: result})
        } else {
            setState({...state, dots: [...dots, result]})
        }
    }

    const onCreate = () => {
        createRaid({
            variables: {
                username: context.username, id, title, category, region, cords, dots, dateUp, time, role
            }
        })
    }

    return (
        <div className='main'>          
            <FormPagination num={idx} setNum={setIdx} items={[
                    <>
                        <h4 className='pale'>Title</h4>
                        <textarea value={title} onChange={e => setState({...state, title: e.target.value})} placeholder='Enter title' />
                
                        <h4 className='pale'>Territory and Role</h4>
                        <div className='items small'>
                            {RAID_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={el === category ? 'item label active' : 'item label'}>{el}</div>)}
                        </div>

                        <select value={role} onChange={e => setState({...state, role: e.target.value})}>
                            {RAID_ROLES.map(el => <option value={el}>{el}</option>)}
                        </select>                                  
                    </>,
                    <>
                        <h4 className='pale'>Information</h4>

                        <div className='items small'>
                            {dates.map(el => <div onClick={() => setState({...state, dateUp: el})} className={el === dateUp ? 'item label active' : 'item label'}>{el}</div>)}
                        </div>

                        <CounterView num={timer} setNum={setTimer} part={30} min={time_format_max_border / 2} max={time_format_max_border}>
                            Start in {time}
                        </CounterView>
                    </>,
                    <>
                        <h4 className='pale'>Raid's Route</h4>
                        <input value={region} onChange={e => setState({...state, region: e.target.value})} placeholder='Nearest town' type='text' />

                        <button onClick={() => setIsStartCords(!isStartCords)} className='light'>{isStartCords ? 'Start' : 'Dot'}</button>
                        
                        <ReactMapGL onClick={e => onSetRoute(e)} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                            <Marker latitude={cords.lat} longitude={cords.long}>
                                <MapPicker type='home' />
                            </Marker>
                            {dots.map(el => 
                                <Marker latitude={el.lat} longitude={el.long}>
                                    <MapPicker type='picker' />
                                </Marker>
                            )}
                        </ReactMapGL>  
                    </>
                ]} 
            >
                <h2>New Raid</h2>
            </FormPagination>

            <button onClick={onCreate}>Create</button>
        </div>
    )
}

export default CreateRaid