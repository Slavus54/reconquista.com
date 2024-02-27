import React, {useState, useMemo, useEffect, useContext} from 'react'
import ReactMapGL, {Marker} from 'react-map-gl'
import {useQuery} from '@apollo/client'
import Centum from 'centum.js'
import {SEARCH_PERCENT, PROJECT_TITLE, VIEW_CONFIG, token} from '../../env/env'
import {gain} from '../../store/localstorage'
import {Context} from '../../context/WebProvider'
import NavigatorWrapper from '../router/NavigatorWrapper'
import MapPicker from '../UI/MapPicker'
import DataPagination from '../UI/DataPagination'
import Loading from '../UI/Loading'
import {getProfilesQ} from '../../graphql/pages/ProfilePageQueries'
import {TownType, Cords} from '../../types/types'

const Profiles: React.FC = () => {
    const {context} = useContext<any>(Context)
    const [view, setView] = useState(VIEW_CONFIG)
    const [towns] = useState<TownType[]>(gain())
    const [username, setUsername] = useState<string>('')
    const [region, setRegion] = useState<string>(towns[0].title)
    const [cords, setCords] = useState<Cords>(towns[0].cords)
    const [profiles, setProfiles] = useState<any[] | null>(null)
    const [filtered, setFiltered] = useState<any[]>([])

    const centum = new Centum()

    const {data, loading} = useQuery(getProfilesQ)

    useEffect(() => {
        if (data && context.account_id !== '') {
            setProfiles(data.getProfiles)
           
            centum.title('Profiles', PROJECT_TITLE)
            centum.favicon('favicon-pages')
        }
    }, [data])

    useMemo(() => {
        if (region !== '') {
            let result = towns.find(el => centum.search(el.title, region, SEARCH_PERCENT, true)) 
    
            if (result !== undefined) {
                setRegion(result.title)
                setCords(result.cords)
            }           
        }
    }, [region])

    useMemo(() => {
        setView({...view, latitude: cords.lat, longitude: cords.long, zoom: 16})
    }, [cords])

    useMemo(() => {
        if (profiles !== null) {
            let result: any[] = profiles.filter(el => el.region === region)

            if (username !== '') {
                result = result.filter(el => centum.search(el.username, username, SEARCH_PERCENT, true))
            }

            setFiltered(result)
        }   
    }, [profiles, username, region])

    return (
        <>          
            <h1>Find Individual</h1>

            <div className='items small'>
                <div className='item'>
                    <h4 className='pale'>Name</h4>
                    <input value={username} onChange={e => setUsername(e.target.value)} placeholder='Fullname' type='text' />
                </div>
                <div className='item'>
                    <h4 className='pale'>Location</h4>
                    <input value={region} onChange={e => setRegion(e.target.value)} placeholder='Nearest town' type='text' />
                </div>
            </div>

            <DataPagination initialItems={filtered} setItems={setFiltered} label='Map of Profiles:' />

            {data &&
                <ReactMapGL onClick={e => setCords(centum.mapboxCords(e))} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                    <Marker latitude={cords.lat} longitude={cords.long}>
                        <MapPicker type='picker' />
                    </Marker>

                    {filtered.map(el => 
                        <Marker latitude={el.cords.lat} longitude={el.cords.long}>
                            <NavigatorWrapper id={el.account_id} isRedirect={true}>
                                {centum.shorter(el.username)}
                            </NavigatorWrapper>
                        </Marker>
                    )}
                </ReactMapGL> 
            }
            {loading && <Loading />}
        </>
    )
}

export default Profiles