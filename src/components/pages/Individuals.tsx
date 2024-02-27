import React, {useState, useMemo, useEffect, useContext} from 'react'
import ReactMapGL, {Marker} from 'react-map-gl'
import {useQuery} from '@apollo/client'
import Centum from 'centum.js'
import {INDIVIDUAL_TYPES, SEARCH_PERCENT, PROJECT_TITLE, VIEW_CONFIG, token} from '../../env/env'
import {gain} from '../../store/localstorage'
import {Context} from '../../context/WebProvider'
import NavigatorWrapper from '../router/NavigatorWrapper'
import MapPicker from '../UI/MapPicker'
import DataPagination from '../UI/DataPagination'
import Loading from '../UI/Loading'
import {getIndividualsQ} from '../../graphql/pages/IndividualPageQueries'
import {TownType, Cords} from '../../types/types'

const Individuals: React.FC = () => {
    const {context} = useContext<any>(Context)
    const [view, setView] = useState(VIEW_CONFIG)
    const [towns] = useState<TownType[]>(gain())
    const [fullname, setFullname] = useState<string>('')
    const [category, setCategory] = useState<string>(INDIVIDUAL_TYPES[0])
    const [region, setRegion] = useState<string>(towns[0].title)
    const [cords, setCords] = useState<Cords>(towns[0].cords)
    const [individuals, setIndividuals] = useState<any[] | null>(null)
    const [filtered, setFiltered] = useState<any[]>([])

    const centum = new Centum()

    const {data, loading} = useQuery(getIndividualsQ)

    useEffect(() => {
        if (data && context.account_id !== '') {
            setIndividuals(data.getIndividuals)
           
            centum.title('Individuals', PROJECT_TITLE)
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
        if (individuals !== null) {
            let result: any[] = individuals.filter(el => el.region === region)

            if (fullname !== '') {
                result = result.filter(el => centum.search(el.fullname, fullname, SEARCH_PERCENT, true))
            }

            result = result.filter(el => el.category === category)

            setFiltered(result)
        }   
    }, [individuals, fullname, category, region])

    return (
        <>          
            <h1>Find Individual</h1>

            <div className='items small'>
                <div className='item'>
                    <h4 className='pale'>Fullname</h4>
                    <input value={fullname} onChange={e => setFullname(e.target.value)} placeholder='Fullname of person' type='text' />
                </div>
                <div className='item'>
                    <h4 className='pale'>Location</h4>
                    <input value={region} onChange={e => setRegion(e.target.value)} placeholder='Nearest town' type='text' />
                </div>
            </div>

            <h4 className='pale'>Type</h4>
            <div className='items small'>
                {INDIVIDUAL_TYPES.map(el => <div onClick={() => setCategory(el)} className={el === category ? 'item label active' : 'item label'}>{el}</div>)}
            </div>

            <DataPagination initialItems={filtered} setItems={setFiltered} label='Map of Individuals:' />

            {data &&
                <ReactMapGL onClick={e => setCords(centum.mapboxCords(e))} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                    <Marker latitude={cords.lat} longitude={cords.long}>
                        <MapPicker type='picker' />
                    </Marker>

                    {filtered.map(el => 
                        <Marker latitude={el.cords.lat} longitude={el.cords.long}>
                            <NavigatorWrapper url={`/individual/${el.shortid}`} isRedirect={false}>
                                {centum.shorter(el.fullname)}
                            </NavigatorWrapper>
                        </Marker>
                    )}
                </ReactMapGL> 
            }
            {loading && <Loading />}
        </>
    )
}

export default Individuals