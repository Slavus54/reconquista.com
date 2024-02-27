import React, {useState, useMemo, useEffect, useContext} from 'react'
import ReactMapGL, {Marker} from 'react-map-gl'
import {useMutation} from '@apollo/client'
import {RAID_ROLES, INCIDENT_TYPES, INCIDENT_RACES, TOPIC_TYPES, SEARCH_PERCENT, VIEW_CONFIG, token} from '../../env/env'
import Centum from 'centum.js'
import {Context} from '../../context/WebProvider'
import NavigatorWrapper from '../router/NavigatorWrapper'
import RaidCommonInfo from '../pieces/RaidCommonInfo'
import ImageLoader from '../UI/ImageLoader'
import ImageLook from '../UI/ImageLook'
import CloseIt from '../UI/CloseIt'
import MapPicker from '../UI/MapPicker'
import DataPagination from '../UI/DataPagination'
import Loading from '../UI/Loading'
import {ModernAlert} from '../UI/ModernAlert'
import {getRaidM, manageRaidStatusM, makeRaidIncidentM, manageRaidTopicM} from '../../graphql/pages/RaidPageQueries'
import {CollectionPropsType, Cords} from '../../types/types'

const Raid: React.FC<CollectionPropsType> = ({params: {id}}) => {
    const {context} = useContext<any>(Context)
    const [view, setView] = useState(VIEW_CONFIG)
    const [cords, setCords] = useState<Cords>({lat: 0, long: 0})
    const [image, setImage] = useState<string>('')
    const [raid, setRaid] = useState<any | null>(null)
    const [personality, setPersonality] = useState<any | null>(null)
    const [members, setMembers] = useState<any[]>([])
    const [incidents, setIncidents] = useState<any[]>([])
    const [incident, setIncident] = useState<any | null>(null)
    const [topics, setTopics] = useState<any[]>([])
    const [topic, setTopic] = useState<any | null>(null)
    const [state, setState] = useState({
        role: RAID_ROLES[0],
        text: '',
        format: INCIDENT_TYPES[0],
        race: INCIDENT_RACES[0],
        title: '',
        category: TOPIC_TYPES[0],
        url: ''
    })

    const centum = new Centum()

    const {role, text, format, race, title, category, url} = state

    const [getRaid] = useMutation(getRaidM, {
        onCompleted(data) {
            setRaid(data.getRaid)
        }
    })

    const [manageRaidStatus] = useMutation(manageRaidStatusM, {
        onCompleted(data) {
            ModernAlert(data.manageRaidStatus)
        }
    })

    const [makeRaidIncident] = useMutation(makeRaidIncidentM, {
        onCompleted(data) {
            ModernAlert(data.makeRaidIncident)
        }
    })

    const [manageRaidTopic] = useMutation(manageRaidTopicM, {
        onCompleted(data) {
            ModernAlert(data.manageRaidTopic)
        }
    })

    useEffect(() => {
        if (context.account_id !== '') {
            getRaid({
                variables: {
                    shortid: id
                }
            })
        }
    }, [context.account_id])

    useMemo(() => {
        if (raid !== null) {
            let result = raid.members.find(el => centum.search(el.account_id, context.account_id, SEARCH_PERCENT))

            if (result !== undefined) {
                setPersonality(result)
            }

            setCords(raid.cords)         
        }
    }, [raid])

    useMemo(() => {
        if (personality !== null) {
            setState({...state, role: personality.role})
        }
    }, [personality])

    useMemo(() => {
        setView({...view, latitude: cords.lat, longitude: cords.long, zoom: 16})
    }, [cords])

    const onManageStatus = (option: string) => {
        manageRaidStatus({
            variables: {
                username: context.username, id, option, role
            }
        })
    }

    const onMakeIncident = () => {
        makeRaidIncident({
            variables: {
                username: context.username, id, text, format, race, image, cords
            }
        })
    }

    const onManageTopic = (option: string) => {
        manageRaidTopic({
            variables: {
                username: context.username, id, option, title, category, url, coll_id: topic === null ? '' : topic.shortid
            }
        })
    }

    return (
        <>   
            {raid !== null && personality === null &&
                <>
                    <h1>Welcome to raid: {raid.title}</h1>

                    <RaidCommonInfo dateUp={raid.dateUp} time={raid.time} />

                    <select value={role} onChange={e => setState({...state, role: e.target.value})}>
                        {RAID_ROLES.map(el => <option value={el}>{el}</option>)}
                    </select> 

                    <button onClick={() => onManageStatus('join')}>Join</button>
                </>
            }       
            {raid !== null && personality !== null &&
                <>
                    <h1>{raid.title}</h1>

                    <RaidCommonInfo dateUp={raid.dateUp} time={raid.time} />

                    <select value={role} onChange={e => setState({...state, role: e.target.value})}>
                        {RAID_ROLES.map(el => <option value={el}>{el}</option>)}
                    </select> 

                    <button onClick={() => onManageStatus('update')}>Update</button>

                    {incident === null ? 
                            <>
                                <h2>New Incident</h2>

                                <textarea value={text} onChange={e => setState({...state, text: e.target.value})} placeholder='Describe it...' />

                                <div className='items small'>
                                    <select value={format} onChange={e => setState({...state, format: e.target.value})}>
                                        {INCIDENT_TYPES.map(el => <option value={el}>{el}</option>)}
                                    </select> 
                                    <select value={race} onChange={e => setState({...state, race: e.target.value})}>
                                        {INCIDENT_RACES.map(el => <option value={el}>{el}</option>)}
                                    </select>
                                </div>

                                <ImageLoader setImage={setImage} />

                                <button onClick={onMakeIncident}>Publish</button>

                                <DataPagination initialItems={raid.incidents} setItems={setIncidents} label='Map of Incidents:' />
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setIncident(null)} />

                                {incident.image !== '' && <ImageLook src={incident.image} className='photo_item' alt='incident photo' />}

                                <p>Text: {incident.text}</p>

                                <div className='items small'>
                                    <h4 className='pale'>Type: {incident.format}</h4>
                                    <h4 className='pale'>Race: {incident.race}</h4>
                                </div>
                            </>
                    }

                    <ReactMapGL onClick={e => setCords(centum.mapboxCords(e))} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                        <Marker latitude={raid.cords.lat} longitude={raid.cords.long}>
                            <MapPicker type='home' />
                        </Marker>

                        <Marker latitude={cords.lat} longitude={cords.long}>
                            <MapPicker type='picker' />
                        </Marker>

                        {raid.dots.map(el => 
                            <Marker latitude={el.lat} longitude={el.long}>
                                <b>*</b>
                            </Marker>
                        )}

                        {incidents.map(el => 
                            <Marker onClick={() => setIncident(el)} latitude={el.cords.lat} longitude={el.cords.long}>
                                {centum.shorter(el.text)}
                            </Marker>
                        )}
                    </ReactMapGL> 

                    <button onClick={() => onManageStatus('exit')} className='light'>Exit</button>

                    {topic === null ?
                            <>
                                <h2>New Topic</h2>

                                <textarea value={title} onChange={e => setState({...state, title: e.target.value})} placeholder='What will be discussed...' />

                                <h4 className='pale'>Theme</h4>
                                <div className='items small'>
                                    {TOPIC_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={el === category ? 'item label active' : 'item label'}>{el}</div>)}
                                </div>

                                <input value={url} onChange={e => setState({...state, url: e.target.value})} placeholder='URL of topic' type='text' />

                                <button onClick={() => onManageTopic('create')}>Offer</button>

                                <DataPagination initialItems={raid.topics} setItems={setTopics} label='List of Topics:' />

                                <div className='items half'>
                                    {topics.map(el => 
                                        <div onClick={() => setTopic(el)} className='item panel'>
                                            {centum.shorter(el.title)}
                                        </div>    
                                    )}
                                </div>
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setTopic(null)} />

                                <h2>{topic.title}</h2>

                                <div className='items small'>       
                                    <h4 className='pale'>Theme: {topic.category}</h4>
                                    <h4 className='pale'><b>{topic.likes}</b> likes</h4>
                                </div>

                                {topic.name === context.username ? 
                                        <button onClick={() => onManageTopic('delete')}>Delete</button>
                                    :
                                        <button onClick={() => onManageTopic('like')}>Like</button>
                                }
                            </>
                    }
                </>
            }
            {raid === null && <Loading />}
        </>
    )
}

export default Raid