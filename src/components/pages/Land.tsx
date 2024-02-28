import React, {useState, useMemo, useEffect, useContext} from 'react'
import ReactMapGL, {Marker} from 'react-map-gl'
import {useMutation} from '@apollo/client'
import Centum from 'centum.js'
import {Datus, date_filters} from 'datus.js'
import {FACT_TYPES, FACT_LEVELS, LOCATION_TYPES, VIEW_CONFIG, token} from '../../env/env'
import {Context} from '../../context/WebProvider'
import MapPicker from '../UI/MapPicker'
import ImageLoader from '../UI/ImageLoader'
import ImageLook from '../UI/ImageLook'
import CloseIt from '../UI/CloseIt'
import DataPagination from '../UI/DataPagination'
import Loading from '../UI/Loading'
import {ModernAlert} from '../UI/ModernAlert'
import {getLandM, makeLandFactM, updateLandInfoM, manageLandLocationM} from '../../graphql/pages/LandPageQueries'
import {CollectionPropsType, Cords} from '../../types/types'

const Land: React.FC<CollectionPropsType> = ({params: {id}}) => {
    const {context} = useContext<any>(Context)
    const [view, setView] = useState(VIEW_CONFIG)
    const [cords, setCords] = useState<Cords>({lat: 0, long: 0})
    const [points, setPoints] = useState<number>(0)
    const [image, setImage] = useState<string>('')
   
    const [land, setLand] = useState<any | null>(null)
    const [locations, setLocations] = useState<any[]>([])
    const [location, setLocation] = useState<any | null>(null)
    const [fact, setFact] = useState<any | null>(null)

    const centum = new Centum()
    const datus = new Datus()

    const [state, setState] = useState({
        text: '',
        level: FACT_LEVELS[0],
        format: FACT_TYPES[0],
        isTrue: true,
        title: '',
        category: LOCATION_TYPES[0],
        timestamp: datus.timestamp(),
        period: date_filters[0]
    })

    const {text, level, format, isTrue, title, category, timestamp, period} = state

    const [getLand] = useMutation(getLandM, {
        onCompleted(data) {
            setLand(data.getLand)
        }
    })

    const [makeLandFact] = useMutation(makeLandFactM, {
        onCompleted(data) {
            ModernAlert(data.makeLandFact)
        }
    })

    const [updateLandInfo] = useMutation(updateLandInfoM, {
        onCompleted(data) {
            ModernAlert(data.updateLandInfo)
        }
    })

    const [manageLandLocation] = useMutation(manageLandLocationM, {
        onCompleted(data) {
            ModernAlert(data.manageLandLocation)
        }
    })

    useEffect(() => {
        if (context.account_id !== '') {
            getLand({
                variables: {
                    shortid: id
                }
            })
        }
    }, [context.account])

    useMemo(() => {
        if (land !== null) {
            setCords(land.cords)

            setState({...state, timestamp: land.timestamp, period: land.period})
        }
    }, [land])

    useMemo(() => {
        setView({...view, latitude: cords.lat, longitude: cords.long, zoom: 16})
    }, [cords])

    const onFact = () => {
        if (fact === null) {
            let result = centum.random(land.facts)?.value

            if (result !== undefined) {
                setFact(result)
            }
        } else {

            let award: number = FACT_LEVELS.indexOf(fact.level) + 1

            if (isTrue === fact.isTrue) {
                setPoints(points + award)
            }
        
            setFact(null)
        }
    }

    const onMakeFact = () => {
        makeLandFact({
            variables: {
                username: context.username, id, text, level, format, isTrue
            }
        })
    }

    const onUpdateInfo = () => {
        updateLandInfo({
            variables: {
                username: context.username, id, timestamp: datus.timestamp(), period
            }
        })
    }

    const onManageLocation = (option: string) => {
        manageLandLocation({
            variables: {
                username: context.username, id, option, title, category, cords, image, coll_id: location === null ? '' : location.shortid 
            }
        })
    }

    return (
        <>          
            {land !== null &&
                <>
                    <h1>{land.title}</h1>

                    <h4 className='pale'>Own period of visiting</h4>
                    <select value={period} onChange={e => setState({...state, period: e.target.value})}>
                        {date_filters.map(el => <option value={el}>{el}</option>)}
                    </select> 
                    <button onClick={onUpdateInfo} className='light'>Update</button>

                    <div className='items small'>
                        <h4 className='pale'>Type: {land.category}</h4>
                        <h4 className='pale'>Century: {land.century}</h4>
                    </div>

                    {location === null ? 
                            <>
                                <h2>New Location</h2>

                                <textarea value={title} onChange={e => setState({...state, title: e.target.value})} placeholder='Title of place...' />

                                <h4 className='pale'>Type</h4>
                                <div className='items small'>
                                    {LOCATION_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={el === category ? 'item label active' : 'item label'}>{el}</div>)}
                                </div>

                                <ImageLoader setImage={setImage} />

                                <button onClick={() => onManageLocation('create')}>Create</button>

                                <DataPagination initialItems={land.locations} setItems={setLocations} label='Map of Locations:' />
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setLocation(null)} />

                                {location.image !== '' && <ImageLook src={location.image} className='photo_item' alt='location photo' />}

                                <h2>{location.title}</h2>

                                <div className='items small'>
                                    <h4 className='pale'>Type: {location.category}</h4>
                                    <h4 className='pale'><b>{location.likes}</b> likes</h4>
                                </div>

                                {location.name === context.username ? 
                                        <button onClick={() => onManageLocation('delete')}>Delete</button>
                                    :
                                        <button onClick={() => onManageLocation('like')}>Like</button>
                                }
                            </>
                    }

                    <ReactMapGL onClick={e => setCords(centum.mapboxCords(e))} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                        <Marker latitude={cords.lat} longitude={cords.long}>
                            <MapPicker type='picker' />
                        </Marker>

                        {locations.map(el => 
                            <Marker latitude={el.cords.lat} longitude={el.cords.long}>
                                {centum.shorter(el.title)}
                            </Marker>
                        )}
                    </ReactMapGL> 

                    {fact === null ?
                            <>
                                <h2>New Fact</h2>
                                <textarea value={text} onChange={e => setState({...state, text: e.target.value})} placeholder='Content...' />

                                <h4 className='pale'>Type and Difficulty</h4>
                                <div className='items small'>
                                    <select value={format} onChange={e => setState({...state, format: e.target.value})}>
                                        {FACT_TYPES.map(el => <option value={el}>{el}</option>)}
                                    </select>  
                                    <select value={level} onChange={e => setState({...state, level: e.target.value})}>
                                        {FACT_LEVELS.map(el => <option value={el}>{el}</option>)}
                                    </select>  
                                </div>

                                <p onClick={() => setState({...state, isTrue: !isTrue})} className='item'>Position: {isTrue ? 'Truth' : 'Lie'}</p>

                                <div className='items small'>
                                    <button onClick={onFact}>Generate</button>
                                    <button onClick={onMakeFact}>Publish</button>
                                </div>
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setFact(null)} />

                                <h2>Fact: {fact.text} (<b>{points}</b> points)</h2>
                            
                                <p onClick={() => setState({...state, isTrue: !isTrue})} className='item'>Position: {isTrue ? 'Truth' : 'Lie'}</p>

                                <div className='items small'>
                                    <h4 className='pale'>Theme: {fact.format}</h4>
                                    <h4 className='pale'>Difficulty: {fact.level}</h4>
                                </div>

                                <button onClick={onFact}>Check</button>
                            </>
                    }
                </>
            }
            {land === null && <Loading />}
        </>
    )
}

export default Land